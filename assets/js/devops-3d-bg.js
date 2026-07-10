
document.addEventListener('DOMContentLoaded', () => {
    // 1. Create a Master Container with z-index: -1 
    let masterContainer = document.getElementById('devops-3d-master');
    if (!masterContainer) {
        masterContainer = document.createElement('div');
        masterContainer.id = 'devops-3d-master';
        // The master container goes behind everything
        masterContainer.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none; overflow: hidden; background: transparent;';
        
        masterContainer.innerHTML = `
            <canvas id="devops-3d-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;"></canvas>
            <div id="devops-3d-labels" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2;"></div>
        `;
        document.body.insertBefore(masterContainer, document.body.firstChild);
    }

    // 2. Load Three.js
    if (typeof THREE === 'undefined') {
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
        script.onload = init3D;
        document.head.appendChild(script);
    } else {
        init3D();
    }

    
    

    function init3D() {
        const canvas = document.getElementById('devops-3d-canvas');
        const labelsContainer = document.getElementById('devops-3d-labels');
        if (!canvas || !labelsContainer) return;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 20;

        
        class InfinityCurve extends THREE.Curve {
            constructor(scale = 1) { super(); this.scale = scale; }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                // Classic DevOps Infinity Loop (Lemniscate of Bernoulli)
                const theta = t * 2 * Math.PI;
                const scaleFactor = 9.5;
                const denominator = 1 + Math.sin(theta) * Math.sin(theta);
                
                const x = (scaleFactor * Math.cos(theta)) / denominator;
                const y = (scaleFactor * Math.sin(theta) * Math.cos(theta)) / denominator;
                const z = 0; // Keep the core loop flat so it doesn't look like an 'M'
                
                return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
            }
        }


        const path = new InfinityCurve();
        const geometry = new THREE.TubeGeometry(path, 200, 0.25, 32, false);
        
        
        // Enhanced Solid Glowing Material with Dual-Tone Lighting Support
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, // Base color white to reflect lights
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.9, // Glass-like transparency
            ior: 1.5,
            thickness: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        // Add stunning dual-tone studio lighting
        const light1 = new THREE.PointLight(0x00f0ff, 5, 50); // Electric Cyan
        light1.position.set(-5, 5, 5);
        scene.add(light1);
        
        const light2 = new THREE.PointLight(0x7b42bc, 5, 50); // Deep Purple/Magenta
        light2.position.set(5, -5, 5);
        scene.add(light2);
        
        const ambientLight = new THREE.AmbientLight(0x222222);
        scene.add(ambientLight);

        
        
        const loop = new THREE.Mesh(geometry, material);
        // Set a perfect, static 3D tilt. No movement!
        const staticRotX = 0.35;
        const staticRotY = 0.0;
        const staticRotZ = 0.0;
        loop.rotation.set(staticRotX, staticRotY, staticRotZ);
        scene.add(loop);


        const particleCount = 200;
        const particleGeo = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleOffsets = new Float32Array(particleCount);
        for (let i = 0; i < particleCount; i++) particleOffsets[i] = Math.random();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        
        
        const particleMat = new THREE.PointsMaterial({
            color: 0x00f0ff, 
            size: 0.25, // Larger glowing particles
            transparent: true, 
            opacity: 0.9, 
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(particleGeo, particleMat);
        scene.add(particles);

        
        const lifecyclePhases = [
            "plan", "code", "build", "test", 
            "release", "deploy", "operate", "monitor"
        ];
        
        
        const labelElements = [];
        lifecyclePhases.forEach((text, i) => {
            const el = document.createElement('div');
            el.className = 'devops-3d-text-label';
            el.innerText = text;
            labelsContainer.appendChild(el);
            labelElements.push({ element: el, baseT: i / lifecyclePhases.length });

        });

        let time = 0;
        const tempV = new THREE.Vector3();

        function animate() {
            requestAnimationFrame(animate);
            time += 0.0012;

            
            // Give it a sleek 3D tilt, like a professional logo on a desk
            // The loop is completely STATIC. No dynamic rotation here.

            particles.rotation.set(staticRotX, staticRotY, staticRotZ);

            const positions = particles.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                let t = (time * 0.2 + particleOffsets[i]) % 1;
                const point = path.getPoint(t);
                positions[i*3] = point.x + (Math.random()-0.5)*0.5;
                positions[i*3+1] = point.y + (Math.random()-0.5)*0.5;
                positions[i*3+2] = point.z + (Math.random()-0.5)*0.5;
            }
            particles.geometry.attributes.position.needsUpdate = true;

            
            
            labelElements.forEach(label => {
                let t = (label.baseT + time * 0.08) % 1;
                path.getPoint(t, tempV);
                tempV.applyEuler(loop.rotation);
                tempV.project(camera);
                
                const x = (tempV.x * .5 + .5) * window.innerWidth;
                const y = (tempV.y * -.5 + .5) * window.innerHeight;
                
                // Completely removed faulty depth calculations. 
                // Draw text at 100% scale, 100% opacity, completely solid and visible.
                label.element.style.left = `${x}px`;
                label.element.style.top = `${y}px`;
                label.element.style.transform = 'translate(-50%, -50%)';
                label.element.style.opacity = 1;
                label.element.style.filter = 'none';
                label.element.style.color = '#a3be8c';
            });



            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
});
