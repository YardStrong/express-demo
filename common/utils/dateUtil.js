
/**字符串转日期
 * @Param {string} dateString 字符串类型日期`YYYY-MM-DD hh:mm:ss`
 * @Return {date} 返回日期对象或null
 **/
module.exports.formatDateString = function(dateString) {
    if(!dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        return null;
    }
    return new Date((dateString).replace(/-/g,"/"));
}
