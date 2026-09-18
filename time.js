(function () {
    // 1. Inyección de estilos CSS encapsulados
    function inyectarEstilos() {
        if (document.getElementById('gs-timeafechas-styles')) return;
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

    // 2. Función lógica principal por cada elemento
    function procesarElemento(elemento) {
        if (elemento._gsIniciado) return; // Evita duplicar intervalos
        elemento._gsIniciado = true;

        const tipo = elemento.getAttribute('tipo') || 'evento';
        const rawUt = elemento.getAttribute('ut');
        const rawUtFin = elemento.getAttribute('ut-fin');
        const locale = elemento.getAttribute('locale') || 'es-ES';
        const timeZone = elemento.getAttribute('timezone') || 'UTC';
        const formato = elemento.getAttribute('formato') || 'compact';
        const autoRefresh = elemento.getAttribute('auto-refresh') !== 'false';

        const txtF = elemento.getAttribute('text-time-f') || 'Faltan {tiempo}';
        const txtA = elemento.getAttribute('text-time-a') || 'En curso ({tiempo} restantes)';
        const txtP = elemento.getAttribute('text-time-p') || 'Finalizado hace {tiempo}';

        elemento.classList.add('gs-timeafechas-base');
        elemento.setAttribute('role', 'timer');
        elemento.setAttribute('aria-live', 'polite');

        const normalizarMs = (val) => {
            if (!val) return null;
            if (val instanceof Date) return val.getTime();
            if (typeof val === 'string' && !isNaN(Number(val))) val = Number(val);
            if (typeof val === 'string') return new Date(val).getTime();
            return val < 1e11 ? val * 1000 : val;
        };

        const uTInicioMs = normalizarMs(rawUt);
        const uTFinMs = normalizarMs(rawUtFin);

        if (isNaN(uTInicioMs)) return;

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

        const formatearFechaNativa = (timestamp) => {
            return new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'medium',
                timeZone
            }).format(new Date(timestamp));
        };

        const render = () => {
            const ahoraMs = Date.now();

            if (tipo === 'fecha') {
                elemento.textContent = formatearFechaNativa(uTInicioMs);
                elemento.title = `Fecha: ${new Date(uTInicioMs).toISOString()} (${timeZone})`;
                return true;
            }

            const timestampReferenciaFin = uTFinMs || uTInicioMs;
            const difDiasFin = (timestampReferenciaFin - ahoraMs) / (1000 * 60 * 60 * 24);

            // Regla de ocultación para eventos caducados hace más de 2 días
            if (tipo === 'evento' && difDiasFin <= -2) {
                if (!elemento.classList.contains('gs-timeafechas-ocultar')) {
                    elemento.classList.add('gs-timeafechas-ocultar');
                    setTimeout(() => { elemento.style.display = 'none'; }, 800);
                }
                if (elemento._fechaInterval) clearInterval(elemento._fechaInterval);
                return false;
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
            return true;
        };

        const activo = render();

        if (autoRefresh && activo) {
            elemento._fechaInterval = setInterval(() => {
                const continua = render();
                if (!continua) clearInterval(elemento._fechaInterval);
            }, 1000);
        }
    }

    // 3. Escáner automático de elementos en la página
    function escanear() {
        inyectarEstilos();
        // Selecciona todos los spans que tengan atributo 'ut' o la clase 'gs-fecha'
        const elementos = document.querySelectorAll('span[ut], .gs-fecha');
        elementos.forEach(procesarElemento);
    }

    // Auto-ejecución al cargar el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', escanear);
    } else {
        escanear();
    }

    // Observer para procesar elementos que se añadan dinámicamente más tarde
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.matches && (node.matches('span[ut]') || node.matches('.gs-fecha'))) {
                        procesarElemento(node);
                    }
                    if (node.querySelectorAll) {
                        node.querySelectorAll('span[ut], .gs-fecha').forEach(procesarElemento);
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
