const { ipcMain } = require('electron');
const post = require('./post');

module.exports = () => {
  ipcMain.on('cmd', async (event, arg = {}) => {
    const { name, data } = arg;
    switch (name) {
      case 'say-hello':
        try {
          await post('weixin');
        } catch (err) {
          console.log(err);
        }
      // event.reply('cmd', { name: 'reply-hello', data: '[ipc main] reply' });
    }
  });
};
