// Configuración de la API
const SPREADSHEET_ID = '15FJWUFb6J52XDLbicgvTJmSCjJ0c0sRoWPpr5YFK5H8';
const API_KEY = 'TU_API_KEY'; // Reemplaza con tu API key
const ARTISTS_SHEET_NAME = 'Respuestas de formulario 2';
const SONGS_SHEET_NAME = 'Respuestas de formulario 1';

// Cache para almacenar los datos
let cachedArtists = null;
let cachedSongs = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

// Función para obtener datos de la hoja de cálculo
async function fetchSheetData(sheetName) {
  const range = encodeURIComponent(sheetName);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.status}`);
    }
    const data = await response.json();
    return data.values;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return null;
  }
}

// Procesar datos de artistas
function processArtistsData(values) {
  if (!values || values.length < 2) return [];
  
  const headers = values[0];
  const rows = values.slice(1);
  
  return rows.map(row => {
    const artist = {};
    headers.forEach((header, index) => {
      artist[header] = row[index] || '';
    });
    return artist;
  });
}

// Procesar datos de canciones
function processSongsData(values) {
  if (!values || values.length < 2) return [];
  
  const headers = values[0];
  const rows = values.slice(1);
  
  return rows.map(row => {
    const song = {};
    headers.forEach((header, index) => {
      song[header] = row[index] || '';
    });
    return song;
  });
}

// Obtener artistas con cache
async function getArtists() {
  const now = Date.now();
  if (cachedArtists && now - lastFetchTime < CACHE_DURATION) {
    return cachedArtists;
  }
  
  const values = await fetchSheetData(ARTISTS_SHEET_NAME);
  cachedArtists = processArtistsData(values);
  lastFetchTime = now;
  return cachedArtists || [];
}

// Obtener canciones con cache
async function getSongs() {
  const now = Date.now();
  if (cachedSongs && now - lastFetchTime < CACHE_DURATION) {
    return cachedSongs;
  }
  
  const values = await fetchSheetData(SONGS_SHEET_NAME);
  cachedSongs = processSongsData(values);
  lastFetchTime = now;
  return cachedSongs || [];
}

// Función para buscar artista por ID
async function getArtistById(id) {
  const artists = await getArtists();
  return artists.find(artist => artist['ID'] === id);
}

// Función para buscar canciones por ID de artista
async function getSongsByArtistId(id) {
  const songs = await getSongs();
  return songs.filter(song => song['ID'] === id);
}

// Función para buscar canción por UPC
async function getSongByUPC(upc) {
  const songs = await getSongs();
  return songs.find(song => song['UPC/EAN'] === upc);
}

// Exportar funciones
export { getArtistById, getSongsByArtistId, getSongByUPC };
