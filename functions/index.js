const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
admin.initializeApp();

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'TU_CORREO@gmail.com',
        pass: 'TU_CONTRASEÑA'
    }
});

exports.sendEmailNotification = functions.firestore.document('tickets/{ticketId}')
    .onCreate((snap, context) => {
        const ticket = snap.data();
        const mailOptions = {
            from: ticket.fromEmail,
            to: ticket.toEmail,
            subject: ticket.subject,
            text: `Nombre del Artista: ${ticket.artistName}\nMiembro del Equipo: ${ticket.teamMember}\nAsunto: ${ticket.subject}\nMensaje: ${ticket.message}\n\nEste ticket está enviado por ${ticket.fromEmail}, para ${ticket.toEmail}`
        };

        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo: ', error);
            } else {
                console.log('Correo enviado exitosamente: ', info.response);
            }
        });
    });
