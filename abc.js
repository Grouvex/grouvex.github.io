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
              enviarVerificacionDeCorreo(user);
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
              enviarVerificacionDeCorreo(user);
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
              enviarVerificacionDeCorreo(user);
            }).catch((error) => {
              console.error("Error al actualizar el perfil:", error.message);
              alert('Error al actualizar el perfil: ' + error.message);
            });
          } else {
            checkAccess(user.uid);
            enviarVerificacionDeCorreo(user);
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
              enviarVerificacionDeCorreo(user);
            }).catch((error) => {
              console.error("Error al actualizar el perfil:", error.message);
              alert('Error al actualizar el perfil: ' + error.message);
            });
          } else {
            checkAccess(user.uid);
            enviarVerificacionDeCorreo(user);
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
        var user = auth.currentUser;
        if (user && !user.emailVerified) {
          enviarVerificacionDeCorreo(user);
        } else {
          alert('No hay ningún usuario autenticado o el correo ya está verificado.');
        }
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
            enviarVerificacionDeCorreo(user);
          }).catch((error) => {
            console.error("Error al actualizar el correo electrónico:", error.message);
            alert('Error al actualizar el correo electrónico: ' + error.message);
          });
        } else {
          alert('No hay ningún usuario autenticado.');
        }
      });
    }

    // Función para habilitar la autenticación de dos factores (MFA) con una app de autenticación
    if (enableMfaBtn) {
      enableMfaBtn.addEventListener('click', () => {
        var user = auth.currentUser;
        if (user) {
          user.multiFactor.getSession().then((multiFactorSession) => {
            var totpAuthProvider = new firebase.auth.TotpAuthProvider();
            totpAuthProvider.generateSecret().then((secret) => {
              console.log("Clave secreta de TOTP generada:", secret.secret);

              // Mostrar QR y clave secreta
              var qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(secret.secret)}`;
              var qrCodeHtml = `<img src="${qrCodeUrl}" alt="QR Code" />`;
              alert(`Escanea este código QR con tu aplicación de autenticación o ingresa este código: ${secret.secret}`);
              
              document.getElementById('qrCodeContainer').innerHTML = qrCodeHtml;
              document.getElementById('totpSecret').textContent = secret.secret;

              var verificationCode = prompt('Introduce el código de verificación generado por tu aplicación de autenticación:');
              var totpAuthCredential = firebase.auth.TotpAuthProvider.credential(secret.secret, verificationCode);
              var multiFactorAssertion = firebase.auth.TotpMultiFactorGenerator.assertion(totpAuthCredential);
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
              console.error("Error al generar la clave secreta de TOTP:", error.message);
              alert('Error al generar la clave secreta de TOTP: ' + error.message);
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
    function enviarVerificacionDeCorreo(user) {
      if (user) {
        user.sendEmailVerification().then(() => {
          alert('Correo de verificación enviado. Por favor, revisa tu bandeja de entrada.');
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

// Verificar si el usuario está autenticado
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("Usuario autenticado:", user.email);
    checkAccess(user.uid);
    if (authContainer && content && logoutBtn) {
      authContainer.style.display = 'none';
      content.style.display = 'block';
    } else {
      console.error("Error: Uno o más elementos del DOM no se encontraron");
    }
  } else {
    console.log("Usuario no autenticado");
    inicializarFormularioDeAutenticacion()
    if (authContainer && content) {
      authContainer.style.display = 'block';
      content.style.display = 'none';
    } else {
      console.error("Error: Uno o más elementos del DOM no se encontraron");
    }
  }
});
