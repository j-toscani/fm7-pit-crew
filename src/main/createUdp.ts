import os from "os";
import fs from "fs";
import path from "path";
import dgram from "dgram";
import { MessagePortMain } from "electron";

import translateMessage from "./lib/translateMessage";
import options from "./lib/options";
export type TranslatedTuple = ReturnType<typeof translateMessage>[number];

export type DataOut = {
  [key in TranslatedTuple[0]]: TranslatedTuple[1];
};

const UDP_PORT = 4400;
const udp = dgram.createSocket("udp4");

export default function statUdp(communicationPort: MessagePortMain) {
  const { handleConnect, handleMessage, handleClose, handleStartup } =
    createUdpHandlers(communicationPort);

  udp.on("connect", handleConnect);
  udp.on("close", handleClose);
  udp.on("message", handleMessage);

  udp.bind(UDP_PORT, handleStartup);
}

function createUdpHandlers(port: MessagePortMain) {
  const stream = createDataWriteStream();
  stream.write(createTableHeader());
  const handleMessage = createHandleMessage(port, stream);

  function handleStartup() {
    const addresses = getIpAddresses();
    const home = "127.0.0.1";

    port.postMessage({ event: "address", data: [home, ...addresses] });
  }

  function handleClose() {
    port.postMessage(Date.now());
    stream.close();
  }

  function handleConnect() {
    port.postMessage(Date.now());
  }

  return {
    handleMessage,
    handleConnect,
    handleClose,
    handleStartup,
  };
}

function createHandleMessage(port: MessagePortMain, stream: fs.WriteStream) {
  return (message: Buffer) => {
    const translatedTuples = translateMessage(message);
    const data: DataOut = Object.fromEntries(translatedTuples);

    if (data.isRaceOn) {
      const line = translatedTuples.map((tuple) => tuple[1]).join(",") + "\n";
      const message = {
        event: "data-out",
        data,
      };

      port.postMessage(message);
      stream.write(line);
    }
  };
}

function createDataWriteStream(directory = "race_data") {
  const dirPath = path.resolve(__dirname, directory);
  const filePath = path.resolve(__dirname, directory, createFilename());
  const writeOptions = {
    flags: "a",
    autoClose: false,
  };

  try {
    fs.accessSync(dirPath, fs.constants.F_OK);
  } catch {
    fs.mkdirSync(dirPath);
  }
  return fs.createWriteStream(filePath, writeOptions);
}

function createFilename() {
  const formatter = new Intl.DateTimeFormat("de", {
    dateStyle: "short",
  });
  const now = new Date();
  return `${formatter
    .format(now)
    .replaceAll(".", "")}_${now.getHours()}${now.getMinutes()}.csv`;
}

function createTableHeader() {
  return options.map((option) => option.property).join(",") + "\n";
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
