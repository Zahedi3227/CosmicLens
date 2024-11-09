import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaExpand, FaHeart, FaShare } from 'react-icons/fa';

const EnhancedImageViewer = ({ image }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: image.title,
        text: image.explanation,
        url: window.location.href,
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-accent-500/10 to-highlight-500/10">
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
          {image.media_type === "image" ? (
            <img
              src={image.url}
              alt={image.title}
              className={`w-full ${isFullscreen ? 'h-screen object-contain' : 'aspect-video object-cover'} 
                transition-transform duration-300 group-hover:scale-105`}
            />
          ) : (
            <iframe
              src={image.url}
              title={image.title}
              className="w-full aspect-video"
              allowFullScreen
            />
          )}

          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent 
            opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 w-full p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-2">{image.title}</h2>
                  <p className="text-sm text-white/80">{image.date}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsFavorited(!isFavorited)}
                    className={`p-2 rounded-full transition-all ${
                      isFavorited ? 'bg-red-500' : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <FaHeart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
                  >
                    <FaShare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all"
                  >
                    <FaExpand className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Details */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary-900/50 backdrop-blur-xl rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">{image.title}</h3>
        <p className="text-sm text-white/80">{image.explanation}</p>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedImageViewer; 