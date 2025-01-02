const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 250;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.enablePan = true; // Permitir paneo para mejor control en dispositivos móviles

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    positionConstellations(); 
});

const createGradientBackground = () => {
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
};
scene.background = createGradientBackground();

const generateStars = (count, spread) => {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 1, sizeAttenuation: true });
    const starVertices = [];
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * spread;
        const y = (Math.random() - 0.5) * spread;
        const z = (Math.random() - 0.5) * spread;
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    return stars
};

generateStars(100000, 20000); // Genera un montón de estrellas iniciales

const fixedPositions = false;
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
const constellationMaterial = new THREE.PointsMaterial({ color: 0x00FFFF, size: 3, sizeAttenuation: true });

const createConstellation = (positions) => {
    const constellationGeometry = new THREE.BufferGeometry();
    constellationGeometry.setFromPoints(positions);
    return new THREE.Points(constellationGeometry, constellationMaterial);
};

const positionConstellations = () => {
    constellationStars.forEach(star => scene.remove(star));
    constellations.forEach((constellation) => {
        const numStars = constellation.stars;
        const positions = [];
        for (let i = 0; i < numStars; i++) {
            const x = (Math.random() - 0.5) * 100;
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
};
positionConstellations();

const pointLight = new THREE.PointLight(0xFFFFFF, 2, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const createPlanetGradient = (color1, color2) => {
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
};

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

const sunGeometry = new THREE.SphereGeometry(20, 34, 34);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunGradient });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Ajustar distancia entre la superficie del planeta y sus lunas
function addMoons(planet, numMoons, moonSize, moonDistance) {
    const moons = [];
    for (let i = 0; i < numMoons; i++) {
        const moonGeometry = new THREE.SphereGeometry(moonSize, 32, 32);
        const moonMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        const angle = (i / numMoons) * Math.PI * 2;
        const distanceFromSurface = planet.size + moonDistance;
        moon.position.set(
            distanceFromSurface * Math.cos(angle),
            0,
            distanceFromSurface * Math.sin(angle)
        );
        planet.mesh.add(moon);
        moons.push(moon);
    }
    planet.moons = moons;
}

const planetData = [
    { name: 'mercury', size: 0.383, distance: 10, eccentricity: 0.2, rotationSpeed: 0.01,  gradient: planetGradients.mercury, moons: { numMoons: 0, moonSize: 0.1, moonDistance: 1 } },
    { name: 'venus', size: 0.949, distance: 12, eccentricity: 0.2, rotationSpeed: 0.01, gradient: planetGradients.venus, moons: { numMoons: 0, moonSize: 0.1, moonDistance: 1 } },
    { name: 'earth', size: 1, distance: 13, eccentricity: 0.2, rotationSpeed: 0.01, gradient: planetGradients.earth, moons: { numMoons: 1, moonSize: 0.5, moonDistance: 1 } },
    { name: 'mars', size: 0.532, distance: 15, eccentricity: 0.2, rotationSpeed: 0.01, gradient: planetGradients.mars, moons: { numMoons: 2, moonSize: 0.09, moonDistance: 1 } },
    { name: 'jupiter', size: 11.21, distance: 33, eccentricity: 0.2, rotationSpeed: 0.01, gradient: planetGradients.jupiter, moons: { numMoons: 4, moonSize: 0.5, moonDistance: 3 } },
    { name: 'saturn', size: 9.45, distance: 63, eccentricity: 0.2, rotationSpeed: 0.01, gradient: planetGradients.saturn, moons: { numMoons: 7, moonSize: 0.3, moonDistance: 1.5 } },
    { name: 'uranus', size: 4.01, distance: 73, eccentricity: 0.2, rotationSpeed: 0.01, gradient: planetGradients.uranus, moons: { numMoons: 5, moonSize: 0.2, moonDistance: 1.5 } },
    { name: 'neptune', size: 3.88, distance: 83, eccentricity: 0.2, rotationSpeed: 0.01, gradient: planetGradients.neptune, moons: { numMoons: 2, moonSize: 0.35, moonDistance: 1 } },
    { name: 'pluton', size: 0.183, distance: 100, eccentricity: 0.2, rotationSpeed: 0.01, gradient: planetGradients.neptune, moons: { numMoons: 0, moonSize: 0, moonDistance: 0 } }
];


planetData.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    const material = new THREE.MeshBasicMaterial({ map: planet.gradient });
    const mesh = new THREE.Mesh(geometry, material);
    const distanceFromSunSurface = 20 + planet.distance;
    mesh.position.x = distanceFromSunSurface;
    scene.add(mesh);
    planet.mesh = mesh;
if (planet.moons.numMoons > 0) { 
    addMoons(planet, planet.moons.numMoons, planet.moons.moonSize, planet.moons.moonDistance);
}
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
    });

let constellationGroup = new THREE.Group();
constellationStars.forEach(star => constellationGroup.add(star));
scene.add(constellationGroup);

const galaxyGroup = new THREE.Group();
scene.add(galaxyGroup);

const generateGalaxies = (count, spread) => {
    const galaxyGroup = new THREE.Group();
    for (let i = 0; i < count; i++) {
        const galaxy = new THREE.Group();
        const stars = generateStars(10000, spread);
        galaxy.add(stars);
        galaxy.position.set(
            (Math.random() - 0.5) * spread * 10,
            (Math.random() - 0.5) * spread * 10,
            (Math.random() - 0.5) * spread * 10
        );
        galaxyGroup.add(galaxy);
    }
    scene.add(galaxyGroup);
};


generateGalaxies(1000, 5000); // Genera varias galaxias en el espacio

function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;
    planetData.forEach(planet => {
        // Órbitas elípticas
        const angle = time * 0.1 * (1 / planet.size);
        const a = planet.distance; // semi-major axis
        const b = planet.distance * Math.sqrt(1 - Math.pow(planet.eccentricity, 2)); // semi-minor axis
        planet.mesh.position.x = a * Math.cos(angle);
        planet.mesh.position.z = b * Math.sin(angle);

        // Rotación sobre su eje
        planet.mesh.rotation.y += planet.rotationSpeed;

        if (planet.moons && planet.moons.length > 0) {
            planet.moons.forEach((moon, index) => {
                const moonAngle = (index / planet.moons.length) * Math.PI * 2 + time * 0.5;
                moon.position.x = planet.moons.moonDistance * Math.cos(moonAngle);
                moon.position.z = planet.moons.moonDistance * Math.sin(moonAngle);
            });
        }
    });
    constellationGroup.rotation.y += 0.0001; 
    galaxyGroup.rotation.y += 0.0005; // Rotación lenta de las galaxias
    controls.update()
    renderer.render(scene, camera);
}
animate();
