const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class AutoMedia {
  constructor(name = 'toutiao', options = {}) {
    this.name = name;
    const config = {
      weixin: {
        URL_LOGIN: 'https://mp.weixin.qq.com/',
        URL_HOME: 'https://mp.weixin.qq.com/cgi-bin/home',
        URL_POST: 'https://mp.weixin.qq.com/cgi-bin/appmsg',
        $NOT_LOGIN: '.icon_page_error',
        $LEFT_MENUS: '.new-creation__menu-item',
        $NEW_POST_MENU: '.new-creation__menu .new-creation__menu-item.creation_report:nth-of-type(2)',
        $POST_EDITOR: '.appmsg_editor',
        $POST_TITLE: 'textarea[id="title"]',
        $POST_AUTHOR: 'input[id="author"]',
        $POST_CONTENT: '#ueditor_0',
      },
      toutiao: {
        URL_LOGIN: 'https://mp.toutiao.com/auth/page/login',
        URL_HOME: 'https://mp.toutiao.com/profile_v4/index',
        URL_POST: 'https://mp.toutiao.com/profile_v4/graphic/publish',
        $NOT_LOGIN: '.web-login-button',
        $LEFT_MENUS: '.byte-menu-inline-content',
        $NEW_POST_MENU: '.byte-menu-inline-content .byte-menu-item:nth-of-type(1)',
        $POST_EDITOR: '.publish-editor',
        $POST_TITLE: '.editor-title textarea',
        $POST_AUTHOR: '',
        $POST_CONTENT: '.ProseMirror',
      },
    };
    ['URL_LOGIN', 'URL_HOME', 'URL_POST', '$NOT_LOGIN', '$LEFT_MENUS', '$NEW_POST_MENU', '$POST_TITLE', '$POST_EDITOR', '$POST_AUTHOR', '$POST_CONTENT'].forEach((key) => {
      this[key] = config[name][key];
    });
    this.browser = null;
    this.page = null;
    this.cookiePath = path.join(__dirname, './cookies.json');
    this.LOGIN_PENDING = false;
  }
  async start() {
    // 创建浏览器
    this.browser = await this._createBrowser();
    this.page = (await this.browser.pages())[0]; // 为何会有2个about:blank //await browser.newPage();
    // this.page = await this.browser.newPage();
    await this.appendCookies(this.page);
    // 访问主页
    await this.navigateTo(this.URL_HOME, this.page, {});
  }
  async navigateTo(url, page, options = {}) {
    console.log(chalk.green(`[navigate] ${url}`));
    page = page || this.page;
    await page.goto(url, options);
  }
  async _isLogin(page) {
    try {
      await page.waitForSelector(this.$NOT_LOGIN, { timeout: 3000 });
      return false;
    } catch (err) {
      return true;
    }
  }
  // 点击菜单，添加文章
  async toPost(page) {
    await page.waitForSelector(this.$LEFT_MENUS);
    console.log(chalk.green('[click] 创建图文'));
    page.click(this.$NEW_POST_MENU);
  }
  async handlePost(page) {
    await page.waitForSelector(this.$POST_EDITOR);

    // 设置标题
    console.log(chalk.green('[write] 填写标题'));
    await page.waitForSelector(this.$POST_TITLE);
    await page.click(this.$POST_TITLE);
    await page.keyboard.sendCharacter('标题');

    // 设置作者
    if (this.$POST_AUTHOR) {
      console.log(chalk.green('[write] 填写作者'));
      await page.waitForSelector(this.$POST_AUTHOR);
      await page.click(this.$POST_AUTHOR);
      await page.keyboard.sendCharacter('作者');
    }

    // 复制文章
    console.log(chalk.green('[write] 复制文章'));
    if (this.name == 'weixin') {
      const frames = await page.frames();
      for (let frame of frames) {
        const isExistEduitor = await frame.$(this.$POST_CONTENT);
        if (isExistEduitor) {
          console.log(chalk.green('[write] 填写文章'));
          await frame.focus(this.$POST_CONTENT);
          await page.keyboard.down('Control');
          await page.keyboard.down('KeyV');
          await page.keyboard.up('Control');
        }
      }
    } else {
      await page.waitForSelector(this.$POST_CONTENT);
      await page.click(this.$POST_CONTENT);
      await page.keyboard.down('Control');
      await page.keyboard.down('KeyV');
      await page.keyboard.up('Control');
    }

    setTimeout(async () => {
      await this._closeBrowser();
    }, 10 * 1000);
  }
  _isHome(url) {
    return url.indexOf(this.URL_HOME) !== -1;
  }
  _isPost(url) {
    return url.indexOf(this.URL_POST) !== -1;
  }
  async _createBrowser() {
    // https://pptr.dev/api/puppeteer.browserconnectoptions/
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size=1400,800'],
      // args: ['--disable-blink-features=AutomationControlled'],
      defaultViewport: { width: 1800, height: 900 },
      // defaultViewport: null,
      // ignoreDefaultArgs: ['--enable-automation'],
    });
    browser.on('disconnected', () => {
      this._closeBrowser();
    });
    // 监听浏览器地址的变化
    browser.on('targetchanged', async (target) => {
      const url = target.url();
      const page = await target.page();
      console.log(chalk.blue('[targetchanged]', url));
      if (!page) {
        return;
      }
      // 设置登录状态
      await this.saveCookies(page);

      if (this._isHome(url) || this._isPost(url)) {
        // Execution context was destroyed, most likely because of a navigation
        page.once('load', async () => {
          const isLogin = await this._isLogin(page);
          // 未登录
          if (!isLogin) {
            this.navigateTo(this.URL_LOGIN);
          } else {
            // 主页跳转文章编辑
            if (this._isPost(url)) {
              await this.handlePost(page);
            } else if (this._isHome(url)) {
              await this.toPost(page);
            }
          }
        });
      }
    });
    // 新 tab 页监听
    browser.on('targetcreated', async (target) => {
      const url = target.url();
      const page = await target.page();
      console.log(chalk.blue('[targetcreated]', url));
      if (!page) {
        return;
      }
      // 设置登录状态
      await this.saveCookies(page);

      if (this._isHome(url) || this._isPost(url)) {
        // Execution context was destroyed, most likely because of a navigation
        page.once('load', async () => {
          const isLogin = await this._isLogin(page);
          // 未登录
          if (!isLogin) {
            this.navigateTo(this.URL_LOGIN);
          } else {
            // 主页跳转文章编辑
            if (this._isPost(url)) {
              await this.handlePost(page);
            } else if (this._isHome(url)) {
              await this.toPost(page);
            }
          }
        });
      }
    });
    return browser;
  }
  async _closeBrowser() {
    this.browser.close();
  }
  // https://stackoverflow.com/questions/56514877/how-to-save-cookies-and-load-it-in-another-puppeteer-session
  async saveCookies(page) {
    const cookies = await page.cookies();
    await page.setCookie(...cookies);
    await fs.writeFileSync(this.cookiePath, JSON.stringify(cookies));
  }
  async appendCookies(page) {
    const cookieData = fs.readFileSync(this.cookiePath).toString();
    if (cookieData) {
      await page.setCookie(...JSON.parse(cookieData));
    }
  }
}
// const autoMedia = new AutoMedia('toutiao');

module.exports = (mediaName = 'weixin') => {
  const autoMedia = new AutoMedia(mediaName);
  autoMedia.start();
};
