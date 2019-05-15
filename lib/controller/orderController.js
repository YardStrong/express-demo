/****************************************************************
支付订单
****************************************************************/

const orderManager = require('../manager/orderManager');
const paramUtil = require('../../common/utils/paramUtil');

// Get saveOrder 保存订单信息
module.exports.saveOrder = function(req, res) {
    // 30位orderID(30) = [mac(12) + nonstr(4) + time(14)]
    // const orderID = '001122334455' + 'jofi' + '20190402000000';
    const orderID = req.query.orderID;
    const orderTitle = req.query.orderTitle; // 订单信息
    const orderBody = req.query.orderBody; // 订单描述
    const orderMoney = req.query.orderMoney; // 付费金额
    const clientMac = req.query.clientMac || null; // 客户mac
    const clientPhone = req.query.clientPhone || null; // 客户手机号
    // 确认参数合法性
    if(paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(orderTitle) ||
        paramUtil.isNullOrEmpty(orderBody) ||
        !paramUtil.isMoney(orderMoney)) {
        return res.paramsInvalid();
    }
    // 保存订单信息
    let timestamp = new Date().getTime();
    orderManager.saveOrder({
        orderID: orderID,
        outWay: 'alipay.wap', // 第三方支付方式：alipay.wap支付宝手机
        orderTitle: orderTitle, // 订单信息
        orderBody: orderBody, // 订单描述
        orderMoney: orderMoney, // 付费金额
        clientMac: clientMac, // 客户mac
        clientIP: req.getClientIP(), // 客户ip
        clientPhone: clientPhone, // 手机号
        status: 0, // 0:发起支付，1:支付成功，2:支付失败，3:退款成功，4:退款失败，5:订单关闭
        startTime: timestamp, // 订单发起时间
        lastTime: timestamp // 最后修改时间
    }, res.callback);
}
