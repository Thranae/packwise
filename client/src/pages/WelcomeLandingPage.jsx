import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function WelcomeLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col justify-between">
      {/* Background Image Full Bleed */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop")'
        }}
      />

      {/* Very subtle gradient overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />

      {/* Typography Section (Top) */}
      <div className="relative z-10 px-8 pt-[calc(10vh+var(--safe-top))]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-baseline gap-3"
        >
          <span className="text-white text-5xl sm:text-6xl font-bold tracking-tighter drop-shadow-lg">
            GT.
          </span>
          <span 
            className="text-white text-6xl sm:text-7xl font-normal drop-shadow-xl" 
            style={{ fontFamily: "'Pacifico', cursive" }}
          >
            Vacation
          </span>
        </motion.div>
      </div>

      {/* Button Section (Bottom) */}
      <div className="relative z-10 w-full px-8 pb-[calc(10vh+var(--safe-bottom))] flex justify-center">
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => navigate(ROUTES.SIGNUP)}
          className="w-[200px] h-[64px] rounded-[32px] ios-liquid-button text-white text-[20px] font-semibold flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Start
        </motion.button>
      </div>
    </div>
  );
}
