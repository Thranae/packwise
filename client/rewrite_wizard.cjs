const fs = require('fs');

const originalFile = 'src/components/assistant/TripBuilderWizard.jsx';
const lines = fs.readFileSync(originalFile, 'utf-8').split('\n');

// Keep everything before the TripBuilderWizard definition
// The TripBuilderWizard started at line 305, so we keep lines 0 to 304 (exclusive of 305).
// Wait, the array is 0-indexed, so lines.slice(0, 304) gets the first 304 lines (lines 1 to 304 in standard editors).
const headerCode = lines.slice(0, 304).join('\n');

const newWizardCode = `
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
    const flightContext = startCity ? \` Flying from \${startCity}.\` : "";
    const genderContext = (males > 0 || females > 0) ? \` Travelers: \${males + females} total (\${males} male, \${females} female).\` : "";
    const fullPrompt = \`Destination: \${prompt}.\${flightContext} Start Date: \${startDate}. Duration: \${duration} days. Budget: \${budget}. Style: \${styles.join(', ')}.\${genderContext}\`;
    
    await generateTrip(fullPrompt, { startDate, duration }); 
    
    successTap();
    playSound('success');
    navigate(ROUTES.TRIPS, { state: { generatingTrip: true, destination: prompt } });
  };

  const handleSelectLocation = (loc) => {
    lightTap();
    playSound('tap');
    const locString = \`\${loc.city}, \${loc.country}\`;
    if (activeField === 'destination') setPrompt(locString);
    else if (activeField === 'startCity') setStartCity(locString);
    setSuggestions([]);
  };

  const steps = [
    { id: 1, title: 'Destination', icon: MapPin },
    { id: 2, title: 'Details', icon: Wallet },
    { id: 3, title: 'Style', icon: Compass },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-[800px] mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Sleek, Compact Form Card without 3D tilt */}
      <div className="relative w-full bg-[#050B14]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_2px_10px_rgba(255,255,255,0.05)] flex flex-col overflow-hidden">
        
        {/* Header Steps */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 relative z-10">
          <div className="absolute top-[20px] left-8 right-8 h-[2px] bg-white/5 rounded-full -z-10" />
          <div 
            className="absolute top-[20px] left-8 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full -z-10 transition-all duration-500 ease-out" 
            style={{ width: \`calc(\${((step - 1) / (steps.length - 1)) * 100}% - 64px)\` }} 
          />
          {steps.map((s) => {
            const isActive = step === s.id;
            const isPast = step > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2.5 w-16">
                <div className={\`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 \${
                  isActive || isPast ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110' : 'bg-[#151B2B] text-white/40 border border-white/10'
                }\`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <span className={\`text-[11px] font-bold tracking-wider uppercase \${isActive || isPast ? 'text-white' : 'text-white/40'}\`}>{s.title}</span>
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <div className="relative z-10 w-full min-h-[300px] sm:min-h-[340px] flex flex-col">
          <AnimatePresence mode="wait">
            {!isGenerating ? (
              <motion.div
                key={\`step-\${step}\`}
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
                            className={\`flex-1 py-3.5 rounded-lg text-sm font-bold transition-all duration-300 \${
                              budget === b 
                                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' 
                                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                            }\`}
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
                            className={\`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 \${
                              styles.includes(style)
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 border border-transparent' 
                                : 'bg-black/40 text-white/60 hover:text-white hover:bg-white/10 border border-white/10'
                            }\`}
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
              className={\`px-6 py-3 rounded-xl font-bold text-sm transition-all \${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'}\`}
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
`;

fs.writeFileSync(originalFile, headerCode + '\n' + newWizardCode);
console.log("TripBuilderWizard successfully rewritten to be compact and lag-free!");
