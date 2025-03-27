import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
      closeMobileMenu();
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="glass px-6 py-3 md:px-8 md:py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center animate-float-slow">
            <span className="text-white font-serif font-bold text-xl">DJ</span>
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-bold">
            <span className="text-primary">Dhanush</span> J
          </h1>
        </div>
        
        <div className="hidden md:flex space-x-8 items-center">
          {['home', 'about', 'experience', 'skills', 'projects', 'contact'].map((item) => (
            <button 
              key={item}
              onClick={() => scrollToSection(item)}
              className="hover:text-primary transition-colors font-medium capitalize"
            >
              {item}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden p-2 text-primary hover:text-secondary transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden glass px-6 py-4 flex flex-col space-y-4 absolute w-full transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        {['home', 'about', 'experience', 'skills', 'projects', 'contact'].map((item) => (
          <button
            key={item}
            onClick={() => scrollToSection(item)}
            className="hover:text-primary transition-colors font-medium text-left capitalize"
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
