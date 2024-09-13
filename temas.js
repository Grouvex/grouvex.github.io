window.addEventListener('load', function() {
    // Llama a todas las funciones que quieres ejecutar cuando se carga la página
    checkThemes();
});

function checkThemes() {
    const date = new Date();
    const month = date.getMonth();

    // Superhéroes
    if (month == 0) {
        toggleThemeOption('superheroes', false);
    } else {
        toggleThemeOption('superheroes', true);
    }

    // Naturaleza 1
    if (month == 1) {
        toggleThemeOption('naturaleza1', false);
    } else {
        toggleThemeOption('naturaleza1', true);
    }

    // Naturaleza 2
    if (month == 2) {
        toggleThemeOption('naturaleza2', false);
    } else {
        toggleThemeOption('naturaleza2', true);
    }

    // Naturaleza 3
    if (month == 3) {
        toggleThemeOption('naturaleza3', false);
    } else {
        toggleThemeOption('naturaleza3', true);
    }

    // Naturaleza 4
    if (month == 4) {
        toggleThemeOption('naturaleza4', false);
    } else {
        toggleThemeOption('naturaleza4', true);
    }
// GStudios1
    if (true == true) {
        toggleThemeOption('gstudios1', false);
    } else {
        toggleThemeOption('gstudios1', true);
    }
    // Star Wars
    const startStarWarsWeek = new Date(date.getFullYear(), 4, 4);
    const endStarWarsWeek = new Date(date.getFullYear(), 4, 14);
    if (date >= startStarWarsWeek && date <= endStarWarsWeek) {
        toggleThemeOption('starwars', false);
    } else {
        toggleThemeOption('starwars', true);
    }

// HTTYD 
    const startHTTYDWeek = new Date(date.getFullYear(), 4, 4);
    const endHTTYDWeek = new Date(date.getFullYear(), 4, 14);
    if (date >= startHTTYDWeek && date <= endHTTYDWeek) {
        toggleThemeOption('httyd', false);
    } else {
        toggleThemeOption('httyd', true);
    }

    // Jurassic World
    const startJurassicWorldWeek = new Date(date.getFullYear(), 5, 10);
    const endJurassicWorldWeek = new Date(date.getFullYear(), 5, 20);
    if (date >= startJurassicWorldWeek && date <= endJurassicWorldWeek) {
        toggleThemeOption('jurassicworld', false);
    } else {
        toggleThemeOption('jurassicworld', true);
    }

    // Taylor Swift
    const startTaylorSwiftWeek = new Date(date.getFullYear(), 11, 13);
    const endTaylorSwiftWeek = new Date(date.getFullYear(), 11, 23);
    if (date >= startTaylorSwiftWeek && date <= endTaylorSwiftWeek) {
        toggleThemeOption('taylorswift', false);
    } else {
        toggleThemeOption('taylorswift', true);
    }
}

function toggleThemeOption(theme, hide) {
    const option = document.querySelector(`#themeSelect option[value="${theme}"]`);
    if (option) {
        if (hide) {
            option.classList.add('hiddenOption');
        } else {
            option.classList.remove('hiddenOption');
        }
    }
}


var themeSelect = document.getElementById('themeSelect');

// Cuando se cambia el tema
themeSelect.addEventListener('change', function() {
    // Obtiene todos los elementos a los que se les aplicará el cambio de tema
    var elements = document.querySelectorAll('p, body, main, mainTop, h1, h2, h3, h4, h5, h6, article, section, aside, panel');

    // Elimina las clases de las opciones antiguas
    elements.forEach(function(element) {
        element.classList.remove('theme1', 'theme2', 'space', 'starwars', 'jurassicworld', 'taylorswift', 'superheroes', 'naturaleza1', 'naturaleza2', 'naturaleza3', 'naturaleza4', 'pokemon', 'gstudios1', 'httyd');
    });

    // Si la opción seleccionada no es "default", añade la clase de la opción seleccionada
    if (this.value !== 'default') {
        elements.forEach(function(element) {
            element.classList.add(this.value);
        }.bind(this));
    }

    // Guarda la selección del usuario en el almacenamiento local
    localStorage.setItem('selectedTheme', this.value);
});

// Cuando se carga la página
window.addEventListener('load', function() {
    // Obtiene la selección del usuario del almacenamiento local
    var selectedTheme = localStorage.getItem('selectedTheme');

    // Si hay una selección guardada y no es "default", aplica el tema seleccionado
    if (selectedTheme && selectedTheme !== 'gstudios') {
        var elements = document.querySelectorAll('p, body, main, mainTop, h1, h2, h3, h4, h5, h6, article, section, aside, panel');
        elements.forEach(function(element) {
            element.classList.add(selectedTheme);
        });
        themeSelect.value = selectedTheme; // Asegúrate de que el menú desplegable muestre el tema correcto
    }
});
