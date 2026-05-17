        // Variables globales
        let scene, camera, renderer, controls, raycaster, mouse;
        let sun, planets = [], orbits = [], constellations = [], constellationLines = [];
        let galaxy, distantGalaxies = [], nebulas = [], starClusters = [];
        let showOrbits = true, showConstellations = true, showConstellationLines = true, 
            showGalaxy = true, showDistantGalaxies = true, showPlanetNames = false, 
            autoRotate = true, showNebulas = true, showNebulaShapes = true, showNebulaInfo = false,
            showGalaxyInfo = false;

        // Información de nebulosas reales con formas características
        const realNebulas = [
            {
                name: "Nebulosa del Águila (M16)",
                type: "Nebulosa de Emisión",
                constellation: "Serpens",
                distance: "7,000 ly",
                size: "70 x 55 ly",
                description: "Famosa por sus 'Pilares de la Creación', regiones de formación estelar.",
                shape: "pillars",
                color: {r: 0.4, g: 0.3, b: 0.8},
                scale: 15
            },
            {
                name: "Nebulosa de la Hélice (NGC 7293)",
                type: "Nebulosa Planetaria",
                constellation: "Aquarius",
                distance: "650 ly",
                size: "2.5 ly",
                description: "Una de las nebulosas planetarias más cercanas, forma de ojo cósmico.",
                shape: "helix",
                color: {r: 0.2, g: 0.6, b: 0.8},
                scale: 8
            },
            {
                name: "Nebulosa del Cangrejo (M1)",
                type: "Resto de Supernova",
                constellation: "Taurus",
                distance: "6,500 ly",
                size: "11 ly",
                description: "Restos de una supernova observada en 1054, con estructura filamentosa.",
                shape: "crab",
                color: {r: 0.7, g: 0.5, b: 0.3},
                scale: 6
            },
            {
                name: "Nebulosa de Orión (M42)",
                type: "Nebulosa de Emisión",
                constellation: "Orion",
                distance: "1,344 ly",
                size: "24 ly",
                description: "Una de las nebulosas más brillantes, visible a simple vista.",
                shape: "orion",
                color: {r: 0.3, g: 0.5, b: 0.9},
                scale: 12
            },
            {
                name: "Nebulosa de la Laguna (M8)",
                type: "Nebulosa de Emisión",
                constellation: "Sagittarius",
                distance: "4,100 ly",
                size: "110 x 50 ly",
                description: "Gran nube interestelar con un cúmulo estelar joven en su centro.",
                shape: "lagoon",
                color: {r: 0.8, g: 0.3, b: 0.5},
                scale: 20
            },
            {
                name: "Nebulosa de la Hormiga (Mz 3)",
                type: "Nebulosa Planetaria",
                constellation: "Norma",
                distance: "8,000 ly",
                size: "1.6 ly",
                description: "Nebulosa planetaria bipolar que se asemeja a una hormiga.",
                shape: "ant",
                color: {r: 0.9, g: 0.4, b: 0.2},
                scale: 4
            },
            {
                name: "Nebulosa del Anillo (M57)",
                type: "Nebulosa Planetaria",
                constellation: "Lyra",
                distance: "2,300 ly",
                size: "1.3 ly",
                description: "Nebulosa planetaria clásica con forma de anillo bien definido.",
                shape: "ring",
                color: {r: 0.3, g: 0.7, b: 0.9},
                scale: 3
            },
            {
                name: "Nebulosa del Casco de Thor (NGC 2359)",
                type: "Nebulosa de Emisión",
                constellation: "Canis Major",
                distance: "15,000 ly",
                size: "30 ly",
                description: "Nebulosa con forma de casco nórdico, creada por vientos estelares.",
                shape: "thor",
                color: {r: 0.5, g: 0.3, b: 0.8},
                scale: 10
            }
        ];

        // Información de galaxias reales
        const realGalaxies = [
            {
                name: "Vía Láctea",
                type: "Espiral Barrada",
                diameter: "100,000 ly",
                stars: "100-400 mil millones",
                constellation: "Sagitarius",
                distance: "Centro",
                description: "Nuestra galaxia hogar, una espiral barrada con cuatro brazos principales."
            },
            {
                name: "Andrómeda (M31)",
                type: "Espiral",
                diameter: "220,000 ly",
                stars: "1 billón",
                constellation: "Andrómeda",
                distance: "2.5 millones de ly",
                description: "Galaxia espiral más cercana, en curso de colisión con la Vía Láctea."
            }
        ];

        // Constelaciones zodiacales y otras importantes
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
        },
            { 
                name: "Osa Mayor",
                pattern: [
                    {x:0,y:0,z:0}, {x:40,y:25,z:5}, {x:80,y:10,z:-2}, {x:120,y:30,z:4},
                    {x:100,y:60,z:-3}, {x:60,y:70,z:2}, {x:20,y:50,z:-1}
                ],
                color: 0x4FC3F7,
                lineIndices: [0,1,2,3,4,5,6,0]
            },
            { 
                name: "Osa Menor",
                pattern: [
                    {x:0,y:0,z:0}, {x:15,y:20,z:3}, {x:30,y:35,z:-1}, {x:45,y:25,z:4},
                    {x:60,y:40,z:-2}, {x:75,y:30,z:3}, {x:90,y:45,z:0}
                ],
                color: 0x80DEEA,
                lineIndices: [0,1,2,3,4,5,6]
            },
            { 
                name: "Orión",
                pattern: [
                    {x:0,y:0,z:0}, {x:30,y:50,z:5}, {x:60,y:0,z:-3}, {x:45,y:25,z:4},
                    {x:15,y:25,z:-2}, {x:75,y:40,z:3}, {x:90,y:10,z:-1}
                ],
                color: 0xFF5252,
                lineIndices: [0,1,2,0,3,4,1,5,6]
            },
            { 
                name: "Casiopea",
                pattern: [
                    {x:0,y:0,z:0}, {x:25,y:35,z:4}, {x:50,y:10,z:-2}, {x:75,y:40,z:3},
                    {x:100,y:15,z:-1}
                ],
                color: 0xCE93D8,
                lineIndices: [0,1,2,3,4]
            }
        ];

        // Inicialización
        function init() {
            // Escena
            scene = new THREE.Scene();
            
            // Cámara
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);
            camera.position.set(0, 300, 600);

            // Renderizador
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            document.getElementById('container').appendChild(renderer.domElement);

            // Controles
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = autoRotate;
            controls.autoRotateSpeed = 0.5;
            controls.minDistance = 50;
            controls.maxDistance = 50000;

            // Raycaster para interacción
            raycaster = new THREE.Raycaster();
            mouse = new THREE.Vector2();

            // Iluminación
            const ambientLight = new THREE.AmbientLight(0x404040);
            scene.add(ambientLight);

            // Crear elementos
            createRealisticStarField();
            createMilkyWayGalaxy();
            createRealDistantGalaxies();
            createShapedNebulas();
            createSun();
            createPlanets();
            createOrbits();
            createConstellations();

            // Configurar eventos
            setupEventListeners();

            // Iniciar animación
            animate();
        }

        // Campo de estrellas realista
        function createRealisticStarField() {
            const starCount = 50000;
            const geometry = new THREE.BufferGeometry();
            const positions = [];
            const colors = [];
            const sizes = [];
            
            for(let i = 0; i < starCount; i++) {
                const r = 5000 * Math.sqrt(Math.random());
                const theta = Math.random() * Math.PI * 2;
                const z = (Math.random() - 0.5) * 500;
                
                positions.push(
                    r * Math.cos(theta),
                    z,
                    r * Math.sin(theta)
                );
                
                const spectralType = Math.random();
                let color;
                if (spectralType < 0.001) {
                    color = new THREE.Color(0x9bb0ff);
                } else if (spectralType < 0.01) {
                    color = new THREE.Color(0xaabfff);
                } else if (spectralType < 0.08) {
                    color = new THREE.Color(0xcad7ff);
                } else if (spectralType < 0.3) {
                    color = new THREE.Color(0xf8f7ff);
                } else if (spectralType < 0.7) {
                    color = new THREE.Color(0xfff4ea);
                } else if (spectralType < 0.95) {
                    color = new THREE.Color(0xffd2a1);
                } else {
                    color = new THREE.Color(0xffcc6f);
                }
                
                colors.push(color.r, color.g, color.b);
                sizes.push(0.5 + Math.random() * 2);
            }
            
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
            
            const starMaterial = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 1,
                sizeAttenuation: true
            });
            
            const starField = new THREE.Points(geometry, starMaterial);
            scene.add(starField);
        }

        // Vía Láctea realista
        function createMilkyWayGalaxy() {
            const galaxyGroup = new THREE.Group();
            
            const diskRadius = 50000;
            const diskHeight = 1000;
            const bulgeRadius = 8000;
            
            // Disco galáctico
            createGalacticDisk(galaxyGroup, diskRadius, diskHeight);
            
            // Bulbo central
            createGalacticBulge(galaxyGroup, bulgeRadius);
            
            // Brazos espirales
            createSpiralArms(galaxyGroup, diskRadius);
            
            galaxyGroup.position.set(0, 0, 0);
            scene.add(galaxyGroup);
            
            galaxy = galaxyGroup;
        }

        function createGalacticDisk(group, radius, height) {
            const particleCount = 80000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const r = radius * Math.sqrt(Math.random());
                const theta = Math.random() * Math.PI * 2;
                const z = (Math.random() - 0.5) * height * Math.exp(-r / (radius * 0.3));
                
                positions[i3] = Math.cos(theta) * r;
                positions[i3 + 1] = z;
                positions[i3 + 2] = Math.sin(theta) * r;
                
                let color;
                if (r < 10000) {
                    color = new THREE.Color().setHSL(0.05, 0.7, 0.4 + Math.random() * 0.2);
                } else {
                    if (Math.random() < 0.3) {
                        color = new THREE.Color().setHSL(0.6, 0.8, 0.5 + Math.random() * 0.3);
                    } else {
                        color = new THREE.Color().setHSL(0.1, 0.5, 0.4 + Math.random() * 0.3);
                    }
                }
                
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
            }
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 2,
                vertexColors: true,
                transparent: true,
                opacity: 0.8,
                sizeAttenuation: true
            });
            
            const disk = new THREE.Points(geometry, material);
            group.add(disk);
        }

        function createGalacticBulge(group, radius) {
            const particleCount = 20000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const r = radius * Math.cbrt(Math.random());
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                positions[i3] = r * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
                positions[i3 + 2] = r * Math.cos(phi);
                
                const color = new THREE.Color().setHSL(0.03, 0.8, 0.3 + Math.random() * 0.2);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
            }
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 2.5,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                sizeAttenuation: true
            });
            
            const bulge = new THREE.Points(geometry, material);
            group.add(bulge);
        }

        function createSpiralArms(group, diskRadius) {
            const arms = [
                { angleOffset: 0, width: 0.15, tightness: 0.3 },
                { angleOffset: Math.PI * 0.5, width: 0.12, tightness: 0.35 },
                { angleOffset: Math.PI, width: 0.18, tightness: 0.25 },
                { angleOffset: Math.PI * 1.5, width: 0.16, tightness: 0.3 }
            ];
            
            arms.forEach(arm => {
                createSpiralArm(group, arm, diskRadius);
            });
        }

        function createSpiralArm(group, arm, diskRadius) {
            const particleCount = 10000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const r = 3000 + Math.random() * (diskRadius - 3000);
                const angle = arm.angleOffset + arm.tightness * Math.log(r / 3000);
                const armWidth = arm.width * r;
                const radialOffset = (Math.random() - 0.5) * armWidth;
                
                const finalR = r + radialOffset;
                const finalAngle = angle + (radialOffset / armWidth) * 0.5;
                const z = (Math.random() - 0.5) * 200 * Math.exp(-finalR / (diskRadius * 0.4));
                
                positions[i3] = Math.cos(finalAngle) * finalR;
                positions[i3 + 1] = z;
                positions[i3 + 2] = Math.sin(finalAngle) * finalR;
                
                const color = new THREE.Color().setHSL(0.6, 0.8, 0.5 + Math.random() * 0.3);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
            }
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 1.8,
                vertexColors: true,
                transparent: true,
                opacity: 0.7,
                sizeAttenuation: true
            });
            
            const spiralArm = new THREE.Points(geometry, material);
            group.add(spiralArm);
        }

        // Galaxias lejanas
        function createRealDistantGalaxies() {
            // Implementación simplificada
            const galaxyCount = 5;
            for (let i = 0; i < galaxyCount; i++) {
                const galaxyGroup = createSpiralGalaxy();
                const distance = 100000 + i * 50000;
                const angle = (i / galaxyCount) * Math.PI * 2;
                
                galaxyGroup.position.set(
                    Math.cos(angle) * distance,
                    (Math.random() - 0.5) * 30000,
                    Math.sin(angle) * distance
                );
                
                scene.add(galaxyGroup);
                distantGalaxies.push(galaxyGroup);
            }
        }

        function createSpiralGalaxy() {
            const group = new THREE.Group();
            
            // Crear una galaxia espiral simple
            const particleCount = 20000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            
            const galaxyRadius = 5000;
            const diskHeight = 200;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const r = galaxyRadius * Math.sqrt(Math.random());
                const theta = Math.random() * Math.PI * 2;
                const z = (Math.random() - 0.5) * diskHeight * Math.exp(-r / (galaxyRadius * 0.3));
                
                positions[i3] = Math.cos(theta) * r;
                positions[i3 + 1] = z;
                positions[i3 + 2] = Math.sin(theta) * r;
                
                const color = new THREE.Color().setHSL(0.6, 0.7, 0.4 + Math.random() * 0.3);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
            }
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            
            const material = new THREE.PointsMaterial({
                size: 3,
                vertexColors: true,
                transparent: true,
                opacity: 0.7,
                sizeAttenuation: true
            });
            
            const galaxy = new THREE.Points(geometry, material);
            group.add(galaxy);
            
            return group;
        }

        // Nebulosas con formas realistas
        function createShapedNebulas() {
            realNebulas.forEach((nebulaInfo, index) => {
                const nebulaGroup = createNebulaWithShape(nebulaInfo);
                
                // Distribuir las nebulosas alrededor de la galaxia
                const angle = (index / realNebulas.length) * Math.PI * 2;
                const radius = 15000 + Math.random() * 10000;
                const height = (Math.random() - 0.5) * 5000;
                
                nebulaGroup.position.set(
                    Math.cos(angle) * radius,
                    height,
                    Math.sin(angle) * radius
                );
                
                // Rotación aleatoria
                nebulaGroup.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                
                nebulaGroup.userData = {
                    name: nebulaInfo.name,
                    info: nebulaInfo,
                    type: 'nebula'
                };
                
                scene.add(nebulaGroup);
                nebulas.push(nebulaGroup);
            });
        }

        function createNebulaWithShape(nebulaInfo) {
            const group = new THREE.Group();
            
            switch(nebulaInfo.shape) {
                case "pillars":
                    createPillarsNebula(group, nebulaInfo);
                    break;
                case "helix":
                    createHelixNebula(group, nebulaInfo);
                    break;
                case "ring":
                    createRingNebula(group, nebulaInfo);
                    break;
                case "orion":
                    createOrionNebula(group, nebulaInfo);
                    break;
                case "crab":
                    createCrabNebula(group, nebulaInfo);
                    break;
                case "lagoon":
                    createLagoonNebula(group, nebulaInfo);
                    break;
                case "ant":
                    createAntNebula(group, nebulaInfo);
                    break;
                case "thor":
                    createThorNebula(group, nebulaInfo);
                    break;
                default:
                    createGenericNebula(group, nebulaInfo);
            }
            
            return group;
        }

        function createPillarsNebula(group, info) {
            // Nebulosa del Águila - Pilares de la Creación
            const baseColor = new THREE.Color(info.color.r, info.color.g, info.color.b);
            const scale = info.scale;
            
            // Crear pilares principales
            const pillarCount = 3;
            for (let i = 0; i < pillarCount; i++) {
                const height = 20 + Math.random() * 10;
                const radius = 2 + Math.random() * 1;
                const segments = 32;
                
                const geometry = new THREE.CylinderGeometry(radius, radius * 1.5, height, segments);
                const material = new THREE.MeshPhongMaterial({
                    color: baseColor,
                    emissive: baseColor,
                    emissiveIntensity: 0.3,
                    transparent: true,
                    opacity: 0.6,
                    side: THREE.DoubleSide
                });
                
                const pillar = new THREE.Mesh(geometry, material);
                pillar.position.set(
                    (i - 1) * 8,
                    height * 0.5 - 5,
                    0
                );
                pillar.rotation.x = Math.PI * 0.1;
                pillar.rotation.z = Math.PI * 0.05 * (i - 1);
                
                group.add(pillar);
            }
            
            // Nube base
            const cloudGeometry = new THREE.SphereGeometry(15, 32, 32);
            const cloudMaterial = new THREE.MeshPhongMaterial({
                color: baseColor,
                emissive: baseColor,
                emissiveIntensity: 0.2,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.scale.set(1, 0.3, 1);
            group.add(cloud);
            
            group.scale.setScalar(scale);
        }

        function createHelixNebula(group, info) {
            // Nebulosa de la Hélice - Forma de ojo
            const baseColor = new THREE.Color(info.color.r, info.color.g, info.color.b);
            const scale = info.scale;
            
            // Anillo principal
            const ringGeometry = new THREE.TorusGeometry(8, 3, 16, 100);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: baseColor,
                emissive: baseColor,
                emissiveIntensity: 0.4,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
            
            // Centro brillante
            const centerGeometry = new THREE.SphereGeometry(2, 32, 32);
            const centerMaterial = new THREE.MeshPhongMaterial({
                color: baseColor,
                emissive: baseColor,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.9
            });
            
            const center = new THREE.Mesh(centerGeometry, centerMaterial);
            group.add(center);
            
            group.scale.setScalar(scale);
        }

        function createRingNebula(group, info) {
            // Nebulosa del Anillo - Forma de donut perfecto
            const baseColor = new THREE.Color(info.color.r, info.color.g, info.color.b);
            const scale = info.scale;
            
            const ringGeometry = new THREE.TorusGeometry(5, 2, 16, 100);
            const ringMaterial = new THREE.MeshPhongMaterial({
                color: baseColor,
                emissive: baseColor,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2;
            group.add(ring);
            
            group.scale.setScalar(scale);
        }

        function createOrionNebula(group, info) {
            // Nebulosa de Orión - Gran nube de formación estelar
            const baseColor = new THREE.Color(info.color.r, info.color.g, info.color.b);
            const scale = info.scale;
            
            // Nube principal irregular
            const cloudPoints = [];
            const cloudGeometry = new THREE.BufferGeometry();
            
            for (let i = 0; i < 5000; i++) {
                const radius = 10 * Math.cbrt(Math.random());
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                
                // Forma irregular
                const irregularity = 0.8 + Math.random() * 0.4;
                
                cloudPoints.push(
                    radius * Math.sin(phi) * Math.cos(theta) * irregularity,
                    radius * Math.sin(phi) * Math.sin(theta) * irregularity * 0.5,
                    radius * Math.cos(phi) * irregularity
                );
            }
            
            cloudGeometry.setAttribute('position', new THREE.Float32BufferAttribute(cloudPoints, 3));
            
            const cloudMaterial = new THREE.PointsMaterial({
                size: 0.5,
                color: baseColor,
                transparent: true,
                opacity: 0.7,
                sizeAttenuation: true,
                blending: THREE.AdditiveBlending
            });
            
            const cloud = new THREE.Points(cloudGeometry, cloudMaterial);
            group.add(cloud);
            
            // Regiones brillantes centrales
            const brightGeometry = new THREE.SphereGeometry(3, 32, 32);
            const brightMaterial = new THREE.MeshPhongMaterial({
                color: baseColor,
                emissive: baseColor,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.9
            });
            
            const brightRegion = new THREE.Mesh(brightGeometry, brightMaterial);
            group.add(brightRegion);
            
            group.scale.setScalar(scale);
        }

        function createCrabNebula(group, info) {
            // Nebulosa del Cangrejo - Estructura filamentosa
            const baseColor = new THREE.Color(info.color.r, info.color.g, info.color.b);
            const scale = info.scale;
            
            // Crear estructura filamentosa
            const filaments = [];
            const filamentCount = 50;
            
            for (let i = 0; i < filamentCount; i++) {
                const filamentGeometry = new THREE.BufferGeometry();
                const points = [];
                
                const startAngle = Math.random() * Math.PI * 2;
                const length = 5 + Math.random() * 8;
                const segments = 20;
                
                for (let j = 0; j <= segments; j++) {
                    const t = j / segments;
                    const angle = startAngle + t * Math.PI * 0.5;
                    const radius = 3 + t * length;
                    const height = (Math.random() - 0.5) * 2;
                    
                    points.push(
                        Math.cos(angle) * radius,
                        height,
                        Math.sin(angle) * radius
                    );
                }
                
                filamentGeometry.setFromPoints(points.map(p => new THREE.Vector3(p[0], p[1], p[2])));
                
                const filamentMaterial = new THREE.LineBasicMaterial({
                    color: baseColor,
                    transparent: true,
                    opacity: 0.6,
                    linewidth: 2
                });
                
                const filament = new THREE.Line(filamentGeometry, filamentMaterial);
                filaments.push(filament);
            }
            
            filaments.forEach(filament => group.add(filament));
            
            group.scale.setScalar(scale);
        }

        function createLagoonNebula(group, info) {
            // Nebulosa de la Laguna - Gran nube con "laguna" central
            const baseColor = new THREE.Color(info.color.r, info.color.g, info.color.b);
            const scale = info.scale;
            
            // Nube principal con hueco
            const cloudGeometry = new THREE.SphereGeometry(12, 32, 32);
            const cloudMaterial = new THREE.MeshPhongMaterial({
                color: baseColor,
                emissive: baseColor,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            
            // Crear hueco en el centro
            const holeGeometry = new THREE.SphereGeometry(4, 32, 32);
            const hole = new THREE.Mesh(holeGeometry);
            hole.position.set(3, 0, 0);
            
            group.add(cloud);
            group.add(hole);
            
            group.scale.setScalar(scale);
        }

        function createAntNebula(group, info) {
            // Nebulosa de la Hormiga - Forma bipolar
            const baseColor = new THREE.Color(info.color.r, info.color.g, info.color.b);
            const scale = info.scale;
            
            // Lóbulos bipolares
            const lobeGeometry = new THREE.SphereGeometry(4, 32, 32);
            const lobeMaterial = new THREE.MeshPhongMaterial({
                color: baseColor,
                emissive: baseColor,
                emissiveIntensity: 0.4,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            
            const lobe1 = new THREE.Mesh(lobeGeometry, lobeMaterial);
            lobe1.position.set(0, 6, 0);
            lobe1.scale.set(1, 1.5, 1);
            
            const lobe2 = new THREE.Mesh(lobeGeometry, lobeMaterial);
            lobe2.position.set(0, -6, 0);
            lobe2.scale.set(1, 1.5, 1);
            
            // Cintura central
            const waistGeometry = new THREE.TorusGeometry(3, 1, 16, 100);
            const waist = new THREE.Mesh(waistGeometry, lobeMaterial);
            waist.rotation.x = Math.PI / 2;
            
            group.add(lobe1);
            group.add(lobe2);
            group.add(waist);
            
            group.scale.setScalar(scale);
        }

        function createThorNebula(group, info) {
            // Nebulosa del Casco de Thor - Forma de casco con cuernos
            const baseColor = new THREE.Color(info.color.r, info.color.g, info.color.b);
            const scale = info.scale;
            
            // Casco principal
            const helmetGeometry = new THREE.SphereGeometry(6, 32, 32);
            const helmetMaterial = new THREE.MeshPhongMaterial({
                color: baseColor,
                emissive: baseColor,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide
            });
            
            const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
            helmet.scale.set(1, 0.7, 1);
            group.add(helmet);
            
            // Cuernos
            const hornGeometry = new THREE.ConeGeometry(1, 8, 32);
            const horn1 = new THREE.Mesh(hornGeometry, helmetMaterial);
            horn1.position.set(3, 4, 0);
            horn1.rotation.z = -Math.PI / 6;
            
            const horn2 = new THREE.Mesh(hornGeometry, helmetMaterial);
            horn2.position.set(-3, 4, 0);
            horn2.rotation.z = Math.PI / 6;
            
            group.add(horn1);
            group.add(horn2);
            
            group.scale.setScalar(scale);
        }

        function createGenericNebula(group, info) {
            // Nebulosa genérica como fallback
            const baseColor = new THREE.Color(info.color.r, info.color.g, info.color.b);
            const scale = info.scale;
            
            const geometry = new THREE.SphereGeometry(8, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: baseColor,
                emissive: baseColor,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            
            const nebula = new THREE.Mesh(geometry, material);
            group.add(nebula);
            
            group.scale.setScalar(scale);
        }

        // Sistema Solar
        function createSun() {
            const sunGeometry = new THREE.SphereGeometry(60, 64, 64);
            const sunMaterial = new THREE.MeshPhongMaterial({
                color: 0xFFD700,
                emissive: 0xFFA500,
                emissiveIntensity: 0.9,
                specular: 0xFFFF00
            });
            sun = new THREE.Mesh(sunGeometry, sunMaterial);
            
            const sunLight = new THREE.PointLight(0xFFFFFF, 2, 3000);
            sun.add(sunLight);
            
            scene.add(sun);
        }

        function createPlanets() {
            const planetsConfig = [
                {
                    name: 'Mercurio',
                    size: 3.8,
                    color: 0x808080,
                    distance: 80,
                    speed: 0.02,
                    ringConfig: null,
                    moons: {}
                },
                {
                    name: 'Venus',
                    size: 9.5,
                    color: 0xFFD700,
                    distance: 100,
                    speed: 0.015,
                    ringConfig: null,
                    moons: {}
                },
                {
                    name: 'Tierra',
                    size: 10,
                    color: 0x0066CC,
                    distance: 150,
                    speed: 0.012,
                    ringConfig: null,
                    moons: {
                        count: 1,
                        size: 2,
                        distance: 15
                    }
                },
                {
                    name: 'Marte',
                    size: 5.3,
                    color: 0xFF4500,
                    distance: 200,
                    speed: 0.01,
                    ringConfig: null,
                    moons: {
                        count: 2,
                        size: 1,
                        distance: 10
                    }
                },
                {
                    name: 'Júpiter',
                    size: 25,
                    color: 0xD4AF37,
                    distance: 340,
                    speed: 0.008,
                    ringConfig: null,
                    moons: {
                        count: 4,
                        size: 3,
                        distance: 30
                    }
                },
                {
                    name: 'Saturno',
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
                    name: 'Urano',
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
                    name: 'Neptuno',
                    size: 17,
                    color: 0x4169E1,
                    distance: 650,
                    speed: 0.002,
                    ringConfig: null,
                    moons: {
                        count: 2,
                        size: 2,
                        distance: 18
                    }
                }
            ];

            planetsConfig.forEach(config => {
                const planet = createPlanet(config);
                planet.userData = { 
                    angle: Math.random() * Math.PI * 2, 
                    speed: config.speed, 
                    distance: config.distance,
                    name: config.name
                };

                if(config.moons && config.moons.count > 0) {
                    for(let i = 0; i < config.moons.count; i++) {
                        const moon = createPlanet({
                            size: config.moons.size,
                            color: 0x888888,
                            name: `Luna ${i+1}`
                        });
                        const angle = (i / config.moons.count) * Math.PI * 2;
                        moon.position.set(
                            Math.cos(angle) * (config.size + config.moons.distance),
                            0,
                            Math.sin(angle) * (config.size + config.moons.distance)
                        );
                        moon.userData = { 
                            angle: angle, 
                            speed: 0.02 + Math.random() * 0.02,
                            distance: config.size + config.moons.distance
                        };
                        planet.add(moon);
                    }
                }

                scene.add(planet);
                planets.push(planet);
            });
        }

        function createPlanet(config) {
            const planet = new THREE.Mesh(
                new THREE.SphereGeometry(config.size, 32, 32),
                new THREE.MeshPhongMaterial({
                    color: config.color,
                    shininess: 10
                })
            );
            
            if(config.ringConfig) {
                const ringGeometry = new THREE.RingGeometry(
                    config.ringConfig.innerRadius,
                    config.ringConfig.outerRadius,
                    64
                );
                const ringMaterial = new THREE.MeshPhongMaterial({
                    color: config.ringConfig.color,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7
                });
                const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                rings.rotation.x = config.ringConfig.inclination;
                planet.add(rings);
            }
            
            return planet;
        }
        
        function createOrbits() {
            planets.forEach(planet => {
                const orbitGeometry = new THREE.RingGeometry(
                    planet.userData.distance - 0.5,
                    planet.userData.distance + 0.5,
                    128
                );
                const orbitMaterial = new THREE.MeshBasicMaterial({
                    color: 0x444444,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.3
                });
                const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbit.rotation.x = Math.PI / 2;
                scene.add(orbit);
                orbits.push(orbit);
            });
        }

        // Cinturón de asteroides
        function createAsteroidBelt() {
            const asteroidCount = 2000;
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(asteroidCount * 3);
            const colors = new Float32Array(asteroidCount * 3);
            const sizes = new Float32Array(asteroidCount);
            
            const innerRadius = 250;
            const outerRadius = 300;
            const thickness = 10;
            
            for(let i = 0; i < asteroidCount; i++) {
                const i3 = i * 3;
                
                const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
                const angle = Math.random() * Math.PI * 2;
                const height = (Math.random() - 0.5) * thickness;
                
                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 1] = height;
                positions[i3 + 2] = Math.sin(angle) * radius;
                
                // Colores de asteroides (grises/marrones)
                const color = new THREE.Color().setHSL(
                    0.07, 
                    0.3, 
                    0.3 + Math.random() * 0.3
                );
                
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
                
                sizes[i] = Math.random() * 1.5 + 0.5;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const asteroidBelt = new THREE.Points(
                geometry,
                new THREE.PointsMaterial({
                    size: 2,
                    vertexColors: true,
                    sizeAttenuation: true
                })
            );
            
            scene.add(asteroidBelt);
            asteroidBelt.visible = showAsteroids;
        }

        // Constelaciones mejoradas con estrellas y trazado separados
        function createConstellations() {
            const allConstellations = [
                { // Osa Mayor
                    name: "Ursa Major",
                    pattern: [
                        {x:0,y:0,z:0}, {x:40,y:10,z:5}, {x:80,y:0,z:0}, {x:120,y:20,z:-5},
                        {x:100,y:60,z:5}, {x:60,y:70,z:0}, {x:20,y:50,z:-3}
                    ],
                    color: 0x4FC3F7,
                    stars: 7,
                    lineIndices: [0,1,2,3,4,5,6,0] // Para conectar en forma de carro
                },
                { // Osa Menor
                    name: "Ursa Minor",
                    pattern: [
                        {x:0,y:0,z:0}, {x:15,y:25,z:3}, {x:30,y:40,z:-2}, {x:45,y:30,z:4},
                        {x:60,y:45,z:-1}, {x:75,y:35,z:2}, {x:90,y:50,z:0}
                    ],
                    color: 0x80DEEA,
                    stars: 7,
                    lineIndices: [0,1,2,3,4,5,6] // Para formar la cola
                },
                { // Orión
                    name: "Orion",
                    pattern: [
                        {x:0,y:0,z:0}, {x:30,y:50,z:5}, {x:60,y:0,z:-3}, {x:45,y:25,z:4},
                        {x:15,y:25,z:-2}, {x:75,y:40,z:3}, {x:90,y:10,z:-1}
                    ],
                    color: 0xFF5252,
                    stars: 7,
                    lineIndices: [0,1,2,0,3,4,1,5,6]
                },
                { // Casiopea
                    name: "Cassiopeia",
                    pattern: [
                        {x:0,y:0,z:0}, {x:25,y:35,z:4}, {x:50,y:10,z:-2}, {x:75,y:40,z:3},
                        {x:100,y:15,z:-1}
                    ],
                    color: 0xCE93D8,
                    stars: 5,
                    lineIndices: [0,1,2,3,4]
                },
                { // Lyra
                    name: "Lyra",
                    pattern: [
                        {x:0,y:0,z:0}, {x:20,y:30,z:3}, {x:40,y:0,z:-2}, {x:20,y:-25,z:2},
                        {x:0,y:0,z:0}, {x:10,y:15,z:1}
                    ],
                    color: 0xFFEB3B,
                    stars: 6,
                    lineIndices: [0,1,2,3,0,4,5]
                }
            ];

            // Generar constelaciones
            for(let i = 0; i < 15; i++) {
                const type = allConstellations[Math.floor(Math.random() * allConstellations.length)];
                const constellation = createConstellation(type);
                constellation.rotation.set(
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2
                );
                scene.add(constellation);
                constellations.push(constellation);
            }
        }

        function createConstellation(type) {
            const group = new THREE.Group();
            
            const basePosition = new THREE.Vector3(
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000,
                (Math.random() - 0.5) * 3000
            );

            // Crear estrellas individuales con diferentes intensidades
            type.pattern.forEach((pos, i) => {
                const starSize = 0.8 + Math.random() * 1.2;
                const intensity = 0.5 + Math.random() * 1.5; // Diferente intensidad para cada estrella
                
                const starGeometry = new THREE.SphereGeometry(starSize, 12, 12);
                const starMaterial = new THREE.MeshPhongMaterial({
                    color: type.color,
                    emissive: type.color,
                    emissiveIntensity: intensity,
                    specular: 0xFFFFFF,
                    shininess: 100
                });
                
                const variation = new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10
                );

                const starPosition = basePosition.clone()
                    .add(new THREE.Vector3(pos.x, pos.y, pos.z))
                    .add(variation);

                const star = new THREE.Mesh(starGeometry, starMaterial);
                star.position.copy(starPosition);
                
                star.userData = {
                    blinkSpeed: 0.01 + Math.random() * 0.03,
                    intensity: intensity,
                    baseIntensity: intensity
                };
                
                group.add(star);
            });

            // Crear líneas de conexión entre estrellas
            const lineMaterial = new THREE.LineBasicMaterial({
                color: type.color,
                transparent: true,
                opacity: 0.6
            });

            const linePoints = [];
            type.lineIndices.forEach(index => {
                const pos = type.pattern[index];
                const variation = new THREE.Vector3(
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10
                );
                
                const pointPosition = basePosition.clone()
                    .add(new THREE.Vector3(pos.x, pos.y, pos.z))
                    .add(variation);
                    
                linePoints.push(pointPosition);
            });

            const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
            const lines = new THREE.Line(lineGeometry, lineMaterial);
            group.add(lines);
            constellationLines.push(lines);
            
            group.userData = {
                rotationSpeed: (Math.random() - 0.5) * 0.002
            };
            
            return group;
        }

        // Configurar eventos
        function setupEventListeners() {
            window.addEventListener('resize', onWindowResize);
            window.addEventListener('click', onMouseClick, false);
            
            // Configurar el botón de mostrar/ocultar controles
            document.getElementById('toggle-controls').addEventListener('click', function() {
                const controlsPanel = document.getElementById('controls');
                controlsPanel.style.display = controlsPanel.style.display === 'block' ? 'none' : 'block';
            });
            
            setupControlListeners();
        }

        function setupControlListeners() {
            const controlIds = [
                'showOrbits', 'showPlanetNames', 'autoRotate', 'showConstellations',
                'showConstellationLines', 'showGalaxy', 'showDistantGalaxies', 
                'showGalaxyInfo', 'showNebulas', 'showNebulaShapes', 'showNebulaInfo'
            ];
            
            controlIds.forEach(controlId => {
                const element = document.getElementById(controlId);
                if (element) {
                    element.addEventListener('change', function() {
                        window[controlId] = this.checked;
                        updateVisibility();
                    });
                }
            });
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function onMouseClick(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            
            if (intersects.length > 0) {
                const object = intersects[0].object;
                let info = null;
                let type = '';
                
                let currentObject = object;
                while (currentObject && !info) {
                    if (currentObject.userData && currentObject.userData.info) {
                        info = currentObject.userData.info;
                        type = currentObject.userData.type;
                    }
                    currentObject = currentObject.parent;
                }
                
                if (info && ((type === 'nebula' && showNebulaInfo) || (type === 'galaxy' && showGalaxyInfo))) {
                    showObjectInformation(info, type, event.clientX, event.clientY);
                }
            }
        }

        function showObjectInformation(info, type, x, y) {
            const infoDiv = document.getElementById('object-info');
            let content = '';
            
            if (type === 'nebula') {
                content = `
                    <h4>${info.name}</h4>
                    <p><strong>Tipo:</strong> ${info.type}</p>
                    <p><strong>Constelación:</strong> ${info.constellation}</p>
                    <p><strong>Distancia:</strong> ${info.distance}</p>
                    <p><strong>Tamaño:</strong> ${info.size}</p>
                    <p>${info.description}</p>
                `;
            } else {
                content = `
                    <h4>${info.name}</h4>
                    <p><strong>Tipo:</strong> ${info.type}</p>
                    <p><strong>Diámetro:</strong> ${info.diameter}</p>
                    <p><strong>Estrellas:</strong> ${info.stars}</p>
                    <p><strong>Constelación:</strong> ${info.constellation}</p>
                    <p><strong>Distancia:</strong> ${info.distance}</p>
                    <p>${info.description}</p>
                `;
            }
            
            infoDiv.innerHTML = content;
            infoDiv.style.left = (x + 10) + 'px';
            infoDiv.style.top = (y + 10) + 'px';
            infoDiv.style.display = 'block';
            
            setTimeout(() => {
                infoDiv.style.display = 'none';
            }, 5000);
        }

        function updateVisibility() {
            updateOrbitsVisibility();
            updateConstellationsVisibility();
            updateConstellationLinesVisibility();
            updateGalaxyVisibility();
            updateDistantGalaxiesVisibility();
            updateNebulasVisibility();
            controls.autoRotate = autoRotate;
        }

        function updateOrbitsVisibility() {
            orbits.forEach(orbit => {
                orbit.visible = showOrbits;
            });
        }

        function updateConstellationsVisibility() {
            constellations.forEach(constellation => {
                constellation.visible = showConstellations;
                // Las estrellas siempre son visibles si la constelación está visible
                constellation.children.forEach(child => {
                    if (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry) {
                        child.visible = showConstellations;
                    }
                });
            });
        }

        function updateConstellationLinesVisibility() {
            constellationLines.forEach(line => {
                line.visible = showConstellationLines;
            });
        }

        function updateGalaxyVisibility() {
            if (galaxy) {
                galaxy.visible = showGalaxy;
            }
        }

        function updateDistantGalaxiesVisibility() {
            distantGalaxies.forEach(galaxy => {
                galaxy.visible = showDistantGalaxies;
            });
        }

        function updateNebulasVisibility() {
            nebulas.forEach(nebula => {
                nebula.visible = showNebulas;
                if (showNebulaShapes !== undefined) {
                    nebula.children.forEach(child => {
                        child.visible = showNebulaShapes;
                    });
                }
            });
        }

        // Animación
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotación del sol
            sun.rotation.y += 0.002;
            
            // Movimiento de planetas
            planets.forEach(planet => {
                if (planet.userData) {
                    planet.userData.angle += planet.userData.speed;
                    planet.position.x = Math.cos(planet.userData.angle) * planet.userData.distance;
                    planet.position.z = Math.sin(planet.userData.angle) * planet.userData.distance;
                    planet.rotation.y += 0.005;
                    
                    // Movimiento de lunas
                    planet.children.forEach(child => {
                        if(child instanceof THREE.Mesh && child.userData) {
                            child.userData.angle += child.userData.speed;
                            child.position.x = Math.cos(child.userData.angle) * child.userData.distance;
                            child.position.z = Math.sin(child.userData.angle) * child.userData.distance;
                            child.rotation.y += 0.01;
                        }
                    });
                }
            });
            
            // Efecto de parpadeo en constelaciones
            constellations.forEach(constellation => {
                constellation.children.forEach(child => {
                    if(child instanceof THREE.Mesh && child.userData) {
                        child.userData.intensity += child.userData.blinkSpeed;
                        const intensity = Math.abs(Math.sin(child.userData.intensity)) * 0.5 + child.userData.baseIntensity;
                        child.material.emissiveIntensity = intensity;
                    }
                });
                
                if(constellation.userData){
                    constellation.rotation.x += constellation.userData.rotationSpeed;
                    constellation.rotation.y += constellation.userData.rotationSpeed * 0.7;
                }
            });
            
            // Rotación de galaxias
            if (galaxy) {
                galaxy.rotation.y += 0.00005;
            }
            
            distantGalaxies.forEach(galaxy => {
                galaxy.rotation.y += 0.00002;
            });
            
            // Animación sutil de nebulosas
            nebulas.forEach(nebula => {
                nebula.rotation.y += 0.0001;
                nebula.rotation.x += 0.00005;
            });
            
            controls.update();
            renderer.render(scene, camera);
        }

        // Iniciar la aplicación
        init();
