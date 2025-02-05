import EventEmitter from "eventemitter3";

export const eventEmitter = new EventEmitter();
export type FakeEvent = "eventA" | "eventB" | "eventC";
