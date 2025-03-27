import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { User } from 'lucide-react';

const ThreeDAvatar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  // Get theme from DOM instead of context to avoid context errors
  const isDarkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    sceneRef.current = new THREE.Scene();
    
    // Camera setup
    const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
    cameraRef.current = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    cameraRef.current.position.z = 5;
    
    // Renderer setup
    rendererRef.current = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    rendererRef.current.setSize(
      containerRef.current.clientWidth, 
      containerRef.current.clientHeight
    );
    rendererRef.current.setClearColor(0x000000, 0);
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Create 3D avatar model
    const createAvatarModel = () => {
      if (!sceneRef.current) return;

      // For a minimal placeholder, create a sphere head with particle hair
      const headGeometry = new THREE.SphereGeometry(2, 32, 32);
      const headMaterial = new THREE.MeshStandardMaterial({ 
        color: isDarkMode ? 0x444444 : 0xdddddd,
        roughness: 0.7,
        metalness: 0.3,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      
      // Create particle hair/aura
      const particleCount = 500;
      const particles = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 2.2 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        particlePositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        particlePositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        particlePositions[i3 + 2] = radius * Math.cos(phi);
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: 0xDFBD69, // Gold color for both themes
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });
      
      const particleSystem = new THREE.Points(particles, particleMaterial);
      
      // Group everything
      const avatarGroup = new THREE.Group();
      avatarGroup.add(head);
      avatarGroup.add(particleSystem);
      
      // Position and scale
      avatarGroup.scale.set(0.5, 0.5, 0.5);
      avatarGroup.position.y = -0.5;
      
      // Add to scene
      sceneRef.current.add(avatarGroup);
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      sceneRef.current.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      sceneRef.current.add(directionalLight);
      
      // Return the avatar group for animations
      return avatarGroup;
    };
    
    const avatarGroup = createAvatarModel();
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      if (avatarGroup) {
        avatarGroup.rotation.y += 0.005;
        
        // Add a slight floating animation
        avatarGroup.position.y = -0.5 + Math.sin(Date.now() * 0.001) * 0.1;
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
      <div className="absolute inset-0 flex items-center justify-center text-9xl text-primary/50 pointer-events-none">
        <User className="w-24 h-24" />
      </div>
    </div>
  );
};

export default ThreeDAvatar;
