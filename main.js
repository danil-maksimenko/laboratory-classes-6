const { app, BrowserWindow } = require("electron");
const path = require("path");
const http = require("http");
const { spawn } = require("child_process");
const { PORT } = require("./config");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  const serverURL = `http://localhost:${PORT}`;

  const waitForServer = () => {
    http
      .get(serverURL, () => {
        mainWindow.loadURL(serverURL);
      })
      .on("error", () => {
        setTimeout(waitForServer, 300);
      });
  };

  waitForServer();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  spawn("npm", ["start"], {
    shell: true,
    stdio: "inherit",
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
