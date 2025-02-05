import { Button } from "react-native";

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
  return <Button title={t("Start sending events")} onPress={onPressA} />;
};
