/***************************************************
中间件： 获取客户端信息
***************************************************/
module.exports = function(req, res, next) {

    /**
     * 获取客户端IP
     * @Return {string} 返回IP:(IPv4)[‘254.254.254.254’]
     **/
    req.getClientIP = function() {
        return req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
            req.connection.remoteAddress || // 判断 connection 的远程 IP
            req.socket.remoteAddress || // 判断后端的 socket 的 IP
            req.connection.socket.remoteAddress;
    }


    /**
     * 获取客户端ua
     * @Return {string} 返回user-agent
     **/
    req.getUserAgent = function() {
        if(req && req.headers && req.headers['user-agent'])
            return req.headers['user-agent'];
        return '';
    }

    next();
}
