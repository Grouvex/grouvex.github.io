// Configuración de Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

// Registro de usuario
document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log('User registered:', userCredential.user);
    })
    .catch((error) => {
      console.error('Error registering user:', error);
    });
});

// Inicio de sesión de usuario
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log('User logged in:', userCredential.user);
    })
    .catch((error) => {
      console.error('Error logging in user:', error);
    });
});

// Cerrar sesión de usuario
document.getElementById('logoutBtn').addEventListener('click', () => {
  auth.signOut().then(() => {
    console.log('User logged out');
  }).catch((error) => {
    console.error('Error logging out:', error);
  });
});

// Manejo del estado de autenticación
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is logged in:', user);
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    document.getElementById('logoutBtn').style.display = 'block';
  } else {
    console.log('User is logged out');
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('content').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'none';
  }
});
