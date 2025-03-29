import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * TechStackShowcase - An advanced 3D visualization of a tech stack using modern web technologies
 * Displays a dynamic 3D holographic tech stack visualization with floating tech logos and particles
 */
const TechStackShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsGroupRef = useRef<THREE.Group>(new THREE.Group());
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene with sophisticated setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Initialize camera with cinematic settings
    const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    camera.position.z = 7;
    camera.position.y = 1;
    cameraRef.current = camera;
    
    // Initialize high-quality renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      precision: 'highp'
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Rich color palette for tech theme
    const colors = {
      primary: 0xDFBD69,      // Royal Gold
      secondary: 0x4A225D,    // Royal Purple
      react: 0x61DAFB,        // React Blue
      node: 0x339933,         // Node.js Green
      javascript: 0xF7DF1E,   // JavaScript Yellow
      typescript: 0x3178C6,   // TypeScript Blue
      html: 0xE34F26,         // HTML Orange
      css: 0x1572B6,          // CSS Blue
      mysql: 0x4479A1,        // MySQL Blue
      three: 0x000000,        // Three.js Black
      accent1: 0xFF7D3B,      // Vibrant Orange
      accent2: 0x7E57C2,      // Purple
      highlight: 0xF72585     // Pink Highlight
    };
    
    // Create main group to hold all objects
    const mainGroup = new THREE.Group();
    objectsGroupRef.current = mainGroup;
    scene.add(mainGroup);
    
    // Create a central platform/base
    const createHolographicBase = () => {
      const baseGroup = new THREE.Group();
      
      // Create base platform
      const baseGeometry = new THREE.CylinderGeometry(2.8, 3.2, 0.15, 32, 1, false);
      const baseMaterial = new THREE.MeshPhysicalMaterial({
        color: colors.secondary,
        metalness: 0.8,
        roughness: 0.2, 
        transmission: 0.2,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.position.y = -1.5;
      base.receiveShadow = true;
      baseGroup.add(base);
      
      // Add glowing ring to the base
      const ringGeometry = new THREE.TorusGeometry(3, 0.1, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: colors.primary,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.y = -1.5;
      ring.rotation.x = Math.PI / 2;
      baseGroup.add(ring);
      
      // Add holographic grid lines on the platform
      const gridSize = 6;
      const gridDivisions = 20;
      const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions);
      const gridMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(colors.primary) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          float grid(vec2 uv, float size) {
            vec2 g = abs(fract(uv * size - 0.5) - 0.5) / fwidth(uv * size);
            return 1.0 - min(g.x, g.y);
          }
          
          void main() {
            float gridPattern = grid(vUv, 20.0);
            
            // Pulse effect
            float pulse = 0.5 + 0.5 * sin(time * 0.5);
            
            // Emissive glow that radiates from the center
            float distanceFromCenter = length(vUv - 0.5);
            float glow = smoothstep(0.5, 0.1, distanceFromCenter) * pulse * 0.5;
            
            // Circle scanner effect
            float scannerSize = 0.5;
            float scannerSpeed = 0.2;
            float scannerPos = mod(time * scannerSpeed, 1.5) - 0.25;
            float scanner = smoothstep(scannerPos - 0.05, scannerPos, distanceFromCenter) * 
                           smoothstep(scannerPos + 0.05, scannerPos, distanceFromCenter);
            
            float finalAlpha = mix(gridPattern * 0.3, 1.0, scanner * 0.7 + glow);
            
            gl_FragColor = vec4(color, finalAlpha);
            if (finalAlpha < 0.01) discard;
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      
      const grid = new THREE.Mesh(gridGeometry, gridMaterial);
      grid.position.y = -1.45;
      grid.rotation.x = -Math.PI / 2;
      baseGroup.add(grid);
      
      return baseGroup;
    };
    
    // Create holographic tech stack visualization
    const createTechStackHologram = () => {
      const hologramGroup = new THREE.Group();
      
      // Central core representing main technology
      const coreGeometry = new THREE.OctahedronGeometry(1, 1);
      const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: colors.react,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
        transmission: 0.3
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.castShadow = true;
      hologramGroup.add(core);
      
      // Core glow effect
      const coreGlowGeometry = new THREE.OctahedronGeometry(1.1, 1);
      const coreGlowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(colors.react) }
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          varying vec3 vNormal;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            float pulse = 0.5 + 0.5 * sin(time * 1.5);
            intensity *= mix(0.8, 1.2, pulse);
            gl_FragColor = vec4(color, intensity * 0.8);
          }
        `,
        transparent: true,
        depthWrite: false,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      const coreGlow = new THREE.Mesh(coreGlowGeometry, coreGlowMaterial);
      hologramGroup.add(coreGlow);
      
      // Create orbiting tech orbs
      const techOrbs = [
        { name: 'JavaScript', color: colors.javascript, radius: 0.35, distance: 2.2, speed: 0.4, orbitTilt: 0.1 },
        { name: 'Node.js', color: colors.node, radius: 0.38, distance: 2.5, speed: 0.35, orbitTilt: 0.6 },
        { name: 'TypeScript', color: colors.typescript, radius: 0.3, distance: 2.8, speed: 0.3, orbitTilt: -0.3 },
        { name: 'MySQL', color: colors.mysql, radius: 0.32, distance: 3.1, speed: 0.25, orbitTilt: 0.4 },
        { name: 'HTML', color: colors.html, radius: 0.28, distance: 3.4, speed: 0.2, orbitTilt: -0.5 },
        { name: 'CSS', color: colors.css, radius: 0.26, distance: 3.7, speed: 0.15, orbitTilt: 0.2 }
      ];
      
      techOrbs.forEach((tech, index) => {
        // Create orb
        const orbGeometry = new THREE.SphereGeometry(tech.radius, 24, 24);
        const orbMaterial = new THREE.MeshPhysicalMaterial({
          color: tech.color,
          metalness: 0.7,
          roughness: 0.3,
          transparent: true,
          transmission: 0.2,
          opacity: 0.9
        });
        
        const orb = new THREE.Mesh(orbGeometry, orbMaterial);
        orb.castShadow = true;
        
        // Calculate starting position on orbit
        const angle = (index / techOrbs.length) * Math.PI * 2;
        orb.position.x = Math.cos(angle) * tech.distance;
        orb.position.z = Math.sin(angle) * tech.distance;
        
        // Store orbit properties for animation
        orb.userData = {
          orbitRadius: tech.distance,
          orbitSpeed: tech.speed,
          orbitOffset: angle,
          orbitTilt: tech.orbitTilt,
          name: tech.name,
          color: tech.color
        };
        
        // Add glow to orb
        const orbGlowGeometry = new THREE.SphereGeometry(tech.radius * 1.3, 24, 24);
        const orbGlowMaterial = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: new THREE.Color(tech.color) }
          },
          vertexShader: `
            varying vec3 vNormal;
            void main() {
              vNormal = normalize(normalMatrix * normal);
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            varying vec3 vNormal;
            
            void main() {
              float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
              gl_FragColor = vec4(color, intensity * 0.5);
            }
          `,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide
        });
        
        const orbGlow = new THREE.Mesh(orbGlowGeometry, orbGlowMaterial);
        
        // Create orbit trajectory visualization
        const orbitCurve = new THREE.EllipseCurve(
          0, 0,
          tech.distance, tech.distance,
          0, 2 * Math.PI,
          false,
          0
        );
        
        const orbitPoints = orbitCurve.getPoints(50);
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitMaterial = new THREE.LineBasicMaterial({
          color: tech.color,
          transparent: true,
          opacity: 0.3
        });
        
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        orbit.rotateX(tech.orbitTilt);
        
        // Group orbit elements
        const techGroup = new THREE.Group();
        techGroup.add(orb);
        techGroup.add(orbGlow);
        techGroup.userData = orb.userData;
        
        hologramGroup.add(techGroup);
        hologramGroup.add(orbit);
      });
      
      // Create central data beams
      const createDataBeams = () => {
        const beamsGroup = new THREE.Group();
        
        // Beam shader materials
        const beamMaterial = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0.0 },
            color: { value: new THREE.Color(colors.primary) }
          },
          vertexShader: `
            varying vec2 vUv;
            
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            uniform vec3 color;
            varying vec2 vUv;
            
            void main() {
              float flow = fract(vUv.y - time * 0.5);
              float intensity = smoothstep(0.0, 0.2, flow) * smoothstep(1.0, 0.8, flow);
              intensity = intensity * 0.8 + 0.2 * sin(vUv.y * 40.0 - time * 5.0);
              
              vec3 finalColor = mix(color, vec3(1.0), intensity * 0.5);
              float alpha = intensity * 0.7 * (1.0 - vUv.x * 2.0);
              
              gl_FragColor = vec4(finalColor, alpha);
            }
          `,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        });
        
        // Create vertical beams from base to core
        const beamHeight = 2.5;
        const beamGeometry = new THREE.PlaneGeometry(0.05, beamHeight, 1, 10);
        
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 0.3;
          const z = Math.sin(angle) * 0.3;
          
          const beam = new THREE.Mesh(beamGeometry, beamMaterial.clone());
          beam.position.set(x, -beamHeight / 2, z);
          beam.lookAt(new THREE.Vector3(0, 0, 0));
          
          beamsGroup.add(beam);
        }
        
        return beamsGroup;
      };
      
      hologramGroup.add(createDataBeams());
      
      // Create floating coding symbols
      const createCodeSymbols = () => {
        const symbolsGroup = new THREE.Group();
        const symbols = ['{ }', '( )', '< >', '//', '&&', '||', '=>', '===', '+=', '...'];
        
        symbols.forEach((symbol, index) => {
          // Create canvas texture for symbol
          const canvas = document.createElement('canvas');
          canvas.width = 128;
          canvas.height = 64;
          const context = canvas.getContext('2d');
          
          if (context) {
            context.fillStyle = 'rgba(0, 0, 0, 0)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            context.font = 'bold 36px monospace';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillStyle = '#ffffff';
            context.fillText(symbol, canvas.width / 2, canvas.height / 2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.MeshBasicMaterial({
              map: texture,
              transparent: true,
              side: THREE.DoubleSide,
              depthWrite: false,
              blending: THREE.AdditiveBlending
            });
            
            const plane = new THREE.Mesh(
              new THREE.PlaneGeometry(0.6, 0.3),
              material
            );
            
            // Position randomly around the core
            const radius = 2 + Math.random() * 1.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;
            
            plane.position.x = radius * Math.sin(phi) * Math.cos(theta);
            plane.position.y = (Math.random() * 2 - 1) * 2;
            plane.position.z = radius * Math.sin(phi) * Math.sin(theta);
            
            // Make symbol face the camera
            plane.lookAt(0, 0, 0);
            
            // Add motion data
            plane.userData = {
              floatSpeed: 0.2 + Math.random() * 0.3,
              rotateSpeed: 0.01 + Math.random() * 0.03,
              phaseOffset: Math.random() * Math.PI * 2
            };
            
            symbolsGroup.add(plane);
          }
        });
        
        return symbolsGroup;
      };
      
      hologramGroup.add(createCodeSymbols());
      
      // Create interactive data particles
      const createDataParticles = () => {
        const particleCount = 400;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const colors = new Float32Array(particleCount * 3);
        
        // Use the palette colors defined above
        const color1 = new THREE.Color(0xDFBD69); // primary
        const color2 = new THREE.Color(0x61DAFB); // react
        const color3 = new THREE.Color(0xFF7D3B); // accent1
        
        for (let i = 0; i < particleCount; i++) {
          // Position particles in a spherical volume
          const radius = 1 + Math.random() * 3;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = (Math.random() * 2 - 1) * 3;
          positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
          
          // Random size between 0.01 and 0.05
          sizes[i] = 0.01 + Math.random() * 0.04;
          
          // Interpolate between colors based on position
          const colorMix = Math.random();
          let finalColor;
          
          if (colorMix < 0.33) {
            finalColor = color1.clone().lerp(color2, colorMix * 3);
          } else if (colorMix < 0.66) {
            finalColor = color2.clone().lerp(color3, (colorMix - 0.33) * 3);
          } else {
            finalColor = color3.clone().lerp(color1, (colorMix - 0.66) * 3);
          }
          
          colors[i * 3] = finalColor.r;
          colors[i * 3 + 1] = finalColor.g;
          colors[i * 3 + 2] = finalColor.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0.0 },
            pointTexture: { value: createParticleTexture() }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
              vColor = color;
              
              // Animated position
              vec3 pos = position;
              float amplitude = 0.1;
              
              // Each particle moves in a unique pattern
              float noisePhase = (position.x * 0.1 + position.y * 0.1 + position.z * 0.1) * 10.0;
              pos.x += sin(time * 0.5 + noisePhase) * amplitude;
              pos.y += cos(time * 0.6 + noisePhase) * amplitude;
              pos.z += sin(time * 0.7 + noisePhase) * amplitude;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform sampler2D pointTexture;
            varying vec3 vColor;
            
            void main() {
              gl_FragColor = vec4(vColor, 1.0) * texture2D(pointTexture, gl_PointCoord);
            }
          `,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        });
        
        return new THREE.Points(geometry, material);
      };
      
      // Create particle texture
      function createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        
        if (context) {
          const gradient = context.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
          );
          
          gradient.addColorStop(0, 'rgba(255,255,255,1)');
          gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
          gradient.addColorStop(1, 'rgba(255,255,255,0)');
          
          context.fillStyle = gradient;
          context.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
      }
      
      hologramGroup.add(createDataParticles());
      
      return hologramGroup;
    };
    
    // Create and add objects
    const base = createHolographicBase();
    const techStack = createTechStackHologram();
    
    mainGroup.add(base);
    mainGroup.add(techStack);
    
    // Add sophisticated lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Main light from top
    const mainLight = new THREE.SpotLight(0xffffff, 2);
    mainLight.position.set(0, 8, 0);
    mainLight.angle = Math.PI / 6;
    mainLight.penumbra = 0.3;
    mainLight.castShadow = true;
    mainLight.shadow.bias = -0.0001;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);
    
    // Accent lights
    const accent1 = new THREE.PointLight(colors.primary, 1, 8);
    accent1.position.set(3, 1, 3);
    scene.add(accent1);
    
    const accent2 = new THREE.PointLight(colors.react, 1, 8);
    accent2.position.set(-3, 1, -3);
    scene.add(accent2);
    
    const accent3 = new THREE.PointLight(colors.accent1, 1, 8);
    accent3.position.set(-3, 1, 3);
    scene.add(accent3);
    
    // Mouse interaction handling
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    
    // Touch interaction handling
    const handleTouchMove = (event: TouchEvent) => {
      if (!containerRef.current || !event.touches[0]) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.touches[0].clientY - rect.top) / rect.height) * 2 + 1;
    };
    
    containerRef.current.addEventListener('mousemove', handleMouseMove);
    containerRef.current.addEventListener('touchmove', handleTouchMove);
    
    // Advanced animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !objectsGroupRef.current) return;
      
      timeRef.current += 0.01;
      const time = timeRef.current;
      
      // Subtle swaying of entire scene based on mouse position
      objectsGroupRef.current.rotation.y += 0.002;
      objectsGroupRef.current.rotation.x = mouseRef.current.y * 0.1;
      objectsGroupRef.current.rotation.z = -mouseRef.current.x * 0.1;
      
      // Animate tech orbs
      objectsGroupRef.current.traverse((object) => {
        if (object instanceof THREE.Group && object.userData.orbitRadius) {
          const { orbitRadius, orbitSpeed, orbitOffset, orbitTilt } = object.userData;
          
          // Calculate new position on elliptical orbit
          const angle = time * orbitSpeed + orbitOffset;
          
          // Apply tilt to orbit
          object.position.x = Math.cos(angle) * orbitRadius;
          object.position.z = Math.sin(angle) * orbitRadius;
          object.position.y = Math.sin(angle) * orbitTilt;
          
          // Make orbs rotate
          object.rotation.y += 0.02;
          object.rotation.x += 0.01;
        }
        
        // Animate floating code symbols
        if (object instanceof THREE.Mesh && object.userData.floatSpeed) {
          const { floatSpeed, rotateSpeed, phaseOffset } = object.userData;
          
          // Floating motion
          object.position.y += Math.sin(time * floatSpeed + phaseOffset) * 0.005;
          
          // Make sure symbols always face the camera
          if (cameraRef.current) {
            object.lookAt(cameraRef.current.position);
          }
          
          // Add slight rotation
          object.rotateZ(rotateSpeed);
        }
        
        // Update all shader materials
        if ((object instanceof THREE.Mesh || object instanceof THREE.Points) && 
            object.material instanceof THREE.ShaderMaterial) {
          if (object.material.uniforms && object.material.uniforms.time) {
            object.material.uniforms.time.value = time;
          }
        }
      });
      
      // Subtle camera motion for more dynamism
      if (cameraRef.current) {
        cameraRef.current.position.x = Math.sin(time * 0.2) * 0.5;
        cameraRef.current.position.y = 1 + Math.sin(time * 0.3) * 0.2;
        cameraRef.current.lookAt(0, 0, 0);
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize with high quality settings
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, []);
  
  return <div ref={containerRef} className="w-full h-full"></div>;
};

export default TechStackShowcase;
