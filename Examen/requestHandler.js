const fs = require('fs');


function index (req,res){
    fs.readFile('./public/index.html',(err,content)=>{
        if(err){
            res.writeHead(500,{'Content-Type':'text/html'});
            res.write('Ocurrio un problema interno');
            console.log("error index");
            console.log(err);
            res.end();
        }
        res.writeHead(200,{'Content-Type':'text/html'});
        res.end(content);
    });
}

exports.index = index;
