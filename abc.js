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
const INSIGNIAS_PREDEFINIDAS = {
  'verified': `${URL_BASE_INSIGNIAS}verified.png`,
  'verified-partner': `${URL_BASE_INSIGNIAS}verified-partner.gif`,
  'verified-team': `${URL_BASE_INSIGNIAS}verified-team.png`,
  'verified-employee': `${URL_BASE_INSIGNIAS}verified-employee.gif`,
  'verified-moderator': `${URL_BASE_INSIGNIAS}verified-moderator.gif`,
  'verified-developer-a': `${URL_BASE_INSIGNIAS}verified-developer-a.gif`,
  'verified-bughunter': `${URL_BASE_INSIGNIAS}verified-bughunter.gif`,
  'artista': `${URL_BASE_INSIGNIAS}artista.gif`,
  'partner': `${URL_BASE_INSIGNIAS}partner.png`,
  'owner': `${URL_BASE_INSIGNIAS}owner.png`,
  'owner-recording': `${URL_BASE_INSIGNIAS}ownerRecording.png`,
  'owner-designs': `${URL_BASE_INSIGNIAS}ownerDesigns.png`,
  'owner-animations': `${URL_BASE_INSIGNIAS}ownerAnimations.png`,
  'sistema': `${URL_BASE_INSIGNIAS}sistema.png`,
  'palette': `${URL_BASE_INSIGNIAS}Palette.png`,
  'video-creator': `${URL_BASE_INSIGNIAS}Video_Creator.png`,
  'vip': `${URL_BASE_INSIGNIAS}VIP.png`,
  'super-bughunter': `${URL_BASE_INSIGNIAS}super-bughunter.png`,
  'developer': `${URL_BASE_INSIGNIAS}developer.png`,
  'trial-moderator': `${URL_BASE_INSIGNIAS}trial-moderator.png`,
  'moderator': `${URL_BASE_INSIGNIAS}moderator.png`,
  'employee': `${URL_BASE_INSIGNIAS}employee.png`,
  'grouvex': `${URL_BASE_INSIGNIAS}GROUVEX.png`,
  'grouvex-gco': `${URL_BASE_INSIGNIAS}GROUVEX%20Studios%20GCO.png`
};

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
// FUNCIONES PARA OBTENER INSIGNIAS
// ============================================

async function obtenerUserID() {
    let userID = '';
    
    const userIDSpan = document.getElementById('userID');
    if (userIDSpan && userIDSpan.textContent && userIDSpan.textContent.trim() !== '') {
        userID = userIDSpan.textContent.trim();
        console.log('✅ UserID obtenido del span:', userID);
    }
    
    if (!userID && auth.currentUser) {
        userID = auth.currentUser.uid;
        console.log('✅ UserID obtenido del usuario autenticado:', userID);
    }
    
    if (userID && !userID.startsWith('GS-')) {
        userID = 'GS-' + userID;
    }
    
    return userID;
}

async function obtenerInsigniasUsuario(userID) {
    try {
        console.log('🔍 Buscando insignias para UserID:', userID);
        
        if (!userID) {
            console.log('❌ No se pudo obtener el UserID');
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
        console.log('📄 Respuesta recibida (primeros 200 chars):', text.substring(0, 200));
        
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
        
        let userIDIndex = -1;
        let insigniasIndex = -1;
        
        // Buscar índices de columnas
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
        });
        
        console.log('📊 Índices encontrados:', { 
            userIDIndex, 
            insigniasIndex
        });
        
        if (userIDIndex === -1 || insigniasIndex === -1) {
            console.error('❌ No se encontraron las columnas necesarias');
            console.log('Headers disponibles:', headers);
            return null;
        }
        
        // Buscar el usuario en todas las filas
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const rowUserID = row[userIDIndex] ? row[userIDIndex].toString().trim() : '';
            
            if (rowUserID) {
                const normalizedRowUserID = rowUserID.replace(/^GS-/, '').trim();
                
                console.log(`Comparando: "${normalizedRowUserID}" con "${searchUserID}"`);
                
                if (normalizedRowUserID === searchUserID) {
                    console.log(`✅ Usuario encontrado en fila ${i + 2}`);
                    
                    const insigniasTexto = row[insigniasIndex] ? row[insigniasIndex].toString().trim() : '';
                    console.log('📝 Insignias encontradas:', insigniasTexto);
                    
                    if (!insigniasTexto || insigniasTexto.trim() === '') {
                        console.log('ℹ️ Usuario sin insignias');
                        return [];
                    }
                    
                    const insigniasProcesadas = procesarInsignias(insigniasTexto);
                    console.log(`✅ ${insigniasProcesadas.length} insignias procesadas`);
                    return insigniasProcesadas;
                }
            }
        }
        
        console.log('❌ Usuario no encontrado en la base de datos');
        return null;
        
    } catch (error) {
        console.error('❌ Error obteniendo insignias:', error);
        return null;
    }
}

function procesarInsignias(textoInsignias) {
    textoInsignias = textoInsignias.trim();
    
    console.log('🔄 Procesando texto de insignias:', textoInsignias);
    
    if (!textoInsignias || textoInsignias === '' || 
        textoInsignias.toLowerCase() === 'ninguna' || 
        textoInsignias.toLowerCase() === 'sin insignias') {
        return [];
    }
    
    const insignias = [];
    
    // Primero buscar URLs completas
    const regexUrls = /https?:\/\/[^\s,;|]+(?:\.(?:png|gif|jpg|jpeg|webp|svg))[^\s,;|]*/gi;
    const urlsEncontradas = textoInsignias.match(regexUrls) || [];
    
    // Luego buscar nombres de insignias predefinidas sin URL completa
    const nombresInsignias = Object.keys(INSIGNIAS_PREDEFINIDAS);
    
    // Procesar URLs encontradas
    urlsEncontradas.forEach(url => {
        const urlLimpia = url.trim();
        if (urlLimpia && urlLimpia.toLowerCase().includes(URL_BASE_INSIGNIAS.toLowerCase())) {
            // Verificar que sea una URL válida de insignias
            const esValida = urlLimpia.toLowerCase().includes('.png') || 
                           urlLimpia.toLowerCase().includes('.gif') || 
                           urlLimpia.toLowerCase().includes('.jpg') || 
                           urlLimpia.toLowerCase().includes('.jpeg') || 
                           urlLimpia.toLowerCase().includes('.webp') || 
                           urlLimpia.toLowerCase().includes('.svg');
            
            if (esValida) {
                const nombre = extraerNombreInsignia(urlLimpia);
                
                insignias.push({
                    nombre: nombre,
                    url: urlLimpia,
                    tipo: determinarTipoInsignia(urlLimpia),
                    esPredefinida: true
                });
                
                console.log(`✅ Insignia URL añadida: ${nombre}`);
            }
        }
    });
    
    // Si no hay URLs, buscar nombres de insignias predefinidas
    if (insignias.length === 0) {
        nombresInsignias.forEach(nombreInsignia => {
            if (textoInsignias.toLowerCase().includes(nombreInsignia.toLowerCase())) {
                const url = INSIGNIAS_PREDEFINIDAS[nombreInsignia];
                const nombreFormateado = formatearNombreInsignia(nombreInsignia);
                
                insignias.push({
                    nombre: nombreFormateado,
                    url: url,
                    tipo: determinarTipoInsignia(url),
                    esPredefinida: true
                });
                
                console.log(`✅ Insignia predefinida añadida: ${nombreFormateado}`);
            }
        });
    }
    
    // Si aún no hay insignias, procesar el texto como antes
    if (insignias.length === 0) {
        const delimitadores = /[,;|/\\\n\t]+/;
        const partes = textoInsignias.split(delimitadores);
        
        console.log('📝 Partes encontradas:', partes.length);
        
        partes.forEach(parte => {
            const linkLimpio = parte.trim();
            
            if (linkLimpio && linkLimpio.length > 3) {
                // Verificar si es una URL completa
                if (linkLimpio.toLowerCase().startsWith('http')) {
                    if (linkLimpio.toLowerCase().includes(URL_BASE_INSIGNIAS.toLowerCase())) {
                        const nombre = extraerNombreInsignia(linkLimpio);
                        
                        insignias.push({
                            nombre: nombre,
                            url: linkLimpio,
                            tipo: determinarTipoInsignia(linkLimpio),
                            esPredefinida: false
                        });
                        
                        console.log(`✅ Insignia URL completa añadida: ${nombre}`);
                    }
                } else {
                    // Buscar si es un nombre de insignia predefinida
                    const nombreInsigniaEncontrado = nombresInsignias.find(nombre => 
                        linkLimpio.toLowerCase().includes(nombre.toLowerCase())
                    );
                    
                    if (nombreInsigniaEncontrado) {
                        const url = INSIGNIAS_PREDEFINIDAS[nombreInsigniaEncontrado];
                        const nombreFormateado = formatearNombreInsignia(nombreInsigniaEncontrado);
                        
                        insignias.push({
                            nombre: nombreFormateado,
                            url: url,
                            tipo: determinarTipoInsignia(url),
                            esPredefinida: true
                        });
                        
                        console.log(`✅ Insignia por nombre añadida: ${nombreFormateado}`);
                    }
                }
            }
        });
    }
    
    console.log(`🎯 Total de insignias válidas: ${insignias.length}`);
    
    // Eliminar duplicados
    const insigniasUnicas = [];
    const urlsVistas = new Set();
    
    insignias.forEach(insignia => {
        if (!urlsVistas.has(insignia.url)) {
            urlsVistas.add(insignia.url);
            insigniasUnicas.push(insignia);
        }
    });
    
    return insigniasUnicas;
}

function extraerNombreInsignia(url) {
    try {
        const nombreArchivo = url.split('/').pop();
        const nombreSinExtension = nombreArchivo.split('.')[0];
        
        // Decodificar URL si está codificada
        const nombreDecodificado = decodeURIComponent(nombreSinExtension);
        
        return formatearNombreInsignia(nombreDecodificado);
    } catch (e) {
        return 'Insignia';
    }
}

function formatearNombreInsignia(nombre) {
    return nombre
        .replace(/%20/g, ' ')
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\.(png|gif|jpg|jpeg|webp|svg)$/i, '')
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
}

function determinarTipoInsignia(url) {
    if (url.includes('.gif')) return 'animada';
    if (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg')) return 'estatica';
    if (url.includes('.svg')) return 'vectorial';
    return 'desconocido';
}

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

// ============================================
// FUNCIONES PARA MOSTRAR INSIGNIAS
// ============================================

async function mostrarInsigniasUsuarioEnPerfil() {
    try {
        console.log('🎨 Verificando contenedor de insignias...');
        
        const insigniasContainer = document.querySelector('.insignias-container');
        
        if (!insigniasContainer) {
            console.log('⏭️ No existe .insignias-container, no se mostrarán insignias');
            return;
        }
        
        console.log('✅ Contenedor .insignias-container encontrado');
        
        const userID = await obtenerUserID();
        console.log('📋 UserID para buscar:', userID);
        
        const insignias = await obtenerInsigniasUsuario(userID);
        console.log('📊 Resultado de obtenerInsigniasUsuario:', insignias);
        
        insigniasContainer.innerHTML = '';
        
        if (insignias === null) {
            console.log('⚠️ Error obteniendo insignias (null)');
            insigniasContainer.innerHTML = `
                <div style="text-align: center; color: #888; font-size: 12px; margin: 10px 0;">
                    ⚠️ Error al cargar insignias
                </div>
            `;
            return;
        }
        
        if (!insignias || insignias.length === 0) {
            console.log('ℹ️ Usuario sin insignias o array vacío');
            insigniasContainer.innerHTML = `
                <div style="text-align: center; color: #888; font-size: 12px; margin: 10px 0;">
                    🎯 No hay insignias asignadas
                </div>
            `;
            return;
        }
        
        console.log(`✅ Mostrando ${insignias.length} insignias`);
        
        // Ordenar insignias: animadas primero, luego estáticas
        const insigniasOrdenadas = insignias.sort((a, b) => {
            if (a.tipo === 'animada' && b.tipo !== 'animada') return -1;
            if (a.tipo !== 'animada' && b.tipo === 'animada') return 1;
            return a.nombre.localeCompare(b.nombre);
        });
        
        insigniasOrdenadas.forEach((insignia, index) => {
            const insigniaElement = crearElementoInsignia(insignia, index);
            insigniasContainer.appendChild(insigniaElement);
        });
        
        aplicarEstilosInsignias();
        
        console.log('✅ Insignias mostradas correctamente');
        
    } catch (error) {
        console.error('❌ Error mostrando insignias:', error);
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
    `;
    
    const img = document.createElement('img');
    img.src = insignia.url;
    img.alt = insignia.nombre;
    img.title = insignia.nombre;
    img.loading = 'lazy';
    
    // Estilos específicos según tipo
    let estilosBase = `
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: 2px solid rgba(255, 255, 255, 0.1);
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
    
    // Efectos hover
    img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.15) rotate(5deg)';
        img.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.4)';
        img.style.borderColor = 'gold';
        
        if (insignia.tipo === 'animada') {
            img.style.boxShadow = '0 0 20px rgba(255, 100, 0, 0.6)';
        }
    });
    
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1) rotate(0deg)';
        img.style.boxShadow = insignia.tipo === 'animada' 
            ? '0 0 5px rgba(255, 215, 0, 0.2)' 
            : 'none';
        img.style.borderColor = insignia.tipo === 'animada' 
            ? 'rgba(255, 215, 0, 0.3)' 
            : insignia.tipo === 'vectorial'
            ? 'rgba(0, 150, 255, 0.3)'
            : 'rgba(255, 255, 255, 0.1)';
    });
    
    container.appendChild(img);
    return container;
}

function aplicarEstilosInsignias() {
    if (!document.getElementById('insignias-styles')) {
        const style = document.createElement('style');
        style.id = 'insignias-styles';
        style.textContent = `
            .insignias-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                gap: 10px;
                margin: 20px 0;
                padding: 15px;
                min-height: 60px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(15px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            .insignia-item:hover {
                z-index: 10;
            }
            
            .insignia-item:hover::after {
                content: attr(data-nombre);
                position: absolute;
                bottom: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                white-space: nowrap;
                z-index: 100;
                border: 1px solid rgba(255, 215, 0, 0.3);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }
            
            .insignia-item[data-tipo="animada"] {
                animation: pulse 2s infinite ease-in-out;
            }
            
            .insignias-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background: #4CAF50;
                color: white;
                font-size: 10px;
                padding: 2px 6px;
                border-radius: 10px;
                font-weight: bold;
                z-index: 5;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// FUNCIONES DE CONTROL DE ACCESO
// ============================================

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

        const insigniasUsuario = await obtenerInsigniasUsuario(user.uid);
        
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
    
    setTimeout(() => {
        mostrarInsigniasUsuarioEnPerfil();
    }, 1000);
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
    }
});

// ============================================
// EVENTOS AL CARGAR EL DOM
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    
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

    const paginaActual = window.location.pathname.split("/").pop();
    if (paginaActual !== 'login') {
        verificarAcceso();
    }
    
    aplicarEstilosInsignias();
});
