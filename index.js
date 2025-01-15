// Cuando se carga la página
window.addEventListener('load', function() {
  flower();
  sol();
  leaf();
  nieve();
  aniversario();
  googleTranslateElementInit();
});

function flower() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // Comprueba si es la primera semana de primavera (20 de marzo - 27 de marzo)
  if ((month === 2 && day >= 20) || (month === 2 && day <= 27)) {
    for (let i = 0; i < 200; i++) {
      const flower = document.createElement('div');
      flower.className = 'flower';
      flower.style.left = `${Math.random() * window.innerWidth}px`;
      flower.style.animationDuration = `${Math.random() * 3 + 2}s`;
      flower.style.animationDelay = `${Math.random() * 7}s`;
      flower.style.opacity = Math.random();
      flower.style.transform = `scale(${Math.random()})`;
      document.body.appendChild(flower);
    }
  }
}

function sol() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // Comprueba si es verano (21 de junio - 28 de junio)
  if ((month === 5 && day >= 21) || (month === 5 && day <= 28)) {
    for (let i = 0; i < 200; i++) {
      const sun = document.createElement('div');
      sun.className = 'sun';
      sun.style.left = `${Math.random() * window.innerWidth}px`;
      sun.style.animationDuration = `${Math.random() * 3 + 2}s`;
      sun.style.animationDelay = `${Math.random() * 7}s`;
      sun.style.opacity = Math.random();
      sun.style.transform = `scale(${Math.random()})`;
      document.body.appendChild(sun);
    }
  }
}

function leaf() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // Comprueba si es la primera semana de otoño (20 de septiembre - 27 de septiembre)
  if ((month === 8 && day >= 20) || (month === 8 && day <= 30)) {
    for (let i = 0; i < 200; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.style.left = `${Math.random() * window.innerWidth}px`;
      leaf.style.animationDuration = `${Math.random() * 3 + 2}s`;
      leaf.style.animationDelay = `${Math.random() * 7}s`;
      leaf.style.opacity = Math.random();
      leaf.style.transform = `scale(${Math.random()})`;
      document.body.appendChild(leaf);
    }
  }
}

function nieve() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // Comprueba si es Navidad (1 de diciembre - 5 de enero)
  if ((month >= 11 && day >= 1) || (month === 0 && day <= 5)) {
    for (let i = 0; i < 250; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.style.left = `${Math.random() * window.innerWidth}px`;
      snowflake.style.animationDuration = `${Math.random() * 2 + 6}s`;
      snowflake.style.animationDelay = `${Math.random() * 10}s`;
      snowflake.style.opacity = Math.random();
      snowflake.style.transform = `scale(${Math.random()})`;
      document.body.appendChild(snowflake);
    }
  }
}

function aniversario() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // Comprueba si es la ultima semana de julio (30 de julio - 7 de agosto)
  if ((month === 6 && day >= 30) || (month === 7 && day <= 7)) {
    for (let i = 0; i < 200; i++) {
      const aniversario = document.createElement('div');
      aniversario.className = 'aniversario';
      aniversario.style.left = `${Math.random() * window.innerWidth}px`;
      aniversario.style.animationDuration = `${Math.random() * 3 + 2}s`;
      aniversario.style.animationDelay = `${Math.random() * 7}s`;
      aniversario.style.opacity = Math.random();
      aniversario.style.transform = `scale(${Math.random()})`;
      document.body.appendChild(aniversario);
    }
  }
}

function googleTranslateElementInit() {
  if (typeof google !== 'undefined' && google.translate) {
    new google.translate.TranslateElement({
      pageLanguage: 'es',
      includedLanguages: 'es,en,fr,de,it,pt,zh-CN,ja,ko,ru,ar',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  } else {
    console.error("Google Translate API no está disponible.");
  }
}
// Cuando se carga la página
window.addEventListener('load', function() {
  flower();
  sol();
  leaf();
  nieve();
  aniversario();
  googleTranslateElementInit();
});

function flower() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // Comprueba si es la primera semana de primavera (20 de marzo - 27 de marzo)
  if ((month === 2 && day >= 20) || (month === 2 && day <= 27)) {
    for (let i = 0; i < 200; i++) {
      const flower = document.createElement('div');
      flower.className = 'flower';
      flower.style.left = `${Math.random() * window.innerWidth}px`;
      flower.style.animationDuration = `${Math.random() * 3 + 2}s`;
      flower.style.animationDelay = `${Math.random() * 7}s`;
      flower.style.opacity = Math.random();
      flower.style.transform = `scale(${Math.random()})`;
      document.body.appendChild(flower);
    }
  }
}

function sol() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // Comprueba si es verano (21 de junio - 28 de junio)
  if ((month === 5 && day >= 21) || (month === 5 && day <= 28)) {
    for (let i = 0; i < 200; i++) {
      const sun = document.createElement('div');
      sun.className = 'sun';
      sun.style.left = `${Math.random() * window.innerWidth}px`;
      sun.style.animationDuration = `${Math.random() * 3 + 2}s`;
      sun.style.animationDelay = `${Math.random() * 7}s`;
      sun.style.opacity = Math.random();
      sun.style.transform = `scale(${Math.random()})`;
      document.body.appendChild(sun);
    }
  }
}

function leaf() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // Comprueba si es la primera semana de otoño (20 de septiembre - 27 de septiembre)
  if ((month === 8 && day >= 20) || (month === 8 && day <= 30)) {
    for (let i = 0; i < 200; i++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.style.left = `${Math.random() * window.innerWidth}px`;
      leaf.style.animationDuration = `${Math.random() * 3 + 2}s`;
      leaf.style.animationDelay = `${Math.random() * 7}s`;
      leaf.style.opacity = Math.random();
      leaf.style.transform = `scale(${Math.random()})`;
      document.body.appendChild(leaf);
    }
  }
}

function nieve() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // Comprueba si es Navidad (1 de diciembre - 5 de enero)
  if ((month >= 11 && day >= 1) || (month === 0 && day <= 5)) {
    for (let i = 0; i < 250; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.style.left = `${Math.random() * window.innerWidth}px`;
      snowflake.style.animationDuration = `${Math.random() * 2 + 6}s`;
      snowflake.style.animationDelay = `${Math.random() * 10}s`;
      snowflake.style.opacity = Math.random();
      snowflake.style.transform = `scale(${Math.random()})`;
      document.body.appendChild(snowflake);
    }
  }
}

function aniversario() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();

  // Comprueba si es la ultima semana de julio (30 de julio - 7 de agosto)
  if ((month === 6 && day >= 30) || (month === 7 && day <= 7)) {
    for (let i = 0; i < 200; i++) {
      const aniversario = document.createElement('div');
      aniversario.className = 'aniversario';
      aniversario.style.left = `${Math.random() * window.innerWidth}px`;
      aniversario.style.animationDuration = `${Math.random() * 3 + 2}s`;
      aniversario.style.animationDelay = `${Math.random() * 7}s`;
      aniversario.style.opacity = Math.random();
      aniversario.style.transform = `scale(${Math.random()})`;
      document.body.appendChild(aniversario);
    }
  }
}

function googleTranslateElementInit() {
  if (typeof google !== 'undefined' && google.translate) {
    new google.translate.TranslateElement({
      pageLanguage: 'es',
      includedLanguages: 'es,en,fr,de,it,pt,zh-CN,ja,ko,ru,ar',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
  } else {
    console.error("Google Translate API no está disponible.");
  }
}
// Variables
const usuarios = {
    "Grouvex Studios": {
        principales: ["verified", "owner", "vadmin", "vdeveloper", "vbughunter"],
        secundarias: ["vmod"]
    },
    "Grouvex Phoenix": {
        principales: ["verified", "vadmin", "vdeveloper", "vbughunter"],
        secundarias: ["vmod"]
    },
    "Tarlight Etherall": {
        principales: ["verified", "vmod"],
        secundarias: ["admin", "diseñador"]
    }
};

// Función para mostrar el nombre de usuario y las insignias
function mostrarUsuarioYInsignias(nombreUsuario, elements) {
    elements.forEach(element => {
        const spanNombre = document.createElement("span");
        spanNombre.textContent = nombreUsuario;
        element.appendChild(spanNombre);

        // Insignias principales
        const spanInsigniasPrincipales = document.createElement("div");
        usuarios[nombreUsuario].principales.forEach(insignia => {
            const spanInsignia = document.createElement("span");
            spanInsignia.classList.add("insignia", insignia);
            spanInsigniasPrincipales.appendChild(spanInsignia);
        });
        element.appendChild(spanInsigniasPrincipales);

        // Insignias secundarias en un details-summary
        const detailsSecundarias = document.createElement("details");
        const summarySecundarias = document.createElement("summary");
        summarySecundarias.textContent = "Insignias Secundarias";
        summarySecundarias.style.fontSize = "10px";
        
        detailsSecundarias.appendChild(summarySecundarias);
        const spanInsigniasSecundarias = document.createElement("div");
        usuarios[nombreUsuario].secundarias.forEach(insignia => {
            const spanInsignia = document.createElement("span");
            spanInsignia.classList.add("insignia", insignia);
            spanInsigniasSecundarias.appendChild(spanInsignia);
        });
        detailsSecundarias.appendChild(spanInsigniasSecundarias);
        element.appendChild(detailsSecundarias);
    });
}

// Llamar a la función cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
    Object.keys(usuarios).forEach(usuario => {
        const elements = document.querySelectorAll(`.${usuario.replace(/\s+/g, '-')}`);
        if (elements.length > 0) {
            mostrarUsuarioYInsignias(usuario, elements);
        }
    });
});
