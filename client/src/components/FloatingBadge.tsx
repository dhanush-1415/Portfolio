import { motion } from 'framer-motion';
import { Icon, LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface FloatingBadgeProps {
  icon: string;
  text: string;
  position: string;
  color?: string;
  delay?: number;
}

const FloatingBadge = ({ icon, text, position, color = 'bg-card', delay = 0 }: FloatingBadgeProps) => {
  // Dynamically get the Lucide icon
  const LucideIcon = (LucideIcons as Record<string, Icon>)[
    icon.charAt(0).toUpperCase() + icon.slice(1)
  ] || LucideIcons.Code;

  return (
    <motion.div 
      className={`absolute ${position} ${color} p-3 rounded-lg shadow-xl z-10 glass`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: position.includes('right') ? 6 : -6,
        y: [0, -10, 0]
      }}
      transition={{ 
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: { 
          duration: 4,
          repeat: Infinity,
          repeatType: 'reverse',
          delay
        }
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
          <LucideIcon className="h-4 w-4" />
        </div>
        <span className="font-medium">{text}</span>
      </div>
    </motion.div>
  );
};

export default FloatingBadge;
