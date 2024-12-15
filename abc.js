// Configuración de Firebase
var firebaseConfig = {
  apiKey: "AIzaSyAgoQ_Px3hHVrevUsyct_FBeXWMDKXpPSw",
      authDomain: "grouvex-studios.firebaseapp.com",
      databaseURL: "https://grouvex-studios-default-rtdb.firebaseio.com", // Asegúrate de incluir la URL de tu base de datos
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

const authForm = document.getElementById('authForm');
const formTitle = document.getElementById('formTitle');
const authButton = document.getElementById('authButton');
const toggleButton = document.getElementById('toggleButton');
let isLogin = true; // Estado inicial de la forma

// Toggle entre inicio de sesión y registro
toggleButton.addEventListener('click', () => {
  isLogin = !isLogin;
  if (isLogin) {
    formTitle.textContent = 'Inicio de Sesión';
    authButton.textContent = 'Iniciar Sesión';
    toggleButton.textContent = '¿No tienes cuenta? Regístrate';
  } else {
    formTitle.textContent = 'Registro';
    authButton.textContent = 'Registrar';
    toggleButton.textContent = '¿Ya tienes cuenta? Inicia Sesión';
  }
});

// Manejo del formulario de autenticación
authForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;

  if (isLogin) {
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert('Usuario inició sesión: ' + userCredential.user.email);
        window.history.back();
      })
      .catch((error) => {
        alert('Error al iniciar sesión: ' + error.message);
      });
  } else {
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert('Usuario registrado: ' + userCredential.user.email);
        location.reload();
      })
      .catch((error) => {
        alert('Error al registrar usuario: ' + error.message);
      });
  }
});

// Función para iniciar sesión con Google
document.getElementById('google-login-btn').addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            var user = result.user;
            checkAccess(user.uid);
        })
        .catch((error) => {
            console.error("Error al iniciar sesión con Google:", error);
        });
});

  // Función para iniciar sesión con Email/Password
  document.getElementById('email-login-btn').addEventListener('click', function() {
      var email = prompt("Introduce tu email:");
      var password = prompt("Introduce tu contraseña:");
      auth.signInWithEmailAndPassword(email, password)
          .then((result) => {
              var user = result.user;
              checkAccess(user.uid);
          })
          .catch((error) => {
              console.error("Error al iniciar sesión con Email/Password:", error);
          });
  });

// Cerrar sesión de usuario
document.getElementById('logoutBtn').addEventListener('click', () => {
  auth.signOut().then(() => {
    alert('Usuario cerró sesión');
    location.reload();
  }).catch((error) => {
    alert('Error al cerrar sesión: ' + error.message);
  });
});

// Restablecer contraseña
document.getElementById('resetPasswordBtn').addEventListener('click', () => {
  const email = prompt('Introduce tu correo electrónico para restablecer la contraseña:');
  if (email) {
    auth.sendPasswordResetEmail(email)
      .then(() => {
        alert('Correo para restablecer la contraseña enviado.');
      })
      .catch((error) => {
        alert('Error al enviar el correo de restablecimiento: ' + error.message);
      });
  }
});
// Verificar si el usuario está autenticado
auth.onAuthStateChanged((user) => {
    if (user) {
        checkAccess(user.uid);
        alert('Usuario autenticado: ' + user.email);
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'block';
    } else {
        alert('Usuario no autenticado');
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('content').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
    }
});
