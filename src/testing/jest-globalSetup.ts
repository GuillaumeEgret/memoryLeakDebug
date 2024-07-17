import { TEST_DEFAULT_TZ } from "./constants";

const globalSetup = () => {
  process.env.TZ = TEST_DEFAULT_TZ;
};

export default globalSetup;
