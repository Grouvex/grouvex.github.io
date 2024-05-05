// Llama a todas las funciones que quieres ejecutar cuando se carga la página
showNotification();
flower();
flower();
nieve();
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function showNotification() {
    document.getElementById("notification").style.display = "block";
}

function openVideo(url) {
    document.getElementById('videoModal').style.display = 'block';
    document.getElementById('videoFrame').src = url;
}

function closeVideo() {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('videoFrame').src = '';
}

function flower() {
  var today = new Date();
  var month = today.getMonth();
  var day = today.getDate();

  // Comprueba si es la primera semana de primavera (20 de marzo - 27 de marzo)
  if ((month == 2 && day >= 20) || (month == 2 && day <= 27)) {
    for (var i = 0; i < 200; i++) {
      var flower = document.createElement('div');
      flower.className = 'flower';
      flower.style.left = Math.random() * window.innerWidth + 'px';
      flower.style.animationDuration = Math.random() * 3 + 2 + 's';
      flower.style.animationDelay = Math.random() * 7 + 's';
      flower.style.opacity = Math.random();
      flower.style.transform = 'scale(' + Math.random() + ')';
      document.body.appendChild(flower);
    }
  }
}

function nieve() {
  var today = new Date();
  var month = today.getMonth();
  var day = today.getDate();

  // Comprueba si es Navidad (24 de diciembre - 5 de enero)
  if ((month == 11 && day >= 24) || (month == 0 && day <= 5)) {
    for (var i = 0; i < 250; i++) {
      var snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.style.left = Math.random() * window.innerWidth + 'px';
      snowflake.style.animationDuration = Math.random() * 2 + 6 + 's';
      snowflake.style.animationDelay = Math.random() * 10 + 's';
      snowflake.style.opacity = Math.random();
      snowflake.style.transform = 'scale(' + Math.random() + ')';
      document.body.appendChild(snowflake);
    }
  }
}

var themeSelect = document.getElementById('themeSelect');

// Cuando se cambia el tema
themeSelect.addEventListener('change', function() {
    // Obtiene todos los elementos a los que se les aplicará el cambio de tema
    var elements = document.querySelectorAll('p, body, main, mainTop, h1, h2, h3, h4, h5, h6, h7, h8, .avatar1, article, section, aside');

    // Elimina las clases de las opciones antiguas
    elements.forEach(function(element) {
        element.classList.remove('theme1', 'theme2', 'theme3', 'theme4', 'theme5');
    });

    // Si la opción seleccionada no es "default", añade la clase de la opción seleccionada
    if (this.value !== 'default') {
        elements.forEach(function(element) {
            element.classList.add(this.value);
        }.bind(this));
    }

    // Guarda la selección del usuario en el almacenamiento local
    localStorage.setItem('selectedTheme', this.value);
});

// Cuando se carga la página
window.addEventListener('load', function() {
    // Obtiene la selección del usuario del almacenamiento local
    var selectedTheme = localStorage.getItem('selectedTheme');

    // Si hay una selección guardada y no es "default", aplica el tema seleccionado
    if (selectedTheme && selectedTheme !== 'default') {
        var elements = document.querySelectorAll('p, body, main, mainTop, h1, h2, h3, h4, h5, h6, h7, h8, .avatar1, article, section, aside');
        elements.forEach(function(element) {
            element.classList.add(selectedTheme);
        });
        themeSelect.value = selectedTheme; // Asegúrate de que el menú desplegable muestre el tema correcto
    }
});
