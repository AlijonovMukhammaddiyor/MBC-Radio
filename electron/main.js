const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const url = require("url");

let window = null;

const createWindow = () => {
  window = new BrowserWindow({
    height: 1080,
    width: 1920,
    maxWidth: 1500,
    maxHeight: 961,
    minWidth: 400,
    miHeight: 100,
    icon: __dirname + "./home_icon.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  const startURL = app.isPackaged
    ? url.format({ pathname: path.join(__dirname, "../build/index.html") })
    : "http://localhost:3000";
  window.loadURL(startURL);

  window.on("closed", () => {
    window = null;
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  if (!app.isPackaged) {
    window.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
