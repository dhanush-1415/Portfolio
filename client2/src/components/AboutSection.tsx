import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import TechStackShowcase from './3d/TechStackShowcase';

interface AboutSectionProps {
  ref?: (node: HTMLDivElement | null) => void;
}

const AboutSection = forwardRef<HTMLDivElement, AboutSectionProps>(
  (props, ref) => {
    return (
      <section 
        id="about" 
        ref={ref}
        className="min-h-screen pt-28 pb-20 px-6 md:px-20 relative section-transition"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-sans tracking-wider">DISCOVER</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">About <span className="text-primary">Me</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-96 md:h-[500px] relative rounded-2xl overflow-hidden glass shadow-2xl border border-primary/30 transform hover:scale-105 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/10 z-0"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <TechStackShowcase />
                </div>
              </div>
              
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-primary text-black p-4 rounded-full h-24 w-24 flex flex-col items-center justify-center shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <span className="text-2xl font-bold">3+</span>
                <span className="text-xs">Years</span>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-serif font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Senior Full Stack Developer with a passion for architectural excellence</h3>
              
              <p className="mb-6">
                I'm a Senior Full Stack Developer with over 3 years of specialized experience in React.js, Node.js, and MySQL. Expert in creating sophisticated, scalable web applications with exceptional UI/UX and robust backend architectures. I've led development teams to deliver enterprise-grade solutions that combine cutting-edge technologies with optimized performance.
              </p>
              
              <p className="mb-8">
                Known for developing complex systems that scale seamlessly from prototype to production. I'm passionate about implementing modern development practices, mentoring junior developers, and creating innovative solutions that drive business growth. My technical leadership has consistently delivered projects that exceed client expectations while maintaining code quality and performance benchmarks.
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { title: "3+", subtitle: "Years Experience" },
                  { title: "20+", subtitle: "Projects Delivered" },
                  { title: "3", subtitle: "Leadership Roles" }
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex flex-col items-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="text-3xl font-serif font-bold text-primary">{item.title}</div>
                    <div className="text-sm font-medium">{item.subtitle}</div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <motion.a 
                  href="#contact" 
                  className="px-8 py-4 bg-gradient-to-r from-primary via-purple-500 to-secondary text-white rounded-full font-medium shadow-xl relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary via-blue-500 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center">
                    <span className="mr-2">Contact Me</span>
                    <span className="animate-pulse">→</span>
                  </span>
                </motion.a>
                <motion.a 
                  href="#" 
                  className="px-8 py-4 border-2 border-primary text-primary rounded-full font-medium relative overflow-hidden group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="absolute inset-0 w-0 bg-primary group-hover:w-full transition-all duration-300"></span>
                  <span className="relative flex items-center justify-center text-primary group-hover:text-black">
                    <span className="mr-2">Download CV</span>
                    <span>↓</span>
                  </span>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    );
  }
);

AboutSection.displayName = 'AboutSection';
export default AboutSection;
