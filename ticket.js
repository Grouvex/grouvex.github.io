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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('ticket-form').addEventListener('submit', submitTicket);
document.getElementById('team-member').addEventListener('change', updateEmailInfo);

function submitTicket(event) {
    event.preventDefault();

    const user = firebase.auth().currentUser;
    if (!user) {
        window.location.href = 'https://grovuex.github.io/login';
        return;
    }

    const artistName = document.getElementById('artist-name').value;
    const teamMember = document.getElementById('team-member').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const fromEmail = user.email;
    const toEmail = getEmailForTeamMember(teamMember);

    db.collection('tickets').add({
        artistName: artistName,
        teamMember: teamMember,
        subject: subject,
        message: message,
        fromEmail: fromEmail,
        toEmail: toEmail,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert(`Ticket enviado exitosamente. Este ticket está enviado por ${fromEmail}, para ${toEmail}`);
        updateEmailInfo();
    })
    .catch((error) => {
        console.error('Error al enviar el ticket: ', error);
    });
}

function updateEmailInfo() {
    const user = firebase.auth().currentUser;
    if (!user) {
        document.getElementById('email-info').innerText = 'Debes estar registrado para enviar un ticket';
        return;
    }

    const teamMember = document.getElementById('team-member').value;
    const fromEmail = user.email;
    const toEmail = getEmailForTeamMember(teamMember);

    document.getElementById('email-info').innerText = `Este ticket está enviado por ${fromEmail}, para ${toEmail}`;
}

function getEmailForTeamMember(teamMember) {
    switch (teamMember) {
        case 'soporte':
            return 'soporte@grouvex.com';
        case 'moderador':
            return 'moderador@grouvex.com';
        case 'administrador':
            return 'administrador@grouvex.com';
        case 'gestor':
            return 'gestion@grouvex.com';
        default:
            return 'soporte@grouvex.com';
    }
}

// Inicializa Firebase Auth y maneja la autenticación del usuario
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Usuario está autenticado
        console.log('Usuario autenticado:', user.email);
        updateEmailInfo();
    } else {
        // Usuario no está autenticado
        console.log('No hay ningún usuario autenticado');
        document.getElementById('email-info').innerText = 'Debes estar registrado para enviar un ticket';
    }
});
