const { app, BrowserWindow, shell } = require("electron");
const path = require("path");
const url = require("url");

let window = null;

const createWindow = () => {
  window = new BrowserWindow({
    height: 1080,
    width: 1920,
    // maxWidth: 1500,
    // maxHeight: 961,
    // minWidth: 400,
    // miHeight: 100,
    icon: __dirname + "./home_icon.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  const startURL = app.isPackaged
    ? url.format({
      pathname: path.join(__dirname, "../build/index.html"), protocol: 'file:',
      slashes: true,
    })
    : "http://localhost:3000";
  window.loadURL(startURL);

  window.on('ready-to-show', () => {
    if (!window) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      window.minimize();
    } else {
      window.show();
    }
  });

  window.on("closed", () => {
    window = null;
  });

  window.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  if (!app.isPackaged) {
    window.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createWindow();


}).catch(console.log);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
