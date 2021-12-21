import { app, BrowserWindow } from "electron";
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
  startUdp(window);

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
