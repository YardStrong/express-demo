/****************************************************************
微信支付对接
****************************************************************/
const uuid = require('uuid');
const wxpayManager = require('../manager/wxpayManager');
const wxpaySignUtil = require('../../common/utils/wxpaySignUtil');
const sysConfig = require('../../common/profiles').getConfig();
const paramUtil = require('../../common/utils/paramUtil');

// Get 拉起支付
module.exports.wappay = function(req, res) {
    const orderID = uuid.v1().substring(4);
    const nonceStr = orderID;
    const clientIP = req.getClientIP();
    console.log('>> nonceStr:', nonceStr);
    console.log('↓↓↓ orderID:', orderID);
    wxpayManager.wappay(orderID, 'VEOER WIFI', 'WIFI使用费1个月', 0.01,
        nonceStr, clientIP, function(error, response, body) {
        if(error) return res.error(error);
        wxpaySignUtil.xmldecode(body, function(error, object) {
            if(error) return res.error(error);
            res.data(object.xml);
        });
    });
}

// Post notify 支付异步通知
module.exports.notify = function(req, res) {
    // 参数判断 APP_ID
    if(req.body.appid != sysConfig.wxpay.APP_ID) {
        console.log('--> WX notify failed:');
        console.dir(req.body);
        return res.end(wxpaySignUtil.xmlencode({return_code: 'FAIL', return_msg: 'APP_ID invalid'}));
    }
    wxpayManager.receiveMsg(req.body, function(error, result) {
        if(error) {
            console.log('--> Alipay notify failed:');
            console.dir(error);
            return res.end(wxpaySignUtil.xmlencode({return_code: 'FAIL', return_msg: 'ERROR'}));
        }
        console.log('---> checkSign:', result);
        if(result == true) {
            res.end(wxpaySignUtil.xmlencode({return_code: 'SUCCESS', return_msg: 'OK'}));
        } else {
            res.end(wxpaySignUtil.xmlencode({return_code: 'FAIL', return_msg: 'SIGNATURE'}));
        }
    });
}

// 订单查询
module.exports.queryOrder = function(req, res) {
    let orderID = req.query.orderID;
    let outOrderID = req.query.outOrderID;
    if(paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(outOrderID)) {
        return res.paramsInvalid();
    }
    const nonceStr = uuid.v1().substring(4);
    console.log('>> nonceStr:', nonceStr);
    wxpayManager.queryOrder(orderID, outOrderID, nonceStr, res.wxpayCallback);
}

// 关闭微信支付订单
module.exports.closeOrder = function(req, res) {
    let orderID = req.query.orderID;
    if(paramUtil.isNullOrEmpty(orderID)) {
        return res.paramsInvalid();
    }
    const nonceStr = uuid.v1().substring(4);
    console.log('>> nonceStr:', nonceStr);
    wxpayManager.closeOrder(orderID, nonceStr, res.wxpayCallback);
}

// 微信支付交易订单退款
module.exports.refundOrder = function(req, res) {
    let orderID = req.query.orderID; // 订单号
    let outOrderID = req.query.outOrderID; // 微信支付流水号
    let refundAmount = req.query.refundAmount; // 退款金额
    let refundReason = req.query.refundReason; // 退款说明
    let outRequestNo = req.query.outRequestNo; // 退款请求号
    if(paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(outOrderID) ||
        !paramUtil.isMoney(refundAmount) ||
        paramUtil.isNullOrEmpty(outRequestNo)) {
        return res.paramsInvalid();
    }
    const nonceStr = uuid.v1().substring(4);
    console.log('>> nonceStr:', nonceStr);
    wxpayManager.closeOrder(nonceStr, orderID, outOrderID,
        refundAmount, refundReason, outRequestNo, res.wxpayCallback);
}

// 微信支付退单查询
module.exports.refundOrderQuery = function(req, res) {
    let orderID = req.query.orderID; // 订单号
    let outOrderID = req.query.outOrderID; // 微信支付流水号
    let outRequestNo = req.query.outRequestNo; // 退款请求号
    if(paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(outOrderID) ||
        paramUtil.isNullOrEmpty(outRequestNo)) {
        return res.paramsInvalid();
    }
    const nonceStr = uuid.v1().substring(4);
    console.log('>> nonceStr:', nonceStr);
    wxpayManager.refundOrderQuery(nonceStr, orderID, outOrderID,
        outRequestNo, res.wxpayCallback);
}

// 微信账单下载
module.exports.billDownload = function(req, res) {
    let billType = req.query.billType || 'ALL'; // 账单类型
    let billDate = req.query.billDate; // 账单日期
    if((billType != 'ALL' && billType != 'SUCCESS' &&
        billType != 'REFUND'  && billType != 'RECHARGE_REFUND') ||
        !paramUtil.isWxBillDate(billDate)) {
        return res.paramsInvalid();
    }
    const nonceStr = uuid.v1().substring(4);
    console.log('>> nonceStr:', nonceStr);
    wxpayManager.billDownload(nonceStr, billType, billDate, res.wxpayCallback);
}
