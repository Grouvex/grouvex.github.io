// ============================================
// PROTECCIÓN ANTI-INSPECCIÓN
// ============================================
// !function(){'use strict';document.addEventListener('keydown',e=>{((e.ctrlKey&&e.shiftKey&&['I','J','C','K'].includes(e.key))||['F12','F8'].includes(e.key)||(e.ctrlKey&&['U','S'].includes(e.key.toUpperCase())))&&(e.preventDefault(),e.stopImmediatePropagation())},!0),document.addEventListener('contextmenu',e=>{e.preventDefault(),e.stopImmediatePropagation()},!0),document.addEventListener('selectstart',e=>e.preventDefault(),!0),setInterval(()=>{(window.outerWidth-window.innerWidth>100||window.outerHeight-window.innerHeight>100)},1e3)}();

// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================
const firebaseConfig = {
    apiKey: "AIzaSyAgoQ_Px3hHVrevUsyct_FBeXWMDKXpPSw",
    authDomain: "grouvex-studios.firebaseapp.com",
    databaseURL: "https://grouvex-studios-default-rtdb.firebaseio.com",
    projectId: "grouvex-studios",
    storageBucket: "grouvex-studios.appspot.com",
    messagingSenderId: "1070842606062",
    appId: "1:1070842606062:web:5d887863048fd100b49eff",
    measurementId: "G-75BR8D2CR3"
};

// Inicializar Firebase
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const database = firebase.database();

// ============================================
// CONFIGURACIÓN INSIGNIAS
// ============================================

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQBy3U9WSBBYfo9C-etH3KYe3_b9B_W1i40-XE6vUgatP16slZDnXtokxs25l80VBWjg/exec';
const URL_BASE_INSIGNIAS = 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/';

// ============================================
// VARIABLES GLOBALES
// ============================================
let isLoginMode = true;

// ============================================
// NOTIFICACIONES
// ============================================
function mostrarNotificacion(mensaje, esError = false) {
    const notificacion = document.createElement("div");
    notificacion.textContent = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${esError ? '#ff4444' : '#4CAF50'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        max-width: 300px;
        text-align: center;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 4000);
}

// ============================================
// AUTENTICACIÓN
// ============================================
async function handleEmailAuth(email, password, isLogin) {
    const submitBtn = document.getElementById('authButton');
    const originalText = submitBtn?.querySelector('#authBtnText')?.innerText || 'Enviando';
    
    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('#authBtnText');
            if (btnText) btnText.innerText = 'Cargando...';
        }
        
        if (isLogin) {
            await auth.signInWithEmailAndPassword(email, password);
            mostrarNotificacion('✅ Inicio de sesión exitoso');
            window.location.href = '/';
        } else {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const displayName = document.getElementById('authDisplayName')?.value.trim() || email.split('@')[0];
            
            await userCredential.user.updateProfile({ displayName: displayName });
            
            await database.ref(`users/${userCredential.user.uid}`).set({
                email: email,
                displayName: displayName,
                photoURL: "https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png",
                insignias: "", // Campo para insignias (ej: "https://.../verified-staff.png")
                createdAt: Date.now()
            });
            
            mostrarNotificacion('✅ Registro exitoso!');
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Error:', error);
        let mensaje = error.message;
        if (error.code === 'auth/user-not-found') mensaje = '❌ Usuario no encontrado';
        if (error.code === 'auth/wrong-password') mensaje = '❌ Contraseña incorrecta';
        if (error.code === 'auth/email-already-in-use') mensaje = '❌ Este correo ya está registrado';
        if (error.code === 'auth/weak-password') mensaje = '❌ Contraseña débil (mínimo 6 caracteres)';
        if (error.code === 'auth/invalid-email') mensaje = '❌ Email inválido';
        mostrarNotificacion(mensaje, true);
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            const btnText = submitBtn.querySelector('#authBtnText');
            if (btnText) btnText.innerText = originalText;
        }
    }
}

async function handleGoogleLogin() {
    const googleBtn = document.getElementById('googleLoginBtn');
    
    try {
        if (googleBtn) {
            googleBtn.disabled = true;
            googleBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        }
        
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);
        
        await database.ref(`users/${result.user.uid}`).set({
            email: result.user.email,
            displayName: result.user.displayName || result.user.email.split('@')[0],
            photoURL: result.user.photoURL || "https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png",
            insignias: "",
            createdAt: Date.now()
        });
        
        mostrarNotificacion('✅ Inicio con Google exitoso');
        window.location.href = '/';
    } catch (error) {
        let mensaje = error.message;
        if (error.code === 'auth/popup-blocked') mensaje = '❌ Habilita ventanas emergentes';
        mostrarNotificacion(mensaje, true);
    } finally {
        if (googleBtn) {
            googleBtn.disabled = false;
            googleBtn.innerHTML = '<i class="fab fa-google"></i> Google';
        }
    }
}

// ============================================
// TOGGLE LOGIN/REGISTRO
// ============================================
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const formTitle = document.getElementById('formTitle');
    const authBtnText = document.getElementById('authBtnText');
    const toggleModeBtn = document.getElementById('toggleModeBtn');
    const displayNameGroup = document.getElementById('displayNameGroup');
    
    if (formTitle) formTitle.textContent = isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
    if (authBtnText) authBtnText.textContent = isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
    if (toggleModeBtn) toggleModeBtn.textContent = isLoginMode ? 'Registrarse' : 'Iniciar Sesión';
    if (displayNameGroup) displayNameGroup.style.display = isLoginMode ? 'none' : 'block';
}

// ============================================
// PERFIL DE USUARIO
// ============================================
async function updateProfileUI(user) {
    if (!user) return;
    
    const correoElement = document.getElementById('correoElectronico');
    const userIDElement = document.getElementById('userID');
    const usuarioElement = document.querySelector('.usuario');
    const fotoPerfil = document.getElementById('fotoPerfil');
    
    if (correoElement) correoElement.textContent = user.email || 'Sin email';
    if (userIDElement) userIDElement.textContent = `GS-${user.uid}`;
    if (usuarioElement) usuarioElement.textContent = user.displayName || 'Usuario';
    if (fotoPerfil) {
        const snapshot = await database.ref(`users/${user.uid}/photoURL`).once('value');
        fotoPerfil.src = snapshot.val() || user.photoURL || "https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png";
    }
}

// ============================================
// ELIMINAR CUENTA
// ============================================
async function handleAccountDeletion() {
    const user = auth.currentUser;
    if (!user) {
        mostrarNotificacion('❌ Debes iniciar sesión', true);
        return;
    }
    
    const input = prompt('Escribe "ELIMINAR" para confirmar:');
    if (input !== 'ELIMINAR') {
        mostrarNotificacion('❌ Cancelado', true);
        return;
    }
    
    try {
        await database.ref(`users/${user.uid}`).remove();
        await user.delete();
        mostrarNotificacion('🔥 Cuenta eliminada');
        window.location.href = '/';
    } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
            mostrarNotificacion('❌ Inicia sesión nuevamente', true);
            auth.signOut();
        } else {
            mostrarNotificacion(`❌ Error: ${error.message}`, true);
        }
    }
}

// ============================================
// FUNCIONES PARA OBTENER DATOS DEL USUARIO DESDE GOOGLE SHEETS (OPTIMIZADA)
// ============================================

// Cache para datos de la API (válido por 5 minutos)
let apiDataCache = null;
let apiCacheTime = 0;
const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

async function obtenerDatosUsuarioPorUserID(userID) {
    try {
        if (!userID || userID.trim() === '') {
            return null;
        }
        
        const searchUserID = userID.replace(/^GS-/i, '').trim();
        
        // Obtener datos de la API (con caché)
        let jsonData;
        const now = Date.now();
        
        if (apiDataCache && (now - apiCacheTime) < API_CACHE_DURATION) {
            jsonData = apiDataCache;
            console.log('📦 Usando caché de API');
        } else {
            console.log('🌐 Consultando API...');
            const url = `${APPS_SCRIPT_URL}?timestamp=${now}`;
            const response = await fetch(url);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const text = await response.text();
            jsonData = JSON.parse(text);
            
            if (jsonData.success) {
                apiDataCache = jsonData;
                apiCacheTime = now;
            }
        }
        
        if (!jsonData?.success) {
            console.error('❌ Error en API:', jsonData?.error);
            return null;
        }
        
        const headers = jsonData.headers || [];
        const data = jsonData.data || [];
        
        // Pre-calcular índices (solo la primera vez)
        if (!window._columnIndices) {
            window._columnIndices = {
                userID: -1,
                insignias: -1,
                nombre: -1,
                email: -1
            };
            
            headers.forEach((header, index) => {
                const headerStr = header?.toString()?.toLowerCase() || '';
                
                if (window._columnIndices.userID === -1 && headerStr.includes('grouvex studios userid')) {
                    window._columnIndices.userID = index;
                }
                if (window._columnIndices.insignias === -1 && headerStr === 'insignias') {
                    window._columnIndices.insignias = index;
                }
                if (window._columnIndices.nombre === -1 && 
                    (headerStr.includes('nombre de usuario') || 
                     headerStr.includes('nombre del cliente') ||
                     headerStr.includes('nombre y apellidos reales') ||
                     headerStr.includes('nombre del artista/banda'))) {
                    window._columnIndices.nombre = index;
                }
                if (window._columnIndices.email === -1 && headerStr.includes('email')) {
                    window._columnIndices.email = index;
                }
            });
            
            // Búsqueda secundaria de nombre
            if (window._columnIndices.nombre === -1) {
                headers.forEach((header, index) => {
                    const headerStr = header?.toString()?.toLowerCase() || '';
                    if (window._columnIndices.nombre === -1 && headerStr.includes('nombre')) {
                        window._columnIndices.nombre = index;
                    }
                });
            }
        }
        
        const indices = window._columnIndices;
        
        if (indices.userID === -1) {
            console.error('❌ No se encontró columna UserID');
            return null;
        }
        
        // Búsqueda más rápida usando find
        const row = data.find(row => {
            const rowUserID = row[indices.userID]?.toString().trim() || '';
            if (!rowUserID) return false;
            const normalizedRowUserID = rowUserID.replace(/^GS-/i, '').trim();
            return normalizedRowUserID.toLowerCase() === searchUserID.toLowerCase();
        });
        
        if (row) {
            console.log(`✅ Usuario encontrado`);
            return {
                userID: userID,
                nombre: indices.nombre !== -1 ? (row[indices.nombre]?.toString().trim() || 'Usuario') : 'Usuario',
                email: indices.email !== -1 ? (row[indices.email]?.toString().trim() || 'Sin email') : 'Sin email',
                insignias: indices.insignias !== -1 ? (row[indices.insignias]?.toString().trim() || '') : ''
            };
        }
        
        console.log('❌ Usuario no encontrado');
        return null;
        
    } catch (error) {
        console.error('❌ Error:', error);
        return null;
    }
}

// ============================================
// FUNCIONES PARA PROCESAR INSIGNIAS (OPTIMIZADA)
// ============================================

function procesarInsignias(textoInsignias) {
    if (!textoInsignias || textoInsignias.trim() === '') {
        return [];
    }
    
    const texto = textoInsignias.trim().toLowerCase();
    
    // Verificaciones rápidas
    const textosVacios = ['ninguna', 'sin insignias', 'n/a', 'no aplica'];
    if (textosVacios.includes(texto)) {
        return [];
    }
    
    const insignias = [];
    const separadores = /[,;]+/;
    const partes = texto.split(separadores);
    
    // Procesar cada parte (evitar regex innecesarias dentro del loop)
    for (const parte of partes) {
        const urlLimpia = parte.trim();
        if (!urlLimpia) continue;
        
        // Verificar dominio rápidamente
        let esHostPermitido = false;
        if (urlLimpia.includes('githubusercontent.com')) {
            esHostPermitido = true;
        } else {
            try {
                const host = new URL(urlLimpia).hostname.toLowerCase();
                esHostPermitido = host === 'githubusercontent.com' || host.endsWith('.githubusercontent.com');
            } catch (e) {
                continue;
            }
        }
        
        if (!esHostPermitido) continue;
        
        // Verificar extensión
        const tieneExtension = /\.(png|gif|jpg|jpeg|webp|svg)([\?#].*)?$/i.test(urlLimpia);
        if (!tieneExtension) continue;
        
        insignias.push({
            url: urlLimpia,
            nombre: extraerNombreInsignia(urlLimpia),
            tipo: determinarTipoInsignia(urlLimpia)
        });
    }
    
    return insignias;
}

function extraerNombreInsignia(url) {
    try {
        const urlDecodificada = decodeURIComponent(url);
        const nombreArchivo = urlDecodificada.split('/').pop();
        const nombreSinExtension = nombreArchivo.split('.')[0];
        
        return nombreSinExtension
            .replace(/%20/g, ' ')
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/verified/g, 'Verified ')
            .replace(/owner/g, 'Owner ')
            .replace(/employee/g, 'Employee ')
            .replace(/moderator/g, 'Moderator ')
            .replace(/developer/g, 'Developer ')
            .replace(/bughunter/g, 'Bug Hunter ')
            .replace(/partner/g, 'Partner ')
            .replace(/team/g, 'Team ')
            .replace(/recording/g, 'Recording ')
            .replace(/designs/g, 'Designs ')
            .replace(/animations/g, 'Animations ')
            .replace(/sistema/g, 'Sistema ')
            .replace(/grouvex/g, 'Grouvex ')
            .replace(/gco/g, 'GCO')
            .replace(/^\s+|\s+$/g, '')
            .toUpperCase();
    } catch (e) {
        return 'INSIGNIA';
    }
}

function determinarTipoInsignia(url) {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('.gif')) return 'animada';
    if (urlLower.includes('.png')) return 'estatica';
    if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) return 'imagen';
    if (urlLower.includes('.svg')) return 'vectorial';
    
    return 'desconocido';
}

function crearElementoInsignia(insignia, index) {
    const container = document.createElement('div');
    container.className = 'insignia-item';
    container.dataset.tipo = insignia.tipo;
    container.dataset.nombre = insignia.nombre;
    container.style.cssText = `
        display: inline-block;
        margin: 5px;
        position: relative;
        animation: fadeIn 0.5s ease ${index * 0.1}s forwards;
        opacity: 0;
        transform-origin: center;
    `;
    
    const img = document.createElement('img');
    img.src = insignia.url;
    img.alt = insignia.nombre;
    img.title = insignia.nombre;
    img.loading = 'lazy';
    
    let estilosBase = `
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: 2px solid rgba(255, 255, 255, 0.15);
        transition: all 0.3s ease;
        cursor: pointer;
        object-fit: contain;
        background: rgba(255, 255, 255, 0.05);
    `;
    
    if (insignia.tipo === 'animada') {
        estilosBase += `
            border-color: rgba(255, 215, 0, 0.3);
            box-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
        `;
    } else if (insignia.tipo === 'vectorial') {
        estilosBase += `
            border-color: rgba(0, 150, 255, 0.3);
        `;
    }
    
    img.style.cssText = estilosBase;
    
    img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.2)';
        img.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.4)';
        img.style.borderColor = 'gold';
    });
    
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.boxShadow = insignia.tipo === 'animada' 
            ? '0 0 5px rgba(255, 215, 0, 0.2)' 
            : 'none';
        img.style.borderColor = insignia.tipo === 'animada' 
            ? 'rgba(255, 215, 0, 0.3)' 
            : insignia.tipo === 'vectorial'
            ? 'rgba(0, 150, 255, 0.3)'
            : 'rgba(255, 255, 255, 0.15)';
    });
    
    img.addEventListener('error', () => {
        console.error(`❌ Error cargando insignia: ${insignia.url}`);
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0icmdiYSgwLCAwLCAwLCAwLjEpIi8+CjxwYXRoIGQ9Ik0xNiAxMEgyMlYxNkgxNlYxMFpNMTYgMThIMjJWMjRIMTZWMThaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz4KPHBhdGggZD0iTTEwIDEwSDIyVjIySDEwVjEwWk0xMiAxMlYyMEgyMFYxMkgxMloiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjciIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=';
        img.title = `❌ Error cargando: ${insignia.nombre}`;
    });
    
    container.appendChild(img);
    return container;
}

// ============================================
// FUNCIONES PARA MOSTRAR DATOS E INSIGNIAS (OPTIMIZADA)
// ============================================

// Cache para almacenar datos de usuarios ya consultados
const userDataCache = new Map();
const userImageCache = new Map();

async function mostrarDatosEInsigniasEnElemento(elementoTigsID) {
    try {
        const userID = elementoTigsID.getAttribute('tigsID');
        if (!userID) {
            console.log('❌ Elemento sin tigsID válido');
            return;
        }
        
        // Evitar procesar el mismo elemento múltiples veces
        if (elementoTigsID.dataset.procesado === 'true') {
            console.log(`⏩ Elemento ya procesado: ${userID}`);
            return;
        }
        
        elementoTigsID.dataset.procesado = 'true';
        console.log(`🎯 Procesando: ${userID}`);
        
        // Mostrar loading solo si no tiene contenido
        if (!elementoTigsID.textContent || elementoTigsID.textContent === '') {
            elementoTigsID.textContent = 'Cargando...';
            elementoTigsID.style.cssText = 'color: #888; font-style: italic;';
        }
        
        // Buscar contenedor de insignias (una sola vez)
        const contenedorInsignias = elementoTigsID.closest('div, .user-info')?.querySelector('.insignias-container');
        
        // Obtener datos (con caché)
        let datosUsuario = userDataCache.get(userID);
        if (!datosUsuario) {
            datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
            if (datosUsuario) {
                userDataCache.set(userID, datosUsuario);
            }
        }
        
        if (!datosUsuario) {
            elementoTigsID.textContent = 'Usuario no encontrado';
            elementoTigsID.style.cssText = 'color: #888; font-style: italic;';
            if (contenedorInsignias) {
                contenedorInsignias.innerHTML = '<div class="no-insignias-message">🎯 Sin datos</div>';
            }
            return;
        }
        
        // Actualizar nombre
        elementoTigsID.textContent = datosUsuario.nombre;
        elementoTigsID.style.cssText = '';
        elementoTigsID.title = `ID: ${userID}`;
        
        // Procesar insignias (solo si no están ya procesadas)
        if (contenedorInsignias && !contenedorInsignias.dataset.procesado) {
            contenedorInsignias.dataset.procesado = 'true';
            const insignias = procesarInsignias(datosUsuario.insignias);
            
            if (!insignias || insignias.length === 0) {
                contenedorInsignias.innerHTML = '<div class="no-insignias-message">🎯 Sin insignias</div>';
                return;
            }
            
            // Usar DocumentFragment para mejor rendimiento
            const fragment = document.createDocumentFragment();
            insignias.forEach((insignia, index) => {
                fragment.appendChild(crearElementoInsignia(insignia, index));
            });
            contenedorInsignias.innerHTML = '';
            contenedorInsignias.appendChild(fragment);
            
            if (insignias.length > 1) {
                const contador = document.createElement('div');
                contador.className = 'insignias-count';
                contador.textContent = insignias.length;
                contenedorInsignias.style.position = 'relative';
                contenedorInsignias.appendChild(contador);
            }
        }
        
        // Procesar imagen (si existe)
        const tarjeta = elementoTigsID.closest('.tarjeta, .anuncio-card, .card-header');
        const imgTIGS = tarjeta?.querySelector('#imgTIGS, .user-avatar, .user-avatar-large');
        
        if (imgTIGS && !imgTIGS.dataset.procesado) {
            imgTIGS.dataset.procesado = 'true';
            
            let fotoURL = userImageCache.get(userID);
            if (!fotoURL) {
                fotoURL = await obtenerFotoPerfilFirebase(userID);
                userImageCache.set(userID, fotoURL);
            }
            
            imgTIGS.src = fotoURL;
            imgTIGS.alt = `Foto de ${datosUsuario.nombre}`;
            
            if (!imgTIGS.style.borderRadius) {
                Object.assign(imgTIGS.style, {
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    marginRight: '15px',
                    flexShrink: '0',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                });
            }
        }
        
    } catch (error) {
        console.error('❌ Error procesando:', error);
        if (elementoTigsID) {
            elementoTigsID.textContent = 'Error';
            elementoTigsID.style.color = '#ff4444';
        }
    }
}

// ============================================
// FUNCIONES PARA OBTENER IMAGEN DE FIREBASE
// ============================================

async function obtenerFotoPerfilFirebase(userID) {
    try {
        if (!userID || userID.trim() === '') {
            return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
        }
        
        const uid = userID.replace(/^GS-/i, '').trim();
        
        if (!uid) {
            return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
        }
        
        const userRef = database.ref(`users/${uid}`);
        const snapshot = await userRef.once('value');
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            return userData.photoURL || 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
        }
        
        return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
    } catch (error) {
        console.error('❌ Error obteniendo foto de perfil:', error);
        return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
    }
}

// ============================================
// FUNCIÓN PRINCIPAL PARA CARGAR DATOS E INSIGNIAS (OPTIMIZADA)
// ============================================

async function cargarDatosEInsigniasEnTodosLosElementos() {
    console.log('🚀 Iniciando carga de datos e insignias');
    
    // 1. Obtener todos los elementos de una vez
    const elementosConTigsID = document.querySelectorAll('[tigsID]');
    console.log(`📊 Encontrados ${elementosConTigsID.length} elementos con tigsID`);
    
    if (elementosConTigsID.length === 0 && !document.getElementById('userID')) {
        console.log('ℹ️ No hay elementos para procesar');
        return;
    }
    
    // 2. Procesar TODOS los elementos en paralelo (no secuencial)
    const promesas = Array.from(elementosConTigsID).map(elemento => 
        mostrarDatosEInsigniasEnElemento(elemento)
    );
    
    await Promise.all(promesas);
    
    // 3. Procesar el perfil del usuario actual (si existe)
    const userIDElement = document.getElementById('userID');
    if (userIDElement && userIDElement.textContent.trim()) {
        const userID = userIDElement.textContent.trim();
        console.log(`📋 Procesando perfil: ${userID}`);
        
        // Procesar foto de perfil
        const fotoPerfil = document.getElementById('fotoPerfil');
        if (fotoPerfil && !fotoPerfil.dataset.procesado) {
            fotoPerfil.dataset.procesado = 'true';
            const fotoURL = await obtenerFotoPerfilFirebase(userID);
            fotoPerfil.src = fotoURL;
            
            if (!fotoPerfil.style.borderRadius) {
                Object.assign(fotoPerfil.style, {
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    marginRight: '15px',
                    flexShrink: '0',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease'
                });
            }
        }
        
        // Procesar insignias del perfil
        const contenedorInsignias = userIDElement.closest('div')?.querySelector('.insignias-container');
        if (contenedorInsignias && !contenedorInsignias.dataset.procesado) {
            contenedorInsignias.dataset.procesado = 'true';
            const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
            
            if (datosUsuario && datosUsuario.insignias) {
                const insignias = procesarInsignias(datosUsuario.insignias);
                contenedorInsignias.innerHTML = '';
                
                if (insignias.length > 0) {
                    // Usar DocumentFragment para mejor rendimiento
                    const fragment = document.createDocumentFragment();
                    insignias.forEach((insignia, index) => {
                        fragment.appendChild(crearElementoInsignia(insignia, index));
                    });
                    contenedorInsignias.appendChild(fragment);
                    
                    if (insignias.length > 1) {
                        const contador = document.createElement('div');
                        contador.className = 'insignias-count';
                        contador.textContent = insignias.length;
                        contenedorInsignias.style.position = 'relative';
                        contenedorInsignias.appendChild(contador);
                    }
                } else {
                    contenedorInsignias.innerHTML = '<div class="no-insignias-message">🎯 Sin insignias</div>';
                }
            }
        }
    }
    
    // 4. Procesar imágenes independientes (solo las que no tienen src)
    const imagenesTIGS = document.querySelectorAll('#imgTIGS');
    const promesasImagenes = Array.from(imagenesTIGS)
        .filter(img => !img.src || img.src === '' || img.src.includes(window.location.origin))
        .map(async (img) => {
            if (!img.dataset.procesado) {
                img.dataset.procesado = 'true';
                img.src = 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
                if (!img.style.borderRadius) {
                    Object.assign(img.style, {
                        borderRadius: '50%',
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        marginRight: '15px',
                        flexShrink: '0',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease'
                    });
                }
            }
        });
    
    await Promise.all(promesasImagenes);
    
    console.log('✅ Carga de datos e insignias completada');
}

// ============================================
// INSIGNIAS Y ROLES (basado en Google Sheets)
// ============================================

async function obtenerInsigniasUsuario(userID) {
    const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
    if (!datosUsuario || !datosUsuario.insignias) return [];
    
    return procesarInsignias(datosUsuario.insignias);
}

function insigniaContiene(insigniaURL, textoBuscado) {
    const urlLower = insigniaURL.toLowerCase();
    const nombreArchivo = urlLower.split('/').pop().split('.')[0];
    return nombreArchivo.includes(textoBuscado.toLowerCase()) || urlLower.includes(textoBuscado.toLowerCase());
}

async function usuarioTieneRol(rolBuscado) {
    const user = auth.currentUser;
    if (!user) return false;
    
    const userID = `GS-${user.uid}`;
    const insignias = await obtenerInsigniasUsuario(userID);
    
    const rolesMap = {
        'admin': ['verified-staff', 'admin', 'administrator', 'owner', 'staff'],
        'artista': ['verified-artist', 'artist', 'premium-artist', 'recording'],
        'empleado': ['verified-employee', 'employee', 'staff'],
        'equipo': ['verified-team', 'team', 'team-member'],
        'partner': ['verified-partner', 'partner', 'vpartner'],
        'premium': ['premium', 'premium-user', 'vip'],
        'moderador': ['moderator', 'mod', 'verified-moderator'],
        'developer': ['developer', 'dev', 'verified-developer']
    };
    
    const palabrasClave = rolesMap[rolBuscado] || [];
    
    for (const insignia of insignias) {
        for (const palabra of palabrasClave) {
            if (insigniaContiene(insignia.url, palabra)) {
                return true;
            }
        }
    }
    
    return false;
}

async function obtenerNivelPermiso() {
    const user = auth.currentUser;
    if (!user) return 0;
    
    const niveles = {
        'admin': 100,
        'developer': 90,
        'moderador': 80,
        'equipo': 70,
        'empleado': 60,
        'partner': 50,
        'artista': 40,
        'premium': 30
    };
    
    let nivelMaximo = 0;
    
    for (const [rol, nivel] of Object.entries(niveles)) {
        if (await usuarioTieneRol(rol)) {
            nivelMaximo = Math.max(nivelMaximo, nivel);
        }
    }
    
    return nivelMaximo;
}

// ============================================
// VERIFICAR ACCESO POR PÁGINA
// ============================================

async function verificarAcceso() {
    const user = auth.currentUser;
    const paginaActual = window.location.pathname.split("/").pop() || 'index';
    const paginasPublicas = ['login', 'login.html', 'register', 'index', '', 'home', 'contacto', 'about', 'tos', 'pp'];
    
    if (paginasPublicas.includes(paginaActual)) {
        return true;
    }
    
    const paginasRestringidas = {
        'admin-panel': ['admin'],
        'developer-area': ['admin', 'developer'],
        'team': ['admin', 'equipo', 'empleado'],
        'planeta': ['partner'],
        'grouvex-studios-recording': ['artista', 'empleado'],
        'grouvex-studios-animation': ['artista', 'empleado']
    };
    
    if (paginasRestringidas[paginaActual]) {
        if (!user) {
            localStorage.setItem('returnUrl', window.location.href);
            mostrarNotificacion('🔒 Necesitas iniciar sesión', true);
            setTimeout(() => window.location.href = '/login', 2000);
            return false;
        }
        
        const rolesRequeridos = paginasRestringidas[paginaActual];
        let tieneAcceso = false;
        
        for (const rol of rolesRequeridos) {
            if (await usuarioTieneRol(rol)) {
                tieneAcceso = true;
                break;
            }
        }
        
        if (!tieneAcceso) {
            mostrarNotificacion('⛔ No tienes permiso para acceder a esta página', true);
            setTimeout(() => window.location.href = '/', 2000);
            return false;
        }
    }
    
    return true;
}

// ============================================
// OBSERVADOR DE AUTENTICACIÓN
// ============================================

auth.onAuthStateChanged(async (user) => {
    const authContainer = document.getElementById('auth-container');
    const content = document.getElementById('content');
    const adminPanel = document.getElementById('adminPanel');
    const artistTools = document.getElementById('artistTools');
    
    if (user) {
        console.log('✅ Usuario autenticado:', user.email);
        
        if (authContainer) authContainer.style.display = 'none';
        if (content) content.style.display = 'block';
        
        await updateProfileUI(user);
        
        if (adminPanel) {
            adminPanel.style.display = (await usuarioTieneRol('admin')) ? 'block' : 'none';
        }
        if (artistTools) {
            artistTools.style.display = (await usuarioTieneRol('artista')) ? 'block' : 'none';
        }
        
        const insigniasContainer = document.querySelector('.insignias-container');
        if (insigniasContainer) {
            const insignias = await obtenerInsigniasUsuario(`GS-${user.uid}`);
            insigniasContainer.innerHTML = '';
            
            if (insignias.length > 0) {
                insignias.forEach((insignia, index) => {
                    insigniasContainer.appendChild(crearElementoInsignia(insignia, index));
                });
            } else {
                insigniasContainer.innerHTML = '<div class="no-insignias-message">🎯 Sin insignias</div>';
            }
        }
        
        setTimeout(() => cargarDatosEInsigniasEnTodosLosElementos(), 500);
    } else {
        console.log('❌ Usuario no autenticado');
        
        if (authContainer) authContainer.style.display = 'block';
        if (content) content.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'none';
        if (artistTools) artistTools.style.display = 'none';
        
        cargarDatosEInsigniasEnTodosLosElementos();
    }
});

// ============================================
// INICIALIZAR EVENTOS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando...');
    
    // Estilos para insignias
    if (!document.getElementById('insignias-styles')) {
        const style = document.createElement('style');
        style.id = 'insignias-styles';
        style.textContent = `
            .insignias-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 8px;
                margin: 10px 0;
                padding: 10px;
                min-height: 50px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                position: relative;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .insignia-item {
                position: relative;
            }
            
            .insignia-item:hover::after {
                content: attr(data-nombre);
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 500;
                white-space: nowrap;
                z-index: 100;
                border: 1px solid rgba(255, 215, 0, 0.3);
                pointer-events: none;
            }
            
            .no-insignias-message {
                text-align: center;
                color: #888;
                font-size: 12px;
                padding: 10px;
                font-style: italic;
            }
            
            .loading-insignias {
                text-align: center;
                color: #667eea;
                font-size: 12px;
                padding: 10px;
            }
            
            .error-insignias {
                text-align: center;
                color: #ff4444;
                font-size: 12px;
                padding: 10px;
            }
            
            .insignias-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 10px;
                font-weight: bold;
                padding: 2px 6px;
                border-radius: 10px;
                border: 2px solid white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 10;
            }
        `;
        document.head.appendChild(style);
    }
    
    // EVENTOS
    const authButton = document.getElementById('authButton');
    const toggleModeBtn = document.getElementById('toggleModeBtn');
    const googleBtn = document.getElementById('googleLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    
    if (authButton) {
        authButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const email = document.getElementById('authEmail')?.value;
            const password = document.getElementById('authPassword')?.value;
            
            if (!email || !password) {
                mostrarNotificacion('❌ Completa todos los campos', true);
                return;
            }
            
            handleEmailAuth(email, password, isLoginMode);
        });
    }
    
    if (toggleModeBtn) toggleModeBtn.addEventListener('click', toggleAuthMode);
    if (googleBtn) googleBtn.addEventListener('click', handleGoogleLogin);
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.signOut();
            mostrarNotificacion('👋 Sesión cerrada');
        });
    }
    
    if (deleteBtn) deleteBtn.addEventListener('click', handleAccountDeletion);
    
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', () => {
            const email = prompt('Introduce tu correo:');
            if (email) {
                auth.sendPasswordResetEmail(email)
                    .then(() => mostrarNotificacion('📧 Revisa tu email'))
                    .catch(err => mostrarNotificacion(`❌ Error: ${err.message}`, true));
            }
        });
    }
    
    const anyForm = document.querySelector('form');
    if (anyForm) {
        anyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            return false;
        });
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');
    if (returnUrl) localStorage.setItem('returnUrl', returnUrl);
    
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'login' && currentPage !== 'login.html') {
        verificarAcceso();
    }
    
    setTimeout(() => {
        cargarDatosEInsigniasEnTodosLosElementos();
    }, 1000);
});

// Exportar funciones útiles globalmente
window.usuarioTieneRol = usuarioTieneRol;
window.obtenerNivelPermiso = obtenerNivelPermiso;
window.cargarInsigniasUsuario = obtenerInsigniasUsuario;
window.cargarDatosEInsigniasEnTodosLosElementos = cargarDatosEInsigniasEnTodosLosElementos;
