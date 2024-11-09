import { AnimatePresence, motion } from 'framer-motion';
import {
    Download,
    Expand,
    Minimize2,
    Settings,
    X
} from 'lucide-react';
import { useRef, useState } from 'react';
import FavoriteAnimation from '../common/FavoriteAnimation';

const AdvancedImageViewer = ({ image, onToggleFavorite, isFavorite }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [imageSettings, setImageSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    scale: 1,
  });
  const imageRef = useRef(null);

  const handleImageAdjustment = (type, value) => {
    setImageSettings(prev => ({ ...prev, [type]: value }));
  };

  const handleDownload = async () => {
    try {
      if (image.media_type === 'video') {
        window.open(image.url, '_blank');
        return;
      }

      // For HD images, prefer hdurl if available
      const imageUrl = image.hdurl || image.url;
      
      // Method 1: Direct download attempt
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.download = `NASA_APOD_${image.date}.jpg`;
      
      // Try direct download first
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Method 2: Fallback to opening in new tab
      setTimeout(() => {
        window.open(imageUrl, '_blank');
      }, 1000);

    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: Open image in new tab
      window.open(image.url, '_blank');
    }
  };

  const imageStyle = {
    filter: `brightness(${imageSettings.brightness}%) 
            contrast(${imageSettings.contrast}%) 
            saturate(${imageSettings.saturation}%)`,
    transform: `scale(${imageSettings.scale})`,
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-zinc-900/30 backdrop-blur-lg rounded-2xl overflow-hidden border border-zinc-800/50"
    >
      {/* Image Container */}
      <div className="relative group">
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
          {image.media_type === 'video' ? (
            <iframe
              src={image.url}
              title={image.title}
              className="w-full aspect-video"
              allowFullScreen
            />
          ) : (
            <img
              ref={imageRef}
              src={image.url}
              alt={image.title}
              className={`w-full ${isFullscreen ? 'h-screen object-contain' : 'aspect-video object-cover'} 
                transition-transform duration-500`}
              style={imageStyle}
            />
          )}

          {/* Overlay Controls */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
              <div className="flex justify-end gap-2">
                <ControlButton
                  icon={showControls ? X : Settings}
                  onClick={() => setShowControls(!showControls)}
                  tooltip="Image Controls"
                />
                <ControlButton
                  icon={isFullscreen ? Minimize2 : Expand}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  tooltip="Fullscreen"
                />
                {image.media_type === 'image' && (
                  <ControlButton
                    icon={Download}
                    onClick={handleDownload}
                    tooltip="Open Image in New Tab"
                  />
                )}
                <FavoriteAnimation 
                  isActive={isFavorite}
                  onToggle={() => {
                    onToggleFavorite(image);
                    // Show feedback toast or animation here if needed
                  }}
                />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <h2 className="text-xl font-bold text-white mb-1">{image.title}</h2>
              <p className="text-sm text-white/80">{image.date}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Controls Panel */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 border-t border-space-700/10 bg-space-800/30"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ImageControl
                label="Brightness"
                value={imageSettings.brightness}
                onChange={(v) => handleImageAdjustment('brightness', v)}
              />
              <ImageControl
                label="Contrast"
                value={imageSettings.contrast}
                onChange={(v) => handleImageAdjustment('contrast', v)}
              />
              <ImageControl
                label="Saturation"
                value={imageSettings.saturation}
                onChange={(v) => handleImageAdjustment('saturation', v)}
              />
              <ImageControl
                label="Zoom"
                value={imageSettings.scale * 100}
                onChange={(v) => handleImageAdjustment('scale', v / 100)}
                min={50}
                max={200}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description Panel */}
      <div className="p-4 bg-space-800/30">
        <p className="text-space-100/80 leading-relaxed text-sm">{image.explanation}</p>
        {image.copyright && (
          <p className="mt-2 text-xs text-space-400">© {image.copyright}</p>
        )}
      </div>
    </motion.div>
  );
};

// Update ControlButton component
const ControlButton = ({ icon: Icon, onClick, tooltip, className = '' }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`p-2 rounded-lg bg-space-800/80 hover:bg-space-700/80 
              text-white/80 hover:text-white transition-colors ${className}`}
    title={tooltip}
  >
    <Icon className="w-5 h-5" />
  </motion.button>
);

// Update the ImageControl component
const ImageControl = ({ label, value, onChange, min = 0, max = 200 }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center">
      <label className="text-xs text-space-300">{label}</label>
      <span className="text-xs text-space-400">{value}%</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-cosmic-500"
    />
  </div>
);

export default AdvancedImageViewer; 