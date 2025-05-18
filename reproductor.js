// Variables globales
let tracks = [];
let currentTrackIndex = 0;
let isPlaying = false;
let isRandom = false;
let repeatMode = 0;
let previousRandomIndex = -1;

// Elementos del DOM
let audioPlayer, trackName, trackArtist, trackAlbum, trackLabel, trackComposer;
let trackProducer, spotifyLink, playPauseButton, prevButton, nextButton;
let randomButton, repeatButton, player, playlist, youtubeVideo;
let youtubePlayer, spotifyVideo, spotifyPlayer, startDateElement;
let endDateElement, progressBar, progress, volumeBar, volume;
let currentTimeDisplay, totalTimeDisplay, trackImagen;

// Función para inicializar el reproductor
async function initReproductor() {
    // Obtener referencias a los elementos del DOM
    audioPlayer = document.getElementById('audioPlayer');
    trackName = document.getElementById('trackName');
    trackArtist = document.getElementById('trackArtist');
    trackAlbum = document.getElementById('trackAlbum');
    trackLabel = document.getElementById('trackLabel');
    trackComposer = document.getElementById('trackComposer');
    trackProducer = document.getElementById('trackProducer');
    spotifyLink = document.getElementById('spotifyLink');
    playPauseButton = document.getElementById('playPause');
    prevButton = document.getElementById('prev');
    nextButton = document.getElementById('next');
    randomButton = document.getElementById('random');
    repeatButton = document.getElementById('repeat');
    player = document.getElementById('player');
    playlist = document.querySelector('#playlist ul');
    youtubeVideo = document.getElementById('youtubeVideo');
    youtubePlayer = document.getElementById('youtubePlayer');
    spotifyVideo = document.getElementById('spotifyVideo');
    spotifyPlayer = document.getElementById('spotifyPlayer');
    startDateElement = document.getElementById('startDate');
    endDateElement = document.getElementById('endDate');
    progressBar = document.getElementById('progressBar');
    progress = document.getElementById('progress');
    volumeBar = document.getElementById('volumeBar');
    volume = document.getElementById('volume');
    currentTimeDisplay = document.getElementById('currentTime');
    totalTimeDisplay = document.getElementById('totalTime');
    trackImagen = document.getElementById('trackImagen');

    // Cargar las canciones
    await loadTracks();
    
    // Configurar eventos y UI
    setupEventListeners();
    generatePlaylist();
    
    // Reproducir la primera canción disponible
    const availableTracks = tracks.filter(track => isTrackAvailable(track));
    if (availableTracks.length > 0) {
        playTrack(tracks.indexOf(availableTracks[0]));
    } else {
        const noTrackElement = document.createElement('li');
        noTrackElement.textContent = 'No hay ninguna canción disponible';
        playlist.appendChild(noTrackElement);
    }
}

// Función para cargar las canciones desde JSON
async function loadTracks() {
    try {
        const response = await fetch('musica.json');
        if (!response.ok) throw new Error('Error al cargar las canciones');
        tracks = await response.json();
        console.log('Canciones cargadas:', tracks.length);
    } catch (error) {
        console.error('Error:', error);
        tracks = [];
    }
}

// Función para configurar los event listeners
function setupEventListeners() {
    playPauseButton.addEventListener('click', playPause);
    nextButton.addEventListener('click', nextTrack);
    prevButton.addEventListener('click', prevTrack);
    randomButton.addEventListener('click', toggleRandom);
    repeatButton.addEventListener('click', toggleRepeat);

    // Barra de progreso
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('loadedmetadata', updateTotalTime);
    progressBar.addEventListener('click', seekAudio);

    // Barra de volumen
    audioPlayer.addEventListener('volumechange', updateVolumeBar);
    volumeBar.addEventListener('click', adjustVolume);

    // Cuando termina una canción
    audioPlayer.addEventListener('ended', handleTrackEnd);
}

// Función para generar la lista de reproducción
function generatePlaylist() {
    playlist.innerHTML = ''; // Limpiar lista existente

    const availableTracks = tracks.filter(track => isTrackAvailable(track));
    
    availableTracks.forEach((track, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="track-number">${index + 1}</div>
            <div class="track-info">
                <div class="track-title" title="${track.name}">${track.name}</div>
                <div class="track-artist" title="${track.artist}">${track.artist}</div>
            </div>
            <div class="track-album" title="${track.album}">${track.album}</div>
            <div class="track-duration">-:--</div>
        `;

        // Obtener duración real
        getTrackDuration(track, (duration) => {
            li.querySelector('.track-duration').textContent = formatTime(duration);
        });

        // Evento para reproducir al hacer clic
        li.addEventListener('click', () => playTrack(tracks.indexOf(track)));
        
        // Efecto hover en el número de pista
        const trackNumber = li.querySelector('.track-number');
        trackNumber.addEventListener('mouseenter', () => {
            trackNumber.innerHTML = '<i class="fas fa-play"></i>';
        });
        trackNumber.addEventListener('mouseleave', () => {
            trackNumber.textContent = index + 1;
        });

        playlist.appendChild(li);
    });

    // Deshabilitar aleatorio si hay pocas canciones
    randomButton.disabled = availableTracks.length <= 2;
}

// Función para actualizar la información de la pista actual
function updateTrackInfo(track) {
    trackName.textContent = track.name;
    trackArtist.textContent = track.artist;
    trackAlbum.textContent = track.album;
    trackLabel.textContent = `Label: ${track.label}`;
    trackComposer.textContent = `Compositor: ${track.composer}`;
    trackProducer.textContent = `Productor: ${track.producer}`;
    spotifyLink.href = track.spotify;
    
    // Actualizar imagen
    trackImagen.src = track.background;
    trackImagen.alt = `Portada de ${track.name}`;
    
    // Actualizar fechas
    startDateElement.textContent = `${track.startDate.month}/${track.startDate.day}`;
    endDateElement.textContent = `${track.endDate.month}/${track.endDate.day}`;

    // Verificar si es un lanzamiento futuro
    const nowUnixTime = Math.floor(Date.now() / 1000);
    if (nowUnixTime < track.releaseDate) {
        trackName.textContent += ' (Próximamente | Pre-Audio)';
        trackName.style.color = '#ffcc00';
    } else {
        trackName.style.color = '';
    }

    // Actualizar reproductores embebidos
    youtubeVideo.style.display = track.youtube ? 'block' : 'none';
    if (track.youtube) youtubePlayer.src = track.youtube;
    
    spotifyVideo.style.display = track.spotifyEmbed ? 'block' : 'none';
    if (track.spotifyEmbed) spotifyPlayer.src = track.spotifyEmbed;

    // Actualizar título de la página
    document.title = `${track.name} - ${track.artist} | Grouvex Studios`;
}

// ... (todas las demás funciones como playTrack, playPause, etc. se mantienen igual)

// Inicializar el reproductor cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el reproductor
    initReproductor().catch(error => {
        console.error('Error al inicializar el reproductor:', error);
    });
});
