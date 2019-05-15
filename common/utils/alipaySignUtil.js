/*************************** 支付宝接入参数签名 *********************/
const moment = require('moment');
const crypto = require('crypto');
const fs = require('fs');
const sysConfig = require('../profiles').getConfig();
const alipayPrivateKey = fs.readFileSync(sysConfig.alipay.PRIVATE_RSA_PATH).toString();
const alipayPublicKey = fs.readFileSync(sysConfig.alipay.PUBLIC_RSA_PATH).toString();

// 应用私钥
module.exports.alipayPrivateKey = alipayPrivateKey;
// 支付宝公钥
module.exports.alipayPublicKey = alipayPublicKey;

/**
 * 获取支付宝业务请求的公共参数
 * @Param {string} method 支付宝API接口方法
 * @Return {map} 返回Map类型数据
 **/
module.exports.getPublicParams = function(method) {
    let paramsMap = new Map();
    paramsMap.set('app_id', sysConfig.alipay.APP_ID);
    paramsMap.set('method', method);
    paramsMap.set('charset', 'utf-8');
    paramsMap.set('format', 'JSON');
    paramsMap.set('sign_type', 'RSA2');
    paramsMap.set('timestamp', moment().format('YYYY-MM-DD HH:mm:ss'));
    paramsMap.set('version', '1.0');
    return paramsMap;
}

/**
 * 接受 Map 类型的参数，按照支付宝对接要求进行 sha256-RSA 加密进行签名
 * @Param {map} paramsMap 请求参数
 * @Return {array} 返回签名[signature, requestUrl]
 **/
module.exports.alipaySign = function(paramsMap) {
    //1.获取所有请求参数，不包括字节类型参数，如文件、字节流，剔除sign字段，剔除值为空的参数
    let paramsList = [...paramsMap].filter(([key, value]) => key !== 'sign' && value);
    //2.按照字符的键值ASCII码递增排序
    paramsList.sort();
    //3.组合成“参数=参数值”的格式，并且把这些参数用&字符连接起来
    let paramsString = paramsList.map(([key, value]) => `${key}=${value}`).join('&');
    console.log('>> paramsString:', paramsString);
    //4.进行RSA-SHA256加密
    let encoder = crypto.createSign('RSA-SHA256');
    encoder.update(paramsString);
    let signature = encoder.sign(alipayPrivateKey, 'base64');
    console.log('>> signature:', signature);
    //5.将sign加入到参数，并对每个参数的值进行url编码，拼接成Get请求参数字符串
    paramsMap.set('sign', signature);
    paramsString = [...paramsMap].map(([key, value]) => {return key + '=' + encodeURIComponent(value)}).join('&');
    return [signature, sysConfig.alipay.GATE_WAY + '?' + paramsString];
}


/**接受 Map 类型的参数，按照支付宝对接要求，
 * 对同步和异步通知请求参数进行 sha256-RSA 加密作签名校验
 * @Param {map} paramsMap 接收参数
 * @Param {bool} 返回校验结果true/false
 **/
module.exports.alipayCheckSign = function(paramsMap) {
    //1.获取所有请求参数，不包括字节类型参数，如文件、字节流，剔除sign字段，剔除值为空的参数
    let paramsList = [...paramsMap].filter(([key, value]) => key !== 'sign' && key !== 'sign_type' && value);
    //2.按照字符的键值ASCII码递增排序
    paramsList.sort();
    //3.组合成“参数=参数值”的格式，并且把这些参数用&字符连接起来
    let signature = paramsMap.get('sign');
    let paramsString = paramsList.map(([key, value]) => `${key}=${value}`).join('&');
    console.log('>> paramsString:', paramsString);
    //4.校验签名，返回校验结果
    var verify = crypto.createVerify('RSA-SHA256');
    verify.update(paramsString);
    return verify.verify(alipayPublicKey, signature, 'base64');
}
