import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import * as THREE from 'three';

const ParticlesBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    sceneRef.current = new THREE.Scene();
    
    // Initialize camera
    const { offsetWidth: width, offsetHeight: height } = containerRef.current;
    cameraRef.current = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    cameraRef.current.position.z = 30;
    
    // Initialize renderer
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rendererRef.current.setSize(width, height);
    rendererRef.current.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(rendererRef.current.domElement);
    
    // Create particles
    createParticles();
    
    // Animation loop
    const animate = () => {
      if (!particlesRef.current || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      particlesRef.current.rotation.x += 0.0005;
      particlesRef.current.rotation.y += 0.0008;
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const { offsetWidth: width, offsetHeight: height } = containerRef.current;
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
  
  // Update particle colors when theme changes
  useEffect(() => {
    if (particlesRef.current) {
      sceneRef.current?.remove(particlesRef.current);
      createParticles();
    }
  }, [theme]);
  
  const createParticles = () => {
    if (!sceneRef.current) return;
    
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random positions in a spherical volume
      const radius = 50 * Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
      
      particleSizes[i / 3] = Math.random() * 2 + 1;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    // Create particle material based on theme
    const primaryColor = theme === 'dark' ? new THREE.Color('#DFBD69') : new THREE.Color('#DFBD69');
    const secondaryColor = theme === 'dark' ? new THREE.Color('#4A225D') : new THREE.Color('#4A225D');
    
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: primaryColor },
        color2: { value: secondaryColor },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vPos;
        
        void main() {
          vPos = position;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vPos;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5, 0.5));
          if (distance > 0.5) discard;
          
          // Mix colors based on position
          float mixRatio = (vPos.y + 50.0) / 100.0;
          vec3 color = mix(color1, color2, mixRatio);
          
          gl_FragColor = vec4(color, 1.0 - distance * 2.0);
        }
      `,
      transparent: true,
      depthTest: false,
    });
    
    particlesRef.current = new THREE.Points(particleGeometry, particleMaterial);
    sceneRef.current.add(particlesRef.current);
  };
  
  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]"
      aria-hidden="true"
    />
  );
};

export default ParticlesBackground;
