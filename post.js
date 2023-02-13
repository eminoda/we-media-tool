const puppeteer = require('puppeteer');
const chalk = require('chalk');

const config = {
  weixin: {
    URL_LOGIN: 'https://mp.weixin.qq.com/',
    URL_HOME: 'https://mp.weixin.qq.com/cgi-bin/home',
    URL_POST: 'https://mp.weixin.qq.com/cgi-bin/appmsg',
    $$LEFT_MENUS: '.new-creation__menu-item',
    $NEW_POST_MENU: '.new-creation__menu-item:nth-child(1)',
    $POST_TITLE: 'textarea[id="title"]',
    $POST_AUTHOR: 'input[id="author"]',
    $POST_CONTENT: '#ueditor_0',
  },
  toutiao: {
    URL_LOGIN: '',
    URL_HOME: '',
    URL_POST: '',
  },
};

module.exports = async (end) => {
  const { URL_LOGIN, URL_HOME, URL_POST, $$LEFT_MENUS, $NEW_POST_MENU, $POST_TITLE, $POST_AUTHOR, $POST_CONTENT } = config[end];
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
    // defaultViewport: { width: 1400, height: 900 },
    defaultViewport: null,
    ignoreDefaultArgs: ['--enable-automation'],
  });
  browser.on('disconnected', () => {
    browser.close();
  });
  // 为何会有2个about:blank
  const page = (await browser.pages())[0]; //await browser.newPage();

  console.log(chalk.green(`[navigate] ${URL_LOGIN}`));

  await page.goto(`${URL_LOGIN}`, {});

  page.on('response', async (response) => {
    const url = response.url();
    const headers = response.headers();
    // 微信首页
    if (url.indexOf(`${URL_HOME}`) !== -1 && headers['content-type'] == 'text/html; charset=UTF-8') {
      console.log(chalk.green(`[navigate] ${URL_HOME}`));
      // 去添加新文章
      await page.waitForSelector($$LEFT_MENUS);
      page.click($NEW_POST_MENU);
      console.log(chalk.green('[click] 创建图文'));
    }
  });
  // 新 tab 页监听
  browser.on('targetcreated', async (target) => {
    const url = target.url();
    // 微信图文创建
    if (url.indexOf(`${URL_POST}`) !== -1) {
      console.log(chalk.green(`[navigate] ${URL_POST}`));

      const page = await target.page();
      page.on('load', async () => {
        // 设置标题
        console.log(chalk.green('[write] 填写标题'));
        await page.waitForSelector($POST_TITLE);
        await page.click($POST_TITLE);
        await page.keyboard.sendCharacter('标题');

        // 设置作者
        console.log(chalk.green('[write] 填写作者'));
        await page.waitForSelector($POST_AUTHOR);
        await page.click($POST_AUTHOR);
        await page.keyboard.sendCharacter('作者');

        // 复制文章
        const frames = await page.frames();
        for (let frame of frames) {
          const isExistEduitor = await frame.$($POST_CONTENT);
          if (isExistEduitor) {
            console.log(chalk.green('[write] 填写文章'));
            await frame.focus($POST_CONTENT);
            await page.keyboard.down('Control');
            await page.keyboard.down('KeyV');
            await page.keyboard.up('Control');
          }
        }
        await browser.close();
      });
    }
  });
};
