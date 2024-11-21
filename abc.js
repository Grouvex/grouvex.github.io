// Configuración de Firebase
const firebaseConfig = {
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
const auth = firebase.auth();
const database = firebase.database();

// Registro de usuario (solo en la página principal o donde tengas el formulario de registro)
if (document.getElementById('registerForm')) {
  document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert('Usuario registrado: ' + userCredential.user.email);
      })
      .catch((error) => {
        alert('Error al registrar usuario: ' + error.message);
      });
  });
}

// Inicio de sesión de usuario
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert('Usuario inició sesión: ' + userCredential.user.email);
      })
      .catch((error) => {
        alert('Error al iniciar sesión: ' + error.message);
      });
  });
}

// Cerrar sesión de usuario
if (document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut().then(() => {
      alert('Usuario cerró sesión');
    }).catch((error) => {
      alert('Error al cerrar sesión: ' + error.message);
    });
  });
}

// Manejo del estado de autenticación
auth.onAuthStateChanged((user) => {
  if (user) {
    alert('Usuario autenticado: ' + user.email);
    if (document.getElementById('auth-container')) {
      document.getElementById('auth-container').style.display = 'none';
    }
    if (document.getElementById('content')) {
      document.getElementById('content').style.display = 'block';
    }
    if (document.getElementById('logoutBtn')) {
      document.getElementById('logoutBtn').style.display = 'block';
    }
  } else {
    alert('Usuario no autenticado');
    if (document.getElementById('auth-container')) {
      document.getElementById('auth-container').style.display = 'block';
    }
    if (document.getElementById('content')) {
      document.getElementById('content').style.display = 'none';
    }
    if (document.getElementById('logoutBtn')) {
      document.getElementById('logoutBtn').style.display = 'none';
    }
  }
});
