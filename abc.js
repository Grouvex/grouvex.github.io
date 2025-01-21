// Configuración de Firebase
var firebaseConfig = {
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
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var database = firebase.database();

console.log("Firebase inicializado correctamente");
// Verificar si el usuario está autenticado
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Usuario autenticado:", user.email);
    checkAccess(user.uid);

    const authContainer = document.getElementById('auth-container');
    const content = document.getElementById('content');
    const correoElectronico = document.getElementById('correoElectronico');
    const usuario = document.getElementById('usuario');
    const userID = document.getElementById('userID');
    const fotoPerfil = document.getElementById('fotoPerfil'); // Añadido para la foto de perfil

    if (authContainer && content) {
      authContainer.style.display = 'none';
      content.style.display = 'block';
      correoElectronico.textContent = user.email || 'Correo no definido';
      usuario.textContent = user.displayName || 'Usuario no definido';
      userID.textContent = 'GS-' + user.uid;
      mostrarUsuarioYInsignias(user.displayName, document.querySelectorAll('.insignias'));
      fotoPerfil.src = user.photoURL || 'ruta/a/imagen/por/defecto.png'; // Asignar la foto de perfil
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
let isLogin = true; // Estado inicial del formulario
toggleButton.disabled = false;
if (authForm && formTitle && authButton && emailLoginBtn && googleLoginBtn && toggleButton) {
  console.log("Todos los elementos del DOM fueron encontrados");
} else {
  console.error("Error: No se encontraron todos los elementos del DOM");
}

// Toggle entre inicio de sesión y registro
  if (toggleButton) {
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
        authButton.textContent = 'Registrar';
        authButton.innerHTML = '<img src="https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/verified.png" alt="" width="15" height="15"> Registrar';
        toggleButton.textContent = '¿Ya tienes cuenta? Inicia Sesión';
        emailLoginBtn.innerHTML = '<img src="https://static.vecteezy.com/system/resources/previews/022/484/508/non_2x/google-mail-gmail-icon-logo-symbol-free-png.png" alt="" width="15" height="15"> Registrarse con Email';
        googleLoginBtn.innerHTML = '<img src="https://img.icons8.com/?size=512&id=17949&format=png" alt="" width="15" height="15"> Registrarse con Google';
      }
      console.log("Modo cambiado a", isLogin ? "Inicio de Sesión" : "Registro");
    });
  }

// Manejo del formulario de autenticación
if (authForm) {
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    checkAccess(user.uid);
    if (isLogin) {
      auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
          console.log("Usuario inició sesión:", user.email);
          alert("Hola, " + user.displayName + "(" + user.email + ")" + ". Disfruta de la Página Web. " + "Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. " + "Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.");
          window.history.back();
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error.message);
          alert('Error al iniciar sesión: ' + error.message);
        });
    } else {
      auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          console.log("Usuario registrado:", user.email);
          alert("Hola, " + user.displayName + "(" + user.email + ")" + ". Disfruta de la Página Web. " + "Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. " + "Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.");
          window.history.back();
        })
        .catch((error) => {
          console.error("Error al registrar usuario:", error.message);
          alert('Error al registrar usuario: ' + error.message);
        });
    }
  });
}

// Función para iniciar sesión con Google
if (googleLoginBtn) {
  googleLoginBtn.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
      .then((result) => {
        var user = result.user;
        console.log("Usuario inició sesión con Google:", user.email);
        checkAccess(user.uid);
        if (isLogin) {
          alert("Hola, " + user.displayName + "(" + user.email + ")" + ". Disfruta de la Página Web. " + "Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. " + "Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.");
        } else {
          console.log("Usuario registrado a través de Google:", user.email);
          alert("Hola, " + user.displayName + "(" + user.email + ")" + ". Disfruta de la Página Web. " + "Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. " + "Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.");
        }
        window.history.back();
      })
      .catch((error) => {
        console.error("Error al iniciar sesión con Google:", error.message);
        alert('Error al iniciar sesión con Google: ' + error.message);
      });
  });
}

// Función para iniciar sesión con Email/Password
if (emailLoginBtn) {
  emailLoginBtn.addEventListener('click', function() {
    var email = prompt("Introduce tu email:");
    var password = prompt("Introduce tu contraseña:");
    console.log("Intentando iniciar sesión con email:", email);
    if (isLogin) {
      auth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          var user = result.user;
          console.log("Usuario inició sesión:", user.email);
          checkAccess(user.uid);
          alert("Hola, " + user.displayName + "(" + user.email + ")" + ". Disfruta de la Página Web. " + "Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. " + "Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.");
          window.history.back();
        })
        .catch((error) => {
          console.error("Error al iniciar sesión con Email/Password:", error.message);
          alert('Error al iniciar sesión con Email/Password: ' + error.message);
        });
    } else {
      auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          console.log("Usuario registrado:", user.email);
          alert("Hola, " + user.displayName + "(" + user.email + ")" + ". Disfruta de la Página Web. " + "Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. " + "Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.");
          window.history.back();
        })
        .catch((error) => {
          console.error("Error al registrar usuario:", error.message);
          alert('Error al registrar usuario: ' + error.message);
        });
    }
  });
}
}
// Cerrar sesión de usuario
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
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
      auth.sendPasswordResetEmail(email)
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
// Restablecer contraseña
const resetPasswordBtn1 = document.getElementById('resetPasswordBtn1');
if (resetPasswordBtn1) {
  resetPasswordBtn1.addEventListener('click', () => {
    const email = prompt('Introduce tu correo electrónico para restablecer la contraseña:');
    if (email) {
      console.log("Enviando correo de restablecimiento a:", email);
      auth.sendPasswordResetEmail(email)
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

// Función para verificar acceso (debes definir esta función según tus necesidades)
function checkAccess(uid) {
  console.log("Verificando acceso para UID:", uid);
  // Lógica para verificar el acceso del usuario
}

// Función para verificar acceso
function verificarAcceso(uidsPermitidos, pagina) {
    auth.onAuthStateChanged(user => {
        if (user) {
            const uid = user.uid;
            if (uidsPermitidos.includes(uid)) {
                // El usuario tiene acceso
                console.log("Acceso permitido a la página:", pagina);
            } else {
                // El usuario no tiene acceso
                alert("No tienes acceso a esta página. Te enviaré a la página de inicio.");
                window.location.href = "https://grouvex.github.io";
            }
        } else {
            // Usuario no autenticado, redirigir a la página de inicio de sesión
            alert("No estas registrado. Se te redirigirá a la página de registro.");
            window.location.href = "https://grouvex.github.io/login"; 
        }
    });
}

// UIDs permitidos para cada clase
const uidsArtistas = ["aO5Y2hQVl9Zn7KlElpgI7jqsFfc2", "qY57xpuDyFdSOBxSNiehbRbJ1p32", "7Ta4FHPusqUFaMp2gZkA0d5wUaE2", "bY7fMyURlggvZyXDL9dCjwZEmU62"];
const uidsTeam = ["aO5Y2hQVl9Zn7KlElpgI7jqsFfc2", "qY57xpuDyFdSOBxSNiehbRbJ1p32", "7Ta4FHPusqUFaMp2gZkA0d5wUaE2"];
const uidsPremium = ["qY57xpuDyFdSOBxSNiehbRbJ1p32"];
const uidsPartner = ["qY57xpuDyFdSOBxSNiehbRbJ1p32"];
const uidsVPartner = ["qY57xpuDyFdSOBxSNiehbRbJ1p32"];

// Lógica para determinar la página actual y verificar acceso
const paginaActual = window.location.pathname.split("/").pop();
if (paginaActual === "grouvex-studios-recording" || paginaActual === "grouvex-studios-animation") {
    verificarAcceso(uidsArtistas, paginaActual);
} else if (paginaActual === "team") {
    verificarAcceso(uidsTeam, paginaActual);
} else {

}
