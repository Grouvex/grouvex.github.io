function actualizarFechas(uTParam, elementoId, opciones = {}) {
    // 1. Inyección de estilos CSS encapsulados
    if (!document.getElementById('gs-timeafechas-styles')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'gs-timeafechas-styles';
        styleTag.textContent = `
            .gs-timeafechas-base {
                transition: opacity 0.8s ease, transform 0.8s ease;
                opacity: 1;
                display: inline-block;
            }
            .gs-timeafechas-proxima {
                background-color: #fff3cd;
                color: #856404;
                border: 1px solid #ffeeba;
                padding: 4px 8px;
                border-radius: 4px;
            }
            .gs-timeafechas-urgente {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
                font-weight: bold;
                padding: 4px 8px;
                border-radius: 4px;
                animation: gs-timeafechas-parpadeo 1.5s infinite;
            }
            .gs-timeafechas-en-progreso {
                background-color: #d1e7dd;
                color: #0f5132;
                border: 1px solid #badbcc;
                font-weight: bold;
                padding: 4px 8px;
                border-radius: 4px;
            }
            .gs-timeafechas-expirada {
                color: #6c757d;
                background-color: #e2e3e5;
                padding: 4px 8px;
                border-radius: 4px;
                text-decoration: line-through;
            }
            .gs-timeafechas-ocultar {
                opacity: 0 !important;
                transform: translateY(-10px);
                pointer-events: none;
            }
            @keyframes gs-timeafechas-parpadeo {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
        `;
        document.head.appendChild(styleTag);
    }

    try {
        // Obtener el elemento DOM
        const elemento = typeof elementoId === 'string' 
            ? document.getElementById(elementoId) 
            : elementoId;

        if (!elemento) throw new Error(`Elemento "${elementoId}" no encontrado.`);

        // LECTURA DE ATRIBUTOS HTML CON FALLBACK A LAS OPCIONES JS
        const tipo = elemento.getAttribute('tipo') || opciones.tipo || 'evento';
        const rawUt = elemento.getAttribute('ut') || uTParam;
        const rawUtFin = elemento.getAttribute('ut-fin') || opciones.uTFin || null;
        const locale = elemento.getAttribute('locale') || opciones.locale || 'es-ES';
        const timeZone = elemento.getAttribute('timezone') || opciones.timeZone || 'UTC';
        const formato = elemento.getAttribute('formato') || opciones.formato || 'compact';

        // Auto-refresh por defecto a TRUE salvo que explícitamente se configure en false
        const autoRefresh = elemento.hasAttribute('auto-refresh') 
            ? elemento.getAttribute('auto-refresh') !== 'false' 
            : (opciones.autoRefresh ?? true);

        const txtF = elemento.getAttribute('text-time-f') || opciones.textTimeF || 'Faltan {tiempo}';
        const txtA = elemento.getAttribute('text-time-a') || opciones.textTimeA || 'En curso ({tiempo} restantes)';
        const txtP = elemento.getAttribute('text-time-p') || opciones.textTimeP || 'Finalizado hace {tiempo}';

        // ACCESIBILIDAD
        elemento.classList.add('gs-timeafechas-base');
        elemento.setAttribute('role', 'timer');
        elemento.setAttribute('aria-live', 'polite');

        // Normalizador de timestamps
        const normalizarMs = (val) => {
            if (!val) return null;
            if (val instanceof Date) return val.getTime();
            if (typeof val === 'string' && !isNaN(Number(val))) val = Number(val);
            if (typeof val === 'string') return new Date(val).getTime();
            return val < 1e11 ? val * 1000 : val;
        };

        const uTInicioMs = normalizarMs(rawUt);
        const uTFinMs = normalizarMs(rawUtFin);

        if (isNaN(uTInicioMs)) throw new Error('Timestamp de inicio inválido.');
        if (uTFinMs && isNaN(uTFinMs)) throw new Error('Timestamp de fin inválido.');

        // Desglose de tiempo
        const desglosarTiempo = (ms) => {
            const difSeg = Math.floor(Math.abs(ms) / 1000);
            const seg = difSeg % 60;
            const min = Math.floor(difSeg / 60) % 60;
            const h = Math.floor(difSeg / 3600) % 24;
            const d = Math.floor(difSeg / 86400) % 30;
            const m = Math.floor(difSeg / (86400 * 30.44)) % 12;
            const a = Math.floor(difSeg / (86400 * 365.25));

            const partes = [];
            if (formato === 'verbose') {
                if (a > 0) partes.push(`${a} año${a > 1 ? 's' : ''}`);
                if (m > 0) partes.push(`${m} mes${m > 1 ? 'es' : ''}`);
                if (d > 0) partes.push(`${d} día${d > 1 ? 's' : ''}`);
                partes.push(`${h}h`, `${min}m`, `${seg}s`);
                return partes.join(', ');
            } else {
                if (a > 0) partes.push(`${a}a`);
                if (m > 0) partes.push(`${m}m`);
                if (d > 0) partes.push(`${d}d`);
                partes.push(`${h}h`, `${min}m`, `${seg}s`);
                return partes.join(' ');
            }
        };

        // Formateador nativo de fecha legible
        const formatearFechaNativa = (timestamp) => {
            const fecha = new Date(timestamp);
            return new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'medium',
                timeZone
            }).format(fecha);
        };

        // Renderizado principal
        const render = () => {
            const ahoraMs = Date.now();

            if (tipo === 'fecha') {
                elemento.textContent = formatearFechaNativa(uTInicioMs);
                elemento.title = `Fecha: ${new Date(uTInicioMs).toISOString()} (${timeZone})`;
                return true; // Continúa activo para refresco si autoRefresh está activo
            }

            const timestampReferenciaFin = uTFinMs || uTInicioMs;
            const difDiasFin = (timestampReferenciaFin - ahoraMs) / (1000 * 60 * 60 * 24);

            // REGLA DE OCULTACIÓN Y ELIMINACIÓN PARA EVENTOS DE MÁS DE 2 DÍAS DE VENCIDOS
            if (tipo === 'evento' && difDiasFin <= -2) {
                if (!elemento.classList.contains('gs-timeafechas-ocultar')) {
                    elemento.classList.add('gs-timeafechas-ocultar');
                    setTimeout(() => { elemento.style.display = 'none'; }, 800);
                }
                if (elemento._fechaInterval) clearInterval(elemento._fechaInterval);
                return false; // Cancela el intervalo definitivamente
            }

            elemento.classList.remove(
                'gs-timeafechas-proxima', 
                'gs-timeafechas-urgente', 
                'gs-timeafechas-en-progreso',
                'gs-timeafechas-expirada',
                'gs-timeafechas-ocultar'
            );
            elemento.style.display = '';

            const fechaInicioStr = formatearFechaNativa(uTInicioMs);
            elemento.title = `Fecha inicio: ${new Date(uTInicioMs).toISOString()} (${timeZone})`;

            // Futuro
            if (ahoraMs < uTInicioMs) {
                const difMs = uTInicioMs - ahoraMs;
                const difDias = difMs / (1000 * 60 * 60 * 24);

                if (tipo === 'evento') {
                    if (difDias > 1 && difDias <= 5) elemento.classList.add('gs-timeafechas-proxima');
                    else if (difDias <= 1) elemento.classList.add('gs-timeafechas-urgente');
                }

                elemento.textContent = `${fechaInicioStr} ¦ ${txtF.replace('{tiempo}', desglosarTiempo(difMs))}`;
                return true;
            }

            // Presente (En progreso)
            if (uTFinMs && ahoraMs >= uTInicioMs && ahoraMs <= uTFinMs) {
                if (tipo === 'evento') elemento.classList.add('gs-timeafechas-en-progreso');

                elemento.textContent = `${fechaInicioStr} ¦ ${txtA.replace('{tiempo}', desglosarTiempo(uTFinMs - ahoraMs))}`;
                return true;
            }

            // Pasado
            if (tipo === 'evento') elemento.classList.add('gs-timeafechas-expirada');

            elemento.textContent = `${fechaInicioStr} ¦ ${txtP.replace('{tiempo}', desglosarTiempo(ahoraMs - timestampReferenciaFin))}`;

            if (opciones.onExpire && !elemento.dataset.expired) {
                elemento.dataset.expired = "true";
                opciones.onExpire(elemento);
            }

            return true;
        };

        const activo = render();

        if (autoRefresh && activo) {
            if (elemento._fechaInterval) clearInterval(elemento._fechaInterval);
            elemento._fechaInterval = setInterval(() => {
                const continua = render();
                if (!continua) clearInterval(elemento._fechaInterval);
            }, 1000);
        }

    } catch (error) {
        console.error('Error en actualizarFechas:', error);
    }
}
