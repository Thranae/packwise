import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bot, MapPin, Wallet, Compass, ArrowRight, Loader2, Sparkles, Plus, Minus, ChevronRight, Calendar, Building2, Globe2, Plane, TreePine } from 'lucide-react';
import { motion, AnimatePresence, useMotionTemplate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTripContext } from '@/context/TripContext';
import { useTransitionNavigate } from '@/contexts/TransitionContext';
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
  const triggerTransition = useTransitionNavigate();
  const [step, setStep] = useState(1);
  const { generateTrip, isGenerating, loadingStep } = useTripContext();
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
  
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const toggleStyle = (style) => {
    lightTap();
    setStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style]);
  };

  const handleGenerate = async () => {
    lightTap();
    playSound('tap');
    const flightContext = startCity ? ` Flying from ${startCity}.` : "";
    const genderContext = (males > 0 || females > 0) ? ` Travelers: ${males + females} total (${males} male, ${females} female).` : "";
    const fullPrompt = `Destination: ${prompt}.${flightContext} Start Date: ${startDate}. Duration: ${duration} days. Budget: ${budget}. Style: ${styles.join(', ')}.${genderContext}`;
    
    await generateTrip(fullPrompt, { startDate, duration }); 
    
    successTap();
    playSound('success');
    navigate(ROUTES.TRIPS, { state: { generatingTrip: true, destination: prompt } });
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
    { id: 1, title: 'Destination', icon: MapPin, color: 'from-emerald-400 via-teal-400 to-emerald-600', shadow: 'shadow-[0_0_20px_rgba(52,211,153,0.5)]' },
    { id: 2, title: 'Details', icon: Wallet, color: 'from-blue-400 via-indigo-400 to-blue-600', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    { id: 3, title: 'Style', icon: Compass, color: 'from-fuchsia-400 via-purple-400 to-fuchsia-600', shadow: 'shadow-[0_0_20px_rgba(192,132,252,0.5)]' },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-[800px] mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Sleek, Compact Form Card without 3D tilt */}
      <div className="relative w-full bg-[#050B14]/60 backdrop-blur-[30px] border border-white/10 border-t-white/20 rounded-[40px] p-6 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_2px_20px_rgba(255,255,255,0.1)] flex flex-col overflow-hidden">
        
        {/* Header Steps */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 relative z-10">
          <div className="absolute top-[20px] left-8 right-8 h-[2px] bg-white/5 rounded-full -z-10" />
          <div 
            className="absolute top-[20px] left-8 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full -z-10 transition-all duration-500 ease-out" 
            style={{ width: `calc(${((step - 1) / (steps.length - 1)) * 100}% - 64px)` }} 
          />
          {steps.map((s) => {
            const isActive = step === s.id;
            const isPast = step > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-3 w-16 relative" style={{ perspective: "1000px" }}>
                {isActive && (
                  <div className="absolute top-0 w-12 h-12 bg-white/20 rounded-full blur-xl animate-pulse" />
                )}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 ${
                  isActive || isPast 
                    ? `bg-gradient-to-br ${s.color} text-white ${s.shadow} scale-110 rotate-3` 
                    : 'bg-black/40 text-white/40 border border-white/5'
                }`}
                style={{
                  boxShadow: isActive || isPast ? 'inset 0px 2px 4px rgba(255,255,255,0.6), inset 0px -4px 8px rgba(0,0,0,0.4), 0px 10px 20px rgba(0,0,0,0.5)' : 'inset 0px 1px 2px rgba(255,255,255,0.05)',
                  transformStyle: 'preserve-3d'
                }}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-50" />
                  <s.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] scale-110' : ''}`} style={{ transform: 'translateZ(10px)' }} />
                </div>
                <span className={`text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-110' : isPast ? 'text-white/80' : 'text-white/30'}`}>{s.title}</span>
              </div>
            );
          })}}
        </div>

        {/* Form Content */}
        <div className="relative z-10 w-full min-h-[300px] sm:min-h-[340px] flex flex-col">
          <AnimatePresence mode="wait">
            {!isGenerating ? (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-6 flex-1 flex flex-col justify-center"
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <LocationInput 
                      label="Where do you want to go?"
                      value={prompt}
                      onChange={setPrompt}
                      onSearching={setIsSearching}
                      onFocus={() => setActiveField('destination')}
                      placeholder="e.g. Tokyo, Japan"
                      autoFocus={true}
                    />
                    <LocationInput 
                      label={<span>Starting City <span className="text-white/30 font-medium text-xs ml-2">(Optional)</span></span>}
                      value={startCity}
                      onChange={setStartCity}
                      onSearching={setIsSearching}
                      onFocus={() => setActiveField('startCity')}
                      placeholder="Where are you flying from?"
                    />
                    
                    {/* Inline Suggestions */}
                    <AnimatePresence>
                      {(suggestions.length > 0 || isSearching) && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 shadow-inner"
                        >
                          {isSearching ? (
                            <div className="flex items-center justify-center gap-3 py-4 text-white/50 text-sm">
                              <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              {suggestions.map((loc, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSelectLocation(loc)}
                                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 group"
                                >
                                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                    {loc.Icon ? <loc.Icon className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                  </div>
                                  <div className="overflow-hidden flex-1">
                                    <div className="text-sm font-bold text-white truncate">{loc.city}</div>
                                    <div className="text-xs text-white/50 truncate">{loc.country}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-white/80 tracking-wider uppercase mb-4">
                          <Clock className="w-4 h-4 text-blue-400" /> Duration (Days)
                        </label>
                        <div className="flex items-center justify-between bg-black/40 rounded-xl p-2 border border-white/10">
                          <button onClick={() => { lightTap(); setDuration(Math.max(1, (parseInt(duration) || 7) - 1)); }} className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"><Minus className="w-5 h-5" /></button>
                          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="7" className="w-16 text-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 outline-none bg-transparent" />
                          <button onClick={() => { lightTap(); setDuration((parseInt(duration) || 7) + 1); }} className="w-12 h-12 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"><Plus className="w-5 h-5" /></button>
                        </div>
                      </div>
                      
                      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                        <label className="flex items-center gap-2 text-[13px] font-bold text-white/80 tracking-wider uppercase mb-4">
                          <Calendar className="w-4 h-4 text-purple-400" /> Start Date
                        </label>
                        <PremiumDatePicker value={startDate} onChange={setStartDate} minDate={new Date().toISOString().split('T')[0]} />
                      </div>
                    </div>
                    
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-white/80 tracking-wider uppercase mb-4">
                        <Wallet className="w-4 h-4 text-emerald-400" /> Estimated Budget
                      </label>
                      <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10">
                        {['Budget', 'Moderate', 'Luxury'].map((b) => (
                          <button 
                            key={b} 
                            onClick={() => { lightTap(); setBudget(b); }}
                            className={`flex-1 py-3.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                              budget === b 
                                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-white/80 tracking-wider uppercase mb-4">
                        <Compass className="w-4 h-4 text-orange-400" /> Travel Style
                      </label>
                      <div className="flex flex-wrap gap-2.5">
                        {['Fast-paced', 'Relaxed', 'Culture', 'Nature', 'Foodie', 'Luxury', 'Adventure', 'Nightlife'].map((style) => (
                          <button 
                            key={style} 
                            onClick={() => toggleStyle(style)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                              styles.includes(style)
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 border border-transparent' 
                                : 'bg-black/40 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
                      <label className="flex items-center gap-2 text-[13px] font-bold text-white/80 tracking-wider uppercase mb-4">
                        <Users className="w-4 h-4 text-pink-400" /> Travelers
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex items-center justify-between bg-black/40 border border-white/10 p-3 rounded-xl">
                          <span className="text-sm font-bold text-white/80 ml-2">Male</span>
                          <div className="flex items-center gap-3">
                            <button onClick={() => { lightTap(); setMales(Math.max(0, males - 1)); }} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"><Minus className="w-4 h-4" /></button>
                            <span className="w-6 text-center font-bold text-lg text-white">{males}</span>
                            <button onClick={() => { lightTap(); setMales(males + 1); }} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"><Plus className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-between bg-black/40 border border-white/10 p-3 rounded-xl">
                          <span className="text-sm font-bold text-white/80 ml-2">Female</span>
                          <div className="flex items-center gap-3">
                            <button onClick={() => { lightTap(); setFemales(Math.max(0, females - 1)); }} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"><Minus className="w-4 h-4" /></button>
                            <span className="w-6 text-center font-bold text-lg text-white">{females}</span>
                            <button onClick={() => { lightTap(); setFemales(females + 1); }} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors"><Plus className="w-4 h-4" /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center flex-1 text-center"
              >
                <div className="relative flex items-center justify-center w-24 h-24 mb-6 rounded-3xl bg-white/[0.02] border border-white/5">
                   <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                   <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" style={{ animationDuration: '2s' }} />
                   <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                   <Sparkles className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-white/90">
                  {loadingStep || 'Crafting Journey...'}
                </h3>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {!isGenerating && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10 relative z-10">
            <button 
              onClick={() => { lightTap(); setStep(step - 1); }}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'}`}
            >
              Back
            </button>
            
            {step < 3 ? (
              <button 
                onClick={() => { lightTap(); setStep(step + 1); }}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
              >
                <Sparkles className="w-4 h-4" /> Generate Trip
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default TripBuilderWizard;
