import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { User, Code, Server, Database, Globe } from 'lucide-react';

const ThreeDAvatar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get theme from DOM instead of context to avoid context errors
  const isDarkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    sceneRef.current = new THREE.Scene();
    
    // Camera setup
    const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
    cameraRef.current = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
    cameraRef.current.position.z = 5;
    cameraRef.current.position.y = 0.5;
    
    // Renderer setup with advanced options
    rendererRef.current = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      precision: 'highp'
    });
    rendererRef.current.setSize(
      containerRef.current.clientWidth, 
      containerRef.current.clientHeight
    );
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    rendererRef.current.setClearColor(0x000000, 0);
    rendererRef.current.shadowMap.enabled = true;
    rendererRef.current.shadowMap.type = THREE.PCFSoftShadowMap;
    // For Three.js v0.150+, outputEncoding is replaced with outputColorSpace
    // rendererRef.current.outputEncoding = THREE.sRGBEncoding;
    rendererRef.current.outputColorSpace = THREE.SRGBColorSpace; 
    rendererRef.current.toneMapping = THREE.ACESFilmicToneMapping;
    rendererRef.current.toneMappingExposure = 1.2;
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Create sophisticated 3D avatar model
    const createAvatarModel = () => {
      if (!sceneRef.current) return;

      // Main avatar group
      const avatarGroup = new THREE.Group();
      
      // Create core shape
      const coreGeometry = new THREE.IcosahedronGeometry(1.8, 4);
      const coreMaterial = new THREE.MeshPhysicalMaterial({ 
        color: isDarkMode ? 0x2a2a42 : 0xf5f5f8,
        roughness: 0.3,
        metalness: 0.8,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        transmission: 0.2, 
        reflectivity: 0.5,
        envMapIntensity: 0.8
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      
      // Add inner glow
      const glowGeometry = new THREE.IcosahedronGeometry(1.85, 4);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color: new THREE.Color(0x9c5bff), 
        transparent: true, 
        opacity: 0.15,
        side: THREE.BackSide 
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      
      // Create sophisticated particle aura
      const createParticleSystem = (count: number, radius: number, size: number, color: THREE.Color) => {
        const particles = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(count * 3);
        const particleColors = new Float32Array(count * 3);
        const particleSizes = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
          const i3 = i * 3;
          const r = radius + (Math.random() * 0.5);
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;
          
          particlePositions[i3] = r * Math.sin(phi) * Math.cos(theta);
          particlePositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          particlePositions[i3 + 2] = r * Math.cos(phi);
          
          // Random color variation
          const colorVariation = 0.2;
          particleColors[i3] = color.r * (1 + (Math.random() * colorVariation - colorVariation/2));
          particleColors[i3 + 1] = color.g * (1 + (Math.random() * colorVariation - colorVariation/2));
          particleColors[i3 + 2] = color.b * (1 + (Math.random() * colorVariation - colorVariation/2));
          
          // Random size variation
          particleSizes[i] = size * (1 + Math.random() * 0.5);
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
        
        const particleMaterial = new THREE.PointsMaterial({
          size: size,
          transparent: true,
          opacity: 0.8,
          vertexColors: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          sizeAttenuation: true
        });
        
        return new THREE.Points(particles, particleMaterial);
      };
      
      // Create three layers of particles with different properties
      const innerParticles = createParticleSystem(300, 2.1, 0.08, new THREE.Color(0x9c5bff));
      const outerParticles = createParticleSystem(500, 2.5, 0.05, new THREE.Color(0x7c4dff));
      const sparks = createParticleSystem(100, 3.0, 0.1, new THREE.Color(0xffffff));
      
      // Create orbital rings
      const createRing = (radius: number, thickness: number, color: THREE.Color, opacity: number) => {
        const ringGeometry = new THREE.TorusGeometry(radius, thickness, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
          color: color,
          transparent: true,
          opacity: opacity,
          side: THREE.DoubleSide
        });
        return new THREE.Mesh(ringGeometry, ringMaterial);
      };
      
      const ring1 = createRing(2.8, 0.02, new THREE.Color(0x9c5bff), 0.4);
      ring1.rotation.x = Math.PI / 2;
      ring1.rotation.y = Math.PI / 6;
      
      const ring2 = createRing(2.5, 0.03, new THREE.Color(0x7c4dff), 0.3);
      ring2.rotation.x = Math.PI / 3;
      ring2.rotation.z = Math.PI / 4;
      
      // Create small tech-related orbital objects
      const createOrbitalObject = (icon: string, position: THREE.Vector3, color: number) => {
        const orbitGroup = new THREE.Group();
        
        // Base shape
        const baseGeometry = new THREE.IcosahedronGeometry(0.2, 1);
        const baseMaterial = new THREE.MeshPhysicalMaterial({
          color: color,
          roughness: 0.3,
          metalness: 0.8,
          clearcoat: 0.5
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        
        orbitGroup.add(base);
        orbitGroup.position.copy(position);
        
        return orbitGroup;
      };
      
      // Position orbital objects
      const orb1 = createOrbitalObject('code', new THREE.Vector3(2.8, 0, 0), 0x9c5bff);
      const orb2 = createOrbitalObject('server', new THREE.Vector3(-1.4, 2.0, 0.5), 0x7c4dff);
      const orb3 = createOrbitalObject('database', new THREE.Vector3(0, -2.4, 1.0), 0x5d36be);
      const orb4 = createOrbitalObject('globe', new THREE.Vector3(1.4, 1.2, -2.0), 0x4b2e99);
      
      // Build avatar group
      avatarGroup.add(core);
      avatarGroup.add(glow);
      avatarGroup.add(innerParticles);
      avatarGroup.add(outerParticles);
      avatarGroup.add(sparks);
      avatarGroup.add(ring1);
      avatarGroup.add(ring2);
      avatarGroup.add(orb1);
      avatarGroup.add(orb2);
      avatarGroup.add(orb3);
      avatarGroup.add(orb4);
      
      // Position and scale
      avatarGroup.scale.set(0.7, 0.7, 0.7);
      avatarGroup.position.y = 0;
      
      // Add to scene
      sceneRef.current.add(avatarGroup);
      
      // Add sophisticated lighting
      // Ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      sceneRef.current.add(ambientLight);
      
      // Primary directional light
      const mainLight = new THREE.DirectionalLight(isDarkMode ? 0x9c5bff : 0xffffff, 1);
      mainLight.position.set(5, 5, 5);
      mainLight.castShadow = true;
      sceneRef.current.add(mainLight);
      
      // Secondary directional light (rim light)
      const rimLight = new THREE.DirectionalLight(0x7c4dff, 0.6);
      rimLight.position.set(-5, 3, -5);
      sceneRef.current.add(rimLight);
      
      // Additional spot light for highlights
      const spotLight = new THREE.SpotLight(0xffffff, 0.8);
      spotLight.position.set(0, 5, 0);
      spotLight.angle = Math.PI / 6;
      spotLight.penumbra = 0.2;
      spotLight.distance = 10;
      sceneRef.current.add(spotLight);
      
      // Add small point lights around the avatar for visual interest
      const pointLight1 = new THREE.PointLight(0x9c5bff, 0.8, 5);
      pointLight1.position.set(2, 0, 2);
      sceneRef.current.add(pointLight1);
      
      const pointLight2 = new THREE.PointLight(0x4b2e99, 0.5, 5);
      pointLight2.position.set(-2, 0, -2);
      sceneRef.current.add(pointLight2);

      setTimeout(() => setIsLoaded(true), 500);
      
      // Return the avatar group for animations
      return avatarGroup;
    };
    
    const avatarGroup = createAvatarModel();
    
    // Sophisticated animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const delta = clockRef.current.getDelta();
      const elapsedTime = clockRef.current.getElapsedTime();
      
      if (avatarGroup) {
        // Complex rotation
        avatarGroup.rotation.y += 0.002 * (1 + Math.sin(elapsedTime * 0.5) * 0.2);
        avatarGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;
        
        // Sophisticated breathing/floating animation
        avatarGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.1;
        avatarGroup.scale.x = 0.7 + Math.sin(elapsedTime * 1.2) * 0.01;
        avatarGroup.scale.y = 0.7 + Math.sin(elapsedTime * 1.2) * 0.01;
        avatarGroup.scale.z = 0.7 + Math.sin(elapsedTime * 1.2) * 0.01;
        
        // Animate individual objects in the avatar group
        avatarGroup.children.forEach((child, index) => {
          if (child instanceof THREE.Points) {
            // Animate particle systems
            child.rotation.y += delta * 0.1 * (index % 2 === 0 ? 1 : -1);
            child.rotation.z += delta * 0.05 * (index % 2 === 0 ? -1 : 1);
          } else if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
            // Animate rings
            child.rotation.z += delta * 0.1 * (index % 2 === 0 ? 1 : -1);
            child.rotation.x += delta * 0.1 * (index % 2 === 0 ? 0.5 : -0.5);
          } else if (child instanceof THREE.Group) {
            // Animate orbital objects
            child.position.x = child.position.x * Math.cos(delta * 0.5) - child.position.z * Math.sin(delta * 0.5);
            child.position.z = child.position.x * Math.sin(delta * 0.5) + child.position.z * Math.cos(delta * 0.5);
            child.rotation.y += delta * 1.0;
          }
        });
      }
      
      // Subtle camera movement
      if (cameraRef.current) {
        cameraRef.current.position.x = Math.sin(elapsedTime * 0.3) * 0.3;
        cameraRef.current.position.y = 0.5 + Math.sin(elapsedTime * 0.4) * 0.1;
        cameraRef.current.lookAt(0, 0, 0);
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
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
    };
  }, []);
  
  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full"></div>
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 pointer-events-none ${isLoaded ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-14 h-14 text-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default ThreeDAvatar;
