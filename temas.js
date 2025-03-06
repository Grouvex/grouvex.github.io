(function() {
    const themeSelect = document.getElementById('themeSelect');
    const defaultTheme = 'gstudios5'; // Define aquí el tema predeterminado
    const currentUrl = window.location.href;

    // Deshabilitar el botón al inicio
    themeSelect.disabled = true;

    // Cuando se carga la página
    window.addEventListener('load', () => {
        checkThemes();
        loadSelectedTheme();
        themeSelect.disabled = false;
    });

    // Función para restablecer el tema predeterminado
    document.getElementById('predeterminado').addEventListener('click', () => {
        localStorage.removeItem('selectedTheme'); // Elimina el tema guardado
        changeTheme(defaultTheme); // Cambia al tema predeterminado
        themeSelect.value = defaultTheme; // Actualiza el selector
    });

    function checkThemes() {
        const date = new Date();
        const month = date.getMonth();

        const themes = {
            superheroes: month !== 0,
            naturaleza1: month !== 1,
            naturaleza2: month !== 2,
            naturaleza3: month !== 3,
            naturaleza4: month !== 4,
            gstudios1: month !== 8,
            gstudios2: month !== 0,
            gstudios3: month !== 11,
            gstudios4: month !== 10,
            gstudios4: month !== 9,
            starwars: !(date >= new Date(date.getFullYear(), 4, 4) && date <= new Date(date.getFullYear(), 4, 14)),
            httyd: !(date >= new Date(date.getFullYear(), 2, 25) && date <= new Date(date.getFullYear(), 3, 1)),
            jurassicworld: !(date >= new Date(date.getFullYear(), 5, 10) && date <= new Date(date.getFullYear(), 5, 20)),
            taylorswift: !(date >= new Date(date.getFullYear(), 11, 13) && date <= new Date(date.getFullYear(), 11, 23)),
            pokemon: !(date >= new Date(date.getFullYear(), 1, 21) && date <= new Date(date.getFullYear(), 1, 27)),
            thewildrobot: !(date >= new Date(date.getFullYear(), 8, 27) && date <= new Date(date.getFullYear(), 9, 18))
        };

        Object.keys(themes).forEach(theme => toggleThemeOption(theme, themes[theme]));
    }

    function toggleThemeOption(theme, hide) {
        const option = document.querySelector(`#themeSelect option[value="${theme}"]`);
        if (option) {
            option.classList.toggle('hiddenOption', hide);
        }
    }

    themeSelect.addEventListener('change', function() {
        changeTheme(this.value);
        localStorage.setItem('selectedTheme', this.value);
    });

function changeTheme(theme) {
    const elements = document.querySelectorAll('p, body, main, mainTop, h1, h2, h3, h4, h5, h6, article, section, aside, panel, hr');
    const themeClasses = [
        'theme1', 'theme2',
        'space', 'naturaleza1', 'naturaleza2', 'naturaleza3', 'naturaleza4',
        'taylorswift',
        'pokemon', 'thewildrobot', 'httyd','starwars', 'jurassicworld', 'superheroes',
        'gstudios1', 'gstudios2', 'gstudios3', 'gstudios4', 'gstudios5'
    ];

    // Aplicar la clase de animación
    elements.forEach(element => {
        element.classList.add('fade-effect');
    });

    // Eliminar las clases de tema anteriores y aplicar la nueva
    elements.forEach(element => {
        themeClasses.forEach(cls => element.classList.remove(cls));
        if (theme !== defaultTheme) {
            element.classList.add(theme);
        } else {
            element.classList.add(theme);
        }
    });

    // Eliminar la clase de animación después de que termine
    setTimeout(() => {
        elements.forEach(element => {
            element.classList.remove('fade-effect');
        });
    }, 500); // Duración de la animación (0.5s)
}

    function loadSelectedTheme() {
        const selectedTheme = localStorage.getItem('selectedTheme');
        const themesAvailability = checkThemesAvailability();
        
        // Si no hay tema seleccionado o el tema seleccionado no está disponible, usa el predeterminado
        if (!selectedTheme || !themesAvailability[selectedTheme]) {
            changeTheme(defaultTheme);
            themeSelect.value = defaultTheme;
        } else {
            changeTheme(selectedTheme);
            themeSelect.value = selectedTheme;
        }
    }

    function checkThemesAvailability() {
        const date = new Date();
        const month = date.getMonth();

        return {
            superheroes: month !== 0,
            naturaleza1: month !== 1,
            naturaleza2: month !== 2,
            naturaleza3: month !== 3,
            naturaleza4: month !== 4,
            gstudios1: month !== 8,
            gstudios2: month !== 0,
            gstudios3: month !== 11,
            gstudios4: month !== 10,
            gstudios4: month !== 9,
            starwars: !(date >= new Date(date.getFullYear(), 4, 4) && date <= new Date(date.getFullYear(), 4, 14)),
            httyd: !(date >= new Date(date.getFullYear(), 2, 25) && date <= new Date(date.getFullYear(), 3, 1)),
            jurassicworld: !(date >= new Date(date.getFullYear(), 5, 10) && date <= new Date(date.getFullYear(), 5, 20)),
            taylorswift: !(date >= new Date(date.getFullYear(), 11, 13) && date <= new Date(date.getFullYear(), 11, 23)),
            pokemon: !(date >= new Date(date.getFullYear(), 1, 21) && date <= new Date(date.getFullYear(), 1, 27)),
            thewildrobot: !(date >= new Date(date.getFullYear(), 8, 27) && date <= new Date(date.getFullYear(), 9, 18))
        };
    }
})();
