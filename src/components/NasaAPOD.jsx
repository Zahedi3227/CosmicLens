import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaExpand, FaHeart, FaInfoCircle, FaRandom, FaShare } from 'react-icons/fa';
import '../css/NasaAPOD.css';

const API_KEY = "e3HrsoSRFPcCDDQYTlH5p6Qzm15MEtMQNz7jB7K8";
const API_URL = "https://api.nasa.gov/planetary/apod";

const NasaAPOD = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apodData, setApodData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDetails, setShowDetails] = useState(false);
  const [imageStats, setImageStats] = useState(null);
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 1000));

  const getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchAPOD = async (date = null) => {
    setLoading(true);
    setError('');

    const dateParam = date || formatDate(getRandomDate(new Date('1995-06-16'), new Date()));

    try {
      const response = await fetch(`${API_URL}?api_key=${API_KEY}&date=${dateParam}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setApodData(data);
      setSelectedDate(dateParam);
    } catch (error) {
      setError("Failed to fetch data. Please try again later.");
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: apodData.title,
        text: apodData.explanation,
        url: window.location.href,
      });
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    fetchAPOD(e.target.value);
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(apodData.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${apodData.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  useEffect(() => {
    fetchAPOD();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 md:p-8 rounded-xl shadow-2xl text-white backdrop-blur-sm border border-white/10">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 via-blue-400 to-purple-500 bg-clip-text text-transparent pb-2">
            CosmicLens
          </h1>
          <p className="text-sm md:text-base text-gray-400">Explore the Universe Daily</p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm border border-white/5 w-full md:w-auto">
            <div className="relative date-picker-container">
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                max={new Date().toISOString().split('T')[0]}
                min="1995-06-16"
                className="bg-transparent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/10 hover:border-purple-500/50 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchAPOD()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg transition-all duration-300 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-purple-500/25"
            >
              <FaRandom className="text-white/90" />
            </motion.button>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDetails(!showDetails)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg"
            >
              <FaInfoCircle className="text-white/90" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadImage}
              className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg"
            >
              <FaDownload className="text-white/90" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {apodData && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="relative group">
                <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full h-[400px]'}`}>
                  <img
                    src={apodData.url}
                    alt={apodData.title}
                    className={`
                      ${isFullscreen ? 'w-full h-full object-contain' : 'w-full h-full object-cover rounded-xl'}
                      transition-all duration-300 hover:shadow-lg
                    `}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => setIsFavorited(!isFavorited)}
                        className={`p-2 rounded-full ${isFavorited ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'}`}
                      >
                        <FaHeart className={isFavorited ? 'text-white' : 'text-white'} />
                      </button>
                      <button
                        onClick={handleShare}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                      >
                        <FaShare className="text-white" />
                      </button>
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30"
                      >
                        <FaExpand className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold">{apodData.title}</h2>
                  <p className="text-blue-400">{apodData.date}</p>
                </div>
                <p className="text-gray-300 leading-relaxed">{apodData.explanation}</p>
                {apodData.copyright && (
                  <p className="text-sm text-gray-400">© {apodData.copyright}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default NasaAPOD;