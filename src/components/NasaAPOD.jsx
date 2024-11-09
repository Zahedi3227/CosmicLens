import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaExpand, FaHeart, FaRandom, FaShare } from 'react-icons/fa';
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
      if (!apodData?.url) {
        throw new Error('No image URL available');
      }

      setLoading(true);

      const response = await fetch(apodData.url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.headers.get('content-type')?.includes('image')) {
        window.open(apodData.url, '_blank');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      const filename = apodData.title
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      
      link.href = url;
      link.download = `${filename}_${apodData.date}.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed:', error);
      window.open(apodData.url, '_blank');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAPOD();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-4 md:p-8 bg-space-900"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.header 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-cosmic-400 to-primary-400 bg-clip-text text-transparent">
            CosmicLens
          </h1>
          <p className="text-space-400">Discover the Cosmos, One Image at a Time</p>
        </motion.header>

        {/* Main Content Card */}
        <div className="bg-space-800/50 backdrop-blur-xl rounded-2xl border border-space-700/50 overflow-hidden shadow-xl">
          {/* Controls Bar */}
          <div className="p-4 border-b border-space-700/50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 bg-space-900/50 p-2 rounded-xl">
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    max={new Date().toISOString().split('T')[0]}
                    min="1995-06-16"
                    className="bg-transparent rounded-lg px-4 py-2 text-space-100 
                             border border-space-700 focus:border-cosmic-500 focus:outline-none
                             transition-all w-44"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fetchAPOD()}
                  className="bg-cosmic-500 hover:bg-cosmic-600 p-2 rounded-lg 
                           text-white transition-colors flex items-center gap-2"
                >
                  <FaRandom className="w-4 h-4" />
                  <span className="hidden sm:inline">Random</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Image and Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin h-12 w-12 border-4 border-cosmic-500 border-t-transparent rounded-full"></div>
              </div>
            ) : error ? (
              <div className="p-8 text-red-400 text-center">{error}</div>
            ) : apodData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Image Container */}
                <div className="relative group">
                  <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'relative h-[500px]'}`}>
                    <img
                      src={apodData.url}
                      alt={apodData.title}
                      className={`
                        w-full h-full object-cover
                        ${isFullscreen ? 'object-contain' : 'object-cover'}
                      `}
                    />
                    
                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent">
                      {/* Image Controls */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h2 className="text-xl font-bold text-white">{apodData.title}</h2>
                            <p className="text-sm text-space-300">{apodData.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsFavorited(!isFavorited)}
                              className={`p-3 rounded-full backdrop-blur-sm transition-all
                                ${isFavorited 
                                  ? 'bg-cosmic-500 text-white' 
                                  : 'bg-space-800/50 text-space-300 hover:bg-space-700/50'}`}
                            >
                              <FaHeart className="w-5 h-5" />
                            </button>
                            <button
                              onClick={handleShare}
                              className="p-3 rounded-full bg-space-800/50 backdrop-blur-sm 
                                       text-space-300 hover:bg-space-700/50 transition-all"
                            >
                              <FaShare className="w-5 h-5" />
                            </button>
                            <button
                              onClick={downloadImage}
                              disabled={loading}
                              className="p-3 rounded-full bg-space-800/50 backdrop-blur-sm 
                                       text-space-300 hover:bg-space-700/50 transition-all"
                            >
                              <FaDownload className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setIsFullscreen(!isFullscreen)}
                              className="p-3 rounded-full bg-space-800/50 backdrop-blur-sm 
                                       text-space-300 hover:bg-space-700/50 transition-all"
                            >
                              <FaExpand className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-6 space-y-4">
                  <p className="text-space-300 leading-relaxed">
                    {apodData.explanation}
                  </p>
                  {apodData.copyright && (
                    <p className="text-sm text-space-400">
                      © {apodData.copyright}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default NasaAPOD;