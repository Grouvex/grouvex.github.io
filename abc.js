// !function(){'use strict';document.addEventListener('keydown',e=>{((e.ctrlKey&&e.shiftKey&&['I','J','C','K'].includes(e.key))||['F12','F8'].includes(e.key)||(e.ctrlKey&&['U','S'].includes(e.key.toUpperCase())))&&(e.preventDefault(),e.stopImmediatePropagation())},!0),document.addEventListener('contextmenu',e=>{e.preventDefault(),e.stopImmediatePropagation()},!0),document.addEventListener('selectstart',e=>e.preventDefault(),!0),setInterval(()=>{(window.outerWidth-window.innerWidth>100||window.outerHeight-window.innerHeight>100)&&console.log('x')},1e3)}();

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, EmailAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, deleteUser, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, sendEmailVerification, reauthenticateWithCredential } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, remove, onValue, onDisconnect, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// ============================================
// CONFIGURACIÓN INICIAL
// ============================================

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// ============================================
// CONFIGURACIÓN INSIGNIAS
// ============================================

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxQBy3U9WSBBYfo9C-etH3KYe3_b9B_W1i40-XE6vUgatP16slZDnXtokxs25l80VBWjg/exec';
const URL_BASE_INSIGNIAS = 'https://raw.githubusercontent.com/Grouvex/grouvex.github.io/refs/heads/main/img/';

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

async function completeUserProfile(user, isGoogleUser = false) {
    if (isGoogleUser && user.displayName) return;

    const displayName = user.displayName || prompt("¿Cómo quieres que te llamemos?");
    
    await updateProfile(user, {
        displayName: displayName || "Usuario",
        photoURL: user.photoURL || "https://grouvex.com/img/GROUVEX.png"
    });

    await set(ref(database, `users/${user.uid}`), {
        email: user.email,
        displayName: displayName || "Usuario",
        photoURL: user.photoURL || "https://grouvex.com/img/GROUVEX.png",
        lastLogin: Date.now(),
        provider: isGoogleUser ? "google" : "email",
        emailVerified: isGoogleUser ? true : user.emailVerified
    });

    if (!isGoogleUser && !user.emailVerified) {
        await sendEmailVerification(user);
        mostrarNotificacion('📧 Se envió un correo de verificación. Por favor revisa tu bandeja.');
    }
}

function handleEmailAuth(email, password, isLogin) {
    const authFunction = isLogin ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
    
    authFunction(auth, email, password)
        .then(async (userCredential) => {
            if (!isLogin) await completeUserProfile(userCredential.user);
            mostrarNotificacion(`✅ ${isLogin ? 'Inicio de sesión exitoso' : 'Registro completado'}`);
            redirectUser();
        })
        .catch(error => {
            mostrarNotificacion(`❌ Error: ${error.message}`, true);
        });
}

async function handleGoogleLogin() {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        
        const result = await signInWithPopup(auth, provider);
        
        await set(ref(database, `users/${result.user.uid}`), {
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL || "https://grouvex.com/img/GROUVEX.png",
            lastLogin: Date.now(),
            provider: "google"
        });
        
        mostrarNotificacion('✅ Inicio de sesión con Google exitoso');
        redirectUser();
    } catch (error) {
        mostrarNotificacion(`❌ Error: ${error.message}`, true);
    }
}

// ============================================
// FUNCIONES DE INTERFAZ DE USUARIO
// ============================================

function mostrarNotificacion(mensaje, esError = false) {
    const notificacion = document.createElement("div");
    notificacion.className = `notificacion ${esError ? 'error' : 'exito'}`;
    notificacion.innerHTML = `<p>${mensaje}</p><div class="progress-bar"></div>`;
    notificacion.style = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        background: ${esError ? '#ff4444' : '#4CAF50'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 90%;
        width: 300px;
        text-align: center;
        font-size: 14px;
    `;
    document.body.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 8000);
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

        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
        await eliminarDatosUsuario(user.uid);
        await deleteUser(user);
        
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
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
        'default': 'Error crítico: ' + error.message
    };

    const mensaje = mensajesError[error.code] || mensajesError['default'];
    mostrarNotificacion(`❌ ${mensaje}`, true);
    
    if (error.code === 'auth/requires-recent-login') {
        setTimeout(() => window.location.href = '/login', 3000);
    }
}

// ============================================
// FUNCIONES PARA OBTENER DATOS DEL USUARIO
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
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
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
        
        console.log('📊 Datos recibidos:', {
            headersCount: headers.length,
            rowCount: data.length
        });
        
        // Buscar índices de columnas
        let userIDIndex = -1;
        let insigniasIndex = -1;
        let nombreIndex = -1;
        let emailIndex = -1;
        
        headers.forEach((header, index) => {
            const headerStr = header ? header.toString() : '';
            
            if (userIDIndex === -1 && headerStr.toLowerCase().includes('grouvex studios userid')) {
                userIDIndex = index;
                console.log('✅ Columna UserID encontrada en índice:', index);
            }
            
            if (insigniasIndex === -1 && headerStr.toLowerCase() === 'insignias') {
                insigniasIndex = index;
                console.log('✅ Columna Insignias encontrada en índice:', index);
            }
            
            if (nombreIndex === -1 && (headerStr.toLowerCase().includes('nombre de usuario') || 
                                       headerStr.toLowerCase().includes('nombre del cliente') ||
                                       headerStr.toLowerCase().includes('nombre y apellidos reales') ||
                                       headerStr.toLowerCase().includes('nombre del artista/banda'))) {
                nombreIndex = index;
                console.log('✅ Columna Nombre encontrada en índice:', index);
            }
            
            if (emailIndex === -1 && headerStr.toLowerCase().includes('email')) {
                emailIndex = index;
                console.log('✅ Columna Email encontrada en índice:', index);
            }
        });
        
        // Si no encuentra columna específica de nombre, buscar cualquier columna con "nombre"
        if (nombreIndex === -1) {
            headers.forEach((header, index) => {
                const headerStr = header ? header.toString() : '';
                if (nombreIndex === -1 && headerStr.toLowerCase().includes('nombre')) {
                    nombreIndex = index;
                    console.log('✅ Columna Nombre (aproximada) encontrada en índice:', index);
                }
            });
        }
        
        console.log('📊 Índices encontrados:', {
            userIDIndex, 
            insigniasIndex, 
            nombreIndex, 
            emailIndex
        });
        
        if (userIDIndex === -1) {
            console.error('❌ No se encontró la columna UserID');
            return null;
        }
        
        // Buscar el usuario en todas las filas
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowUserID = row[userIDIndex] ? row[userIDIndex].toString().trim() : '';
            
            if (rowUserID) {
                const normalizedRowUserID = rowUserID.replace(/^GS-/, '').trim();
                
                console.log(`Comparando fila ${i + 2}: "${normalizedRowUserID}" con "${searchUserID}"`);
                
                if (normalizedRowUserID === searchUserID) {
                    console.log(`✅ Usuario encontrado en fila ${i + 2}`);
                    
                    // Obtener datos
                    const insigniasTexto = insigniasIndex !== -1 ? (row[insigniasIndex] ? row[insigniasIndex].toString().trim() : '') : '';
                    const nombre = nombreIndex !== -1 ? (row[nombreIndex] ? row[nombreIndex].toString().trim() : '') : 'Usuario';
                    const email = emailIndex !== -1 ? (row[emailIndex] ? row[emailIndex].toString().trim() : '') : '';
                    
                    console.log('📝 Datos encontrados:', {
                        nombre,
                        email,
                        insigniasTexto: insigniasTexto ? `${insigniasTexto.substring(0, 50)}...` : 'vacío'
                    });
                    
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
        return {
            userID: userID,
            nombre: 'Usuario no encontrado',
            email: 'No disponible',
            insignias: ''
        };
        
    } catch (error) {
        console.error('❌ Error obteniendo datos del usuario:', error);
        return {
            userID: userID,
            nombre: 'Error al cargar',
            email: 'Error',
            insignias: ''
        };
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
    
    // Si indica que no hay insignias
    if (texto.toLowerCase() === 'ninguna' || 
        texto.toLowerCase() === 'sin insignias' ||
        texto.toLowerCase() === 'n/a' ||
        texto.toLowerCase() === 'no aplica') {
        return [];
    }
    
    const insignias = [];
    
    // Separar por comas, punto y coma, o espacios
    const separadores = /[,;]+/;
    const partes = texto.split(separadores);
    
    partes.forEach(parte => {
        const urlLimpia = parte.trim();
        
        if (urlLimpia && urlLimpia.toLowerCase().includes('githubusercontent.com')) {
            // Verificar si tiene extensión de imagen
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
        // Decodificar URL si está codificada
        const urlDecodificada = decodeURIComponent(url);
        
        // Extraer nombre del archivo
        const nombreArchivo = urlDecodificada.split('/').pop();
        const nombreSinExtension = nombreArchivo.split('.')[0];
        
        // Formatear nombre
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
        
        // Mostrar indicador de carga en el span
        elementoTigsID.textContent = 'Cargando...';
        elementoTigsID.style.color = '#888';
        elementoTigsID.style.fontStyle = 'italic';
        
        // Buscar el contenedor de insignias más cercano
        const contenedorInsignias = elementoTigsID.closest('div')?.querySelector('.insignias-container');
        
        // Obtener datos del usuario
        const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
        
        if (!datosUsuario) {
            elementoTigsID.textContent = 'Error al cargar';
            elementoTigsID.style.color = '#ff4444';
            if (contenedorInsignias) {
                contenedorInsignias.innerHTML = '<div class="error-insignias">❌ Error cargando datos</div>';
            }
            return;
        }
        
        // MOSTRAR NOMBRE EN EL SPAN (CASO 1)
        elementoTigsID.textContent = datosUsuario.nombre;
        elementoTigsID.style.color = '';
        elementoTigsID.style.fontStyle = '';
        elementoTigsID.title = `ID: ${userID}`;
        
        console.log(`✅ Nombre mostrado: ${datosUsuario.nombre} para ${userID}`);
        
        // MOSTRAR INSIGNIAS EN EL CONTENEDOR
        if (contenedorInsignias) {
            const insignias = procesarInsignias(datosUsuario.insignias);
            
            // Limpiar contenedor
            contenedorInsignias.innerHTML = '';
            
            if (!insignias || insignias.length === 0) {
                contenedorInsignias.innerHTML = '<div class="no-insignias-message">🎯 Sin insignias</div>';
                return;
            }
            
            console.log(`✅ Mostrando ${insignias.length} insignias para ${userID}`);
            
            // Ordenar insignias: animadas primero
            const insigniasOrdenadas = insignias.sort((a, b) => {
                if (a.tipo === 'animada' && b.tipo !== 'animada') return -1;
                if (a.tipo !== 'animada' && b.tipo === 'animada') return 1;
                return a.nombre.localeCompare(b.nombre);
            });
            
            insigniasOrdenadas.forEach((insignia, index) => {
                const insigniaElement = crearElementoInsignia(insignia, index);
                contenedorInsignias.appendChild(insigniaElement);
            });
            
            // Añadir contador si hay más de 1 insignia
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
    
    // Estilos base
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
    
    // Estilos según tipo
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
    
    // Efectos hover
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
    
    // Manejo de error en carga de imagen
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
    
    // CASO 1: Elementos con atributo tigsID
    const elementosConTigsID = document.querySelectorAll('[tigsID]');
    console.log(`📊 Encontrados ${elementosConTigsID.length} elementos con tigsID`);
    
    // Procesar todos los elementos con tigsID en paralelo
    const promesas = [];
    
    for (const elemento of elementosConTigsID) {
        promesas.push(mostrarDatosEInsigniasEnElemento(elemento));
    }
    
    // Esperar a que se procesen todos los elementos con tigsID
    await Promise.all(promesas);
    
    // CASO 2: Elementos donde el ID está en el texto del span con id="userID"
    const userIDElement = document.getElementById('userID');
    if (userIDElement && userIDElement.textContent.trim()) {
        const userID = userIDElement.textContent.trim();
        console.log(`📋 UserID encontrado en texto: ${userID}`);
        
        // Buscar contenedor de insignias en el mismo contexto
        const contenedorInsignias = userIDElement.closest('div')?.querySelector('.insignias-container');
        
        if (contenedorInsignias) {
            const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
            
            if (datosUsuario && datosUsuario.insignias) {
                const insignias = procesarInsignias(datosUsuario.insignias);
                
                // Limpiar contenedor
                contenedorInsignias.innerHTML = '';
                
                if (insignias.length > 0) {
                    // Ordenar insignias: animadas primero
                    const insigniasOrdenadas = insignias.sort((a, b) => {
                        if (a.tipo === 'animada' && b.tipo !== 'animada') return -1;
                        if (a.tipo !== 'animada' && b.tipo === 'animada') return 1;
                        return a.nombre.localeCompare(b.nombre);
                    });
                    
                    insigniasOrdenadas.forEach((insignia, index) => {
                        const insigniaElement = crearElementoInsignia(insignia, index);
                        contenedorInsignias.appendChild(insigniaElement);
                    });
                    
                    // Añadir contador
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

function usuarioTieneInsignia(insignias, insigniaBuscada) {
    if (!insignias || insignias.length === 0) return false;
    
    const insigniaBuscadaLower = insigniaBuscada.toLowerCase();
    
    return insignias.some(insignia => {
        const nombreInsignia = insignia.nombre.toLowerCase();
        const urlInsignia = insignia.url.toLowerCase();
        
        return nombreInsignia.includes(insigniaBuscadaLower) || 
               urlInsignia.includes(insigniaBuscadaLower);
    });
}

async function verificarAcceso() {
    onAuthStateChanged(auth, async (user) => {
        const paginaActual = window.location.pathname.split("/").pop();
        
        if (!user) {
            if (paginaActual === 'login' || paginaActual === 'register') {
                return;
            }
            
            mostrarNotificacion('🔒 Necesitas iniciar sesión para acceder a esta página');
            setTimeout(() => { 
                window.location.href = "https://grouvex.github.io/login"; 
            }, 3000);
            return;
        }

        const userID = `GS-${user.uid}`;
        const datosUsuario = await obtenerDatosUsuarioPorUserID(userID);
        const insigniasTexto = datosUsuario ? datosUsuario.insignias : '';
        const insigniasUsuario = procesarInsignias(insigniasTexto);
        
        const permisosPorPagina = {
            "grouvex-studios-recording": ['artista', 'verified-employee', 'owner-recording', 'verified-team'],
            "grouvex-studios-animation": ['artista', 'verified-employee', 'verified-team'],
            "team": ['verified-team', 'admin', 'owner', 'verified-employee'],
            "planeta": ['verified-partner', 'partner', 'verified-team'],
            "pacman": ['premium', 'verified-partner', 'partner', 'verified-team', 'owner']
        };

        const nombresEquipos = {
            "grouvex-studios-recording": "Artista o Empleado",
            "grouvex-studios-animation": "Artista o Empleado",
            "team": "Miembro del Team",
            "planeta": "Partner o VPartner",
            "pacman": "Premium, Partner o Miembro del Team"
        };

        if (permisosPorPagina[paginaActual]) {
            const tieneAcceso = permisosPorPagina[paginaActual].some(insignia => 
                usuarioTieneInsignia(insigniasUsuario, insignia)
            );

            if (!tieneAcceso) {
                const equipoRequerido = nombresEquipos[paginaActual];
                mostrarNotificacion(`⛔ Requieres ser ${equipoRequerido}. Redirigiendo...`);
                setTimeout(() => {
                    window.location.href = "https://grouvex.github.io";
                }, 5000);
                return;
            }
        }
    });
}

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
        fotoPerfil.src = targetUser.photoURL || 'https://grouvex.com/img/GROUVEX.png';
        fotoPerfil.alt = nombreUsuario;
    }
    
    // Cargar datos e insignias después de un breve delay
    setTimeout(() => {
        cargarDatosEInsigniasEnTodosLosElementos();
    }, 500);
}

async function getUserData(userId) {
    try {
        const userRef = ref(database, `users/${userId}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
            const userData = snapshot.val();
            return {
                uid: userId,
                email: userData.email || '',
                displayName: userData.displayName || 'Usuario',
                photoURL: userData.photoURL || 'https://grouvex.com/img/GROUVEX.png'
            };
        } else {
            return {
                uid: userId,
                email: 'Desconocido',
                displayName: 'Usuario',
                photoURL: 'https://grouvex.com/img/GROUVEX.png'
            };
        }
    } catch (error) {
        console.error('Error obteniendo datos de usuario:', error);
        return {
            uid: userId,
            email: 'Error',
            displayName: 'Usuario',
            photoURL: 'https://grouvex.com/img/GROUVEX.png'
        };
    }
}

function eliminarDatosUsuario(userId) {
    const userRef = ref(database, `users/${userId}`);
    return remove(userRef);
}

// ============================================
// OBSERVADOR DE AUTENTICACIÓN PRINCIPAL
// ============================================

onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("✅ Usuario autenticado:", user.email);
        console.log("🔑 ID autenticado:", user.uid);
        
        const urlParams = new URLSearchParams(window.location.search);
        const viewedUserId = urlParams.get('userId');
        const isViewingOwnProfile = !viewedUserId || viewedUserId === user.uid;
        const targetUserId = isViewingOwnProfile ? user.uid : viewedUserId;
        
        let targetUser;
        if (isViewingOwnProfile) {
            targetUser = user;
        } else {
            targetUser = await getUserData(targetUserId);
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
        
        // Aún podemos cargar datos para elementos con tigsID
        cargarDatosEInsigniasEnTodosLosElementos();
    }
});

// ============================================
// EVENTOS AL CARGAR EL DOM
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Aplicar estilos CSS para insignias
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
            
            .loading-insignias {
                text-align: center;
                color: #667eea;
                font-size: 12px;
                padding: 10px;
            }
            
            .error-insignias {
                text-align: center;
                color: #ff4444;
                font-size: 12px;
                padding: 10px;
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
    
    // Event listeners para autenticación
    document.getElementById('logoutBtn')?.addEventListener('click', () => signOut(auth));
    
    document.getElementById('deleteBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        handleAccountDeletion();
    });
    
    document.getElementById('resetPasswordBtn')?.addEventListener('click', () => {
        const email = prompt('Introduce tu correo electrónico para restablecer la contraseña:');
        if (email) {
            sendPasswordResetEmail(auth, email)
                .then(() => alert('Correo para restablecer la contraseña enviado.'))
                .catch((error) => alert('Error al enviar el correo de restablecimiento: ' + error.message));
        }
    });

    // Verificar acceso según la página
    const paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual !== 'login') {
        verificarAcceso();
    }
    
    // Cargar datos e insignias cuando el DOM esté listo
    setTimeout(() => {
        cargarDatosEInsigniasEnTodosLosElementos();
    }, 1000);
});
