import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
    FaAdjust,
    FaCompress,
    FaDownload, FaExpand
} from 'react-icons/fa';

const AdvancedImageViewer = ({ image }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [imageSettings, setImageSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    scale: 1,
  });
  const imageRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  const handleImageAdjustment = (type, value) => {
    setImageSettings(prev => ({ ...prev, [type]: value }));
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${image.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const imageStyle = {
    filter: `brightness(${imageSettings.brightness}%) 
            contrast(${imageSettings.contrast}%) 
            saturate(${imageSettings.saturation}%)`,
    transform: `scale(${imageSettings.scale})`,
  };

  useEffect(() => {
    const calculateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const maxHeight = window.innerHeight * 0.7; // 70% of viewport height
        
        let width = containerWidth;
        let height = (containerWidth * 9) / 16; // 16:9 aspect ratio

        if (height > maxHeight) {
          height = maxHeight;
          width = (height * 16) / 9;
        }

        setDimensions({ width, height });
      }
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    return () => window.removeEventListener('resize', calculateDimensions);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-space-900/30 backdrop-blur-lg rounded-2xl overflow-hidden border border-space-700/10"
    >
      {/* Image Container */}
      <div className="relative group">
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
          <img
            ref={imageRef}
            src={image.url}
            alt={image.title}
            className={`w-full ${isFullscreen ? 'h-screen object-contain' : 'aspect-[16/9] object-cover'} 
              transition-transform duration-500`}
            style={imageStyle}
          />

          {/* Overlay Controls */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
              <div className="flex justify-end gap-2">
                <ControlButton
                  icon={showControls ? FaCompress : FaAdjust}
                  onClick={() => setShowControls(!showControls)}
                  tooltip="Image Controls"
                />
                <ControlButton
                  icon={isFullscreen ? FaCompress : FaExpand}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  tooltip="Fullscreen"
                />
                <ControlButton
                  icon={FaDownload}
                  onClick={handleDownload}
                  tooltip="Download"
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

// Update the ControlButton component
const ControlButton = ({ icon: Icon, onClick, tooltip }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="p-2 rounded-lg bg-space-800/80 hover:bg-space-700/80 
              text-white/80 hover:text-white transition-colors"
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