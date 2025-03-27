import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

interface ThreeDSkillsProps {
  skills: string[];
}

const ThreeDSkills = ({ skills = [] }: ThreeDSkillsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const skillsGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  // Get theme from DOM instead of context to avoid context errors
  const isDarkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    if (!containerRef.current || skills.length === 0) return;
    
    // Scene setup
    sceneRef.current = new THREE.Scene();
    
    // Camera setup
    const aspectRatio = containerRef.current.clientWidth / containerRef.current.clientHeight;
    cameraRef.current = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    cameraRef.current.position.z = 30;
    
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
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight);
    
    // Create skills visualization
    const createSkillsVisualization = () => {
      if (!sceneRef.current) return;
      
      // Create central sphere to represent skill hub
      const hubGeometry = new THREE.SphereGeometry(3, 32, 32);
      const hubMaterial = new THREE.MeshStandardMaterial({
        color: 0xDFBD69, // Gold color for both themes
        metalness: 0.7,
        roughness: 0.3,
      });
      const hub = new THREE.Mesh(hubGeometry, hubMaterial);
      
      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(3.2, 32, 32);
      const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0xDFBD69) }, // Gold color for both themes
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
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(color, 1.0) * intensity;
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      
      // Use orbiting spheres for skills since text requires loading fonts
      const skillsGroup = new THREE.Group();
      skillsGroup.add(hub);
      skillsGroup.add(glow);
      
      // Create orbiting skill nodes
      const skillOrbitRadii = [10, 12, 14, 16];
      const skillColors = [
        0xDFBD69, // Gold
        0x4A225D, // Purple
        0x4CC9F0, // Accent blue
      ];
      
      skills.forEach((skill, index) => {
        // Create a skill sphere
        const orbitRadius = skillOrbitRadii[index % skillOrbitRadii.length];
        const skillColor = skillColors[index % skillColors.length];
        
        const skillGeometry = new THREE.SphereGeometry(0.8, 16, 16);
        const skillMaterial = new THREE.MeshStandardMaterial({
          color: skillColor,
          metalness: 0.7,
          roughness: 0.3,
        });
        const skillSphere = new THREE.Mesh(skillGeometry, skillMaterial);
        
        // Position the skill at a random point on its orbit
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        skillSphere.position.x = orbitRadius * Math.sin(phi) * Math.cos(theta);
        skillSphere.position.y = orbitRadius * Math.sin(phi) * Math.sin(theta);
        skillSphere.position.z = orbitRadius * Math.cos(phi);
        
        // Store orbit data for animation
        skillSphere.userData = {
          orbitRadius,
          orbitSpeed: 0.001 + Math.random() * 0.002,
          orbitOffset: Math.random() * Math.PI * 2,
          skill
        };
        
        // Create connecting line
        const lineMaterial = new THREE.LineBasicMaterial({
          color: skillColor,
          transparent: true,
          opacity: 0.5,
        });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          skillSphere.position
        ]);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        
        skillsGroup.add(skillSphere);
        skillsGroup.add(line);
      });
      
      // Create orbiting rings
      for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.RingGeometry(
          8 + i * 3,
          8.2 + i * 3,
          64
        );
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: skillColors[i % skillColors.length],
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.2,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        
        // Rotate rings to different angles
        ring.rotation.x = Math.PI / 2 + i * Math.PI / 6;
        ring.rotation.y = i * Math.PI / 4;
        
        skillsGroup.add(ring);
      }
      
      sceneRef.current.add(skillsGroup);
      return skillsGroup;
    };
    
    skillsGroupRef.current = createSkillsVisualization();
    
    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current || !skillsGroupRef.current) return;
      
      // Rotate the entire skill visualization
      skillsGroupRef.current.rotation.y += 0.002;
      
      // Animate individual skill nodes in their orbits
      skillsGroupRef.current.children.forEach(child => {
        if (child instanceof THREE.Mesh && child.userData.orbitRadius) {
          const { orbitRadius, orbitSpeed, orbitOffset } = child.userData;
          
          // Update position in orbit
          const time = Date.now() * orbitSpeed + orbitOffset;
          const x = orbitRadius * Math.cos(time);
          const z = orbitRadius * Math.sin(time);
          child.position.x = x;
          child.position.z = z;
          
          // Update connecting line if this is followed by a line
          const childIndex = skillsGroupRef.current!.children.indexOf(child);
          if (childIndex < skillsGroupRef.current!.children.length - 1) {
            const nextChild = skillsGroupRef.current!.children[childIndex + 1];
            if (nextChild instanceof THREE.Line) {
              const lineGeometry = nextChild.geometry as THREE.BufferGeometry;
              const positions = new Float32Array([
                0, 0, 0,
                child.position.x, child.position.y, child.position.z
              ]);
              lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
              lineGeometry.attributes.position.needsUpdate = true;
            }
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
    
    // Handle mouse/touch interaction
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      if (!containerRef.current || !cameraRef.current || !skillsGroupRef.current) return;
      
      let clientX, clientY;
      
      if ('touches' in event) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }
      
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;
      
      // Slightly rotate the skills visualization based on mouse position
      if (skillsGroupRef.current) {
        skillsGroupRef.current.rotation.x = mouseY * 0.2;
        skillsGroupRef.current.rotation.z = mouseX * 0.2;
      }
    };
    
    containerRef.current.addEventListener('mousemove', handlePointerMove);
    containerRef.current.addEventListener('touchmove', handlePointerMove);
    
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
        containerRef.current.removeEventListener('mousemove', handlePointerMove);
        containerRef.current.removeEventListener('touchmove', handlePointerMove);
      }
    };
  }, [skills]);
  
  return <div ref={containerRef} className="w-full h-full"></div>;
};

export default ThreeDSkills;
