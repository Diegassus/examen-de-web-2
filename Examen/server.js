const http = require('http');
const port= 8888;


function start(route,handle){
    function requestListener(req,res){
        const {pathname} = new URL(req.url,"http://"+req.headers.host);
        route(handle,pathname,req,res);
    }
    http.createServer(requestListener).listen(port);
    console.log("Servidor Iniciado");
}

exports.start=start;