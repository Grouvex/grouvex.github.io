// Importar las funciones necesarias desde Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, deleteUser, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getDatabase, ref, set, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);

console.log("Firebase inicializado correctamente");

// Verificar si el usuario está autenticado
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Usuario autenticado:", user.email);
    checkAccess(user.uid);

    const authContainer = document.getElementById('auth-container');
    const content = document.getElementById('content');
    const correoElectronico = document.getElementById('correoElectronico');
    const usuario = document.getElementById('usuario');
    const userID = document.getElementById('userID');
    const fotoPerfil = document.getElementById('fotoPerfil');

    if (authContainer && content) {
      authContainer.style.display = 'none';
      content.style.display = 'block';
      correoElectronico.textContent = user.email || 'Correo no definido';
      usuario.textContent = user.displayName || 'Usuario no definido';
      userID.textContent = 'GS-' + user.uid;
      mostrarUsuarioYInsignias(user.displayName, document.querySelectorAll('.insignias'));
      fotoPerfil.src = user.photoURL || 'ruta/a/imagen/por/defecto.png';
    }
  } else {
    console.log("Usuario no autenticado");
    const authContainer = document.getElementById('auth-container');
    const content = document.getElementById('content');
    inicializarFormularioDeAutenticacion();
    if (authContainer && content) {
      authContainer.style.display = 'block';
      content.style.display = 'none';
    }
  }
});

function inicializarFormularioDeAutenticacion() {
  const authForm = document.getElementById('authForm');
  const formTitle = document.getElementById('formTitle');
  const authButton = document.getElementById('authButton');
  const emailLoginBtn = document.getElementById('email-login-btn');
  const googleLoginBtn = document.getElementById('google-login-btn');
  const toggleButton = document.getElementById('toggleButton');
  let isLogin = true;

  // Toggle entre inicio de sesión y registro
  toggleButton.addEventListener('click', () => {
    isLogin = !isLogin;
    if (isLogin) {
      formTitle.textContent = 'Inicio de Sesión';
      authButton.innerHTML = '<img src="https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified.png" alt="" width="15" height="15"> Iniciar Sesión';
      toggleButton.textContent = '¿No tienes cuenta? Regístrate';
      emailLoginBtn.innerHTML = '<img src="https://static.vecteezy.com/system/resources/previews/022/484/508/non_2x/google-mail-gmail-icon-logo-symbol-free-png.png" alt="" width="15" height="15"> Iniciar Sesión con Email';
      googleLoginBtn.innerHTML = '<img src="https://img.icons8.com/?size=512&id=17949&format=png" alt="" width="15" height="15"> Iniciar Sesión con Google';
    } else {
      formTitle.textContent = 'Registro';
      authButton.innerHTML = '<img src="https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified.png" alt="" width="15" height="15"> Registrar';
      toggleButton.textContent = '¿Ya tienes cuenta? Inicia Sesión';
      emailLoginBtn.innerHTML = '<img src="https://static.vecteezy.com/system/resources/previews/022/484/508/non_2x/google-mail-gmail-icon-logo-symbol-free-png.png" alt="" width="15" height="15"> Registrarse con Email';
      googleLoginBtn.innerHTML = '<img src="https://img.icons8.com/?size=512&id=17949&format=png" alt="" width="15" height="15"> Registrarse con Google';
    }
    console.log("Modo cambiado a", isLogin ? "Inicio de Sesión" : "Registro");
  });

  // Manejo del formulario de autenticación
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;

    if (isLogin) {
      handleEmailLogin(email, password);
    } else {
      handleEmailRegistration(email, password);
    }
  });

  // Función para iniciar sesión con Google
  googleLoginBtn.addEventListener('click', handleGoogleLogin);

  // Función para iniciar sesión con Email/Password desde prompt
  emailLoginBtn.addEventListener('click', () => {
    const email = prompt("Introduce tu email:");
    const password = prompt("Introduce tu contraseña:");
    if (isLogin) {
      handleEmailLogin(email, password);
    } else {
      handleEmailRegistration(email, password);
    }
  });
}

function handleEmailLogin(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuario inició sesión:", user.email);
      checkAccess(user.uid);
      alert(`Hola, ${user.displayName} (${user.email}). Disfruta de la Página Web. Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.`);
      redirectUser();
    })
    .catch((error) => {
      console.error("Error al iniciar sesión:", error.message);
      alert('Error al iniciar sesión: ' + error.message);
    });
}

function handleEmailRegistration(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuario registrado:", user.email);
      sendEmailVerification(user)
        .then(() => {
          console.log('Correo de verificación enviado.');
          alert('Por favor, verifica tu correo electrónico para continuar con su cuenta. Tienes 1h.');
          verifyEmailAndUpdateProfile(user);
        })
        .catch((error) => {
          console.error("Error al enviar correo de verificación:", error.message);
          alert('Error al enviar correo de verificación: ' + error.message);
        });
    })
    .catch((error) => {
      console.error("Error al registrar usuario:", error.message);
      alert('Error al registrar usuario: ' + error.message);
    });
}

function handleGoogleLogin() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Usuario inició sesión con Google:", user.email);
      if (!user.emailVerified) {
        sendEmailVerification(user)
          .then(() => {
            console.log('Correo de verificación enviado.');
            alert('Por favor, verifica tu correo electrónico antes de continuar.');
            verifyEmailAndUpdateProfile(user);
          })
          .catch((error) => {
            console.error("Error al enviar correo de verificación:", error.message);
            alert('Error al enviar correo de verificación: ' + error.message);
          });
      } else {
        checkAccess(user.uid);
        alert(`Hola, ${user.displayName} (${user.email}). Disfruta de la Página Web. Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.`);
        redirectUser();
      }
    })
    .catch((error) => {
      console.error("Error al iniciar sesión con Google:", error.message);
      alert('Error al iniciar sesión con Google: ' + error.message);
    });
}

function verifyEmailAndUpdateProfile(user) {
  const checkVerificationInterval = setInterval(() => {
    user.reload().then(() => {
      if (user.emailVerified) {
        clearInterval(checkVerificationInterval);
        clearTimeout(deleteAccountTimeout);
        console.log('Correo verificado.');
        const displayName = prompt('Introduce tu nombre:');
        const photoURL = prompt('Introduce la URL de tu foto de perfil (debe ser una URL válida):');
        updateProfile(user, {
          displayName: displayName,
          photoURL: photoURL || 'ruta/a/imagen/por/defecto.png'
        }).then(() => {
          console.log("Perfil del usuario actualizado.");
          alert(`Hola, ${user.displayName} (${user.email}). Disfruta de la Página Web. Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.`);
          redirectUser();
        }).catch((error) => {
          console.error("Error al actualizar el perfil del usuario:", error.message);
          alert('Error al actualizar el perfil del usuario: ' + error.message);
        });
      }
    }).catch(error => {
      console.error('Error al recargar el estado del usuario:', error.message);
    });
  }, 1000);

  const deleteAccountTimeout = setTimeout(() => {
    user.delete().then(() => {
      console.log('Usuario eliminado debido a falta de verificación.');
      alert('Tu cuenta ha sido eliminada debido a la falta de verificación del correo electrónico.');
    }).catch(error => {
      console.error('Error al eliminar el usuario:', error.message);
    });
  }, 1 * 60 * 60 * 1000); // 1 hora
}

function redirectUser() {
  const previousPage = document.referrer;
  try {
    const domain = new URL(previousPage).hostname;
    const allowedHosts = ["grouvex.github.io"];
    if (allowedHosts.includes(domain)) {
      window.history.back();
    } else {
      window.location.href = "https://grouvex.github.io";
    }
  } catch (e) {
    console.error("Error al procesar la URL anterior:", e);
    window.location.href = "https://grouvex.github.io";
  }
}

// Función para verificar acceso (debes definir esta función según tus necesidades)
function checkAccess(uid) {
  console.log("Verificando acceso para UID:", uid);
  // Lógica para verificar el acceso del usuario
}


document.addEventListener('DOMContentLoaded', function() {
if (false){
function mostrarnewsAdv() {
    const newsAdv = document.createElement("div");
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
        width: 99%;
        max-height: 80px;
        overflow-y: auto;
        text-align: center;
        font-size: 12px;
    `;
    newsAdv.innerHTML = `
        <h1 style="color: black"><span class="insignia vvadmin"></span> | Nuevos ToS y PP</h1>
        <div style="margin-top: 10px; display: flex; justify-content: center; gap: 10px;flex-wrap: wrap;flex-direction: column;align-content: center;">
        <p>Para mejorar la seguridad de los usuarios, así como el del equipo, se han modificado los Términos de Servicio (ToS) y la Política de Privacidad (PP)</p>
        <p><a href="https://grouvex.github.io/tos" style="color: white; text-decoration: underline;">ToS</a> | <a href="https://grouvex.github.io/pp" style="color: white; text-decoration: underline;">PP</a></p>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; color: red; cursor: pointer;">Cerrar</button>
        </div>
     `;
    document.body.appendChild(newsAdv);
}
  mostrarnewsAdv();
}
    // Función para verificar acceso
    function verificarAcceso() {
    onAuthStateChanged(auth, (user) => {
        // Configuración
        const mantenimientoActivo = false;
        const paginaMantenimiento = "mantenimiento";
        const paginaActual = window.location.pathname.split("/").pop();

        // 1. Lógica de mantenimiento
        if (mantenimientoActivo) {
            if (paginaActual !== paginaMantenimiento && !(user && uidsTeam.includes(user.uid))) {
                alert(`🚧 La Página está en mantenimiento, se te refirigirá a ${paginaMantenimiento}.`);
              setTimeout(() => {window.location.href = `https://grouvex.github.io/${paginaMantenimiento}`;}, 3000);
                return;
            }
        } else if (paginaActual === paginaMantenimiento) {
            window.location.href = "https://grouvex.github.io";
            return;
        }

        // 2. Definición de permisos y nombres de equipos
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

        // 3. Verificación SOLO para páginas con permisos
        if (permisos[paginaActual]) {
            if (!user) {
                alert(`🔒 Necesitas estar registrado y ser ${nombresEquipos[paginaActual]}`);
                mostrarNotificacion(`🔒 Necesitas estar registrado y ser ${nombresEquipos[paginaActual]}`);
                setTimeout(() => window.history.back(), 5000);
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
        }
        // 4. Páginas públicas (cualquier otra no listada en permisos)
        else {
            if (!user) {
                mostrarNotificacionRegistro();
            }
        }
    });
}

// Función para notificaciones personalizadas
function mostrarNotificacion(mensaje) {
    const notificacion = document.createElement("div");
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
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 8000);
}

// Notificación de registro no intrusiva
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

// Listas de acceso
const uidsOwner = ["qY57xpuDyFdSOBxSNiehbRbJ1p32"]
const uidsTeamAdmins = ["cQRgzlky1eNHjUh61GMPTTRnIZq2", "aO5Y2hQVl9Zn7KlElpgI7jqsFfc2"]
const uidsTeamMods = [""]
const uidsTeamBugs = [""]
const uidsTeam = [...uidsOwner, ...uidsTeamAdmins, ...uidsTeamMods, ...uidsTeamBugs];
const uidsArtistas = [...uidsOwner, ...uidsTeamAdmins, "bY7fMyURlggvZyXDL9dCjwZEmU62"];
const uidsPremium = [...uidsOwner, ...uidsTeamAdmins];
const uidsPartner = [...uidsOwner, ...uidsTeamAdmins];
const uidsVPartner = [...uidsOwner, ...uidsTeamAdmins];

// Iniciar verificación
verificarAcceso();

// Cerrar sesión de usuario
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

// Restablecer contraseña
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

// Restablecer contraseña adicional
const resetPasswordBtn1 = document.getElementById('resetPasswordBtn1');
if (resetPasswordBtn1) {
    resetPasswordBtn1.addEventListener('click', () => {
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

// Función para reautenticar al usuario
function reauthenticateUser(user, password) {
    const credential = EmailAuthProvider.credential(user.email, password);
    return reauthenticateWithCredential(user, credential);
}

// Función para verificar el correo electrónico del usuario
function verificarCorreoUsuario(user) {
    return sendEmailVerification(user).then(() => {
        alert('Por favor, verifica tu correo electrónico. Tienes 5 minutos para verificarlo.');

        return new Promise((resolve, reject) => {
            // Configurar un temporizador para comprobar la verificación y continuar si se verifica
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
            }, 1000); // Verificar cada segundo

            // Configurar un temporizador para detener la verificación después de 5 minutos
            const deleteAccountTimeout = setTimeout(() => {
                clearInterval(checkVerificationInterval);
                alert('Tiempo de verificación agotado. No se pudo verificar el correo en el tiempo dado.');
                reject(new Error('Tiempo de verificación agotado.'));
            }, 5 * 60 * 1000); // 5 minutos
        });
    }).catch((error) => {
        console.error("Error al enviar correo de verificación:", error.message);
        alert('Error al enviar correo de verificación: ' + error.message);
        throw error;
    });
}

// Función para eliminar la cuenta de usuario
function eliminarCuentaUsuario(user) {
    const password = prompt("Para eliminar tu cuenta, por favor introduce tu contraseña:");
    return reauthenticateUser(user, password).then(() => {
        return deleteUser(user);
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

// Función para eliminar los datos del usuario en Firestore
function eliminarDatosUsuario(userId) {
    const userRef = doc(db, 'users', userId);

    return deleteDoc(userRef).then(() => {
        console.log("Datos del usuario eliminados de Firestore.");
    }).catch((error) => {
        console.error("Error al eliminar los datos del usuario:", error);
        alert('Error al eliminar los datos del usuario: ' + error.message);
        throw error;
    });

    // Añadir aquí eliminación de datos en otras colecciones relacionadas si es necesario
}

// Función combinada para eliminar cuenta y datos del usuario
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

// Asignar la función al botón deleteBtn
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
});
