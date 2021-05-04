const { Task } = require("../tools");
const options = {
    pageUrl: 'https://www.zhihu.com',
    pageSelector: '.ContentItem-title a',
    title: '今日知乎'
};
module.exports = {
    task: async () => await Task(options)
};