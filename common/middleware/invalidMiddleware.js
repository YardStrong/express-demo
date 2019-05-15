/***************************************************
中间件： 404和错误捕捉处理
***************************************************/
module.exports = [function(req, res, next) {
    res.render('error/err404');
},
/**
 * 异常捕捉，打印错误日志，返回友好提示
 **/
function(error, req, res, next) {
    if(error) console.log(error);
    res.json({code: error.status || 500, msg: "Error", data: null});
}]
