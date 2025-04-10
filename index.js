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
        width: 300px;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        background: black;
        text-align: center;
        border-radius: 10px;
        z-index: 1000;
    }
    .modal img {
        width: 200px;
        height: auto;
    }
    .modal p {
        margin: 20px 0;
        color: white;
    }
    .modal button {
        padding: 5px 10px;
        margin: 3px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }
    .modal button.cancel {
        background-color: #ccc;
    }
    .modal button.continue {
        background-color: #4CAF50;
        color: white;
    }
`;
document.head.appendChild(style);
console.log("Estilos CSS del modal añadidos correctamente.");

// Variables globales para el modal
let modal, cancelButton, continueButton;
let targetLink = null;
let targetAttribute = null;
let isConfirmed = false; // Bandera para indicar si el usuario ha confirmado

// Dominios permitidos
const allowedDomains = ['grouvex.com', 'grouvex.github.io'];
console.log("Dominios permitidos:", allowedDomains);

// Función para verificar si un enlace es externo
function isExternalLink(href) {
    if (!href) {
        console.log("El enlace no tiene href.");
        return false;
    }
    try {
        const url = new URL(href, window.location.origin);
        const isExternal = !allowedDomains.includes(url.hostname);
        console.log(`Enlace: ${href}, ¿Es externo? ${isExternal}`);
        return isExternal;
    } catch (e) {
        console.log(`Error al procesar el enlace ${href}:`, e);
        return false; // Si no es una URL válida, no es un enlace externo
    }
}

// Función para manejar clics en elementos con href
function handleLinkClick(event) {
    console.log("Clic detectado en un elemento con href.");
    const element = event.target.closest('[href]'); // Busca el elemento más cercano con href
    if (element) {
        const href = element.getAttribute('href');
        console.log(`Enlace clickeado: ${href}`);

        // Verificar si el enlace es externo
        if (isExternalLink(href)) {
            console.log("El enlace es externo. Mostrando modal...");
            event.preventDefault(); // Evitar la acción predeterminada
            targetLink = href; // Guardar el enlace objetivo
            targetAttribute = element.getAttribute('target'); // Guardar el atributo target
            console.log(`Enlace objetivo: ${targetLink}, Atributo target: ${targetAttribute}`);

            // Si el modal no existe, crearlo
            if (!modal) {
                console.log("El modal no existe. Creándolo...");
                createModal();
            }
            modal.style.display = 'block'; // Mostrar el modal
        } else {
            console.log("El enlace no es externo. No se muestra el modal.");
        }
    } else {
        console.log("El clic no fue en un elemento con href.");
    }
}

// Función para crear el modal dinámicamente
function createModal() {
    console.log("Creando el modal...");
    const modalHTML = `
    <div id="customModal" class="modal">
        <img src="https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/Grouvex1.png" alt="Logo">
        <p>Estás a punto de salir de <n>Grouvex Studios</n>. Grouvex Studios no se responsabiliza por el contenido, la seguridad, las políticas de privacidad o las prácticas de los sitios de terceros, fuera del dominio, puesto que los Términos de Servicio y Políticas de Privacidad, de Grouvex Studios, solo tienen validez dentro del dominio o donde el equipo tenga permiso para actuar.</p>
            <p>Si le da a Cancelar, permanecerá dentro de Grouvex Studios.</p>
            <p>Si le da a Continuar, se le redirigirá a la página seleccionada.</p>
        <button class="cancel">Cancelar</button>
        <button class="continue">Continuar</button>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log("Modal creado y añadido al DOM.");

    // Obtener referencias a los elementos del modal
    modal = document.getElementById('customModal');
    cancelButton = modal.querySelector('.cancel');
    continueButton = modal.querySelector('.continue');

    // Event listener para el botón "Cancelar"
    cancelButton.addEventListener('click', function () {
        console.log("Botón Cancelar clickeado.");
        modal.style.display = 'none'; // Ocultar el modal
        targetLink = null; // Limpiar el enlace objetivo
        targetAttribute = null; // Limpiar el atributo target
        isConfirmed = false; // Reiniciar la bandera de confirmación
    });

    // Event listener para el botón "Continuar"
    continueButton.addEventListener('click', function () {
        console.log("Botón Continuar clickeado.");
        isConfirmed = true; // Establecer la bandera de confirmación
        if (targetLink) {
            console.log(`Redirigiendo a: ${targetLink}`);
            modal.style.display = 'none'; // Ocultar el modal primero

            // Redirigir según el atributo target
            if (targetAttribute === '_blank') {
                console.log("Abriendo en una nueva pestaña.");
                window.open(targetLink, '_blank'); // Abrir en una nueva pestaña
            } else {
                console.log("Abriendo en la misma pestaña.");
                window.location.href = targetLink; // Abrir en la misma pestaña
            }

            // Limpiar las variables
            targetLink = null;
            targetAttribute = null;
        } else {
            console.log("No hay enlace objetivo (targetLink es null).");
        }
    });
}

// Interceptar clics en todos los enlaces (incluso antes de que el DOM esté listo)
document.addEventListener('click', handleLinkClick);
console.log("Listener de clics añadido.");

// Interceptar redirecciones mediante JavaScript
const originalWindowOpen = window.open;
window.open = function (url, target, features) {
    console.log(`Interceptando window.open: ${url}`);
    if (isExternalLink(url) && !isConfirmed) {
        console.log("El enlace es externo. Mostrando modal...");
        targetLink = url;
        targetAttribute = target || '_self';
        console.log(`Enlace objetivo: ${targetLink}, Atributo target: ${targetAttribute}`);

        // Si el modal no existe, crearlo
        if (!modal) {
            console.log("El modal no existe. Creándolo...");
            createModal();
        }
        modal.style.display = 'block'; // Mostrar el modal
        return null; // Evitar que se abra la ventana inmediatamente
    }
    console.log("El enlace no es externo o ya fue confirmado. Redirigiendo normalmente.");
    return originalWindowOpen(url, target, features); // Redirigir normalmente si no es un enlace externo o ya fue confirmado
};
console.log("Interceptación de window.open configurada.");

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
        principales: ["verified-team", "owner", "vvadmin", "vdeveloper", "vbughunter","gsmember"],
        GSRecording: [],
        GSAnimation: [],
        GSDesign: []
    },
    "Grouvex Phoenix": {
        principales: ["verified-team", "vvadmin", "vdeveloper", "vbughunter", "verified"],
        GSRecording: ["owner-recording", "artista", "verified"],
        GSAnimation: ["verified"],
        GSDesign: ["diseñador", "verified"]
    },
    "Tarlight Etherall": {
        principales: ["verified-team", "admin", "artista"],
        GSRecording: ["vvadmin", "artista", "gsmember", "verified"],
        GSAnimation: [],
        GSDesign: ["owner-designs", "diseñador", "verified"]
    },
    "Maiki Dran": {
        principales: ["gsmember", "verified"],
        GSRecording: ["artista", "verified"],
        GSAnimation: [],
        GSDesign: []
    },
    "Clara Langa": {
        principales: ["gsmember", "verified"],
        GSRecording: ["artista", "verified"],
        GSAnimation: [],
        GSDesign: []
    },
    "Joshuatdepedro": {
        principales: ["verified"],
        GSRecording: ["artista"],
        GSAnimation: [],
        GSDesign: []
    }
};

function mostrarUsuarioYInsignias(nombreUsuario, elements) {
    elements.forEach(element => {
        // Mostrar nombre de usuario
        const spanNombre = document.createElement("span");
        spanNombre.textContent = nombreUsuario;
        element.appendChild(spanNombre);

        // Mostrar insignias principales
        const divPrincipales = document.createElement("div");
        divPrincipales.innerHTML = "Principales";
        usuarios[nombreUsuario].principales.forEach(insignia => {
            if (insignia) { // Solo agregar si la insignia no está vacía
                const spanInsignia = document.createElement("span");
                spanInsignia.classList.add("insignia", insignia);
                divPrincipales.appendChild(spanInsignia);
            }
        });
        element.appendChild(divPrincipales);

        function crearDetallesInsignias(titulo, categoria) {
            if (usuarios[nombreUsuario][categoria] && usuarios[nombreUsuario][categoria].length > 0 && usuarios[nombreUsuario][categoria][0] !== "") {
                const details = document.createElement("details");
                const summary = document.createElement("summary");
                summary.textContent = titulo;
                summary.style.fontSize = "10px";

                details.appendChild(summary);
                const divInsignias = document.createElement("div");
                usuarios[nombreUsuario][categoria].forEach(insignia => {
                    if (insignia) {
                        const spanInsignia = document.createElement("span");
                        spanInsignia.classList.add("insignia", insignia);
                        divInsignias.appendChild(spanInsignia);
                    }
                });
                details.appendChild(divInsignias);
                return details;
            }
            return null;
        }

        const gsRecordingDetails = crearDetallesInsignias("GSRecording", "GSRecording");
        if (gsRecordingDetails) element.appendChild(gsRecordingDetails);

        const gsAnimationDetails = crearDetallesInsignias("GSAnimation", "GSAnimation");
        if (gsAnimationDetails) element.appendChild(gsAnimationDetails);

        const gsDesignDetails = crearDetallesInsignias("GSDesign", "GSDesign");
        if (gsDesignDetails) element.appendChild(gsDesignDetails);
    });
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    Object.keys(usuarios).forEach(usuario => {
        const elements = document.querySelectorAll(`.${usuario.replace(/\s+/g, '-')}`);
        if (elements.length > 0) {
            mostrarUsuarioYInsignias(usuario, elements);
        }
    });
});
