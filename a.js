// app.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyAgoQ_Px3hHVrevUsyct_FBeXWMDKXpPSw",
    authDomain: "grouvex-studios.firebaseapp.com",
    projectId: "grouvex-studios",
    storageBucket: "grouvex-studios.appspot.com",
    messagingSenderId: "1070842606062",
    appId: "1:1070842606062:web:5d887863048fd100b49eff",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function cambiarSeccion() {
    console.log("Función cambiarSeccion llamada"); // Verificar que la función se llama
    const section1 = document.getElementById('section1');
    const section2 = document.getElementById('section2');
    if (section1 && section2) {
        section1.style.display = 'none'; // Oculta la sección 1
        section2.style.display = 'block'; // Muestra la sección 2
        console.log("Cambio de secciones exitoso"); // Confirmar el cambio
    } else {
        console.error("No se encontraron los elementos section1 y/o section2");
    }
};
document.addEventListener('DOMContentLoaded', function() { cambiarSeccion(); });

const showSubSection = (subSectionId) => {
    const subSections = document.querySelectorAll('#form-container .section > div');
    subSections.forEach(subSection => {
        subSection.style.display = subSection.id === subSectionId ? 'block' : 'none';
    });
};

const addArtist = () => {
    const artistList = document.getElementById('artist-list');
    const artist = document.createElement('div');
    artist.className = 'artist';
    artist.innerHTML = `
        <select class="artist-role">
            <option value="primary">Primario</option>
            <option value="featuring">Featuring</option>
            <option value="producer">Producer</option>
            <option value="with">With</option>
            <option value="performer">Performer</option>
            <option value="dj">DJ</option>
            <option value="remixer">Remixer</option>
            <option value="conductor">Conductor</option>
            <option value="arranger">Arranger</option>
            <option value="orchestra">Orchestra</option>
            <option value="actor">Actor</option>
        </select>
        <input type="text" class="artist-name" required>
        <button type="button" onclick="removeArtist(this)">Eliminar</button>
    `;
    artistList.appendChild(artist);
};

const removeArtist = (button) => {
    button.parentElement.remove();
};

const addWriter = () => {
    const writersList = document.getElementById('writers-list');
    const writer = document.createElement('div');
    writer.className = 'writer';
    writer.innerHTML = `
        <input type="text" class="writer-name" required>
        <button type="button" onclick="removeWriter(this)">Eliminar</button>
    `;
    writersList.appendChild(writer);
};

const removeWriter = (button) => {
    button.parentElement.remove();
};

const toggleLyricistSection = (select) => {
    const lyricistSection = document.getElementById('lyricist-section');
    if (select.value === 'yes') {
        lyricistSection.style.display = 'block';
    } else {
        lyricistSection.style.display = 'none';
    }
};

const addLyricist = () => {
    const lyricistList = document.getElementById('lyricist-list');
    const lyricist = document.createElement('div');
    lyricist.className = 'lyricist';
    lyricist.innerHTML = `
        <input type="text" class="lyricist-name">
        <button type="button" onclick="removeLyricist(this)">Eliminar</button>
    `;
    lyricistList.appendChild(lyricist);
};

const removeLyricist = (button) => {
    button.parentElement.remove();
};

const clearPreOrderDate = () => {
    document.getElementById('pre-order-date').value = '';
};

const clearTime = () => {
    document.getElementById('add-time').value = '';
    document.getElementById('time-zone').value = '';
};

document.getElementById('release-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const releaseData = {
        upc: document.getElementById('upc').value,
        releaseTitle: document.getElementById('release-title').value,
        albumTitle: document.getElementById('album-title').value,
        language: document.getElementById('language').value,
        albumVersion: document.getElementById('album-version').value,
        compilationAlbum: document.getElementById('compilation-album').value,
        artists: Array.from(document.getElementsByClassName('artist')).map(artist => ({
            role: artist.querySelector('.artist-role').value,
            name: artist.querySelector('.artist-name').value
        })),
        writers: Array.from(document.getElementsByClassName('writer')).map(writer => writer.querySelector('.writer-name').value),
        lyrics: document.getElementById('lyrics').value,
        lyricists: Array.from(document.getElementsByClassName('lyricist')).map(lyricist => lyricist.querySelector('.lyricist-name').value),
        primaryGenre: document.getElementById('primary-genre').value,
        secondaryGenre: document.getElementById('secondary-genre').value,
        compositionCopyright: document.getElementById('composition-copyright').value,
        compositionDate: document.getElementById('composition-date').value,
        recordingCopyright: document.getElementById('recording-copyright').value,
        recordingDate: document.getElementById('recording-date').value,
        recordLabelName: document.getElementById('record-label-name').value,
        originallyReleased: document.getElementById('originally-released').value,
        preOrderDate: document.getElementById('pre-order-date').value,
        salesStartDate: document.getElementById('sales-start-date').value,
        addTime: document.getElementById('add-time').value,
        timeZone: document.getElementById('time-zone').value,
        releaseTime: document.getElementById('release-time').value,
        explicitContent: document.getElementById('explicit-content').value,
    };
    setDoc(doc(db, "releases", releaseData.releaseTitle), releaseData)
        .then(() => {
            alert("Lanzamiento guardado correctamente");
        })
        .catch((error) => {
            console.error("Error al guardar el lanzamiento:", error);
        });
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('form-container').style.display = 'block';
    } else {
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('form-container').style.display = 'none';
    }
});
