import Constants from "expo-constants";

import type { AppEnv } from "../../app.config";

const maybeAppEnv = Constants.expoConfig?.extra?.["appEnv"];

if (!maybeAppEnv) {
  // eslint-disable-next-line no-console
  console.dir(Constants.expoConfig, { depth: null });
  throw new Error("appEnv is missing");
}

/*
 * *Modifications to the env should be made in app.config.ts*
 *
 * The right env is then injected by expo.
 * This file is just there to give easy access to a typed appEnv in app code
 */

export const appEnv = maybeAppEnv as AppEnv;
