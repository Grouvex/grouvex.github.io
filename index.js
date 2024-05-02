function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

function showNotification() {
  document.getElementById("notification").style.display = "block";
}
window.onload = showNotification;

// Objeto que contiene las traducciones para cada idioma
var traducciones = {
    'es': {
        'bienvenida': 'Bienvenido a nuestra página de decoración'
    },
    'en': {
        'bienvenida': 'Welcome to our decoration page'
    }
    // Añade más idiomas y traducciones según sea necesario
};

// Función para cambiar el idioma
function cambiarIdioma() {
    var idiomaSeleccionado = document.getElementById('selector-idioma').value;
    for (var id in traducciones[idiomaSeleccionado]) {
        document.getElementById(id).textContent = traducciones[idiomaSeleccionado][id];
    }
}

// Inicializa la página con el idioma español
cambiarIdioma();

