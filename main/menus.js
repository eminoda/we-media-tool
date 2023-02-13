const { BrowserWindow } = require('electron');
/**
 * webContents: web 渲染窗口引用对象
 */
module.exports = [
  {
    label: '开发调试',
    submenu: [
      {
        label: '重启(Reload)',
        accelerator: 'CmdOrCtrl+R',
        click: () => {
          BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache();
        },
      },
      {
        label: '开发者工具(Toggle DevTools)',
        accelerator: 'F12',
        // accelerator: "Alt+CmdOrCtrl+I",
        click: () => {
          BrowserWindow.getFocusedWindow().toggleDevTools();
        },
      },
    ],
  },
];
