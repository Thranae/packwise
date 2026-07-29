import React, { useState, useEffect, useRef } from 'react';
import { Bot, MapPin, Wallet, Compass, ArrowRight, Loader2, Sparkles, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence, useMotionTemplate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useTripContext } from '@/context/TripContext';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { useHaptics } from '@/hooks/useHaptics';

// Removed static POPULAR_LOCATIONS

const LocationInput = ({ label, value, onChange, placeholder, disabled, autoFocus, onFocus, onResults, onSearching }) => {
  const [isLocalSearching, setIsLocalSearching] = useState(false);
  const userTypedValue = useRef(value);

  useEffect(() => {
    // If the value changed programmatically (e.g. user clicked a suggestion), do not search
    if (value !== userTypedValue.current) {
      onResults([]);
      onSearching(false);
      setIsLocalSearching(false);
      return;
    }

    if (value.trim().length < 3) {
      onResults([]);
      onSearching(false);
      setIsLocalSearching(false);
      return;
    }

    onSearching(true);
    setIsLocalSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=6&addressdetails=1`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        
        const parsed = data.map(item => {
          const addr = item.address || {};
          const mainName = addr.city || addr.town || addr.village || addr.state || item.name;
          const country = addr.country || '';
          let icon = "📍";
          if (country.includes('France')) icon = "🗼";
          else if (country.includes('Japan')) icon = "🌸";
          else if (country.includes('Italy')) icon = "🏛️";
          else if (country.includes('United States') || country.includes('USA')) icon = "🗽";
          else if (country.includes('Indonesia')) icon = "🏖️";
          else if (country.includes('United Arab Emirates')) icon = "🏙️";
          else if (country.includes('United Kingdom') || country.includes('UK')) icon = "🎡";
          else if (country.includes('Australia')) icon = "🦘";

          return { city: mainName, country, icon };
        });

        const unique = parsed.filter((v, i, a) => a.findIndex(t => (t.city === v.city && t.country === v.country)) === i);
        onResults(unique);
      } catch (err) {
        console.error("Location search failed", err);
      } finally {
        onSearching(false);
        setIsLocalSearching(false);
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <div className={`group relative ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <label className="block text-[15px] font-bold text-white/90 mb-3 tracking-wide">{label}</label>
      <div className="relative z-20">
        <input 
          type="text" 
          value={value}
          onChange={(e) => {
            userTypedValue.current = e.target.value;
            onChange(e.target.value);
          }}
          onFocus={onFocus}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          className="w-full h-16 pl-6 pr-14 text-lg rounded-[20px] bg-white/[0.05] backdrop-blur-2xl border-[1.5px] border-white/10 border-t-white/40 border-l-white/30 text-white placeholder-white/40 focus:bg-white/[0.12] focus:border-white/40 focus:border-t-white/60 focus:ring-4 focus:ring-indigo-400/20 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_2px_8px_rgba(255,255,255,0.1)] hover:bg-white/[0.08] hover:shadow-[0_12px_40px_rgba(0,0,0,0.3),inset_0_4px_16px_rgba(255,255,255,0.25)] hover:-translate-y-[2px] outline-none" 
        />
        {isLocalSearching && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 z-30 pointer-events-none">
            <Loader2 className="w-5 h-5 text-white/70 animate-spin" />
          </div>
        )}
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
    const fullPrompt = `Destination: ${prompt}.${flightContext} Duration: ${duration} days. Budget: ${budget}. Style: ${styles.join(', ')}.${genderContext}`;
    await generateTrip(fullPrompt);
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
          className="relative w-full h-full ios-glass-card rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 group/card shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-shadow duration-700 z-10 flex flex-col min-h-0"
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
                    : 'bg-white/5 border border-white/10 text-white/40 backdrop-blur-md shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]'
                }`}>
                  {isActive && <div className={`absolute -inset-2 bg-gradient-to-r ${s.color} rounded-full opacity-40 blur-xl animate-pulse -z-10`} />}
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
                initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {step === 1 && (
                  <div className="space-y-5 sm:space-y-6">
                    <LocationInput 
                      label="Where do you want to go?"
                      value={prompt}
                      onChange={setPrompt}
                      onResults={setSuggestions}
                      onSearching={setIsSearching}
                      onFocus={() => setActiveField('destination')}
                      placeholder="e.g. Tokyo, Japan or 'Somewhere tropical'"
                      autoFocus={true}
                    />
                    
                    <LocationInput 
                      label={<span>Starting City <span className="text-white/40 font-medium">(Optional)</span></span>}
                      value={startCity}
                      onChange={setStartCity}
                      onResults={setSuggestions}
                      onSearching={setIsSearching}
                      onFocus={() => setActiveField('startCity')}
                      placeholder="Where are you flying from?"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 sm:space-y-8">
                    <div>
                      <label className="block text-[15px] font-bold text-white/90 mb-4 tracking-wide">How long is your trip?</label>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/[0.03] backdrop-blur-3xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 p-2 rounded-[28px] shadow-[0_12px_32px_rgba(0,0,0,0.3),inset_0_2px_8px_rgba(255,255,255,0.1)]">
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
                                  ? 'bg-white/[0.12] backdrop-blur-3xl border-[1.5px] border-white/30 border-t-white/60 border-l-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_4px_12px_rgba(255,255,255,0.3)] scale-[1.02] ring-2 sm:ring-4 ring-indigo-400/20' 
                                  : 'bg-white/[0.03] backdrop-blur-2xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 hover:bg-white/[0.08] hover:scale-[1.02] hover:-translate-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.2),inset_0_2px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.3),inset_0_4px_16px_rgba(255,255,255,0.2)]'
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
                  <div className="space-y-6 sm:space-y-8">
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
                                  ? 'bg-gradient-to-br from-indigo-500/80 to-purple-600/80 backdrop-blur-2xl border-[1.5px] border-white/40 border-t-white/70 border-l-white/50 shadow-[0_16px_32px_rgba(99,102,241,0.5),inset_0_4px_16px_rgba(255,255,255,0.4)] text-white scale-[1.02] ring-2 ring-white/20' 
                                  : 'bg-white/[0.03] backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 text-white/60 hover:text-white hover:bg-white/[0.08] hover:scale-[1.02] hover:-translate-y-1 shadow-[0_8px_16px_rgba(0,0,0,0.15),inset_0_2px_8px_rgba(255,255,255,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3),inset_0_4px_12px_rgba(255,255,255,0.25)]'
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
                      <input type="text" placeholder="e.g. Art museums, fine dining, hiking..." className="w-full h-16 px-6 text-lg rounded-[20px] bg-white/[0.03] backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 border-l-white/20 text-white placeholder-white/30 focus:bg-white/[0.08] focus:border-white/20 focus:ring-4 focus:ring-indigo-400/10 transition-all duration-500 shadow-[inset_0_2px_8px_rgba(0,0,0,0.2)] outline-none group-hover:bg-white/[0.06]" />
                    </div>
                    <div>
                      <label className="block text-[15px] font-bold text-white/90 mb-4 tracking-wide">Who is traveling? <span className="text-white/40 font-medium">(For Packing List)</span></label>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <div className="flex-1 flex items-center justify-between bg-white/[0.03] backdrop-blur-2xl border-[1.5px] border-white/10 p-4 rounded-[24px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:bg-white/[0.05] transition-colors duration-300">
                          <span className="font-bold text-white/80 tracking-wide">Male Travelers</span>
                          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full p-1 shadow-[0_4px_12px_rgba(0,0,0,0.2)]">
                            <button onClick={() => setMales(Math.max(0, males - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors active:scale-90"><Minus className="w-4 h-4 text-white" /></button>
                            <span className="w-6 text-center font-black text-lg text-white">{males}</span>
                            <button onClick={() => setMales(males + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/20 transition-colors active:scale-90"><Plus className="w-4 h-4 text-white" /></button>
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-between bg-white/[0.03] backdrop-blur-2xl border-[1.5px] border-white/10 p-4 rounded-[24px] shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] hover:bg-white/[0.05] transition-colors duration-300">
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

                <div className="flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10 relative z-10 shrink-0">
                  <button 
                    onClick={() => { lightTap(); playSound('tap'); setStep(step - 1); }}
                    className={`h-12 sm:h-14 px-6 sm:px-8 rounded-full font-bold text-[14px] sm:text-[15px] tracking-wide transition-all duration-500 ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/[0.03] backdrop-blur-xl border-[1.5px] border-white/10 border-t-white/30 text-white/70 hover:bg-white/[0.08] hover:text-white hover:-translate-y-[2px] shadow-[0_8px_16px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3),inset_0_4px_8px_rgba(255,255,255,0.1)]'}`}
                  >
                    Back
                  </button>
                  
                  {step < 3 ? (
                    <button 
                      onClick={() => { lightTap(); playSound('tap'); setStep(step + 1); }}
                      className="flex items-center gap-2 sm:gap-3 h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-white/10 backdrop-blur-2xl border-[1.5px] border-white/20 border-t-white/50 border-l-white/40 text-white font-bold tracking-wide shadow-[0_12px_24px_rgba(0,0,0,0.3),inset_0_4px_12px_rgba(255,255,255,0.2)] hover:bg-white/20 hover:scale-[1.02] hover:-translate-y-[2px] transition-all duration-500 group hover:shadow-[0_16px_32px_rgba(0,0,0,0.4),inset_0_6px_16px_rgba(255,255,255,0.3)]"
                    >
                      <span className="text-[14px] sm:text-[15px] font-bold text-white tracking-wide drop-shadow-md">Next Step</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:translate-x-1 transition-transform drop-shadow-md" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleGenerate}
                      disabled={!prompt.trim()}
                      className="flex items-center gap-2 sm:gap-3 h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-gradient-to-r from-emerald-400/90 to-teal-500/90 backdrop-blur-2xl border-[1.5px] border-white/40 border-t-white/70 border-l-white/60 disabled:opacity-50 transition-all duration-500 shadow-[0_12px_24px_rgba(52,211,153,0.5),inset_0_4px_12px_rgba(255,255,255,0.4)] group hover:scale-[1.02] hover:-translate-y-[2px] hover:shadow-[0_16px_32px_rgba(52,211,153,0.6),inset_0_6px_16px_rgba(255,255,255,0.5)]"
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
                initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center py-16 sm:py-20 text-center"
              >
                <div className="relative mb-10 group">
                  <div className="absolute inset-0 bg-blue-500 rounded-full blur-[40px] opacity-40 animate-pulse" />
                  <div className="absolute inset-0 bg-purple-500 rounded-full blur-[50px] opacity-30 animate-pulse mix-blend-screen" style={{ animationDelay: '1s' }} />
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[32px] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/20 backdrop-blur-xl flex items-center justify-center relative z-10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)]">
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-white animate-spin" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4 drop-shadow-lg">
                  {loadingStep || 'Crafting your perfect trip...'}
                </h3>
                <p className="text-base sm:text-lg text-white/60 font-medium max-w-sm mx-auto leading-relaxed">
                  Our AI is analyzing thousands of data points to find the best flights, accommodations, and activities.
                </p>
                <div className="mt-8 sm:mt-10 flex gap-3">
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.8)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
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
            <div className="w-full p-6 rounded-[32px] bg-black/40 backdrop-blur-3xl border border-white/10 border-t-white/30 border-l-white/20 shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.2)]">
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
                      
                      <div className="relative z-10 shrink-0 w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-2xl shadow-[0_4px_8px_rgba(0,0,0,0.3)] transition-all duration-500 group-hover/item:scale-110 group-hover/item:bg-white/20 group-hover/item:border-white/50 group-hover/item:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
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
