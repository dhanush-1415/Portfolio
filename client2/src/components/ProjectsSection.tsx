import { forwardRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import { resumeData } from '@/data/resumeData';

interface ProjectSectionProps {
  ref?: (node: HTMLDivElement | null) => void;
}

type ProjectCategory = 'All' | 'Web' | 'Mobile' | 'Full Stack';

const ProjectsSection = forwardRef<HTMLDivElement, ProjectSectionProps>(
  (props, ref) => {
    const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
    const [visibleProjects, setVisibleProjects] = useState(6);
    const { projects } = resumeData;

    const filteredProjects = activeCategory === 'All' 
      ? projects 
      : projects.filter(project => project.category === activeCategory);

    const displayedProjects = filteredProjects.slice(0, visibleProjects);

    const handleCategoryChange = (category: ProjectCategory) => {
      setActiveCategory(category);
      setVisibleProjects(6);  // Reset to show only first 6 projects when category changes
    };

    const showMoreProjects = () => {
      setVisibleProjects(prevCount => prevCount + 3);
    };

    return (
      <section 
        id="projects" 
        ref={ref}
        className="min-h-screen pt-28 pb-20 px-6 md:px-20 relative section-transition"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-sans tracking-wider">SHOWCASE</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">My <span className="text-primary">Projects</span></h2>
          </div>
          
          {/* Project Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {(['All', 'Web', 'Mobile', 'Full Stack'] as ProjectCategory[]).map((category) => (
              <motion.button 
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full ${
                  activeCategory === category 
                    ? 'bg-primary text-black' 
                    : 'border border-primary text-primary'
                } font-medium transition-all`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
          
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {displayedProjects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="glass rounded-xl overflow-hidden shadow-xl border border-primary/30 transition-all duration-500 transform hover:scale-105 hover:border-primary tilt-card h-full flex flex-col">
                    <div className="relative h-60 overflow-hidden">
                      {/* Project background gradients */}
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-primary/50 z-10"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-secondary/30 z-0"></div>
                      
                      {/* Project tech stack badges */}
                      <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <span 
                            key={idx} 
                            className={`px-2 py-1 ${
                              idx % 3 === 0 ? 'bg-primary' : idx % 3 === 1 ? 'bg-secondary' : 'bg-blue-400'
                            } text-white text-xs rounded-full`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {/* View project overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/90 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <div className="p-4 text-center text-white">
                          <p className="font-medium">View Project</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-serif font-bold mb-2">{project.title}</h3>
                      <p className="mb-4 flex-grow">{project.description}</p>
                      
                      <div className="flex justify-between items-center mt-auto">
                        <motion.a 
                          href={project.demoUrl || "#"} 
                          className="text-primary hover:underline font-medium flex items-center"
                          whileHover={{ x: 3 }}
                        >
                          View Details
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </motion.a>
                        
                        <div className="flex gap-2">
                          <motion.a 
                            href={project.githubUrl || "#"} 
                            className="text-lg hover:text-primary transition-colors" 
                            title="GitHub Repository"
                            whileHover={{ y: -3 }}
                          >
                            <Github className="h-5 w-5" />
                          </motion.a>
                          <motion.a 
                            href={project.demoUrl || "#"} 
                            className="text-lg hover:text-primary transition-colors" 
                            title="Live Demo"
                            whileHover={{ y: -3 }}
                          >
                            <ExternalLink className="h-5 w-5" />
                          </motion.a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* View More Projects Button */}
          {filteredProjects.length > visibleProjects && (
            <div className="text-center mt-12">
              <motion.button 
                className="px-8 py-3 bg-primary text-black rounded-full font-medium shadow-lg flex items-center mx-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={showMoreProjects}
              >
                View More Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          )}
        </div>
      </section>
    );
  }
);

ProjectsSection.displayName = 'ProjectsSection';
export default ProjectsSection;
