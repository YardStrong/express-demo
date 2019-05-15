/****************************************************************
支付宝接入
****************************************************************/
const requestModel = require('../model/requestModel');
const sysConfig = require('../../common/profiles').getConfig();
const alipaySignUtil = require('../../common/utils/alipaySignUtil');
const objectUtil = require('../../common/utils/objectUtil');

/**
 * 创建支付宝订单
 * @Param {string} orderID 订单号
 * @Param {string} orderSubject 订单标题
 * @Param {string} orderBody 订单描述
 * @Param {float} orderTotalAmount 订单金额(元)
 * @Param {function} callback 回调
 **/
module.exports.wappay = function(
        orderID, orderSubject, orderBody, orderTotalAmount, callback) {
    // 获取公共参数
    let paramsMap  = alipaySignUtil.getPublicParams('alipay.trade.wap.pay');
    paramsMap.set('return_url', sysConfig.alipay.RETURN_URL);
    paramsMap.set('notify_url', sysConfig.alipay.NOTIFY_URL);
    paramsMap.set('biz_content', JSON.stringify({
        subject: orderSubject, body: orderBody, out_trade_no: orderID,
        total_amount: orderTotalAmount, product_code: 'QUICK_WAP_WAY',
        timeout_express: '90m'
        // store_id: '门店号', quit_url: sysConfig.alipay.QUIT_URL
    }));
    // 参数签名并凭借Get请求URL
    let requestUrl = alipaySignUtil.alipaySign(paramsMap)[1];
    console.log('>> requestUrl:', requestUrl);
    callback(null, requestUrl);
}

/**
 * 支付宝验签
 * @Param {object} backData 支付宝请求的数据参数
 * @Param {function} callback 回调
 **/
module.exports.checkOrder = function(backData, callback) {
    let paramsMap = objectUtil.turnToMap(backData);
    console.log('backData-->', backData);
    // 返回验签结果true/false
    callback(null, alipaySignUtil.alipayCheckSign(paramsMap));
}

/**
 * 支付宝支付结果异步通知
 * @Param {object} notifyData 异步通知数据
 * @Param {function} callback 回调
 */
module.exports.receiveMsg = function(notifyData, callback) {
    let paramsMap = objectUtil.turnToMap(notifyData);
    console.log('notifyData-->', notifyData);
    // 返回验签结果true/false
    callback(null, alipaySignUtil.alipayCheckSign(paramsMap));
}

/**
 * 支付宝交易订单查询（单个订单查询）
 * @Param {string} outTradeNo 订单号
 * @Param {string} tradeNo 支付宝流水号
 * @Param {function} callback 回调
 **/
module.exports.queryOrder = function(outTradeNo, tradeNo, callback) {
    // 构造请求参数，获取公共参数
    let paramsMap = alipaySignUtil.getPublicParams('alipay.trade.query');
    paramsMap.set('biz_content',
        JSON.stringify({out_trade_no: outTradeNo,trade_no: tradeNo}));
    // 参数签名并拼接Get请求URL
    let requestUrl = alipaySignUtil.alipaySign(paramsMap)[1];
    console.log('>> requestUrl:', requestUrl);
    requestModel.get(requestUrl, callback);
}

/**
 * 关闭支付宝交易订单
 * @Param {string} outTradeNo 订单号
 * @Param {string} tradeNo 支付宝流水号
 * @Param {function} callback 回调
 **/
module.exports.closeOrder = function(outTradeNo, tradeNo, callback) {
    // 构造请求参数，获取公共参数
    let paramsMap = alipaySignUtil.getPublicParams('alipay.trade.close');
    paramsMap.set('notify_url', sysConfig.alipay.NOTIFY_URL); // *可选
    paramsMap.set('biz_content',
        JSON.stringify({out_trade_no: outTradeNo,trade_no: tradeNo}));
    // 参数签名并拼接Get请求URL
    let requestUrl = alipaySignUtil.alipaySign(paramsMap)[1];
    console.log('>> requestUrl:', requestUrl);
    requestModel.get(requestUrl, callback);
}

/**
 * 支付宝交易订单退款
 * @Param {string} outTradeNo 订单号
 * @Param {string} tradeNo 支付宝流水号
 * @Param {float} refundAmount 退款金额
 * @Param {string} refundReason 退款说明
 * @Param {string} outRequestNo 退款请求号，同一订单多次退款要求该值不变
 * @Param {function} callback 回调
 **/
module.exports.refundOrder = function(outTradeNo, tradeNo, refundAmount,
        refundReason, outRequestNo, callback) {
    // 构造请求参数，获取公共参数
    let paramsMap = alipaySignUtil.getPublicParams('alipay.trade.refund');
    paramsMap.set('biz_content',
        JSON.stringify({out_trade_no: outTradeNo, trade_no: tradeNo, refund_amount: refundAmount,
            refund_reason: refundReason, out_request_no: outRequestNo}));
    // 参数签名并拼接Get请求URL
    let requestUrl = alipaySignUtil.alipaySign(paramsMap)[1];
    console.log('>> requestUrl:', requestUrl);
    requestModel.get(requestUrl, callback);
}

/**
 * 支付宝交易订单退款查询
 * @Param {string} outTradeNo 订单号
 * @Param {string} tradeNo 支付宝流水号
 * @Param {string} outRequestNo 退款请求号
 * @Param {function} callback 回调
 **/
module.exports.refundOrderQuery = function(outTradeNo, tradeNo, outRequestNo, callback) {
    // 构造请求参数，获取公共参数
    let paramsMap = alipaySignUtil.getPublicParams('alipay.trade.fastpay.refund.query');
    paramsMap.set('biz_content', JSON.stringify({out_trade_no: outTradeNo,
        trade_no: tradeNo, out_request_no: outRequestNo}));
    // 参数签名并拼接Get请求URL
    let requestUrl = alipaySignUtil.alipaySign(paramsMap)[1];
    console.log('>> requestUrl:', requestUrl);
    requestModel.get(requestUrl, callback);
}

/**
 * 支付宝账单下载
 * @Param {string} billType 值:'trade'交易收单的业务账单;'signcustomer'余额收入及支出等资金变动
 * @Param {string} billDate 日账单格式为yyyy-MM-dd，月账单格式为yyyy-MM
 * @Param {function} callback 回调
 **/
module.exports.billDownload = function(billType, billDate, callback) {
    // 构造请求参数，获取公共参数
    let paramsMap = alipaySignUtil.getPublicParams('alipay.data.dataservice.bill.downloadurl.query');
    paramsMap.set('biz_content', JSON.stringify({bill_type: billType, bill_date: billDate}));
    // 参数签名并拼接Get请求URL
    let requestUrl = alipaySignUtil.alipaySign(paramsMap)[1];
    console.log('>> requestUrl:', requestUrl);
    requestModel.get(requestUrl, callback);
}

/** POST请求 **/
module.exports.notify = requestModel.post;
