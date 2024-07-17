const path = require("path");
const fs = require("fs");
const child_process = require("child_process");
const { withDangerousMod } = require("expo/config-plugins");
const { withPlugins } = require("expo/config-plugins");
const { computeBuildNumber } = require("./computeBuildNumber");

/*
 * What does this plugin do?
 * - It sets "versioning fields" in the expo config based on the contents of `./config/APP_VERSION` and `./config/RUNTIME_VERSION`
 * - It automatically bumps the RUNTIME_VERSION when running `expo prebuild`
 *
 * 2 CI workflows that work with it should be configured:
 * - One that triggers dev/staging native builds when there's a change to `./config/RUNTIME_VERSION`
 * - One that triggers production native builds when there's a change to `./config/APP_VERSION`
 *
 *  **Usage (with the workflows above in place):**
 * - When making a native change, commit the bumped `RUNTIME_VERSION`. A native build will be triggered when it's merged
 * - To trigger a store release, bump `APP_VERSION` and merge the bump
 */

/**
 * Set all version fields
 * - version for iOS and Android, as defined in `./config/APP_VERSION`
 * - runtimeVersion, as defined in `./config/RUNTIME_VERSION` (and auto-bumped on prebuild)
 * - buildNumber/versionCode, computed from the runtimeVersion and appVersion
 * @type {import('@expo/config-plugins').ConfigPlugin}
 */
const withExpoConfigs = (config) => {
  const runtimeVersion = readOrCreateFile("./config/RUNTIME_VERSION", "0");
  const appVersion = readOrCreateFile("./config/APP_VERSION", "0.0.1");
  const buildNumber = computeBuildNumber(appVersion, runtimeVersion);

  config.version = appVersion;
  config.runtimeVersion = runtimeVersion;

  config.ios = {
    ...config.ios,
    buildNumber: String(buildNumber),
  };

  config.android = {
    ...config.android,
    versionCode: buildNumber,
  };

  return config;
};

/**
 * Automatically bump the runtime version when running `prebuild`
 * @type {import('@expo/config-plugins').ConfigPlugin}
 */
const withAutoBump = (_config) => {
  // The auto-bump should run only during dev
  if (process.env.CI) return _config;

  return withDangerousMod(_config, [
    "ios",
    (config) => {
      if (process.env.CI) {
        return config;
      }

      if (!isInGitRepo()) {
        // May happen in CI or with eas build --local. Don't bump version in this case
        return config;
      }

      if (getRuntimeVersionOnMain() !== config.runtimeVersion) {
        // Already bumped on this branch
        return config;
      }

      const newRuntimeVersion = parseInt(config.runtimeVersion, 10) + 1;

      writeRuntimeVersion(newRuntimeVersion);

      // eslint-disable-next-line no-console -- we want to log this
      console.log(
        `✔ Bumped RUNTIME_VERSION to ${newRuntimeVersion}. Commit the change to trigger a native build when merging`,
      );

      return config;
    },
  ]);
};

module.exports = (config) =>
  withPlugins(config, [withExpoConfigs, withAutoBump]);

/*
 * Utilities used by the plugins above
 */

/**
 *
 * @param {string} filePath relative to project root
 * @param {string} defaultValue
 * @returns {string} trimmed file content
 */
const readOrCreateFile = (filePath, defaultValue) => {
  const absolutePath = path.resolve(process.cwd(), filePath);

  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(filePath, defaultValue);
  }

  return fs.readFileSync(absolutePath, "utf-8").trim();
};

/**
 *
 * @param {string} currentRuntimeVersion
 */
const writeRuntimeVersion = (newRuntimeVersion) => {
  const absolutePath = path.resolve(process.cwd(), "./config/RUNTIME_VERSION");

  fs.writeFileSync(absolutePath, String(newRuntimeVersion));
};

const getRuntimeVersionOnMain = () => {
  const gitRoot = child_process
    .execSync("git rev-parse --show-toplevel")
    .toString()
    .trim();

  const filepathInGit = path.relative(gitRoot, "config/RUNTIME_VERSION");

  try {
    return child_process
      .execSync(`git show main:${filepathInGit}`)
      .toString()
      .trim();
  } catch (error) {
    // The file may not yet exist on main
    return undefined;
  }
};

const isInGitRepo = () => {
  try {
    child_process.execSync("git rev-parse --is-inside-work-tree");

    return true;
  } catch (error) {
    return false;
  }
};
