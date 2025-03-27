import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

const ThreeDCube = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    sceneRef.current = new THREE.Scene();
    
    // Initialize camera
    const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
    cameraRef.current = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    cameraRef.current.position.z = 8;
    
    // Initialize renderer
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
    
    // Create cube wireframes
    const createWireCubes = () => {
      if (!sceneRef.current) return;
      
      const group = new THREE.Group();
      
      // Define colors based on theme
      const primaryColor = theme === 'dark' ? 0xDFBD69 : 0xDFBD69; // Gold
      const secondaryColor = theme === 'dark' ? 0x4A225D : 0x4A225D; // Purple
      const accentColor = theme === 'dark' ? 0x4CC9F0 : 0x4CC9F0; // Accent blue
      
      // Create multiple wireframe cubes with different sizes and rotations
      const createWireCube = (size: number, color: number, rotation: THREE.Vector3) => {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color, linewidth: 2 })
        );
        
        line.rotation.set(rotation.x, rotation.y, rotation.z);
        return line;
      };
      
      // Create outer cube (gold)
      const outerCube = createWireCube(
        4, 
        primaryColor, 
        new THREE.Vector3(0, 0, 0)
      );
      group.add(outerCube);
      
      // Create middle cube (purple)
      const middleCube = createWireCube(
        2.8, 
        secondaryColor, 
        new THREE.Vector3(Math.PI / 4, Math.PI / 4, 0)
      );
      group.add(middleCube);
      
      // Create inner cube (accent)
      const innerCube = createWireCube(
        1.6, 
        accentColor, 
        new THREE.Vector3(Math.PI / 6, Math.PI / 6, Math.PI / 4)
      );
      group.add(innerCube);
      
      // Add particles inside the cubes
      const particleCount = 500;
      const particles = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      const particleSizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // Random positions within the inner cube
        particlePositions[i3] = (Math.random() - 0.5) * 3.5;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 3.5;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 3.5;
        
        // Random sizes
        particleSizes[i] = Math.random() * 0.05 + 0.02;
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
      
      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color1: { value: new THREE.Color(primaryColor) },
          color2: { value: new THREE.Color(secondaryColor) },
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
            float mixRatio = (vPos.y + 2.0) / 4.0;
            vec3 color = mix(color1, color2, mixRatio);
            
            gl_FragColor = vec4(color, 1.0 - distance * 2.0);
          }
        `,
        transparent: true,
        depthTest: false,
      });
      
      const particleSystem = new THREE.Points(particles, particleMaterial);
      group.add(particleSystem);
      
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      sceneRef.current.add(ambientLight);
      
      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      sceneRef.current.add(directionalLight);
      
      sceneRef.current.add(group);
      return group;
    };
    
    cubeRef.current = createWireCubes();
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !cubeRef.current) return;
      
      cubeRef.current.rotation.x += 0.003;
      cubeRef.current.rotation.y += 0.005;
      
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
  }, [theme]);
  
  return <div ref={containerRef} className="w-full h-full"></div>;
};

export default ThreeDCube;
