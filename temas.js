(function() {
    const themeSelect = document.getElementById('themeSelect');
    const defaultTheme = 'naturaleza1'; // Define aquí el tema predeterminado
    const currentUrl = window.location.href;

    // Deshabilitar el botón al inicio
    themeSelect.disabled = true;

    // Cuando se carga la página
    window.addEventListener('load', () => {
        checkThemes();
        loadSelectedTheme();
        themeSelect.disabled = false;
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
            'theme1', 'theme2', 'space', 'starwars', 'jurassicworld', 'taylorswift', 'superheroes',
            'naturaleza1', 'naturaleza2', 'naturaleza3', 'naturaleza4', 'pokemon', 'thewildrobot',
            'httyd', 'gstudios1', 'gstudios2', 'gstudios3', 'gstudios4'
        ];

        elements.forEach(element => {
            themeClasses.forEach(cls => element.classList.remove(cls));
            if (theme !== 'default') {
                element.classList.add(theme);
            }
        });
    }

    function loadSelectedTheme() {
        const selectedTheme = localStorage.getItem('selectedTheme');
        const themesAvailability = checkThemesAvailability();
        
        if (selectedTheme && (themesAvailability[selectedTheme] || currentUrl === 'https://grouvex.com/temas')) {
            changeTheme(selectedTheme);
            themeSelect.value = selectedTheme;
        } else {
            changeTheme(defaultTheme);
            themeSelect.value = defaultTheme;
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
            starwars: !(date >= new Date(date.getFullYear(), 4, 4) && date <= new Date(date.getFullYear(), 4, 14)),
            httyd: !(date >= new Date(date.getFullYear(), 2, 25) && date <= new Date(date.getFullYear(), 3, 1)),
            jurassicworld: !(date >= new Date(date.getFullYear(), 5, 10) && date <= new Date(date.getFullYear(), 5, 20)),
            taylorswift: !(date >= new Date(date.getFullYear(), 11, 13) && date <= new Date(date.getFullYear(), 11, 23)),
            pokemon: !(date >= new Date(date.getFullYear(), 1, 21) && date <= new Date(date.getFullYear(), 1, 27)),
            thewildrobot: !(date >= new Date(date.getFullYear(), 8, 27) && date <= new Date(date.getFullYear(), 9, 18))
        };
    }
})();
