import os from "os";
import dgram from "dgram";
import { MessagePortMain } from "electron";

const UDP_PORT = 4400;
const udp = dgram.createSocket("udp4");

export default function startUdp(port: MessagePortMain) {
  udp.on("connect", handleConnect);
  udp.on("close", handleClose);
  udp.on("message", (message) => port.postMessage(message));

  function handleClose() {
    port.postMessage(Date.now());
  }

  function handleConnect() {
    port.postMessage(Date.now());
  }

  udp.bind(UDP_PORT, () => {
    console.log("UDP started at ", UDP_PORT);
    const addresses = getIpAddresses();
    const home = "127.0.0.1";

    port.postMessage([home, ...addresses]);
  });
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
