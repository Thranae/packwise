const fs = require('fs');

const originalFile = 'src/components/assistant/TripBuilderWizard.jsx';
const lines = fs.readFileSync(originalFile, 'utf-8').split('\n');

// Keep everything before the TripBuilderWizard definition
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
    { id: 2, title: 'Duration & Budget', icon: Wallet },
    { id: 3, title: 'Interests & Style', icon: Compass },
  ];

  return (
    <div className="w-full h-full flex flex-col lg:flex-row items-start justify-start gap-8 max-w-[1200px] mx-auto">
      <div className="flex flex-col items-start w-full h-full lg:flex-1 relative z-10">
        
        {/* Compact Form Card without 3D tilt */}
        <div className="relative w-full bg-[#0B1221] border border-white/10 rounded-[24px] p-5 sm:p-8 shadow-xl flex flex-col min-h-0">
          
          {/* Header Steps */}
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="absolute top-1/2 left-4 right-4 h-1 bg-white/5 rounded-full -z-10" />
            <div 
              className="absolute top-1/2 left-4 h-1 bg-blue-500 rounded-full -z-10 transition-all duration-300" 
              style={{ width: \`calc(\${((step - 1) / (steps.length - 1)) * 100}% - 32px)\` }} 
            />
            {steps.map((s) => {
              const isActive = step === s.id;
              const isPast = step > s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2">
                  <div className={\`w-10 h-10 rounded-full flex items-center justify-center transition-colors \${
                    isActive || isPast ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-[#151B2B] text-white/40 border border-white/10'
                  }\`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <span className={\`text-xs font-bold \${isActive || isPast ? 'text-white' : 'text-white/40'}\`}>{s.title}</span>
                </div>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide pb-4">
            <AnimatePresence mode="wait">
              {!isGenerating ? (
                <motion.div
                  key={\`step-\${step}\`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {step === 1 && (
                    <div className="space-y-5">
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
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <label className="block text-sm font-bold text-white/90 mb-3">Duration (Days)</label>
                          <div className="flex items-center gap-4 bg-[#151B2B] border border-white/10 p-2 rounded-[20px]">
                            <button onClick={() => setDuration(Math.max(1, (parseInt(duration) || 7) - 1))} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center"><Minus className="w-4 h-4" /></button>
                            <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="7" className="w-12 text-center text-xl font-bold bg-transparent text-white outline-none" />
                            <button onClick={() => setDuration((parseInt(duration) || 7) + 1)} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center"><Plus className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-bold text-white/90 mb-3">Start Date</label>
                          <PremiumDatePicker value={startDate} onChange={setStartDate} minDate={new Date().toISOString().split('T')[0]} />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-white/90 mb-3">Estimated Budget</label>
                        <div className="flex gap-3">
                          {['Budget', 'Moderate', 'Luxury'].map((b) => (
                            <button 
                              key={b} 
                              onClick={() => setBudget(b)}
                              className={\`flex-1 py-3 rounded-xl text-sm font-bold transition-colors \${
                                budget === b 
                                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                                  : 'bg-[#151B2B] text-white/60 hover:bg-[#1E2536] border border-white/5'
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
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-white/90 mb-3">Travel Style</label>
                        <div className="flex flex-wrap gap-3">
                          {['Fast-paced', 'Relaxed', 'Culture', 'Nature', 'Foodie', 'Luxury'].map((style) => (
                            <button 
                              key={style} 
                              onClick={() => toggleStyle(style)}
                              className={\`px-4 py-2 rounded-full text-sm font-bold transition-colors \${
                                styles.includes(style)
                                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20' 
                                  : 'bg-[#151B2B] text-white/60 hover:bg-[#1E2536] border border-white/5'
                              }\`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white/90 mb-3">Travelers</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-1 flex items-center justify-between bg-[#151B2B] border border-white/5 p-3 rounded-xl">
                            <span className="text-sm font-bold text-white/80">Male</span>
                            <div className="flex items-center gap-3">
                              <button onClick={() => setMales(Math.max(0, males - 1))} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white"><Minus className="w-3 h-3" /></button>
                              <span className="w-4 text-center font-bold text-white">{males}</span>
                              <button onClick={() => setMales(males + 1)} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                          <div className="flex-1 flex items-center justify-between bg-[#151B2B] border border-white/5 p-3 rounded-xl">
                            <span className="text-sm font-bold text-white/80">Female</span>
                            <div className="flex items-center gap-3">
                              <button onClick={() => setFemales(Math.max(0, females - 1))} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white"><Minus className="w-3 h-3" /></button>
                              <span className="w-4 text-center font-bold text-white">{females}</span>
                              <button onClick={() => setFemales(females + 1)} className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white"><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/10">
                    <button 
                      onClick={() => setStep(step - 1)}
                      className={\`px-6 py-2.5 rounded-full font-bold text-sm transition-colors \${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-[#151B2B] hover:bg-[#1E2536] text-white/70 hover:text-white'}\`}
                    >
                      Back
                    </button>
                    
                    {step < 3 ? (
                      <button 
                        onClick={() => setStep(step + 1)}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-bold transition-colors shadow-lg shadow-blue-500/20"
                      >
                        Next Step <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold transition-colors shadow-lg shadow-emerald-500/20"
                      >
                        <Sparkles className="w-4 h-4" /> Generate Itinerary
                      </button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center h-full"
                >
                  <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                  <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-white/90">
                    {loadingStep || 'Crafting Journey...'}
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Side Panel for Suggestions - Simplified */}
      <AnimatePresence>
        {step === 1 && (suggestions.length > 0 || isSearching) && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="hidden lg:block w-[350px] shrink-0"
          >
            <div className="bg-[#0B1221] border border-white/10 rounded-[24px] p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <MapPin className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Suggestions</h3>
              </div>
              
              {isSearching ? (
                <div className="py-8 text-center">
                  <Loader2 className="w-6 h-6 text-blue-400 animate-spin mx-auto mb-2" />
                  <span className="text-xs text-white/50">Searching...</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {suggestions.map((loc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectLocation(loc)}
                      className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#151B2B] flex items-center justify-center shrink-0">
                        {loc.Icon ? <loc.Icon className="w-3 h-3 text-white/50" /> : <MapPin className="w-3 h-3 text-white/50" />}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-sm font-bold text-white truncate">{loc.city}</div>
                        <div className="text-xs text-white/40 truncate">{loc.country}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default TripBuilderWizard;
`;

fs.writeFileSync(originalFile, headerCode + '\n' + newWizardCode);
console.log("TripBuilderWizard successfully rewritten to be compact and lag-free!");
