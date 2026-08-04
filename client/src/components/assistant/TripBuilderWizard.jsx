import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bot, MapPin, Wallet, Compass, ArrowRight, Loader2, Sparkles, Plus, Minus, ChevronRight, Calendar, Building2, Globe2, Plane, TreePine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { ROUTES } from '@/constants/routes';
import { useTripContext } from '@/context/TripContext';
import { useTransitionNavigate } from '@/contexts/TransitionContext';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { useHaptics } from '@/hooks/useHaptics';
import { LogoIcon } from '@/components/ui/Logo';

// Premium Custom Date Picker
const PremiumDatePicker = ({ value, onChange, minDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(value || Date.now()));
  
  const today = new Date();
  today.setHours(0,0,0,0);
  
  const selectedDate = new Date(value);
  selectedDate.setHours(0,0,0,0);
  
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const handlePrevMonth = (e) => { e.stopPropagation(); setCurrentMonth(new Date(year, month - 1, 1)); };
  const handleNextMonth = (e) => { e.stopPropagation(); setCurrentMonth(new Date(year, month + 1, 1)); };

  const handleSelectDate = (e, d) => {
    e.preventDefault();
    e.stopPropagation();
    const selected = new Date(year, month, d);
    selected.setMinutes(selected.getMinutes() - selected.getTimezoneOffset());
    onChange(selected.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const formattedValue = new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }}
        className="w-full h-[42px] px-3 bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 rounded-2xl shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)] flex items-center justify-between text-white font-semibold text-xs sm:text-sm transition-all duration-300 cursor-pointer group hover:bg-[#0f172a]/60 hover:border-white/20"
      >
        <span className="pointer-events-none truncate text-left">{formattedValue}</span>
        
        {/* 3D Liquid Glass Calendar Icon */}
        <div className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-300 pointer-events-none shrink-0 relative overflow-visible">
          <div className="absolute inset-[-10px] pointer-events-none mix-blend-screen">
            <Spline scene="https://prod.spline.design/rEv6bOK8rTeuiYSu/scene.splinecode" />
          </div>
        </div>
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="relative z-[101] w-[90vw] max-w-[340px] p-5 sm:p-6 rounded-[32px] bg-[#050b14]/90 backdrop-blur-3xl border-[1.5px] border-white/20 border-t-white/40 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_4px_16px_rgba(255,255,255,0.1),inset_0_-2px_6px_rgba(0,0,0,0.8)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors"><ChevronRight className="w-4 h-4 rotate-180 text-white" /></button>
                  <span className="text-white font-bold text-lg tracking-wide">{monthName}</span>
                  <button onClick={handleNextMonth} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors"><ChevronRight className="w-4 h-4 text-white" /></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1.5 mb-2">
                  {weekdays.map(w => <div key={w} className="text-center text-xs font-bold text-white/40 pb-2">{w}</div>)}
                </div>
                
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                    const thisDate = new Date(year, month, d);
                    thisDate.setHours(0,0,0,0);
                    const isPast = thisDate < today;
                    const isSelected = thisDate.getTime() === selectedDate.getTime();
                    const isToday = thisDate.getTime() === today.getTime();
                    
                    return (
                      <button
                        key={`${year}-${month}-${d}`}
                        disabled={isPast}
                        onClick={(e) => handleSelectDate(e, d)}
                        className={`
                          relative aspect-square flex items-center justify-center rounded-2xl text-[14px] font-bold transition-colors duration-150
                          ${isPast ? 'text-white/20 cursor-not-allowed' : 'text-white/70 hover:text-white cursor-pointer'}
                          ${isSelected ? '!text-white shadow-[0_4px_16px_rgba(99,102,241,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] bg-gradient-to-br from-indigo-400 to-purple-600 z-10 border border-white/30' : ''}
                          ${!isSelected && !isPast ? 'hover:bg-white/10' : ''}
                          ${isToday && !isSelected ? 'ring-2 ring-indigo-500/50 text-white' : ''}
                        `}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

const LocationInput = ({ label, value, onChange, placeholder, disabled, autoFocus, onFocus, onSearching }) => {
  const [isLocalSearching, setIsLocalSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const userTypedValue = useRef(value);

  useEffect(() => {
    // If the value changed programmatically (e.g. user clicked a suggestion), do not search
    if (value !== userTypedValue.current) {
      setSuggestions([]);
      setShowDropdown(false);
      onSearching?.(false);
      setIsLocalSearching(false);
      return;
    }

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      onSearching?.(false);
      setIsLocalSearching(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      onSearching?.(true);
      setIsLocalSearching(true);
      try {
        const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
        let results = [];

        if (MAPTILER_KEY) {
          const res = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(value)}.json?key=${MAPTILER_KEY}&limit=6&types=country,region,municipality,locality,place`);
          if (!res.ok) throw new Error('MapTiler API Error');
          const json = await res.json();
          
          results = (json.features || []).map(f => {
            const mainName = f.text || f.place_name?.split(',')[0] || "Unknown Place";
            const context = f.context || [];
            
            // Extract region/state and country from context properly
            const regionObj = context.find(c => c.id?.startsWith('region'));
            const countryObj = context.find(c => c.id?.startsWith('country'));
            const region = regionObj?.text || '';
            const country = countryObj?.text || '';
            
            // Build a clean subtitle: "Region, Country" or just "Country"
            const subtitle = [region, country].filter(Boolean).join(', ');
            
            // Determine icon based on place_type
            let Icon = MapPin;
            let iconBg = "bg-blue-500/10";
            let iconColor = "text-blue-400";
            
            const type = f.place_type ? f.place_type[0] : '';
            
            if (type === 'country') {
              Icon = Globe2;
              iconBg = "bg-indigo-500/10";
              iconColor = "text-indigo-400";
            } else if (type === 'region') {
              Icon = Globe2;
              iconBg = "bg-purple-500/10";
              iconColor = "text-purple-400";
            } else if (type === 'municipality' || type === 'locality' || type === 'place') {
              Icon = Building2;
              iconBg = "bg-emerald-500/10";
              iconColor = "text-emerald-400";
            }

            return { 
              city: mainName, 
              country: subtitle || (f.place_name !== mainName ? f.place_name?.split(',').slice(1).join(',').trim() : ''),
              Icon, iconBg, iconColor 
            };
          });
        } else {
          // Fallback to nominatim
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=6&addressdetails=1`);
          if (!res.ok) throw new Error('API Error');
          const data = await res.json();
          
          const parsed = data.map(item => {
            const addr = item.address || {};
            const mainName = addr.city || addr.town || addr.village || addr.state || item.name;
            const region = addr.state || '';
            const country = addr.country || '';
            const subtitle = [region, country].filter(Boolean).join(', ');
            return { city: mainName, country: subtitle, Icon: MapPin, iconBg: "bg-blue-500/10", iconColor: "text-blue-400" };
          });
          results = parsed.filter((v, i, a) => a.findIndex(t => (t.city === v.city && t.country === v.country)) === i);
        }

        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.error("Location search failed", err);
      } finally {
        onSearching?.(false);
        setIsLocalSearching(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleSelect = (loc) => {
    const locString = loc.country ? `${loc.city}, ${loc.country.split(',').pop().trim()}` : loc.city;
    setSuggestions([]);
    setShowDropdown(false);
    onChange(locString);
  };

  return (
    <div className={`group relative ${disabled ? 'opacity-50 pointer-events-none' : ''} ${showDropdown ? 'z-[100]' : 'z-10'}`}>
      <label className="block text-[12px] font-bold text-white/70 mb-1.5 tracking-wider uppercase">{label}</label>
      <div className="relative z-20">
        <input 
          type="text" 
          value={value}
          onChange={(e) => {
            userTypedValue.current = e.target.value;
            onChange(e.target.value);
          }}
          onFocus={() => {
            onFocus?.();
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          onBlur={() => {
            // Delay to allow clicks on dropdown to register
            setTimeout(() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 200);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          className="w-full h-12 pl-5 pr-12 text-sm rounded-2xl bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/25 text-white placeholder-white/35 focus:bg-white/[0.1] focus:border-white/30 focus:ring-2 focus:ring-indigo-400/20 transition-all duration-300 shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)] outline-none relative z-20" 
        />
        {isLocalSearching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <Loader2 className="w-4 h-4 text-white/70 animate-spin" />
          </div>
        )}
        <AnimatePresence>
          {showDropdown && suggestions.length > 0 && (
            <>
              {/* Invisible overlay to catch outside clicks */}
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40" 
                onClick={(e) => { e.stopPropagation(); setShowDropdown(false); }} 
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 top-full mt-2 bg-[#0c1425]/98 border border-white/10 rounded-2xl z-[100] shadow-[0_24px_48px_rgba(0,0,0,0.6)] overflow-hidden"
              >
                <div className="px-3 pt-2.5 pb-1.5 border-b border-white/5">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">Suggestions</span>
                </div>
                <div className="p-1 max-h-[220px] overflow-y-auto">
                  {suggestions.map((loc, idx) => (
                    <motion.button
                      key={`${loc.city}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.04 }}
                      onClick={() => handleSelect(loc)}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/[0.06] active:bg-white/[0.1] transition-colors flex items-center gap-2.5 group/item"
                    >
                      <div className={`w-8 h-8 rounded-lg ${loc.iconBg} border border-white/5 flex items-center justify-center shrink-0`}>
                        <loc.Icon className={`w-3.5 h-3.5 ${loc.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-[13px] truncate leading-tight">{loc.city}</div>
                        {loc.country && <div className="text-white/40 text-[11px] font-medium truncate leading-tight">{loc.country}</div>}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const InspirationCarousel = ({ step, onSelectDestination, onSelectSeason, onSelectStyle }) => {
  // Data for Step 1
  const destinations = [
    { id: 1, title: 'Tokyo, Japan', subtitle: 'Neon & Sushi', image: `https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80` },
    { id: 2, title: 'Paris, France', subtitle: 'Romance', image: `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80` },
    { id: 3, title: 'Bali, Indonesia', subtitle: 'Tropical Escape', image: `https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80` },
    { id: 4, title: 'Rome, Italy', subtitle: 'Ancient History', image: `https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=400&q=80` },
    { id: 5, title: 'New York City', subtitle: 'Concrete Jungle', image: `https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80` },
    { id: 6, title: 'Santorini, Greece', subtitle: 'Mediterranean', image: `https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=400&q=80` },
    { id: 7, title: 'Kyoto, Japan', subtitle: 'Zen & Temples', image: `https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=80` },
    { id: 8, title: 'Maldives', subtitle: 'Ocean Villas', image: `https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=400&q=80` },
    { id: 9, title: 'Cape Town, SA', subtitle: 'Mountain Meets Sea', image: `https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=400&q=80` },
    { id: 10, title: 'Swiss Alps', subtitle: 'Alpine Wonder', image: `https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80` },
    { id: 11, title: 'Dubai, UAE', subtitle: 'Desert Luxury', image: `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80` },
    { id: 12, title: 'Machu Picchu', subtitle: 'Inca Trail', image: `https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=400&q=80` },
    { id: 13, title: 'Amalfi Coast', subtitle: 'Italian Charm', image: `https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=400&q=80` },
    { id: 14, title: 'Banff, Canada', subtitle: 'Glacial Lakes', image: `https://images.unsplash.com/photo-1513519107127-1bed33748e4c?auto=format&fit=crop&w=400&q=80` },
    { id: 15, title: 'Sydney, Australia', subtitle: 'Harbour Views', image: `https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80` }
  ];

  // Data for Step 2
  const seasons = [
    { id: 1, title: 'Summer Europe', subtitle: 'Jul - Aug', image: `https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=400&q=80`, date: '2027-07-15', duration: 14 },
    { id: 2, title: 'Cherry Blossoms', subtitle: 'Mar - Apr', image: `https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=400&q=80`, date: '2027-03-25', duration: 10 },
    { id: 3, title: 'Ski Season', subtitle: 'Dec - Feb', image: `https://images.unsplash.com/photo-1605540436563-5bca919ae766?auto=format&fit=crop&w=400&q=80`, date: '2026-12-20', duration: 7 },
    { id: 4, title: 'Autumn Colors', subtitle: 'Oct - Nov', image: `https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&w=400&q=80`, date: '2026-10-15', duration: 8 },
    { id: 5, title: 'Tropical Winter', subtitle: 'Dec - Feb', image: `https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=400&q=80`, date: '2026-12-25', duration: 10 },
    { id: 6, title: 'Spring in Japan', subtitle: 'Mar - May', image: `https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=400&q=80`, date: '2027-04-10', duration: 12 },
    { id: 7, title: 'Mediterranean', subtitle: 'Jun - Sep', image: `https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=400&q=80`, date: '2027-06-20', duration: 14 },
    { id: 8, title: 'Fall Foliage', subtitle: 'Oct', image: `https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=400&q=80`, date: '2026-10-10', duration: 7 },
    { id: 9, title: 'Northern Lights', subtitle: 'Nov - Feb', image: `https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=400&q=80`, date: '2026-11-20', duration: 7 },
    { id: 10, title: 'Caribbean Dry', subtitle: 'Dec - Apr', image: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80`, date: '2027-01-15', duration: 7 },
    { id: 11, title: 'Oktoberfest', subtitle: 'Sep - Oct', image: `https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80`, date: '2026-09-20', duration: 10 },
    { id: 12, title: 'Patagonia', subtitle: 'Dec - Feb', image: `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80`, date: '2026-12-10', duration: 14 },
    { id: 13, title: 'Safari Dry', subtitle: 'Jun - Oct', image: `https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80`, date: '2027-08-10', duration: 10 },
    { id: 14, title: 'Spring Break', subtitle: 'Mar - Apr', image: `https://images.unsplash.com/photo-1538964173425-93884d739596?auto=format&fit=crop&w=400&q=80`, date: '2027-03-15', duration: 7 },
    { id: 15, title: 'Festive Markets', subtitle: 'Dec', image: `https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80`, date: '2026-12-05', duration: 10 }
  ];

  // Data for Step 3
  const curatedStyles = [
    { id: 1, title: 'Luxury Escape', subtitle: '5-Star Comfort', image: `https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=400&q=80`, styles: ["Luxury","Relaxed"] },
    { id: 2, title: 'Backpacker', subtitle: 'Budget & Culture', image: `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80`, styles: ["Culture","Fast-paced","Budget"] },
    { id: 3, title: 'Foodie Heaven', subtitle: 'Culinary Tour', image: `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80`, styles: ["Foodie","Relaxed"] },
    { id: 4, title: 'Wilderness', subtitle: 'Nature Adventure', image: `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80`, styles: ["Nature","Fast-paced"] },
    { id: 5, title: 'Cultural Immersion', subtitle: 'Local Life', image: `https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=400&q=80`, styles: ["Culture","Relaxed"] },
    { id: 6, title: 'Romantic Getaway', subtitle: 'Couples Retreat', image: `https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80`, styles: ["Luxury","Relaxed"] },
    { id: 7, title: 'Family Friendly', subtitle: 'Kids & Fun', image: `https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80`, styles: ["Relaxed"] },
    { id: 8, title: 'Wellness & Spa', subtitle: 'Rejuvenate', image: `https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80`, styles: ["Relaxed","Luxury"] },
    { id: 9, title: 'Adrenaline Junkie', subtitle: 'Extreme Sports', image: `https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=400&q=80`, styles: ["Fast-paced","Nature"] },
    { id: 10, title: 'Historic Sites', subtitle: 'Step Back in Time', image: `https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=400&q=80`, styles: ["Culture"] },
    { id: 11, title: 'Beach Bum', subtitle: 'Sun & Sand', image: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80`, styles: ["Relaxed","Nature"] },
    { id: 12, title: 'Photography', subtitle: 'Scenic Views', image: `https://images.unsplash.com/photo-1513519107127-1bed33748e4c?auto=format&fit=crop&w=400&q=80`, styles: ["Nature","Culture"] },
    { id: 13, title: 'Off the Beaten Path', subtitle: 'Hidden Gems', image: `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=400&q=80`, styles: ["Fast-paced","Culture"] },
    { id: 14, title: 'City Explorer', subtitle: 'Urban Jungle', image: `https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=400&q=80`, styles: ["Fast-paced","Culture"] },
    { id: 15, title: 'Road Trip', subtitle: 'Scenic Drives', image: `https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=400&q=80`, styles: ["Fast-paced","Nature"] }
  ];

  let items = [];
  let onCardClick = () => {};
  let headerTitle = "";
  let headerSubtitle = "";

  if (step === 1) {
    items = destinations;
    headerTitle = "Trending Destinations";
    headerSubtitle = "Tap to auto-fill your next adventure";
    onCardClick = (item) => onSelectDestination(item.query);
  } else if (step === 2) {
    items = seasons;
    headerTitle = "Smart Season Insights";
    headerSubtitle = "Pick a perfect travel window";
    onCardClick = (item) => onSelectSeason(item.date, item.duration);
  } else if (step === 3) {
    items = curatedStyles;
    headerTitle = "Curated Vibes";
    headerSubtitle = "Select a pre-built travel style";
    onCardClick = (item) => onSelectStyle(item.styles);
  }

  if (items.length === 0) return null;

  return (
    <motion.div
      key={`carousel-${step}`}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mt-6 w-full"
    >
      <div className="flex items-end justify-between px-2 mb-3">
        <div>
          <h4 className="text-[15px] font-bold text-white tracking-wide drop-shadow-md">{headerTitle}</h4>
          <p className="text-[12px] font-medium text-white/50">{headerSubtitle}</p>
        </div>
      </div>
      
      {/* Scrollable Container */}
      <div className="w-full overflow-x-auto custom-scrollbar pb-4 -mx-2 px-2 snap-x snap-mandatory flex gap-3 sm:gap-4">
        {items.map((item, idx) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            onClick={() => onCardClick(item)}
            className="relative shrink-0 w-[140px] sm:w-[160px] aspect-[3/4] rounded-[24px] ios-glass-card p-2 group snap-center shadow-[0_12px_24px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] active:scale-[0.96] transition-all duration-300 border border-white/5 hover:border-white/20 flex flex-col"
          >
            <div className="relative w-full h-full rounded-[16px] overflow-hidden">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050b14]/90 via-[#050b14]/20 to-transparent z-10" />
              <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              
              <div className="absolute bottom-3.5 left-3 right-3 z-20 text-left">
                <h5 className="text-[13px] sm:text-[14px] font-bold text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{item.title}</h5>
                <p className="text-[10px] sm:text-[11px] font-semibold text-white/60 mt-0.5">{item.subtitle}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export const TripBuilderWizard = () => {
  const navigate = useNavigate();
  const triggerTransition = useTransitionNavigate();
  const [step, setStep] = useState(1);
  const { generateTrip, isGenerating, loadingStep, currentTrip, triggerTripGenerationAnimation } = useTripContext();
  const { playSound } = useSoundEffect();
  const { lightTap, successTap } = useHaptics();
  const [prompt, setPrompt] = useState("");
  const [startCity, setStartCity] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [budget, setBudget] = useState("Moderate");
  const [styles, setStyles] = useState([]);
  const [males, setMales] = useState(1);
  const [females, setFemales] = useState(0);
  
  // Side Panel State
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeField, setActiveField] = useState(null); // 'destination' or 'startCity'

  const toggleStyle = (style) => {
    setStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
  };

  const handleSelectDestination = (locString) => {
    lightTap();
    playSound('tap');
    setPrompt(locString);
    setStep(2);
  };

  const handleSelectSeason = (date, dur) => {
    lightTap();
    playSound('tap');
    setStartDate(date);
    setDuration(dur);
    setStep(3);
  };

  const handleSelectStyle = (newStyles) => {
    lightTap();
    playSound('tap');
    setStyles(newStyles);
  };

  const handleGenerate = async () => {
    lightTap();
    playSound('tap');
    const flightContext = startCity ? ` Flying from ${startCity}.` : "";
    const genderContext = (males > 0 || females > 0) ? ` Travelers: ${males + females} total (${males} male, ${females} female).` : "";
    const fullPrompt = `Destination: ${prompt}.${flightContext} Start Date: ${startDate}. Duration: ${duration} days. Budget: ${budget}. Style: ${styles.join(', ')}.${genderContext}`;
    
    // Trigger animation and redirect FIRST so the user sees the 3D scanning card
    triggerTripGenerationAnimation(prompt);
    navigate(ROUTES.TRIPS);
    
    // Generate trip in the background
    generateTrip(fullPrompt, { startDate, duration }); 
  };

  const handleSelectLocation = (loc) => {
    lightTap();
    playSound('tap');
    const locString = `${loc.city}, ${loc.country}`;
    if (activeField === 'destination') setPrompt(locString);
    else if (activeField === 'startCity') setStartCity(locString);
    setSuggestions([]);
  };

  const steps = [
    { id: 1, title: 'Where', icon: MapPin, color: 'from-emerald-400 to-teal-500', shadow: 'rgba(52,211,153,0.5)' },
    { id: 2, title: 'When', icon: Wallet, color: 'from-blue-400 to-indigo-500', shadow: 'rgba(59,130,246,0.5)' },
    { id: 3, title: 'Style', icon: Compass, color: 'from-purple-400 to-pink-500', shadow: 'rgba(192,132,252,0.5)' },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-start gap-4 max-w-[700px] mx-auto">
      
      {/* Compact Step Progress */}
      <div className="w-full flex items-center gap-2 px-2 shrink-0">
        {steps.map((s, idx) => {
          const isActive = step === s.id;
          const isPast = step > s.id;
          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => { if (isPast) { lightTap(); setStep(s.id); } }}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition-all duration-400 ${
                  isActive 
                    ? `bg-gradient-to-r ${s.color} text-white shadow-[0_6px_16px_${s.shadow}] scale-105` 
                    : isPast
                      ? 'bg-white/10 text-white/80 cursor-pointer hover:bg-white/15'
                      : 'bg-white/[0.03] text-white/30 border border-white/5'
                }`}
              >
                <s.icon className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-bold tracking-wider uppercase whitespace-nowrap">{s.title}</span>
              </button>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-[2px] rounded-full transition-colors duration-500 ${isPast ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Card */}
      <div className="w-full ios-glass-card rounded-[24px] p-4 sm:p-5 shadow-[0_16px_32px_rgba(0,0,0,0.35)] relative overflow-visible">
        
        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* ─── Step 1: Destination ─── */}
              {step === 1 && (
                <div className="flex flex-col gap-3 min-h-[170px]">
                  <LocationInput 
                    label="Where do you want to go?"
                    value={prompt}
                    onChange={setPrompt}
                    onSearching={setIsSearching}
                    onFocus={() => setActiveField('destination')}
                    placeholder="e.g. Tokyo, Japan or 'Somewhere tropical'"
                    autoFocus={true}
                  />
                  <LocationInput 
                    label={<span>Starting City <span className="text-white/40 font-medium normal-case">(Optional)</span></span>}
                    value={startCity}
                    onChange={setStartCity}
                    onSearching={setIsSearching}
                    onFocus={() => setActiveField('startCity')}
                    placeholder="Where are you flying from?"
                  />
                </div>
              )}

              {/* ─── Step 2: Duration, Date & Budget ─── */}
              {step === 2 && (
                <div className="flex flex-col gap-4 min-h-[170px]">
                  {/* Duration + Date in a row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] sm:text-[12px] font-bold text-white/70 mb-1.5 tracking-wider uppercase">Duration</label>
                      <div className="flex items-center justify-between bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 p-1 rounded-2xl shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)] h-[42px]">
                        <button 
                          onClick={() => setDuration(Math.max(1, (parseInt(duration) || 7) - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-90 transition-all duration-200 text-white/60 hover:text-white shrink-0"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-baseline gap-0.5 justify-center">
                          <input 
                            type="number" 
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="7" 
                            className="w-6 sm:w-8 h-8 text-center text-lg font-black bg-transparent text-white placeholder-white/20 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" 
                          />
                          <span className="text-[10px] font-bold text-white/40 shrink-0">days</span>
                        </div>
                        <button 
                          onClick={() => setDuration((parseInt(duration) || 7) + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-90 transition-all duration-200 text-white/60 hover:text-white shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] sm:text-[12px] font-bold text-white/70 mb-1.5 tracking-wider uppercase">Start Date</label>
                      <PremiumDatePicker 
                        value={startDate}
                        onChange={setStartDate}
                        minDate={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  {/* Budget */}
                  <div>
                    <label className="block text-[11px] sm:text-[12px] font-bold text-white/70 mb-1.5 tracking-wider uppercase">Budget Level</label>
                    <div className="flex items-center gap-1.5 p-1 bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 rounded-2xl shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)] overflow-visible">
                      {['Budget', 'Moderate', 'Luxury'].map((b) => {
                        const isActive = budget === b;
                        
                        let activeBg = 'from-indigo-500 to-purple-600 shadow-[0_4px_12px_rgba(99,102,241,0.4)]';
                        if (b === 'Budget') activeBg = 'from-emerald-400 to-teal-500 shadow-[0_4px_12px_rgba(52,211,153,0.4)]';
                        if (b === 'Moderate') activeBg = 'from-blue-400 to-indigo-500 shadow-[0_4px_12px_rgba(96,165,250,0.4)]';
                        if (b === 'Luxury') activeBg = 'from-purple-400 to-pink-500 shadow-[0_4px_12px_rgba(192,132,252,0.4)]';

                        return (
                          <button 
                            key={b} 
                            onClick={() => setBudget(b)}
                            className={`flex-1 py-1.5 sm:py-2 px-1 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 transition-all duration-300 relative overflow-hidden ${
                              isActive 
                                ? `bg-gradient-to-br ${activeBg} text-white scale-[1.02] border-[1.5px] border-white/40 z-10` 
                                : 'text-white/50 hover:text-white/80 hover:bg-white/5 border-[1.5px] border-transparent'
                            }`}
                          >
                            <DollarSignIcon count={b === 'Budget' ? 1 : b === 'Moderate' ? 2 : 3} isActive={isActive} level={b} />
                            <span className={`text-[10px] sm:text-[11px] font-bold tracking-wide ${isActive ? 'drop-shadow-md' : ''}`}>{b}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Step 3: Style & Travelers (compact) ─── */}
              {step === 3 && (
                <div className="flex flex-col gap-4 min-h-[170px]">
                  {/* Travel Style */}
                  <div>
                    <label className="block text-[12px] font-bold text-white/70 mb-1.5 tracking-wider uppercase">Travel Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Fast-paced', 'Relaxed', 'Culture', 'Nature', 'Foodie', 'Luxury'].map((style) => {
                        const isActive = styles.includes(style);
                        return (
                          <div 
                            key={style} 
                            onClick={() => toggleStyle(style)}
                            className={`rounded-xl px-2 py-2.5 text-center cursor-pointer transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-br from-indigo-500/80 to-purple-600/80 border-[1.5px] border-white/40 shadow-[0_4px_12px_rgba(99,102,241,0.4)] text-white scale-[1.02]' 
                                : 'bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/20 border-l-white/15 text-white/60 hover:text-white hover:bg-white/[0.08] shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.4)]'
                            }`}
                          >
                            <span className={`text-[11px] font-bold tracking-wide ${isActive ? 'drop-shadow-md' : ''}`}>{style}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Travelers — compact inline row */}
                  <div>
                    <label className="block text-[12px] font-bold text-white/70 mb-1.5 tracking-wider uppercase">Travelers <span className="text-white/40 font-medium normal-case">(Optional)</span></label>
                    <div className="flex items-center gap-2">
                      {/* Male counter */}
                      <div className="flex-1 flex items-center justify-between bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/20 px-3 py-2 rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.2)]">
                        <span className="font-bold text-[12px] text-white/70">Male</span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setMales(Math.max(0, males - 1))} className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 transition-colors active:scale-90"><Minus className="w-3 h-3 text-white" /></button>
                          <span className="w-5 text-center font-black text-sm text-white">{males}</span>
                          <button onClick={() => setMales(males + 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 transition-colors active:scale-90"><Plus className="w-3 h-3 text-white" /></button>
                        </div>
                      </div>
                      {/* Female counter */}
                      <div className="flex-1 flex items-center justify-between bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/20 px-3 py-2 rounded-xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),inset_0_-1px_2px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.2)]">
                        <span className="font-bold text-[12px] text-white/70">Female</span>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setFemales(Math.max(0, females - 1))} className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 transition-colors active:scale-90"><Minus className="w-3 h-3 text-white" /></button>
                          <span className="w-5 text-center font-black text-sm text-white">{females}</span>
                          <button onClick={() => setFemales(females + 1)} className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/15 transition-colors active:scale-90"><Plus className="w-3 h-3 text-white" /></button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-[12px] font-bold text-white/70 mb-1.5 tracking-wider uppercase">Interests <span className="text-white/40 font-medium normal-case">(Optional)</span></label>
                    <input type="text" placeholder="e.g. Art museums, fine dining, hiking..." className="w-full h-11 px-4 text-[13px] rounded-xl bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 text-white placeholder-white/30 focus:bg-white/[0.1] focus:border-white/20 focus:ring-2 focus:ring-indigo-400/20 transition-all outline-none shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)] relative z-20" />
                  </div>
                </div>
              )}

              {/* ─── Navigation Buttons ─── */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10 relative z-10">
                <button 
                  onClick={() => { lightTap(); playSound('tap'); setStep(step - 1); }}
                  className={`h-10 px-5 rounded-2xl font-bold text-[12px] tracking-wide transition-all duration-300 ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/[0.03] border-[1.5px] border-white/10 text-white/70 hover:bg-white/[0.08] hover:text-white shadow-[0_4px_10px_rgba(0,0,0,0.15)]'}`}
                >
                  Back
                </button>
                
                {step < 3 ? (
                  <button 
                    onClick={() => { lightTap(); playSound('tap'); setStep(step + 1); }}
                    className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-white/10 border-[1.5px] border-white/20 text-white font-bold tracking-wide shadow-[0_6px_12px_rgba(0,0,0,0.15)] hover:bg-white/15 transition-all duration-300 group"
                  >
                    <span className="text-[12px] font-bold text-white tracking-wide">Next</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button 
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="flex items-center gap-2 h-10 px-5 rounded-2xl bg-gradient-to-r from-emerald-400/90 to-teal-500/90 border-[1.5px] border-white/40 disabled:opacity-50 transition-all duration-300 shadow-[0_6px_12px_rgba(52,211,153,0.3)] group hover:shadow-[0_8px_16px_rgba(52,211,153,0.4)]"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span className="text-[12px] font-bold text-white tracking-wide">Generate</span>
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center py-16 text-center relative min-h-[280px]"
            >
              <motion.div 
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex items-center justify-center w-24 h-24 mb-6 rounded-[28px] bg-white/[0.02] border border-white/5 shadow-[0_16px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.1)]"
              >
                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                <div className="relative z-10 scale-[1.1]">
                  <LogoIcon size="xl" className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]" />
                </div>
              </motion.div>
              
              <h3 className="text-[13px] font-bold tracking-[0.3em] uppercase text-white/90 drop-shadow-lg animate-pulse">
                {loadingStep || 'Crafting Journey...'}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Feature Card -> Inspiration Carousel */}
      <AnimatePresence mode="wait">
        {!isGenerating && (
          <InspirationCarousel 
            step={step}
            onSelectDestination={handleSelectDestination}
            onSelectSeason={handleSelectSeason}
            onSelectStyle={handleSelectStyle}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

function DollarSignIcon({ count, isActive, level }) {
  const activeStyles = {
    'Budget': 'bg-gradient-to-br from-red-400 to-rose-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.3),0_2px_4px_rgba(239,68,68,0.5)] border-red-300 text-white',
    'Moderate': 'bg-gradient-to-br from-amber-300 to-yellow-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(0,0,0,0.2),0_2px_4px_rgba(251,191,36,0.5)] border-amber-200 text-yellow-900',
    'Luxury': 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.3),0_2px_4px_rgba(52,211,153,0.5)] border-emerald-300 text-white',
  };

  const inactiveStyles = {
    'Budget': 'bg-red-500/10 border-red-500/20 text-red-500/60',
    'Moderate': 'bg-amber-500/10 border-amber-500/20 text-amber-500/60',
    'Luxury': 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500/60',
  };

  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3].map((i) => {
        const isFilled = i <= count;
        return (
          <div 
            key={i} 
            className={`w-[12px] h-[12px] sm:w-[14px] sm:h-[14px] rounded-full flex items-center justify-center border transition-all duration-300 relative overflow-hidden ${
              isFilled 
                ? (isActive ? activeStyles[level] + ' scale-110 z-10' : inactiveStyles[level]) 
                : 'bg-white/5 border-white/5 text-white/20'
            }`}
          >
             {isFilled && isActive && <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-white/60 opacity-60 pointer-events-none rounded-full mix-blend-overlay" />}
             <span className={`text-[8px] sm:text-[9px] font-black leading-none ${isFilled && !isActive ? 'drop-shadow-sm' : ''} ${isFilled && isActive ? 'drop-shadow-md' : ''}`}>$</span>
          </div>
        );
      })}
    </div>
  );
}

export default TripBuilderWizard;
