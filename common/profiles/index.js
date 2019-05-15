/*****************************************************
 * 加载配置文件，根据 defConfig.active_mode值加载相应配置
 ****************************************************/

/********************* requires *********************/
const objectUtil = require('../utils/objectUtil');

var defConfig = {
    app: {
        port: process.env.PORT || 8080,
        name: 'veoeryun-pay'
    },
    ACTIVE_MODE: process.env.ACTIVE_MODE || 'dev'
};
var config = null;



/********************* functions *********************/
// 加载配置
function loadConfig() {
    // 对象深拷贝
    config = objectUtil.cloneObject(defConfig);
    console.log('[SERVER-LOG]', 'Active mode:', config.ACTIVE_MODE, ' |  Active profile: conf-' + config.ACTIVE_MODE);
    let config_mode = require('./conf-' + config.ACTIVE_MODE);
    objectUtil.copyFromTo(config_mode, config);
    return config;
}

// 获取缓存配置
function getConfig() {
    if(config == null) {
        return loadConfig();
    }
    return config;
}



/********************* exports *********************/
module.exports.getConfig = getConfig;
