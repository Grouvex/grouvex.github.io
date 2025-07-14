// Configuración inicial
document.addEventListener('DOMContentLoaded', function() {
  // Manejar búsqueda en la página principal
  const searchBtn = document.getElementById('searchArtistBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', searchArtist);
  }
  
  // Manejar búsqueda por UPC en página de artista
  const upcSearchBtn = document.getElementById('searchUpcBtn');
  if (upcSearchBtn) {
    upcSearchBtn.addEventListener('click', searchByUPC);
  }
});

// Buscar artista
function searchArtist() {
  const artistId = document.getElementById('artistIdInput').value.trim();
  if (artistId) {
    window.location.href = `artist.html?id=${artistId}`;
  } else {
    alert('Por favor introduce un GS-UserID válido');
  }
}

// Cargar página del artista
function loadArtistPage(artistId) {
  const artist = getArtistById(artistId);
  const songs = getSongsByArtistId(artistId);
  
  if (!artist) {
    showNotFound(artistId);
    return;
  }
  
  renderArtistPage(artist, songs);
}

// Mostrar artista no encontrado
function showNotFound(artistId) {
  const container = document.getElementById('artistContainer');
  container.innerHTML = `
    <div class="not-found">
      <h1>Artista no encontrado</h1>
      <p>No se encontró ningún artista con el ID: ${artistId}</p>
      <a href="../index.html">Volver a la página de búsqueda</a>
    </div>
  `;
}

// Renderizar página del artista
function renderArtistPage(artist, songs) {
  const container = document.getElementById('artistContainer');
  
  // Aquí construirías todo el HTML complejo que tienes en tu Artist.html
  // Esto es un ejemplo simplificado:
  container.innerHTML = `
    <div class="artist-header">
      <h1>${artist.nombreArtista}</h1>
      <p class="artist-id">GS-UserID: ${artist.id}</p>
    </div>
    
    <div class="artist-info-section">
      <!-- Secciones de información del artista -->
    </div>
    
    ${songs.length ? `
    <div class="songs-section">
      <h2>Canciones registradas</h2>
      <table class="songs-table">
        <!-- Tabla de canciones -->
      </table>
    </div>
    ` : '<p>No hay canciones registradas para este artista</p>'}
    
    <!-- Botón de descarga de contrato -->
    <button id="downloadContractBtn" class="btn-download">
      <i class="fas fa-file-pdf"></i> Descargar Contrato PDF
    </button>
  `;
  
  // Configurar evento para el botón de PDF
  document.getElementById('downloadContractBtn').addEventListener('click', () => {
    generateContractPDF(artist);
  });
}

// Buscar por UPC
function searchByUPC() {
  const upc = document.getElementById('upcInput').value.trim();
  if (!upc) {
    alert('Por favor introduce un UPC');
    return;
  }
  
  const song = getSongByUPC(upc);
  const resultDiv = document.getElementById('songResult');
  
  if (song) {
    let html = '<div class="song-info">';
    for (const [key, value] of Object.entries(song)) {
      if (value) {
        html += `<p><strong>${key}:</strong> ${value}</p>`;
      }
    }
    html += '</div>';
    resultDiv.innerHTML = html;
  } else {
    resultDiv.innerHTML = '<p>No se encontró ninguna canción con ese UPC</p>';
  }
  
  resultDiv.style.display = 'block';
}
