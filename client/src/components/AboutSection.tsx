import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import ThreeDCube from './3d/ThreeDCube';

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
                  <ThreeDCube />
                </div>
              </div>
              
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-primary text-black p-4 rounded-full h-24 w-24 flex flex-col items-center justify-center shadow-lg"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                <span className="text-2xl font-bold">2+</span>
                <span className="text-xs">Years</span>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-serif font-bold mb-6">Software Developer with a passion for creating exceptional user experiences</h3>
              
              <p className="mb-6">
                I'm a Software Developer with a strong proficiency in frontend technologies, including HTML, CSS, JavaScript, ReactJS, Material UI, Bootstrap, and jQuery. Backed by solid skills in backend development with Node.js, Express.js, and a deep understanding of database management using MySQL.
              </p>
              
              <p className="mb-8">
                Known for creating responsive and visually appealing web applications that enhance user engagement. Adept at collaborating with teams to deliver high-quality projects and passionate about staying current with industry trends and best practices.
              </p>
              
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { title: "2+", subtitle: "Years Experience" },
                  { title: "10+", subtitle: "Projects" },
                  { title: "3", subtitle: "Companies" }
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
                  className="px-6 py-3 bg-primary text-black rounded-full font-medium shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Me
                </motion.a>
                <motion.a 
                  href="#" 
                  className="px-6 py-3 border border-primary text-primary rounded-full font-medium hover:bg-primary hover:text-black transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Download CV
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
