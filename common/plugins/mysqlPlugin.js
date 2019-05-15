const mysql = require('mysql');

/************************************************************
 * 数据库配置
 */
 // config = {
 //    host: 'localhost',
 //    user: 'root',
 //    password: 'passwd',
 //    database: 'test',
 //    ssl: { // ssl配置
 //        ca : fs.readFileSync(__dirname + '/ca.crt'),
 //        rejectUnauthorized: true
 //    },
 //    connectionLimit : 10, // 连接池配置
 //    defaultSelector: 'ORDER' // 集群连接池配置，默认选择器
 // }


/**************************************************************
 * 单数据源单连接配置
 */
// var connection = null;
//
// let initConn = function(config) {
//     connection = mysql.createConnection({config);
// }
// let connect = function() {
//     connection.connect();
// }
// let end = function(callback) {
//     connection.end();
//     // connection.distory();
// }
// let changeUser = function(user) {
//     connection.changeUser(user, function(err) {console.log('[MYSQL-LOG] Change user failed !!!');})
// }


/**************************************************************
 * 单数据源连接池配置
 */
var pool = null;

let initPool = function(config) {
    pool = mysql.createPool(config);
}

// callback = function(err, results, fields) {}
let query = function(queryStr, callback) {
    pool.query(queryStr, callback);
}

// callback = function(err, connect) {connection.release();}
let getConnection = function(callback) {
    pool.getConnection(callback);
}



/**************************************************************
 * 多数据源(集群)连接池配置
 */
// var poolCluster = mysql.createPoolCluster();
//
// let addSourceDB = function(sourceName, sourceConfig) {
//     if(sourceName) poolCluster.add(sourceName, sourceConfig);
//     else poolCluster.add(sourceConfig);
// }
//
// let removeSourceDB = function(sourceName) {
//     poolCluster.remove(sourceName);
// }
//
// /**
//  * 获取连接
//  *
//  * @param  {[type]}   sourceName [数据源名]
//  * @param  {Function} callback   [function(err, connection) {connection.release();}]
//  */
// let getConnection = function(sourceName, callback) {
//     /* 三种连接方式：
//      *   1.
//      * poolCluster.getConnection('*', callback); // 支持正则表达式
//      *
//      *   2.
//      * poolCluster.of('*').getConnection(callback);
//      *
//      *   3.
//      * var pool = poolCluster.of('*', 'RANDOM'); // 随机连接
//      * pool.getConnection(callback);
//      * pool.query(function(error, results, fields) {})
//      */
//
//     if(sourceName) {
//         poolCluster.getConnection(sourceName, callback);
//     } else {
//         poolCluster.getConnection(callback);
//     }
// }
//
// let endConnection = function() {
//     poolCluster.end(function(err) {
//        console.log('[MYSQL-LOG] Close pool cluster all connections failed !!!');
//     });
// }
