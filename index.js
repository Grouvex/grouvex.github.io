// ============================================
// Código para manejar enlaces y el modal
// ============================================

// Crear el estilo CSS dinámicamente
const style = document.createElement('style');
style.innerHTML = `
.modal {
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 300px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    background: black;
    text-align: center;
    border-radius: 10px;
    z-index: 1000;
    margin: 20px;
    box-sizing: border-box;
}

.modal img {
    width: 100%;
    max-width: 200px;
    height: auto;
}

.modal p {
    margin: 20px 0;
    color: white;
    font-size: 14px;
}

.modal button {
    padding: 5px 10px;
    margin: 3px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal button.cancel {
    background: linear-gradient(45deg, red, blue);
}

.modal button.continue {
    background: linear-gradient(45deg, green, blue);
    color: white;
}
`;
document.head.appendChild(style);

// Crear el HTML del modal
const modalHTML = `
    <div id="customModal" class="modal">
        <img src="https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/Grouvex1.png" alt="Logo">
        <p>Estás a punto de salir de <n>Grouvex Studios</n>. Grouvex Studios no se responsabiliza por el contenido, la seguridad, las políticas de privacidad o las prácticas de los sitios de terceros, fuera del dominio, puesto que los Términos de Servicio y Políticas de Privacidad, de Grouvex Studios, solo tienen validez dentro del dominio o donde el equipo tenga permiso para actuar.</p>
        <ul><li>Si le da a Cancelar, permanecerá dentro de Grouvex Studios.</li><li>Si le da a Continuar, se le redirigirá a la página seleccionada.</li></ul>
        <button class="cancel">Cancelar</button>
        <button class="continue">Continuar</button>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', modalHTML);

// Obtener referencias a los elementos del modal
const modal = document.getElementById('customModal');
const cancelButton = modal.querySelector('.cancel');
const continueButton = modal.querySelector('.continue');
let targetLink = null;
let targetAttribute = null;

// Dominios permitidos
const allowedDomains = ['grouvex.com', 'grouvex.github.io'];

// Función para verificar si un enlace es externo
function isExternalLink(href) {
    if (!href) return false;
    try {
        const url = new URL(href, window.location.origin);
        return !allowedDomains.includes(url.hostname);
    } catch (e) {
        return false;
    }
}

// Función para manejar clics en elementos con href
function handleLinkClick(event) {
    const element = event.target.closest('[href]');
    if (element && isExternalLink(element.getAttribute('href'))) {
        event.preventDefault();
        targetLink = element.getAttribute('href');
        targetAttribute = element.getAttribute('target');
        modal.style.display = 'block';
    }
}

document.addEventListener('click', handleLinkClick);

// Interceptar redirecciones mediante JavaScript
const originalWindowOpen = window.open;
window.open = function(url, target, features) {
    if (isExternalLink(url)) {
        targetLink = url;
        targetAttribute = target || '_self';
        modal.style.display = 'block';
        return null;
    }
    return originalWindowOpen(url, target, features);
};

cancelButton.addEventListener('click', () => {
    modal.style.display = 'none';
    targetLink = null;
    targetAttribute = null;
});

continueButton.addEventListener('click', () => {
    if (targetLink) {
        if (targetAttribute === '_blank') {
            window.open(targetLink, '_blank');
        } else {
            window.location.href = targetLink;
        }
        modal.style.display = 'none';
        targetLink = null;
        targetAttribute = null;
    }
});

// ============================================
// Código para animaciones estacionales
// ============================================

window.addEventListener('load', () => {
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

// ============================================
// Código para Google Translate
// ============================================

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

// ============================================
// Código para insignias de usuarios
// ============================================

const usuarios = {
    "Grouvex Studios": {
        principales: ["verified-team", "owner", "vdeveloper", "vbughunter"],
        secundarias: ["verified", "vvadmin", "vadmin", "vmod"]
    },
    "Grouvex Phoenix": {
        principales: ["verified-team", "vvadmin", "owner-recording", "vdeveloper", "vbughunter", "artista", "diseñador"],
        secundarias: ["verified", "vadmin", "vmod"]
    },
    "Tarlight Etherall": {
        principales: ["verified-team", "admin", "vvadmin", "vmod", "owner-designs", "artista", "diseñador"],
        secundarias: ["verified"]
    }
};

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

Object.keys(usuarios).forEach(usuario => {
    const elements = document.querySelectorAll(`.${usuario.replace(/\s+/g, '-')}`);
    if (elements.length > 0) {
        mostrarUsuarioYInsignias(usuario, elements);
    }
}); 