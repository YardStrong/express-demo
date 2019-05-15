const http = require('http');
const app = require('../lib/app');

let server = http.createServer(app);
const appPort = app.get('app-port');
const appName = app.get('app-name');
server.listen(appPort);



let onError = function(error) {
    console.log('[SERVER-ERR] :');
    console.dir(error);
}

let onListening = function() {
    console.log('[SERVER-LOG] App(%s) started at %d', appName, appPort);
}

server.on('listening', onListening);
server.on('error', onError);
