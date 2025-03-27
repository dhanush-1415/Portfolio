import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import ThreeDSkills from './3d/ThreeDSkills';
import { resumeData } from '@/data/resumeData';

interface SkillSectionProps {
  ref?: (node: HTMLDivElement | null) => void;
}

interface SkillBarProps {
  name: string;
  percentage: number;
}

const SkillBar = ({ name, percentage }: SkillBarProps) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="font-medium">{name}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div 
          className="skill-progress h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          style={{ width: `${percentage}%` }}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        ></motion.div>
      </div>
    </div>
  );
};

interface SkillCardProps {
  icon: string;
  name: string;
  index: number;
}

const SkillCard = ({ icon, name, index }: SkillCardProps) => {
  // Dynamically get the Lucide icon
  const LucideIcon = (LucideIcons as Record<string, Icon>)[
    icon.charAt(0).toUpperCase() + icon.slice(1)
  ] || LucideIcons.Code;

  return (
    <motion.div 
      className="glass p-4 rounded-xl border border-primary/30 shadow-xl flex flex-col items-center justify-center text-center transition-all hover:scale-105 hover:border-primary"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className="text-primary text-3xl mb-3">
        <LucideIcon className="h-8 w-8 mx-auto" />
      </div>
      <h4 className="font-medium">{name}</h4>
    </motion.div>
  );
};

const SkillsSection = forwardRef<HTMLDivElement, SkillSectionProps>(
  (props, ref) => {
    const { frontendSkills, backendSkills, additionalSkills } = resumeData;

    return (
      <section 
        id="skills" 
        ref={ref}
        className="min-h-screen pt-28 pb-20 px-6 md:px-20 relative section-transition"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-primary font-sans tracking-wider">EXPERTISE</p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Technical <span className="text-primary">Skills</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* 3D Skills Visualization */}
            <div className="relative w-full flex justify-center items-center order-2 md:order-1">
              <ThreeDSkills skills={frontendSkills.concat(backendSkills).map(skill => skill.name)} />
            </div>
            
            {/* Skills progress bars */}
            <div className="glass p-8 rounded-xl border border-primary/30 shadow-xl order-1 md:order-2">
              <h3 className="text-2xl font-serif font-bold mb-8">Professional Skillset</h3>
              
              {/* Frontend skills */}
              <div className="mb-10">
                <h4 className="text-lg font-medium mb-4 text-primary">Frontend Technologies</h4>
                
                <div className="space-y-6">
                  {frontendSkills.map((skill, index) => (
                    <SkillBar key={index} name={skill.name} percentage={skill.percentage} />
                  ))}
                </div>
              </div>
              
              {/* Backend skills */}
              <div>
                <h4 className="text-lg font-medium mb-4 text-primary">Backend Technologies</h4>
                
                <div className="space-y-6">
                  {backendSkills.map((skill, index) => (
                    <SkillBar key={index} name={skill.name} percentage={skill.percentage} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional skills */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {additionalSkills.map((skill, index) => (
              <SkillCard key={index} icon={skill.icon} name={skill.name} index={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }
);

SkillsSection.displayName = 'SkillsSection';
export default SkillsSection;
