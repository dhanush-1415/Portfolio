import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDCube = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cubeGroupRef = useRef<THREE.Group>(new THREE.Group());
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Initialize camera
    const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    camera.position.z = 8;
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Royal theme colors
    const primaryColor = 0xDFBD69; // Royal Gold
    const secondaryColor = 0x4A225D; // Royal Purple
    const accentColor = 0x4CC9F0; // Blue accent
    const highlightColor = 0xF72585; // Pink highlight
    
    // Create the main group to hold all objects
    const mainGroup = new THREE.Group();
    cubeGroupRef.current = mainGroup;
    scene.add(mainGroup);
    
    // Create a gold wireframe cube
    const createWireframeCube = (size: number, color: number, rotationOffset: number) => {
      const cubeGroup = new THREE.Group();
      
      // Create basic wireframe
      const geometry = new THREE.BoxGeometry(size, size, size);
      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({ 
        color, 
        linewidth: 2,
        transparent: true,
        opacity: 0.85
      });
      const wireframe = new THREE.LineSegments(edges, material);
      cubeGroup.add(wireframe);
      
      // Add glowing vertices
      const vertexGeometry = new THREE.SphereGeometry(0.08, 16, 16);
      const vertexMaterial = new THREE.MeshBasicMaterial({ 
        color: highlightColor,
        transparent: true,
        opacity: 0.9
      });
      
      // Get unique vertices
      const positions = geometry.attributes.position;
      const uniquePositions = new Set();
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i).toFixed(2);
        const y = positions.getY(i).toFixed(2);
        const z = positions.getZ(i).toFixed(2);
        const key = `${x}-${y}-${z}`;
        
        if (!uniquePositions.has(key)) {
          uniquePositions.add(key);
          const vertex = new THREE.Mesh(vertexGeometry, vertexMaterial);
          vertex.position.set(parseFloat(x), parseFloat(y), parseFloat(z));
          cubeGroup.add(vertex);
        }
      }
      
      // Add golden face decorations
      const createGoldenMaterial = () => {
        return new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0.0 }
          },
          vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
              vNormal = normalize(normalMatrix * normal);
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform float time;
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
              float pattern = sin(vPosition.x * 10.0 + time) * sin(vPosition.y * 10.0 + time) * 0.5 + 0.5;
              vec3 goldBase = vec3(0.83, 0.68, 0.21);
              vec3 goldHighlight = vec3(1.0, 0.84, 0.4);
              
              float pulse = 0.5 + 0.5 * sin(time * 2.0);
              vec3 mixedGold = mix(goldBase, goldHighlight, pattern * pulse);
              
              float brightness = dot(vNormal, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;
              gl_FragColor = vec4(mixedGold * brightness, 0.7);
            }
          `,
          transparent: true,
          side: THREE.DoubleSide
        });
      };
      
      // Add decorative faces
      const faceSize = size * 0.65;
      const faceGeometry = new THREE.PlaneGeometry(faceSize, faceSize);
      
      const facePositions = [
        [size/2 * 0.99, 0, 0], [-size/2 * 0.99, 0, 0],
        [0, size/2 * 0.99, 0], [0, -size/2 * 0.99, 0],
        [0, 0, size/2 * 0.99], [0, 0, -size/2 * 0.99]
      ];
      
      const faceRotations = [
        [0, Math.PI/2, 0], [0, -Math.PI/2, 0],
        [-Math.PI/2, 0, 0], [Math.PI/2, 0, 0],
        [0, 0, 0], [0, Math.PI, 0]
      ];
      
      for (let i = 0; i < 6; i++) {
        const faceMaterial = createGoldenMaterial();
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        face.position.set(facePositions[i][0], facePositions[i][1], facePositions[i][2]);
        face.rotation.set(faceRotations[i][0], faceRotations[i][1], faceRotations[i][2]);
        cubeGroup.add(face);
      }
      
      // Apply initial rotation offset
      cubeGroup.rotation.x = rotationOffset;
      cubeGroup.rotation.y = rotationOffset;
      
      return cubeGroup;
    };
    
    // Create nested cubes with different sizes and rotations
    const outerCube = createWireframeCube(4.2, primaryColor, 0);
    const middleCube = createWireframeCube(2.8, secondaryColor, Math.PI/4);
    const innerCube = createWireframeCube(1.6, accentColor, Math.PI/6);
    
    mainGroup.add(outerCube);
    mainGroup.add(middleCube);
    mainGroup.add(innerCube);
    
    // Add floating particles inside cube
    const addParticles = () => {
      const particleCount = 300;
      const particleGeometry = new THREE.BufferGeometry();
      const particlePositions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * 3;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 3;
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 3;
      }
      
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      
      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(primaryColor) },
          color2: { value: new THREE.Color(accentColor) }
        },
        vertexShader: `
          uniform float time;
          varying vec3 vPosition;
          
          void main() {
            vPosition = position;
            
            // Slight floating movement
            vec3 pos = position;
            pos.x += sin(time * 0.5 + pos.y * 2.0) * 0.1;
            pos.y += cos(time * 0.5 + pos.x * 2.0) * 0.1;
            pos.z += sin(time * 0.7 + pos.y * 2.0) * 0.1;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 4.0 * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          varying vec3 vPosition;
          
          void main() {
            float distanceToCenter = length(gl_PointCoord - vec2(0.5, 0.5));
            if (distanceToCenter > 0.5) discard;
            
            float strength = 1.0 - distanceToCenter * 2.0;
            
            // Create gradient based on position
            float mixRatio = (vPosition.y + 1.5) / 3.0;
            vec3 color = mix(color1, color2, mixRatio);
            
            gl_FragColor = vec4(color, strength);
          }
        `,
        transparent: true,
        depthWrite: false
      });
      
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      mainGroup.add(particles);
    };
    
    addParticles();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !cubeGroupRef.current) return;
      
      timeRef.current += 0.01;
      
      // Rotate main group
      cubeGroupRef.current.rotation.x += 0.003;
      cubeGroupRef.current.rotation.y += 0.005;
      
      // Update all shader materials
      cubeGroupRef.current.traverse((object) => {
        if (object instanceof THREE.Mesh && object.material instanceof THREE.ShaderMaterial) {
          if (object.material.uniforms && object.material.uniforms.time) {
            object.material.uniforms.time.value = timeRef.current;
          }
        }
        if (object instanceof THREE.Points && object.material instanceof THREE.ShaderMaterial) {
          if (object.material.uniforms && object.material.uniforms.time) {
            object.material.uniforms.time.value = timeRef.current;
          }
        }
      });
      
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
  
  return <div ref={containerRef} className="w-full h-full"></div>;
};

export default ThreeDCube;
