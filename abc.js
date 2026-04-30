// Protección anti-inspección (tu código original)
!function(){'use strict';document.addEventListener('keydown',e=>{((e.ctrlKey&&e.shiftKey&&['I','J','C','K'].includes(e.key))||['F12','F8'].includes(e.key)||(e.ctrlKey&&['U','S'].includes(e.key.toUpperCase())))&&(e.preventDefault(),e.stopImmediatePropagation())},!0),document.addEventListener('contextmenu',e=>{e.preventDefault(),e.stopImmediatePropagation()},!0),document.addEventListener('selectstart',e=>e.preventDefault(),!0),setInterval(()=>{(window.outerWidth-window.innerWidth>100||window.outerHeight-window.innerHeight>100)&&console.log('x')},1e3)}();

// ============================================
// CONFIGURACIÓN INICIAL DE FIREBASE
// ============================================

// Usar la versión compat de Firebase (NO módulos ES6)
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

// Inicializar Firebase solo si no está ya inicializado
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else if (typeof firebase === 'undefined') {
    console.error('Firebase no está cargado. Asegúrate de cargar las SDKs primero.');
}

const auth = firebase.auth();
const database = firebase.database();

// ============================================
// CONFIGURACIÓN INSIGNIAS
// ============================================

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQBy3U9WSBBYfo9C-etH3KYe3_b9B_W1i40-XE6vUgatP16slZDnXtokxs25l80VBWjg/exec';
const URL_BASE_INSIGNIAS = 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/';

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

async function completeUserProfile(user, isGoogleUser = false) {
    if (!user) return;
    
    if (isGoogleUser && user.displayName) return;

    const displayName = user.displayName || prompt("¿Cómo quieres que te llamemos?");
    
    try {
        await user.updateProfile({
            displayName: displayName || "Usuario",
            photoURL: user.photoURL || "https://grouvex.com/img/GROUVEX.png"
        });

        await database.ref(`users/${user.uid}`).set({
            email: user.email,
            displayName: displayName || "Usuario",
            photoURL: user.photoURL || "https://grouvex.com/img/GROUVEX.png",
            lastLogin: Date.now(),
            provider: isGoogleUser ? "google" : "email",
            emailVerified: isGoogleUser ? true : user.emailVerified
        });

        if (!isGoogleUser && !user.emailVerified) {
            await user.sendEmailVerification();
            mostrarNotificacion('📧 Se envió un correo de verificación. Por favor revisa tu bandeja.');
        }
    } catch (error) {
        console.error('Error en completeUserProfile:', error);
        mostrarNotificacion(`❌ Error: ${error.message}`, true);
    }
}

function handleEmailAuth(email, password, isLogin) {
    const authFunction = isLogin ? auth.signInWithEmailAndPassword : auth.createUserWithEmailAndPassword;
    
    authFunction(email, password)
        .then(async (userCredential) => {
            if (!isLogin) await completeUserProfile(userCredential.user);
            mostrarNotificacion(`✅ ${isLogin ? 'Inicio de sesión exitoso' : 'Registro completado'}`);
            redirectUser();
        })
        .catch(error => {
            console.error('Error en handleEmailAuth:', error);
            let mensaje = error.message;
            if (error.code === 'auth/user-not-found') mensaje = 'Usuario no encontrado';
            if (error.code === 'auth/wrong-password') mensaje = 'Contraseña incorrecta';
            if (error.code === 'auth/email-already-in-use') mensaje = 'Este correo ya está registrado';
            if (error.code === 'auth/weak-password') mensaje = 'La contraseña debe tener al menos 6 caracteres';
            mostrarNotificacion(`❌ ${mensaje}`, true);
        });
}

async function handleGoogleLogin() {
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        
        const result = await auth.signInWithPopup(provider);
        
        await database.ref(`users/${result.user.uid}`).set({
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL || "https://grouvex.com/img/GROUVEX.png",
            lastLogin: Date.now(),
            provider: "google"
        });
        
        mostrarNotificacion('✅ Inicio de sesión con Google exitoso');
        redirectUser();
    } catch (error) {
        console.error('Error en handleGoogleLogin:', error);
        let mensaje = error.message;
        if (error.code === 'auth/popup-blocked') mensaje = 'El navegador bloqueó la ventana emergente. Permite popups para este sitio.';
        if (error.code === 'auth/popup-closed-by-user') mensaje = 'Ventana de Google cerrada antes de completar.';
        mostrarNotificacion(`❌ ${mensaje}`, true);
    }
}

// ============================================
// FUNCIONES DE INTERFAZ DE USUARIO
// ============================================

function mostrarNotificacion(mensaje, esError = false) {
    const notificacion = document.createElement("div");
    notificacion.className = `notificacion ${esError ? 'error' : 'exito'}`;
    notificacion.innerHTML = `<p>${mensaje}</p><div class="progress-bar"></div>`;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: ${esError ? '#ff4444' : '#4CAF50'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 90%;
        width: 300px;
        text-align: center;
        font-size: 14px;
        font-family: Arial, sans-serif;
    `;
    document.body.appendChild(notificacion);
    setTimeout(() => {
        if (notificacion && notificacion.remove) notificacion.remove();
    }, 8000);
}

// ============================================
// FUNCIONES DE GESTIÓN DE CUENTA
// ============================================

async function handleAccountDeletion() {
    const user = auth.currentUser;
    if (!user) {
        mostrarNotificacion('❌ Debes iniciar sesión para realizar esta acción', true);
        window.location.href = '/login';
        return;
    }

    const confirmation = confirm(`¿Estás SEGURO que quieres eliminar tu cuenta de forma permanente?\n\nEsta acción:\n✅ Eliminará todos tus datos\n✅ Borrará tu historial\n✅ Quitará tus permisos\n🚫 NO podrá deshacerse\n\nEscribe "ELIMINAR" para confirmar.`);

    if (!confirmation) {
        mostrarNotificacion('✅ Cancelaste la eliminación de la cuenta');
        return;
    }

    const userInput = prompt('Escribe "ELIMINAR" para confirmar la eliminación permanente:');
    if (userInput !== 'ELIMINAR') {
        mostrarNotificacion('❌ Confirmación incorrecta. Eliminación cancelada', true);
        return;
    }

    try {
        const password = prompt('Por seguridad, introduce tu contraseña para confirmar:');
        if (!password) {
            mostrarNotificacion('❌ Se requiere contraseña para esta acción', true);
            return;
        }

        const credential = firebase.auth.EmailAuthProvider.credential(user.email, password);
        await user.reauthenticateWithCredential(credential);
        await eliminarDatosUsuario(user.uid);
        await user.delete();
        
        mostrarNotificacion('🔥 Cuenta eliminada permanentemente. ¡Hasta pronto!');
        setTimeout(() => window.location.href = '/', 3000);
    } catch (error) {
        manejarErroresEliminacion(error);
    }
}

function manejarErroresEliminacion(error) {
    console.error('Error en eliminación:', error);
    const mensajesError = {
        'auth/requires-recent-login': 'Debes volver a iniciar sesión para realizar esta acción. Redirigiendo...',
        'auth/wrong-password': 'Contraseña incorrecta. Intenta nuevamente.',
        'auth/network-request-failed': 'Error de red. Verifica tu conexión a internet.',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.'
    };

    const mensaje = mensajesError[error.code] || `Error crítico: ${error.message}`;
    mostrarNotificacion(`❌ ${mensaje}`, true);
    
    if (error.code === 'auth/requires-recent-login') {
        setTimeout(() => window.location.href = '/login', 3000);
    }
}

// ============================================
// FUNCIONES PARA OBTENER DATOS DEL USUARIO DESDE GOOGLE SHEETS
// ============================================

async function obtenerDatosUsuarioPorUserID(userID) {
    try {
        console.log('🔍 Buscando datos para UserID:', userID);
        
        if (!userID || userID.trim() === '') {
            console.log('❌ UserID vacío o inválido');
            return null;
        }
        
        const searchUserID = userID.replace(/^GS-/, '').trim();
        
        const url = `${APPS_SCRIPT_URL}?timestamp=${Date.now()}`;
        console.log('📡 URL de solicitud:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const text = await response.text();
        
        let jsonData;
        try {
            jsonData = JSON.parse(text);
        } catch (e) {
            console.error('❌ Error parseando JSON:', e);
            return null;
        }
        
        if (!jsonData.success) {
            console.error('❌ Error en respuesta:', jsonData.error);
            return null;
        }
        
        const headers = jsonData.headers || [];
        const data = jsonData.data || [];
        
        // Buscar índices de columnas
        let userIDIndex = -1;
        let insigniasIndex = -1;
        let nombreIndex = -1;
        let emailIndex = -1;
        
        headers.forEach((header, index) => {
            const headerStr = header ? header.toString().toLowerCase() : '';
            
            if (userIDIndex === -1 && headerStr.includes('grouvex studios userid')) {
                userIDIndex = index;
            }
            
            if (insigniasIndex === -1 && headerStr === 'insignias') {
                insigniasIndex = index;
            }
            
            if (nombreIndex === -1 && (headerStr.includes('nombre de usuario') || 
                                       headerStr.includes('nombre del cliente') ||
                                       headerStr.includes('nombre y apellidos reales') ||
                                       headerStr.includes('nombre del artista/banda'))) {
                nombreIndex = index;
            }
            
            if (emailIndex === -1 && headerStr.includes('email')) {
                emailIndex = index;
            }
        });
        
        if (nombreIndex === -1) {
            headers.forEach((header, index) => {
                const headerStr = header ? header.toString().toLowerCase() : '';
                if (nombreIndex === -1 && headerStr.includes('nombre')) {
                    nombreIndex = index;
                }
            });
        }
        
        if (userIDIndex === -1) {
            console.error('❌ No se encontró la columna UserID');
            return null;
        }
        
        // Buscar el usuario en todas las filas
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowUserID = row[userIDIndex] ? row[userIDIndex].toString().trim() : '';
            
            if (rowUserID) {
                const normalizedRowUserID = rowUserID.replace(/^GS-/i, '').trim();
                
                if (normalizedRowUserID.toLowerCase() === searchUserID.toLowerCase()) {
                    const insigniasTexto = insigniasIndex !== -1 ? (row[insigniasIndex] ? row[insigniasIndex].toString().trim() : '') : '';
                    const nombre = nombreIndex !== -1 ? (row[nombreIndex] ? row[nombreIndex].toString().trim() : '') : 'Usuario';
                    const email = emailIndex !== -1 ? (row[emailIndex] ? row[emailIndex].toString().trim() : '') : '';
                    
                    return {
                        userID: userID,
                        nombre: nombre || 'Usuario',
                        email: email || 'Sin email',
                        insignias: insigniasTexto
                    };
                }
            }
        }
        
        console.log('❌ Usuario no encontrado en la base de datos');
        return null;
        
    } catch (error) {
        console.error('❌ Error obteniendo datos del usuario:', error);
        return null;
    }
}

// ============================================
// FUNCIONES PARA PROCESAR INSIGNIAS
// ============================================

function procesarInsignias(textoInsignias) {
    if (!textoInsignias || textoInsignias.trim() === '') {
        return [];
    }
    
    const texto = textoInsignias.trim();
    
    if (texto.toLowerCase() === 'ninguna' || 
        texto.toLowerCase() === 'sin insignias' ||
        texto.toLowerCase() === 'n/a' ||
        texto.toLowerCase() === 'no aplica') {
        return [];
    }
    
    const insignias = [];
    const separadores = /[,;]+/;
    const partes = texto.split(separadores);
    
    partes.forEach(parte => {
        const urlLimpia = parte.trim();
        
        if (urlLimpia && urlLimpia.toLowerCase().includes('githubusercontent.com')) {
            const tieneExtension = /\.(png|gif|jpg|jpeg|webp|svg)(\?.*)?$/i.test(urlLimpia);
            
            if (tieneExtension) {
                const nombre = extraerNombreInsignia(urlLimpia);
                
                insignias.push({
                    nombre: nombre,
                    url: urlLimpia,
                    tipo: determinarTipoInsignia(urlLimpia)
                });
            }
        }
    });
    
    return insignias;
}

function extraerNombreInsignia(url) {
    try {
        const urlDecodificada = decodeURIComponent(url);
        const nombreArchivo = urlDecodificada.split('/').pop();
        const nombreSinExtension = nombreArchivo.split('.')[0];
        
        return nombreSinExtension
            .replace(/%20/g, ' ')
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/verified/g, 'Verified ')
            .replace(/owner/g, 'Owner ')
            .replace(/employee/g, 'Employee ')
            .replace(/moderator/g, 'Moderator ')
            .replace(/developer/g, 'Developer ')
            .replace(/bughunter/g, 'Bug Hunter ')
            .replace(/partner/g, 'Partner ')
            .replace(/team/g, 'Team ')
            .replace(/recording/g, 'Recording ')
            .replace(/designs/g, 'Designs ')
            .replace(/animations/g, 'Animations ')
            .replace(/sistema/g, 'Sistema ')
            .replace(/grouvex/g, 'Grouvex ')
            .replace(/gco/g, 'GCO')
            .replace(/^\s+|\s+$/g, '')
            .toUpperCase();
    } catch (e) {
        return 'INSIGNIA';
    }
}

function determinarTipoInsignia(url) {
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('.gif')) return 'animada';
    if (urlLower.includes('.png')) return 'estatica';
    if (urlLower.includes('.jpg') || urlLower.includes('.jpeg')) return 'imagen';
    if (urlLower.includes('.svg')) return 'vectorial';
    
    return 'desconocido';
}

// ============================================
// FUNCIONES PARA OBTENER IMAGEN DE FIREBASE
// ============================================

async function obtenerFotoPerfilFirebase(userID) {
    try {
        if (!userID || userID.trim() === '') {
            return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
        }
        
        const uid = userID.replace(/^GS-/i, '').trim();
        
        if (!uid) {
            return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
        }
        
        const snapshot = await database.ref(`users/${uid}`).once('value');
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            return userData.photoURL || 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
        }
        
        return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
    } catch (error) {
        console.error('❌ Error obteniendo foto de perfil:', error);
        return 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/GROUVEX.png';
    }
}

// ============================================
// FUNCIONES PARA MOSTRAR DATOS E INSIGNIAS
// ============================================

async function mostrarDatosEInsigniasEnElemento(elementoTigsID) {
    try {
        const userID = elementoTigsID.getAttribute('tigsID');
        if (!userID) {
            console.log('❌ Elemento sin tigsID válido');
            return;
        }
        
        console.log(`🎯 Procesando elemento con tigsID: ${userID}`);
        
        elementoTigsID.textContent = 'Cargando...';
        elementoTigsID.style.color = '#888';
        elementoTigsID.style.fontStyle = 'italic';
        
        const contenedorInsignias = elementoTigsID.closest('div')?.querySelector('.insignias-container');
        const tarjeta = elementoTigsID.closest('.tarjeta');
        const imgTIGS = tarjeta ? tarjeta.querySelector('#imgTIGS') : null;
        
        if (imgTIGS) {
            const fotoURL = await obtenerFotoPerfilFirebase(userID);
            imgTIGS.src = fotoURL;
            imgTIGS.alt = `Foto de ${userID}`;
            
            if (!imgTIGS.style.borderRadius) {
                imgTIGS.style.cssText = `
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    margin-right: 15px;
                    flex-shrink: 0;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                `;
            }
        }
        
        const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
        
        if (!datosUsuario) {
            elementoTigsID.textContent = 'Usuario no encontrado';
            elementoTigsID.style.color = '#888';
            if (contenedorInsignias) {
                contenedorInsignias.innerHTML = '<div class="no-insignias-message">🎯 Sin datos</div>';
            }
            return;
        }
        
        elementoTigsID.textContent = datosUsuario.nombre;
        elementoTigsID.style.color = '';
        elementoTigsID.style.fontStyle = '';
        elementoTigsID.title = `ID: ${userID}`;
        
        if (contenedorInsignias) {
            const insignias = procesarInsignias(datosUsuario.insignias);
            contenedorInsignias.innerHTML = '';
            
            if (!insignias || insignias.length === 0) {
                contenedorInsignias.innerHTML = '<div class="no-insignias-message">🎯 Sin insignias</div>';
                return;
            }
            
            insignias.forEach((insignia, index) => {
                const insigniaElement = crearElementoInsignia(insignia, index);
                contenedorInsignias.appendChild(insigniaElement);
            });
            
            if (insignias.length > 1) {
                const contador = document.createElement('div');
                contador.className = 'insignias-count';
                contador.textContent = insignias.length;
                contenedorInsignias.style.position = 'relative';
                contenedorInsignias.appendChild(contador);
            }
        }
        
    } catch (error) {
        console.error('❌ Error procesando elemento tigsID:', error);
        if (elementoTigsID) {
            elementoTigsID.textContent = 'Error';
            elementoTigsID.style.color = '#ff4444';
        }
    }
}

function crearElementoInsignia(insignia, index) {
    const container = document.createElement('div');
    container.className = 'insignia-item';
    container.dataset.tipo = insignia.tipo;
    container.dataset.nombre = insignia.nombre;
    container.style.cssText = `
        display: inline-block;
        margin: 5px;
        position: relative;
        animation: fadeIn 0.5s ease ${index * 0.1}s forwards;
        opacity: 0;
        transform-origin: center;
    `;
    
    const img = document.createElement('img');
    img.src = insignia.url;
    img.alt = insignia.nombre;
    img.title = insignia.nombre;
    img.loading = 'lazy';
    
    let estilosBase = `
        width: 32px;
        height: 32px;
        border-radius: 6px;
        border: 2px solid rgba(255, 255, 255, 0.15);
        transition: all 0.3s ease;
        cursor: pointer;
        object-fit: contain;
        background: rgba(255, 255, 255, 0.05);
    `;
    
    if (insignia.tipo === 'animada') {
        estilosBase += `
            border-color: rgba(255, 215, 0, 0.3);
            box-shadow: 0 0 5px rgba(255, 215, 0, 0.2);
        `;
    } else if (insignia.tipo === 'vectorial') {
        estilosBase += `
            border-color: rgba(0, 150, 255, 0.3);
        `;
    }
    
    img.style.cssText = estilosBase;
    
    img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.2)';
        img.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.4)';
        img.style.borderColor = 'gold';
    });
    
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.boxShadow = insignia.tipo === 'animada' 
            ? '0 0 5px rgba(255, 215, 0, 0.2)' 
            : 'none';
        img.style.borderColor = insignia.tipo === 'animada' 
            ? 'rgba(255, 215, 0, 0.3)' 
            : insignia.tipo === 'vectorial'
            ? 'rgba(0, 150, 255, 0.3)'
            : 'rgba(255, 255, 255, 0.15)';
    });
    
    img.addEventListener('error', () => {
        console.error(`❌ Error cargando insignia: ${insignia.url}`);
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iNiIgZmlsbD0icmdiYSgwLCAwLCAwLCAwLjEpIi8+CjxwYXRoIGQ9Ik0xNiAxMEgyMlYxNkgxNlYxMFpNMTYgMThIMjJWMjRIMTZWMThaIiBmaWxsPSJ3aGl0ZSIgZmlsbC1vcGFjaXR5PSIwLjUiLz4KPHBhdGggZD0iTTEwIDEwSDIyVjIySDEwVjEwWk0xMiAxMlYyMEgyMFYxMkgxMloiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjciIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=';
        img.title = `❌ Error cargando: ${insignia.nombre}`;
    });
    
    container.appendChild(img);
    return container;
}

// ============================================
// FUNCIÓN PRINCIPAL PARA CARGAR DATOS E INSIGNIAS
// ============================================

async function cargarDatosEInsigniasEnTodosLosElementos() {
    console.log('🚀 Iniciando carga de datos e insignias');
    
    const elementosConTigsID = document.querySelectorAll('[tigsID]');
    console.log(`📊 Encontrados ${elementosConTigsID.length} elementos con tigsID`);
    
    for (const elemento of elementosConTigsID) {
        await mostrarDatosEInsigniasEnElemento(elemento);
    }
    
    const userIDElement = document.getElementById('userID');
    if (userIDElement && userIDElement.textContent.trim()) {
        const userID = userIDElement.textContent.trim();
        console.log(`📋 UserID encontrado en texto: ${userID}`);
        
        const contenedorInsignias = userIDElement.closest('div')?.querySelector('.insignias-container');
        const fotoPerfil = document.getElementById('fotoPerfil');
        
        if (fotoPerfil) {
            const fotoURL = await obtenerFotoPerfilFirebase(userID);
            fotoPerfil.src = fotoURL;
            fotoPerfil.alt = 'Foto de perfil';
            
            if (!fotoPerfil.style.borderRadius) {
                fotoPerfil.style.cssText = `
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    margin-right: 15px;
                    flex-shrink: 0;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                `;
            }
        }
        
        if (contenedorInsignias) {
            const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
            
            if (datosUsuario && datosUsuario.insignias) {
                const insignias = procesarInsignias(datosUsuario.insignias);
                contenedorInsignias.innerHTML = '';
                
                if (insignias.length > 0) {
                    insignias.forEach((insignia, index) => {
                        const insigniaElement = crearElementoInsignia(insignia, index);
                        contenedorInsignias.appendChild(insigniaElement);
                    });
                    
                    if (insignias.length > 1) {
                        const contador = document.createElement('div');
                        contador.className = 'insignias-count';
                        contador.textContent = insignias.length;
                        contenedorInsignias.style.position = 'relative';
                        contenedorInsignias.appendChild(contador);
                    }
                } else {
                    contenedorInsignias.innerHTML = '<div class="no-insignias-message">🎯 Sin insignias</div>';
                }
            }
        }
    }
    
    console.log('✅ Carga de datos e insignias completada');
}

// ============================================
// FUNCIONES DE CONTROL DE ACCESO
// ============================================



// ============================================
// SISTEMA DE CONTROL DE ACCESO MEJORADO
// ============================================

// Configuración centralizada de permisos
const SISTEMA_PERMISOS = {
    // Definición de roles y sus insignias asociadas
    roles: {
        'artista': ['artista', 'verified-artist', 'premium-artist'],
        'empleado': ['verified-employee', 'employee', 'staff'],
        'equipo': ['verified-team', 'team-member', 'team'],
        'admin': ['admin', 'administrator', 'owner'],
        'partner': ['partner', 'verified-partner', 'vpartner'],
        'premium': ['premium', 'premium-user', 'vip'],
        'moderador': ['moderator', 'mod', 'verified-moderator'],
        'developer': ['developer', 'dev', 'verified-developer']
    },
    
    // Permisos por página (versión mejorada)
    paginas: {
        "grouvex-studios-recording": {
            rolesPermitidos: ['artista', 'empleado'],
            insigniasPermitidas: ['owner-recording', 'recording-studio'],
            redirigirA: "/",
            mensajePersonalizado: "Solo artistas y empleados pueden acceder a Grouvex Studios Recording"
        },
        "grouvex-studios-animation": {
            rolesPermitidos: ['artista', 'empleado'],
            insigniasPermitidas: ['animation-studio'],
            redirigirA: "/",
            mensajePersonalizado: "Solo artistas y empleados pueden acceder a Grouvex Studios Animation"
        },
        "team": {
            rolesPermitidos: ['equipo', 'admin', 'empleado'],
            insigniasPermitidas: ['verified-team', 'team-leader'],
            redirigirA: "/",
            mensajePersonalizado: "Acceso restringido al equipo de Grouvex Studios"
        },
        "planeta": {
            rolesPermitidos: ['partner'],
            insigniasPermitidas: ['verified-partner', 'vpartner'],
            redirigirA: "/",
            mensajePersonalizado: "Esta página es solo para partners de Grouvex Studios"
        },
        "pacman": {
            rolesPermitidos: ['premium', 'partner', 'equipo'],
            insigniasPermitidas: ['pacman-access', 'vip-access'],
            redirigirA: "/",
            mensajePersonalizado: "Necesitas ser usuario Premium o Partner para jugar"
        },
        "admin-panel": {
            rolesPermitidos: ['admin', 'developer'],
            insigniasPermitidas: ['admin-access', 'dev-access'],
            redirigirA: "/",
            mensajePersonalizado: "Acceso solo para administradores",
            requerirVerificacionEmail: true
        },
        "developer-area": {
            rolesPermitidos: ['developer'],
            insigniasPermitidas: ['dev-access', 'developer-tools'],
            redirigirA: "/",
            mensajePersonalizado: "Área exclusiva para desarrolladores"
        }
    },
    
    // Páginas públicas que no requieren autenticación
    paginasPublicas: ['login', 'register', 'index', '', 'home', 'contacto', 'about', 'tos', 'pp'],
    
    // Páginas que requieren verificación de email
    paginasRequierenVerificacion: ['admin-panel', 'developer-area']
};

// Cache de verificaciones para evitar llamadas repetitivas
const cacheAcceso = new Map();
const CACHE_DURACION = 5 * 60 * 1000; // 5 minutos

/**
 * Verifica si un usuario tiene una insignia específica (mejorada)
 */
function usuarioTieneInsignia(insignias, insigniaBuscada, modo = 'flexible') {
    if (!insignias || insignias.length === 0) return false;
    
    const insigniaBuscadaLower = insigniaBuscada.toLowerCase();
    
    if (modo === 'exacto') {
        return insignias.some(insignia => 
            insignia.nombre.toLowerCase() === insigniaBuscadaLower ||
            insignia.url.toLowerCase().includes(insigniaBuscadaLower)
        );
    }
    
    // Modo flexible (default) - busca coincidencias parciales
    return insignias.some(insignia => {
        const nombreInsignia = insignia.nombre.toLowerCase();
        const urlInsignia = insignia.url.toLowerCase();
        
        return nombreInsignia.includes(insigniaBuscadaLower) || 
               urlInsignia.includes(insigniaBuscadaLower) ||
               (insigniaBuscadaLower.includes('verified') && nombreInsignia.includes('verified')) ||
               (insigniaBuscadaLower.includes('team') && nombreInsignia.includes('team'));
    });
}

/**
 * Obtiene los roles de un usuario basado en sus insignias
 */
function obtenerRolesUsuario(insignias) {
    const rolesEncontrados = [];
    
    for (const [rol, insigniasRequeridas] of Object.entries(SISTEMA_PERMISOS.roles)) {
        for (const insigniaRequerida of insigniasRequeridas) {
            if (usuarioTieneInsignia(insignias, insigniaRequerida, 'flexible')) {
                rolesEncontrados.push(rol);
                break;
            }
        }
    }
    
    return [...new Set(rolesEncontrados)]; // Eliminar duplicados
}

/**
 * Verifica si el usuario tiene acceso a una página específica
 */
async function verificarAccesoPagina(paginaActual, user, insigniasUsuario, rolesUsuario) {
    const configPagina = SISTEMA_PERMISOS.paginas[paginaActual];
    if (!configPagina) return { tieneAcceso: true }; // Página sin restricciones
    
    // Verificar por roles
    let tieneAccesoPorRol = false;
    if (configPagina.rolesPermitidos) {
        tieneAccesoPorRol = configPagina.rolesPermitidos.some(rol => 
            rolesUsuario.includes(rol)
        );
    }
    
    // Verificar por insignias específicas
    let tieneAccesoPorInsignia = false;
    if (configPagina.insigniasPermitidas) {
        tieneAccesoPorInsignia = configPagina.insigniasPermitidas.some(insignia => 
            usuarioTieneInsignia(insigniasUsuario, insignia)
        );
    }
    
    const tieneAcceso = tieneAccesoPorRol || tieneAccesoPorInsignia;
    
    // Verificar requisito de email verificado
    if (tieneAcceso && configPagina.requerirVerificacionEmail && user) {
        if (!user.emailVerified) {
            return {
                tieneAcceso: false,
                mensaje: "📧 Debes verificar tu correo electrónico antes de acceder. Revisa tu bandeja de entrada.",
                requiereVerificacion: true
            };
        }
    }
    
    return {
        tieneAcceso,
        mensaje: configPagina.mensajePersonalizado,
        redirigirA: configPagina.redirigirA || "/"
    };
}

/**
 * Función principal mejorada de verificación de acceso
 */
async function verificarAcceso() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, async (user) => {
            const paginaActual = window.location.pathname.split("/").pop() || 'index';
            const paginaSinExtension = paginaActual.replace('.html', '');
            
            // Verificar si es página pública
            const esPaginaPublica = SISTEMA_PERMISOS.paginasPublicas.includes(paginaSinExtension) ||
                                    SISTEMA_PERMISOS.paginasPublicas.includes(paginaActual);
            
            // Usuario NO autenticado
            if (!user) {
                // Si es página pública, permitir acceso
                if (esPaginaPublica || paginaSinExtension === 'login') {
                    console.log(`✅ Acceso público permitido a: ${paginaActual}`);
                    resolve({ accesoPermitido: true, requiereLogin: false });
                    return;
                }
                
                // Guardar la página que intentaba acceder
                localStorage.setItem('intentoAccesoPagina', window.location.href);
                
                // Mostrar notificación y redirigir
                mostrarNotificacion('🔒 Necesitas iniciar sesión para acceder a esta página', true);
                
                setTimeout(() => {
                    window.location.href = "https://grouvex.github.io/login";
                }, 2500);
                
                resolve({ accesoPermitido: false, requiereLogin: true });
                return;
            }
            
            // Usuario autenticado
            console.log(`🔐 Verificando acceso para: ${user.email} en página: ${paginaActual}`);
            
            // Verificar caché primero
            const cacheKey = `${user.uid}_${paginaActual}`;
            const cacheEntry = cacheAcceso.get(cacheKey);
            if (cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_DURACION) {
                console.log('📦 Usando resultado en caché');
                if (!cacheEntry.accesoPermitido) {
                    manejarAccesoDenegado(cacheEntry.mensaje, cacheEntry.redirigirA);
                }
                resolve(cacheEntry);
                return;
            }
            
            try {
                // Obtener insignias del usuario
                const userID = `GS-${user.uid}`;
                const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
                const insigniasTexto = datosUsuario ? datosUsuario.insignias : '';
                const insigniasUsuario = procesarInsignias(insigniasTexto);
                const rolesUsuario = obtenerRolesUsuario(insigniasUsuario);
                
                // Registrar información del usuario
                console.log(`📊 Usuario: ${user.email}`);
                console.log(`🏷️ Roles: ${rolesUsuario.join(', ') || 'Ninguno'}`);
                console.log(`🎖️ Insignias: ${insigniasUsuario.length} encontradas`);
                
                // Verificar acceso a la página
                const resultado = await verificarAccesoPagina(paginaSinExtension, user, insigniasUsuario, rolesUsuario);
                
                // Guardar en caché
                cacheAcceso.set(cacheKey, {
                    accesoPermitido: resultado.tieneAcceso,
                    mensaje: resultado.mensaje,
                    redirigirA: resultado.redirigirA,
                    timestamp: Date.now()
                });
                
                if (!resultado.tieneAcceso) {
                    manejarAccesoDenegado(resultado.mensaje, resultado.redirigirA, resultado.requiereVerificacion);
                    resolve({ accesoPermitido: false, mensaje: resultado.mensaje });
                    return;
                }
                
                console.log(`✅ Acceso permitido a: ${paginaActual}`);
                
                // Evento opcional para analíticas
                if (typeof registrarAccesoPermitido === 'function') {
                    registrarAccesoPermitido(user.uid, paginaActual, rolesUsuario);
                }
                
                resolve({ accesoPermitido: true, roles: rolesUsuario, insignias: insigniasUsuario });
                
            } catch (error) {
                console.error('❌ Error en verificación de acceso:', error);
                mostrarNotificacion('⚠️ Error verificando permisos. Intenta nuevamente.', true);
                resolve({ accesoPermitido: false, error: error.message });
            }
        });
    });
}

/**
 * Maneja el acceso denegado de forma consistente
 */
function manejarAccesoDenegado(mensaje, redirigirA = "/", requiereVerificacion = false) {
    const mensajeFinal = mensaje || "⛔ No tienes permiso para acceder a esta página";
    
    mostrarNotificacion(mensajeFinal, true);
    
    if (requiereVerificacion) {
        // Enviar nuevo correo de verificación
        const user = auth.currentUser;
        if (user && !user.emailVerified) {
            user.sendEmailVerification()
                .then(() => {
                    mostrarNotificacion("📧 Se ha enviado un nuevo correo de verificación", false);
                })
                .catch(err => console.error("Error enviando verificación:", err));
        }
    }
    
    setTimeout(() => {
        window.location.href = redirigirA;
    }, 4000);
}

/**
 * Limpia la caché de verificación (útil después de cambios de rol)
 */
function limpiarCacheAcceso(userId = null) {
    if (userId) {
        // Limpiar solo entradas de un usuario específico
        for (const [key, value] of cacheAcceso.entries()) {
            if (key.startsWith(userId)) {
                cacheAcceso.delete(key);
            }
        }
        console.log(`🧹 Caché limpiada para usuario: ${userId}`);
    } else {
        cacheAcceso.clear();
        console.log('🧹 Caché de acceso completamente limpiada');
    }
}

/**
 * Función para verificar si el usuario actual tiene un rol específico
 */
async function usuarioTieneRol(rolBuscado) {
    return new Promise(async (resolve) => {
        const user = auth.currentUser;
        if (!user) {
            resolve(false);
            return;
        }
        
        const userID = `GS-${user.uid}`;
        const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
        const insigniasTexto = datosUsuario ? datosUsuario.insignias : '';
        const insigniasUsuario = procesarInsignias(insigniasTexto);
        const roles = obtenerRolesUsuario(insigniasUsuario);
        
        resolve(roles.includes(rolBuscado));
    });
}

/**
 * Función para obtener el nivel de permisos del usuario (para UI)
 */
async function obtenerNivelPermiso() {
    const user = auth.currentUser;
    if (!user) return 0;
    
    const userID = `GS-${user.uid}`;
    const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
    const insigniasTexto = datosUsuario ? datosUsuario.insignias : '';
    const insigniasUsuario = procesarInsignias(insigniasTexto);
    const roles = obtenerRolesUsuario(insigniasUsuario);
    
    // Jerarquía de niveles
    const nivelRoles = {
        'admin': 100,
        'developer': 90,
        'moderador': 80,
        'equipo': 70,
        'empleado': 60,
        'partner': 50,
        'artista': 40,
        'premium': 30
    };
    
    let nivelMaximo = 0;
    for (const rol of roles) {
        const nivel = nivelRoles[rol] || 0;
        if (nivel > nivelMaximo) nivelMaximo = nivel;
    }
    
    return nivelMaximo;
}

// ============================================
// EXPORTAR FUNCIONES (para uso global)
// ============================================

// Hacer disponibles globalmente
window.sistemaPermisos = {
    verificarAcceso,
    usuarioTieneRol,
    obtenerNivelPermiso,
    limpiarCacheAcceso,
    obtenerRolesUsuario,
    usuarioTieneInsignia
};

// Ejemplo de uso en consola
console.log('✅ Sistema de permisos mejorado cargado');
console.log('📖 Funciones disponibles: verificarAcceso(), usuarioTieneRol(), obtenerNivelPermiso()');

// ============================================
// FUNCIONES DE NAVEGACIÓN
// ============================================

function redirectUser() {
    const user = auth.currentUser;
    if (!user) return;
    
    const defaultPath = "https://grouvex.github.io";
    const lastPath = localStorage.getItem('lastVisitedPath') || defaultPath;
    verificarAcceso();
    setTimeout(() => { window.location.href = lastPath; }, 1000);
}

// ============================================
// FUNCIONES DE PERFIL Y USUARIO
// ============================================

async function updateProfileUI(targetUser) {
    if (!targetUser) return;
    
    const nombreUsuario = targetUser.displayName || "Usuario";
    const userID = targetUser.uid;
    
    const actualizarElemento = (id, valor) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    };
    
    actualizarElemento('correoElectronico', targetUser.email || 'Sin email');
    actualizarElemento('userID', `GS-${userID}`);
    
    const usuarioElement = document.querySelector('.usuario');
    if (usuarioElement) {
        usuarioElement.textContent = nombreUsuario;
        usuarioElement.className = `usuario ${nombreUsuario.replace(/\s+/g, '-')}`;
    }
    
    const fotoPerfil = document.getElementById('fotoPerfil');
    if (fotoPerfil) {
        const fotoURL = await obtenerFotoPerfilFirebase(`GS-${userID}`);
        fotoPerfil.src = fotoURL;
        fotoPerfil.alt = nombreUsuario;
    }
    
    setTimeout(() => {
        cargarDatosEInsigniasEnTodosLosElementos();
    }, 500);
}

function eliminarDatosUsuario(userId) {
    return database.ref(`users/${userId}`).remove();
}

// ============================================
// OBSERVADOR DE AUTENTICACIÓN PRINCIPAL
// ============================================

auth.onAuthStateChanged(async (user) => {
    if (user) {
        console.log("✅ Usuario autenticado:", user.email);
        console.log("🔑 ID autenticado:", user.uid);
        
        const urlParams = new URLSearchParams(window.location.search);
        const viewedUserId = urlParams.get('userId');
        const isViewingOwnProfile = !viewedUserId || viewedUserId === user.uid;
        const targetUserId = isViewingOwnProfile ? user.uid : viewedUserId;
        
        let targetUser = user;
        if (!isViewingOwnProfile && viewedUserId) {
            const snapshot = await database.ref(`users/${viewedUserId}`).once('value');
            if (snapshot.exists()) {
                targetUser = snapshot.val();
                targetUser.uid = viewedUserId;
            }
        }
        
        const gsUserIdInput = document.getElementById('gs-user-id');
        if (gsUserIdInput) {
            gsUserIdInput.value = "GS-" + user.uid;
        }
        
        await updateProfileUI(targetUser);
        
        const authContainer = document.getElementById('auth-container');
        const content = document.getElementById('content');
        
        if (authContainer) authContainer.style.display = 'none';
        if (content) content.style.display = 'block';
        
    } else {
        console.log("❌ Usuario no autenticado");
        
        const authContainer = document.getElementById('auth-container');
        const content = document.getElementById('content');
        
        if (authContainer) authContainer.style.display = 'block';
        if (content) content.style.display = 'none';
        
        const gsUserIdInput = document.getElementById('gs-user-id');
        if (gsUserIdInput) {
            gsUserIdInput.value = "Not Defined";
        }
        
        cargarDatosEInsigniasEnTodosLosElementos();
    }
});

// ============================================
// EVENTOS AL CARGAR EL DOM
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
    if (!document.getElementById('insignias-styles')) {
        const style = document.createElement('style');
        style.id = 'insignias-styles';
        style.textContent = `
            .insignias-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 8px;
                margin: 10px 0;
                padding: 10px;
                min-height: 50px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.05);
                position: relative;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(10px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .insignia-item {
                position: relative;
            }
            
            .insignia-item:hover::after {
                content: attr(data-nombre);
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 500;
                white-space: nowrap;
                z-index: 100;
                border: 1px solid rgba(255, 215, 0, 0.3);
                pointer-events: none;
            }
            
            .no-insignias-message {
                text-align: center;
                color: #888;
                font-size: 12px;
                padding: 10px;
                font-style: italic;
            }
            
            .insignias-count {
                position: absolute;
                top: -5px;
                right: -5px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                font-size: 10px;
                font-weight: bold;
                padding: 2px 6px;
                border-radius: 10px;
                border: 2px solid white;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 10;
            }
        `;
        document.head.appendChild(style);
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => auth.signOut());
    }
    
    const deleteBtn = document.getElementById('deleteBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleAccountDeletion();
        });
    }
    
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', () => {
            const user = auth.currentUser;
            if (user && user.email) {
                auth.sendPasswordResetEmail(user.email)
                    .then(() => alert('Correo para restablecer la contraseña enviado a ' + user.email))
                    .catch((error) => alert('Error: ' + error.message));
            } else {
                const email = prompt('Introduce tu correo electrónico para restablecer la contraseña:');
                if (email) {
                    auth.sendPasswordResetEmail(email)
                        .then(() => alert('Correo enviado a ' + email))
                        .catch((error) => alert('Error: ' + error.message));
                }
            }
        });
    }
    
    const paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual !== 'login' && paginaActual !== 'login.html') {
        verificarAcceso();
    }
    
    setTimeout(() => {
        cargarDatosEInsigniasEnTodosLosElementos();
    }, 1000);
});
