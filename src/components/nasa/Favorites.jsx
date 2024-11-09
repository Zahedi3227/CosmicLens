import { motion } from 'framer-motion';
import { useFavorites } from '../../hooks/useFavorites';

const Favorites = () => {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {favorites.map((item) => (
        <motion.div
          key={item.date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-space-900/30 backdrop-blur-lg rounded-lg overflow-hidden"
        >
          <img
            src={item.url}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-medium text-white">{item.title}</h3>
            <p className="text-sm text-space-300">{item.date}</p>
            <button
              onClick={() => removeFavorite(item.url)}
              className="mt-2 text-sm text-cosmic-500 hover:text-cosmic-400"
            >
              Remove from favorites
            </button>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Favorites; 