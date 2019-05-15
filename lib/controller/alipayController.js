/****************************************************************
支付宝对接
****************************************************************/
const alipayManager = require('../manager/alipayManager');
const orderManager = require('../manager/orderManager');
const eventManager = require('../manager/eventManager');
const sysConfig = require('../../common/profiles').getConfig();
const paramUtil = require('../../common/utils/paramUtil');

// Get wappay 拉起支付接口
module.exports.wappay = function(req, res) {
    // 30位orderID(30) = [mac(12) + nonstr(4) + time(14)]
    // const orderID = '001122334455' + 'jofi' + '20190402000000';
    const orderID = req.query.orderID;
    const orderTitle = req.query.orderTitle;
    const orderBody = req.query.orderBody;
    const orderMoney = req.query.orderMoney;
    const extraData = req.query.extraData || {};
    // 确认参数合法性
    if(paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(orderTitle) ||
        paramUtil.isNullOrEmpty(orderBody) ||
        !paramUtil.isMoney(orderMoney)) {
        return res.paramsInvalid();
    }
    console.log('↓↓↓ orderID:', orderID);
    alipayManager.wappay(orderID, orderTitle, orderBody, orderMoney, function(error, redirectUrl) {
        if(error) return res.error(error);
        // 保存事件
        eventManager.saveEvent({
            eventType: 'alipay.wap.ready',
            eventObject: { orderID: orderID },
            clientInfo: { ip: req.getClientIP(), ua: req.getUserAgent() },
            timestamp: new Date().getTime()
        }, function(){});
        // 保存订单信息
        let timestamp = new Date().getTime();
        extraData.clientIP = req.getClientIP();
        orderManager.saveOrder({
            orderID: orderID,
            outWay: 'alipay.wap', // 第三方支付方式：alipay.wap支付宝手机
            orderTitle: orderTitle, // 订单信息
            orderBody: orderBody, // 订单描述
            orderMoney: orderMoney, // 付费金额
            status: 0, // 0:发起支付，1:支付成功，2:支付失败，3:退款成功，4:退款失败，5:订单关闭
            startTime: timestamp, // 订单发起时间
            lastTime: timestamp, // 最后修改时间
            extraData: extraData // 业务保留字段
        }, function(error, result) {
            if(error) return res.error(error);
            res.redirect(redirectUrl);
        });
    });
}

// Get getWappayUrl 拉起支付接口
module.exports.getWappayUrl = function(req, res) {
    // 30位orderID(30) = [mac(12) + nonstr(4) + time(14)]
    // const orderID = '001122334455' + 'jofi' + '20190402000000';
    const orderID = req.body.orderID;
    const orderTitle = req.body.orderTitle;
    const orderBody = req.body.orderBody;
    const orderMoney = req.body.orderMoney;
    const extraData = req.body.extraData || {};
    // 确认参数合法性
    if(paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(orderTitle) ||
        paramUtil.isNullOrEmpty(orderBody) ||
        !paramUtil.isMoney(orderMoney)) {
        return res.paramsInvalid();
    }
    console.log('↓↓↓ orderID:', orderID);
    alipayManager.wappay(orderID, orderTitle, orderBody, orderMoney, function(error, redirectUrl) {
        if(error) return res.error(error);
        eventManager.saveEvent({
            eventType: 'alipay.wap.ready',
            eventObject: { orderID: orderID },
            clientInfo: { ip: req.getClientIP(), ua: req.getUserAgent() },
            timestamp: new Date().getTime()
        }, function(){});
        // 保存订单信息
        let timestamp = new Date().getTime();
        extraData.clientIP = req.getClientIP();
        orderManager.saveOrder({
            orderID: orderID,
            outWay: 'alipay.wap', // 第三方支付方式：alipay.wap支付宝手机
            orderTitle: orderTitle, // 订单信息
            orderBody: orderBody, // 订单描述
            orderMoney: orderMoney, // 付费金额
            status: 0, // 0:发起支付，1:支付成功，2:支付失败，3:退款成功，4:退款失败，5:订单关闭
            startTime: timestamp, // 订单发起时间
            lastTime: timestamp, // 最后修改时间
            extraData: extraData // 业务保留字段
        }, function(error, result) {
            if(error) return res.error(error);
            res.item(redirectUrl);
        });
    });
}

// Get callback 支付同步回调
module.exports.callback = function(req, res) {
    eventManager.saveEvent({
        eventType: 'alipay.wap.callback',
        eventObject: { method: req.method },
        clientInfo: JSON.stringify(req.query),
        timestamp: new Date().getTime()
    }, function(){});
    // 确认参数 app_id,sign,sign_type
    if(req.query.app_id != sysConfig.alipay.APP_ID ||
        paramUtil.isNullOrEmpty(req.query.sign) ||
        paramUtil.isNullOrEmpty(req.query.sign_type)) {
        // TODO: 可能会被普通用户看到
        // TODO: 此处需要返回友好提醒的页面
        return res.paramsInvalid();
    }
    alipayManager.checkOrder(req.query, function(error, result) {
        if(error) return res.error(error);
        res.render('pay/finish', {result: result});
    });
}

// Post notify 支付异步通知
module.exports.notify = function(req, res) {
    // 确认参数 app_id,sign,sign_type
    let orderID = req.body.out_trade_no;
    let outOrderID = req.body.trade_no; //支付宝流水号
    if(req.body.app_id != sysConfig.alipay.APP_ID ||
        paramUtil.isNullOrEmpty(req.body.sign) ||
        paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(outOrderID) ||
        paramUtil.isNullOrEmpty(req.body.sign_type)) {
        console.log('--> Alipay notify failed:');
        console.dir(req.body);
        return res.end('fail');
    }
    alipayManager.receiveMsg(req.body, function(error, result) {
        eventManager.saveEvent({
            eventType: 'alipay.wap.notify',
            eventObject: { method: req.method },
            clientInfo: JSON.stringify(req.body),
            timestamp: new Date().getTime()
        }, function(){});
        if(error) return res.end('fail');
        if(result == true) {
            // 更新订单状态
            orderManager.payOrder(orderID, outOrderID, function(error, orderInfo) {
                if(error) return res.end('fail');
                // 通知portal服务放行
                let notifyData = orderInfo.extraData;
                if(notifyData.callbackUrl) {
                    alipayManager.notify(notifyData.callbackUrl, {userMac: notifyData.userMac, routerMac: notifyData.routerMac, timeout: notifyData.timeout || 1}, function(error, response, body){
                        if(error) {
                            console.dir(error);
                            return res.end('fail');
                        }
                        console.dir(body);
                        res.end('success');
                    });
                }
            });
        } else {
            res.end('fail');
        }
    });
}

// 支付宝订单查询
module.exports.queryOrder = function(req, res) {
    let orderID = req.query.orderID; // 订单号
    let outOrderID = req.query.outOrderID; // 支付宝流水号
    if(paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(outOrderID)) {
        return res.paramsInvalid();
    }
    alipayManager.queryOrder(orderID, outOrderID, res.alipayCallback.bind(this, 'alipay_trade_query_response'));
}

// 关闭支付宝订单
module.exports.closeOrder = function(req, res) {
    let orderID = req.query.orderID; // 订单号
    let outOrderID = req.query.outOrderID; // 支付宝流水号
    if(paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(outOrderID)) {
        return res.paramsInvalid();
    }
    alipayManager.closeOrder(orderID, outOrderID, res.alipayCallback.bind(this, 'alipay_trade_close_response'));
}

// 支付宝订单退款
module.exports.refundOrder = function(req, res) {
    let orderID = req.query.orderID; // 订单号
    let outOrderID = req.query.outOrderID; // 支付宝流水号
    let refundAmount = req.query.refundAmount; // 退款金额
    let refundReason = req.query.refundReason; // 退款说明
    let outRequestNo = req.query.outRequestNo; // 退款请求号
    if(paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(outOrderID) ||
        !paramUtil.isMoney(refundAmount) ||
        paramUtil.isNullOrEmpty(outRequestNo)) {
        return res.paramsInvalid();
    }
    alipayManager.refundOrder(orderID, outOrderID,
        refundAmount, refundReason, outRequestNo, res.alipayCallback.bind(this, 'alipay_trade_refund_response'));
}

// 支付宝退款订单查询
module.exports.refundOrderQuery = function(req, res) {
    let orderID = req.query.orderID; // 订单号
    let outOrderID = req.query.outOrderID; // 支付宝流水号
    let outRequestNo = req.query.outRequestNo; // 退款请求号
    if(paramUtil.isNullOrEmpty(orderID) ||
        paramUtil.isNullOrEmpty(outOrderID) ||
        paramUtil.isNullOrEmpty(outRequestNo)) {
        return res.paramsInvalid();
    }
    alipayManager.refundOrderQuery(orderID, outOrderID, outRequestNo, res.alipayCallback.bind(this, 'alipay_trade_fastpay_refund_query_response'));
}

// 支付宝账单下载
module.exports.billDownload = function(req, res) {
    let billType = req.query.billType || 'trade'; // 账单类型
    let billDate = req.query.billDate; // 账单日期
    if((billType != 'trade' && billType != 'signcustomer')||
        !paramUtil.isAliBillDate(billDate)) {
        return res.paramsInvalid();
    }
    alipayManager.billDownload(billType, billDate, res.alipayCallback.bind(this, 'alipay_data_dataservice_bill_downloadurl_query_response'));
}
