const puppeteer = require("puppeteer");
const chromeFinder = require("chrome-finder");
const chalk = require("chalk");
const fs = require("fs");
const Task = ({
  pageUrl,
  pageSelector,
  title
}, eventHandle) => {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        // args: [],
        executablePath: chromeFinder()
      });
      // 新开一个页面
      const page = await browser.newPage();
      page.goto(pageUrl);
      console.log(chalk.blue(`[Process] 开始获取 ${title}`));
      eventHandle && (await eventHandle(page));
      // 等待找到元素
      await page.waitForSelector(pageSelector, {
        timeout: 5000
      });
      const res = await page.$$eval(pageSelector, ele => ele.map(el => ({
        url: el.href,
        text: el.innerText
      })));
      // await browser.close();
      console.log(res.length && chalk.yellow(`[Success] 成功获取 ${title}`));
      resolve({
        title,
        list: res.slice(0, 5)
      });
    } catch (error) {
      reject(error)
    }
  }).catch(err => {
    console.error(err);
    console.log(chalk.white.bgRed.bold(`[Failed] 获取 ${title} 失败`));
  });
};

const FileServer = {
  // 写入文件
  write(path, text) {
    fs.writeFileSync(path, text);
  },
  // 读取文件
  read(path) {
    return fs.readFileSync(path);
  },
  // 创建markdown内容
  createMdMsg(res, today) {
    return res.reduce((preContent, { title = '', list = [] } = {}) => {
      const curTitle = `## ${title}\n`;
      const curContent = list.reduce((c, { url, text }) => {
        return `${c}[${text}](${url}) \n`;
      }, '');
      return `${preContent}${curTitle}${curContent}`;
    }, `# ${today} \n`);
  }
};

module.exports = {
  Task,
  FileServer
};