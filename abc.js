// ============================================
// PROTECCIÓN ANTI-INSPECCIÓN
// ============================================
!function(){'use strict';document.addEventListener('keydown',e=>{((e.ctrlKey&&e.shiftKey&&['I','J','C','K'].includes(e.key))||['F12','F8'].includes(e.key)||(e.ctrlKey&&['U','S'].includes(e.key.toUpperCase())))&&(e.preventDefault(),e.stopImmediatePropagation())},!0),document.addEventListener('contextmenu',e=>{e.preventDefault(),e.stopImmediatePropagation()},!0)}();

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
// INSIGNIAS Y ROLES (CORREGIDO - usa insignias)
// ============================================
async function obtenerInsigniasUsuario(userID) {
    try {
        const cleanID = userID.replace(/^GS-/i, '').trim();
        const snapshot = await database.ref(`users/${cleanID}/insignias`).once('value');
        const insigniasTexto = snapshot.val() || '';
        
        if (!insigniasTexto) return [];
        
        // Procesar insignias desde el texto (URLs separadas por comas)
        return insigniasTexto.split(/[,;]+/).map(i => i.trim()).filter(i => i && i.includes('http'));
    } catch (error) {
        console.error('Error obteniendo insignias:', error);
        return [];
    }
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
    
    // Mapeo de roles a palabras clave en las insignias
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
            if (insigniaContiene(insignia, palabra)) {
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
// OBTENER DATOS DE USUARIO
// ============================================
async function obtenerDatosUsuarioPorUserID(userID) {
    try {
        if (!userID) return null;
        const cleanID = userID.replace(/^GS-/i, '').trim();
        const snapshot = await database.ref(`users/${cleanID}`).once('value');
        return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

async function obtenerFotoPerfilFirebase(userID) {
    try {
        if (!userID) return "https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png";
        const cleanID = userID.replace(/^GS-/i, '').trim();
        const snapshot = await database.ref(`users/${cleanID}/photoURL`).once('value');
        return snapshot.val() || "https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png";
    } catch (error) {
        return "https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png";
    }
}

// ============================================
// FUNCIONES PARA INSIGNIAS EN UI
// ============================================
function extraerNombreInsignia(url) {
    try {
        const nombreArchivo = decodeURIComponent(url).split('/').pop();
        const nombre = nombreArchivo.split('.')[0];
        return nombre.replace(/[_-]/g, ' ').replace(/^\w/, c => c.toUpperCase());
    } catch (e) {
        return 'INSIGNIA';
    }
}

function determinarTipoInsignia(url) {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('.gif')) return 'animada';
    if (urlLower.includes('.png')) return 'estatica';
    if (urlLower.includes('.svg')) return 'vectorial';
    return 'imagen';
}

function crearElementoInsignia(insignia) {
    const container = document.createElement('div');
    container.className = 'insignia-item';
    container.setAttribute('data-nombre', insignia.nombre);
    
    const img = document.createElement('img');
    img.src = insignia.url;
    img.alt = insignia.nombre;
    img.title = insignia.nombre;
    img.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: 2px solid rgba(255,255,255,0.15);
        cursor: pointer;
        object-fit: contain;
        transition: transform 0.2s;
    `;
    
    img.onerror = () => {
        img.src = 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
    };
    
    img.onmouseenter = () => img.style.transform = 'scale(1.2)';
    img.onmouseleave = () => img.style.transform = 'scale(1)';
    
    container.appendChild(img);
    return container;
}

async function cargarInsigniasUsuario(container, userID) {
    if (!container) return;
    
    try {
        const insigniasURLs = await obtenerInsigniasUsuario(userID);
        container.innerHTML = '';
        
        if (!insigniasURLs.length) {
            container.innerHTML = '<div class="no-insignias-message">🎯 Sin insignias</div>';
            return;
        }
        
        for (const url of insigniasURLs) {
            const insignia = {
                url: url,
                nombre: extraerNombreInsignia(url),
                tipo: determinarTipoInsignia(url)
            };
            container.appendChild(crearElementoInsignia(insignia));
        }
    } catch (error) {
        console.error('Error cargando insignias:', error);
        container.innerHTML = '<div class="no-insignias-message">❌ Error cargando insignias</div>';
    }
}

async function cargarDatosEInsigniasEnTodosLosElementos() {
    const elementos = document.querySelectorAll('[tigsID]');
    for (const elemento of elementos) {
        const userID = elemento.getAttribute('tigsID');
        if (!userID) continue;
        
        const datos = await obtenerDatosUsuarioPorUserID(userID);
        if (datos && datos.displayName) {
            elemento.textContent = datos.displayName;
        }
    }
    
    // Cargar insignias en contenedores específicos
    const insigniasContainer = document.querySelector('.insignias-container');
    const userIDelement = document.getElementById('userID');
    if (insigniasContainer && userIDelement) {
        const userID = userIDelement.textContent.trim();
        if (userID && userID !== 'Cargando...') {
            await cargarInsigniasUsuario(insigniasContainer, userID);
        }
    }
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
    
    // Páginas que requieren roles específicos
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
        
        // Mostrar paneles según rol (basado en insignias)
        if (adminPanel) {
            adminPanel.style.display = (await usuarioTieneRol('admin')) ? 'block' : 'none';
        }
        if (artistTools) {
            artistTools.style.display = (await usuarioTieneRol('artista')) ? 'block' : 'none';
        }
        
        // Cargar insignias del usuario logueado
        const insigniasContainer = document.querySelector('.insignias-container');
        if (insigniasContainer) {
            await cargarInsigniasUsuario(insigniasContainer, `GS-${user.uid}`);
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
                gap: 8px;
                margin: 10px 0;
                padding: 10px;
                background: rgba(255,255,255,0.02);
                border-radius: 8px;
                min-height: 60px;
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
                background: rgba(0,0,0,0.9);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                white-space: nowrap;
                z-index: 100;
            }
            .no-insignias-message {
                color: #888;
                font-size: 12px;
                padding: 10px;
                text-align: center;
                width: 100%;
            }
        `;
        document.head.appendChild(style);
    }
    
    // EVENTOS CORREGIDOS - usar CLICK en lugar de SUBMIT
    const authButton = document.getElementById('authButton');
    const toggleModeBtn = document.getElementById('toggleModeBtn');
    const googleBtn = document.getElementById('googleLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    
    // Para el login/registro - usar CLICK en el botón
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
    
    // Prevenir submit de cualquier formulario
    const anyForm = document.querySelector('form');
    if (anyForm) {
        anyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            return false;
        });
    }
    
    // Verificar returnUrl
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');
    if (returnUrl) localStorage.setItem('returnUrl', returnUrl);
    
    // Verificar acceso en páginas que no son login
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage !== 'login' && currentPage !== 'login.html') {
        verificarAcceso();
    }
});

// Exportar funciones útiles globalmente
window.usuarioTieneRol = usuarioTieneRol;
window.obtenerNivelPermiso = obtenerNivelPermiso;
window.cargarInsigniasUsuario = cargarInsigniasUsuario;
