import React, { useRef } from 'react';
import { CloudSun, Wind, Droplets, Loader2, CloudRain, CloudLightning, Sun, CloudFog } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useTripContext } from '@/context/TripContext';
import { useLiveWeather } from '@/hooks/useLiveApis';

export const WeatherWidget = ({ className = "" }) => {
  const cardRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(cardRef, { maxTilt: 5, stiffness: 250, damping: 25 });

  const { currentTrip } = useTripContext();
  const { weather, loading, error } = useLiveWeather(currentTrip?.destination);

  const getIconUrl = (iconCode) => {
    if (!iconCode) return null;
    return `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <motion.div 
      ref={cardRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={`relative p-6 flex flex-col justify-between h-[200px] rounded-[32px] cursor-pointer ios-glass-card group ${className}`}
    >
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-white/50 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin mb-2" />
          <span className="text-[11px] font-semibold uppercase tracking-widest">Loading Live Weather</span>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-400 text-sm font-semibold tracking-wide">
          Weather unavailable
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex flex-col ios-3d-element">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-1">Live Weather</span>
              <span className="text-3xl font-semibold tracking-tighter text-white drop-shadow-sm">
                {weather?.current?.temp ?? '--'}°
              </span>
              <span className="text-white/70 font-medium text-sm mt-0.5 truncate max-w-[140px]">
                {currentTrip?.destination}
              </span>
            </div>
            <div className="w-12 h-12 rounded-[16px] bg-white/5 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ios-3d-icon shrink-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-translate-y-1 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_8px_16px_rgba(0,0,0,0.3)]">
              {weather?.current?.icon ? (
                <img src={getIconUrl(weather.current.icon)} alt={weather.current.condition} className="w-10 h-10 object-contain drop-shadow-lg transition-transform duration-700 group-hover:scale-110" />
              ) : (
                <CloudSun className="w-6 h-6 text-yellow-400 drop-shadow-md transition-transform duration-700 group-hover:scale-110" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 ios-3d-element mt-4">
            <div className="flex items-center justify-between text-white/90">
              <span className="text-sm font-semibold text-white capitalize">{weather?.current?.description || 'Unknown'}</span>
              {weather?.forecast && weather.forecast.length > 0 && (
                <span className="text-sm font-medium text-white/60">
                  H:{weather.forecast[0].temp}° L:{weather.forecast[0].min}°
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-white/60">
                <Wind className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{weather?.current?.wind_speed ?? 0} m/s</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60">
                <Droplets className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{weather?.current?.humidity ?? 0}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/60">
                <span className="text-xs font-semibold">Feels like {weather?.current?.feels_like ?? '--'}°</span>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
