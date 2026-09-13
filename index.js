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
    /* ============================================
       ESTILOS PARA INSIGNIAS (AÑADIR ESTO)
       ============================================ */
    
    .insignia {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin: 2px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        vertical-align: middle;
        border-radius: 3px;
    }
    
    /* Mapeo de insignias a imágenes */
    .insignia.verified { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified.png'); }
    .insignia.verified-team { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-team.png'); }
    .insignia.sistema { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/sistema.png'); }
    .insignia.verified-partner { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-partner.gif'); }
    .insignia.verified-bughunter { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-bughunter.gif'); }
    .insignia.artista { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/artista.gif'); }
    .insignia.GROUVEX { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png'); }
    .insignia.owner { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/owner.png'); }
    .insignia.vvadmin { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/vvadmin.gif'); }
    .insignia.vdeveloper { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/vdeveloper.gif'); }
    .insignia.vbughunter { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-bughunter.gif'); }
    .insignia.gsmember { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/gsmember.png'); }
    .insignia.admin { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/admin.png'); }
    .insignia.owner-recording { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/owner-recording.gif'); }
    .insignia.owner-designs { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/owner-designs.gif'); }
    .insignia.diseñador { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/diseñador.png'); }
    .insignia.verified-voice { background-image: url('https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-voice.gif'); }
    
    /* Estilos para detalles (si quieres mantener la funcionalidad de expandir) */
    details {
        margin: 5px 0;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.1);
    }
    
    summary {
        cursor: pointer;
        font-weight: bold;
        color: #666;
        font-size: 12px;
    }
    
    details div {
        margin-top: 5px;
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
    }
    
    /* Para elementos con clase de usuario */
    .Grouvex-Studios,
    .Grouvex-Phoenix,
    .Tarlight-Etherall,
    .Maiki-Dran,
    .Ángela {
        display: flex;
        align-items: center;
        padding: 5px;
        margin: 5px 0;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }
`;
document.head.appendChild(style);
console.log("Estilos CSS del modal añadidos correctamente.");

// ============================================
// CONFIGURACIÓN GOOGLE SHEETS
// ============================================

const SHEET_ID = '15FJWUFb6J52XDLbicgvTJmSCjJ0c0sRoWPpr5YFK5H8';
const SHEET_NAME = 'Respuestas de formulario 2';

// Mapeo de nombres de insignias a URLs
const INSIGNIAS_MAP = {
    'verified': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified.png',
    'verified-team': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-team.png',
    'sistema': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/sistema.png',
    'verified-partner': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-partner.gif',
    'verified-bughunter': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-bughunter.gif',
    'artista': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/artista.gif',
    'GROUVEX': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png',
    'owner': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/owner.png',
    'vvadmin': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/vvadmin.gif',
    'vdeveloper': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/vdeveloper.gif',
    'vbughunter': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-bughunter.gif',
    'gsmember': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/gsmember.png',
    'admin': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/admin.png',
    'owner-recording': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/owner-recording.gif',
    'owner-designs': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/owner-designs.gif',
    'diseñador': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/diseñador.png',
    'verified-voice': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-voice.gif'
};

// ============================================
// FUNCIONES PARA OBTENER DATOS DE GOOGLE SHEETS
// ============================================

/**
 * Obtiene todos los artistas desde Apps Script invocando `getAllArtists`.
 * @returns {Promise<Object>} Mapa de usuarios listo para ser procesado.
 */
async function obtenerUsuariosDesdeSheets() {
    console.log('📥 Obteniendo lista completa de artistas desde Apps Script...');

    return new Promise((resolve) => {
        google.script.run
            .withSuccessHandler((artistas) => {
                if (!Array.isArray(artistas) || artistas.length === 0) {
                    console.warn('⚠️ No se obtuvieron artistas desde la hoja');
                    resolve({});
                    return;
                }

                const usuarios = {};

                artistas.forEach((artista) => {
                    const nombreUsuario = artista.name || artista.id;

                    if (nombreUsuario) {
                        const insigniasArray = artista.insignias || [];
                        const insigniasAgrupadas = typeof agruparInsignias === 'function' 
                            ? agruparInsignias(insigniasArray) 
                            : {};

                        usuarios[nombreUsuario] = {
                            principales: insigniasAgrupadas.principales || [],
                            GSRecording: insigniasAgrupadas.gsRecording || [],
                            GSAnimation: insigniasAgrupadas.gsAnimation || [],
                            GSDesign: insigniasAgrupadas.gsDesign || [],
                            todasInsignias: insigniasArray,
                            isStaff: artista.isStaff || false,
                            id: artista.id,
                            datosRaw: artista.rowData
                        };
                    }
                });

                console.log(`📊 Artistas cargados desde Sheets: ${Object.keys(usuarios).length}`);
                resolve(usuarios);
            })
            .withFailureHandler((error) => {
                console.error('❌ Error al ejecutar google.script.run.getAllArtists:', error);
                resolve({});
            })
            .getAllArtists();
    });
}

/**
 * Agrupa las insignias según su categoría/tipo.
 * Compatible tanto con arreglos de objetos ({ url, name, ... }) como con arreglos de strings.
 * @param {Array<Object|string>} insigniasArray - Lista de insignias a clasificar.
 * @returns {Object} Objeto con las insignias agrupadas por categoría.
 */
function agruparInsignias(insigniasArray = []) {
    const grupos = {
        principales: [],
        gsRecording: [],
        gsAnimation: [],
        gsDesign: []
    };

    if (!Array.isArray(insigniasArray)) return grupos;

    insigniasArray.forEach(insignia => {
        // Extraer la cadena de texto para hacer la evaluación:
        // Si es un objeto usa .name o .url; si es un string usa directamente el valor.
        let textoEvaluacion = '';
        if (typeof insignia === 'string') {
            textoEvaluacion = insignia;
        } else if (insignia && typeof insignia === 'object') {
            textoEvaluacion = insignia.name || insignia.url || '';
        }

        const insigniaLower = textoEvaluacion.toLowerCase();

        // Clasificar insignias según su tipo
        if (insigniaLower.includes('recording') || 
            insigniaLower.includes('grabacion') || 
            insigniaLower.includes('artista') ||
            insigniaLower.includes('owner-recording')) {
            grupos.gsRecording.push(insignia);
        } else if (insigniaLower.includes('animation') || 
                   insigniaLower.includes('animacion') || 
                   insigniaLower.includes('animador')) {
            grupos.gsAnimation.push(insignia);
        } else if (insigniaLower.includes('design') || 
                   insigniaLower.includes('diseño') || 
                   insigniaLower.includes('diseñador') ||
                   insigniaLower.includes('owner-designs')) {
            grupos.gsDesign.push(insignia);
        } else {
            grupos.principales.push(insignia);
        }
    });

    return grupos;
}

// ============================================
// FUNCIÓN PARA MOSTRAR USUARIOS E INSIGNIAS
// ============================================

/**
 * Helper para renderizar un elemento de insignia individual.
 * Soporta tanto objetos de insignia ({ url, name, ... }) como strings (clases o URLs).
 */
function crearElementoInsignia(insignia) {
    if (!insignia) return null;

    // Si la insignia contiene una URL directa de imagen
    const url = typeof insignia === 'object' ? insignia.url : (insignia.startsWith('http') ? insignia : null);
    const nombre = typeof insignia === 'object' ? insignia.name : insignia;

    if (url) {
        const img = document.createElement("img");
        img.src = url;
        img.alt = nombre || "Insignia";
        img.title = nombre || "Insignia";
        img.classList.add("insignia-img");
        img.style.height = '20px';
        img.style.verticalAlign = 'middle';
        img.style.margin = '0 2px';
        return img;
    } else {
        const span = document.createElement("span");
        span.classList.add("insignia", nombre.toString().toLowerCase().replace(/\s+/g, '-'));
        span.title = nombre;
        span.style.marginLeft = '2px';
        return span;
    }
}

/**
 * Helper para crear el componente extensible <details> de una categoría.
 */
function crearDetallesInsignias(titulo, insigniasArray) {
    if (!Array.isArray(insigniasArray) || insigniasArray.length === 0) return null;

    const details = document.createElement("details");
    details.style.marginLeft = '10px';
    details.style.display = 'inline-block';

    const summary = document.createElement("summary");
    summary.textContent = titulo;
    summary.style.fontSize = "10px";
    summary.style.cursor = 'pointer';
    details.appendChild(summary);

    const divInsignias = document.createElement("div");
    divInsignias.style.display = 'flex';
    divInsignias.style.flexWrap = 'wrap';
    divInsignias.style.gap = '2px';
    divInsignias.style.marginTop = '5px';

    insigniasArray.forEach(insignia => {
        const elInsignia = crearElementoInsignia(insignia);
        if (elInsignia) divInsignias.appendChild(elInsignia);
    });

    details.appendChild(divInsignias);
    return details;
}

/**
 * Muestra el usuario y sus insignias en los elementos DOM dados.
 */
function mostrarUsuarioYInsignias(nombreUsuario, usuarioData, elements) {
    if (!elements || elements.length === 0) return;

    elements.forEach(element => {
        // Limpiar el contenido anterior
        element.textContent = '';

        // Usamos DocumentFragment para evitar re-renderizados múltiples en el DOM
        const fragment = document.createDocumentFragment();

        // 1. Nombre de usuario
        const spanNombre = document.createElement("span");
        spanNombre.textContent = nombreUsuario;
        spanNombre.style.fontWeight = 'bold';
        spanNombre.style.marginRight = '10px';
        fragment.appendChild(spanNombre);

        // 2. Insignias principales
        if (Array.isArray(usuarioData.principales) && usuarioData.principales.length > 0) {
            const divPrincipales = document.createElement("div");
            divPrincipales.style.display = 'inline-block';

            usuarioData.principales.forEach(insignia => {
                const elInsignia = crearElementoInsignia(insignia);
                if (elInsignia) divPrincipales.appendChild(elInsignia);
            });

            fragment.appendChild(divPrincipales);
        }

        // 3. Renderizado en bucle de las categorías secundarias
        const categorias = [
            { titulo: 'GSRecording', data: usuarioData.GSRecording },
            { titulo: 'GSAnimation', data: usuarioData.GSAnimation },
            { titulo: 'GSDesign', data: usuarioData.GSDesign }
        ];

        categorias.forEach(({ titulo, data }) => {
            const detailsEl = crearDetallesInsignias(titulo, data);
            if (detailsEl) fragment.appendChild(detailsEl);
        });

        // Insertar todo de una sola vez al DOM
        element.appendChild(fragment);
    });
}

// ============================================
// CÓDIGO PRINCIPAL PARA INSIGNIAS
// ============================================

/**
 * Normaliza un texto para usarlo de forma segura como clase CSS.
 * Reemplaza espacios por guiones y escapa caracteres especiales para querySelector.
 */
function normalizarClaseUsuario(nombre) {
    if (!nombre) return '';
    // Reemplaza secuencias de espacios por guiones
    const nombreLimpio = nombre.trim().replace(/\s+/g, '-');
    // Escapa caracteres especiales válidos para selectores CSS
    return window.CSS && CSS.escape ? CSS.escape(nombreLimpio) : nombreLimpio;
}

/**
 * Inicializa la renderización de insignias para los usuarios encontrados en el DOM.
 */
async function inicializarInsigniasUsuarios() {
    console.log('🚀 Inicializando sistema de insignias...');
    
    try {
        // Obtener datos de Google Sheets
        const usuarios = await obtenerUsuariosDesdeSheets();
        
        const nombresUsuarios = Object.keys(usuarios);

        if (nombresUsuarios.length === 0) {
            console.warn('⚠️ No se encontraron usuarios en Google Sheets');
            return;
        }
        
        console.log(`✅ Datos cargados de ${nombresUsuarios.length} usuarios.`);

        let usuariosRenderizados = 0;

        // Recorrer los usuarios obtenidos de Sheets
        nombresUsuarios.forEach(usuario => {
            const nombreClase = normalizarClaseUsuario(usuario);
            if (!nombreClase) return;

            // Búsqueda segura en el DOM
            const elements = document.querySelectorAll(`.${nombreClase}`);
            
            if (elements.length > 0) {
                console.log(`👤 Mostrando insignias para: ${usuario} (${elements.length} elemento(s) encontrado(s))`);
                mostrarUsuarioYInsignias(usuario, usuarios[usuario], elements);
                usuariosRenderizados++;
            }
        });

        console.log(`✨ Finalizado. Se actualizaron ${usuariosRenderizados} usuarios en el DOM.`);

    } catch (error) {
        console.error('❌ Error general al inicializar las insignias de usuarios:', error);
    }
}

// ============================================
// INICIALIZACIÓN CUANDO EL DOM ESTÁ LISTO
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    console.log('📄 DOM cargado, inicializando insignias...');
    inicializarInsigniasUsuarios();
});
