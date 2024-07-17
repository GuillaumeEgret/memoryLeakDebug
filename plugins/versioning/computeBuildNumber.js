/**
 * The build number / version code is defined as a combination of the app version and the runtime version to respect store requirements:
 * - Android: It must change between each upload (not necessarily increase), and the highest number will be installed (so in practice it must increase)
 * - iOS: It must increase between builds with the same appVersion / versionNumber
 * - Android: max value is 2100000000
 *
 * @see https://developer.apple.com/library/archive/technotes/tn2420/_index.html
 * @see https://developer.android.com/studio/publish/versioning
 * @see https://developer.android.com/google/play/publishing/multiple-apks#VersionCodes
 *
 * @param {string} appVersion
 * @param {string} runtimeVersion
 * @returns {number}
 */
const computeBuildNumber = (appVersion, runtimeVersion) => {
  const [major, minor, patch] = appVersion.split(".");

  if (!major || !minor || !patch) {
    throw new Error(
      `Invalid app version, expected format x.y.z, got ${appVersion}`,
    );
  }

  if (major > 99 || minor > 99 || patch > 99) {
    throw new Error(
      `Invalid app version, max value for each part is 99, got ${appVersion}`,
    );
  }

  /*
   * Each part is padded to 2 digits, so the build number will always increase (see tests for examples)
   * ⚠️ This allows for each part to go from 0 to 99, but not 100 or more
   */
  return parseInt(
    `${pad(major)}${pad(minor)}${pad(patch)}${runtimeVersion}`,
    10,
  );
};
exports.computeBuildNumber = computeBuildNumber;
/**
 *
 * @param {number} num
 * @returns string
 */
const pad = (num) => {
  return String(num).padStart(2, "0");
};
