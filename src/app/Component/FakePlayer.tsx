import React, { useEffect } from "react";
import { Button, Text, View } from "react-native";

import type { FakeEvent } from "#app/eventEmitter";
import { eventEmitter } from "#app/eventEmitter";
import { t } from "#shared/i18n";

const randomEvent = (): FakeEvent => {
  const events: FakeEvent[] = ["eventA", "eventB", "eventC"];
  const randomIndex = Math.floor(Math.random() * events.length);
  const event = events[randomIndex];

  // Ensure the event is always a valid FakeEvent
  if (event === undefined) {
    throw new Error("Generated an undefined event");
  }
  return event;
};

export const FakePlayer = () => {
  const onPressA = () => {
    setInterval(() => {
      eventEmitter.emit("FakeEvent", {
        eventType: randomEvent(),
        eventData: new Uint8Array(1024 * 1024 * 500),
      });
    }, 50);
  };

  const [mem, setMem] = React.useState(
    // @ts-ignore
    window.performance.memory.usedJSHeapSize,
  );

  useEffect(() => {
    const a = setInterval(() => {
      // @ts-ignore
      setMem(window.performance.memory.usedJSHeapSize);
    }, 333);
    return () => clearInterval(a);
  }, []);

  return (
    <React.Fragment>
      <View style={{ position: "absolute", top: 0, left: 100 }}>
        <Text>Used Memory : {mem}</Text>
      </View>
      <Button title={t("Start sending events")} onPress={onPressA} />
    </React.Fragment>
  );
};
