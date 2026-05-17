function actualizarFechas(uT, elementoId) {
    try {const elemento = document.getElementById(elementoId);if (!elemento) {throw new Error(`Elemento con ID ${elementoId} no encontrado.`);}
        const fechaActual = Math.floor(Date.now() / 1000); // Timestamp actual en segundos
        const fechaUT = new Date(uT * 1000).toUTCString(); // Convertir uT a fecha legible
        if (uT >= fechaActual) {const diferencia = uT - fechaActual;const seg = diferencia % 60;const min = Math.floor((diferencia / 60) % 60);const h = Math.floor((diferencia / 3600) % 24);const d = Math.floor(diferencia / 86400);const m = Math.floor(d / 30.44);const a = Math.floor(d / 365.25);const tiempoRestante = `(${a} año(s), ${m} mes(es), ${d}d, ${h}h, ${min}m y ${seg}s restantes)`;elemento.textContent = `${fechaUT} ¦ ${tiempoRestante}`;
        } else {elemento.textContent = fechaUT;}
    } catch (error) {console.error('Error al actualizar las fechas:', error);}
} 
