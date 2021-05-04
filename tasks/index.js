const juejin = require('./juejin');
const jianshu = require('./jianshu'); 
const zhihu = require('./zhihu'); 
const nba = require('./nba');
const top = require('./top');
const music = require('./music');

module.exports = {
    tasks: () => [
        juejin.task(),
        jianshu.task(),
        zhihu.task(),
        nba.task(),
        top.task(),
        music.task(),
    ]
};