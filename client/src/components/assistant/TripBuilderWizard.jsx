import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bot, MapPin, Wallet, Compass, ArrowRight, Loader2, Sparkles, Plus, Minus, ChevronRight, Calendar, Building2, Globe2, Plane, TreePine } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
        className="w-full h-12 px-4 bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 rounded-2xl shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)] flex items-center justify-between text-white font-semibold text-sm transition-colors duration-200 cursor-pointer"
      >
        <span className="pointer-events-none truncate">{formattedValue}</span>
        <Calendar className="w-4 h-4 text-white/50 pointer-events-none shrink-0" />
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative z-[101] w-[90vw] max-w-[340px] p-5 sm:p-6 rounded-[32px] bg-[#050b14]/90 backdrop-blur-3xl border-[1.5px] border-white/20 border-t-white/40 shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_4px_16px_rgba(255,255,255,0.1),inset_0_-2px_6px_rgba(0,0,0,0.8)]">
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
          </div>
        </div>,
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
                <div className="flex flex-col gap-3">
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
                <div className="flex flex-col gap-4">
                  {/* Duration + Date in a row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12px] font-bold text-white/70 mb-1.5 tracking-wider uppercase">Duration</label>
                      <div className="flex items-center gap-1 bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 p-1 rounded-2xl shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)]">
                        <button 
                          onClick={() => setDuration(Math.max(1, (parseInt(duration) || 7) - 1))}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-90 transition-all duration-200 text-white/60 hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <input 
                          type="number" 
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          placeholder="7" 
                          className="w-10 h-9 text-center text-xl font-black bg-transparent text-white placeholder-white/20 outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" 
                        />
                        <button 
                          onClick={() => setDuration((parseInt(duration) || 7) + 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 active:scale-90 transition-all duration-200 text-white/60 hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-white/40 pr-1">days</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-bold text-white/70 mb-1.5 tracking-wider uppercase">Start Date</label>
                      <PremiumDatePicker 
                        value={startDate}
                        onChange={setStartDate}
                        minDate={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  {/* Budget */}
                  <div>
                    <label className="block text-[12px] font-bold text-white/70 mb-1.5 tracking-wider uppercase">Budget Level</label>
                    <div className="flex items-center gap-1.5 p-1 bg-[#0f172a]/40 backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 rounded-2xl shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)]">
                      {['Budget', 'Moderate', 'Luxury'].map((b) => {
                        const isActive = budget === b;
                        return (
                          <button 
                            key={b} 
                            onClick={() => setBudget(b)}
                            className={`flex-1 py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-300 ${
                              isActive 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_4px_12px_rgba(59,130,246,0.4)] text-white' 
                                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                            }`}
                          >
                            <DollarSignIcon count={b === 'Budget' ? 1 : b === 'Moderate' ? 2 : 3} isActive={isActive} level={b} />
                            <span className={`text-[11px] font-bold tracking-wide ${isActive ? 'drop-shadow-md' : ''}`}>{b}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ─── Step 3: Style & Travelers (compact) ─── */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
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
    'Budget': 'bg-gradient-to-b from-rose-400/40 to-red-600/40',
    'Moderate': 'bg-gradient-to-b from-yellow-400/40 to-amber-600/40',
    'Luxury': 'bg-gradient-to-b from-emerald-400/40 to-emerald-600/40'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3].map((i) => (
        <span 
          key={i} 
          className={`inline-block text-lg font-black tracking-tighter transition-all duration-500 bg-clip-text text-transparent px-0.5 py-1 leading-tight ${
            i <= count 
              ? (isActive ? activeColors[level] : inactiveColors[level]) 
              : 'bg-gradient-to-b from-white/80 to-white/40 opacity-70'
          }`}
        >
          $
        </span>
      ))}
    </div>
  );
}

export default TripBuilderWizard;
