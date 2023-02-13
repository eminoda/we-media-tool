const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/image/preview', async (req, res) => {
  const hexoDirtory = __dirname;
  const filePath = path.join(hexoDirtory, decodeURIComponent(req.query.filename));
  fs.createReadStream(filePath).pipe(res);
});
app.get('/image/base64', async (req, res) => {
  const hexoDirtory = __dirname;
  const filePath = path.join(hexoDirtory, decodeURIComponent('2.png' || req.query.filename));
  console.log(filePath);
  // 读取本地图片，准备404图片
  const imageBuffer = fs.readFileSync(filePath);
  // 解析本地图片类型
  const mimeStr = mime.lookup(filePath);
  // 转换base64
  const base64 = 'data:' + mimeStr + ';base64,' + imageBuffer.toString('base64');
  res.send(base64);
});
app.get('/mock', async (req, res) => {
  res.send(fs.readFileSync('./test.md'));
});
module.exports = app;
