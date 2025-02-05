import { useCallback, useEffect, useState } from "react";

import { eventEmitter } from "#app/eventEmitter";

export const useAnalytics = () => {
  const [nbEventA, setNbEventA] = useState(0);
  const [nbEventB, setNbEventB] = useState(0);
  const [nbEventC, setNbEventC] = useState(0);
  const [lastData, setLastData] = useState<Uint8Array | null>(null);

  // mettre un toast tous les X events pour avoir une bonne dépendance fonctionnelle des states
  const handleEventA = useCallback(
    (eventData: Uint8Array) => {
      console.log("nbEventA", nbEventA);
      setNbEventA((prec) => prec + 1);
      setLastData(eventData);
    },
    [nbEventA],
  );

  const handleEventB = useCallback(
    (eventData: Uint8Array) => {
      console.log("nbEventB", nbEventB);
      setNbEventB((prec) => prec + 1);
      setLastData(eventData);
    },
    [nbEventB],
  );

  const handleEventC = useCallback(
    (eventData: Uint8Array) => {
      console.log("nbEventC", nbEventC);
      setNbEventC(nbEventC + 1);
      setLastData(eventData);
    },
    [nbEventC],
  );

  // const memoryLeak = () => {
  //   console.log("Memory leak", lastData?.length);
  // };

  useEffect(() => {
    eventEmitter.addListener("FakeEvent", (event) => {
      switch (event.eventType) {
        case "eventA":
          handleEventA(event.eventData);
          break;
        case "eventB":
          handleEventB(event.eventData);
          break;
        case "eventC":
          handleEventC(event.eventData);
          break;
        default:
          console.error("Received an unknown event");
          break;
      }
    });
    return () => {
      eventEmitter.removeAllListeners("FakeEvent");
    };
  }, [handleEventA, handleEventB, handleEventC]);
};
