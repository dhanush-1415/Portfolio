import { useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ExperienceSection from '@/components/ExperienceSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ParticlesBackground from '@/components/ParticlesBackground';
import BackToTopButton from '@/components/ui/BackToTopButton';

const Home = () => {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('.section-transition');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const addToSectionsRef = (el: HTMLDivElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="relative">
      <ParticlesBackground />
      <Navbar />
      <main>
        <HeroSection ref={addToSectionsRef} />
        <AboutSection ref={addToSectionsRef} />
        <ExperienceSection ref={addToSectionsRef} />
        <SkillsSection ref={addToSectionsRef} />
        <ProjectsSection ref={addToSectionsRef} />
        <ContactSection ref={addToSectionsRef} />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default Home;
