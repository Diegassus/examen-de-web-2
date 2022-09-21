/*Realice una aplicación web que permita listar el contenido (Autor, título y contenido)
del archivo noticias.json.
Este archivo se debe disponer en la carpeta feeds del servidor.
La ruta para listar las noticias debe ser el index (o home) de la aplicación.
El listado de las noticias debe tener un enlace que permita editar el contenido (solo el
atributo de contenido) de la noticia y actualizarlo en el servidor.
El servidor debe levantar en el puerto 8888 */

const server = require('./server');
const router = require('./router');
const requestHandler = require('./requestHandler');
const handle = {};

handle["/"] = requestHandler.index;
handle["/about"] = requestHandler.about;
handle["/contact"] = requestHandler.contact;

server.start(router.route,handle);