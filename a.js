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
            <td><button>Modificar</button></td>
        `;
        trackList.appendChild(row);
    });
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
