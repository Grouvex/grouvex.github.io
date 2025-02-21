// Cuando se carga la página
window.addEventListener('load', () => {
  flower();
  sol();
  leaf();
  nieve();
  aniversario();
  googleTranslateElementInit();
});

// Funciones optimizadas para cada evento estacional
function flower() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
  if ((month === 2 && day >= 20) || (month === 2 && day <= 27)) {
    createElements('flower', 200, 3, 2, 7);
  }
}

function sol() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
  if ((month === 5 && day >= 21) || (month === 5 && day <= 28)) {
    createElements('sun', 200, 3, 2, 7);
  }
}

function leaf() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
  if ((month === 8 && day >= 20) || (month === 8 && day <= 30)) {
    createElements('leaf', 200, 3, 2, 7);
  }
}

function nieve() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
  if ((month >= 11 && day >= 1) || (month === 0 && day <= 5)) {
    createElements('snowflake', 250, 6, 2, 10);
  }
}

function aniversario() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
  if ((month === 6 && day >= 30) || (month === 7 && day <= 7)) {
    createElements('aniversario', 200, 3, 2, 7);
  }
}

// Función para crear elementos con animación
function createElements(className, count, animDurationBase, animDurationOffset, animDelay) {
  for (let i = 0; i < count; i++) {
    const element = document.createElement('div');
    element.className = className;
    element.style.left = `${Math.random() * window.innerWidth}px`;
    element.style.animationDuration = `${Math.random() * animDurationBase + animDurationOffset}s`;
    element.style.animationDelay = `${Math.random() * animDelay}s`;
    element.style.opacity = Math.random();
    element.style.transform = `scale(${Math.random()})`;
    document.body.appendChild(element);
  }
}

// Función para inicializar el elemento de Google Translate
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

// Datos de usuarios y sus insignias
const usuarios = {
  "Grouvex Studios": {
    principales: ["verified-team", "owner", "vdeveloper", "vbughunter"],
    secundarias: ["verified","vvadmin","vadmin", "vmod"]
  },
  "Grouvex Phoenix": {
    principales: ["verified-team", "vvadmin","owner-recording", "vdeveloper", "vbughunter", "diseñador"],
    secundarias: ["verified","vadmin", "vmod"]
  },
  "Tarlight Etherall": {
    principales: ["verified-team","admin","vvadmin", "vmod", "owner-designs", "diseñador"],
    secundarias: ["verified"]
  }
};

// Mostrar nombre de usuario y sus insignias
function mostrarUsuarioYInsignias(nombreUsuario, elements) {
  elements.forEach(element => {
    const spanNombre = document.createElement("span");
    spanNombre.textContent = nombreUsuario;
    element.appendChild(spanNombre);

    const spanInsigniasPrincipales = document.createElement("div");
    usuarios[nombreUsuario].principales.forEach(insignia => {
      const spanInsignia = document.createElement("span");
      spanInsignia.classList.add("insignia", insignia);
      spanInsigniasPrincipales.appendChild(spanInsignia);
    });
    element.appendChild(spanInsigniasPrincipales);

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
