document.addEventListener('DOMContentLoaded', function() {
    // Creación de estilos CSS
    var style = document.createElement('style');
    style.textContent = `
        body {
            background-color: #f8f8f8;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
        }
        h1 {
            font-size: 6em;
            color: #ff6f61;
        }
        p {
            font-size: 1.5em;
            color: #333;
        }
        a {
            color: #ff6f61;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
    `;
    document.head.appendChild(style);

    // Función para crear páginas de error
    function createErrorPage(title, message) {
        var container = document.createElement('div');
        container.className = 'container';

        var heading = document.createElement('h1');
        heading.textContent = title;

        var msg = document.createElement('p');
        msg.textContent = message;

        var homeLink = document.createElement('a');
        homeLink.href = '/';
        homeLink.textContent = 'Volver a la página principal';

        container.appendChild(heading);
        container.appendChild(msg);
        container.appendChild(homeLink);

        document.body.appendChild(container);
    }

    // Detectar el tipo de error
    var errorCode = document.querySelector('meta[name="error-code"]').getAttribute('content');

    switch(errorCode) {
        case '403':
            createErrorPage('403', 'Prohibido: No tienes permiso para acceder a esta página.');
            break;
        case '404':
            createErrorPage('404', 'Oops! La página que buscas no se ha encontrado.');
            break;
        case '500':
            createErrorPage('500', 'Error Interno del Servidor: Algo salió mal en el servidor.');
            break;
        case '502':
            createErrorPage('502', 'Bad Gateway: El servidor recibió una respuesta inválida.');
            break;
        default:
            createErrorPage('Error', 'Ha ocurrido un error inesperado.');
            break;
    }
});
