const schedule = require("node-schedule");
// 每日18时定时任务
function crontab() {
  schedule.scheduleJob(
    `00 00 18 * * *`,
    mainTask
  );
}
function mainTask() {
    console.log('mainTask schedule doing...')
};