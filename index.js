// Cuando se carga la página
window.addEventListener('load', function() {
    // Llama a todas las funciones que quieres ejecutar cuando se carga la página
    createConfeti();
    flower();
    sol();
    leaf();
    nieve();
    showNotification();
    openNav();
    closeNav();
});

function createConfeti() {
            var today = new Date();
            var month = today.getMonth();
            var day = today.getDate();

            if ((month >= 6 && day >= 31) || (month == 7 && day <= 7)) {
                const confeti = document.createElement('div');
                confeti.className = 'confeti';
                confeti.style.left = Math.random() * window.innerWidth + 'px';
                confeti.style.backgroundColor = getRandomColor();
                document.body.appendChild(confeti);
            }
        }

        function getRandomColor() {
            const colors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        setInterval(createConfeti, 500); // Agrega confeti cada 500 ms
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
  if ((month >= 4 && day >= 24) || (month == 0 && day <= 5)) {
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
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0px";
}
function showNotification() {
    document.getElementById("notification").style.display = "block";
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
                <section> 
                    <h2>${video.title}</h2>
                    <p>${video.description}</p>
                    <div class="credits"><strong>Créditos:</strong> ${video.credits}</div>
                </section> 
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
