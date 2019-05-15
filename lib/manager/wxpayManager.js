/****************************************************************
微信支付接入
****************************************************************/
const requestModel = require('../model/requestModel');
const wxpaySignUtil = require('../../common/utils/wxpaySignUtil');
const sysConfig = require('../../common/profiles').getConfig();
const objectUtil = require('../../common/utils/objectUtil');

/**
 * 创建微信支付订单
 * @Param {string} orderID 订单号
 * @Param {string} orderSubject 订单标题
 * @Param {string} orderBody 订单描述
 * @Param {int} orderTotalAmount 订单金额(元)
 * @Param {string} nonceStr 随机字符串
 * @Param {string} clientIP 支付客户端IP地址
 * @Param {function} callback 回调
 **/
module.exports.wappay = function(
        orderID, orderSubject, orderBody, orderTotalAmount,
        nonceStr, clientIP, callback) {
    // 构造参数
    let paramsMap = wxpaySignUtil.getPublicParams();
    paramsMap.set('nonce_str', nonceStr); // 随机字符串
    paramsMap.set('body', orderSubject); // 商品描述
    paramsMap.set('detail', orderBody); // 商品详情
    // paramsMap.set('attach', attach); // 附加参数
    paramsMap.set('out_trade_no', orderID);
    paramsMap.set('total_fee', orderTotalAmount);
    paramsMap.set('spbill_create_ip', clientIP);
    // paramsMap.set('time_start', moment().format('YYYYMMDDHHmmss'));
    // paramsMap.set('time_expire', moment().format('YYYYMMDDHHmmss')); // 过期时间
    paramsMap.set('notify_url', sysConfig.wxpay.NOTIFY_URL);
    paramsMap.set('trade_type', 'MWEB');
    // paramsMap.set('limit_pay', 'no_credit'); // 禁用信用卡支付
    paramsMap.set('scene_info', JSON.stringify({h5_info:
        {type:"Wap", wap_url: sysConfig.wxpay.WAP_URL, wap_name: sysConfig.wxpay.WAP_NAME}
    }));
    let paramsString = wxpaySignUtil.wxpaySign(paramsMap)[1];
    requestModel.postXml(sysConfig.wxpay.GATE_WAY + '/pay/unifiedorder', paramsString, callback);
}


/**
 * 微信支付结果异步通知
 * @Param {object} notifyData 异步通知数据
 * @Param {function} callback 回调
 */
module.exports.receiveMsg = function(backData, callback) {
    let paramsMap = objectUtil.turnToMap(backData);
    console.log('backData-->', backData);
    // 返回验签结果true/false
    callback(null, wxpaySignUtil.wxpayCheckSign(paramsMap));
}



/**
 * 微信支付交易订单查询（单个订单查询）
 * @Param {string} outTradeNo 订单号
 * @Param {string} tradeNo 微信支付流水号
 * @Param {string} nonceStr 随机字符串
 * @Param {function} callback 回调
 **/
module.exports.queryOrder = function(outTradeNo, tradeNo, nonceStr, callback) {
    let paramsMap = wxpaySignUtil.getPublicParams();
    paramsMap.set('transaction_id', outTradeNo);
    paramsMap.set('nonce_str', nonceStr); // 随机字符串
    paramsMap.set('out_trade_no', tradeNo);
    let paramsString = wxpaySignUtil.wxpaySign(paramsMap)[1];
    requestModel.postXml(sysConfig.wxpay.GATE_WAY + '/pay/orderquery', paramsString, callback);
}



/**
 * 关闭微信支付交易订单
 * @Param {string} outTradeNo 订单号
 * @Param {string} nonceStr 随机字符串
 * @Param {function} callback 回调
 **/
module.exports.closeOrder = function(outTradeNo, nonceStr, callback) {
    let paramsMap = wxpaySignUtil.getPublicParams();
    paramsMap.set('out_trade_no', outTradeNo);
    paramsMap.set('nonce_str', nonceStr); // 随机字符串
    let paramsString = wxpaySignUtil.wxpaySign(paramsMap)[1];
    requestModel.postXml(sysConfig.wxpay.GATE_WAY + '/pay/closeorder', paramsString, callback);
}


/**
 * 微信支付交易订单退款
 * @Param {string} nonceStr 随机字符串
 * @Param {string} outTradeNo 订单号
 * @Param {string} tradeNo 微信支付流水号
 * @Param {float} refundAmount 退款金额
 * @Param {string} refundReason 退款说明
 * @Param {string} outRequestNo 退款请求号，同一订单多次退款要求该值不变
 * @Param {function} callback 回调
 **/
module.exports.refundOrder = function(nonceStr, outTradeNo,
        tradeNo, refundAmount, refundReason, outRequestNo, callback) {
    let paramsMap = wxpaySignUtil.getPublicParams();
    paramsMap.set('nonce_str', nonceStr); // 随机字符串
    paramsMap.set('transaction_id', outTradeNo);
    paramsMap.set('out_trade_no', tradeNo);
    paramsMap.set('out_refund_no', outRequestNo);
    paramsMap.set('total_fee', refundAmount);
    paramsMap.set('refund_fee', refundAmount);
    paramsMap.set('refund_desc', refundReason);
    paramsMap.set('notify_url', sysConfig.wxpay.NOTIFY_URL);
    let paramsString = wxpaySignUtil.wxpaySign(paramsMap)[1];
    requestModel.postXml(sysConfig.wxpay.GATE_WAY + '/secapi/pay/refund', paramsString, callback);
}



/**
 * 微信支付交易订单退款查询
 * @Param {string} nonceStr 随机字符串
 * @Param {string} outTradeNo 订单号
 * @Param {string} tradeNo 微信支付流水号
 * @Param {string} outRequestNo 退款请求号
 * @Param {function} callback 回调
 **/
module.exports.refundOrderQuery = function(nonceStr, outTradeNo, tradeNo, nonceStr, callback) {
    let paramsMap = wxpaySignUtil.getPublicParams();
    paramsMap.set('nonce_str', nonceStr); // 随机字符串
    paramsMap.set('transaction_id', outTradeNo);
    paramsMap.set('out_trade_no', tradeNo);
    paramsMap.set('out_refund_no', outRequestNo);
    let paramsString = wxpaySignUtil.wxpaySign(paramsMap)[1];
    requestModel.postXml(sysConfig.wxpay.GATE_WAY + '/pay/refundquery', paramsString, callback);
}


/**
 * 微信支付账单下载
 * @Param {string} nonceStr 随机字符串
 * @Param {string} billType 值:'ALL'所有账单;'SUCCESS'成功订单;'REFUND'退单;'RECHARGE_REFUND'充值退单
 * @Param {string} billDate 日账单格式为yyyyMMdd
 * @Param {function} callback 回调
 **/
module.exports.billDownload = function(nonceStr, billType, billDate, callback) {
    let paramsMap = wxpaySignUtil.getPublicParams();
    paramsMap.set('nonce_str', nonceStr); // 随机字符串
    paramsMap.set('bill_date', billDate);
    paramsMap.set('bill_type', billType);
    paramsMap.set('tar_type', 'GZIP');
    let paramsString = wxpaySignUtil.wxpaySign(paramsMap)[1];
    requestModel.postXml(sysConfig.wxpay.GATE_WAY + '/pay/downloadbill', paramsString, callback);
}
