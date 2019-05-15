/**
 * 日志存储到文件
 * morgin log file configure
 */

// save log in files 将日志存储在文件中
exports.file = function(app) {
    const logger = require('morgan');
    const fs = require('fs');
    // config log file
    var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
    app.use(logger('dev', {stream: accessLogStream}));
}

// always usage 常用方法
exports.nofile = function(app) {
    const logger = require('morgan');
    app.use(logger('dev'));
}
