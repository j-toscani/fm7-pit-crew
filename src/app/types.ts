import { DataOutValue } from "../main/createUdp";

type MessageEventType = "closed" | "connected" | "dataout" | "address";
type MessageEventData<T> = {
  event: MessageEventType;
  value: T extends "address"
    ? string[]
    : T extends "dataout"
    ? DataOutValue
    : number;
};

export type UdpDataMessageEvent = MessageEvent & {
  data: MessageEventData<"dataout">;
};

export type UdpAddressMessageEvent = MessageEvent & {
  data: MessageEventData<"address">;
};

export type UdpStateMessageEvent = MessageEvent & {
  data: MessageEventData<"closed" | "connected">;
};

export type UdpMessageEventData =
  | UdpDataMessageEvent
  | UdpAddressMessageEvent
  | UdpStateMessageEvent;
