/** 参数过滤判断方法 **/

/**
 * 判断参数是否为null或者空字符串
 * @Param {string} param 参数
 * @Return {bool} 返回判断结果
 **/
module.exports.isNullOrEmpty = function(param) {
    if(param) return false;
    return true;
}

/**
 * 判断参数是否为非空字符串
 * @Param {string} param 参数
 * @Return {bool} 返回判断结果
 **/
module.exports.neitherNullNorEmpty = function(param) {
    if(param == null || param == '') return false;
    return true;
}

/**
 * 判断金额，要求格式 9.00
 * @Param {string} param 参数
 * @Return {bool} 返回判断结果
 **/
module.exports.isMoney = function(param) {
    if(param == null || param == '') return false;
    param = '' + param;
    if(param.match(/^\d{1,9}.\d{2}$/)) return true;
    return false;
}

/**
 * 账单日期格式判断
 * @Param {string} param 参数
 * @Return {bool} 返回判断结果
 **/
module.exports.isAliBillDate = function(param) {
    if(param == null || param == '') return false;
    if(param.match(/^\d{4}-\d{2}$/) ||
        param.match(/^\d{4}-\d{2}-\d{2}$/)) return true;
    return false;
}

/**
 * 账单日期格式判断
 * @Param {string} param 参数
 * @Return {bool} 返回判断结果
 **/
module.exports.isWxBillDate = function(param) {
    if(param == null || param == '') return false;
    if(param.match(/^\d{6}$/)) return true;
    return false;
}
