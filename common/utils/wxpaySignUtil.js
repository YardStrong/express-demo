/*************************微信支付接入参数签名*************************/
const crypto = require('crypto');
const xml2js = require('xml2js');
const xmlBuilder = new xml2js.Builder({
    rootName: 'xml', //设置根节点名'xml'
    renderOpts: {pretty: false}, //节点间没有'\n'分割
    headless: true //去除头部<?xml version="1.0" encoding="UTF-8"?>
});
const xmlParser = new xml2js.Parser({
    explicitArray : false, //关闭默认将节点转化成数组的举措
    ignoreAttrs : true
});
const objectUtil = require('./objectUtil');
const sysConfig = require('../profiles').getConfig();
// const alipayPrivateKey = fs.readFileSync(sysConfig.alipay.PRIVATE_RSA_PATH).toString();

/* example:
// object → xml
xmlBuilder.buildObject({});
// xml → object
xmlParser.parseString(xml, function(err, object) {});
*/


/**
 * 获取微信业务请求的公共参数
 * @Return {map} 返回Map类型参数
 **/
module.exports.getPublicParams = function() {
    let paramsMap = new Map();
    paramsMap.set('appid', sysConfig.wxpay.APP_ID);
    paramsMap.set('mch_id', sysConfig.wxpay.MCH_ID);
    paramsMap.set('sign_type', 'MD5');
    return paramsMap;
}


/**
 * @Param {map} paramsMap 参数
 * @Param {string} signType  签名方式 MD5 / HMAC-SHA256
 * @Return {string} 返回签名
 **/
module.exports.wxpaySign = function(paramsMap) {
    let signType = paramsMap.get('sign_type');
    if(signType != 'MD5') signType = 'HMAC-SHA256'; // 默认采用HMAC-SHA256加密签名方式
    //1.剔除空值或sign的参数
    let paramsList = [...paramsMap].filter(([key, value]) => key !== 'sign' && value);
    //2.将待签名参数按照参数键名进行ASCII升序排序
    paramsList.sort();
    //3.组合成“参数=参数值”的格式，并且把这些参数用&字符连接起来
    let paramsString = paramsList.map(([key, value]) => `${key}=${value}`).join('&');
    //4.签名：
    let encoder = null;
    if(signType == 'MD5') {//4.1 MD5方式：对带签名字符串进行MD5加密并转化成大写
        encoder = crypto.createHash('md5');
    } else {//4.2 HMAC-SHA256方式：对带签名字符串进行HMAC-SHA256加密并转化成大写
        encoder = crypto.createHmac('sha256', sysConfig.wxpay.API_KEY);
    }
    encoder.update(paramsString + '&key=' + sysConfig.wxpay.API_KEY);
    //
    let signature = encoder.digest('hex').toUpperCase();
    paramsMap.set('sign', signature);
    let object = objectUtil.turnFromMap(paramsMap);
    let xmlstring = xmlBuilder.buildObject(object);
    return [signature, xmlstring];
}


/**
 * 接受 Map 类型的参数，作签名校验
 * @Param {map} paramsMap 接收参数
 * @Param {bool} 返回校验结果true/false
 **/
module.exports.wxpayCheckSign = function(paramsMap) {
    let signType = paramsMap.get('sign_type');
    let signature = paramsMap.get('sign');
    if(signType != 'MD5') signType = 'HMAC-SHA256'; // 默认采用HMAC-SHA256加密签名方式
    //1.剔除空值或sign的参数
    let paramsList = [...paramsMap].filter(([key, value]) => key !== 'sign' && value);
    //2.将待签名参数按照参数键名进行ASCII升序排序
    paramsList.sort();
    //3.组合成“参数=参数值”的格式，并且把这些参数用&字符连接起来
    let paramsString = paramsList.map(([key, value]) => `${key}=${value}`).join('&');
    //4.签名：
    let encoder = null;
    if(signType == 'MD5') {//4.1 MD5方式：对带签名字符串进行MD5加密并转化成大写
        encoder = crypto.createHash('md5');
    } else {//4.2 HMAC-SHA256方式：对带签名字符串进行HMAC-SHA256加密并转化成大写
        encoder = crypto.createHmac('sha256', sysConfig.wxpay.API_KEY);
    }
    encoder.update(paramsString + '&key=' + sysConfig.wxpay.API_KEY);
    //
    let signatureSure = encoder.digest('hex').toUpperCase();
    return signatureSure == signature;
}


/**
 * xml 转对象
 * @Param {string} xmlstring xml字符串
 * @Param {function} 回调
 */
module.exports.xmldecode = xmlParser.parseString;

module.exports.xmlencode = xmlBuilder.buildObject;


// function test() {
//     let paramsMap = new Map();
//     paramsMap.set('appid', 'wxd930ea5d5a258f4f');
//     paramsMap.set('mch_id', '10000100');
//     paramsMap.set('device_info', '1000');
//     paramsMap.set('body', 'test');
//     paramsMap.set('nonce_str', 'ibuaiVcKdpRxkhJA');
//     let sign = module.exports.wxpaySign(paramsMap);
//     console.dir(sign);
// }
//
// function decodeTest() {
//     let string = '<xml><return_code><![CDATA[FAIL]]></return_code><return_msg>' +
//         '<![CDATA[nonce_str参数长度有误]]></return_msg></xml>';
//     xmlParser.parseString(string, function(error, object) {
//         if(error) {
//             console.log(error);
//             return;
//         }
//         console.dir(object);
//     });
// }
//
// if(!module.parent) {
//     decodeTest();
// }
