import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('nasaHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

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
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default History; 