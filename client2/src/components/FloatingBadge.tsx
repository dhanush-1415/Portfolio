import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Define a type for Lucide icon components
type LucideIcon = React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
    ref?: React.Ref<SVGSVGElement>;
} & LucideProps>;

interface FloatingBadgeProps {
  icon: string;
  text: string;
  position: string;
  color?: string;
  delay?: number;
}

const FloatingBadge = ({ icon, text, position, color = 'bg-card', delay = 0 }: FloatingBadgeProps) => {
  // Dynamically get the Lucide icon
  const iconName = icon.charAt(0).toUpperCase() + icon.slice(1);
  const LucideIcon = iconName in LucideIcons 
    ? (LucideIcons as any)[iconName] 
    : LucideIcons.Code;

  return (
    <motion.div 
      className={`absolute ${position} ${color} px-3 py-2 rounded-xl shadow-2xl z-10 backdrop-blur-xl border border-white/20`}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotate: position.includes('right') ? 3 : -3,
        y: [0, -8, 0]
      }}
      whileHover={{ 
        scale: 1.05, 
        rotate: 0,
        boxShadow: "0 0 15px rgba(var(--primary), 0.5)"
      }}
      transition={{ 
        opacity: { duration: 0.6, delay },
        scale: { duration: 0.6, delay },
        y: { 
          duration: 5,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: "easeInOut",
          delay
        }
      }}
    >
      <div className="flex items-center gap-2.5">
        <motion.div 
          className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center relative overflow-hidden"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary via-secondary to-primary opacity-80"></div>
          <div className="relative z-10">
            <LucideIcon className="h-5 w-5 text-white animate-pulse" />
          </div>
        </motion.div>
        <div className="flex flex-col">
          <span className="font-bold text-sm">{text}</span>
          <span className="text-xs opacity-80">Expert Level</span>
        </div>
      </div>
    </motion.div>
  );
};

export default FloatingBadge;
