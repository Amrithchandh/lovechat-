import React from 'react';
import { motion } from 'framer-motion';

const WalkingMonkey: React.FC = () => {
  return (
    <motion.div
      initial={{ x: '-10vw' }}
      animate={{ x: '110vw' }}
      transition={{ 
        duration: 15, 
        repeat: Infinity, 
        ease: "linear",
        delay: 2
      }}
      className="fixed bottom-10 left-0 z-0 pointer-events-none opacity-40 grayscale hover:grayscale-0 transition-all"
    >
      <div className="relative group">
        {/* Simple Monkey SVG */}
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.g
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {/* Body */}
            <circle cx="32" cy="40" r="12" fill="#8B4513" />
            {/* Head */}
            <circle cx="32" cy="24" r="10" fill="#A0522D" />
            {/* Ears */}
            <circle cx="20" cy="22" r="4" fill="#8B4513" />
            <circle cx="44" cy="22" r="4" fill="#8B4513" />
            {/* Face */}
            <ellipse cx="32" cy="26" rx="7" ry="6" fill="#DEB887" />
            {/* Eyes */}
            <circle cx="29" cy="24" r="1.5" fill="black" />
            <circle cx="35" cy="24" r="1.5" fill="black" />
            {/* Mouth */}
            <path d="M28 30C29.5 32 34.5 32 36 30" stroke="black" strokeWidth="1" strokeLinecap="round" />
            {/* Tail */}
            <path d="M20 45C15 45 12 40 12 35" stroke="#8B4513" strokeWidth="3" fill="none" strokeLinecap="round" />
          </motion.g>
          {/* Moving Legs */}
          <motion.line 
            x1="28" y1="52" x2="26" y2="60" stroke="#8B4513" strokeWidth="3" strokeLinecap="round"
          />
          <motion.line 
            x1="36" y1="52" x2="38" y2="60" stroke="#8B4513" strokeWidth="3" strokeLinecap="round"
          />
        </svg>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-slate-500 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
          Walking to my love... 🙊
        </div>
      </div>
    </motion.div>
  );
};

export default WalkingMonkey;
