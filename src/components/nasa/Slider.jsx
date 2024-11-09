import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export const Slider = ({ value, onChange, min = 0, max = 100 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newValue = Math.round(min + percentage * (max - min));
    onChange(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div
      ref={sliderRef}
      className="relative h-2 bg-space-700 rounded-full cursor-pointer"
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute h-full bg-cosmic-500 rounded-full"
        style={{ width: `${percentage}%` }}
      />
      <motion.div
        className="absolute w-4 h-4 bg-cosmic-400 rounded-full -top-1 -ml-2"
        style={{ left: `${percentage}%` }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      />
    </div>
  );
}; 