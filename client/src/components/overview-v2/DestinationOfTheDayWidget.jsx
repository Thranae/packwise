import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { useTripContext } from '@/context/TripContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const DESTINATIONS = [
  {
    name: "Kyoto",
    country: "Japan",
    tagline: "Temples & Timeless Tradition",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    styles: ["Culture", "Relaxed"]
  },
  {
    name: "Amalfi Coast",
    country: "Italy",
    tagline: "Sun-drenched Cliffs & Sea",
    image: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800&auto=format&fit=crop",
    styles: ["Luxury", "Foodie"]
  },
  {
    name: "Swiss Alps",
    country: "Switzerland",
    tagline: "Majestic Peaks & Valleys",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop",
    styles: ["Nature", "Fast-paced"]
  },
  {
    name: "Santorini",
    country: "Greece",
    tagline: "Whitewashed Dreams & Sunsets",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop",
    styles: ["Romantic", "Luxury"]
  },
  {
    name: "Bali",
    country: "Indonesia",
    tagline: "Lush Jungles & Tranquil Beaches",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=800&auto=format&fit=crop",
    styles: ["Relaxed", "Nature"]
  },
  {
    name: "Banff",
    country: "Canada",
    tagline: "Turquoise Lakes & Glaciers",
    image: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2000&auto=format&fit=crop",
    styles: ["Adventure", "Nature"]
  },
  {
    name: "Dubai",
    country: "UAE",
    tagline: "Futuristic Skylines & Desert Oasis",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
    styles: ["Luxury", "Fast-paced"]
  },
  {
    name: "Machu Picchu",
    country: "Peru",
    tagline: "Ancient Ruins & Cloud Forests",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=800&auto=format&fit=crop",
    styles: ["Adventure", "Culture"]
  }
];

export const DestinationOfTheDayWidget = ({ className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { triggerTripGenerationAnimation, generateTrip } = useTripContext();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DESTINATIONS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleGenerate = async (dest) => {
    // Generate trip directly from inspiration
    const prompt = `Destination: ${dest.name}, ${dest.country}. Style: ${dest.styles.join(', ')}. Budget: Moderate. Duration: 7 days.`;
    triggerTripGenerationAnimation(`${dest.name}, ${dest.country}`);
    navigate(ROUTES.TRIPS);
    await generateTrip(prompt, { duration: 7 });
  };

  const currentDest = DESTINATIONS[currentIndex];

  return (
    <div className={`relative rounded-[32px] overflow-hidden ios-glass-card group flex flex-col min-h-[300px] ${className}`}>
      <AnimatePresence>
        <motion.img
          key={currentDest.name}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          src={currentDest.image}
          alt={currentDest.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-110"
        />
      </AnimatePresence>

      <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="text-[11px] font-bold text-white tracking-widest uppercase">Inspiration</span>
      </div>

      <div className="relative z-10 p-6 sm:p-8 mt-auto flex flex-col gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDest.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col gap-1 w-full md:w-3/4">
              <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 tracking-tight leading-none drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] flex items-center gap-2">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-sky-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] shrink-0" />
                <span className="truncate">{currentDest.name}</span>
              </h3>
              <p className="text-[10px] sm:text-[12px] text-white/90 font-black tracking-[0.2em] uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,1)] truncate mb-4">
                {currentDest.country} - {currentDest.tagline}
              </p>
            </div>
            
            <button
              onClick={() => handleGenerate(currentDest)}
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-5 py-3 rounded-full transition-all active:scale-95 group/btn w-max shadow-[0_8px_16px_rgba(0,0,0,0.2)] relative z-20"
            >
              <span className="text-sm font-bold text-white tracking-wide">Plan a Trip Here</span>
              <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </AnimatePresence>
        
        {/* Pagination Dots */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 flex gap-1.5 z-10 hidden sm:flex">
          {DESTINATIONS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
