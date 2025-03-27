import { forwardRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ChevronDown, Code, Sparkles, TerminalSquare, Star } from 'lucide-react';
import FloatingBadge from './FloatingBadge';
import ThreeDAvatar from './3d/ThreeDAvatar';
import { fadeIn, textVariant, zoomIn } from '@/lib/motions';

interface HeroSectionProps {
  ref?: (node: HTMLDivElement | null) => void;
}

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(
  (props, ref) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
      setMounted(true);
    }, []);

    return (
      <section 
        id="home" 
        ref={ref}
        className="min-h-screen flex flex-col justify-center items-center relative pt-20 pb-10 px-6 md:px-20 section-transition"
      >
        {/* Sophisticated background design */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
          {/* Main gradient background with refined colors */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background">
            <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
              <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="b" gradientTransform="rotate(45 0.5 0.5)">
                    <stop offset="0%" stopColor="hsl(267, 100%, 60%)" />
                    <stop offset="100%" stopColor="hsl(240, 100%, 20%)" />
                  </linearGradient>
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 0 10 L 40 10 M 10 0 L 10 40" stroke="rgba(255,255,255,0.05)" fill="none" strokeWidth="0.5"/>
                  </pattern>
                  <clipPath id="c">
                    <path d="M 1000 0 L 0 0 L 0 1000 L 1000 1000 L 1000 0" fill="url(#b)"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#c)">
                  <path d="M 0 0 L 1000 0 L 1000 1000 L 0 1000 L 0 0" fill="url(#b)"/>
                  <rect width="100%" height="100%" fill="url(#gridPattern)" opacity="0.4"/>
                </g>
              </svg>
            </div>
          </div>
          
          {/* Elegant glowing orbs */}
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] rounded-full opacity-[0.07] bg-primary animate-float-slow filter blur-[100px]"></div>
          <div className="absolute -bottom-40 -left-20 w-[35rem] h-[35rem] rounded-full opacity-[0.07] bg-primary animate-float filter blur-[100px]"></div>
          <div className="absolute top-1/2 left-1/4 w-[25rem] h-[25rem] rounded-full opacity-[0.04] bg-secondary animate-float-slow filter blur-[80px]"></div>
          
          {/* Subtle geometric accents */}
          <div className="absolute top-20 right-10 w-96 h-96 border border-primary/5 rounded-full"></div>
          <div className="absolute bottom-40 left-20 w-64 h-64 border border-primary/5 rounded-full"></div>
          <div className="absolute top-1/3 left-1/4 w-40 h-40 border border-primary/5 rounded-full"></div>
          <div className="absolute bottom-1/3 right-1/3 w-60 h-60 border border-primary/5 rounded-full"></div>
        </div>
        
        {/* Refined particles effect */}
        <div className="absolute inset-0 w-full h-full z-[-1] overflow-hidden">
          {mounted && Array.from({ length: 30 }).map((_, i) => {
            const size = Math.random() < 0.3 ? '2px' : Math.random() < 0.8 ? '1px' : '1.5px';
            return (
              <motion.div 
                key={i}
                className="absolute rounded-full bg-primary"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: size,
                  height: size,
                }}
                animate={{
                  scale: [1, (Math.random() * 0.5) + 1.3, 1],
                  opacity: [0.1, (Math.random() * 0.3) + 0.4, 0.1],
                  y: [0, (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 15 + 5), 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 6,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            );
          })}
        </div>
        
        <div className="flex flex-col md:flex-row gap-12 items-center max-w-7xl mx-auto">
          <motion.div 
            className="flex-1 text-center md:text-left"
            variants={fadeIn('right', 0.3)}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={textVariant(0.1)}
              className="flex items-center justify-center md:justify-start gap-2 mb-4"
            >
              <div className="px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
                <p className="font-mono text-sm text-primary tracking-wider">INNOVATIVE CODE WIZARD</p>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={textVariant(0.2)}
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
            >
              <span className="block">Hello, I'm</span>
              <span className="royal-text text-glow animate-glow">Dhanush J</span>
            </motion.h1>
            
            <motion.p 
              variants={textVariant(0.3)}
              className="text-lg md:text-xl mb-8 max-w-2xl leading-relaxed"
            >
              Elite <span className="text-primary font-semibold">Software Architect</span> transforming ideas into 
              <span className="text-primary font-semibold"> immersive digital experiences</span>. Creating next-generation 
              applications that blend cutting-edge technology with stunning design.
            </motion.p>
            
            <motion.div
              variants={fadeIn('up', 0.4)}
              className="flex flex-wrap gap-4 justify-center md:justify-start mb-8"
            >
              <a 
                href="#contact" 
                className="royal-bg text-white px-8 py-3.5 rounded-full font-medium shadow-xl transition-all duration-300 hover:shadow-primary/30 hover:shadow-2xl group"
              >
                <span className="flex items-center gap-2">
                  Contact Me 
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
                  >
                    →
                  </motion.span>
                </span>
              </a>
              <a 
                href="#projects" 
                className="neon-border bg-background/50 backdrop-blur-sm px-8 py-3.5 rounded-full font-medium transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg"
              >
                <span className="flex items-center gap-2">
                  <Code className="h-4 w-4" /> View Projects
                </span>
              </a>
            </motion.div>
            
            <motion.div
              variants={fadeIn('up', 0.5)}
              className="flex gap-3 justify-center md:justify-start p-1.5 rounded-full bg-background/50 backdrop-blur-sm border border-border inline-block"
            >
              <a 
                href="https://github.com/" 
                target="_blank" 
                className="p-2.5 bg-background rounded-full hover:bg-primary hover:text-white transition-colors duration-300" 
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com/" 
                target="_blank" 
                className="p-2.5 bg-background rounded-full hover:bg-primary hover:text-white transition-colors duration-300" 
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="mailto:workofdhanu@gmail.com" 
                className="p-2.5 bg-background rounded-full hover:bg-primary hover:text-white transition-colors duration-300" 
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 relative max-w-md"
            variants={zoomIn(0.3, 0.8)}
            initial="hidden"
            animate="show"
          >
            <div className="w-full aspect-square rounded-full relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-secondary to-primary animate-spin-slow opacity-30 blur-xl"></div>
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-primary via-secondary to-primary p-1 animate-morph">
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/20 glass shadow-2xl backdrop-blur-xl">
                  <ThreeDAvatar />
                </div>
              </div>
            </div>
            
            <FloatingBadge 
              icon="code" 
              text="React Expert" 
              position="-top-6 -right-6" 
              color="royal-bg text-white"
              delay={0.5}
            />
            
            <FloatingBadge 
              icon="smartphone" 
              text="App Wizard" 
              position="-bottom-4 -left-6" 
              color="royal-bg text-white"
              delay={0.7}
            />
            
            <FloatingBadge 
              icon="server" 
              text="Full Stack Master" 
              position="-right-8 bottom-1/3" 
              color="royal-bg text-white"
              delay={0.9}
            />
            
            <FloatingBadge 
              icon="sparkles" 
              text="UI Virtuoso" 
              position="-left-8 top-1/3" 
              color="royal-bg text-white"
              delay={1.1}
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <span className="text-sm text-muted-foreground mb-2">Scroll to discover</span>
          <a 
            href="#about" 
            className="p-2 rounded-full border border-primary/50 animate-bounce text-primary hover:bg-primary/10 transition-colors"
          >
            <ChevronDown className="h-5 w-5" />
          </a>
        </motion.div>
      </section>
    );
  }
);

HeroSection.displayName = 'HeroSection';
export default HeroSection;
