import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, EmailAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, deleteUser, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification , reauthenticateWithCredential} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, remove, onValue, onDisconnect, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Configuración de Firebase
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

// Funciones de seguimiento
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

// Sistema de presencia
function setupPresence(user) {
    const userStatusRef = ref(database, `status/${user.uid}`);
    set(userStatusRef, { online: true, lastChanged: Date.now() });
    onDisconnect(userStatusRef).update({ online: false });
}

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
        const usuarioElement = document.getElementById('usuario');
        // Actualizar UI
        const updateProfileUI = () => {
            document.getElementById('correoElectronico').textContent = targetUser.email || 'Correo no definido';
            document.getElementById('usuario').textContent = targetUser.displayName || 'Usuario no definido';
            usuarioElement.id = nombreUsuario.replace(/\s+/g, '_');
            document.getElementById('userID').textContent = `GS-${targetUser.uid}`;
            document.getElementById('fotoPerfil').src = targetUser.photoURL || 'https://grouvex.com/img/GROUVEX.png';
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
                        if (isFollowing) {
                            await unfollowUser(user.uid, targetUser.uid);
                        } else {
                            await followUser(user.uid, targetUser.uid);
                        }
                        updateFollowUI(); // Actualizar UI después de acción
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

// Sistema de autenticación
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

function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    signInWithPopup(auth, provider)
        .then(async (result) => {
            await completeUserProfile(result.user, true);
            mostrarNotificacion('✅ ¡Bienvenido con Google!');
            redirectUser();
        })
        .catch(error => {
            mostrarNotificacion(`❌ Error Google: ${error.message}`, true);
        });
}

// Sistema de notificaciones
function mostrarNotificacion(mensaje, esError = false) {
    const notificacion = document.createElement("div");
    notificacion.className = `notificacion ${esError ? 'error' : 'exito'}`;
    notificacion.innerHTML = `
        <p>${mensaje}</p>
        <div class="progress-bar"></div>
    `;
            notificacion.style = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            background: #ff4444;
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

    if (true) {
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
                <h1 style="color: black"><span class="insignia owner-recording"></span> | Modifiacón de Tiempos</h1>
                <div style="margin-top: 10px; display: flex; justify-content: center; gap: 10px;flex-wrap: wrap;flex-direction: column;align-content: center;">
                <p>El Equipo de Grouvex Studios Recording está satudado actualmente, por tanto, durante un periodo, la entrega del proyecto para lanzarlo, deberá ser <n>6 semanas antes de la fecha de venta</n> que indique el artista.</p>
                <p>Entra en vigor el <n>2 de Marzo de 2025</n></p>
                <p>Esto modifica por tanto, la sección de <n>Obligaciones del Artista > Entrega de Material</n> <a href="https://grouvex.com/grouvex-studios-recording#Entrega_de_Material" style="color: white; text-decoration: underline;">GSRecording > Entrega de Material</a></p>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; color: red; cursor: pointer;">Cerrar</button>
                </div>
            `;
            document.body.appendChild(newsAdv);
        }
        mostrarnewsAdv();
    }

    function verificarAcceso() {
        onAuthStateChanged(auth, (user) => {
            const mantenimientoActivo = false;
            const paginaMantenimiento = "mantenimiento";
            const paginaActual = window.location.pathname.split("/").pop();

            if (mantenimientoActivo) {
                if (paginaActual !== paginaMantenimiento && !(user && uidsTeam.includes(user.uid))) {
                    alert(`🚧 La Página está en mantenimiento, se te refirigirá a ${paginaMantenimiento}.`);
                    setTimeout(() => { window.location.href = `https://grouvex.github.io/${paginaMantenimiento}`; }, 3000);
                    return;
                }
            } else if (paginaActual === paginaMantenimiento) {
                window.location.href = "https://grouvex.github.io";
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
            } else {
                if (!user) {
                    mostrarNotificacionRegistro();
                }
            }
        });
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

        setTimeout(() => {
            notificacion.remove();
        }, 8000);
    }
    
// Sistema de acceso
    const uidsOwner = ["qY57xpuDyFdSOBxSNiehbRbJ1p32"];
    const uidsTeamAdmins = ["cQRgzlky1eNHjUh61GMPTTRnIZq2", "aO5Y2hQVl9Zn7KlElpgI7jqsFfc2"];
    const uidsTeamMods = [];
    const uidsTeamBugs = [];
    const uidsTeam = [...uidsOwner, ...uidsTeamAdmins, ...uidsTeamMods, ...uidsTeamBugs];
    const uidsArtistas = [...uidsOwner, ...uidsTeamAdmins, "bY7fMyURlggvZyXDL9dCjwZEmU62", "LTqeoFuZmqTSa4HiJkfNXbCHifa2"];
    const uidsPremium = [...uidsOwner, ...uidsTeamAdmins];
    const uidsPartner = [...uidsOwner, ...uidsTeamAdmins];
    const uidsVPartner = [...uidsOwner, ...uidsTeamAdmins];

    verificarAcceso();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                console.log("Usuario cerró sesión");
                alert('Usuario cerró sesión');
                location.reload();
            }).catch((error) => {
                console.error("Error al cerrar sesión:", error.message);
                alert('Error al cerrar sesión: ' + error.message);
            });
        });
    }

        const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', () => {
            const email = prompt('Introduce tu correo electrónico para restablecer la contraseña:');
            if (email) {
                console.log("Enviando correo de restablecimiento a:", email);
                sendPasswordResetEmail(auth, email)
                    .then(() => {
                        console.log("Correo de restablecimiento enviado");
                        alert('Correo para restablecer la contraseña enviado.');
                    })
                    .catch((error) => {
                        console.error("Error al enviar el correo de restablecimiento:", error.message);
                        alert('Error al enviar el correo de restablecimiento: ' + error.message);
                    });
            } else {
                console.log("No se proporcionó un correo electrónico para el restablecimiento");
            }
        });
    }

      function reauthenticateUser(user, password) {
          if (!password) {
              throw new Error('Se requiere contraseña para esta acción');
          }
          const credential = EmailAuthProvider.credential(user.email, password);
          return reauthenticateWithCredential(user, credential);
      }
        function verificarCorreoUsuario(user) {
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

    function eliminarCuentaUsuario(user) {
        const password = prompt("Para eliminar tu cuenta, por favor introduce tu contraseña:");
        return reauthenticateUser(user, password).then(() => {
            return deleteUser(user).then(() => {
                return eliminarDatosUsuario(user.uid); // Asegurar secuencia correcta
            });
        }).then(() => {
            console.log("Cuenta de usuario eliminada de Firebase Authentication.");
        }).catch((error) => {
            console.error("Error al eliminar la cuenta de usuario:", error);
            switch (error.code) {
                case 'auth/requires-recent-login':
                    alert('Por motivos de seguridad, debes volver a iniciar sesión para eliminar tu cuenta.');
                    window.location.href = "https://grouvex.github.io/login";
                    break;
                default:
                    alert('Error al eliminar la cuenta de usuario: ' + error.message);
            }
            throw error;
        });
    }

    function eliminarDatosUsuario(userId) {
        const userRef = doc(db, 'users', userId);

        return deleteDoc(userRef).then(() => {
            console.log("Datos del usuario eliminados de Firestore.");
        }).catch((error) => {
            console.error("Error al eliminar los datos del usuario:", error);
            alert('Error al eliminar los datos del usuario: ' + error.message);
            throw error;
        });
    }

    function eliminarCuentaYDatosUsuario(userId) {
        const user = auth.currentUser;

        eliminarCuentaUsuario(user)
            .then(() => {
                return eliminarDatosUsuario(userId);
            })
            .then(() => {
                console.log("Eliminación completa de cuenta y datos de usuario.");
                alert('Tu cuenta y todos tus datos han sido eliminados.');
            })
            .catch((error) => {
                console.error("Error al eliminar la cuenta y los datos del usuario:", error);
                alert('Error al eliminar la cuenta y los datos del usuario: ' + error.message);
            });
    }
        const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            const user = auth.currentUser;
            if (!user.emailVerified) {
                verificarCorreoUsuario(user).then(() => {
                    const userId = user.uid;
                    eliminarCuentaYDatosUsuario(userId);
                }).catch((error) => {
                    console.error('Error durante el proceso de verificación:', error.message);
                });
            } else {
                const userId = user.uid;
                eliminarCuentaYDatosUsuario(userId);
            }
        });
    }

    mostrarUsuarios();
// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('authForm');
    const toggleButton = document.getElementById('toggleButton');
    let isLogin = true;

    toggleButton.addEventListener('click', () => {
        isLogin = !isLogin;
        document.getElementById('formTitle').textContent = isLogin ? 'Inicio de Sesión' : 'Registro';
        document.getElementById('authDisplayName').style.display = isLogin ? 'none' : 'block';
    });

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        handleEmailAuth(email, password, isLogin);
    });

    document.getElementById('google-login-btn').addEventListener('click', handleGoogleLogin);
    document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth));

    // Verificar acceso según la página
    const paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual !== 'login') verificarAcceso(paginaActual);
});

// Funciones complementarias
function redirectUser() {
    const allowedPaths = ["grouvex-studios-recording", "team"];
    const targetPath = allowedPaths.find(path => document.referrer.includes(path)) || "https://grouvex.github.io";
    window.location.href = targetPath;
}
