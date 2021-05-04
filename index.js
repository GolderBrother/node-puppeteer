const chalk = require("chalk");
const dayjs = require("dayjs");
const express = require("express");
const path = require("path");
const schedule = require("node-schedule");
const { tasks } = require("./tasks");
const { FileServer } = require("./tools");
const app = express();
const resourcePath = path.join(__dirname, "./resource");
app.use(
  express.static(resourcePath, {
    setHeaders(res) {
      res.set("Access-Control-Allow-Origin", "*");
    },
  })
);

async function mainTask() {
  console.log("mainTask execute");
  const now = dayjs().format("YYYY-MM-DD");
  try {
    console.log(chalk.red(`[Process] 开始获取 [${now}] 咨询`));
    const getMsgTask = () => Promise.all(tasks());
    console.log('getMsgTask', getMsgTask);
    const res = await getMsgTask();
    const { data } = JSON.parse(
      FileServer.read(path.join(resourcePath, "./index.json")).toString()
    );
    const text = FileServer.createMdMsg(res, now);
    FileServer.write(
      path.join(resourcePath, "./index.json"),
      JSON.stringify({
        data: [
          {
            date: now,
            text,
          },
          // ...data,
        ],
      })
    );
    console.log(chalk.green(`[Success] 成功获取到 [${now}] 的资讯`));
  } catch (error) {
    console.error('error', error);
    console.log(chalk.white.bgRed.bold(`[Failed] 获取 ${now} 资讯 失败`));
    mainTask();
  }
}
// 定时任务
function crontab() {
    schedule.scheduleJob(`00 00 11 * * *`, mainTask);
  }
crontab();
app.listen(8888, () => {
  console.log("your app is listening on 8888");
  mainTask();
});
