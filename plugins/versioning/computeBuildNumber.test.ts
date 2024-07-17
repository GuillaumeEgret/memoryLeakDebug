import { computeBuildNumber } from "./computeBuildNumber";

// Each build number in the list should be > to the previous one
it.each`
  APP_VERSION  | RUNTIME_VERSION | BUILD_NUMBER
  ${"0.0.1"}   | ${"1"}          | ${11}
  ${"0.0.1"}   | ${"2"}          | ${12}
  ${"0.0.10"}  | ${"1"}          | ${101}
  ${"0.1.0"}   | ${"1"}          | ${1001}
  ${"0.1.10"}  | ${"1"}          | ${1101}
  ${"1.0.0"}   | ${"1"}          | ${100001}
  ${"1.1.0"}   | ${"1"}          | ${101001}
  ${"1.10.10"} | ${"1"}          | ${110101}
  ${"2.0.0"}   | ${"1"}          | ${200001}
  ${"5.9.0"}   | ${"63"}         | ${5090063}
  ${"6.0.0"}   | ${"63"}         | ${6000063}
`(
  "computes build number $BUILD_NUMBER for v$APP_VERSION and runtime $RUNTIME_VERSION",
  ({ APP_VERSION, RUNTIME_VERSION, BUILD_NUMBER }) => {
    expect(computeBuildNumber(APP_VERSION, RUNTIME_VERSION)).toEqual(
      BUILD_NUMBER,
    );
  },
);
