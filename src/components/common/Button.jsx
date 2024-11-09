import { motion } from 'framer-motion';

const Button = ({ onClick, icon: Icon, className = '', children }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg transition-all duration-300 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-purple-500/25 ${className}`}
    >
      {Icon && <Icon className="text-white/90" />}
      {children}
    </motion.button>
  );
};

export default Button; 