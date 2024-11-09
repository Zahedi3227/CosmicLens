import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Heart, Shuffle } from 'lucide-react';
import { useNasaAPOD } from '../../hooks/useNasaAPOD';
import AdvancedImageViewer from './AdvancedImageViewer';

const NasaAPOD = () => {
  const { 
    loading, 
    error, 
    apodData, 
    selectedDate, 
    setSelectedDate, 
    fetchAPOD,
    toggleFavorite,
    isFavorite 
  } = useNasaAPOD();

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchAPOD(newDate);
  };

  const FavoriteButton = ({ imageUrl }) => {
    const isImageFavorited = isFavorite(imageUrl);
    
    return (
      <motion.button
        onClick={() => toggleFavorite(apodData)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300
          ${isImageFavorited 
            ? 'bg-cosmic-500 text-white' 
            : 'bg-space-800/50 text-space-300 hover:bg-space-700/50'}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isImageFavorited ? 'filled' : 'empty'}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Heart 
              className={`w-5 h-5 ${isImageFavorited ? 'fill-current' : ''}`} 
            />
          </motion.div>
        </AnimatePresence>
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cosmic-400 to-nebula-400 
                       bg-clip-text text-transparent font-display mb-2">
            CosmicLens
          </h1>
          <p className="text-zinc-400 text-lg">
            Discover the Cosmos, One Image at a Time
          </p>
        </motion.header>

        {/* Controls */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-center">
          <div className="relative w-40">
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              max={new Date().toISOString().split('T')[0]}
              min="1995-06-16"
              className="bg-transparent border border-zinc-800 rounded-lg px-4 py-2 text-white
                        focus:border-cosmic-500 focus:ring-1 focus:ring-cosmic-500 outline-none
                        appearance-none w-full date-input"
            />
            <Calendar className="absolute  right-9 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none w-5 h-5" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fetchAPOD()}
            className="flex items-center gap-2 bg-cosmic-600 hover:bg-cosmic-700 px-4 py-2 
                     rounded-lg text-white transition-colors"
          >
            <Shuffle className="w-4 h-4" />
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
              <AdvancedImageViewer 
                image={apodData}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite(apodData.date)}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-2 border-cosmic-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-200">
    {message}
  </div>
);

export default NasaAPOD;