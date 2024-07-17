import { screen } from "@testing-library/react-native";
import React from "react";
import { Text, View } from "react-native";

import { TEST_DEFAULT_DATE } from "#testing/constants";
import { renderWithProviders } from "#testing/render";

test("works with fake timers", async () => {
  let loading = true;
  let data: string | undefined = undefined;

  jest.setSystemTime(Date.now());
  const Suspending = () => {
    // eslint-disable-next-line jest/no-conditional-in-test
    if (loading)
      throw Promise.resolve("result").then((result) => {
        data = result;
        loading = false;
      });
    return <Text>{data}</Text>;
  };

  renderWithProviders(
    <View>
      <React.Suspense fallback={<Text>Loading</Text>}>
        <Suspending />
      </React.Suspense>
    </View>,
  );

  expect(await screen.findByText("result")).toBeOnTheScreen();
});

it("uses fake timers", () => {
  const callback = jest.fn();

  setTimeout(callback, 1000);

  expect(callback).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledWith();
});

describe("date is mocked", () => {
  it("uses a mocked date", () => {
    expect(new Date(Date.now()).toISOString()).toBe(TEST_DEFAULT_DATE);
  });

  it("allows overriding the mock in a given test", () => {
    jest.setSystemTime(1244);

    expect(Date.now()).toBe(1244);
  });

  it("and then it's back to the global mock in the next test", () => {
    expect(new Date(Date.now()).toISOString()).toBe(TEST_DEFAULT_DATE);
  });
});

describe("timezone is mocked", () => {
  it("is in the Europe/Paris timezone", () => {
    // On our computers this is obviously true, but in the CI it would fail without the mock
    expect(new Date().getTimezoneOffset()).toBe(-60);
  });
});
