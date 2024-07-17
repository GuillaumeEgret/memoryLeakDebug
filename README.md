# Joconde

**👋 Welcome! You can follow this document to ensure your environment is setup correctly and discover the tools that are available on the project.**

## Setup your environment

If your computer is not already setup for React Native dev, follow the Android and iOS tabs of the official documentation here: [React Native - Environment Setup](https://reactnative.dev/docs/set-up-your-environment)

## Check the node version

```sh
node -v
```

✅ The version should match the one defined in [.nvmrc](./.nvmrc)

Otherwise, check that nvm/fnm is installed and set up to automatically switch to the correct version.

## Check the Java version

```sh
java -v
```

✅ The version should be 17

Otherwise, [follow the setup of react-native for Java Development Kit](https://reactnative.dev/docs/environment-setup).

## Setup your simulators/emulators

### iOS

We recommended using a big simulator as a default (like iPhone 15 Pro Max), you can then test for small screens using [`react-native-screen-sizer`](https://github.com/bamlab/react-native-screen-sizer)

Go to `Settings` > `General` > `Language and Region` and set `Region` to `France` and the primary language `to` Français to get a behavior that matches what most of our users will see.

## Run the app in a simulator

```sh
# Download the node modules
yarn

# Build for development
yarn ios
yarn android

# Start the bundler for the JS layer
yarn start
```

## Run the tests

```sh
yarn test:jest
```

✅ Jest starts in watch mode

Have a look at [`src/testing/jest-setupAfterEnv.ts`](./src/testing/jest-setupAfterEnv.ts) to know which mocks are set up by default.

## Run linting & typechecking

This will show errors in VS Code's problems tab for the whole project, not only the files you have open (useful when eg. refactoring):

- `cmd+shift+p` > `Run test task` > `Lint`
- `cmd+shift+p` > `Run test task` > `Typecheck`

```sh
yarn test:lint
yarn test:types
```

## Test native changes locally

Do a local build of the native layer:

```sh
yarn prebuild

yarn ios
yarn android
```

Commit the change automatically made to `RUNTIME_VERSION` if and only if you want native builds to be triggered when merging your changes

## Use debugging tools

### JS debugger

- Open the dev menu in the simulator
- Tap "Open JS debugger"

✅ The Chrome debugger opens

✅ You can navigate the code and set a breakpoint

### VS Code debugger for tests

- `cmd+shift+p` > `Javascript debug terminal`
- Put a breakpoint in a test file
- Start the tests with `yarn test:jest`

✅ The VS Code debugger opens

✅ The tests stop at the breakpoint
