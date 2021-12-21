import os from "os";
import dgram from "dgram";
import { BrowserWindow } from "electron";

const UDP_PORT = 4400;
const udp = dgram.createSocket("udp4");

export default function startUdp(window: BrowserWindow) {
  udp.on("connect", handleConnect);
  udp.on("close", handleClose);
  udp.on("message", (message) => console.log(message));

  function handleClose() {
    window.webContents.send("closed", Date.now());
  }

  function handleConnect() {
    window.webContents.send("connected", Date.now());
  }

  function sendAddressInfo(addresses: { home: string; addresses: string[] }) {
    window.webContents.send("connected", addresses);
  }

  udp.bind(UDP_PORT, () => {
    console.log("UDP started at ", UDP_PORT);
    const addresses = getIpAddresses();
    const home = "127.0.0.1";

    sendAddressInfo({ home, addresses });
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
