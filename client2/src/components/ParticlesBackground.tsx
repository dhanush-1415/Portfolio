import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  blinking: boolean;
}

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const particles = useRef<Particle[]>([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  const isDarkMode = document.documentElement.classList.contains('dark');

  const initParticles = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear any existing particles
    particles.current = [];

    // Create particles
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 8000); // Increased density
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-primary').trim();
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-secondary').trim();
    const tertiaryColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-tertiary').trim();
    
    for (let i = 0; i < particleCount; i++) {
      // Vary particle sizes with a bias toward smaller particles
      const size = Math.random() < 0.8 
        ? Math.random() * 1.5 + 0.3 // 80% smaller particles
        : Math.random() * 2.5 + 1;  // 20% larger particles
      
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      
      // Varied speeds with some particles moving faster
      const speedFactor = Math.random() < 0.1 ? 0.5 : 0.2; // 10% faster particles
      const speedX = (Math.random() - 0.5) * speedFactor;
      const speedY = (Math.random() - 0.5) * speedFactor;
      
      // Use a mix of colors for a royal theme
      let color;
      const colorRand = Math.random();
      if (colorRand < 0.5) { // Primary color (purple)
        color = `hsl(${primaryColor})`;
      } else if (colorRand < 0.8) { // Secondary color (blue)
        color = `hsl(${secondaryColor})`;
      } else if (colorRand < 0.95) { // Tertiary color (deep purple)
        color = `hsl(${tertiaryColor})`;
      } else { // A few white particles for contrast
        color = 'hsl(0, 0%, 100%)';
      }
      
      // Vary opacity for depth perception
      const opacity = Math.random() * 0.6 + 0.2;
      
      // Some particles will blink for visual interest
      const blinking = Math.random() > 0.6;
      
      particles.current.push({
        x,
        y,
        size,
        speedX,
        speedY,
        color,
        opacity,
        blinking
      });
    }

    setIsInitialized(true);
  };

  const animate = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.current.forEach((p, index) => {
      // Move particle
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around boundaries
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Particle blinking effect
      if (p.blinking) {
        p.opacity = 0.2 + Math.abs(Math.sin(Date.now() * 0.001 + index)) * 0.3;
      }

      // Enhanced mouse interaction with more sophisticated effects
      const dx = mousePosition.current.x - p.x;
      const dy = mousePosition.current.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const mouseRadius = 200; // Increased interaction radius
      
      // Initialize size multiplier variable for mouse hover effect
      let sizeMultiplier = 1;
      
      if (distance < mouseRadius) {
        // Calculate interpolation factor based on distance
        const interpolationFactor = 1 - (distance / mouseRadius);
        
        // Different behavior based on particle size
        if (p.size < 1) {
          // Smaller particles are attracted to the cursor
          const angle = Math.atan2(dy, dx);
          const attractionStrength = 0.15 * interpolationFactor;
          p.speedX += Math.cos(angle) * attractionStrength;
          p.speedY += Math.sin(angle) * attractionStrength;
          
          // Increase opacity when near cursor
          p.opacity = Math.min(1, p.opacity + interpolationFactor * 0.3);
        } else {
          // Larger particles are repelled from the cursor
          const angle = Math.atan2(dy, dx);
          const repulsionStrength = 0.08 * interpolationFactor;
          p.speedX -= Math.cos(angle) * repulsionStrength;
          p.speedY -= Math.sin(angle) * repulsionStrength;
        }
        
        // Add glow effect to particles near mouse
        const glowIntensity = interpolationFactor * 0.7;
        ctx.shadowBlur = 15 * glowIntensity;
        ctx.shadowColor = p.color;
        
        // Increase the size multiplier for particles near the mouse
        sizeMultiplier = 1 + (interpolationFactor * 0.2);
      } else {
        // Apply friction to gradually slow particles
        p.speedX *= 0.99;
        p.speedY *= 0.99;
        ctx.shadowBlur = 0;
      }

      // Maximum speed limit
      const speed = Math.sqrt(p.speedX * p.speedX + p.speedY * p.speedY);
      if (speed > 1) {
        p.speedX = (p.speedX / speed) * 1;
        p.speedY = (p.speedY / speed) * 1;
      }

      // Draw particle with size multiplier effect
      ctx.globalAlpha = p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * sizeMultiplier, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    // Connect nearby particles with lines - more sophisticated connection system
    const connectColor = getComputedStyle(document.documentElement).getPropertyValue('--particle-connect').trim();
    const connectionDistance = Math.min(window.innerWidth, window.innerHeight) * 0.08; // Responsive connection distance
    
    // We'll only connect some particles to improve performance
    const particlesToConnect = particles.current.filter(() => Math.random() > 0.5);
    
    for (let i = 0; i < particlesToConnect.length; i++) {
      for (let j = i + 1; j < particlesToConnect.length; j++) {
        const p1 = particlesToConnect[i];
        const p2 = particlesToConnect[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          // Calculate opacity based on distance
          const opacity = 1 - (distance / connectionDistance);
          ctx.globalAlpha = opacity * 0.3; // Max opacity of 0.3
          
          // Create a gradient for the line to make it fade out
          const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
          
          // Convert HSL colors to rgba for proper gradient
          const color1 = `rgba(156, 91, 255, ${opacity * 0.5})`;
          const color2 = `rgba(156, 91, 255, ${opacity * 0.5})`;
          
          gradient.addColorStop(0, color1);
          gradient.addColorStop(1, color2);
          
          // Draw the connection line
          ctx.beginPath();
          ctx.strokeStyle = gradient;
          ctx.lineWidth = Math.max(0.1, (p1.size + p2.size) * 0.05); // Line width based on particle sizes
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (!canvasRef.current) return;
      
      const { clientWidth, clientHeight } = document.documentElement;
      canvasRef.current.width = clientWidth;
      canvasRef.current.height = clientHeight;
      
      setDimensions({
        width: clientWidth,
        height: clientHeight
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    // Initial setup
    updateDimensions();
    
    // Add event listeners
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Separate useEffect for initialization to avoid infinite rendering loops
  useEffect(() => {
    if (!isInitialized && dimensions.width > 0 && dimensions.height > 0) {
      initParticles();
      animate();
      setIsInitialized(true); // This prevents the loop
    }
  }, [isInitialized, dimensions, initParticles, animate]);
  
  return (
    <motion.canvas
      ref={canvasRef}
      className="particles-canvas"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
};

export default ParticlesBackground;