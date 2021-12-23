import os from "os";
import dgram from "dgram";
import { MessagePortMain } from "electron";
import translateMessage from "./lib/translateMessage";

export type TranslatedTuple = ReturnType<typeof translateMessage>[number];

export type DataOut = {
  [key in TranslatedTuple[0]]: TranslatedTuple[1];
};

const UDP_PORT = 4400;
const udp = dgram.createSocket("udp4");

export default function startUdp(port: MessagePortMain) {
  udp.on("connect", handleConnect);
  udp.on("close", handleClose);
  udp.on("message", handleMessage);

  udp.bind(UDP_PORT, () => {
    console.log("UDP started at ", UDP_PORT);
    const addresses = getIpAddresses();
    const home = "127.0.0.1";

    port.postMessage({ event: "address", data: [home, ...addresses] });
  });

  function handleClose() {
    port.postMessage(Date.now());
  }

  function handleConnect() {
    port.postMessage(Date.now());
  }

  function handleMessage(message: Buffer) {
    const translatedTuples = translateMessage(message);
    const data: DataOut = Object.fromEntries(translatedTuples);

    if (data.isRaceOn) {
      port.postMessage({
        event: "data-out",
        data,
      });
    }
  }
}

function getIpAddresses() {
  const interfaces = os.networkInterfaces();
  const ip4Adresses = Object.values(interfaces)
    .flat()
    .filter(
      (entry) => entry?.family === "IPv4" && entry.address !== "127.0.0.1"
    )
    .map((entry) => entry?.address ?? "");
  return ip4Adresses;
}
