import { motion } from 'framer-motion';
import { FaCalendar, FaRandom } from 'react-icons/fa';
import { useNasaAPOD } from '../../hooks/useNasaAPOD';
import AdvancedImageViewer from './AdvancedImageViewer';

const NasaAPOD = () => {
  const { loading, error, apodData, selectedDate, setSelectedDate, fetchAPOD } = useNasaAPOD();

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">
            Astronomy Picture of the Day
          </h1>
        </motion.header>

        {/* Controls */}
        <div className="mb-8 flex flex-wrap gap-4 items-center">
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              min="1995-06-16"
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white
                        focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none
                        appearance-none w-48"
            />
            <FaCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fetchAPOD()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 
                     rounded-lg text-white transition-colors"
          >
            <FaRandom className="w-4 h-4" />
            Random
          </motion.button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : apodData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AdvancedImageViewer image={apodData} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200">
    {message}
  </div>
);

export default NasaAPOD;