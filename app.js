const electron = require('electron');
const { app } = electron;

const { BrowserWindow } = electron;

app.on('ready', () => {
  let mainWindow = new BrowserWindow({
    frame: true,
    autoHideMenuBar: false,
  });
  //mainWindow.loadURL('http://rpg.mo.ee/');
  mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
  mainWindow.on('closed', () => {
    // Deref mainWindow
    mainWindow = null;
    app.quit();
  });
  const site = mainWindow.webContents;
  site.addListener('dom-ready',() => {
    console.log("Website loaded");
    site.executeJavaScript('console.log("Website Loaded!")');
  });
});
