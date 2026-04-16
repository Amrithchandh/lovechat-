import React from 'react';
import { motion } from 'framer-motion';

const AnimatedFlower: React.FC = () => {
  return (
    <div className="relative w-32 h-32 mb-8">
      {/* Stem */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: 60 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 bg-green-500 rounded-full"
      />
      
      {/* Leaves */}
      <motion.div 
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: -45 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute bottom-6 left-[40%] w-6 h-3 bg-green-400 rounded-full origin-right"
      />
      <motion.div 
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 45 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-10 left-[55%] w-6 h-3 bg-green-400 rounded-full origin-left"
      />

      {/* Flower Petals */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: i * 60 }}
            animate={{ scale: 1, rotate: i * 60 + 360 }}
            transition={{ 
              scale: { duration: 1.5, delay: 1.8 + i * 0.1, ease: "easeOut" },
              rotate: { duration: 20, repeat: Infinity, ease: "linear" }
            }}
            style={{ 
              transformOrigin: 'bottom center',
            }}
            className="absolute bottom-1/2 left-1/4 w-10 h-14 bg-gradient-to-t from-love-500 to-love-300 rounded-full opacity-80 blur-[1px]"
          />
        ))}
        
        {/* Center */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 2.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full shadow-lg shadow-yellow-200/50 z-10"
        />
      </div>

      {/* Glow Effect */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-love-200 rounded-full blur-3xl -z-10"
      />
    </div>
  );
};

export default AnimatedFlower;
