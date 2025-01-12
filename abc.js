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
    const logoutBtn = document.getElementById('logoutBtn');
    const correoElectronico = document.getElementById('correoElectronico');
    const usuario = document.getElementById('usuario');
    
    if (authContainer && content) {
      authContainer.style.display = 'none';
      content.style.display = 'block';
      correoElectronico.textContent = user.email || 'Correo no definido';
      usuario.textContent = user.displayName || 'Usuario no definido';
    } else {
      console.error("Error: Uno o más elementos del DOM no se encontraron");
    }
  } else {
    console.log("Usuario no autenticado");
    const authContainer = document.getElementById('auth-container');
    const content = document.getElementById('content');
    inicializarFormularioDeAutenticacion()
    if (authContainer && content) {
      authContainer.style.display = 'block';
      content.style.display = 'none';
    } else {
      console.error("Error: Uno o más elementos del DOM no se encontraron");
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
toggleButton.disabled = 'true';
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
      authButton.textContent = 'Iniciar Sesión';
      emailLoginBtn.textContent = 'Iniciar Sesión con Email';
      googleLoginBtn.textContent = 'Iniciar Sesión con Google';
      toggleButton.textContent = '¿No tienes cuenta? Regístrate';
    } else {
      formTitle.textContent = 'Registro';
      authButton.textContent = 'Registrar';
      toggleButton.textContent = '¿Ya tienes cuenta? Inicia Sesión';
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
    console.log("Formulario enviado, email:", email);

    if (isLogin) {
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("Usuario inició sesión:", userCredential.user.email);
          alert("Hola, " + userCredential.displayName + "(" + userCredential.user.email + ")" + ". Disfruta de la Página Web. " + "Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. " + "Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.");
          window.history.back();
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error.message);
          alert('Error al iniciar sesión: ' + error.message);
        });
    } else {
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("Usuario registrado:", userCredential.user.email);
          alert("Hola, " + userCredential.displayName + "(" + userCredential.user.email + ")" + ". Disfruta de la Página Web. " + "Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. " + "Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.");
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
        alert("Hola, " + userCredential.displayName + "(" + userCredential.user.email + ")" + ". Disfruta de la Página Web. " + "Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. " + "Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.");
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

    auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        var user = result.user;
        console.log("Usuario inició sesión:", user.email);
        checkAccess(user.uid);
        alert("Hola, " + userCredential.displayName + "(" + userCredential.user.email + ")" + ". Disfruta de la Página Web. " + "Si eres un miembro del equipo, puedes comentar en news aquí: https://grouvex.com/comentarios. " + "Como usuario, puedes acceder a https://grouvex.com/grouvex-studios-recording.");
        window.history.back();
      })
      .catch((error) => {
        console.error("Error al iniciar sesión con Email/Password:", error.message);
        alert('Error al iniciar sesión con Email/Password: ' + error.message);
      });
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
    // Verificar estado de usuario
    const checkVerificationBtn = document.getElementById('checkVerificationBtn');
    if (checkVerificationBtn) {
      checkVerificationBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
          if (user.emailVerified) {
             console.log('El correo electrónico del usuario está verificado.');
            alert('El correo electrónico del usuario está verificado.');
        const authContainer = document.getElementById('auth-container');
        const content = document.getElementById('content');
        inicializarFormularioDeAutenticacion()
        if (authContainer && content) {
          authContainer.style.display = 'none';
          content.style.display = 'block';
        } else {
          console.error("Error: Uno o más elementos del DOM no se encontraron");
        }
          } else {
             console.log('El correo electrónico del usuario no está verificado.');
            alert('El correo electrónico del usuario no está verificado.');
                    const authContainer = document.getElementById('auth-container');
        const content = document.getElementById('content');
        inicializarFormularioDeAutenticacion()
        if (authContainer && content) {
          authContainer.style.display = 'block';
          content.style.display = 'none';
        } else {
          console.error("Error: Uno o más elementos del DOM no se encontraron");
        }
          }
        } else {
           console.log('No hay ningún usuario autenticado.');
          alert('No hay ningún usuario autenticado.');
                  const authContainer = document.getElementById('auth-container');
        const content = document.getElementById('content');
        inicializarFormularioDeAutenticacion()
        if (authContainer && content) {
          authContainer.style.display = 'block';
          content.style.display = 'none';
        } else {
          console.error("Error: Uno o más elementos del DOM no se encontraron");
        }
        }
      });
    }

// Función para verificar acceso (debes definir esta función según tus necesidades)
function checkAccess(uid) {
  console.log("Verificando acceso para UID:");
  // Lógica para verificar el acceso del usuario
}

