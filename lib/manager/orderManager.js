/****************************************************************
订单
****************************************************************/
const OrderModel = require('mongoose').model('order');

/**
 * 新建订单
 * @Param {object} orderObject 订单对象
 * @Param {function} callback 回调
 **/
module.exports.saveOrder = function(orderObject, callback) {
    new OrderModel(orderObject).save(callback);
}

/**
 * 更新订单状态：未支付→已支付
 * @Param {string} orderID 订单号
 * @Param {function} callback 回调
 **/
module.exports.payOrder = function(orderID, outOrderID, callback) {
    let timestamp = new Date().getTime();
    OrderModel.findOneAndUpdate(
        {orderID: orderID},
        {$set: {status: 1, payTime: timestamp, lastTime: timestamp, outOrderID: outOrderID}},
        {upsert: true},
        callback
    );
}

/**
 * 查询订单
 * @Param {string} orderID 订单号
 * @Param {function} callback 回调
 **/
module.exports.getOrder = function(orderID, callback) {
    OrderModel.findByOrderID(orderID, callback);
}

/**
 * 删除订单
 * @Param {string} orderID 订单号
 * @Param {function} callback 回调
 **/
module.exports.deleteOrder = function(req, res) {
    OrderModel.deleteByOrderID(orderID, res.callback);
}
