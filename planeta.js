// Configuración básica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Manejar el cambio de tamaño de la ventana
window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    positionConstellations();
}

// Crear fondo degradado
function createGradientBackground() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0e1a3d');
    gradient.addColorStop(0.5, '#6c1414');
    gradient.addColorStop(1, '#b5661a');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
}

scene.background = createGradientBackground();

// Establecer constantes y cargar texturas
const STAR_SIZE = 1;
const CONSTELLATION_SIZE = 3;
const starTexture = new THREE.TextureLoader().load('path_to_circular_texture.png');

// Crear estrellas brillantes
const starMaterial = new THREE.PointsMaterial({ map: starTexture, size: STAR_SIZE, sizeAttenuation: false, transparent: true });
const starVertices = [];
const fixedZDistance = 1000;
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * fixedZDistance;
    starVertices.push(x, y, z);
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Opción para posiciones fijas o aleatorias
const fixedPositions = false;

// Constelaciones con posiciones fijas
const constellations = [
    { name: 'Aries', stars: 4, position: { x: -500, y: 300, z: -500 } },
    { name: 'Taurus', stars: 9, position: { x: 500, y: 300, z: -500 } },
    { name: 'Gemini', stars: 8, position: { x: -500, y: -300, z: -500 } },
    { name: 'Cancer', stars: 5, position: { x: 500, y: -300, z: -500 } },
    { name: 'Leo', stars: 9, position: { x: -500, y: 300, z: 500 } },
    { name: 'Virgo', stars: 9, position: { x: 500, y: 300, z: 500 } },
    { name: 'Libra', stars: 4, position: { x: -500, y: -300, z: 500 } },
    { name: 'Scorpius', stars: 14, position: { x: 500, y: -300, z: 500 } },
    { name: 'Sagittarius', stars: 8, position: { x: -500, y: 0, z: 0 } },
    { name: 'Capricornus', stars: 6, position: { x: 500, y: 0, z: 0 } },
    { name: 'Aquarius', stars: 10, position: { x: 0, y: 500, z: 0 } },
    { name: 'Pisces', stars: 6, position: { x: 0, y: -500, z: 0 } },
    { name: 'Ursa Minor', stars: 7, position: { x: 0, y: 0, z: 500 } }
];

const constellationStars = [];
const constellationMaterial = new THREE.PointsMaterial({ map: starTexture, size: CONSTELLATION_SIZE, sizeAttenuation: false, transparent: true });

function createConstellation(positions) {
    const constellationGeometry = new THREE.BufferGeometry();
    constellationGeometry.setFromPoints(positions);
    return new THREE.Points(constellationGeometry, constellationMaterial);
}

function positionConstellations() {
    constellationStars.forEach(star => scene.remove(star));

    constellations.forEach((constellation) => {
        const numStars = constellation.stars;
        const positions = [];

        for (let i = 0; i < numStars; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * fixedZDistance;
            positions.push(new THREE.Vector3(x, y, z));
        }

        const constellationPoints = createConstellation(positions);

        if (fixedPositions) {
            constellationPoints.position.set(constellation.position.x, constellation.position.y, constellation.position.z);
        } else {
            let xOffset, yOffset, zOffset;
            let isPositionValid = false;
            while (!isPositionValid) {
                xOffset = (Math.random() - 0.5) * window.innerWidth / 2;
                yOffset = (Math.random() - 0.5) * window.innerHeight / 2;
                zOffset = (Math.random() - 0.5) * fixedZDistance;

                isPositionValid = true;
                constellationStars.forEach(star => {
                    const distance = Math.sqrt(
                        Math.pow(star.position.x - xOffset, 2) +
                        Math.pow(star.position.y - yOffset, 2) +
                        Math.pow(star.position.z - zOffset, 2)
                    );

                    if (distance < 300) {
                        isPositionValid = false;
                    }
                });
            }

            constellationPoints.position.set(xOffset, yOffset, zOffset);
        }

        scene.add(constellationPoints);
        constellationStars.push(constellationPoints);
    });
}

positionConstellations();

// Añadir una fuente de luz
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Crear gradiente para planetas
function createPlanetGradient(color1, color2) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
}

const planetGradients = {
    sun: createPlanetGradient('#FFFF00', '#FFA500'),
    mercury: createPlanetGradient('#b1b1b1', '#808080'),
    venus: createPlanetGradient('#FFD700', '#FFA500'),
    earth: createPlanetGradient('#0066cc', '#00FF00'),
    mars: createPlanetGradient('#FF4500', '#800000'),
    jupiter: createPlanetGradient('#D4AF37', '#A0522D'),
    saturn: createPlanetGradient('#F4A460', '#D2691E'),
    uranus: createPlanetGradient('#40E0D0', '#008080'),
    neptune: createPlanetGradient('#4169E1', '#0000FF')
};

// Crear el Sol
const sunGradient = (() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, '#FFFF00');
    gradient.addColorStop(0.2, '#FFD700');
    gradient.addColorStop(0.4, '#FFA500');
    gradient.addColorStop(0.6, '#FF8C00');
    gradient.addColorStop(0.8, '#FF4500');
    gradient.addColorStop(1, '#FF0000');
        ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(canvas);
})();

const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunGradient });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Datos de los planetas
const planetData = [
    { name: 'mercury', size: 0.383, distance: 7, gradient: planetGradients.mercury },
    { name: 'venus', size: 0.949, distance: 9, gradient: planetGradients.venus },
    { name: 'earth', size: 1, distance: 10, gradient: planetGradients.earth },
    { name: 'mars', size: 0.532, distance: 12, gradient: planetGradients.mars },
    { name: 'jupiter', size: 11.21, distance: 20, gradient: planetGradients.jupiter },
    { name: 'saturn', size: 9.45, distance: 30, gradient: planetGradients.saturn },
    { name: 'uranus', size: 4.01, distance: 40, gradient: planetGradients.uranus },
    { name: 'neptune', size: 3.88, distance: 50, gradient: planetGradients.neptune }
];

planetData.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: planet.gradient });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    scene.add(mesh);
    planet.mesh = mesh;

    if (planet.name === 'saturn') {
        const ringGeometry = new THREE.RingGeometry(planet.size + 0.5, planet.size + 1, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, 0, 0);
        planet.mesh.add(ring);
    } else if (planet.name === 'uranus') {
        const ringGeometry = new THREE.RingGeometry(planet.size + 0.5, planet.size + 1, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.z = Math.PI / 2;
        ring.position.set(0, 0, 0);
        planet.mesh.add(ring);
    }

    if (planet.name === 'earth') {
        const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
        const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(1.5, 0, 0);
        planet.mesh.add(moon);
        planet.moon = moon;
    }
});

camera.position.z = 60;

// Añadir las constelaciones
let constellationGroup = new THREE.Group();
constellationStars.forEach(star => constellationGroup.add(star));
scene.add(constellationGroup);

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    planetData.forEach(planet => {
        planet.mesh.position.x = planet.distance * Math.cos(time * 0.1 * (1 / planet.size));
        planet.mesh.position.z = planet.distance * Math.sin(time * 0.1 * (1 / planet.size));

        if (planet.name === 'earth') {
            planet.moon.position.x = 1.5 * Math.cos(time * 2);
            planet.moon.position.z = 1.5 * Math.sin(time * 2);
        }
    });

    constellationGroup.rotation.y += 0.01; // Rotar el grupo de constelaciones

    renderer.render(scene, camera);
}

animate();
