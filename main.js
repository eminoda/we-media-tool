/**
 * app: 应用的引用对象，有各种事件 Event 可以监听
 * BrowserWindow: 启动后所看到的的窗口
 */
const { app, BrowserWindow, Menu } = require('electron');
const menus = require('./menus');
const ipc = require('./ipc');

// 创建窗口
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
    },
  });
  win.webContents.openDevTools();
  // 加载本地页面
  win.loadFile('index.html');
};

// 打开窗口
app.whenReady().then(() => {
  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
  ipc();
  createWindow();
});

// 关闭窗口
app.on('window-all-closed', () => {
  // 命令行退出
  if (process.platform !== 'darwin') app.quit();
});
