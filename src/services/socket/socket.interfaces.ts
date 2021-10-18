import ChatEvent from "./events/ChatEvent";

export type EventConstructor = new (nombre:string) => ChatEvent;