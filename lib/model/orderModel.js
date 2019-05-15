/****************************************************************
订单
****************************************************************/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// db construction:
// String, Number, Date, Buffer
// Boolean, Mixed, ObjectId, Array
let orderSchema = new Schema({
    orderID: String,
    outWay: String, // 第三方支付方式：alipay.wap支付宝手机
    outOrderID: String, // 第三方订单号
    outUserID: String, // 第三方用户ID *** @unuse
    orderTitle: String, // 订单信息
    orderBody: String, // 订单描述
    orderMoney: Number, // 付费金额
    status: Number, // 0:发起支付，1:支付成功，2:支付失败，3:退款成功，4:退款失败，5:订单关闭
    startTime: Number, // 订单发起时间
    payTime: Number, // 支付时间
    refundID: String, // 退款请求号
    refundTime: Number, // 退款时间
    lastTime: Number, // 最后修改时间
    extraData: Object // 保留字段
}, {
    collection: 'order'
});

orderSchema.query.byOrderID = function(orderID) {
    return this.find({ orderID: orderID });
}

orderSchema.statics.findByOrderID = function(orderID, callback) {
    this.findOne({orderID: orderID}, callback);
}

orderSchema.statics.deleteByOrderID = function(orderID, callback) {
    this.deleteOne({orderID: orderID}, callback);
}

// 定义索引
orderSchema.index({orderID: 1});

// personSchema.virtual('fullName').get(function () {
//   return this.name.first + ' ' + this.name.last;
// });

mongoose.model('order', orderSchema);
