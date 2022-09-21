const fs = require("fs");
const querystring = require('querystring');

const mime = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
};

function route(handle, pathname, req, res) {
  // manejo de archivos dinamicos
  if (typeof handle[pathname] === "function") {
    handle[pathname](req, res);
  } else {
    //manejo estaticos
    if (req.method === "GET") {
      // resuevo la peticion GET

      // si requieren el noticias.json
      if (pathname == "/feeds/noticias.json") {
        fs.readFile("./feeds/noticias.json", (err, json) => {
          res.writeHead(200, { "Content-Type": "text/json" });
          res.end(json);
        });
      } else if (req.url.indexOf("/edit") >= 0) {
        let notaId = Number(req.url.split("/").pop());

        let noticias = JSON.parse(fs.readFileSync("./feeds/noticias.json"));

        //validar id
        if (notaId === NaN || notaId % 1 != 0 ||notaId === undefined) {
          res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("Error 404");
            res.end();

          // si no existe
        } else if (notaId >= noticias.news.length) {
          res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("Error 404");
            res.end();
        } else {
          fs.readFile("./index.html", (err, html) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="/styles.css">
          <title>Document</title>
      </head>
        <body>
          <h1>Editor de noticias</h1>
          <div id="cartelera">
            <div class="noticia">
              <h1 class="titulo-noticia">${noticias.news[notaId].title}</h1>
              <h4 class="autor">${noticias.news[notaId].author}</h4>
              <img src="${noticias.news[notaId].urlToImage}" class="imagen">
              <p class="descripcion">${noticias.news[notaId].description}</p>
              <form action="/submit/${notaId}" method="POST">
                <textarea cols="30" rows="10" name="content">${
                  noticias.news[notaId].content
                    ? noticias.news[notaId].content
                    : ""
                }</textarea>
                <input type="submit" value="Actualizar Contenido" ></input>
              </form>
              <a href="/" class="editar">Volver a la cartelera de noticias</a>
            </div>
          </div>
        </body>
      </html>`);
            res.end();
          });
        }
      } else {
        // si requiero cuaquier otra ruta
        const path = "./public" + pathname;
        //reviso que exista el archivo
        fs.stat(path, (err) => {
          //si existe...
          if (!err) {
            fs.readFile(path, (err, content) => {
              // y no lo puede leer tira un 500
              if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.write("Ocurrio un error interno");
                res.end();
              } else {
                // lo puede leer y lo devuelve
                const arr = path.split("."); // separo la url
                const ext = arr[arr.length - 1]; // obtengo la extension del archivo ubicado en la ultima posicion
                const type = mime[ext];
                // devuelvo el archivo solicitado
                res.writeHead(200, { "Content-Type": type });
                res.write(content);
                res.end();
              }
            });
          } else {
            // si el archivo no existe o no se encuentra...
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.write("Error 404");
            res.end();
          }
        });
      }
    } else if (req.method === "POST") {
      // manejamos el requerimiento POST
      if (req.url.indexOf('/submit') >= 0){

        let id = Number(req.url.split("/").pop());
        let noticias = JSON.parse(fs.readFileSync('./feeds/noticias.json'));
  
        let data = '';
        req.on('data', dat => data += dat );
  
        req.on('end', () => {
          const form = querystring.parse(data);
          
          noticias.news[id].content = form["content"];
  
          fs.writeFile('./feeds/noticias.json', JSON.stringify(noticias), err => {
            if (err) {
              console.log(err);
            } else {
              fs.readFile('./index.html', (err, html) =>{
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(`<script>window.location.href="/";</script>`);
              });
            }
          })
  
        })
  
      }
    }
  }
}
exports.route = route;

