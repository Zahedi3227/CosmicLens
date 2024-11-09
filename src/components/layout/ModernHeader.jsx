import { motion } from 'framer-motion';
import { FaCalendar, FaClock, FaRandom } from 'react-icons/fa';
import Button from '../common/Button'; // Importing the Button component

const ModernHeader = ({ selectedDate, onDateChange, onRandomDate }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10"
    >
      {/* Background Blur Effect */}
      <div className="absolute inset-0 bg-nebula-900/10 backdrop-blur-xl rounded-2xl" />

      <div className="relative px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-6xl font-bold mb-3 bg-gradient-to-r from-nebula-400 via-cosmos-400 to-aurora-400 
                       bg-clip-text text-transparent font-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Cosmic Explorer
          </motion.h1>
          <motion.p 
            className="text-lg text-nebula-200/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Journey through space and time with NASA's astronomical wonders
          </motion.p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Date Picker */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-nebula-500/20 to-cosmos-500/20 
                          rounded-xl blur group-hover:opacity-75 transition-opacity" />
            <div className="relative flex items-center bg-nebula-900/50 rounded-xl border border-nebula-700/30 
                          overflow-hidden hover:border-nebula-500/50 transition-colors ">
              <span className="pl-4">
                <FaCalendar className="w-5 h-5 text-nebula-400" />
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min="1995-06-16"
                className=" bg-transparent pl-6 pr-4 py-3 text-nebula-100 focus:outline-none w-48
                         placeholder-nebula-400/50"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              icon={FaRandom}
              onClick={onRandomDate}
              className="bg-gradient-to-r from-nebula-600 to-cosmos-600 hover:from-nebula-500 hover:to-cosmos-500 text-white shadow-nebula-500/25"
            >
              Random Date
            </Button>
            <Button
              icon={FaClock}
              onClick={() => onDateChange(new Date().toISOString().split('T')[0])}
              className="bg-nebula-900/50 hover:bg-nebula-800/50 text-nebula-100 border border-nebula-700/30 hover:border-nebula-500/50"
            >
              Today
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default ModernHeader; 