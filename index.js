window.addEventListener('load', function() {
    // Llama a todas las funciones que quieres ejecutar cuando se carga la página
    showNotification();
    flower()
    sol();
    leaf();
    nieve()
    jurassicworld()
    starwars()
    taylorswift()
});
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

function starwars() {
      var date = new Date();
      var startStarWarsWeek = new Date(date.getFullYear(), 4, 4); // 4 de mayo
      var endStarWarsWeek = new Date(date.getFullYear(), 4, 14); // 14 de mayo

      if (date >= startStarWarsWeek && date <= endStarWarsWeek) {
        document.querySelector('#themeSelect option[value="starwars"]').classList.remove('hiddenOption');
      } else {
        document.querySelector('#themeSelect option[value="starwars"]').classList.add('hiddenOption');
      }
    };
function jurassicworld() {
      var date = new Date();
      var startJurassicWorldWeek = new Date(date.getFullYear(), 5, 10); // 10 de Junio
      var endJurassicWorldWeek = new Date(date.getFullYear(), 5, 20); // 20 de Junio

      if (date >= startJurassicWorldWeek && date <= endJurassicWorldWeek) {
        document.querySelector('#themeSelect option[value="jurassicworld"]').classList.remove('hiddenOption');
      } else {
        document.querySelector('#themeSelect option[value="jurassicworld"]').classList.add('hiddenOption');
      }
    };
    
function taylorswift() {
      var date = new Date();
      var startTaylorSwiftWeek = new Date(date.getFullYear(), 11, 13); // 13 de Diciembre
      var endTaylorSwiftWeek = new Date(date.getFullYear(), 11, 23); // 23 de Diciembre

      if (date >= startTaylorSwiftWeek && date <= endTaylorSwiftWeek) {
        document.querySelector('#themeSelect option[value="taylorswift"]').classList.remove('hiddenOption');
      } else {
        document.querySelector('#themeSelect option[value="taylorswift"]').classList.add('hiddenOption');
      }
    };

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
function sol() {
  var today = new Date();
  var month = today.getMonth();
  var day = today.getDate();

  // Comprueba si es verano (21 de junio - 28 de junio)
  if ((month == 5 && day >= 21) || (month == 5 && day <= 28)) {
    for (var i = 0; i < 200; i++) {
      var sun = document.createElement('div');
      sun.className = 'sun';
      sun.style.left = Math.random() * window.innerWidth + 'px';
      sun.style.animationDuration = Math.random() * 3 + 2 + 's';
      sun.style.animationDelay = Math.random() * 7 + 's';
      sun.style.opacity = Math.random();
      sun.style.transform = 'scale(' + Math.random() + ')';
      document.body.appendChild(sun);
    }
  }
}
function leaf() {
  var today = new Date();
  var month = today.getMonth();
  var day = today.getDate();

  // Comprueba si es la primera semana de otoño (20 de septiembre - 27 de septiembre)
  if ((month == 8 && day >= 20) || (month == 8 && day <= 30)) {
    for (var i = 0; i < 200; i++) {
      var leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.style.left = Math.random() * window.innerWidth + 'px';
      leaf.style.animationDuration = Math.random() * 3 + 2 + 's';
      leaf.style.animationDelay = Math.random() * 7 + 's';
      leaf.style.opacity = Math.random();
      leaf.style.transform = 'scale(' + Math.random() + ')';
      document.body.appendChild(leaf);
    }
  }
}

function nieve() {
  var today = new Date();
  var month = today.getMonth();
  var day = today.getDate();

  // Comprueba si es Navidad (24 de diciembre - 5 de enero)
  if ((month >= 2 && day >= 24) || (month == 0 && day <= 5)) {
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
var videos = [
            {id: 'x09D-9ZpF_o', title: 'Título 1', description: 'Descripción 1', credits: 'Créditos 1'},
            {id: 'x09D-9ZpF_o', title: 'Título 2', description: 'Descripción 2', credits: 'Créditos 2'},
            {id: 'x09D-9ZpF_o', title: 'Título 2', description: 'Descripción 2', credits: 'Créditos 2'},
            {id: 'x09D-9ZpF_o', title: 'Título 2', description: 'Descripción 2', credits: 'Créditos 2'},
            {id: 'x09D-9ZpF_o', title: 'Título 1', description: 'Descripción 1', credits: 'Créditos 1'},
            {id: 'x09D-9ZpF_o', title: 'Título 2', description: 'Descripción 2', credits: 'Créditos 2'},
            {id: 'x09D-9ZpF_o', title: 'Título 2', description: 'Descripción 2', credits: 'Créditos 2'},
            {id: 'x09D-9ZpF_o', title: 'Título 2', description: 'Descripción 2', credits: 'Créditos 2'},
            
            // Añade más videos aquí
        ];

        var carousel = document.getElementById('videoCarousel');
        var modal = document.getElementById('modal');
        var modalContent = document.getElementById('modalContent');

        videos.forEach(function(video) {
            var div = document.createElement('div');
            div.className = 'video';
            div.innerHTML = `
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <h2>${video.title}</h2>
                <p>${video.description}</p>
                <div class="credits"><strong>Créditos:</strong> ${video.credits}</div> 
            `;
            div.onclick = function() {
                modal.style.display = "block";
                modalContent.innerHTML = `
                    <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${video.id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    <h2>${video.title}</h2>
                    <p>${video.description}</p>
                    <div class="credits"><strong>Créditos:</strong> ${video.credits}</div>
                `;
            };
            carousel.appendChild(div);
        });

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
var themeSelect = document.getElementById('themeSelect');

// Cuando se cambia el tema
themeSelect.addEventListener('change', function() {
    // Obtiene todos los elementos a los que se les aplicará el cambio de tema
    var elements = document.querySelectorAll('p, body, main, mainTop, h1, h2, h3, h4, h5, h6, h7, h8, .avatar1, article, section, aside, panel');

    // Elimina las clases de las opciones antiguas
    elements.forEach(function(element) {
        element.classList.remove('theme1', 'theme2', 'space', 'starwars', 'jurassicworld', 'taylorswift');
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
        var elements = document.querySelectorAll('p, body, main, mainTop, h1, h2, h3, h4, h5, h6, h7, h8, .avatar1, article, section, aside, panel');
        elements.forEach(function(element) {
            element.classList.add(selectedTheme);
        });
        themeSelect.value = selectedTheme; // Asegúrate de que el menú desplegable muestre el tema correcto
    }
});
