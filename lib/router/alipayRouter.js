const router = require('express').Router();

const controller = require('../controller/alipayController');

// // 手机网页支付
// router.get('/wappay', controller.wappay);
// // 手机网页支付链接
// router.post('/getWappayUrl', controller.getWappayUrl);
// // 支付同步返回
// router.all('/callback', controller.callback);
// // 支付宝支付结果异步通知
// router.post('/notify', controller.notify);
// // 订单查询
// router.get('/queryOrder', controller.queryOrder);
// // 关闭订单
// router.get('/closeOrder', controller.closeOrder);
// // 退款
// router.get('/refundOrder', controller.refundOrder);
// // 退款查询
// router.get('/refundOrderQuery', controller.refundOrderQuery);
// // 账单下载
// router.get('/billDownload', controller.billDownload);



module.exports = router;
