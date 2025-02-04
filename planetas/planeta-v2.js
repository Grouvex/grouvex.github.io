const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.z = 600;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Iluminación
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Sol
const sunGeometry = new THREE.SphereGeometry(60, 64, 64);
const sunMaterial = new THREE.MeshPhongMaterial({
    color: 0xFFD700,
    emissive: 0xFFA500,
    emissiveIntensity: 0.9,
    specular: 0xFFFF00
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
sun.add(new THREE.PointLight(0xFFFFFF, 2, 2000));
scene.add(sun);

// Fondo estelar
const createStarField = () => {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    for(let i = 0; i < 10000; i++) {
        positions.push(
            (Math.random() - 0.5) * 2500,
            (Math.random() - 0.5) * 2500,
            (Math.random() - 0.5) * 2500
        );
        
        const color = new THREE.Color();
        color.setHSL(
            Math.random() * 0.1 + 0.5,
            Math.random() * 0.3,
            Math.random() * 0.5 + 0.5
        );
        colors.push(color.r, color.g, color.b);
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return new THREE.Points(
        geometry,
        new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        })
    );
};
scene.add(createStarField());

// Sistema de Constelaciones Zodiacales (12 patrones)
const createConstellation = () => {
    const group = new THREE.Group();
    
    const zodiacConstellations = [
        { // Aries
            pattern: [
                {x:0,y:0,z:0}, {x:35,y:10,z:5}, {x:70,y:-5,z:-3}, {x:105,y:15,z:7},
                {x:50,y:40,z:-5}, {x:90,y:30,z:2}
            ],
            color: 0xFF4500,
            stars: 6
        },
        { // Tauro
            pattern: [
                {x:0,y:0,z:0}, {x:30,y:45,z:8}, {x:60,y:25,z:-5}, {x:45,y:-20,z:10},
                {x:75,y:-10,z:-3}, {x:105,y:15,z:5}, {x:90,y:40,z:-7}
            ],
            color: 0xCD5C5C,
            stars: 7
        },
        { // Géminis
            pattern: [
                {x:0,y:0,z:0}, {x:40,y:0,z:0}, {x:80,y:0,z:0}, {x:0,y:50,z:10},
                {x:40,y:50,z:-5}, {x:80,y:50,z:5}
            ],
            color: 0x00BFFF,
            stars: 6
        },
        { // Cáncer
            pattern: [
                {x:0,y:0,z:0}, {x:25,y:35,z:8}, {x:50,y:0,z:-5}, {x:75,y:35,z:5},
                {x:100,y:0,z:-3}, {x:50,y:-30,z:10}
            ],
            color: 0x9370DB,
            stars: 6
        },
        { // Leo
            pattern: [
                {x:0,y:0,z:0}, {x:40,y:30,z:5}, {x:80,y:50,z:-3}, {x:120,y:30,z:7},
                {x:160,y:0,z:-5}, {x:120,y:-30,z:3}, {x:80,y:-50,z:-7}
            ],
            color: 0xFFD700,
            stars: 7
        },
        { // Virgo
            pattern: [
                {x:0,y:0,z:0}, {x:50,y:40,z:8}, {x:100,y:20,z:-5}, {x:150,y:0,z:5},
                {x:100,y:-20,z:-3}, {x:50,y:-40,z:10}, {x:0,y:-60,z:0}
            ],
            color: 0x32CD32,
            stars: 7
        },
        { // Libra
            pattern: [
                {x:0,y:0,z:0}, {x:40,y:0,z:5}, {x:80,y:0,z:-3}, {x:40,y:40,z:7},
                {x:80,y:40,z:-5}, {x:40,y:-40,z:3}
            ],
            color: 0xFF69B4,
            stars: 6
        },
        { // Escorpio
            pattern: [
                {x:0,y:0,z:0}, {x:30,y:25,z:8}, {x:60,y:50,z:-5}, {x:90,y:25,z:5},
                {x:120,y:0,z:-3}, {x:150,y:-25,z:10}, {x:180,y:-50,z:0}
            ],
            color: 0xDC143C,
            stars: 7
        },
        { // Sagitario
            pattern: [
                {x:0,y:0,z:0}, {x:40,y:30,z:5}, {x:80,y:60,z:-3}, {x:120,y:30,z:7},
                {x:80,y:0,z:-5}, {x:120,y:-30,z:3}, {x:160,y:-60,z:-7}
            ],
            color: 0x20B2AA,
            stars: 7
        },
        { // Capricornio
            pattern: [
                {x:0,y:0,z:0}, {x:35,y:40,z:8}, {x:70,y:20,z:-5}, {x:105,y:0,z:5},
                {x:140,y:-20,z:-3}, {x:175,y:-40,z:10}
            ],
            color: 0x808080,
            stars: 6
        },
        { // Acuario
            pattern: [
                {x:0,y:0,z:0}, {x:30,y:50,z:5}, {x:60,y:0,z:-3}, {x:90,y:50,z:7},
                {x:120,y:0,z:-5}, {x:150,y:50,z:3}, {x:180,y:0,z:-7}
            ],
            color: 0x4169E1,
            stars: 7
        },
        { // Piscis
            pattern: [
                {x:0,y:0,z:0}, {x:40,y:30,z:8}, {x:80,y:0,z:-5}, {x:120,y:30,z:5},
                {x:160,y:0,z:-3}, {x:200,y:30,z:10}, {x:240,y:0,z:0}
            ],
            color: 0x87CEEB,
            stars: 7
        }
    ];

    const type = zodiacConstellations[Math.floor(Math.random() * zodiacConstellations.length)];
    const starGeometry = new THREE.SphereGeometry(1, 16, 16);
    const starMaterial = new THREE.MeshPhongMaterial({
        color: type.color,
        emissive: type.color,
        emissiveIntensity: 1.5,
        specular: 0xFFFFFF,
        shininess: 100
    });

    const basePosition = new THREE.Vector3(
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000,
        (Math.random() - 0.5) * 2000
    );

    const stars = new THREE.InstancedMesh(starGeometry, starMaterial, type.stars);
    const dummy = new THREE.Object3D();

    type.pattern.forEach((pos, i) => {
        const variation = new THREE.Vector3(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
        );

        dummy.position.copy(basePosition)
            .add(new THREE.Vector3(pos.x, pos.y, pos.z))
            .add(variation);

        dummy.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        dummy.updateMatrix();
        stars.setMatrixAt(i, dummy.matrix);
    });

    group.add(stars);
    
    group.userData = {
        blinkSpeed: 0.02 + Math.random() * 0.04,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        intensity: Math.random() * 2
    };
    
    return group;
};

// Generar 24 constelaciones (2 de cada tipo zodiacal)
for(let i = 0; i < 24; i++) {
    const constellation = createConstellation();
    constellation.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
    );
    scene.add(constellation);
}

// Sistema Planetario
const createPlanet = (size, color, ringConfig = null) => {
    const planet = new THREE.Mesh(
        new THREE.SphereGeometry(size, 32, 32),
        new THREE.MeshPhongMaterial({
            color,
            shininess: 10
        })
    );
    
    if(ringConfig) {
        const ringGeometry = new THREE.RingGeometry(
            ringConfig.innerRadius,
            ringConfig.outerRadius,
            64
        );
        const ringMaterial = new THREE.MeshPhongMaterial({
            color: ringConfig.color,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 2
        });
        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = ringConfig.inclination;
        planet.add(rings);
    }
    
    return planet;
};

const planetsConfig = [
    {
        name: 'mecury',
        size: 3.8,
        color: 0x808080,
        distance: 80,
        speed: 0.02,
        ringConfig: {},
        moons: {}
    },
    {
        name: 'venus',
        size: 9.5,
        color: 0xFFD700,
        distance: 100,
        speed: 0.015,
        ringConfig: {
        },
        moons: {}
    },
    {
        name: 'tierra',
        size: 10,
        color: 0x0066CC,
        distance: 150,
        speed: 0.012,
        ringConfig: {
        },
        moons: {
            count: 1,
            size: 2,
            distance: 15
        }
    },
    {
        name: 'marte',
        size: 5.3,
        color: 0xFF4500,
        distance: 200,
        speed: 0.01,
        ringConfig: {
        },
        moons: {
            count: 2,
            size: 1,
            distance: 10
        }
    },
        {
        name: 'jupiter',
        size: 25,
        color: 0xD4AF37,
        distance: 340,
        speed: 0.008,
        ringConfig: {
        },
        moons: {
            count: 4,
            size: 3,
            distance: 30
        }
    },
    {
        name: 'saturn',
        size: 21,
        color: 0xF4A460,
        distance: 450,
        speed: 0.006,
        ringConfig: {
            innerRadius: 30,
            outerRadius: 45,
            color: 0xB0A07D,
            inclination: Math.PI/4
        },
        moons: {
            count: 7,
            size: 2,
            distance: 25
        }
    },
    {
        name: 'uranus',
        size: 18,
        color: 0x40E0D0,
        distance: 550,
        speed: 0.004,
        ringConfig: {
            innerRadius: 22,
            outerRadius: 28,
            color: 0x778899,
            inclination: Math.PI/2
        },
        moons: {
            count: 5,
            size: 1.5,
            distance: 20
        }
    },
    {
        name: 'neptuno',
        size: 17,
        color: 0x4169E1,
        distance: 650,
        speed: 0.002,
        ringConfig: {
        },
        moons: {
            count: 2,
            size: 2,
            distance: 18
        }
    }
];

const planets = planetsConfig.map(config => {
    const planet = createPlanet(config.size, config.color, config.ringConfig);
    planet.userData = { angle: Math.random() * Math.PI * 2, speed: config.speed, distance: config.distance };

    if(config.moons) {
        for(let i = 0; i < config.moons.count; i++) {
            const moon = createPlanet(config.moons.size, 0x888888);
            const angle = (i / config.moons.count) * Math.PI * 2;
            moon.position.set(
                Math.cos(angle) * (config.size + config.moons.distance),
                0,
                Math.sin(angle) * (config.size + config.moons.distance)
            );
            moon.userData = { angle: angle, speed: 0.02 + Math.random() * 0.02 };
            planet.add(moon);
        }
    }

    scene.add(planet);
    return planet;
});

// Animación
function animate() {
    requestAnimationFrame(animate);
    
    sun.rotation.y += 0.002;
    
    planets.forEach(planet => {
        planet.userData.angle += planet.userData.speed;
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
        planet.rotation.y += 0.005;
        
        planet.children.forEach(child => {
            if(child instanceof THREE.Mesh) {
                child.userData.angle += child.userData.speed;
                child.position.x = Math.cos(child.userData.angle) * 
                    (planet.geometry.parameters.radius + child.geometry.parameters.radius * 10);
                child.position.z = Math.sin(child.userData.angle) * 
                    (planet.geometry.parameters.radius + child.geometry.parameters.radius * 10);
                child.rotation.y += 0.01;
            }
        });
    });
    
    scene.children.forEach(child => {
        if(child instanceof THREE.Group && child.userData){
            child.userData.intensity += child.userData.blinkSpeed;
            child.children[0].material.emissiveIntensity = 
                Math.abs(Math.sin(child.userData.intensity)) * 1.5 + 0.5;
            
            child.rotation.x += child.userData.rotationSpeed;
            child.rotation.y += child.userData.rotationSpeed * 0.8;
        }
    });
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
