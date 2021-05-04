const puppeteer = require('puppeteer');
const path = require('path');
const fileServer = require('./tools/index');

const task = async () => {
    try {
        // 打开chrome浏览器
    const browser = await puppeteer.launch({
        headless: false
    });
    // 新建页面
    const page = await browser.newPage();
    // 跳转到掘金
    await page.goto('https://juejin.cn');
    // 菜单导航对应的类名
    const navSelector = '.view-nav .nav-item';
    // 文章列表对应的类名
    const  listSelector = ".entry-list .item a.title";
    
    // 前端菜单
    const navType = '前端';
    await page.waitFor(navSelector);

    // 菜单导航名称
    const navList = await page.$$eval(navSelector, ele => ele.map(el => el.innerText));
    // 找出菜单中前端模块对应的索引
    const webNavIndex = navList.findIndex(item => item === navType);
    // 点击前端模块并等待页面跳转完成
    await Promise.all([
        page.waitForNavigation(),
        page.click(`${navSelector}:nth-child(${webNavIndex + 1})`)
    ]);
    await page.waitForSelector(listSelector, {
        timeout: 5000
    });
    // 通过选择器找到对应列表项的标题和链接
    const res = await page.$$eval(listSelector, (ele) => ele.map(el => ({
        url: el.href,
        text: el.innerText
    })));
    console.log('res', res);
    // 截屏保存
    // await page.screenshot({
    //     path: './juejin-web.png'
    // });

    const getMsgTask = Promise.all(task());
    getMsgTask.then(res => {
        const { data } = JSON.parse(
            fileServer.read(
                path.join(__dirname, './index.json')
            ).toString()
        );
        // 省略对资讯 格式化内容
        const text = msgHandler(res);
        // 写入资讯
        fileServer.write(path.join(__dirname, './html/index.json'), JSON.stringify({
            data: [{
                date: Date.now(),
                text
            }, ...data]
        }))
    });
    } catch (error) {
        console.error('run task error', error);
    }
};
task();