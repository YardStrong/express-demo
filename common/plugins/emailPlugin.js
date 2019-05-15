/**
 * 发送邮件
 * send email plugin  transport
 */

var transport = null;

// 初始化 transport 服务
let init = function(config) {
    const nodemailer = require('nodemailer');
    const smtpTransport = require('nodemailer-smtp-transport');
    transport = nodemailer.createTransport(smtpTransport({
        host: config.host,
        port: config.port,
        secure: true, // 使用 SSL
        secureConnection: true, // 使用 SSL
        auth: config.auth // {user: 'user', pass: 'pass'}
    }));
}

/**
 * send mail 发送邮件
 *
 * @param  {to:'receivers接收人', subject:'主题', html:'发送html', text:'发送text'}   options
 * @param  {Function} callback
 */
let send = function (options, callback) {
    if(!transport) { callback(new Error('No smtp server.'), null) }
    options.from = 'YS<yuanqiang@veoer.com>'; // sender address
    transport.sendMail(options, callback);
};

// 发送邮件测试
let test = function() {
    mailer.init({
        host: 'smtp.exmail.qq.com',
        port: 465,
        auth: {
            user: 'yuanqiang@veoer.com',
            pass: 'Yuan0123'
        }
    });

    mailer.send({
        to: '1690566718@qq.com',
        subject: 'ceshi',
        html: '<body><h1>long time no see</h1><p>ni hai hao ma ?</p></body>',
        text: 'nihaoya,yardstrong'
    }, function(err, info) {
        if(err) console.dir(err);
        console.dir(info);
    });
}

exports.init = init;
exports.send = send;
exports.test = test;
