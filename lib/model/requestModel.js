/****************************************************************
http数据请求
****************************************************************/
const request = require('request');


/**
 * @Param {string} requestUrl 发起请求（不指明编码）
 * @Param {function} callback(error, response, body) 回调
 **/
module.exports.getWithoutEncode = function(requestUrl, callback) {
    // 支付宝个别请求，将返回gb2312编码的消息体
    // 指明encoding:null，并在request模块回调中对body作gb2312解码
    request.get(requestUrl, { encoding: null }, callback);
}


/**
 * @Param {string} requestUrl 发起请求（默认UTF-8编码）
 * @Param {function} callback 回调
 **/
module.exports.get = function(requestUrl, callback) {
    request.get(requestUrl, callback);
}

/**
 * 发送xml数据
 * @Param {string} requestUrl 发起请求
 * @Param {xml} xml 发送xml数据
 * @Param {function} callback 回调
 **/
module.exports.postXml = function(requestUrl, xml, callback) {
    request.post(requestUrl, {
        headers: [ {name: 'content-type', value: 'application/xml'} ],
        body: xml
    }, callback);
}

/**
 * 发送json数据
 * @Param {string} requestUrl 发起请求
 * @Param {object} data 发送数据
 * @Param {function} callback 回调
 **/
module.exports.post = function(requestUrl, data, callback) {
    request({
        url: requestUrl,
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        timeout: 2000,
        body: data
    }, callback);
}
