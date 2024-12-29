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

// Obtener referencias a los elementos del DOM
const authContainer = document.getElementById('auth-container');
const content = document.getElementById('content');
const logoutBtn = document.getElementById('logoutBtn');
const resetPasswordBtn = document.getElementById('resetPasswordBtn');

// Función para inicializar el formulario de autenticación
function inicializarFormularioDeAutenticacion() {
  const authForm = document.getElementById('authForm');
  const formTitle = document.getElementById('formTitle');
  const authButton = document.getElementById('authButton');
  const emailLoginBtn = document.getElementById('email-login-btn');
  const googleLoginBtn = document.getElementById('google-login-btn');
  const toggleButton = document.getElementById('toggleButton');
  let isLogin = true; // Estado inicial del formulario

  if (authForm && formTitle && authButton && emailLoginBtn && googleLoginBtn && toggleButton) {
    console.log("Todos los elementos del DOM fueron encontrados");

    // Deshabilitar el botón en lugar de ocultarlo
    toggleButton.disabled = true;

    // Toggle entre inicio de sesión y registro
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

    // Manejo del formulario de autenticación
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('authEmail').value;
      const password = document.getElementById('authPassword').value;
      console.log("Formulario enviado, email:", email);

      if (isLogin) {
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            var user = userCredential.user;
            console.log("Usuario inició sesión:", user.displayName);
            alert('Usuario inició sesión: ' + user.displayName);
            window.history.back();
          })
          .catch((error) => {
            console.error("Error al iniciar sesión:", error.message);
            alert('Error al iniciar sesión: ' + error.message);
          });
      } else {
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            var user = userCredential.user;
            var displayName = prompt("Introduce tu nombre de usuario:");
            user.updateProfile({
              displayName: displayName
            }).then(() => {
              console.log("Usuario registrado:", user.displayName);
              alert('Usuario registrado: ' + user.displayName);
              window.history.back();
            }).catch((error) => {
              console.error("Error al actualizar el perfil:", error.message);
              alert('Error al actualizar el perfil: ' + error.message);
            });
          })
          .catch((error) => {
            console.error("Error al registrar usuario:", error.message);
            alert('Error al registrar usuario: ' + error.message);
          });
      }
    });

    // Función para iniciar sesión con Google
    googleLoginBtn.addEventListener('click', function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
        .then((result) => {
          var user = result.user;
          console.log("Usuario inició sesión con Google:", user.displayName);

          // Verificar y actualizar displayName si no está definido
          if (!user.displayName) {
            var displayName = prompt("Introduce tu nombre de usuario:");
            user.updateProfile({
              displayName: displayName
            }).then(() => {
              checkAccess(user.uid);
              alert('Usuario inició sesión: ' + user.displayName);
              window.history.back();
            }).catch((error) => {
              console.error("Error al actualizar el perfil:", error.message);
              alert('Error al actualizar el perfil: ' + error.message);
            });
          } else {
            checkAccess(user.uid);
            alert('Usuario inició sesión: ' + user.displayName);
            window.history.back();
          }
        })
        .catch((error) => {
          console.error("Error al iniciar sesión con Google:", error.message);
          alert('Error al iniciar sesión con Google: ' + error.message);
        });
    });

    // Función para iniciar sesión con Email/Password
    emailLoginBtn.addEventListener('click', function() {
      var email = prompt("Introduce tu email:");
      var password = prompt("Introduce tu contraseña:");
      console.log("Intentando iniciar sesión con email:", email);

      auth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          var user = result.user;
          console.log("Usuario inició sesión");

          // Verificar y actualizar displayName si no está definido
          if (!user.displayName) {
            var displayName = prompt("Introduce tu nombre de usuario:");
            user.updateProfile({
              displayName: displayName
            }).then(() => {
              checkAccess(user.uid);
              alert('Usuario inició sesión: ' + user.displayName);
              window.history.back();
            }).catch((error) => {
              console.error("Error al actualizar el perfil:", error.message);
              alert('Error al actualizar el perfil: ' + error.message);
            });
          } else {
            checkAccess(user.uid);
            alert('Usuario inició sesión: ' + user.displayName);
            window.history.back();
          }
        })
        .catch((error) => {
          console.error("Error al iniciar sesión con Email/Password:", error.message);
          alert('Error al iniciar sesión con Email/Password: ' + error.message);
        });
    });
  } else {
    console.error("Error: No se encontraron todos los elementos del DOM");
  }
}

// Cerrar sesión de usuario
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
if (resetPasswordBtn) {
  resetPasswordBtn.addEventListener('click', () => {
    const email = prompt('Introduce tu correo electrónico para restablecer la contraseña:');
    if (email) {
      console.log("Enviando correo de restablecimiento");
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

// Función para cambiar la visibilidad de los contenedores
function toggleContainers(isAuthenticated) {
  if (authContainer && content) {
    authContainer.style.display = isAuthenticated ? 'none' : 'block';
    content.style.display = isAuthenticated ? 'block' : 'none';
  } else {
    console.error("Error: Uno o más elementos del DOM no se encontraron");
  }
}

// Verificar si el usuario está autenticado
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Usuario autenticado:", user.email);
    checkAccess(user.uid);
    toggleContainers(true);
  } else {
    console.log("Usuario no autenticado");
    inicializarFormularioDeAutenticacion();
    toggleContainers(false);
  }
});

// Función para verificar acceso (debes definir esta función según tus necesidades)
function checkAccess(uid) {
  console.log("Usuario Verificado");
  // Lógica para verificar el acceso del usuario
}
