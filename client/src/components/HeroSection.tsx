import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ChevronDown } from 'lucide-react';
import FloatingBadge from './FloatingBadge';
import ThreeDAvatar from './3d/ThreeDAvatar';

interface HeroSectionProps {
  ref?: (node: HTMLDivElement | null) => void;
}

const HeroSection = forwardRef<HTMLDivElement, HeroSectionProps>(
  (props, ref) => {
    return (
      <section 
        id="home" 
        ref={ref}
        className="min-h-screen flex flex-col justify-center items-center relative pt-20 pb-10 px-6 md:px-20 section-transition"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-[-1]">
          <div className="absolute top-20 right-10 w-72 h-72 md:w-96 md:h-96 bg-secondary opacity-10 rounded-full filter blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 md:w-96 md:h-96 bg-primary opacity-10 rounded-full filter blur-3xl animate-float-slow"></div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12 items-center max-w-7xl mx-auto">
          <motion.div 
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-sans text-primary mb-4 tracking-wider">SOFTWARE DEVELOPER</p>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight">
              <span className="block">Hello, I'm</span>
              <span className="text-primary text-3d">Dhanush J</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">
              Software Developer with a strong proficiency in frontend technologies, 
              creating responsive and visually appealing web applications that enhance user engagement.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <motion.a 
                href="#contact" 
                className="px-8 py-3 bg-primary text-black rounded-full font-medium shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Me
              </motion.a>
              <motion.a 
                href="#projects" 
                className="px-8 py-3 border border-primary text-primary dark:text-primary rounded-full font-medium hover:bg-primary hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.a>
            </div>
            
            <div className="mt-10 flex gap-6 justify-center md:justify-start">
              <motion.a 
                href="https://github.com/" 
                target="_blank" 
                className="text-2xl hover:text-primary transition-colors" 
                aria-label="GitHub"
                whileHover={{ y: -3 }}
              >
                <Github className="h-6 w-6" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com/" 
                target="_blank" 
                className="text-2xl hover:text-primary transition-colors" 
                aria-label="LinkedIn"
                whileHover={{ y: -3 }}
              >
                <Linkedin className="h-6 w-6" />
              </motion.a>
              <motion.a 
                href="mailto:workofdhanu@gmail.com" 
                className="text-2xl hover:text-primary transition-colors" 
                aria-label="Email"
                whileHover={{ y: -3 }}
              >
                <Mail className="h-6 w-6" />
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-1 relative max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-full aspect-square rounded-full bg-gradient-to-br from-primary via-secondary to-blue-400 p-1 animate-float">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-primary/30 glass">
                <ThreeDAvatar />
              </div>
            </div>
            
            <FloatingBadge 
              icon="code" 
              text="ReactJS" 
              position="-top-6 -right-6" 
              color="bg-card dark:bg-primary"
              delay={0.5}
            />
            
            <FloatingBadge 
              icon="smartphone" 
              text="React Native" 
              position="-bottom-4 -left-6" 
              color="bg-card dark:bg-secondary"
              delay={0.7}
            />
            
            <FloatingBadge 
              icon="server" 
              text="Node.js" 
              position="-right-8 bottom-1/3" 
              color="bg-card dark:bg-accent"
              delay={0.9}
            />
          </motion.div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <a href="#about" className="text-primary">
            <ChevronDown className="h-8 w-8" />
          </a>
        </motion.div>
      </section>
    );
  }
);

HeroSection.displayName = 'HeroSection';
export default HeroSection;
