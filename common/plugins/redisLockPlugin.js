/**
 * 利用redis创建分布式锁
 **/
const redis = require('redis');
const Redlock = require('redlock');

var redlock = {};

let init = function(config) {
    let redisClient = redis.createClient({host: config.host || '127.0.0.1', port: config.port || 6379, db: config.db || 0});
    redlock = new Redlock([redisClient], {
        driftFactor: 0.01,
        retryCount:  10,
        retryDelay:  200,
        retryJitter:  200
    });
    var retryLeft = 3;
    redlock.on('clientError', function(err) {
        if(!--retryLeft) {
            console.log('[LOCK---LOG] Redis disconnected:', config.host+':'+config.port+'/'+config.db);
            process.exit(1);
        }
    });
    console.log('[LOCK---LOG] Redis connected:', config.host+':'+config.port+'/'+config.db);
}

/*  USAGE:
redlock.lock('locks:account:322456', 1000).then(function(lock) {
    // ...do something here...
    // if you need more time, you can continue to extend
    // the lock as long as you never let it expire
    // this will extend the lock so that it expires
    // approximitely 1s from when `extend` is called
    return lock.extend(1000).then(function(lock){
        // ...do something here...
        // unlock your resource when you are done
        return lock.unlock()
        .catch(function(err) {
            // we weren't able to reach redis; your lock will eventually
            // expire, but you probably want to log this error
            console.error(err);
        });
    });
});*/


module.exports.init = init;
module.exports.redlock = redlock;
