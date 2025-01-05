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

// Escuchadores de eventos
document.getElementById('ticket-form').addEventListener('submit', submitTicket);
document.getElementById('team-member').addEventListener('change', updateEmailInfo);

// Función para enviar los tickets
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
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    guardarTicketEnServidor(artistName, teamMember, subject, message, fromEmail, timestamp);
}

// Función para guardar tickets en el servidor
function guardarTicketEnServidor(artistName, teamMember, subject, message, fromEmail, timestamp) {
    const newTicketRef = db.collection('tickets').doc();
    newTicketRef.set({
        artistName: artistName,
        teamMember: teamMember,
        subject: subject,
        message: message,
        fromEmail: fromEmail,
        timestamp: timestamp
    })
    .then(() => {
        console.log('Ticket guardado exitosamente.');
        alert('Ticket enviado exitosamente.');
        updateEmailInfo();
        cargarTickets();
    })
    .catch((error) => {
        console.error('Error al guardar el ticket: ', error);
    });
}

// Función para actualizar información del email
function updateEmailInfo() {
    const user = firebase.auth().currentUser;
    if (!user) {
        document.getElementById('email-info').innerText = 'Debes estar registrado para enviar un ticket';
        return;
    }

    const teamMember = document.getElementById('team-member').value;
    const fromEmail = user.email;

    document.getElementById('email-info').innerText = `Este ticket está enviado por ${fromEmail}, para el miembro del equipo ${teamMember}`;
}

// Función para cargar tickets existentes
function cargarTickets() {
    const ticketSection = document.getElementById('ticketComments');
    ticketSection.innerHTML = ''; // Limpiar la sección antes de cargar nuevos tickets
    db.collection('tickets').get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const ticket = doc.data();
            const ticketPara = document.createElement('p');
            ticketPara.innerHTML = `<strong>${new Date(ticket.timestamp.seconds * 1000).toUTCString()} - ${ticket.artistName}:</strong> ${ticket.message} (Equipo: ${ticket.teamMember}, Asunto: ${ticket.subject})`;
            ticketPara.dataset.timestamp = ticket.timestamp.seconds;
            ticketSection.appendChild(ticketPara);
        });
    });
}

// Inicializa Firebase Auth y maneja la autenticación del usuario
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Usuario está autenticado
        console.log('Usuario autenticado:', user.email);
        updateEmailInfo();
        cargarTickets();
    } else {
        // Usuario no está autenticado
        console.log('No hay ningún usuario autenticado');
        document.getElementById('email-info').innerText = 'Debes estar registrado para enviar un ticket';
    }
});
