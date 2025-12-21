// !function(){'use strict';document.addEventListener('keydown',e=>{((e.ctrlKey&&e.shiftKey&&['I','J','C','K'].includes(e.key))||['F12','F8'].includes(e.key)||(e.ctrlKey&&['U','S'].includes(e.key.toUpperCase())))&&(e.preventDefault(),e.stopImmediatePropagation())},!0),document.addEventListener('contextmenu',e=>{e.preventDefault(),e.stopImmediatePropagation()},!0),document.addEventListener('selectstart',e=>e.preventDefault(),!0),setInterval(()=>{(window.outerWidth-window.innerWidth>100||window.outerHeight-window.innerHeight>100)&&console.log('x')},1e3)}();

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, EmailAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, deleteUser, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, remove, onValue, onDisconnect, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// ============================================
// CONFIGURACIÓN INICIAL
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ============================================
// CONFIGURACIÓN INSIGNIAS DESDE GOOGLE SHEETS
// ============================================

const SHEET_ID = '15FJWUFb6J52XDLbicgvTJmSCjJ0c0sRoWPpr5YFK5H8';
const SHEET_NAME = 'Respuestas de formulario 2';

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

async function completeUserProfile(user, isGoogleUser = false) {
    if (isGoogleUser && user.displayName) return;

    const displayName = user.displayName || prompt("¿Cómo quieres que te llamemos?");
    
    await updateProfile(user, {
        displayName: displayName || "Usuario",
        photoURL: user.photoURL || "https://grouvex.com/img/GROUVEX.png"
    });

    await set(ref(database, `users/${user.uid}`), {
        email: user.email,
        displayName: displayName || "Usuario",
        photoURL: user.photoURL || "https://grouvex.com/img/GROUVEX.png",
        lastLogin: Date.now(),
        provider: isGoogleUser ? "google" : "email",
        emailVerified: isGoogleUser ? true : user.emailVerified
    });

    if (!isGoogleUser && !user.emailVerified) {
        await sendEmailVerification(user);
        mostrarNotificacion('📧 Se envió un correo de verificación. Por favor revisa tu bandeja.');
    }
}

function handleEmailAuth(email, password, isLogin) {
    const authFunction = isLogin ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
    
    authFunction(auth, email, password)
        .then(async (userCredential) => {
            if (!isLogin) await completeUserProfile(userCredential.user);
            mostrarNotificacion(`✅ ${isLogin ? 'Inicio de sesión exitoso' : 'Registro completado'}`);
            redirectUser();
        })
        .catch(error => {
            mostrarNotificacion(`❌ Error: ${error.message}`, true);
        });
}

async function handleGoogleLogin() {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        
        const result = await signInWithPopup(auth, provider);
        
        // Guardar información del usuario en la base de datos
        await set(ref(database, `users/${result.user.uid}`), {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL || "https://grouvex.com/img/GROUVEX.png",
            lastLogin: Date.now(),
            provider: "google"
        });
        
        mostrarNotificacion('✅ Inicio de sesión con Google exitoso');
        redirectUser();
    } catch (error) {
        mostrarNotificacion(`❌ Error: ${error.message}`, true);
    }
}

function reauthenticateUser(user, password) {
    if (!password) throw new Error('Se requiere contraseña para esta acción');
    const credential = EmailAuthProvider.credential(user.email, password);
    return reauthenticateWithCredential(user, credential);
}

// ============================================
// FUNCIONES DE INTERFAZ DE USUARIO
// ============================================

function mostrarNotificacion(mensaje, esError = false) {
    const notificacion = document.createElement("div");
    notificacion.className = `notificacion ${esError ? 'error' : 'exito'}`;
    notificacion.innerHTML = `<p>${mensaje}</p><div class="progress-bar"></div>`;
    notificacion.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: ${esError ? '#ff4444' : '#4CAF50'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 90%;
        width: 300px;
        text-align: center;
        font-size: 14px;
    `;
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 8000);
}

function mostrarNotificacionRegistro() {
    const notificacion = document.createElement("div");
    notificacion.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px;
        background: #4CAF50;
        color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 90%;
        width: 300px;
        text-align: center;
        font-size: 14px;
    `;
    notificacion.innerHTML = `
        <p>🎁 ¡Regístrate Gratis para acceder a contenido exclusivo!</p>
        <div style="margin-top: 10px; display: flex; justify-content: center; gap: 10px;">
            <a href="script.google.com/macros/s/AKfycbyx2ZKEOGThYPBLjDeavIn1EYF9tmcYieT-6mfvAZAeiR0-nO__NKiJTejXxjJGJCBaBA/exec" style="color: white; text-decoration: underline;">Registrarme</a>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; cursor: pointer;">
                Cerrar
            </button>
        </div>
    `;
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 8000);
}

// ============================================
// FUNCIONES DE GESTIÓN DE CUENTA
// ============================================

async function verificarCorreoUsuario(user) {
    return sendEmailVerification(user).then(() => {
        alert('Por favor, verifica tu correo electrónico. Tienes 5 minutos para verificarlo.');

        return new Promise((resolve, reject) => {
            const checkVerificationInterval = setInterval(() => {
                user.reload().then(() => {
                    if (user.emailVerified) {
                        clearInterval(checkVerificationInterval);
                        clearTimeout(deleteAccountTimeout);
                        alert('Correo verificado con éxito.');
                        resolve();
                    }
                }).catch((error) => {
                    console.error('Error al recargar el estado del usuario:', error.message);
                    reject(error);
                });
            }, 1000);

            const deleteAccountTimeout = setTimeout(() => {
                clearInterval(checkVerificationInterval);
                alert('Tiempo de verificación agotado. No se pudo verificar el correo en el tiempo dado.');
                reject(new Error('Tiempo de verificación agotado.'));
            }, 5 * 60 * 1000);
        });
    }).catch((error) => {
        console.error("Error al enviar correo de verificación:", error.message);
        alert('Error al enviar correo de verificación: ' + error.message);
        throw error;
    });
}

async function handleAccountDeletion() {
    const user = auth.currentUser;
    if (!user) {
        mostrarNotificacion('❌ Debes iniciar sesión para realizar esta acción', true);
        window.location.href = '/login';
        return;
    }

    const confirmation = confirm(`¿Estás SEGURO que quieres eliminar tu cuenta de forma permanente?\n\nEsta acción:\n✅ Eliminará todos tus datos\n✅ Borrará tu historial\n✅ Quitará tus permisos\n🚫 NO podrá deshacerse\n\nEscribe "ELIMINAR" para confirmar.`);

    if (!confirmation) {
        mostrarNotificacion('✅ Cancelaste la eliminación de la cuenta');
        return;
    }

    const userInput = prompt('Escribe "ELIMINAR" para confirmar la eliminación permanente:');
    if (userInput !== 'ELIMINAR') {
        mostrarNotificacion('❌ Confirmación incorrecta. Eliminación cancelada', true);
        return;
    }

    try {
        const password = prompt('Por seguridad, introduce tu contraseña para confirmar:');
        if (!password) {
            mostrarNotificacion('❌ Se requiere contraseña para esta acción', true);
            return;
        }

        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await eliminarDatosUsuario(user.uid);
        await deleteUser(user);
        
        mostrarNotificacion('🔥 Cuenta eliminada permanentemente. ¡Hasta pronto!');
        setTimeout(() => window.location.href = '/', 3000);
    } catch (error) {
        manejarErroresEliminacion(error);
    }
}

function manejarErroresEliminacion(error) {
    console.error('Error en eliminación:', error);
    const mensajesError = {
        'auth/requires-recent-login': 'Debes volver a iniciar sesión para realizar esta acción. Redirigiendo...',
        'auth/wrong-password': 'Contraseña incorrecta. Intenta nuevamente.',
        'auth/network-request-failed': 'Error de red. Verifica tu conexión a internet.',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
        'default': 'Error crítico: ' + error.message
    };

    const mensaje = mensajesError[error.code] || mensajesError['default'];
    mostrarNotificacion(`❌ ${mensaje}`, true);
    
    if (error.code === 'auth/requires-recent-login') {
        setTimeout(() => window.location.href = '/login', 3000);
    }
}

// ============================================
// FUNCIONES PARA OBTENER INSIGNIAS DESDE GOOGLE SHEETS
// ============================================

async function obtenerUserID() {
    let userID = '';
    
    // Primero intentar leer del span con id="userID"
    const userIDSpan = document.getElementById('userID');
    if (userIDSpan && userIDSpan.textContent && userIDSpan.textContent.trim() !== '') {
        userID = userIDSpan.textContent.trim();
        console.log('✅ UserID obtenido del span:', userID);
    }
    
    // Si no hay contenido en el span, buscar elementos cuyo ID sea un UID de Firebase
    if (!userID) {
        const elementos = document.querySelectorAll('[id]');
        for (const elemento of elementos) {
            const idValue = elemento.id.trim();
            // Verificar si es un UID de Firebase (normalmente 28 caracteres)
            if (idValue.length >= 20 && idValue.length <= 32 && !idValue.includes(' ')) {
                userID = idValue;
                console.log('✅ UserID obtenido del id del elemento:', userID);
                break;
            }
        }
    }
    
    // Si aún no hay userID, usar el UID del usuario autenticado
    if (!userID && auth.currentUser) {
        userID = auth.currentUser.uid;
        console.log('✅ UserID obtenido del usuario autenticado:', userID);
    }
    
    return userID;
}

async function obtenerInsigniasUsuario(userID) {
    try {
        console.log('🔍 Buscando insignias para UserID:', userID);
        
        if (!userID) {
            console.log('❌ No se pudo obtener el UserID');
            return [];
        }
        
        // Normalizar el UserID (remover "GS-" si está presente)
        const searchUserID = userID.replace(/^GS-/, '').trim();
        
        // URL para acceder a Google Sheets
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const text = await response.text();
        
        // Parsear respuesta JSON de Google Sheets
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.+)\);/);
        
        if (!jsonMatch) {
            console.error('❌ No se pudo parsear JSON');
            return [];
        }
        
        const jsonData = JSON.parse(jsonMatch[1]);
        
        if (!jsonData.table || !jsonData.table.rows) {
            console.error('❌ No hay datos en la hoja');
            return [];
        }
        
        // Obtener encabezados
        const headers = jsonData.table.cols.map(col => col.label || '');
        
        // Buscar índices de las columnas necesarias
        const userIDIndex = encontrarIndiceColumna(headers, ['grouvex studios userid', 'grouvex studios user id', 'grouvex userid', 'userid', 'id']);
        const insigniasIndex = encontrarIndiceColumna(headers, ['insignias', 'insignia', 'badges', 'badge', 'emblem']);
        
        console.log('📊 Índices encontrados:', { 
            userIDIndex, 
            insigniasIndex,
            userIDHeader: userIDIndex !== -1 ? headers[userIDIndex] : 'No encontrada',
            insigniasHeader: insigniasIndex !== -1 ? headers[insigniasIndex] : 'No encontrada'
        });
        
        if (userIDIndex === -1 || insigniasIndex === -1) {
            console.error('❌ No se encontraron las columnas necesarias');
            return [];
        }
        
        // Buscar el usuario en todas las filas
        for (let i = 0; i < jsonData.table.rows.length; i++) {
            const row = jsonData.table.rows[i];
            const userIDCell = row.c && row.c[userIDIndex];
            
            if (userIDCell && userIDCell.v) {
                const rowUserID = userIDCell.v.toString().trim();
                const normalizedRowUserID = rowUserID.replace(/^GS-/, '');
                
                if (normalizedRowUserID === searchUserID) {
                    console.log(`✅ Usuario encontrado en fila ${i + 1}`);
                    
                    // Obtener las insignias
                    const insigniasCell = row.c[insigniasIndex];
                    
                    if (insigniasCell && insigniasCell.v) {
                        const textoInsignias = insigniasCell.v.toString().trim();
                        console.log('📝 Insignias encontradas:', textoInsignias);
                        return procesarInsignias(textoInsignias);
                    }
                    return [];
                }
            }
        }
        
        console.log('❌ Usuario no encontrado en Google Sheets');
        return [];
        
    } catch (error) {
        console.error('❌ Error obteniendo insignias:', error);
        return [];
    }
}

function encontrarIndiceColumna(headers, palabrasClave) {
    for (let i = 0; i < headers.length; i++) {
        const header = headers[i].toLowerCase();
        for (const palabra of palabrasClave) {
            if (header.includes(palabra.toLowerCase())) {
                return i;
            }
        }
    }
    return -1;
}

function procesarInsignias(textoInsignias) {
    if (!textoInsignias || textoInsignias.trim() === '') {
        return [];
    }
    
    const insignias = [];
    
    // Separar por diferentes delimitadores
    const delimitadores = /[,;|/\\\n\t]+/;
    const linksInsignias = textoInsignias.split(delimitadores);
    
    linksInsignias.forEach(link => {
        const linkLimpio = link.trim();
        
        if (linkLimpio && linkLimpio.length > 0) {
            // Extraer nombre de la insignia de la URL o usar el link completo
            const nombre = extraerNombreInsignia(linkLimpio);
            
            insignias.push({
                nombre: nombre,
                url: linkLimpio,
                tipo: determinarTipoInsignia(linkLimpio)
            });
        }
    });
    
    return insignias;
}

function extraerNombreInsignia(url) {
    try {
        // Intentar extraer el nombre del archivo sin extensión
        const nombreArchivo = url.split('/').pop();
        const nombreSinExtension = nombreArchivo.split('.')[0];
        
        // Convertir a formato legible
        return nombreSinExtension
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/verified/g, 'Verified ')
            .replace(/gif$|png$|jpg$|jpeg$/, '')
            .trim()
            .toUpperCase();
    } catch (e) {
        return 'Insignia';
    }
}

function determinarTipoInsignia(url) {
    if (url.includes('.gif')) return 'animada';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg')) return 'estatica';
    return 'desconocido';
}

// Función para verificar si un usuario tiene una insignia específica
function usuarioTieneInsignia(insignias, insigniaBuscada) {
    if (!insignias || insignias.length === 0) return false;
    
    const insigniaBuscadaLower = insigniaBuscada.toLowerCase();
    
    return insignias.some(insignia => {
        const nombreInsignia = insignia.nombre.toLowerCase();
        const urlInsignia = insignia.url.toLowerCase();
        
        return nombreInsignia.includes(insigniaBuscadaLower) || 
               urlInsignia.includes(insigniaBuscadaLower);
    });
}

// ============================================
// FUNCIONES PARA MOSTRAR INSIGNIAS
// ============================================

async function mostrarInsigniasUsuarioEnPerfil() {
    try {
        const userID = await obtenerUserID();
        const insignias = await obtenerInsigniasUsuario(userID);
        
        // Buscar el contenedor de insignias
        let insigniasContainer = document.querySelector('.insignias-container');
        
        if (!insigniasContainer) {
            // Crear contenedor si no existe
            insigniasContainer = document.createElement('div');
            insigniasContainer.className = 'insignias-container';
            
            // Buscar donde insertar (después del usuario o en un lugar apropiado)
            const usuarioElement = document.querySelector('.usuario');
            if (usuarioElement && usuarioElement.parentElement) {
                usuarioElement.parentElement.insertBefore(insigniasContainer, usuarioElement.nextSibling);
            } else {
                // Insertar en el contenedor de tarjetas
                const tarjetasContainer = document.querySelector('.tarjetas');
                if (tarjetasContainer) {
                    tarjetasContainer.appendChild(insigniasContainer);
                } else {
                    // Insertar en el body
                    document.body.appendChild(insigniasContainer);
                }
            }
        }
        
        // Limpiar contenedor
        insigniasContainer.innerHTML = '';
        
        if (!insignias || insignias.length === 0) {
            insigniasContainer.innerHTML = `
                <div style="text-align: center; color: #888; font-size: 12px; margin: 10px 0;">
                    🎯 No hay insignias asignadas
                </div>
            `;
            return;
        }
        
        // Crear y añadir cada insignia
        insignias.forEach((insignia, index) => {
            const insigniaElement = crearElementoInsignia(insignia, index);
            insigniasContainer.appendChild(insigniaElement);
        });
        
        // Aplicar estilos si no están ya aplicados
        aplicarEstilosInsignias();
        
    } catch (error) {
        console.error('❌ Error mostrando insignias:', error);
    }
}

function crearElementoInsignia(insignia, index) {
    const container = document.createElement('div');
    container.className = 'insignia-item';
    container.style.cssText = `
        display: inline-block;
        margin: 5px;
        position: relative;
        animation: fadeIn 0.5s ease ${index * 0.1}s forwards;
        opacity: 0;
    `;
    
    const img = document.createElement('img');
    img.src = insignia.url;
    img.alt = insignia.nombre;
    img.title = insignia.nombre;
    img.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        cursor: pointer;
    `;
    
    // Añadir efecto hover
    img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.2)';
        img.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.5)';
        img.style.borderColor = 'gold';
    });
    
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.boxShadow = 'none';
        img.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });
    
    container.appendChild(img);
    return container;
}

function aplicarEstilosInsignias() {
    if (!document.getElementById('insignias-styles')) {
        const style = document.createElement('style');
        style.id = 'insignias-styles';
        style.textContent = `
            .insignias-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin: 15px 0;
                padding: 10px;
                min-height: 50px;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .insignia-item:hover::after {
                content: attr(title);
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
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
}

// ============================================
// FUNCIONES DE CONTROL DE ACCESO BASADAS EN INSIGNIAS
// ============================================

async function verificarAcceso() {
    onAuthStateChanged(auth, async (user) => {
        const paginaActual = window.location.pathname.split("/").pop();
        
        if (!user) {
            // Usuario no autenticado
            if (paginaActual === 'login' || paginaActual === 'register') {
                return; // Permitir acceso a páginas de autenticación
            }
            
            mostrarNotificacion('🔒 Necesitas iniciar sesión para acceder a esta página');
            setTimeout(() => { 
                window.location.href = "https://grouvex.github.io/login"; 
            }, 3000);
            return;
        }

        // Obtener insignias del usuario
        const insigniasUsuario = await obtenerInsigniasUsuario(user.uid);
        
        // Definir permisos basados en insignias
        const permisosPorPagina = {
            "grouvex-studios-recording": ['artista', 'verified-employee', 'owner-recording', 'verified-team'],
            "grouvex-studios-animation": ['artista', 'verified-employee', 'verified-team'],
            "team": ['verified-team', 'admin', 'owner', 'verified-employee'],
            "planeta": ['verified-partner', 'partner', 'verified-team'],
            "pacman": ['premium', 'verified-partner', 'partner', 'verified-team', 'owner']
        };

        const nombresEquipos = {
            "grouvex-studios-recording": "Artista o Empleado",
            "grouvex-studios-animation": "Artista o Empleado",
            "team": "Miembro del Team",
            "planeta": "Partner o VPartner",
            "pacman": "Premium, Partner o Miembro del Team"
        };

        if (permisosPorPagina[paginaActual]) {
            const tieneAcceso = permisosPorPagina[paginaActual].some(insignia => 
                usuarioTieneInsignia(insigniasUsuario, insignia)
            );

            if (!tieneAcceso) {
                const equipoRequerido = nombresEquipos[paginaActual];
                mostrarNotificacion(`⛔ Requieres ser ${equipoRequerido}. Redirigiendo...`);
                setTimeout(() => {
                    window.location.href = "https://grouvex.github.io";
                }, 5000);
                return;
            }
        }
        
        // Si el usuario está autenticado pero no hay página restringida, mostrar notificación de registro
        mostrarNotificacionRegistro();
    });
}

// ============================================
// FUNCIONES DE NAVEGACIÓN
// ============================================

function redirectUser() {
    const user = auth.currentUser;
    if (!user) return;
    
    const defaultPath = "https://grouvex.github.io";
    const lastPath = localStorage.getItem('lastVisitedPath') || defaultPath;
    verificarAcceso();
    setTimeout(() => { window.location.href = lastPath; }, 1000);
}

// ============================================
// FUNCIONES DE PERFIL Y USUARIO
// ============================================

async function updateProfileUI(targetUser) {
    const nombreUsuario = targetUser.displayName || "Usuario";
    const userID = targetUser.uid;
    
    // Actualizar elementos básicos
    const actualizarElemento = (id, valor) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    };
    
    actualizarElemento('correoElectronico', targetUser.email || 'Sin email');
    actualizarElemento('userID', `GS-${userID}`);
    
    // Actualizar nombre de usuario
    const usuarioElement = document.querySelector('.usuario');
    if (usuarioElement) {
        usuarioElement.textContent = nombreUsuario;
        usuarioElement.className = `usuario ${nombreUsuario.replace(/\s+/g, '-')}`;
    }
    
    // Actualizar foto de perfil
    const fotoPerfil = document.getElementById('fotoPerfil');
    if (fotoPerfil) {
        fotoPerfil.src = targetUser.photoURL || 'https://grouvex.com/img/GROUVEX.png';
        fotoPerfil.alt = nombreUsuario;
    }
    
    // Mostrar insignias después de un breve delay para asegurar que el userID esté actualizado
    setTimeout(() => {
        mostrarInsigniasUsuarioEnPerfil();
    }, 500);
}

async function getUserData(userId) {
    try {
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            return {
                uid: userId,
                email: userData.email || '',
                displayName: userData.displayName || 'Usuario',
                photoURL: userData.photoURL || 'https://grouvex.com/img/GROUVEX.png'
            };
        } else {
            return {
                uid: userId,
                email: 'Desconocido',
                displayName: 'Usuario',
                photoURL: 'https://grouvex.com/img/GROUVEX.png'
            };
        }
    } catch (error) {
        console.error('Error obteniendo datos de usuario:', error);
        return {
            uid: userId,
            email: 'Error',
            displayName: 'Usuario',
            photoURL: 'https://grouvex.com/img/GROUVEX.png'
        };
    }
}

function eliminarDatosUsuario(userId) {
    const userRef = ref(database, `users/${userId}`);
    return remove(userRef);
}

// ============================================
// INICIALIZACIÓN Y CONFIGURACIÓN
// ============================================

function inicializarFormularioDeAutenticacion() {
    const authForm = document.getElementById('authForm');
    const formTitle = document.getElementById('formTitle');
    let isLogin = true;
    
    if (formTitle) {
        formTitle.textContent = 'Inicio de Sesión';
    }
    
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            handleEmailAuth(email, password, isLogin);
        });
    }

    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
        googleBtn.addEventListener('click', handleGoogleLogin);
    }
}

// Comprobar periódicamente si el campo gs-user-id existe
function checkAndSetGSUserId() {
    const checkInterval = setInterval(() => {
        const gsUserIdInput = document.getElementById('gs-user-id');
        const user = auth.currentUser;
        
        if (gsUserIdInput && user) {
            gsUserIdInput.value = "GS-" + user.uid;
            console.log("GSUserID actualizado:", user.uid);
            clearInterval(checkInterval);
        } else if (gsUserIdInput && !user) {
            gsUserIdInput.value = "Not Defined";
            console.log("Usuario no autenticado, GSUserID establecido como 'Not Defined'");
            clearInterval(checkInterval);
        }
    }, 1000);
}

// ============================================
// OBSERVADOR DE AUTENTICACIÓN PRINCIPAL
// ============================================

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("✅ Usuario autenticado:", user.email);
        console.log("🔑 ID autenticado:", user.uid);
        
        const urlParams = new URLSearchParams(window.location.search);
        const viewedUserId = urlParams.get('userId');
        const isViewingOwnProfile = !viewedUserId || viewedUserId === user.uid;
        const targetUserId = isViewingOwnProfile ? user.uid : viewedUserId;
        
        let targetUser;
        if (isViewingOwnProfile) {
            targetUser = user;
        } else {
            targetUser = await getUserData(targetUserId);
        }
        
        // Actualizar GSUserID
        const gsUserIdInput = document.getElementById('gs-user-id');
        if (gsUserIdInput) {
            gsUserIdInput.value = "GS-" + user.uid;
        }
        
        // Actualizar UI con insignias
        await updateProfileUI(targetUser);
        
        // Mostrar contenido
        const authContainer = document.getElementById('auth-container');
        const content = document.getElementById('content');
        
        if (authContainer) authContainer.style.display = 'none';
        if (content) content.style.display = 'block';
        
    } else {
        console.log("❌ Usuario no autenticado");
        
        const authContainer = document.getElementById('auth-container');
        const content = document.getElementById('content');
        
        if (authContainer) authContainer.style.display = 'block';
        if (content) content.style.display = 'none';
        
        // Resetear GSUserID
        const gsUserIdInput = document.getElementById('gs-user-id');
        if (gsUserIdInput) {
            gsUserIdInput.value = "Not Defined";
        }
        
        if (window.location.pathname.includes('login')) {
            inicializarFormularioDeAutenticacion();
        }
    }
});

// ============================================
// EVENTOS AL CARGAR EL DOM
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Configurar botones
    document.getElementById('logoutBtn')?.addEventListener('click', () => signOut(auth));
    
    document.getElementById('deleteBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleAccountDeletion();
    });
    
    document.getElementById('resetPasswordBtn')?.addEventListener('click', () => {
        const email = prompt('Introduce tu correo electrónico para restablecer la contraseña:');
        if (email) {
            sendPasswordResetEmail(auth, email)
                .then(() => alert('Correo para restablecer la contraseña enviado.'))
                .catch((error) => alert('Error al enviar el correo de restablecimiento: ' + error.message));
        }
    });

    // Verificar acceso
    const paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual !== 'login') {
        verificarAcceso();
    }
    
    // Inicializar estilos de insignias
    aplicarEstilosInsignias();
    
    // Iniciar verificación de GSUserID
    checkAndSetGSUserId();
});
