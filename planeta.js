// Configuración básica de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Ajustar la cámara y el renderizador cuando la ventana cambia de tamaño
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    positionConstellations(); // Reposicionar constelaciones al cambiar tamaño de ventana
});

// Fondo de colores degradados y estrellas brillantes
const createGradientBackground = () => {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext('2d');

    // Crear gradiente
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0e1a3d'); // Ajustado a un color más oscuro
    gradient.addColorStop(0.5, '#6c1414'); // Ajustado a un color más oscuro
    gradient.addColorStop(1, '#b5661a'); // Ajustado a un color más oscuro

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return new THREE.CanvasTexture(canvas);
};

scene.background = createGradientBackground();

// Estrellas brillantes
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 1, sizeAttenuation: true });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Opción para posiciones fijas o aleatorias
const fixedPositions = true; // Cambia esto a false para posiciones aleatorias

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
const constellationMaterial = new THREE.PointsMaterial({ color: 0x00FFFF, size: 4, sizeAttenuation: true }); // Color azul brillante y tamaño mayor

const createConstellation = (positions) => {
    const constellationGeometry = new THREE.BufferGeometry();
    constellationGeometry.setFromPoints(positions);
    return new THREE.Points(constellationGeometry, constellationMaterial);
};

const positionConstellations = () => {
    constellationStars.forEach(star => scene.remove(star)); // Limpiar las constelaciones previas

    constellations.forEach((constellation) => {
        const numStars = constellation.stars; // Número de estrellas de la constelación
        const positions = [];

        for (let i = 0; i < numStars; i++) {
            const x = (Math.random() - 0.5) * 100; // Limitar las posiciones para mantenerlas en el espacio visible
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
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
                zOffset = (Math.random() - 0.5) * 1000;

                isPositionValid = true;
                constellationStars.forEach(star => {
                    const distance = Math.sqrt(
                        Math.pow(star.position.x - xOffset, 2) +
                        Math.pow(star.position.y - yOffset, 2) +
                        Math.pow(star.position.z - zOffset, 2)
                    );

                    if (distance < 300) { // Distancia mínima entre constelaciones
                        isPositionValid = false;
                    }
                });
            }

            constellationPoints.position.set(xOffset, yOffset, zOffset);
        }

        scene.add(constellationPoints);
        constellationStars.push(constellationPoints);
    });
};

positionConstellations(); // Posicionar las constelaciones inicialmente

// Crear un gradiente para el ojo de la tormenta de Júpiter
const createJupiterStormGradient = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Crear gradiente radial para simular el ojo de la tormenta
    const gradient = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
    gradient.addColorStop(0, '#FFA500'); // Naranja
    gradient.addColorStop(0.5, '#FF4500'); // Rojo anaranjado
    gradient.addColorStop(1, '#8B0000'); // Rojo oscuro

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    return new THREE.CanvasTexture(canvas);
};

// Aplicar el gradiente del ojo de la tormenta a Júpiter
const jupiterGeometry = new THREE.SphereGeometry(11.21, 32, 32);
const jupiterMaterial = new THREE.MeshBasicMaterial({ map: createJupiterStormGradient() });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
scene.add(jupiter);

// Posicionar Júpiter
jupiter.position.set(20, 0, 0);

// Añadir una fuente de luz
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Crear un gradiente para los planetas
const createPlanetGradient = (color1, color2) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    // Crear gradiente radial
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

const sunGeometry = new THREE.SphereGeometry(7, 34, 34);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunGradient });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Función para crear lunas y agregarlas a un planeta
function addMoons(planet, numMoons, moonSize, moonDistance) {
    const moons = [];
    for (let i = 0; i < numMoons; i++) {
        const moonGeometry = new THREE.SphereGeometry(moonSize, 32, 32);
        const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);

        const angle = (i / numMoons) * Math.PI * 2;
        moon.position.set(
            moonDistance * Math.cos(angle),
            0,
            moonDistance * Math.sin(angle)
        );

        planet.mesh.add(moon);
        moons.push(moon);
    }
    planet.moons = moons;
}

// Datos de los planetas
const planetData = [
    { name: 'mercury', size: 0.383/2, distance: 6, gradient: planetGradients.mercury, moons: { numMoons: 0, moonSize: 0.1, moonDistance: 1/2 } },
    { name: 'venus', size: 0.949/2, distance: 7, gradient: planetGradients.venus, moons: { numMoons: 0, moonSize: 0.1, moonDistance: 1/2 } },
    { name: 'earth', size: 1/2, distance: 9, gradient: planetGradients.earth, moons: { numMoons: 1, moonSize: 0.27, moonDistance: 1.5/2 } },
    { name: 'mars', size: 0.532/2, distance: 10, gradient: planetGradients.mars, moons: { numMoons: 2, moonSize: 0.1, moonDistance: 1.2/2 } },
    { name: 'jupiter', size: 11.21/2, distance: 18, gradient: planetGradients.jupiter, moons: { numMoons: 4, moonSize: 0.5, moonDistance: 3/2 } },
    { name: 'saturn', size: 9.45/2, distance: 28, gradient: planetGradients.saturn, moons: { numMoons: 7, moonSize: 0.3, moonDistance: 2.5/2 } },
    { name: 'uranus', size: 4.01/2, distance: 38, gradient: planetGradients.uranus, moons: { numMoons: 5, moonSize: 0.2, moonDistance: 2/2 } },
    { name: 'neptune', size: 3.88/2, distance: 45, gradient: planetGradients.neptune, moons: { numMoons: 2, moonSize: 0.15, moonDistance: 1.5/2 } }
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

    // Añadir lunas según la configuración del planeta
    if (planet.moons.numMoons > 0) {
        addMoons(planet, planet.moons.numMoons, planet.moons.moonSize, planet.moons.moonDistance);
    }
});

// Añadir las constelaciones
let constellationGroup = new THREE.Group();
constellationStars.forEach(star => constellationGroup.add(star));
scene.add(constellationGroup);

// Función de animación para rotar lunas y constelaciones
function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    planetData.forEach(planet => {
        planet.mesh.position.x = planet.distance * Math.cos(time * 0.1 * (1 / planet.size));
        planet.mesh.position.z = planet.distance * Math.sin(time * 0.1 * (1 / planet.size));

        if (planet.moons && planet.moons.length > 0) {
            planet.moons.forEach((moon, index) => {
                const angle = (index / planet.moons.length) * Math.PI * 2 + time * 0.5;
                moon.position.x = planet.moons.moonDistance * Math.cos(angle);
                moon.position.z = planet.moons.moonDistance * Math.sin(angle);
            });
        }
    });

    // Rotar el grupo de constelaciones
    constellationGroup.rotation.y += 0.01; // Ajustado para mayor velocidad

    renderer.render(scene, camera);
}

animate();
