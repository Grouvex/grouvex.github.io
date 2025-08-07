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
// FUNCIONES DE BASE DE DATOS
// ============================================

async function followUser(currentUserId, targetUserId) {
    await set(ref(database, `followers/${targetUserId}/${currentUserId}`), true);
    await set(ref(database, `following/${currentUserId}/${targetUserId}`), true);
}

async function unfollowUser(currentUserId, targetUserId) {
    await remove(ref(database, `followers/${targetUserId}/${currentUserId}`));
    await remove(ref(database, `following/${currentUserId}/${targetUserId}`));
}

async function getFollowStats(userId) {
    const followers = await get(ref(database, `followers/${userId}`));
    const following = await get(ref(database, `following/${userId}`));
    return {
        followersCount: followers.exists() ? Object.keys(followers.val()).length : 0,
        followingCount: following.exists() ? Object.keys(following.val()).length : 0
    };
}

async function checkIfFollowing(currentUserId, targetUserId) {
    const snapshot = await get(ref(database, `following/${currentUserId}/${targetUserId}`));
    return snapshot.exists();
}

async function getUserData(userId) {
    const snapshot = await get(ref(database, `users/${userId}`));
    return { uid: userId, ...snapshot.val() };
}

function setupPresence(user) {
    const userStatusRef = ref(database, `status/${user.uid}`);
    set(userStatusRef, { online: true, lastChanged: Date.now() });
    onDisconnect(userStatusRef).update({ online: false });
}

async function eliminarDatosUsuario(userId) {
    try {
        await Promise.all([
            remove(ref(database, `users/${userId}`)),
            remove(ref(database, `followers/${userId}`)),
            remove(ref(database, `following/${userId}`)),
            remove(ref(database, `status/${userId}`))
        ]);
        console.log('Datos de usuario eliminados exitosamente');
    } catch (error) {
        console.error('Error al eliminar datos:', error);
        throw new Error('Error al limpiar datos de usuario: ' + error.message);
    }
}

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
          const provider = new firebase.auth.GoogleAuthProvider();
          provider.setCustomParameters({ prompt: 'select_account' });
          
          const result = await firebase.auth().signInWithPopup(provider);
          
          // Guardar información del usuario en la base de datos
          await database.ref('users/' + result.user.uid).set({
              email: result.user.email,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL || "https://grouvex.com/img/GROUVEX.png",
              lastLogin: Date.now(),
              provider: "google"
          });
          
          mostrarNotificacion('✅ Inicio de sesión con Google exitoso');
          redirectUser();
      } catch (error) {
          mostrarNotificacion(`❌ ${traducirError(error)}`, true);
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
            <a href="https://grouvex.github.io/login" style="color: white; text-decoration: underline;">Registrarme</a>
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
        <h1 style="color: black"><span class="insignia owner"></span> | Vacaciones</h1>
        <div style="margin-top: 10px; display: flex; justify-content: center; gap: 10px;flex-wrap: wrap;flex-direction: column;align-content: center;">
        <p>El Equipo de Grouvex Studios se a tomado un descanso. GSRecoring podrá lanzar 2  por artista durante  <n>el mes de Agosto y Septiembre</p>
        <p>Entra en vigor el <n>8 de Agosto de 2025</n></p>
        <p>Esto modifica por tanto, la sección de <n>Obligaciones del Artista > Entrega de Material</n> <a href="https://grouvex.com/grouvex-studios-recording#Entrega_de_Material" style="color: white; text-decoration: underline;">GSRecording > Entrega de Material</a></p>
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
// INICIALIZACIÓN
// ============================================

function inicializarFormularioDeAutenticacion() {
    const authForm = document.getElementById('authForm');
    const formTitle = document.getElementById('formTitle');
    const toggleButton = document.getElementById('toggleButton');
    let isLogin = true;

    toggleButton.addEventListener('click', () => {
        isLogin = !isLogin;
        formTitle.textContent = isLogin ? 'Inicio de Sesión' : 'Registro';
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        handleEmailAuth(email, password, isLogin);
    });

    document.getElementById('google-login-btn').addEventListener('click', handleGoogleLogin);
}

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

    // Mostrar noticias
    if (true) mostrarnewsAdv();

    // Verificar acceso
    const paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual !== 'login') verificarAcceso();
});

// Observador de autenticación principal
onAuthStateChanged(auth, async (user) => {
    if (user) {
        setupPresence(user);
        console.log("Usuario autenticado:", user.email);

        const urlParams = new URLSearchParams(window.location.search);
        const viewedUserId = urlParams.get('userId');
        const isViewingOwnProfile = !viewedUserId || viewedUserId === user.uid;
        const targetUserId = isViewingOwnProfile ? user.uid : viewedUserId;
        const targetUser = isViewingOwnProfile ? user : await getUserData(targetUserId);
        const nombreUsuario = targetUser.displayName || "Usuario";
        const usuarioElement = document.querySelector('.usuario');

        // Actualizar UI
        const updateProfileUI = () => {
            document.getElementById('correoElectronico').textContent = targetUser.email || 'Correo no definido';
            usuarioElement.className = nombreUsuario.replace(/\s+/g, '-');
            document.getElementById('userID').textContent = `GS-${targetUser.uid}`;
            document.getElementById('fotoPerfil').src = targetUser.photoURL || 'https://grouvex.com/img/GROUVEX.png';
            mostrarUsuarioYInsignias(nombreUsuario, [usuarioElement]);
        };

        // Manejar seguimiento
        const updateFollowUI = async () => {
            const followButton = document.getElementById('followButton');
            const followersCount = document.getElementById('followersCount');
            const followingCount = document.getElementById('followingCount');

            const stats = await getFollowStats(targetUser.uid);
            followersCount.textContent = stats.followersCount;
            followingCount.textContent = stats.followingCount;

            if (!isViewingOwnProfile) {
                const isFollowing = await checkIfFollowing(user.uid, targetUser.uid);
                followButton.style.display = 'block';
                followButton.textContent = isFollowing ? 'Dejar de seguir' : 'Seguir';
                followButton.onclick = async () => {
                    try {
                        if (isFollowing) await unfollowUser(user.uid, targetUser.uid);
                        else await followUser(user.uid, targetUser.uid);
                        updateFollowUI();
                    } catch (error) {
                        mostrarNotificacion(`Error: ${error.message}`, true);
                    }
                };
            } else {
                followButton.style.display = 'none';
            }
        };

        // Mostrar contenido
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        updateProfileUI();
        await updateFollowUI();

    } else {
        console.log("Usuario no autenticado");
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('content').style.display = 'none';
        if (window.location.pathname.includes('login')) {
            inicializarFormularioDeAutenticacion();
        }
    }
});
