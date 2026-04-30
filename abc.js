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
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQBy3U9WSBBYfo9C-etH3KYe3_b9B_W1i40-XE6vUgatP16slZDnXtokxs25l80VBWjg/exec';

// ============================================
// NOTIFICACIONES
// ============================================
function mostrarNotificacion(mensaje, esError = false) {
    const notificacion = document.createElement("div");
    notificacion.className = `notificacion ${esError ? 'error' : 'exito'}`;
    notificacion.innerHTML = mensaje;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${esError ? '#ff4444' : '#4CAF50'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        max-width: 90%;
        width: 300px;
        text-align: center;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notificacion);
    setTimeout(() => {
        if (notificacion && notificacion.remove) notificacion.remove();
    }, 5000);
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
            redirectUser();
        } else {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const displayName = document.getElementById('authDisplayName')?.value.trim() || email.split('@')[0];
            
            await userCredential.user.updateProfile({ displayName: displayName });
            
            await database.ref(`users/${userCredential.user.uid}`).set({
                email: email,
                displayName: displayName,
                photoURL: "https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png",
                lastLogin: Date.now(),
                provider: "email",
                createdAt: Date.now()
            });
            
            await userCredential.user.sendEmailVerification();
            mostrarNotificacion('✅ Registro exitoso! Revisa tu email para verificar tu cuenta.');
            redirectUser();
        }
    } catch (error) {
        console.error('Error:', error);
        let mensaje = error.message;
        if (error.code === 'auth/user-not-found') mensaje = '❌ Usuario no encontrado';
        if (error.code === 'auth/wrong-password') mensaje = '❌ Contraseña incorrecta';
        if (error.code === 'auth/email-already-in-use') mensaje = '❌ Este correo ya está registrado';
        if (error.code === 'auth/weak-password') mensaje = '❌ La contraseña debe tener al menos 6 caracteres';
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
        provider.setCustomParameters({ prompt: 'select_account' });
        
        const result = await auth.signInWithPopup(provider);
        
        await database.ref(`users/${result.user.uid}`).set({
            email: result.user.email,
            displayName: result.user.displayName || result.user.email.split('@')[0],
            photoURL: result.user.photoURL || "https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png",
            lastLogin: Date.now(),
            provider: "google"
        });
        
        mostrarNotificacion('✅ Inicio de sesión con Google exitoso');
        redirectUser();
    } catch (error) {
        console.error('Error Google:', error);
        let mensaje = error.message;
        if (error.code === 'auth/popup-blocked') mensaje = '❌ Habilita las ventanas emergentes para este sitio';
        if (error.code === 'auth/popup-closed-by-user') mensaje = '❌ Cerraste la ventana de Google';
        mostrarNotificacion(mensaje, true);
    } finally {
        if (googleBtn) {
            googleBtn.disabled = false;
            googleBtn.innerHTML = '<i class="fab fa-google"></i> Google';
        }
    }
}

// ============================================
// NAVEGACIÓN
// ============================================
function redirectUser() {
    const returnUrl = localStorage.getItem('returnUrl') || '/';
    localStorage.removeItem('returnUrl');
    setTimeout(() => {
        window.location.href = returnUrl;
    }, 1500);
}

// ============================================
// TOGGLE LOGIN/REGISTRO
// ============================================
function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const formTitle = document.getElementById('formTitle');
    const authButton = document.getElementById('authButton');
    const authBtnText = document.getElementById('authBtnText');
    const toggleModeBtn = document.getElementById('toggleModeBtn');
    const displayNameGroup = document.getElementById('displayNameGroup');
    
    if (formTitle) formTitle.textContent = isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
    if (authBtnText) authBtnText.textContent = isLoginMode ? 'Iniciar Sesión' : 'Registrarse';
    if (toggleModeBtn) toggleModeBtn.textContent = isLoginMode ? 'Registrarse' : 'Iniciar Sesión';
    
    if (displayNameGroup) {
        displayNameGroup.style.display = isLoginMode ? 'none' : 'block';
        const displayNameInput = document.getElementById('authDisplayName');
        if (displayNameInput) displayNameInput.required = !isLoginMode;
    }
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
        try {
            const snapshot = await database.ref(`users/${user.uid}/photoURL`).once('value');
            fotoPerfil.src = snapshot.val() || "https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png";
        } catch (error) {
            fotoPerfil.src = "https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png";
        }
    }
}

// ============================================
// ELIMINAR CUENTA
// ============================================
async function eliminarDatosUsuario(userId) {
    return database.ref(`users/${userId}`).remove();
}

async function handleAccountDeletion() {
    const user = auth.currentUser;
    if (!user) {
        mostrarNotificacion('❌ Debes iniciar sesión', true);
        return;
    }
    
    const confirmacion = confirm('¿Estás SEGURO? Esta acción es irreversible. Escribe "ELIMINAR" para confirmar.');
    if (!confirmacion) return;
    
    const input = prompt('Escribe "ELIMINAR" para confirmar:');
    if (input !== 'ELIMINAR') {
        mostrarNotificacion('❌ Confirmación incorrecta', true);
        return;
    }
    
    try {
        await eliminarDatosUsuario(user.uid);
        await user.delete();
        mostrarNotificacion('🔥 Cuenta eliminada permanentemente');
        setTimeout(() => window.location.href = '/', 2000);
    } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
            mostrarNotificacion('❌ Inicia sesión nuevamente para eliminar la cuenta', true);
            auth.signOut();
        } else {
            mostrarNotificacion(`❌ Error: ${error.message}`, true);
        }
    }
}

// ============================================
// INSIGNIAS Y DATOS DE USUARIO
// ============================================
async function obtenerDatosUsuarioPorUserID(userID) {
    try {
        if (!userID || userID.trim() === '') return null;
        
        const cleanID = userID.replace(/^GS-/i, '').trim();
        const snapshot = await database.ref(`users/${cleanID}`).once('value');
        
        if (snapshot.exists()) {
            return snapshot.val();
        }
        return null;
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        return null;
    }
}

async function obtenerFotoPerfilFirebase(userID) {
    try {
        if (!userID) return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
        
        const uid = userID.replace(/^GS-/i, '').trim();
        if (!uid) return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
        
        const snapshot = await database.ref(`users/${uid}/photoURL`).once('value');
        return snapshot.val() || 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
    } catch (error) {
        return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
    }
}

function procesarInsignias(textoInsignias) {
    if (!textoInsignias || textoInsignias.trim() === '') return [];
    
    const texto = textoInsignias.trim();
    if (['ninguna', 'sin insignias', 'n/a', 'no aplica'].includes(texto.toLowerCase())) {
        return [];
    }
    
    const insignias = [];
    const partes = texto.split(/[,;]+/);
    
    partes.forEach(parte => {
        const urlLimpia = parte.trim();
        if (urlLimpia && urlLimpia.includes('githubusercontent.com') && /\.(png|gif|jpg|jpeg|webp|svg)/i.test(urlLimpia)) {
            insignias.push({
                nombre: extraerNombreInsignia(urlLimpia),
                url: urlLimpia,
                tipo: determinarTipoInsignia(urlLimpia)
            });
        }
    });
    
    return insignias;
}

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

async function cargarDatosEInsigniasEnTodosLosElementos() {
    const elementosConTigsID = document.querySelectorAll('[tigsID]');
    
    for (const elemento of elementosConTigsID) {
        const userID = elemento.getAttribute('tigsID');
        if (!userID) continue;
        
        const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
        if (datosUsuario && datosUsuario.displayName) {
            elemento.textContent = datosUsuario.displayName;
        }
    }
}

// ============================================
// SISTEMA DE PERMISOS Y ROLES
// ============================================
async function usuarioTieneRol(rolBuscado) {
    const user = auth.currentUser;
    if (!user) return false;
    
    // Verificar por email para admin (ejemplo)
    const adminEmails = ['admin@grouvex.com', 'administracion@grouvex.com'];
    if (rolBuscado === 'admin' && adminEmails.includes(user.email)) {
        return true;
    }
    
    try {
        const snapshot = await database.ref(`users/${user.uid}/rol`).once('value');
        return snapshot.val() === rolBuscado;
    } catch (error) {
        return false;
    }
}

async function verificarAcceso() {
    const user = auth.currentUser;
    const paginaActual = window.location.pathname.split("/").pop() || 'index';
    const paginasPublicas = ['login', 'login.html', 'register', 'index', '', 'home', 'contacto', 'about', 'tos', 'pp'];
    
    if (paginasPublicas.includes(paginaActual) || paginaActual === 'login.html') {
        return true;
    }
    
    if (!user) {
        localStorage.setItem('returnUrl', window.location.href);
        mostrarNotificacion('🔒 Necesitas iniciar sesión', true);
        setTimeout(() => window.location.href = '/login', 2000);
        return false;
    }
    
    return true;
}

// ============================================
// OBSERVADOR DE AUTENTICACIÓN (CORREGIDO)
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
        
        // Mostrar paneles según rol
        if (adminPanel) {
            adminPanel.style.display = (await usuarioTieneRol('admin')) ? 'block' : 'none';
        }
        if (artistTools) {
            artistTools.style.display = (await usuarioTieneRol('artista')) ? 'block' : 'none';
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
        `;
        document.head.appendChild(style);
    }
    
    // Eventos del formulario
    const authForm = document.getElementById('authForm');
    const toggleModeBtn = document.getElementById('toggleModeBtn');
    const googleBtn = document.getElementById('googleLoginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
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
            const user = auth.currentUser;
            if (user?.email) {
                auth.sendPasswordResetEmail(user.email)
                    .then(() => mostrarNotificacion('📧 Revisa tu email'))
                    .catch(err => mostrarNotificacion(`❌ Error: ${err.message}`, true));
            } else {
                const email = prompt('Introduce tu correo:');
                if (email) {
                    auth.sendPasswordResetEmail(email)
                        .then(() => mostrarNotificacion('📧 Email enviado'))
                        .catch(err => mostrarNotificacion(`❌ Error: ${err.message}`, true));
                }
            }
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
