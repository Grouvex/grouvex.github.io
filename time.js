function actualizarFechas(uT, elementoId) {
    try {
        const elemento = document.getElementById(elementoId);
        const f = new Date(uT * 1000).toUTCString();
        if (uT >= Math.floor(Date.now() / 1000)) {
            const fUT = Math.floor(Date.now() / 1000);
            const diferencia = uT - fUT;
            const seg = diferencia % 60;const min = Math.floor((diferencia / 60) % 60);const h = Math.floor((diferencia / 3600) % 24);const d = Math.floor(diferencia / 86400);const m = Math.floor(d / 30.24);const a = Math.floor(d / 365.44);
            const f1 = `(${a} year(s), ${m} month(s), ${d}d, ${h}h, ${min}m y ${seg}s left)`;
            elemento.textContent = `${f} ¦ ${f1}`;
        } else {
            elemento.textContent = f;
        }
    } catch (error) {
        console.error('Error al actualizar las fechas:', error);
    }
}
