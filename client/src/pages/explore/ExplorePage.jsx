import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, useTransform } from 'framer-motion';
import { useTripContext } from '@/context/TripContext';
import { MapPin, Star, Navigation, Camera, Palmtree, Utensils, Coffee, Compass, Landmark, Music, ShoppingBag, Loader2 } from 'lucide-react';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import api from '@/services/api';

const getCategoryIcon = (type) => {
  switch(type) {
    case 'Culture': return <Landmark className="w-3.5 h-3.5" />;
    case 'Art': return <Camera className="w-3.5 h-3.5" />;
    case 'Nature': return <Palmtree className="w-3.5 h-3.5" />;
    case 'Food': return <Utensils className="w-3.5 h-3.5" />;
    case 'Coffee': return <Coffee className="w-3.5 h-3.5" />;
    case 'Shopping': return <ShoppingBag className="w-3.5 h-3.5" />;
    case 'Nightlife': return <Music className="w-3.5 h-3.5" />;
    case 'Landmark': return <MapPin className="w-3.5 h-3.5" />;
    default: return <Compass className="w-3.5 h-3.5" />;
  }
};

const ExploreGridCard = ({ place, index, onAddToItinerary }) => {
  const cardRef = useRef(null);
  const [isTapped, setIsTapped] = useState(false);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 12, stiffness: 350, damping: 25 });
  
  // Create opposite rotations for the shadow to enhance 3D depth
  const shadowRotateX = useTransform(rotateX, r => r * -0.5);
  const shadowRotateY = useTransform(rotateY, r => r * -0.5);

  return (
    <motion.div
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => setIsTapped(!isTapped)}
      className="relative w-full aspect-[3/4] rounded-[32px] group cursor-pointer"
    >
      {/* Dynamic Colored Shadow based on image hover */}
      <motion.div 
        style={{ rotateX: shadowRotateX, rotateY: shadowRotateY, z: -30 }}
        className={`absolute inset-0 bg-black/40 blur-[25px] rounded-[32px] group-hover:bg-cyan-500/20 transition-colors duration-[800ms] ${isTapped ? 'bg-cyan-500/20' : ''}`} 
      />

      {/* Main Glass Card container - NO ios-glass-card class here to prevent Chrome 3D backdrop-filter rendering bugs on images */}
      <div className="absolute inset-0 rounded-[32px] overflow-hidden border border-white/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] bg-[#0B1120]">
        
        {/* Background Image that scales on hover */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.15] ${isTapped ? 'scale-[1.15]' : ''}`}
          style={{ backgroundImage: `url(${place.img})` }}
        />
        
        {/* Premium multi-stop gradient for text readability */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#0B1120]/95 via-[#0B1120]/40 to-transparent transition-opacity duration-500 group-hover:opacity-90 pointer-events-none ${isTapped ? 'opacity-90' : ''}`} />
        
        {/* Z-Pop Content Layer */}
        <div 
          className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between"
          style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
        >
          {/* Top Info */}
          <div className={`flex justify-between items-start w-full transition-transform duration-500 group-hover:-translate-y-1 ${isTapped ? '-translate-y-1' : ''}`}>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-lg">
              {getCategoryIcon(place.type)}
              <span className="text-[10px] font-bold uppercase tracking-widest">{place.type}</span>
            </div>
            
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-lg">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-bold">{place.rating}</span>
            </div>
          </div>

          {/* Bottom Info Container */}
          <div className="flex flex-col gap-2">
            <h3 className={`text-2xl font-bold text-white tracking-tight leading-tight drop-shadow-xl group-hover:-translate-y-1 transition-transform duration-[600ms] ${isTapped ? '-translate-y-1' : ''}`}>
              {place.name}
            </h3>
            
            <div className={`flex items-center gap-3 text-white/70 group-hover:-translate-y-1 transition-transform duration-[600ms] delay-75 ${isTapped ? '-translate-y-1' : ''}`}>
              <span className="text-xs font-semibold">{place.reviews} reviews</span>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <div className="flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                <span className="text-xs font-semibold">{(Math.random() * 5 + 0.5).toFixed(1)} km</span>
              </div>
            </div>
            
            {/* Reveal Add Button */}
            <div className={`mt-3 overflow-hidden transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:h-10 group-hover:opacity-100 ${isTapped ? 'h-10 opacity-100' : 'h-0 opacity-0'}`}>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddToItinerary(place); }}
                className="w-full h-10 rounded-[14px] bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/30 backdrop-blur-xl text-cyan-50 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>Add to Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ExplorePage() {
  const { currentTrip } = useTripContext();
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const handleAddToItinerary = (place) => {
    setToast(`${place.name} added to your itinerary!`);
    setTimeout(() => setToast(null), 3000);
    
    if (currentTrip?._id) {
      const storageKey = `packwise_itinerary_additions_${currentTrip._id}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
      if (!existing.find(p => p.id === place.id)) {
        localStorage.setItem(storageKey, JSON.stringify([...existing, place]));
      }
    }
  };

  // Strip generic travel words to get the real place name
  const cleanDestination = (raw = '') => {
    const stripWords = /\b(Explorer|Roadtrip|Road Trip|Retreat|Escape|Getaway|Highlights|Lights|Luxury|Surf|Carnival|Backpacking|Journey|Adventure|Holiday|Vacation|Tour|Coast|Experience|Trip|Visit|City|Lights|Opera|Gateway|Weekend|Delight|&.*)\b/gi;
    return raw.replace(stripWords, '').replace(/\s+/g, ' ').trim();
  };

  const rawDest = currentTrip?.destination || 'Destination';
  
  // 1. Extract just the city (before the comma) so the backend doesn't truncate our suffixes
  const cityOnly = rawDest.split(',')[0].trim();
  // 2. Clean up any weird AI tags like "Explorer"
  const cleanDest = cleanDestination(cityOnly);
  const placeName = cleanDest || cityOnly.split('&')[0].trim();
  
  const baseQuery = placeName;

  // 8 category-specific attraction types mapped to a search suffix
  const CARD_CATEGORIES = [
    { type: 'Landmark',   label: 'Famous Landmark',   suffix: 'landmark architecture' },
    { type: 'Nature',     label: 'Nature & Scenery',  suffix: 'nature scenic landscape' },
    { type: 'Food',       label: 'Local Cuisine',     suffix: 'food street cuisine' },
    { type: 'Culture',    label: 'Culture & Heritage', suffix: 'culture heritage temple' },
    { type: 'Art',        label: 'Art & Museums',     suffix: 'museum art gallery' },
    { type: 'Sightseeing',label: 'City Views',        suffix: 'city skyline view' },
    { type: 'Shopping',   label: 'Markets & Shops',   suffix: 'market bazaar shopping' },
    { type: 'Nightlife',  label: 'Nightlife',         suffix: 'night lights festival' },
  ];

  useEffect(() => {
    let isMounted = true;
    if (!currentTrip?.destination) return;

    const fetchAllImages = async () => {
      setLoading(true);
      try {
        // 1. Get optimized image queries from AI
        let aiQueries = {};
        try {
          const aiRes = await api.post('/ai/inspiration-images', { destination: placeName });
          aiQueries = aiRes.data || {};
        } catch (err) {
          console.warn("Failed to get AI inspiration queries, using fallbacks");
        }

        const fetchCategoryImage = async (category) => {
          const optimalQuery = aiQueries[category.type] || `${placeName} ${category.suffix}`;
          try {
            const res = await api.get(`/images/search?query=${encodeURIComponent(optimalQuery)}`);
            if (res.data?.data?.imageUrl) return res.data.data.imageUrl;
          } catch (_) {}
          // Secondary fallback: try just the place name
          try {
            const res2 = await api.get(`/images/search?query=${encodeURIComponent(baseQuery)}`);
            if (res2.data?.data?.imageUrl) return res2.data.data.imageUrl;
          } catch (_) {}
          return null;
        };

        // Fetch all 8 in parallel, each with its own targeted AI query
        const results = await Promise.all(CARD_CATEGORIES.map(cat => fetchCategoryImage(cat)));

        const cards = CARD_CATEGORIES.map((cat, i) => ({
          id: i,
          name: `${placeName} ${cat.label}`,
          type: cat.type,
          rating: (4.4 + Math.random() * 0.55).toFixed(1),
          reviews: (Math.floor(Math.random() * 40) + 2) + 'k',
          img: results[i] || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800&auto=format&fit=crop',
        }));

        if (isMounted) setAttractions(cards);
      } catch (err) {
        console.error('ExplorePage fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllImages();
    return () => { isMounted = false; };
  }, [currentTrip?._id]);

  return (
    <div className="col-span-12 w-full min-h-screen flex flex-col pt-[calc(32px+env(safe-area-inset-top))] md:pt-8 pb-20 relative">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-cyan-500/90 backdrop-blur-md rounded-full shadow-lg border border-cyan-400">
            <span className="text-white font-bold text-sm tracking-wide">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="flex flex-col gap-2 mb-10 px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-cyan-400"
        >
          <Navigation className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-[0.2em]">Discovery Mode</span>
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl font-semibold tracking-tighter text-white drop-shadow-md"
        >
          Explore {placeName || rawDest}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="text-white/50 text-lg max-w-2xl"
        >
          Dive into a curated selection of stunning experiences, iconic landmarks, and hidden gems tailored specifically for your trip.
        </motion.p>
      </div>

      {/* Responsive 3D Masonry Grid */}
      <div className="w-full px-4 md:px-8 perspective-[2000px] min-h-[400px]">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence mode="wait">
              {attractions.map((place, i) => (
                <ExploreGridCard 
                  key={`${currentTrip?._id}-${place.id}`} 
                  place={place} 
                  index={i} 
                  onAddToItinerary={handleAddToItinerary}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
    </div>
  );
}
