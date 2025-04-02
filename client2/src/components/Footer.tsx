import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-8 px-6 md:px-20 bg-secondary text-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-black font-serif font-bold text-sm">DJ</span>
              </div>
              <h2 className="text-xl font-serif font-bold">
                <span className="text-primary">Dhanush</span> J
              </h2>
            </div>
            <p className="text-sm max-w-md">Software Developer specializing in creating responsive and visually appealing web and mobile applications.</p>
          </div>
          
          <div>
            <p className="text-sm text-center md:text-right">
              &copy; {new Date().getFullYear()} Dhanush J. All rights reserved.
            </p>
            <div className="flex gap-4 justify-center md:justify-end mt-4">
              {[
                { icon: <Linkedin className="h-4 w-4" />, url: "#", label: "LinkedIn" },
                { icon: <Github className="h-4 w-4" />, url: "#", label: "GitHub" },
                { icon: <Twitter className="h-4 w-4" />, url: "#", label: "Twitter" },
                { icon: <Instagram className="h-4 w-4" />, url: "#", label: "Instagram" }
              ].map((social, index) => (
                <motion.a 
                  key={index}
                  href={social.url} 
                  className="text-primary hover:text-white transition-colors"
                  aria-label={social.label}
                  whileHover={{ y: -3 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
