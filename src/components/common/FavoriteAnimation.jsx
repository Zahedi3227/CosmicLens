import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const FavoriteAnimation = ({ isActive, onToggle }) => {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300
        ${isActive 
          ? 'bg-red-500 text-white' 
          : 'bg-space-800/50 text-space-300 hover:bg-space-700/50'}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isActive ? 'filled' : 'empty'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Heart 
            className={`w-5 h-5 ${isActive ? 'fill-current' : ''}`} 
          />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export default FavoriteAnimation; 