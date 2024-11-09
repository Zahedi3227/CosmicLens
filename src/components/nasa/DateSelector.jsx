import { motion } from 'framer-motion';
import { FaCalendar, FaRandom } from 'react-icons/fa';

const DateSelector = ({ selectedDate, onDateChange, onRandomDate }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          min="1995-06-16"
          className="appearance-none bg-space-800/50 border border-space-700 rounded-lg 
                   px-4 py-2 pr-10 text-space-100 focus:outline-none focus:border-cosmic-500
                   transition-all w-40"
        />
        <FaCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-space-400 pointer-events-none" />
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onRandomDate}
        className="bg-cosmic-500 hover:bg-cosmic-600 text-white px-4 py-2 rounded-lg
                 flex items-center gap-2 transition-colors"
      >
        <FaRandom className="w-4 h-4" />
        Random
      </motion.button>
    </div>
  );
};

export default DateSelector; 