/****************************************************************
事件类型：
'alipay.wap.ready' 支付宝订单待支付
'alipay.wap.notify' 支付宝订单支付异步通知
'alipay.wap.fail' 支付宝订单支付失败
'alipay.refund' 支付宝拉起退单请求
'alipay.refund.success' 支付宝退单成功
'alipay.refund.fail' 支付宝退单失败
****************************************************************/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let eventSchema = new Schema({
    eventType: String, // 事件类型
    eventObject: Object, // 事件描述
    clientInfo: Object, // 客户端信息
    timestamp: Number, //时间戳
}, {
    collection: 'event'
});

// 定义索引
eventSchema.index({timestamp: 1});
mongoose.model('event', eventSchema);
