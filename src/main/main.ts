import { app, BrowserWindow, MessageChannelMain } from "electron";
import path from "path";
import startUdp from "./createUdp";

const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000/"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }

  return win;
}

app.whenReady().then(() => {
  const window = createWindow();
  const { port1, port2 } = new MessageChannelMain();

  let started = false;
  port2.postMessage("Hello from Main!");

  port2.on("message", (event) => {
    if (!started) {
      startUdp(port2);
      started = true;
    }
    console.log("from renderer main world:", event.data);
  });
  port2.start();

  window.webContents.postMessage("main-world-port", null, [port1]);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
