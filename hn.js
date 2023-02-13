const puppeteer = require('puppeteer');
const chalk = require('chalk');

const config = {
  weixin: {
    login: 'https://mp.weixin.qq.com/',
    home: 'https://mp.weixin.qq.com/cgi-bin/home',
    post: 'https://mp.weixin.qq.com/cgi-bin/appmsg',
  },
  toutiao: {
    login: '',
    home: '',
    post: '',
  },
};
(async (end) => {
  const { login, home, post } = config[end];
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--window-size=1400,1000'],
    defaultViewport: { width: 1400, height: 900 },
  });
  browser.on('disconnected', (target) => {
    target.close();
  });
  const page = await browser.newPage();
  // await page.setViewport({ width: 1400, height: 900 });
  const pages = await browser.pages();
  if (pages.length > 1) {
    await pages[0].close();
  }

  console.log(chalk.green(`[navigate] ${login}`));
  await page.goto(`${login}`, {});

  page.on('response', async (response) => {
    const url = response.url();
    const headers = response.headers();
    // 微信首页
    if (url.indexOf(`${home}`) !== -1 && headers['content-type'] == 'text/html; charset=UTF-8') {
      console.log(chalk.green(`[navigate] ${home}`));
      // 去添加新文章
      await page.waitForSelector('.new-creation__menu-item');
      const createPostBtnSelector = '.new-creation__menu-item:nth-child(1)';
      page.click(createPostBtnSelector);

      console.log(chalk.green('[click] 创建图文'));
    }
  });
  // 新 tab 页监听
  browser.on('targetcreated', async (target) => {
    const url = target.url();
    // 微信图文创建
    if (url.indexOf(`${post}`) !== -1) {
      console.log(chalk.green(`[navigate] ${post}`));

      const page = await target.page();
      page.on('load', async () => {
        // 设置标题
        console.log(chalk.green('[write] 填写标题'));
        await page.waitForSelector('textarea[id="title"]');
        await page.click('textarea[id="title"]');
        await page.keyboard.sendCharacter('标题');

        // 设置作者
        console.log(chalk.green('[write] 填写作者'));
        await page.waitForSelector('input[id="author"]');
        await page.click('input[id="author"]');
        await page.keyboard.sendCharacter('作者');

        // 复制文章
        const frames = await page.frames();
        for (let frame of frames) {
          const isExistEduitor = await frame.$('#ueditor_0');
          if (isExistEduitor) {
            console.log(chalk.green('[write] 填写文章'));
            await frame.focus('#ueditor_0');
            await page.keyboard.down('Control');
            await page.keyboard.down('KeyV');
            await page.keyboard.up('Control');
          }
        }
        await browser.close();
      });
    }
  });
})('weixin');
