const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Iluminación mejorada
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Sol realista
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

// Fondo estelar mejorado
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
        
        // Colores estelares variables
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

// Constelaciones
const createConstellation = () => {
    const group = new THREE.Group();
    const starCount = 15;
    const starGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const starMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x7EC0EE,
        emissive: 0x3A5FCD,
        emissiveIntensity: 0.3
    });
    
    // Estrellas
    const stars = new THREE.InstancedMesh(starGeometry, starMaterial, starCount);
    const dummy = new THREE.Object3D();
    
    for(let i = 0; i < starCount; i++) {
        dummy.position.set(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );
        dummy.updateMatrix();
        stars.setMatrixAt(i, dummy.matrix);
    }
    
    // Líneas de conexión
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    
    for(let i = 0; i < starCount * 3; i++) {
        linePositions.push(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 2000
        );
    }
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(
        lineGeometry,
        new THREE.LineBasicMaterial({ 
            color: 0x3A5FCD,
            transparent: true,
            opacity: 0.0
        })
    );
    
    group.add(stars);
    group.add(lines);
    return group;
};

// Añadir múltiples constelaciones
for(let i = 0; i < 15; i++) {
    scene.add(createConstellation());
}

// Sistema planetario mejorado
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
        distance: 140,
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
        distance: 170,
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
        distance: 250,
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
        distance: 320,
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
        distance: 380,
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
        distance: 420,
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
    const planet = createPlanet(
        config.size,
        config.color,
        config.ringConfig
    );
    
    planet.userData = {
        angle: Math.random() * Math.PI * 2,
        speed: config.speed,
        distance: config.distance
    };
    
    // Añadir lunas
    for(let i = 0; i < config.moons.count; i++) {
        const moon = createPlanet(config.moons.size, 0x888888);
        const angle = (i / config.moons.count) * Math.PI * 2;
        moon.position.set(
            Math.cos(angle) * (config.size + config.moons.distance),
            0,
            Math.sin(angle) * (config.size + config.moons.distance)
        );
        moon.userData = {
            angle: angle,
            speed: 0.02 + Math.random() * 0.02
        };
        planet.add(moon);
    }
    
    scene.add(planet);
    return planet;
});

// Animación mejorada
function animate() {
    requestAnimationFrame(animate);
    
    // Rotación del Sol
    sun.rotation.y += 0.002;
    
    // Movimiento planetario
    planets.forEach(planet => {
        planet.userData.angle += planet.userData.speed;
        planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
        planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
        planet.rotation.y += 0.005;
        
        // Rotación de las lunas
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
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Manejo de redimensión
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
