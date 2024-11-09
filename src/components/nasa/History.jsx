import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFavorites } from '../../hooks/useFavorites';

const History = () => {
  const [history, setHistory] = useState([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const storedHistory = localStorage.getItem('nasaHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const FavoriteIndicator = ({ item }) => {
    const isImageFavorited = isFavorite(item.url);

    return (
      <motion.button
        onClick={() => toggleFavorite(item)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm
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
              className={`w-4 h-4 ${isImageFavorited ? 'fill-current' : ''}`} 
            />
          </motion.div>
        </AnimatePresence>
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {history.map((item, index) => (
        <motion.div
          key={item.date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative bg-space-900/30 backdrop-blur-lg rounded-lg overflow-hidden 
                     group hover:shadow-lg hover:shadow-cosmic-500/20 transition-all duration-300"
        >
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-48 object-cover transition-transform duration-300 
                       group-hover:scale-105"
          />
          <FavoriteIndicator item={item} />
          <div className="p-4">
            <h3 className="text-lg font-medium text-white">{item.title}</h3>
            <p className="text-sm text-space-300">{item.date}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default History; 