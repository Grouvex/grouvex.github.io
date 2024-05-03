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

document.getElementById('themeSelect').addEventListener('change', function() {
  // Obtiene los elementos body, main, article, section y h1
  var elements = document.querySelectorAll('body, main,h1,h2,h3,h4,h5,h6,h7,h8,mainTop,.avatar1, article, section, aside');
  // Elimina las clases de las opciones antiguas
  elements.forEach(function(element) {
    element.classList.remove('theme1', 'theme2', 'theme3', 'theme4', 'theme5');
  });
  // Si la opción seleccionada no es "default", añade la clase de la opción seleccionada
  if (this.value !== 'default') {
    elements.forEach(function(element) {
      element.classList.add(this.value);
    });
  }
});
