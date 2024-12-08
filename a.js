// Continuación de la configuración de Firebase y otras funcionalidades
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Ejemplo de estructura de datos de una pista
const tracks = [];

document.getElementById('add-track').addEventListener('click', () => {
    const trackNumber = tracks.length + 1;
    const trackData = {
        number: trackNumber,
        name: `Nombre de la Pista ${trackNumber} [Explícito]`,
        artist: 'Artista',
        role: 'Rol',
        isrc: 'ISRC'
    };
    tracks.push(trackData);
    updateTrackList();
});

function updateTrackList() {
    const trackList = document.getElementById('track-list');
    trackList.innerHTML = '';
    tracks.forEach(track => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${track.number}. ${track.name}</td>
            <td>${track.artist}</td>
            <td>${track.role}</td>
            <td>${track.isrc}</td>
            <td><button onclick="openAudioDetails(${track.number - 1})">Modificar</button></td>
        `;
        trackList.appendChild(row);
    });
    checkFormStatus();
}

function checkFormStatus() {
    const form = document.getElementById('lanzamiento-form');
    const inputs = form.querySelectorAll('input[required]');
    let allFilled = true;

    inputs.forEach(input => {
        if (!input.value) {
            allFilled = false;
        }
    });

    if (allFilled && tracks.length > 0) {
        document.getElementById('form-status').innerText = '✓';
        document.getElementById('submit-button').disabled = false;
        document.getElementById('enviar-formulario').disabled = false;
    } else {
        document.getElementById('form-status').innerText = '✗';
        document.getElementById('submit-button').disabled = true;
        document.getElementById('enviar-formulario').disabled = true;
    }
}

document.getElementById('lanzamiento-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const upc = document.getElementById('upc').value;
    const titulo = document.getElementById('titulo').value;
    const artistaPrincipal = document.getElementById('artista-principal').value;
    const generoPrincipal = document.getElementById('genero-principal').value;
    const label = document.getElementById('label').value;
    const cLine = document.getElementById('c-line').value;
    const pLine = document.getElementById('p-line').value;
    const releaseDate = document.getElementById('release-date').value;

    // Guardar los datos del lanzamiento en Firestore
    db.collection('lanzamientos').add({
        upc: upc,
        titulo: titulo,
        artistaPrincipal: artistaPrincipal,
        generoPrincipal: generoPrincipal,
        label: label,
        cLine: cLine,
        pLine: pLine,
        releaseDate: releaseDate,
        tracks: tracks
    }).then(() => {
        alert('Lanzamiento creado exitosamente');
        document.getElementById('lanzamiento-form').reset();
        // Limpiar la lista de pistas
        tracks.length = 0;
        updateTrackList();
    }).catch((error) => {
        console.error("Error al crear el lanzamiento: ", error);
    });
});

function openAudioDetails(trackIndex) {
    // Lógica para abrir la sección de detalles de audio con la pista seleccionada
    document.getElementById('detalles-audio-form').style.display = 'block';
    // Completar la información en el formulario de detalles de audio
    const track = tracks[trackIndex];
    document.getElementById('track-name').value = track.name;
    document.getElementById('artist-name').value = track.artist;
    // Rellenar otros campos según sea necesario
}

function toggleCompilationAlbum(value) {
    const artistRows = document.getElementById('artist-rows');
    if (value === 'yes') {
        document.getElementById('artist-name').value = 'Varios artistas';
        artistRows.style.display = 'none';
    } else {
        artistRows.style.display = 'block';
    }
}

function toggleLyricists(value) {
    const lyricistSection = document.getElementById('lyricist-section');
    if (value === 'yes') {
        lyricistSection.style.display = 'block';
    } else {
        lyricistSection.style.display = 'none';
    }
}

document.getElementById('add-composer-row').addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.classList.add('composer-row');
    newRow.innerHTML = `
        <label for="composer-name">Composer*</label>
        <input type="text" id="composer-name" name="composer-name" required>
        <button type="button" class="remove-composer-row">Eliminar</button>
    `;
    document.getElementById('composer-rows').appendChild(newRow);
});

document.getElementById('add-artist-row').addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.classList.add('artist-row');
    newRow.innerHTML = `
        <select name="artist-role">
            <option value="main">Main</option>
            <option value="featured">Featured</option>
            <!-- Agregar más roles según sea necesario -->
        </select>
        <input type="text" name="artist-name" required>
        <button type="button" class="remove-artist-row">Eliminar</button>
    `;
    document.getElementById('artist-rows').appendChild(newRow);
});

document.getElementById('add-lyricist-row').addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.classList.add('lyricist-row');
    newRow.innerHTML = `
        <label for="lyricist-name">Lyricist*</label>
        <input type="text" id="lyricist-name" name="lyricist-name" required>
        <button type="button" class="remove-lyricist-row">Eliminar</button>
    `;
    document.getElementById('lyricist-rows').appendChild(newRow);
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-composer-row')) {
        e.target.parentElement.remove();
    }
    if (e.target.classList.contains('remove-artist-row')) {
        e.target.parentElement.remove();
    }
    if (e.target.classList.contains('remove-lyricist-row')) {
        e.target.parentElement.remove();
    }
});

document.getElementById('album-details-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Guardar los detalles del álbum en los campos correspondientes
    document.getElementById('detalle-upc').innerText = document.getElementById('upc').value;
    document.getElementById('detalle-titulo').innerText = document.getElementById('titulo').value;
    document.getElementById('detalle-artista-principal').innerText = document.getElementById('artista-principal').value;
    document.getElementById('detalle-genero-principal').innerText = document.getElementById('genero-principal').value;
    document.getElementById('detalle-label').innerText = document.getElementById('label').value;
    document.getElementById('detalle-c-line').innerText = document.getElementById('c-line').value;
    document.getElementById('detalle-p-line').innerText = document.getElementById('p-line').value;
    document.getElementById('detalle-release-date').innerText = document.getElementById('release-date').value;
    // Cambiar el estado de los detalles del álbum a completado
    document.getElementById('detalles-album-status').innerText = '✓';
    document.getElementById('detalles-album-form').style.display = 'none';
    checkFormStatus();
});
