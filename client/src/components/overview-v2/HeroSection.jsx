import React, { useRef, useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, CloudSun, Wallet, ArrowRight, Navigation, Loader2, Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Map, { Source, Marker } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import axios from 'axios';
import { useTripContext } from '@/context/TripContext';
import { useDestinationImage } from '@/hooks/useDestinationImage';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useLiveWeather } from '@/hooks/useLiveApis';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getDuration = (start, end) => {
  if (!start || !end) return 1;
  const diff = new Date(end) - new Date(start);
  return `${Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))} Days`;
};

// Instant local geocoding cache for known destinations to prevent slow API calls and rate limits
const KNOWN_LOCATIONS = {
  'tokyo & kyoto explorer': { lat: 35.6762, lng: 139.6503 },
  'swiss alps retreat': { lat: 46.0207, lng: 7.7491 }, // Zermatt
  'amalfi coast roadtrip': { lat: 40.6333, lng: 14.6029 },
  'paris getaway': { lat: 48.8566, lng: 2.3522 },
  'new york city lights': { lat: 40.7128, lng: -74.0060 },
  'bali surf retreat': { lat: -8.4095, lng: 115.1889 },
  'rio carnival': { lat: -22.9068, lng: -43.1729 },
  'dubai luxury escape': { lat: 25.2048, lng: 55.2708 },
  'london highlights': { lat: 51.5074, lng: -0.1278 },
  'sydney opera & coast': { lat: -33.8688, lng: 151.2093 }
};

const geocodeDestination = async (destination) => {
  if (!destination) return null;
  
  const destLower = destination.toLowerCase().trim();
  
  // 1. Check instant cache first (solves slow load times and wrong fallback locations)
  if (KNOWN_LOCATIONS[destLower]) {
    return KNOWN_LOCATIONS[destLower];
  }
  
  // Clean up destination name for API fallback (e.g., "Tokyo & Kyoto Explorer" -> "Tokyo")
  let cleanDest = destination.split('&')[0].replace('Explorer', '').trim();
  
  try {
    const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanDest)}&format=json&limit=1`, {
      headers: { 'User-Agent': 'PackwiseTravelApp/1.0' }
    });
    if (res.data && res.data.length > 0) {
      return { lat: parseFloat(res.data[0].lat), lng: parseFloat(res.data[0].lon) };
    }
  } catch (err) {
    console.error("Geocoding failed", err);
  }
  
  // Fallback coordinates based on keywords if network fails
  if (destLower.includes('tokyo') || destLower.includes('kyoto') || destLower.includes('japan')) {
    return { lat: 35.6762, lng: 139.6503 }; 
  }
  if (destLower.includes('swiss') || destLower.includes('alps') || destLower.includes('switzerland')) {
    return { lat: 46.0207, lng: 7.7491 };
  }
  
  // Default to the Grand Canyon if all else fails (looks amazing in 3D)
  return { lat: 36.1011, lng: -112.1129 };
};

export const HeroSection = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const globeEl = useRef(null);
  const [showMap, setShowMap] = useState(false);
  const [coords, setCoords] = useState(null);
  const { currentTrip } = useTripContext();
  const { weather } = useLiveWeather(currentTrip?.destination);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 5, stiffness: 200, damping: 20 });
  
  // Geocode destination for the globe
  useEffect(() => {
    if (currentTrip?.destination) {
      setCoords(null);
      geocodeDestination(currentTrip.destination).then(res => setCoords(res));
    }
  }, [currentTrip?.destination]);

  // Center globe to location when map is toggled
  useEffect(() => {
    if (showMap && coords && globeEl.current) {
      setTimeout(() => {
        if (globeEl.current) globeEl.current.pointOfView({ lat: coords.lat, lng: coords.lng, altitude: 1.5 }, 2000);
      }, 500);
    }
  }, [showMap, coords]);

  // We don't need space dust for MapLibre
  const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;

  // Pass raw destination — the server extracts the city name for precision
  const { image: destinationImage, loading: imageLoading } = useDestinationImage(currentTrip?.destination);

  if (!currentTrip) return null;

  const displayImage = currentTrip.heroImage || destinationImage;

  const gData = coords ? [{ lat: coords.lat, lng: coords.lng, size: 20, color: '#60a5fa' }] : [];

  const renderWeatherIcon = (iconCode, className) => {
    if (!iconCode) return <CloudSun className={`${className} text-yellow-400`} />;
    const code = iconCode.substring(0, 2);
    const isNight = iconCode.endsWith('n');
    switch (code) {
      case '01': return isNight ? <Moon className={`${className} text-blue-200`} /> : <Sun className={`${className} text-yellow-400`} />;
      case '02': return <CloudSun className={`${className} text-yellow-400`} />;
      case '03': 
      case '04': return <Cloud className={`${className} text-slate-300`} />;
      case '09':
      case '10': return <CloudRain className={`${className} text-blue-400`} />;
      case '11': return <CloudLightning className={`${className} text-purple-400`} />;
      case '13': return <Snowflake className={`${className} text-blue-200`} />;
      case '50': return <CloudFog className={`${className} text-slate-400`} />;
      default: return <CloudSun className={`${className} text-yellow-400`} />;
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1200, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full h-[460px] sm:h-auto sm:min-h-[380px] md:h-[416px] rounded-[24px] md:rounded-[32px] p-5 md:p-8 flex flex-col justify-end group shadow-[0_20px_48px_rgba(0,0,0,0.2)] hover:shadow-[0_40px_80px_rgba(59,130,246,0.25)] hover:-translate-y-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer overflow-hidden"
    >
      {/* Background Container */}
      <div className="absolute inset-0 rounded-[32px] overflow-hidden -z-10">
        <AnimatePresence mode="wait">
          {!showMap ? (
            <motion.div 
              key="image"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              {imageLoading ? (
                <div className="absolute inset-0 bg-white/5 animate-pulse" />
              ) : (
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:scale-105"
                  style={{ backgroundImage: `url(${displayImage})` }}
                />
              )}
              {/* Soft Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
            </motion.div>
          ) : (
            <motion.div 
              key="map"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-[#030712] flex flex-col justify-center items-center overflow-hidden"
            >
              {!coords ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin opacity-50" />
                </div>
              ) : !MAPTILER_KEY ? (
                <div className="absolute inset-0 bg-[#030712] flex flex-col justify-center items-center p-8 text-center z-20">
                  <MapPin className="w-10 h-10 text-white/20 mb-3" />
                  <h3 className="text-white font-medium mb-1">MapTiler API Key Required</h3>
                  <div className="text-white/50 text-xs max-w-xs">Please add your VITE_MAPTILER_API_KEY to the client/.env file to view the 3D Satellite Map.</div>
                </div>
              ) : (
                <div className="absolute inset-0 pointer-events-auto">
                  <Map
                    key={currentTrip._id}
                    initialViewState={{
                      longitude: coords.lng,
                      latitude: coords.lat,
                      zoom: 12.5,
                      pitch: 65,
                      bearing: -20
                    }}
                    mapStyle={`https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${MAPTILER_KEY}`}
                    terrain={{ source: 'maptiler-terrain', exaggeration: 1.5 }}
                    attributionControl={false}
                  >
                    <Source
                      id="maptiler-terrain"
                      type="raster-dem"
                      url={`https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${MAPTILER_KEY}`}
                      tileSize={256}
                    />
                    <Marker longitude={coords.lng} latitude={coords.lat} anchor="bottom">
                      <div className="relative group cursor-pointer flex flex-col items-center justify-end h-16 w-16">
                        {/* Animated Ground Glow/Shadow */}
                        <div className="absolute bottom-1 w-6 h-2 bg-red-500/40 blur-[4px] rounded-[100%] animate-pulse" />
                        
                        {/* The Pin with glow and gentle bobbing animation */}
                        <div className="text-4xl drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[bounce_2s_infinite] relative z-10 hover:-translate-y-2 transition-transform duration-300">
                          📍
                        </div>
                        
                        {/* Tooltip on hover */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#0F172A]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-white/20 shadow-2xl whitespace-nowrap pointer-events-none z-20">
                          {currentTrip.destination.split('&')[0].replace('Explorer', '').trim()}
                        </div>
                      </div>
                    </Marker>
                  </Map>
                </div>
              )}
              {/* Overlay for map readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-transparent to-transparent pointer-events-none z-[400]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Liquid Glass Border Stroke Overlay */}
      <div className="absolute inset-0 rounded-[32px] pointer-events-none border-[2px] border-white/30 border-t-white/70 border-l-white/50 shadow-[inset_0_2px_16px_rgba(255,255,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.5)] z-20 transition-all duration-700 group-hover:border-t-white/90 group-hover:border-l-white/70 group-hover:shadow-[inset_0_2px_24px_rgba(255,255,255,0.4),inset_0_1px_4px_rgba(255,255,255,0.8)]" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full p-8 flex flex-col justify-end h-full">
        {/* Removed absolute positioning for button */}

        <div className="flex flex-col md:flex-row md:items-end justify-between w-full gap-6 md:gap-0">
          {/* Left: Destination & Dates */}
          <div className="flex flex-col gap-1 md:gap-2 ios-3d-element">
            <div className="flex items-center gap-2 text-white/80">
              <MapPin className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <span className="text-xs md:text-lg font-medium tracking-wide">{currentTrip.country}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white drop-shadow-md leading-tight">
              {currentTrip.destination}
            </h1>
            <div className="flex flex-row flex-wrap sm:items-center gap-2 sm:gap-6 mt-2">
              <div className="flex items-center gap-1.5 text-white/90">
                <Calendar className="w-3.5 h-3.5 md:w-5 md:h-5 text-white/70" />
                <span className="text-[11px] md:text-base font-medium whitespace-nowrap">{formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
                <span className="text-sm md:text-base font-medium">{getDuration(currentTrip.startDate, currentTrip.endDate)}</span>
              </div>
            </div>
            
            {/* View Map Button (Moved from top-left) */}
            <div className="mt-4 md:mt-5 z-50 flex pointer-events-auto">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMap(!showMap); }}
                className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-[14px] md:rounded-[18px] bg-white/30 backdrop-blur-3xl saturate-200 border border-white/40 border-t-white/80 border-l-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:-translate-y-1 hover:bg-sky-400 hover:border-sky-300 hover:shadow-[0_16px_48px_rgba(56,189,248,0.5),inset_0_2px_4px_rgba(255,255,255,0.6)] active:translate-y-0 active:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_4px_8px_rgba(0,0,0,0.3)] transition-all duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]"
              >
                {/* Liquid Glare Sweep */}
                <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 group-hover:translate-x-[150%] transition-transform duration-[1200ms] ease-in-out pointer-events-none" />
                
                <Navigation className="w-3.5 h-3.5 md:w-4 md:h-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10" />
                <span className="text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10">
                  {showMap ? 'Hide Map' : 'View Map'}
                </span>
              </button>
            </div>
          </div>

          {/* Right: Metrics & CTA */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-between w-full md:w-auto mt-4 md:mt-0 gap-4 md:gap-6 ios-3d-element">
            <div className="flex gap-2 sm:gap-3 md:gap-4 justify-between sm:justify-start">
              {/* Weather Glass Pill */}
              <div className="flex-1 sm:flex-none flex flex-col items-center justify-center px-3 py-2 md:px-5 md:py-3 rounded-[12px] md:rounded-[16px] bg-white/30 backdrop-blur-3xl saturate-200 border border-white/40 border-t-white/80 border-l-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)] min-w-[70px]">
                {renderWeatherIcon(weather?.current?.icon, "w-4 h-4 md:w-6 md:h-6 mb-1 drop-shadow-md")}
                <span className="text-[11px] md:text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">{weather?.current?.temp ?? '--'}°C</span>
              </div>
              
              {/* Budget Glass Pill */}
              <div className="flex-1 sm:flex-none flex flex-col items-center justify-center px-3 py-2 md:px-5 md:py-3 rounded-[12px] md:rounded-[16px] bg-white/30 backdrop-blur-3xl saturate-200 border border-white/40 border-t-white/80 border-l-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)] min-w-[80px]">
                <Wallet className="w-4 h-4 md:w-6 md:h-6 text-emerald-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-1" />
                <span className="text-[11px] md:text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap">{currentTrip.budget} {currentTrip.currency}</span>
              </div>
            </div>

            <button onClick={(e) => { e.stopPropagation(); navigate(ROUTES.CALENDAR); }} className="group/btn flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-3.5 rounded-[12px] md:rounded-[16px] ios-liquid-button w-full sm:w-auto justify-center z-10 relative">
              <span className="text-sm font-bold text-white">Continue</span>
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-700 group-hover/btn:translate-x-1 shrink-0">
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </div>
            </button>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
};
