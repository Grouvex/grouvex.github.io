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

function openVideo(url) {
    document.getElementById('videoModal').style.display = 'block';
    document.getElementById('videoFrame').src = url;
}
function closeVideo() {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('videoFrame').src = '';
}

var themeSelect = document.getElementById('themeSelect');

        // Cuando se cambia el tema
        themeSelect.addEventListener('change', function() {
            // Obtiene todos los elementos a los que se les aplicará el cambio de tema
            var elements = document.querySelectorAll(' p, body, main, mainTop, h1, h2, h3, h4, h5, h6, h7, h8, .avatar1, article, section, aside');

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
