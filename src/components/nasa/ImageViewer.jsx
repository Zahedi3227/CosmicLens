import { motion } from 'framer-motion';

const ImageViewer = ({ image }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="rounded-xl overflow-hidden bg-black/20">
        {image.media_type === "image" ? (
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-auto"
            loading="lazy"
          />
        ) : (
          <div className="aspect-video">
            <iframe
              src={image.url}
              title={image.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-white">
            {image.title}
          </h2>
          <span className="text-sm text-white/60">
            {image.date}
          </span>
        </div>
        
        <p className="text-sm text-white/80 leading-relaxed">
          {image.explanation}
        </p>
      </div>
    </motion.div>
  );
};

export default ImageViewer; 