window.onload = function() {
    setTimeout(function() {
        const intro = document.getElementById('intro');
        intro.style.display = 'none';
        
        const content = document.getElementById('content');
        content.style.display = 'block';
    }, 5000); // Tiempo de la animación total en milisegundos (3s slideUp + 2s fadeOut)
};
