// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAgoQ_Px3hHVrevUsyct_FBeXWMDKXpPSw",
      authDomain: "grouvex-studios.firebaseapp.com",
      databaseURL: "https://grouvex-studios-default-rtdb.firebaseio.com", // Asegúrate de incluir la URL de tu base de datos
      projectId: "grouvex-studios",
      storageBucket: "grouvex-studios.appspot.com",
      messagingSenderId: "1070842606062",
      appId: "1:1070842606062:web:5d887863048fd100b49eff",
      measurementId: "G-75BR8D2CR3"
};

// Inicialización de Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const tracks = [];
let albumDetails = {};
let imageDetails = {};
let storeDetails = {};

document.getElementById('add-track').addEventListener('click', () => {
    const trackNumber = tracks.length + 1;
    const trackData = {
        number: trackNumber,
        name: `Nombre de la Pista ${trackNumber} [Explícito]`,
        artist: 'Artista',
        role: 'Rol',
        isrc: 'ISRC',
        audioFile: null
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

    if (allFilled && tracks.length > 0 && albumDetails.title && imageDetails.file && storeDetails.selectedStores) {
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
        const language: document.getElementById('language').value;
        const title: document.getElementById('album-title').value;
        const version: document.getElementById('album-version').value;
        const compilation: document.getElementById('compilation-album').value;
        const artist: document.getElementById('artist-name').value;
        const primaryGenre: document.getElementById('primary-genre').value;
        const secondaryGenre: document.getElementById('secondary-genre').value;
        const compositionCopyrightYear: document.getElementById('composition-copyright-year').value;
        const compositionCopyright: document.getElementById('composition-copyright').value;
        const soundRecordingCopyrightYear: document.getElementById('sound-recording-copyright-year').value;
        const soundRecordingCopyright: document.getElementById('sound-recording-copyright').value;
        const recordLabelName: document.getElementById('record-label-name').value;
        const originallyReleased: document.getElementById('originally-released').value;
        const preOrderDate: document.getElementById('pre-order-date').value;
        const salesStartDate: document.getElementById('sales-start-date').value;
        const explicitContent: document.getElementById('explicit-content').value

  //    const upc = document.getElementById('upc').value;
  //    const titulo = document.getElementById('titulo').value;
  //    const artistaPrincipal = document.getElementById('artista-principal').value;
  //    const generoPrincipal = document.getElementById('genero-principal').value;
  //    const label = document.getElementById('label').value;
  //    const cLine = document.getElementById('c-line').value;
  //    const pLine = document.getElementById('p-line').value;
  //    const releaseDate = document.getElementById('release-date').value;

    // Guardar los datos del lanzamiento en Firestore
    db.collection('lanzamientos').add({
        upc: upc,
        title: title,
        artist: artist,
        primaryGenre: primaryGenre,
        secondaryGenre: secondaryGenre,
        compositionCopyrightYear: compositionCopyrightYear,
        compositionCopyright: compositionCopyright,
        soundRecordingCopyrightYear: soundRecordingCopyrightYear,
        soundRecordingCopyright: soundRecordingCopyright,
        recordLabelName: recordLabelName,
        tracks: tracks,
        originallyReleased: originallyReleased,
        preOrderDate: preOrderDate,
        salesStartDate: salesStartDate,
        explicitContent: explicitContent
    }).then(() => {
        alert('Lanzamiento creado exitosamente');
        document.getElementById('lanzamiento-form').reset();
        // Limpiar la lista de pistas
        tracks.length = 0;
        albumDetails = {};
        imageDetails = {};
        storeDetails = {};
        updateTrackList();
    }).catch((error) => {
        console.error("Error al crear el lanzamiento: ", error);
    });
});

function openAudioDetails(trackIndex) {
    // Crear una copia temporal de los datos de la pista 
      const track = { ...tracks[trackIndex] };
    // Lógica para abrir la sección de detalles de audio con la pista seleccionada
    document.getElementById('detalles-audio-form').style.display = 'block';

    // Completar la información en el formulario de detalles de audio
    const track = tracks[trackIndex];
    document.getElementById('track-number').value = track.number;
    document.getElementById('track-name').value = track.name;
    document.getElementById('title-version').value = track.titleVersion || '';
    
    // Indicar el nombre del archivo de audio
    const audioFileLabel = document.getElementById('audio-file-label');
    if (!audioFileLabel) {
        const newLabel = document.createElement('p');
        newLabel.id = 'audio-file-label';
        newLabel.innerText = track.audioFile ? `Current file: ${track.audioFile.name}` : 'No file selected';
        document.getElementById('audio-details-form').insertBefore(newLabel, document.getElementById('audio-file').nextSibling);
    } else {
        audioFileLabel.innerText = track.audioFile ? `Current file: ${track.audioFile.name}` : 'No file selected';
    }

    // Rellenar los artistas
    document.getElementById('audio-artist-rows').innerHTML = '';  // Limpiar filas actuales
    track.artists.forEach(artist => {
        const newRow = document.createElement('div');
        newRow.classList.add('audio-artist-row');
        newRow.innerHTML = `
            <select name="artist-role">
                <option value="main" ${artist.role === 'main' ? 'selected' : ''}>Main</option>
                <option value="featured" ${artist.role === 'featured' ? 'selected' : ''}>Featured</option>
                <!-- Agregar más roles según sea necesario -->
            </select>
            <input type="text" name="artist-name" value="${artist.name}" required>
            <button type="button" class="remove-artist-row">Eliminar</button>
        `;
        document.getElementById('audio-artist-rows').appendChild(newRow);
    });

    // Rellenar los compositores y letristas
    document.getElementById('audio-writer-rows').innerHTML = '';  // Limpiar filas actuales
    track.writers.forEach(writer => {
        const newRow = document.createElement('div');
        newRow.classList.add('audio-writer-row');
        newRow.innerHTML = `
            <select name="writer-role">
                <option value="composer" ${writer.role === 'composer' ? 'selected' : ''}>Composer</option>
                <option value="lyricist" ${writer.role === 'lyricist' ? 'selected' : ''}>Lyricist</option>
                <!-- Agregar más roles según sea necesario -->
            </select>
            <input type="text" name="writer-name" value="${writer.name}" required>
            <button type="button" class="remove-writer-row">Eliminar</button>
        `;
        document.getElementById('audio-writer-rows').appendChild(newRow);
    });

    document.getElementById('lyrics').value = track.containsLyrics ? 'yes' : 'no';
    toggleLyricists(track.containsLyrics ? 'yes' : 'no');

    // Rellenar los letristas si aplica
    if (track.containsLyrics) {
        document.getElementById('lyricist-rows').innerHTML = '';  // Limpiar filas actuales
        track.lyricists.forEach(lyricist => {
            const newRow = document.createElement('div');
            newRow.classList.add('lyricist-row');
            newRow.innerHTML = `
                <label for="lyricist-name">Lyricist*</label>
                <input type="text" id="lyricist-name" name="lyricist-name" value="${lyricist}" required>
                <button type="button" class="remove-lyricist-row">Eliminar</button>
            `;
            document.getElementById('lyricist-rows').appendChild(newRow);
        });
    }

    document.getElementById('primary-genre').value = track.primaryGenre;
    document.getElementById('secondary-genre').value = track.secondaryGenre;
    document.getElementById('explicit-content').value = track.explicitContent;
}

document.getElementById('audio-details-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Guardar los detalles de la pista en la lista de pistas
    const trackIndex = parseInt(document.getElementById('track-number').value, 10) - 1;
    const audioFile = document.getElementById('audio-file').files[0];
    if (tracks[trackIndex]) {
        tracks[trackIndex].name = document.getElementById('track-name').value;
        tracks[trackIndex].artist = document.getElementById('artist-name').value;
        tracks[trackIndex].audioFile = audioFile;
        // Guardar otros detalles según sea necesario
    }
    // Cambiar el estado de los detalles del audio a completado
    document.getElementById('detalles-audio-status').innerText = '✓';
    document.getElementById('detalles-audio-form').style.display = 'none';
    checkFormStatus();
});

document.getElementById('album-details-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Guardar los detalles del álbum en el objeto correspondiente
    albumDetails = {
        language: document.getElementById('language').value,
        title: document.getElementById('album-title').value,
        version: document.getElementById('album-version').value,
        compilation: document.getElementById('compilation-album').value,
        artist: document.getElementById('artist-name').value,
        primaryGenre: document.getElementById('primary-genre').value,
        secondaryGenre: document.getElementById('secondary-genre').value,
        compositionCopyrightYear: document.getElementById('composition-copyright-year').value,
        compositionCopyright: document.getElementById('composition-copyright').value,
        soundRecordingCopyrightYear: document.getElementById('sound-recording-copyright-year').value,
        soundRecordingCopyright: document.getElementById('sound-recording-copyright').value,
        recordLabelName: document.getElementById('record-label-name').value,
        originallyReleased: document.getElementById('originally-released').value,
        preOrderDate: document.getElementById('pre-order-date').value,
        salesStartDate: document.getElementById('sales-start-date').value,
        explicitContent: document.getElementById('explicit-content').value
    };
    // Cambiar el estado de los detalles del álbum a completado
    document.getElementById('detalles-album-status').innerText = '✓';
    document.getElementById('detalles-album-form').style.display = 'none';
    checkFormStatus();
});

document.getElementById('store-details-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Guardar los detalles de las tiendas seleccionadas
    const selectedStores = [];
    document.querySelectorAll('input[name="store"]:checked').forEach((checkbox) => {
        selectedStores.push(checkbox.value);
    });
    const selectedTerritories = [];
    document.querySelectorAll('input[name="territory"]:checked').forEach((checkbox) => {
        selectedTerritories.push(checkbox.value);
    });
    const territoryAction = document.getElementById('territory-action').value;

    storeDetails = {
        selectedStores: selectedStores,
        selectedTerritories: selectedTerritories,
        territoryAction: territoryAction
    };

    // Cambiar el estado de los detalles de las tiendas a completado
    document.getElementById('detalles-tiendas-status').innerText = '✓';
    document.getElementById('detalles-tiendas-form').style.display = 'none';
    checkFormStatus();
});

document.getElementById('album-artwork-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Guardar los detalles de la imagen del álbum
    const albumArtwork = document.getElementById('album-artwork').files[0];
    if (albumArtwork) {
        imageDetails = {
            file: albumArtwork
        };
        // Cambiar el estado de los detalles de la imagen a completado
        document.getElementById('detalles-imagen-status').innerText = '✓';
        document.getElementById('detalles-imagen-form').style.display = 'none';
    } else {
        document.getElementById('detalles-imagen-status').innerText = '✗';
    }
    checkFormStatus();
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.botones button').forEach(button => {
        button.addEventListener('click', () => {
            const targetFormId = button.id.replace('detalles-', '') + '-form';
            document.querySelectorAll('form').forEach(form => {
                form.style.display = form.id === targetFormId ? 'block' : 'none';
            });
        });
    });
});

document.getElementById('add-audio-artist-row').addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.classList.add('audio-artist-row');
    newRow.innerHTML = `
        <select name="artist-role">
            <option value="main">Main</option>
            <option value="featured">Featured</option>
            <!-- Agregar más roles según sea necesario -->
        </select>
        <input type="text" name="artist-name" required>
        <button type="button" class="remove-artist-row">Eliminar</button>
    `;
    document.getElementById('audio-artist-rows').appendChild(newRow);
});

document.getElementById('add-audio-writer-row').addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.classList.add('audio-writer-row');
    newRow.innerHTML = `
        <select name="writer-role">
            <option value="composer">Composer</option>
            <option value="lyricist">Lyricist</option>
            <!-- Agregar más roles según sea necesario -->
        </select>
        <input type="text" name="writer-name" required>
        <button type="button" class="remove-writer-row">Eliminar</button>
    `;
    document.getElementById('audio-writer-rows').appendChild(newRow);
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
    if (e.target.classList.contains('remove-artist-row')) {
        e.target.parentElement.remove();
    }
    if (e.target.classList.contains('remove-writer-row')) {
        e.target.parentElement.remove();
    }
});

function toggleLyricists(value) {
    const lyricistSection = document.getElementById('lyricist-section');
    const lyricistNameInput = document.getElementById('lyricist-name');
    
    if (value === 'yes') {
        lyricistSection.style.display = 'block';
        lyricistNameInput.setAttribute('required', 'required');
    } else {
        lyricistSection.style.display = 'none';
        lyricistNameInput.removeAttribute('required');
    }
}
