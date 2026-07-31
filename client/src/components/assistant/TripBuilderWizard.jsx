import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bot, MapPin, Wallet, Compass, ArrowRight, Loader2, Sparkles, Plus, Minus, ChevronRight, Calendar, Building2, Globe2, Plane, TreePine } from 'lucide-react';
import { motion, AnimatePresence, useMotionTemplate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTripContext } from '@/context/TripContext';
import { useMouseTilt } from '@/hooks/useMouseTilt';
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

  const handleSelectDate = (d) => {
    const selected = new Date(year, month, d);
    selected.setMinutes(selected.getMinutes() - selected.getTimezoneOffset());
    onChange(selected.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const formattedValue = new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="relative w-full h-[68px]">
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(true); }}
        className="w-full h-full px-5 bg-white/[0.03] hover:bg-white/[0.08]  border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 rounded-[28px] shadow-[0_12px_32px_rgba(0,0,0,0.3),inset_0_2px_8px_rgba(255,255,255,0.1)] flex items-center justify-between text-white font-semibold text-lg transition-all duration-300 cursor-pointer"
      >
        <span className="pointer-events-none">{formattedValue}</span>
        <Calendar className="w-5 h-5 text-white/50 pointer-events-none" />
      </button>

      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 "
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-[101] w-[90vw] max-w-[340px] p-5 sm:p-6 rounded-[32px] bg-[#0f172a]/95  border-[1.5px] border-white/20 border-t-white/40 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_4px_16px_rgba(255,255,255,0.1)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all"><ChevronRight className="w-4 h-4 rotate-180 text-white" /></button>
                  <span className="text-white font-bold text-lg tracking-wide">{monthName}</span>
                  <button onClick={handleNextMonth} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all"><ChevronRight className="w-4 h-4 text-white" /></button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekdays.map(w => <div key={w} className="text-center text-xs font-bold text-white/40 pb-2">{w}</div>)}
                </div>
                
                <div className="grid grid-cols-7 gap-2">
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
                        onClick={() => handleSelectDate(d)}
                        className={`
                          relative aspect-square flex items-center justify-center rounded-2xl text-[14px] font-bold transition-all duration-300
                          ${isPast ? 'text-white/20 cursor-not-allowed' : 'text-white/70 hover:text-white cursor-pointer'}
                          ${isSelected ? '!text-white shadow-[0_4px_16px_rgba(99,102,241,0.6),inset_0_2px_4px_rgba(255,255,255,0.4)] bg-gradient-to-br from-indigo-400 to-purple-600 scale-110 z-10 border border-white/30' : ''}
                          ${!isSelected && !isPast ? 'hover:bg-white/10 hover:scale-105 hover:border hover:border-white/20' : ''}
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

    onSearching?.(true);
    setIsLocalSearching(true);
    const timeoutId = setTimeout(async () => {
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
    userTypedValue.current = locString;
    onChange(locString);
    setShowDropdown(false);
  };

  return (
    <div className={`group relative ${disabled ? 'opacity-50 pointer-events-none' : ''} ${showDropdown ? 'z-[100]' : 'z-10'}`}>
      <label className="block text-[14px] font-bold text-white/90 mb-2 tracking-wide">{label}</label>
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
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          className="w-full h-14 pl-6 pr-14 text-base rounded-[18px] bg-white/[0.05]  border-[1.5px] border-white/10 border-t-white/40 border-l-white/30 text-white placeholder-white/40 focus:bg-white/[0.12] focus:border-white/40 focus:border-t-white/60 focus:ring-4 focus:ring-indigo-400/20 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_2px_8px_rgba(255,255,255,0.1)] hover:bg-white/[0.08] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_4px_16px_rgba(255,255,255,0.25)] hover:-translate-y-[2px] outline-none relative z-20" 
        />
        {isLocalSearching && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <Loader2 className="w-5 h-5 text-white/70 animate-spin" />
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
                className="absolute left-0 right-0 top-full mt-2 bg-[#0c1425]/98  border border-white/10 rounded-[20px] z-[100] shadow-[0_24px_48px_rgba(0,0,0,0.6)] overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 pt-3 pb-2 border-b border-white/5">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase">Suggestions</span>
                </div>

                {/* Results */}
                <div className="p-1.5 max-h-[280px] overflow-y-auto">
                  {suggestions.map((loc, idx) => (
                    <motion.button
                      key={`${loc.city}-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.04 }}
                      onClick={() => handleSelect(loc)}
                      className="w-full text-left px-3 py-2.5 rounded-[14px] hover:bg-white/[0.06] active:bg-white/[0.1] transition-colors flex items-center gap-3 group/item"
                    >
                      <div className={`w-9 h-9 rounded-xl ${loc.iconBg} border border-white/5 flex items-center justify-center shrink-0 group-hover/item:scale-105 transition-transform duration-300`}>
                        <loc.Icon className={`w-4 h-4 ${loc.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-[14px] truncate leading-tight">{loc.city}</div>
                        {loc.country && <div className="text-white/40 text-[11px] font-medium truncate leading-tight mt-0.5">{loc.country}</div>}
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

export const TripBuilderWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { generateTrip, isGenerating, loadingStep, currentTrip } = useTripContext();
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
  
  const containerRef = useRef(null);
  const { rotateX, rotateY, mouseX, mouseY } = useMouseTilt(containerRef, { maxTilt: 2, stiffness: 200, damping: 30 });

  const handleGenerate = async () => {
    lightTap();
    playSound('tap');
    const flightContext = startCity ? ` Flying from ${startCity}.` : "";
    const genderContext = (males > 0 || females > 0) ? ` Travelers: ${males + females} total (${males} male, ${females} female).` : "";
    const fullPrompt = `Destination: ${prompt}.${flightContext} Start Date: ${startDate}. Duration: ${duration} days. Budget: ${budget}. Style: ${styles.join(', ')}.${genderContext}`;
    
    // Explicitly pass dates to bypass AI hallucination
    await generateTrip(fullPrompt, { startDate, duration }); 
    
    successTap();
    playSound('success');
    navigate(ROUTES.TRIPS);
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
    { id: 1, title: 'Destination', icon: MapPin, color: 'from-emerald-400 to-teal-500', shadow: 'rgba(52,211,153,0.5)' },
    { id: 2, title: 'Duration & Budget', icon: Wallet, color: 'from-blue-400 to-indigo-500', shadow: 'rgba(59,130,246,0.5)' },
    { id: 3, title: 'Interests & Style', icon: Compass, color: 'from-purple-400 to-pink-500', shadow: 'rgba(192,132,252,0.5)' },
  ];

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-start justify-start gap-8 max-w-[1400px]">
      <div className="flex flex-col items-start w-full h-full lg:flex-1 lg:max-w-4xl relative z-10">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

        <motion.div 
          ref={containerRef}
          style={{ rotateX, rotateY, transformPerspective: 1500 }}
          className="relative w-full h-full ios-glass-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 group/card shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-shadow duration-700 z-10 flex flex-col min-h-0"
        >
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 mix-blend-overlay z-0"
          style={{
            background: useMotionTemplate`radial-gradient(800px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.1), transparent 40%)`
          }}
        />

        <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10 px-2 sm:px-6 shrink-0">
          <div className="absolute top-1/2 left-6 right-6 h-[3px] bg-white/5 rounded-full -z-10" />
          <div 
            className="absolute top-1/2 left-6 h-[3px] bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full -z-10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_15px_rgba(59,130,246,0.6)]" 
            style={{ width: `calc(${((step - 1) / (steps.length - 1)) * 100}% - 48px)` }} 
          />
          {steps.map((s) => {
            const isActive = step === s.id;
            const isPast = step > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-3 relative">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative group ${
                  isActive || isPast 
                    ? `bg-gradient-to-br ${s.color} text-white shadow-[0_12px_24px_${s.shadow},inset_0_4px_12px_rgba(255,255,255,0.4)] scale-110 z-20` 
                    : 'bg-white/5 border border-white/10 text-white/40  shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]'
                }`}>
                  {isActive && <div className={`absolute -inset-4 bg-gradient-to-r ${s.color} rounded-full opacity-30 blur-2xl animate-pulse -z-10`} />}
                  {isActive && <div className="absolute inset-0 bg-white/20 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay" />}
                  <s.icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-500 ${isActive ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] scale-110' : isPast ? 'drop-shadow-sm' : ''}`} />
                </div>
                <span className={`text-[12px] sm:text-[13px] font-bold tracking-wide uppercase transition-colors duration-700 ${isActive || isPast ? 'text-white' : 'text-white/30'} absolute -bottom-8 w-max text-center hidden sm:block`}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>

        <div className="relative z-10 mt-2 sm:mt-6 flex-1 min-h-0 overflow-y-auto pb-4 scrollbar-hide px-1 sm:px-2" style={{ scrollbarWidth: 'none' }}>
          <AnimatePresence mode="wait">
            {!isGenerating ? (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 1 && (
                  <div className="space-y-4 sm:space-y-5">
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
                      label={<span>Starting City <span className="text-white/40 font-medium">(Optional)</span></span>}
                      value={startCity}
                      onChange={setStartCity}
                      onSearching={setIsSearching}
                      onFocus={() => setActiveField('startCity')}
                      placeholder="Where are you flying from?"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div className="flex flex-col md:flex-row gap-5 sm:gap-6">
                      <div className="flex-1">
                        <label className="block text-[15px] font-bold text-white/90 mb-4 tracking-wide">How long is your trip?</label>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-white/[0.03]  border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 p-2 rounded-[28px] shadow-[0_12px_32px_rgba(0,0,0,0.3),inset_0_2px_8px_rgba(255,255,255,0.1)]">
                            <button 
                              onClick={() => setDuration(Math.max(1, (parseInt(duration) || 7) - 1))}
                              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_2px_8px_rgba(255,255,255,0.2)] active:scale-90 transition-all duration-300 text-white/60 hover:text-white group border border-transparent hover:border-white/10"
                            >
                              <Minus className="w-5 h-5 group-hover:scale-110 transition-transform drop-shadow-sm" />
                            </button>
                            
                            <input 
                              type="number" 
                              value={duration}
                              onChange={(e) => setDuration(e.target.value)}
                              placeholder="7" 
                              className="w-16 h-12 text-center text-3xl font-black bg-transparent text-white placeholder-white/20 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none drop-shadow-md transition-all duration-300" 
                            />
                            
                            <button 
                              onClick={() => setDuration((parseInt(duration) || 7) + 1)}
                              className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_2px_8px_rgba(255,255,255,0.2)] active:scale-90 transition-all duration-300 text-white/60 hover:text-white group border border-transparent hover:border-white/10"
                            >
                              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform drop-shadow-sm" />
                            </button>
                          </div>
                          <span className="text-xl font-bold text-white/50 tracking-wide drop-shadow-sm ml-2">Days</span>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-[15px] font-bold text-white/90 mb-4 tracking-wide">Starting Date</label>
                        <PremiumDatePicker 
                          value={startDate}
                          onChange={setStartDate}
                          minDate={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[15px] font-bold text-white/90 mb-4 tracking-wide">Estimated Budget Level</label>
                      <div className="grid grid-cols-3 gap-2 sm:gap-5">
                        {['Budget', 'Moderate', 'Luxury'].map((b) => {
                          const isActive = budget === b;
                          return (
                            <div 
                              key={b} 
                              onClick={() => setBudget(b)}
                              className={`group/budget relative overflow-hidden rounded-[16px] sm:rounded-[24px] p-2 sm:p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                isActive 
                                  ? 'bg-white/[0.12]  border-[1.5px] border-white/30 border-t-white/60 border-l-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_4px_12px_rgba(255,255,255,0.3)] scale-[1.02] ring-2 sm:ring-4 ring-indigo-400/20' 
                                  : 'bg-white/[0.03]  border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 hover:bg-white/[0.08] hover:scale-[1.02] hover:-translate-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_2px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.3),inset_0_4px_16px_rgba(255,255,255,0.2)]'
                              }`}
                            >
                              {isActive && <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />}
                              <DollarSignIcon count={b === 'Budget' ? 1 : b === 'Moderate' ? 2 : 3} isActive={isActive} level={b} />
                              <span className={`mt-2 sm:mt-3 text-[11px] sm:text-[15px] font-bold tracking-wide transition-colors duration-500 ${isActive ? 'text-white drop-shadow-md' : 'text-white/60 group-hover/budget:text-white/90'}`}>{b}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5 sm:space-y-6">
                    <div>
                      <label className="block text-[15px] font-bold text-white/90 mb-4 tracking-wide">Travel Style</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        {['Fast-paced', 'Relaxed', 'Culture', 'Nature', 'Foodie', 'Luxury'].map((style) => {
                          const isActive = styles.includes(style);
                          return (
                            <div 
                              key={style} 
                              onClick={() => toggleStyle(style)}
                              className={`rounded-[20px] px-4 py-4 sm:px-6 sm:py-5 text-center cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                isActive 
                                  ? 'bg-gradient-to-br from-indigo-500/80 to-purple-600/80  border-[1.5px] border-white/40 border-t-white/70 border-l-white/50 shadow-[0_16px_32px_rgba(99,102,241,0.5),inset_0_4px_16px_rgba(255,255,255,0.4)] text-white scale-[1.02] ring-2 ring-white/20' 
                                  : 'bg-white/[0.03]  border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 text-white/60 hover:text-white hover:bg-white/[0.08] hover:scale-[1.02] hover:-translate-y-1 shadow-[0_8px_16px_rgba(0,0,0,0.15),inset_0_2px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3),inset_0_4px_12px_rgba(255,255,255,0.25)]'
                              }`}
                            >
                              <span className={`text-[13px] sm:text-[15px] font-bold tracking-wide transition-colors duration-300 ${isActive ? 'drop-shadow-md' : ''}`}>{style}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-[15px] font-bold text-white/90 mb-3 tracking-wide">Specific Interests <span className="text-white/40 font-medium">(Optional)</span></label>
                      <input type="text" placeholder="e.g. Art museums, fine dining, hiking..." className="w-full h-16 px-6 text-lg rounded-[20px] bg-white/[0.03]  border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 text-white placeholder-white/30 focus:bg-white/[0.08] focus:border-white/20 focus:ring-4 focus:ring-indigo-400/10 transition-all duration-500 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] outline-none group-hover:bg-white/[0.06]" />
                    </div>
                    <div>
                      <label className="block text-[15px] font-bold text-white/90 mb-4 tracking-wide">Who is traveling? <span className="text-white/40 font-medium">(For Packing List)</span></label>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="flex-1 flex items-center justify-between bg-white/[0.03]  border-[1.5px] border-white/10 p-4 rounded-[24px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:bg-white/[0.05] transition-colors duration-300">
                          <span className="font-bold text-white/80 tracking-wide">Male Travelers</span>
                          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                            <button onClick={() => setMales(Math.max(0, males - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors active:scale-90"><Minus className="w-4 h-4 text-white" /></button>
                            <span className="w-6 text-center font-black text-lg text-white">{males}</span>
                            <button onClick={() => setMales(males + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors active:scale-90"><Plus className="w-4 h-4 text-white" /></button>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-between bg-white/[0.03]  border-[1.5px] border-white/10 p-4 rounded-[24px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:bg-white/[0.05] transition-colors duration-300">
                          <span className="font-bold text-white/80 tracking-wide">Female Travelers</span>
                          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                            <button onClick={() => setFemales(Math.max(0, females - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors active:scale-90"><Minus className="w-4 h-4 text-white" /></button>
                            <span className="w-6 text-center font-black text-lg text-white">{females}</span>
                            <button onClick={() => setFemales(females + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors active:scale-90"><Plus className="w-4 h-4 text-white" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10 relative z-10 shrink-0">
                  <button 
                    onClick={() => { lightTap(); playSound('tap'); setStep(step - 1); }}
                    className={`h-12 sm:h-14 px-6 sm:px-8 rounded-full font-bold text-[14px] sm:text-[15px] tracking-wide transition-all duration-500 ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/[0.03]  border-[1.5px] border-white/10 border-t-white/30 text-white/70 hover:bg-white/[0.08] hover:text-white hover:-translate-y-[2px] shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3),inset_0_4px_8px_rgba(255,255,255,0.1)]'}`}
                  >
                    Back
                  </button>
                  
                  {step < 3 ? (
                    <button 
                      onClick={() => { lightTap(); playSound('tap'); setStep(step + 1); }}
                      className="flex items-center gap-2 sm:gap-3 h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-white/10  border-[1.5px] border-white/20 border-t-white/50 border-l-white/40 text-white font-bold tracking-wide shadow-[0_12px_24px_rgba(0,0,0,0.3),inset_0_4px_12px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-[1.02] hover:-translate-y-[2px] transition-all duration-500 group hover:shadow-[0_16px_32px_rgba(0,0,0,0.4),inset_0_6px_16px_rgba(255,255,255,0.3)]"
                    >
                      <span className="text-[14px] sm:text-[15px] font-bold text-white tracking-wide drop-shadow-md">Next Step</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform drop-shadow-md" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleGenerate}
                      disabled={!prompt.trim()}
                      className="flex items-center gap-2 sm:gap-3 h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-gradient-to-r from-emerald-400/90 to-teal-500/90  border-[1.5px] border-white/40 border-t-white/70 border-l-white/60 disabled:opacity-50 transition-all duration-500 shadow-[0_12px_24px_rgba(52,211,153,0.5),inset_0_4px_12px_rgba(255,255,255,0.4)] group hover:scale-[1.02] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(52,211,153,0.6),inset_0_6px_16px_rgba(255,255,255,0.5)]"
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-md" />
                      <span className="text-[14px] sm:text-[15px] font-bold text-white tracking-wide drop-shadow-md">Generate Itinerary</span>
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
                className="flex flex-col items-center justify-center py-20 text-center relative h-full min-h-[350px]"
              >
                {/* Ultra-Premium Minimalist Logo Reveal */}
                <motion.div 
                  initial={{ scale: 0.85, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 mb-8 rounded-[32px] bg-white/[0.02] border border-white/5  shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)]"
                >
                  {/* Very subtle static glow behind the icon */}
                  <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                  
                  {/* The icon stays perfectly straight and stable */}
                  <div className="relative z-10 scale-[1.2]">
                    <LogoIcon size="xl" className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]" />
                  </div>
                </motion.div>
                
                <h3 className="text-[14px] sm:text-[15px] font-bold tracking-[0.3em] uppercase text-white/90 drop-shadow-lg animate-pulse">
                  {loadingStep || 'Crafting Journey...'}
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      </div>

      {/* 3D Glass Side Panel for Search Results */}
      <AnimatePresence>
        {step === 1 && (suggestions.length > 0 || isSearching) && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block w-full lg:w-[400px] shrink-0 sticky top-8"
          >
            <div className="w-full p-6 rounded-[32px] bg-black/40  border border-white/10 border-t-white/30 border-l-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.2)]">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {activeField === 'startCity' ? 'Starting Locations' : 'Destinations'}
                </h3>
              </div>
              
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4">
                  <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                  <span className="text-sm font-medium text-white/50">Searching the globe...</span>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
                  }}
                  className="flex flex-col gap-2"
                >
                  {suggestions.map((loc, idx) => (
                    <motion.button
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, x: -15 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }
                      }}
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full flex items-center gap-4 px-4 py-3 rounded-[20px] transition-all duration-400 text-left group/item relative overflow-hidden bg-transparent hover:bg-white/[0.06] border border-transparent hover:border-white/10"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent -translate-x-[100%] group-hover/item:translate-x-0 transition-transform duration-500 ease-out pointer-events-none" />
                      
                      <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-white/5  border border-white/10 flex items-center justify-center text-2xl shadow-[0_4px_8px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover/item:scale-110 group-hover/item:bg-white/20 group-hover/item:border-white/50 group-hover/item:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                        {loc.icon}
                      </div>
                      
                      <div className="relative z-10 flex flex-col transition-transform duration-300 group-hover/item:translate-x-1.5 overflow-hidden">
                        <span className="text-[16px] font-bold text-white tracking-wide drop-shadow-md truncate">{loc.city}</span>
                        <span className="text-[13px] font-medium text-white/40 group-hover/item:text-white/80 transition-colors duration-300 truncate">{loc.country}</span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function DollarSignIcon({ count, isActive, level }) {
  const activeColors = {
    'Budget': 'bg-gradient-to-b from-rose-400 to-red-700 drop-shadow-[0_4px_6px_rgba(225,29,72,0.5)] scale-110',
    'Moderate': 'bg-gradient-to-b from-yellow-300 to-amber-600 drop-shadow-[0_4px_6px_rgba(245,158,11,0.5)] scale-110',
    'Luxury': 'bg-gradient-to-b from-emerald-300 to-emerald-600 drop-shadow-[0_4px_6px_rgba(16,185,129,0.5)] scale-110'
  };
  
  const inactiveColors = {
    'Budget': 'bg-gradient-to-b from-rose-400/40 to-red-600/40 group-hover/budget:from-rose-400/80 group-hover/budget:to-red-600/80',
    'Moderate': 'bg-gradient-to-b from-yellow-400/40 to-amber-600/40 group-hover/budget:from-yellow-400/80 group-hover/budget:to-amber-600/80',
    'Luxury': 'bg-gradient-to-b from-emerald-400/40 to-emerald-600/40 group-hover/budget:from-emerald-400/80 group-hover/budget:to-emerald-600/80'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3].map((i) => (
        <span 
          key={i} 
          className={`text-2xl sm:text-3xl font-black tracking-tighter transition-all duration-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
            i <= count 
              ? (isActive ? activeColors[level] : inactiveColors[level]) 
              : 'bg-gradient-to-b from-white/80 to-white/40 opacity-70 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
          }`}
        >
          $
        </span>
      ))}
    </div>
  );
}

export default TripBuilderWizard;
