!function(){'use strict';document.addEventListener('keydown',e=>{((e.ctrlKey&&e.shiftKey&&['I','J','C','K'].includes(e.key))||['F12','F8'].includes(e.key)||(e.ctrlKey&&['U','S'].includes(e.key.toUpperCase())))&&(e.preventDefault(),e.stopImmediatePropagation())},!0),document.addEventListener('contextmenu',e=>{e.preventDefault(),e.stopImmediatePropagation()},!0),document.addEventListener('selectstart',e=>e.preventDefault(),!0),setInterval(()=>{(window.outerWidth-window.innerWidth>100||window.outerHeight-window.innerHeight>100)&&console.log('x')},1e3)}();

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
// CONSTANTES Y DATOS
// ============================================

const uidsOwner = ["qY57xpuDyFdSOBxSNiehbRbJ1p32"];
const uidsTeamAdmins = ["cQRgzlky1eNHjUh61GMPTTRnIZq2", "aO5Y2hQVl9Zn7KlElpgI7jqsFfc2"];
const uidsTeamMods = [];
const uidsTeamBugs = [];
const uidsTeam = [...uidsOwner, ...uidsTeamAdmins, ...uidsTeamMods, ...uidsTeamBugs];
const uidsArtistas = [...uidsOwner, ...uidsTeamAdmins, "bY7fMyURlggvZyXDL9dCjwZEmU62", "LTqeoFuZmqTSa4HiJkfNXbCHifa2"];
const uidsPremium = [...uidsOwner, ...uidsTeamAdmins];
const uidsPartner = [...uidsOwner, ...uidsTeamAdmins];
const uidsVPartner = [...uidsOwner, ...uidsTeamAdmins];

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
    "Ángela": {
        principales: ["gsmember", "verified"],
        GSRecording: ["artista", "verified"],
        GSAnimation: [],
        GSDesign: []
    }
};

// ============================================
// CONFIGURACIÓN INSIGNIAS DESDE GOOGLE SHEETS
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
    'verified-voice': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-voice.gif',
    'bughunter': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-bughunter.gif',
    'partner': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-partner.gif',
    'team': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-team.png',
    'voice': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified-voice.gif',
    'developer': 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/vdeveloper.gif'
};

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

function mostrarnewsAdv() {
    const newsAdv = document.createElement("div");
    if (window.innerWidth < 768) {
        newsAdv.style = `
            position: fixed;
            bottom: 3px;
            left: 1px;
            padding: 1px;
            background: rgb(5 59 219);
            color: white;
            border-radius: 9px;
            box-shadow: 2px 2px 2px gold;
            z-index: 1;
            width: 99%;
            max-height: 90px;
            overflow-y: auto;
            text-align: center;
            font-size: 12px;
        `;
    } else {
        newsAdv.style = `
            position: fixed;
            top: 3px;
            left: 1px;
            padding: 1px;
            background: rgb(5 59 219);
            color: white;
            border-radius: 9px;
            box-shadow: 2px 2px 2px gold;
            z-index: 1;
            width: 28%;
            max-height: 180px;
            overflow-y: auto;
            text-align: center;
            font-size: 12px;
        `;
    }
    newsAdv.innerHTML = `
        <h1 style="color: black"><span class="insignia sistema"></span> | Activacion de Sis-GCO</h1>
        <div style="margin-top: 10px; display: flex; justify-content: center; gap: 10px;flex-wrap: wrap;flex-direction: column;align-content: center;">
        <p>El Equipo de Gestión de Grouvex Studios ha activado de manera <n>INMEDIATA</n> el <n>Sistema de Gestión de Continuidad Operacional (GCO)</n> (NOGS/2025/GCO-002), con efecto desde el <n>22 de noviembre de 2025 a las 20:40 UTC</n>.</p>
        <p>Podrá ver dicha notificación con más detalle en el <a href="https://drive.google.com/file/d/1sjrcIYAqTSdJJP4rtIoW5iTFTDtzccSs/view" style="color: white; text-decoration: underline;">N.O.Grouvex Studios</a></p>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; color: red; cursor: pointer;">Cerrar</button>
        </div>
    `;
    document.body.appendChild(newsAdv);
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
// FUNCIONES DE CONTROL DE ACCESO
// ============================================

function verificarAcceso() {
    onAuthStateChanged(auth, (user) => {
        const mantenimientoActivo = false;
        const paginaMantenimiento = "mantenimiento";
        const paginaOficial = "ddoo";
        const paginaActual = window.location.pathname.split("/").pop();

        if (mantenimientoActivo) {
          if ( paginaActual === paginaOficial || paginaActual === paginaMantenimiento || (user && uidsTeam.includes(user.uid))) {
            mostrarNotificacion(`🚧 La Página está en mantenimiento. ✅ Tienes acceso a ella.`);
            return;
            }
            if (paginaActual !== paginaOficial && paginaActual !== paginaMantenimiento && !(user && uidsTeam.includes(user.uid))) {
                alert(`🚧 La Página está en mantenimiento, se te refirigirá a ${paginaMantenimiento}.`);
                mostrarNotificacion(`🚧 La Página está en mantenimiento, se te refirigirá a ${paginaMantenimiento}.`);
                setTimeout(() => { window.location.href = `https://grouvex.github.io/${paginaMantenimiento}`; }, 3000);
                return;
            }
        } else if (paginaActual === paginaMantenimiento) {
            mostrarNotificacion(`Está página no está en mantenimiento, se te redirigirá a la página de inicio`,true);
            setTimeout(() => { window.location.href = `https://grouvex.github.io`; }, 3000);
            return;
        }

        const permisos = {
            "grouvex-studios-recording": uidsArtistas,
            "grouvex-studios-animation": uidsArtistas,
            "team": uidsTeam,
            "planeta": [...uidsPartner, ...uidsVPartner],
            "pacman": [...uidsPremium, ...uidsPartner, ...uidsVPartner]
        };

        const nombresEquipos = {
            "grouvex-studios-recording": "Artista",
            "grouvex-studios-animation": "Artista",
            "team": "Team",
            "planeta": "Partner o VPartner",
            "pacman": "Premium, Partner o VPartner"
        };

        if (permisos[paginaActual]) {
            if (!user) {
                alert(`🔒 Necesitas estar registrado y ser ${nombresEquipos[paginaActual]}`);
                mostrarNotificacion(`🔒 Necesitas estar registrado y ser ${nombresEquipos[paginaActual]}`);
                setTimeout(() => { window.location.href = "https://grouvex.github.io/login" }, 5000);
                return;
            }

            if (!permisos[paginaActual].includes(user.uid)) {
                const equipoRequerido = nombresEquipos[paginaActual];
                alert(`⛔ Requieres ser ${equipoRequerido}. Redirigiendo a Equipo → Insignias...`);
                mostrarNotificacion(`⛔ Requieres ser ${equipoRequerido}. Redirigiendo a Equipo → Insignias...`);
                setTimeout(() => {
                    window.location.href = "https://grouvex.github.io/equipo#insignias";
                }, 5000);
                return;
            }
        } else if (!user) {
            mostrarNotificacionRegistro();
        }
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
// FUNCIONES PARA OBTENER INSIGNIAS DESDE GOOGLE SHEETS
// ============================================

async function obtenerTodasInsigniasUsuario(userID) {
    try {
        console.log('🔍 Buscando insignias para UserID:', userID);
        
        // Normalizar el UserID (sin "GS-" si está presente)
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
        
        // Buscar índices de las columnas
        const userIDIndex = encontrarIndiceColumna(headers, ['userid', 'user id', 'id', 'grouvex']);
        const insigniasIndex = encontrarIndiceColumna(headers, ['insignia', 'badge']);
        
        console.log('📊 Índices encontrados:', { 
            userIDIndex, 
            insigniasIndex,
            userIDHeader: userIDIndex !== -1 ? headers[userIDIndex] : 'No encontrada',
            insigniasHeader: insigniasIndex !== -1 ? headers[insigniasIndex] : 'No encontrada'
        });
        
        if (userIDIndex === -1 || insigniasIndex === -1) {
            console.error('❌ Faltan columnas necesarias');
            return [];
        }
        
        // Buscar el usuario
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
                        return procesarTextoInsignias(textoInsignias);
                    }
                    return [];
                }
            }
        }
        
        console.log('❌ Usuario no encontrado en Google Sheets');
        return obtenerInsigniasLocales(searchUserID);
        
    } catch (error) {
        console.error('❌ Error obteniendo insignias:', error);
        return obtenerInsigniasLocales(userID.replace(/^GS-/, ''));
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

function procesarTextoInsignias(textoInsignias) {
    if (!textoInsignias || textoInsignias.trim() === '') {
        return [];
    }
    
    // Separar por diferentes delimitadores
    const delimitadores = /[,;|/\\\n\t]+/;
    const insigniasCrudas = textoInsignias.split(delimitadores);
    const insigniasProcesadas = [];
    
    insigniasCrudas.forEach(insignia => {
        const insigniaLimpia = insignia.trim();
        
        if (insigniaLimpia && insigniaLimpia.length > 0) {
            // Buscar en el mapa de insignias
            const urlImagen = INSIGNIAS_MAP[insigniaLimpia.toLowerCase()];
            
            if (urlImagen) {
                insigniasProcesadas.push({
                    nombre: insigniaLimpia,
                    url: urlImagen
                });
            } else {
                // Intentar con diferentes formatos
                const formatos = [
                    insigniaLimpia.toLowerCase().replace(/\s+/g, '-'),
                    `verified-${insigniaLimpia.toLowerCase().replace(/\s+/g, '-')}`,
                    `v${insigniaLimpia.toLowerCase().replace(/\s+/g, '')}`
                ];
                
                for (const formato of formatos) {
                    if (INSIGNIAS_MAP[formato]) {
                        insigniasProcesadas.push({
                            nombre: insigniaLimpia,
                            url: INSIGNIAS_MAP[formato]
                        });
                        break;
                    }
                }
            }
        }
    });
    
    return insigniasProcesadas;
}

function obtenerInsigniasLocales(userID) {
    console.log('Usando sistema local para:', userID);
    
    // Sistema de respaldo basado en UIDs
    const insigniasPorUID = {
        // Owner
        'qY57xpuDyFdSOBxSNiehbRbJ1p32': ['verified-team', 'owner', 'sistema', 'GROUVEX'],
        
        // Team Admins
        'cQRgzlky1eNHjUh61GMPTTRnIZq2': ['verified-team', 'vvadmin', 'vdeveloper'],
        'aO5Y2hQVl9Zn7KlElpgI7jqsFfc2': ['verified-team', 'vvadmin', 'vdeveloper'],
        
        // Artistas
        'bY7fMyURlggvZyXDL9dCjwZEmU62': ['verified-team', 'artista'],
        'LTqeoFuZmqTSa4HiJkfNXbCHifa2': ['verified-team', 'artista']
    };
    
    const insignias = insigniasPorUID[userID] || ['verified'];
    return procesarTextoInsignias(insignias.join(','));
}

// ============================================
// FUNCIONES PARA MOSTRAR INSIGNIAS
// ============================================

async function mostrarTodasInsigniasUsuario(userID, containerId = 'insignias-container') {
    try {
        // Obtener las insignias
        const insigniasUsuario = await obtenerTodasInsigniasUsuario(userID);
        
        // Obtener o crear contenedor
        let container = document.getElementById(containerId);
        
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = 'all-badges-container';
            
            // Buscar donde insertar
            const lugaresInsercion = [
                document.getElementById('profile-section'),
                document.querySelector('.profile-container'),
                document.getElementById('user-info'),
                document.querySelector('.profile-info'),
                document.querySelector('main')
            ];
            
            for (const lugar of lugaresInsercion) {
                if (lugar) {
                    lugar.appendChild(container);
                    break;
                }
            }
            
            // Si no se encontró lugar, crear uno nuevo
            if (!container.parentElement) {
                const profileSection = document.createElement('div');
                profileSection.className = 'profile-badges-section';
                profileSection.appendChild(container);
                document.body.insertBefore(profileSection, document.body.firstChild);
            }
        }
        
        // Limpiar y mostrar
        container.innerHTML = '';
        
        if (!insigniasUsuario || insigniasUsuario.length === 0) {
            container.innerHTML = `
                <div class="no-badges-message">
                    <p>🎯 No hay insignias asignadas</p>
                    <small>Completa el formulario de Grouvex Studios para obtener insignias</small>
                </div>
            `;
            return;
        }
        
        // Mostrar cada insignia
        insigniasUsuario.forEach((insignia, index) => {
            const badgeElement = crearElementoInsignia(insignia, index);
            container.appendChild(badgeElement);
        });
        
        // Aplicar estilos
        aplicarEstilosInsignias();
        
    } catch (error) {
        console.error('❌ Error mostrando insignias:', error);
    }
}

function crearElementoInsignia(insignia, index) {
    const badgeElement = document.createElement('div');
    badgeElement.className = 'badge-item';
    badgeElement.dataset.badge = insignia.nombre.toLowerCase();
    badgeElement.style.animationDelay = `${index * 0.1}s`;
    
    // Crear imagen
    const img = document.createElement('img');
    img.src = insignia.url;
    img.alt = insignia.nombre;
    img.loading = 'lazy';
    
    // Crear tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'badge-tooltip';
    tooltip.textContent = insignia.nombre.replace(/-/g, ' ').toUpperCase();
    
    // Crear contenedor interno
    const innerContainer = document.createElement('div');
    innerContainer.className = 'badge-inner';
    innerContainer.appendChild(img);
    innerContainer.appendChild(tooltip);
    
    badgeElement.appendChild(innerContainer);
    
    // Añadir eventos hover
    badgeElement.addEventListener('mouseenter', () => {
        badgeElement.classList.add('badge-hover');
        tooltip.style.opacity = '1';
        tooltip.style.visibility = 'visible';
    });
    
    badgeElement.addEventListener('mouseleave', () => {
        badgeElement.classList.remove('badge-hover');
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
    });
    
    return badgeElement;
}

function aplicarEstilosInsignias() {
    if (!document.getElementById('badges-styles')) {
        const style = document.createElement('style');
        style.id = 'badges-styles';
        style.textContent = `
            .all-badges-container {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                padding: 20px;
                margin: 20px 0;
                background: linear-gradient(135deg, rgba(15, 15, 30, 0.9), rgba(25, 25, 45, 0.9));
                border-radius: 15px;
                border: 1px solid rgba(100, 150, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                min-height: 100px;
            }
            
            .badge-item {
                position: relative;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                overflow: hidden;
                transition: all 0.3s ease;
                animation: badgeAppear 0.5s ease-out forwards;
                opacity: 0;
                transform: translateY(20px);
            }
            
            @keyframes badgeAppear {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .badge-inner {
                width: 100%;
                height: 100%;
                position: relative;
            }
            
            .badge-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 50%;
                border: 2px solid transparent;
                transition: all 0.3s ease;
            }
            
            .badge-item:hover img {
                transform: scale(1.2);
                border-color: gold;
                box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                filter: brightness(1.1);
            }
            
            .badge-tooltip {
                position: absolute;
                bottom: -35px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                white-space: nowrap;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 100;
                pointer-events: none;
            }
            
            .no-badges-message {
                width: 100%;
                text-align: center;
                padding: 30px;
                color: #aaa;
            }
            
            .no-badges-message p {
                font-size: 16px;
                margin-bottom: 8px;
                color: #888;
            }
            
            .no-badges-message small {
                font-size: 12px;
                color: #666;
            }
            
            .profile-badges-section {
                margin: 20px auto;
                max-width: 800px;
            }
            
            @media (max-width: 768px) {
                .all-badges-container {
                    padding: 15px;
                    gap: 10px;
                }
                
                .badge-item {
                    width: 50px;
                    height: 50px;
                }
            }
        `;
        document.head.appendChild(style);
    }
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
    
    const fotoPerfil = document.getElementById('fotoPerfil');
    if (fotoPerfil) {
        fotoPerfil.src = targetUser.photoURL || 'https://grouvex.com/img/GROUVEX.png';
        fotoPerfil.alt = nombreUsuario;
    }
    
    // Actualizar clase del usuario
    const usuarioElement = document.querySelector('.usuario');
    if (usuarioElement) {
        usuarioElement.className = `usuario ${nombreUsuario.replace(/\s+/g, '-')}`;
    }
    
    // Mostrar las insignias del usuario
    await mostrarTodasInsigniasUsuario(userID);
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

    // Mostrar noticias (deshabilitado por ahora)
    if (false) mostrarnewsAdv();

    // Verificar acceso
    const paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual !== 'login') verificarAcceso();
    
    // Inicializar estilos de insignias
    aplicarEstilosInsignias();
    
    // Iniciar verificación de GSUserID
    checkAndSetGSUserId();
});
