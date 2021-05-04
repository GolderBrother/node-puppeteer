const puppeteer = require('puppeteer');
const task = async () => {
    // 打开chrome浏览器
    const browser = await puppeteer.launch({
        // 关闭无头模式,方便查看
        headless: false
    });
    // 新建页面
    const page = await browser.newPage();
    // 跳转到掘金
    await page.goto('https://juejin.cn');
    // 截屏保存
    await page.screenshot({
        path: './juejin.png'
    });
    await page.close();
};
const init = async () => {
    console.log('task doing...');
    await task();
    console.log('task done');
};
init();