(function() {
    'use strict';

    // ============================================
    // CONFIGURACIÓN
    // ============================================
    const CONFIG = {
        defaultTheme: 'theme-gstudios8',
        animationDuration: 500,
        storageKey: 'selectedTheme',
        selectId: 'themeSelect',
        resetId: 'predeterminado'
    };

    // ============================================
    // DEFINICIÓN DE TEMAS
    // ============================================
    const TEMAS = {
        // Temas por mes (disponibles todo el año)
        mensuales: {
            'theme-superheroes': 0,   // Enero
            'theme-naturaleza1': 1,   // Febrero
            'theme-naturaleza2': 2,   // Marzo
            'theme-naturaleza3': 3,   // Abril
            'theme-naturaleza4': 4,   // Mayo
            'theme-gstudios1': 8,     // Septiembre
            'theme-gstudios2': 0,     // Enero
            'theme-gstudios4': 10,    // Noviembre
            'theme-gstudios5': 9,     // Octubre
            'theme-gstudios6': 6      // Julio
        },
        
        // Temas por rango de fechas
        rangos: {
            'theme-gstudios3': { start: [11, 1], end: [0, 7] },        // 1 Dic - 7 Ene
            'theme-gstudios7': { start: [5, 1], end: [9, 31] },        // 1 Jun - 31 Oct
            'theme-gstudios8': { start: [4, 1], end: [6, 31] },        // 1 May - 31 Jul
            'theme-starwars': { start: [4, 4], end: [4, 14] },         // 4-14 May
            'theme-httyd': { start: [2, 25], end: [3, 1] },            // 25 Mar - 1 Abr
            'theme-jurassicworld': { start: [5, 10], end: [5, 20] },   // 10-20 Jun
            'theme-taylorswift': { start: [11, 13], end: [11, 23] },   // 13-23 Dic
            'theme-pokemon': { start: [1, 21], end: [1, 27] },         // 21-27 Feb
            'theme-thewildrobot': { start: [8, 27], end: [9, 18] },    // 27 Sep - 18 Oct
            'theme-wicked': { start: [10, 20], end: [10, 31] }         // 20-31 Nov
        }
    };

    // ============================================
    // LISTA COMPLETA DE TEMAS (para limpieza)
    // ============================================
    const ALL_THEMES = [
        'theme-theme1', 'theme-theme2', 'theme-space',
        ...Object.keys(TEMAS.mensuales),
        ...Object.keys(TEMAS.rangos)
    ];

    // ============================================
    // UTILIDADES
    // ============================================
    const Utils = {
        // Obtener fecha actual
        getNow: () => new Date(),
        
        // Crear fecha con año actual
        getDate: (month, day) => {
            const now = new Date();
            return new Date(now.getFullYear(), month, day);
        },

        // Verificar si fecha está en rango
        isDateInRange: (startMonth, startDay, endMonth, endDay) => {
            const now = new Date();
            const start = new Date(now.getFullYear(), startMonth, startDay);
            const end = new Date(now.getFullYear(), endMonth, endDay);
            
            // Manejar rangos que cruzan año nuevo
            if (start > end) {
                return now >= start || now <= end;
            }
            return now >= start && now <= end;
        },

        // Obtener elementos afectados por el tema
        getTargetElements: () => {
            const selectors = [
                'p', 'body', 'main', 'mainTop',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'article', 'section', 'aside', 'panel', 'hr'
            ];
            return document.querySelectorAll(selectors.join(','));
        },

        // Aplicar animación fade
        applyFadeEffect: (elements, duration) => {
            elements.forEach(el => el.classList.add('fade-effect'));
            
            return new Promise(resolve => {
                setTimeout(() => {
                    elements.forEach(el => el.classList.remove('fade-effect'));
                    resolve();
                }, duration);
            });
        }
    };

    // ============================================
    // GESTOR DE TEMAS
    // ============================================
    const ThemeManager = {
        // Verificar disponibilidad de temas
        getAvailableThemes: () => {
            const available = {};
            const now = Utils.getNow();
            const month = now.getMonth();

            // Temas mensuales
            Object.entries(TEMAS.mensuales).forEach(([theme, mes]) => {
                available[theme] = month !== mes;
            });

            // Temas por rango
            Object.entries(TEMAS.rangos).forEach(([theme, range]) => {
                const [startMonth, startDay] = range.start;
                const [endMonth, endDay] = range.end;
                available[theme] = !Utils.isDateInRange(startMonth, startDay, endMonth, endDay);
            });

            return available;
        },

        // Cambiar tema
        changeTheme: (theme) => {
            const elements = Utils.getTargetElements();
            
            // Aplicar animación
            Utils.applyFadeEffect(elements, CONFIG.animationDuration);

            // Limpiar temas anteriores y aplicar nuevo
            elements.forEach(element => {
                ALL_THEMES.forEach(cls => element.classList.remove(cls));
                element.classList.add(theme);
            });
        },

        // Guardar tema seleccionado
        saveTheme: (theme) => {
            localStorage.setItem(CONFIG.storageKey, theme);
        },

        // Obtener tema guardado
        getSavedTheme: () => {
            return localStorage.getItem(CONFIG.storageKey);
        },

        // Cargar tema
        loadTheme: (theme) => {
            const available = ThemeManager.getAvailableThemes();
            
            if (!theme || !available[theme]) {
                theme = CONFIG.defaultTheme;
            }
            
            ThemeManager.changeTheme(theme);
            return theme;
        }
    };

    // ============================================
    // INTERFAZ DE USUARIO
    // ============================================
    const UI = {
        // Elementos
        select: null,
        resetBtn: null,

        // Inicializar
        init: () => {
            UI.select = document.getElementById(CONFIG.selectId);
            UI.resetBtn = document.getElementById(CONFIG.resetId);
            
            if (!UI.select || !UI.resetBtn) {
                console.error('Elementos UI no encontrados');
                return;
            }

            // Deshabilitar select mientras carga
            UI.select.disabled = true;

            // Event listeners
            UI.select.addEventListener('change', UI.handleThemeChange);
            UI.resetBtn.addEventListener('click', UI.handleReset);

            // Cargar temas iniciales
            window.addEventListener('DOMContentLoaded', UI.loadInitialThemes);
        },

        // Cargar temas iniciales
        loadInitialThemes: () => {
            const available = ThemeManager.getAvailableThemes();
            
            // Ocultar/mostrar opciones
            Object.entries(available).forEach(([theme, isAvailable]) => {
                UI.toggleOption(theme, !isAvailable);
            });

            // Cargar tema guardado o predeterminado
            const savedTheme = ThemeManager.getSavedTheme();
            const themeToLoad = ThemeManager.loadTheme(savedTheme);
            UI.select.value = themeToLoad;
            UI.select.disabled = false;
        },

        // Mostrar/ocultar opción
        toggleOption: (theme, hide) => {
            const option = UI.select?.querySelector(`option[value="${theme}"]`);
            if (option) {
                option.classList.toggle('hiddenOption', hide);
            }
        },

        // Manejar cambio de tema
        handleThemeChange: (event) => {
            const theme = event.target.value;
            ThemeManager.changeTheme(theme);
            ThemeManager.saveTheme(theme);
        },

        // Manejar reset
        handleReset: () => {
            localStorage.removeItem(CONFIG.storageKey);
            ThemeManager.changeTheme(CONFIG.defaultTheme);
            UI.select.value = CONFIG.defaultTheme;
        }
    };

    // ============================================
    // INICIALIZACIÓN
    // ============================================
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', UI.init);
    } else {
        UI.init();
    }

})();
