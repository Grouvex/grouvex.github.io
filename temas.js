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
        mensuales: {
            'theme-superheroes': 0,
            'theme-naturaleza1': 1,
            'theme-naturaleza2': 2,
            'theme-naturaleza3': 3,
            'theme-naturaleza4': 4,
            'theme-gstudios1': 8,
            'theme-gstudios2': 0,
            'theme-gstudios4': 10,
            'theme-gstudios5': 9,
            'theme-gstudios6': 6
        },
        rangos: {
            'theme-gstudios3': { start: [11, 1], end: [0, 7] },
            'theme-gstudios7': { start: [5, 1], end: [9, 31] },
            'theme-gstudios8': { start: [4, 1], end: [6, 31] },
            'theme-starwars': { start: [4, 4], end: [4, 14] },
            'theme-httyd': { start: [2, 25], end: [3, 1] },
            'theme-jurassicworld': { start: [5, 10], end: [5, 20] },
            'theme-taylorswift': { start: [11, 13], end: [11, 23] },
            'theme-pokemon': { start: [1, 21], end: [1, 27] },
            'theme-thewildrobot': { start: [8, 27], end: [9, 18] },
            'theme-wicked': { start: [10, 20], end: [10, 31] }
        }
    };

    const ALL_THEMES = [
        'theme-theme1', 'theme-theme2', 'theme-space',
        ...Object.keys(TEMAS.mensuales),
        ...Object.keys(TEMAS.rangos)
    ];

    // ============================================
    // UTILIDADES
    // ============================================
    const Utils = {
        getNow: () => new Date(),
        
        getDate: (month, day) => {
            const now = new Date();
            return new Date(now.getFullYear(), month, day);
        },

        isDateInRange: (startMonth, startDay, endMonth, endDay) => {
            const now = new Date();
            const start = new Date(now.getFullYear(), startMonth, startDay);
            const end = new Date(now.getFullYear(), endMonth, endDay);
            
            if (start > end) {
                return now >= start || now <= end;
            }
            return now >= start && now <= end;
        },

        getTargetElements: () => {
            const selectors = [
                'p', 'body', 'main', 'mainTop',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'article', 'section', 'aside', 'panel', 'hr'
            ];
            return document.querySelectorAll(selectors.join(','));
        },

        applyFadeEffect: (elements, duration) => {
            if (!elements || elements.length === 0) return Promise.resolve();
            
            elements.forEach(el => {
                if (el) el.classList.add('fade-effect');
            });
            
            return new Promise(resolve => {
                setTimeout(() => {
                    elements.forEach(el => {
                        if (el) el.classList.remove('fade-effect');
                    });
                    resolve();
                }, duration);
            });
        },

        // ⭐ NUEVO: Logger seguro
        log: (message, type = 'log') => {
            if (typeof console !== 'undefined' && console[type]) {
                console[type](`[ThemeSystem] ${message}`);
            }
        },

        // ⭐ NUEVO: Verificar si el elemento existe
        elementExists: (element) => {
            return element !== null && element !== undefined;
        }
    };

    // ============================================
    // GESTOR DE TEMAS
    // ============================================
    const ThemeManager = {
        getAvailableThemes: () => {
            const available = {};
            const now = Utils.getNow();
            const month = now.getMonth();

            try {
                Object.entries(TEMAS.mensuales).forEach(([theme, mes]) => {
                    available[theme] = month !== mes;
                });

                Object.entries(TEMAS.rangos).forEach(([theme, range]) => {
                    const [startMonth, startDay] = range.start;
                    const [endMonth, endDay] = range.end;
                    available[theme] = !Utils.isDateInRange(startMonth, startDay, endMonth, endDay);
                });
            } catch (error) {
                Utils.log('Error al obtener temas disponibles: ' + error.message, 'error');
            }

            return available;
        },

        changeTheme: (theme) => {
            try {
                const elements = Utils.getTargetElements();
                
                if (!elements || elements.length === 0) {
                    Utils.log('No se encontraron elementos para aplicar el tema', 'warn');
                    return;
                }

                // Aplicar animación
                Utils.applyFadeEffect(elements, CONFIG.animationDuration);

                // Limpiar temas anteriores y aplicar nuevo
                elements.forEach(element => {
                    if (element) {
                        ALL_THEMES.forEach(cls => {
                            try {
                                element.classList.remove(cls);
                            } catch (e) {
                                // Ignorar errores individuales
                            }
                        });
                        try {
                            element.classList.add(theme);
                        } catch (e) {
                            Utils.log(`Error al añadir clase ${theme} a elemento`, 'error');
                        }
                    }
                });

                Utils.log(`Tema cambiado a: ${theme}`, 'log');
            } catch (error) {
                Utils.log('Error al cambiar tema: ' + error.message, 'error');
                // Fallback: intentar aplicar solo al body
                try {
                    document.body.classList.add(theme);
                } catch (e) {
                    // Si falla todo, al menos intentamos no romper la página
                }
            }
        },

        saveTheme: (theme) => {
            try {
                localStorage.setItem(CONFIG.storageKey, theme);
            } catch (error) {
                Utils.log('Error al guardar tema: ' + error.message, 'warn');
            }
        },

        getSavedTheme: () => {
            try {
                return localStorage.getItem(CONFIG.storageKey);
            } catch (error) {
                Utils.log('Error al obtener tema guardado: ' + error.message, 'warn');
                return null;
            }
        },

        loadTheme: (theme) => {
            try {
                const available = ThemeManager.getAvailableThemes();
                
                // Verificar si el tema es válido
                if (!theme || !available[theme]) {
                    Utils.log(`Tema "${theme}" no disponible, usando predeterminado`, 'warn');
                    theme = CONFIG.defaultTheme;
                }
                
                ThemeManager.changeTheme(theme);
                return theme;
            } catch (error) {
                Utils.log('Error al cargar tema: ' + error.message, 'error');
                // Fallback seguro
                ThemeManager.changeTheme(CONFIG.defaultTheme);
                return CONFIG.defaultTheme;
            }
        }
    };

    // ============================================
    // INTERFAZ DE USUARIO
    // ============================================
    const UI = {
        select: null,
        resetBtn: null,
        initialized: false,

        init: () => {
            try {
                // Verificar que el DOM existe
                if (!document || !document.getElementById) {
                    Utils.log('DOM no disponible', 'error');
                    return;
                }

                UI.select = document.getElementById(CONFIG.selectId);
                UI.resetBtn = document.getElementById(CONFIG.resetId);
                
                // ⭐ Verificar elementos con mensajes claros
                if (!UI.select) {
                    Utils.log(`⚠️ No se encontró el elemento con id "${CONFIG.selectId}"`, 'warn');
                }
                if (!UI.resetBtn) {
                    Utils.log(`⚠️ No se encontró el elemento con id "${CONFIG.resetId}"`, 'warn');
                }

                // Si no hay select, no podemos hacer nada
                if (!UI.select) {
                    Utils.log('❌ Elemento select no encontrado, el sistema no funcionará', 'error');
                    return;
                }

                // Deshabilitar select mientras carga
                UI.select.disabled = true;

                // Event listeners (solo si existen)
                if (UI.select) {
                    UI.select.addEventListener('change', UI.handleThemeChange);
                }
                if (UI.resetBtn) {
                    UI.resetBtn.addEventListener('click', UI.handleReset);
                }

                // Cargar temas iniciales
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', UI.loadInitialThemes);
                } else {
                    UI.loadInitialThemes();
                }

                UI.initialized = true;
                Utils.log('✅ Sistema de temas inicializado correctamente', 'log');

            } catch (error) {
                Utils.log('❌ Error en inicialización: ' + error.message, 'error');
                // Intentar recuperación mínima
                try {
                    if (document.body) {
                        document.body.classList.add(CONFIG.defaultTheme);
                    }
                } catch (e) {
                    // Si todo falla, al menos no rompemos la página
                }
            }
        },

        loadInitialThemes: () => {
            try {
                if (!UI.select) {
                    Utils.log('Select no disponible para cargar temas', 'warn');
                    return;
                }

                const available = ThemeManager.getAvailableThemes();
                
                // Ocultar/mostrar opciones
                Object.entries(available).forEach(([theme, isAvailable]) => {
                    UI.toggleOption(theme, !isAvailable);
                });

                // Cargar tema guardado o predeterminado
                const savedTheme = ThemeManager.getSavedTheme();
                const themeToLoad = ThemeManager.loadTheme(savedTheme);
                
                // Verificar que el valor existe en el select
                const optionExists = UI.select.querySelector(`option[value="${themeToLoad}"]`);
                if (optionExists) {
                    UI.select.value = themeToLoad;
                } else {
                    Utils.log(`Tema "${themeToLoad}" no existe en el select, usando predeterminado`, 'warn');
                    UI.select.value = CONFIG.defaultTheme;
                }
                
                UI.select.disabled = false;
                Utils.log('✅ Temas iniciales cargados', 'log');

            } catch (error) {
                Utils.log('Error al cargar temas iniciales: ' + error.message, 'error');
                if (UI.select) {
                    UI.select.disabled = false;
                }
            }
        },

        toggleOption: (theme, hide) => {
            try {
                if (!UI.select) return;
                
                const option = UI.select.querySelector(`option[value="${theme}"]`);
                if (option) {
                    option.classList.toggle('hiddenOption', hide);
                }
            } catch (error) {
                // Ignorar errores al ocultar opciones
            }
        },

        handleThemeChange: (event) => {
            try {
                if (!event || !event.target) return;
                
                const theme = event.target.value;
                if (!theme) {
                    Utils.log('Tema vacío seleccionado', 'warn');
                    return;
                }
                
                ThemeManager.changeTheme(theme);
                ThemeManager.saveTheme(theme);
            } catch (error) {
                Utils.log('Error al cambiar tema: ' + error.message, 'error');
            }
        },

        handleReset: () => {
            try {
                localStorage.removeItem(CONFIG.storageKey);
                ThemeManager.changeTheme(CONFIG.defaultTheme);
                if (UI.select) {
                    UI.select.value = CONFIG.defaultTheme;
                }
                Utils.log('Tema restablecido a predeterminado', 'log');
            } catch (error) {
                Utils.log('Error al restablecer tema: ' + error.message, 'error');
                // Fallback: intentar aplicar tema directamente
                try {
                    document.body.classList.add(CONFIG.defaultTheme);
                } catch (e) {
                    // Si falla, al menos no rompemos
                }
            }
        }
    };

    // ============================================
    // INICIALIZACIÓN
    // ============================================
    try {
        if (typeof document !== 'undefined' && document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', UI.init);
        } else {
            UI.init();
        }
    } catch (error) {
        // Error crítico - intentar recuperación mínima
        if (typeof console !== 'undefined') {
            console.error('Error crítico al iniciar sistema de temas:', error);
        }
        // Intentar aplicar tema predeterminado al body
        try {
            if (document && document.body) {
                document.body.classList.add(CONFIG.defaultTheme);
            }
        } catch (e) {
            // Si todo falla, silenciosamente ignorar
        }
    }

})();
