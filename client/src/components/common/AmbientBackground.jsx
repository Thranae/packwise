import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTripContext } from '@/context/TripContext';

export const AmbientBackground = () => {
  const { currentTrip } = useTripContext();

  // Determine theme based on destination keywords
  const theme = useMemo(() => {
    if (!currentTrip?.destination) return 'default';
    
    const dest = currentTrip.destination.toLowerCase();
    
    // Cold / Icy Theme
    if (dest.includes('iceland') || dest.includes('switzerland') || dest.includes('canada') || dest.includes('alaska') || dest.includes('norway')) {
      return 'cold';
    }
    
    // Tropical / Warm Theme
    if (dest.includes('bali') || dest.includes('hawaii') || dest.includes('maldives') || dest.includes('mexico') || dest.includes('thailand') || dest.includes('beach')) {
      return 'tropical';
    }

    // Nature / Forest Theme
    if (dest.includes('costa rica') || dest.includes('amazon') || dest.includes('new zealand') || dest.includes('scotland')) {
      return 'nature';
    }

    return 'default';
  }, [currentTrip?.destination]);

  const gradients = {
    default: {
      orb1: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0) 70%)", // blue-600
      orb2: "radial-gradient(circle, rgba(79,70,229,0.15) 0%, rgba(79,70,229,0) 70%)", // indigo-600
      orb3: "radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(147,51,234,0) 70%)" // purple-600
    },
    cold: {
      orb1: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(6,182,212,0) 70%)", // cyan-500
      orb2: "radial-gradient(circle, rgba(96,165,250,0.15) 0%, rgba(96,165,250,0) 70%)", // blue-400
      orb3: "radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)" // white
    },
    tropical: {
      orb1: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0) 70%)", // orange-500
      orb2: "radial-gradient(circle, rgba(244,63,94,0.15) 0%, rgba(244,63,94,0) 70%)", // rose-500
      orb3: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0) 70%)" // amber-400
    },
    nature: {
      orb1: "radial-gradient(circle, rgba(5,150,105,0.15) 0%, rgba(5,150,105,0) 70%)", // emerald-600
      orb2: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, rgba(20,184,166,0) 70%)", // teal-500
      orb3: "radial-gradient(circle, rgba(101,163,13,0.15) 0%, rgba(101,163,13,0) 70%)" // lime-600
    }
  };

  const currentGradients = gradients[theme];

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#060B14]">
      {/* Orb 1: Top Left - Floating Slow */}
      <motion.div 
        animate={{ 
          x: [0, 50, -50, 0],
          y: [0, 50, -50, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full mix-blend-screen transition-colors duration-1000"
        style={{ background: currentGradients.orb1 }}
      />
      
      {/* Orb 2: Bottom Right - Floating Slow */}
      <motion.div 
        animate={{ 
          x: [0, -70, 70, 0],
          y: [0, -70, 70, 0],
          scale: [1, 1.2, 0.8, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-[-20%] right-[-10%] w-[90vw] h-[90vw] max-w-[900px] max-h-[900px] rounded-full mix-blend-screen transition-colors duration-1000"
        style={{ background: currentGradients.orb2 }}
      />
      
      {/* Orb 3: Center Ambient - Breathing */}
      <motion.div 
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[20%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full mix-blend-screen transition-colors duration-1000"
        style={{ background: currentGradients.orb3 }}
      />

      {/* Deep Space Grid Overlay for Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83v58.34h-58.34l-.83-.83V0h58.34zM53.797 1.66H1.66v53.797h52.137V1.66z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` 
        }}
      />
    </div>
  );
};
