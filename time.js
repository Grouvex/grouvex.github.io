function actualizarFechas(uT, elementoId) {if (uT <= Math.floor(Date.now() / 1000)){const f1 = new Date(uT * 1000).toUTCString();document.getElementById(elementoId).textContent = f1;
} else {const fUT = Math.floor(Date.now() / 1000);const diferencia = uT - fUT;const segundos = diferencia % 60;const minutos = Math.floor((diferencia / 60) % 60);const h = Math.floor((diferencia / 3600) % 24);const d = Math.floor(diferencia / 86400);const m = Math.floor(d / 30.24);const a = Math.floor(d / 365.44);const mng = new Date(uT * 1000).toUTCString();const f1 = `Start in: ${a} year, ${m} months, ${d}d, ${h}h, ${minutos}m y ${segundos}s. (Date: ${mng})`;document.getElementById(elementoId).textContent = f1;}}