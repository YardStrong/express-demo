const path = require('path');
const PROTOCOL_HEAD = 'http://';
const DOMAIN_NAME = 'localhost';

module.exports = {
    app: {
        port: 8080,
        name: 'pay'
    },
    host: {
        protocol_head: PROTOCOL_HEAD,
        domain_name: DOMAIN_NAME,
        ipv4: '127.0.0.1'
    },
    mongo: {
        order: {url: 'mongodb://127.0.0.1:27017/pay'}
    },
    redis: {
        host: '127.0.0.1',
        port: 6379,
        db: 11
    }
}
