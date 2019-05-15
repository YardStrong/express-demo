/****************************************************************
事件记录
****************************************************************/
const EventModel = require('mongoose').model('event');

/**
 * 记录事件
 * @Param {string} eventObject 事件类型
 * @Param {function} callback 回调
 **/
module.exports.saveEvent = function(eventObject, callback) {
    new EventModel(eventObject).save(callback);
}
