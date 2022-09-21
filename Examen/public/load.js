const cartelera = document.getElementById('cartelera');

const cargarNoticias = (noticia,index)=>{
    return `<div class="noticia">
    <h1 class="titulo-noticia">${noticia.title}</h1>
    <h4 class="autor">${noticia.author}</h4>
    <img src="${noticia.urlToImage}" class="imagen">
    <p class="descripcion">${noticia.description}</p>
    <p class="contenido">${noticia.content ? noticia.content : 'No hay contenido respecto a esta noticia'}</p>
    <a href="${noticia.url}" class="mas">leer más</a>
    <a href="/edit/${index}" class="editar" >editar noticia</a>
    </div>`
}

fetch('./feeds/noticias.json').then(res=>res.json()).then(res=>{
    console.log(res);
    res.news.forEach((noticia,index)=> {
        let card = document.createElement('div');
        card.className = 'noticia-container';
        card.innerHTML = cargarNoticias(noticia,index);
        cartelera.appendChild(card);
    });
})