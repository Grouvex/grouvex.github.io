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
const verifyEmailBtn = document.getElementById('verifyEmailBtn');
const changeEmailBtn = document.getElementById('changeEmailBtn');
const enableMfaBtn = document.getElementById('enableMfaBtn');

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
      const displayNameInput = document.getElementById('authDisplayName');
      if (isLogin) {
        formTitle.textContent = 'Inicio de Sesión';
        authButton.textContent = 'Iniciar Sesión';
        emailLoginBtn.textContent = 'Iniciar Sesión con Email';
        googleLoginBtn.textContent = 'Iniciar Sesión con Google';
        toggleButton.textContent = '¿No tienes cuenta? Regístrate';
        if (displayNameInput) displayNameInput.style.display = 'none';
      } else {
        formTitle.textContent = 'Registro';
        authButton.textContent = 'Registrar';
        toggleButton.textContent = '¿Ya tienes cuenta? Inicia Sesión';
        if (displayNameInput) displayNameInput.style.display = 'block';
      }
      console.log("Modo cambiado a", isLogin ? "Inicio de Sesión" : "Registro");
    });

    // Manejo del formulario de autenticación
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('authEmail').value;
      const password = document.getElementById('authPassword').value;
      const displayName = document.getElementById('authDisplayName').value;
      console.log("Formulario enviado, email:", email);

      if (isLogin) {
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            var user = userCredential.user;
            console.log("Usuario inició sesión:", user.displayName);
            if (!user.emailVerified) {
              alert('Por favor verifica tu correo electrónico.');
            } else {
              alert('Usuario inició sesión: ' + user.displayName);
              window.history.back();
            }
          })
          .catch((error) => {
            console.error("Error al iniciar sesión:", error.message);
            alert('Error al iniciar sesión: ' + error.message);
          });
      } else {
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            var user = userCredential.user;
            user.updateProfile({
              displayName: displayName
            }).then(() => {
              console.log("Usuario registrado:", user.displayName);
              alert('Usuario registrado: ' + user.displayName);
              enviarVerificacionDeCorreo();
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

    // Función para verificar correo electrónico
    if (verifyEmailBtn) {
      verifyEmailBtn.addEventListener('click', () => {
        enviarVerificacionDeCorreo();
      });
    }

    // Función para cambiar dirección de correo electrónico
    if (changeEmailBtn) {
      changeEmailBtn.addEventListener('click', () => {
        var newEmail = prompt('Introduce tu nuevo correo electrónico:');
        var user = auth.currentUser;
        if (user) {
          user.updateEmail(newEmail).then(() => {
            alert('Correo electrónico actualizado con éxito.');
            enviarVerificacionDeCorreo();
          }).catch((error) => {
            console.error("Error al actualizar el correo electrónico:", error.message);
            alert('Error al actualizar el correo electrónico: ' + error.message);
          });
        } else {
          alert('No hay ningún usuario autenticado.');
        }
      });
    }

    // Función para habilitar la autenticación de dos factores (MFA)
    if (enableMfaBtn) {
      enableMfaBtn.addEventListener('click', () => {
        var user = auth.currentUser;
        if (user) {
          user.multiFactor.getSession().then((multiFactorSession) => {
            var phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
            var phoneNumber = prompt('Introduce tu número de teléfono:');
            phoneAuthProvider.verifyPhoneNumber(phoneNumber, multiFactorSession)
              .then((verificationId) => {
                var verificationCode = prompt('Introduce el código de verificación enviado a tu teléfono:');
                var phoneAuthCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode);
                var multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(phoneAuthCredential);
                user.multiFactor.enroll(multiFactorAssertion)
                  .then(() => {
                                        alert('Autenticación de dos factores habilitada exitosamente.');
                  })
                  .catch((error) => {
                    console.error("Error al habilitar la autenticación de dos factores:", error.message);
                    alert('Error al habilitar la autenticación de dos factores: ' + error.message);
                  });
              })
              .catch((error) => {
                console.error("Error al verificar el número de teléfono:", error.message);
                alert('Error al verificar el número de teléfono: ' + error.message);
              });
          }).catch((error) => {
            console.error("Error al obtener la sesión de múltiples factores:", error.message);
            alert('Error al obtener la sesión de múltiples factores: ' + error.message);
          });
        } else {
          alert('No hay ningún usuario autenticado.');
        }
      });
    }

    // Función para enviar la verificación de correo electrónico
    function enviarVerificacionDeCorreo() {
      var user = auth.currentUser;
      if (user) {
        user.sendEmailVerification().then(() => {
          alert('Correo de verificación enviado.');
        }).catch((error) => {
          console.error("Error al enviar correo de verificación:", error.message);
          alert('Error al enviar correo de verificación: ' + error.message);
        });
      } else {
        alert('No hay ningún usuario autenticado.');
      }
    }

    console.log("Formulario de autenticación inicializado.");
  } else {
    console.error("No se encontraron todos los elementos del DOM necesarios.");
  }
}

// Inicializar el formulario de autenticación al cargar la página
window.onload = function() {
  inicializarFormularioDeAutenticacion();
};
