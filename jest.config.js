/**
 * Code in the react-native ecosystem if often shipped untransformed, with flow or typescript in files
 * App code also needs to be transformed (it's TypeScript), but the rest of node_modules doesn't need to
 * Transforming the minimum amount of code makes tests run much faster
 *
 * If encountering a syntax error during tests with a new package, add it to this list
 */
const packagesToTransform = [
  "react-native",
  "react-native-(.*)",
  "@react-native",
  "@react-native-community",
  "@react-navigation",
  "expo",
  "expo-(.*)",
];

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  /*
   * What the preset provides:
   * - a transformer to handle media assets (png, video)
   * - lots of mocks for react-native and expo modules
   */
  preset: "jest-expo",
  // test environment setup
  globalSetup: "<rootDir>/src/testing/jest-globalSetup.ts",
  setupFiles: ["./src/testing/jest-setup.ts"],
  setupFilesAfterEnv: ["./src/testing/jest-setupAfterEnv.ts"],
  clearMocks: true,
  // module resolution
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePaths: ["<rootDir>"],
  testRegex: "\\.test\\.[jt]sx?$",
  // module transformation
  transform: {
    // NOTE: If your projects uses special babel plugins, you'll need to go back to the slower default babel-jest setup
    "\\.[jt]sx?$": ["@sucrase/jest-plugin", { jsxRuntime: "automatic" }],
  },
  transformIgnorePatterns: [
    `node_modules/(?!(${packagesToTransform.join("|")})/)`,
  ],
  cacheDirectory: ".cache/jest",
  // coverage
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  // tools
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
  reporters: ["default", "github-actions"], // Remove this line if your CI is not on Github actions
  snapshotResolver: "./jestSnapshotResolver.js",
};

module.exports = config;
