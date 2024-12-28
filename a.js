// Cuando se carga la página
window.addEventListener('load', function() {
    flower();
    sol();
    leaf();
    nieve();
    aniversario();
    googleTranslateElementInit();
    setThemeImage('https://grouvex.com/img/Grouvex1.png');
});

function setThemeImage(imageUrl) {
    document.querySelector('img-mainTop').src = imageUrl;
}
