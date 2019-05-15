/***************************************************
中间件： Restful风格的http统一返回
***************************************************/
const wxpaySignUtil = require('../utils/wxpaySignUtil');
module.exports = function(req, res, next) {
    /**
     * 自编写同一返回
     * @Param {error} error 异常体
     * @Param {object} data 数据
     **/
    res.callback = function(error, data) {
        if(error) {
            console.log(error);
            return res.error();
        }
        return res.data(data);
    }

    /**
     * request模块http请求同一返回
     * @Param {error} error 异常体
     * @Param {object} response http请求返回
     * @Param {object} body 返回体
     **/
    res.requestCallback = function(error, response, body) {
        if(error) {
            console.log(error);
            return res.error();
        }
        return res.data(body);
    }

    /**
     * 蚂蚁金服请求同一返回，并提取返回体中的attr属性
     * @Param {string} 属性值
     * @Param {error} error 异常体
     * @Param {object} response http请求返回
     * @Param {object} body 返回体
     **/
    res.alipayCallback = function(attr, error, response, body) {
        if(error) {
            console.log(error);
            return res.error();
        }
        return res.data(JSON.parse(body)[attr]);
    }

    /**
     * 微信支付请求同一返回，将返回的xml解析成json对象
     * @Param {error} error 异常体
     * @Param {object} response http请求返回
     * @Param {object} body 返回体
     **/
    res.wxpayCallback = function(error, response, body) {
        if(error) return res.error(error);
        wxpaySignUtil.xmldecode(body, function(error, object) {
            if(error) return res.error(error);
            res.data(object.xml);
        });
    }

    /**
     * 请求成功
     **/
    res.success = function() {
        res.json({code: 200, msg: "Success", data: null});
    }

    /**
     * 带数据的请求成功返回
     **/
    res.data = function(data) {
        res.json({code: 200, msg: "Success", data: data});
    }

    /**
     * 带数据的请求成功返回
     **/
    res.item = function(data) {
        res.json({code: 200, msg: "Success", item: data});
    }

    /**
     * 服务器异常
     * @Param {error} error 异常体
     **/
    res.error = function(error) {
        if(error) {
            console.log('ERROR:');
            console.dir(error);
        }
        res.json({code: 500, msg: "Error", data: null});
    }


    /**
     * 请求异常
     * @Param {string} msg 异常信息
     **/
    res.errormsg = function(msg) {
        res.json({code: 500, msg: msg, data: null});
    }

    /**
     * 500错误提示页面
     * @Param {string} msg 错误信息
     **/
    res.errorHtml = function(msg) {
        res.render('error/wrong', {code: 500, msg: msg});
    }

    /**
     * 参数错误
     **/
    res.paramsInvalid = function() {
        res.json({code: 400, msg: 'param invalid', data: null});
    }

    /**
     * 攻击警告
     **/
    res.attackAlert = function() {
        res.render('error/attack');
    }

    next();
}
