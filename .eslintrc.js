// @ts-check

const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  extends: [
    // see source: https://github.com/bamlab/react-native-project-config/blob/main/packages/eslint-plugin/lib/configs/recommended.js
    "plugin:@bam.tech/recommended",
  ],
  overrides: [
    {
      // test files
      files: ["**/*.test.ts", "**/*.test.tsx", "__mocks__/**", "**/jest-*"],
      extends: "plugin:@bam.tech/tests",
      rules: {
        "jest/no-restricted-matchers": [
          "error",
          {
            toMatchSnapshot:
              "Use toMatchComponentSnapshot for components and toMatchInlineSnapshot otherwise",
          },
        ],
      },
    },
  ],
});
