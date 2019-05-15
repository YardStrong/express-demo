/****************************json对象操作和转化*************************************/

/**
 * 覆盖式拷贝（fromA → toB） | `fromObj` and `toObj` are also object
 * @Param {object} fromA 拷贝源
 * @Param {object} toB 覆盖对象
 **/
module.exports.copyFromTo = function(fromA, toB) {
    if(typeof(fromA) != 'object') fromA = {};
    if(typeof(toB) != 'object') toB = {};
    objectDeepCopy(fromA, toB);
    function objectDeepCopy(fromObj, toObj) {
        for(let attribute in fromObj) {
            if(typeof(fromObj[attribute]) != 'object') {
                toObj[attribute] = fromObj[attribute];
            } else {
                if(typeof(toObj[attribute]) != 'object') toObj[attribute] = {};
                objectDeepCopy(fromObj[attribute], toObj[attribute]);
            }
        }
    }
}

/**
 * 深拷贝 —— 对象克隆
 * @Param {object} fromA 克隆源
 * @Return {object}
 **/
module.exports.cloneObject = function(fromA) {
    return JSON.parse(JSON.stringify(fromA));
}

/**
 * 对象转Map类型
 * @Param {object} fromA 待转换对象
 * @Return {map} 返回Map类型Map{k1=>v1, k2=>v2}
 **/
module.exports.turnToMap = function(fromA) {
    let toB = new Map();
    for(let attr in fromA) {
        toB.set(attr, fromA[attr]);
    }
    return toB;
}

/**
 * map对象转json对象
 * @Param {map} formA 待转换的map对象
 * @Return {object} 返回json对象
 **/
module.exports.turnFromMap = function(fromA) {
    let toB = {};
    [...fromA].map(function([key, value]) {
        toB[key] = value;
    });
    return toB;
}

/**
 * 对象转Array类型
 * @Param {object} fromA 待转换对象
 * @Return {array} 返回Array类型[[k1, v1], [k2, v2]]
 **/
module.exports.turnToArray = function(fromA) {
    let toB = new Array();
    for(let attr in fromA) {
        toB.push([attr, fromA[attr]]);
    }
    return toB;
}
