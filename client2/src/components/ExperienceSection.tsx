import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BriefcaseIcon, GraduationCapIcon } from 'lucide-react';
import { resumeData } from '@/data/resumeData';

interface ExperienceSectionProps {
  ref?: (node: HTMLDivElement | null) => void;
}

interface WorkExperience {
  type: 'work';
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

interface Education {
  type: 'education';
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

type ExperienceItem = WorkExperience | Education;

// Type guards
function isWorkExperience(item: ExperienceItem): item is WorkExperience {
  return item.type === 'work';
}

function isEducation(item: ExperienceItem): item is Education {
  return item.type === 'education';
}

const ExperienceSection = forwardRef<HTMLDivElement, ExperienceSectionProps>(
  (props, ref) => {
    const { experiences, education } = resumeData;
    // Type assertions ensure TypeScript recognizes our data structure
    const allTimelineItems = [...experiences as WorkExperience[], ...education as Education[]].sort((a, b) => {
      // Sort by end date descending (newer first)
      const aEnd = a.endDate === 'Present' ? new Date() : new Date(a.endDate);
      const bEnd = b.endDate === 'Present' ? new Date() : new Date(b.endDate);
      return bEnd.getTime() - aEnd.getTime();
    });

    return (
      <section 
        id="experience" 
        ref={ref}
        className="min-h-screen pt-28 pb-20 px-6 md:px-20 relative section-transition"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-sans tracking-wider">JOURNEY</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">My <span className="text-primary">Experience</span></h2>
          </div>
          
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 h-full w-1 bg-gradient-to-b from-primary via-secondary to-primary transform md:translate-x-[-50%]"></div>
            
            {/* Timeline items */}
            {allTimelineItems.map((item, index) => (
              <motion.div 
                key={index}
                className="mb-16 last:mb-0 relative z-10 md:ml-0 flex flex-col md:flex-row items-start"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div 
                  className="timeline-dot absolute left-[-9px] md:left-1/2 md:transform md:translate-x-[-50%] w-5 h-5 bg-primary rounded-full border-4 border-background dark:border-background"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                ></motion.div>
                
                <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0 ml-8 md:ml-0">
                  <motion.div 
                    className="tilt-card glass p-6 rounded-xl shadow-xl border border-primary/30 md:ml-auto"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-serif font-bold mb-2">
                      {isWorkExperience(item) ? item.company : isEducation(item) ? item.school : ''}
                    </h3>
                    <p className="text-primary font-medium">{item.startDate} - {item.endDate}</p>
                    <p className="mt-2 font-medium">
                      {isWorkExperience(item) ? item.title : isEducation(item) ? item.degree : ''}
                    </p>
                    {item.location && <p className="mt-1">{item.location}</p>}
                  </motion.div>
                </div>
                
                <div className="md:w-1/2 md:pl-12 ml-8 md:ml-0">
                  <motion.div 
                    className="glass p-6 rounded-xl shadow-xl border border-primary/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isEducation(item) ? (
                      <div>
                        <p className="mb-4">{item.description}</p>
                        <div className="flex items-center gap-2 text-primary">
                          <GraduationCapIcon className="h-5 w-5" />
                          <span>{item.field}</span>
                        </div>
                      </div>
                    ) : (
                      <ul className="list-disc ml-4 space-y-2">
                        {isWorkExperience(item) && item.responsibilities.map((responsibility: string, idx: number) => (
                          <li key={idx}>{responsibility}</li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

ExperienceSection.displayName = 'ExperienceSection';
export default ExperienceSection;
