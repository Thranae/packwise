const fs = require('fs');
const content = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

const replacement = 
        {/* HERO SECTION */}
        <section className="relative min-h-[70vh] lg:min-h-[90vh] flex flex-col justify-center pb-10 lg:pb-20">
          {isAuthenticated ? (
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full mt-10">
              {/* Authenticated Dashboard: Left Side */}
              <motion.div variants={staggerContainer} initial="hidden" animate="show" className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left z-20 order-1">
                <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl lg:text-[72px] font-semibold tracking-tighter leading-[1.05] text-[var(--theme-text-primary)]">
                  Welcome back, <br className="hidden lg:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.name?.split(' ')[0] || 'Traveler'}</span>.
                </motion.h1>
                <motion.p variants={fadeInUp} className="mt-4 sm:mt-6 text-base sm:text-xl text-[var(--theme-text-secondary)] font-light max-w-lg">
                  Where is your next adventure taking you? Let our AI craft your perfect itinerary in seconds.
                </motion.p>
            
                {/* Beautiful AI Prompt Bar */}
                <motion.div variants={fadeInUp} className="mt-8 w-full max-w-md relative group">
                   <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-xl opacity-50 group-hover:opacity-100 transition-opacity rounded-full"></div>
                   <Link to={ROUTES.ASSISTANT}>
                     <div className="relative flex items-center bg-white/5 backdrop-blur-md border border-white/20 rounded-full p-2 pl-6 shadow-2xl hover:bg-white/10 transition-colors">
                        <Sparkles className="w-5 h-5 text-purple-400 mr-3 animate-pulse" />
                        <span className="flex-1 text-white/50 text-left text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis pr-4">E.g., 5 days in Tokyo for cherry blossoms...</span>
                        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full shadow-lg group-hover:scale-105 transition-transform">
                           <ArrowRight className="w-5 h-5" />
                        </button>
                     </div>
                   </Link>
                </motion.div>
            
                {/* Quick Links Row */}
                <motion.div variants={fadeInUp} className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8">
                  <Link to={ROUTES.TRIPS} className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10">
                    <Map className="w-4 h-4 text-emerald-400" /> My Trips
                  </Link>
                  <Link to={ROUTES.EXPLORE} className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10">
                    <Compass className="w-4 h-4 text-blue-400" /> Discover
                  </Link>
                </motion.div>
              </motion.div>

              {/* Authenticated Dashboard: Right Side Ticket Widget */}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="lg:col-span-6 w-full relative h-[350px] sm:h-[450px] order-2 mt-8 lg:mt-0 flex items-center justify-center perspective-[1200px]">
                <motion.div 
                   animate={{ y: [-10, 10, -10] }} 
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="w-full max-w-sm relative z-20 rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 hover:scale-105 transition-all duration-700"
                >
                   <div className="\ overflow-hidden rounded-[32px] p-0 shadow-2xl group border-white/20">
                      <div className="h-40 relative overflow-hidden">
                         <Image src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                         <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                           Upcoming
                         </div>
                         <div className="absolute bottom-4 left-6 text-white">
                            <h3 className="text-2xl font-bold tracking-tight mb-1">Tokyo, Japan</h3>
                            <p className="text-sm text-white/80 font-medium">Starts in 12 days</p>
                         </div>
                      </div>
                      
                      <div className="p-6 bg-gradient-to-b from-[#0B101E] to-[#0B101E]/90">
                         <div className="flex justify-between items-center mb-6">
                            <div className="flex flex-col">
                              <span className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Outbound</span>
                              <span className="text-xl font-bold text-white">SFO</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center px-4 relative">
                              <Plane className="w-5 h-5 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-[#0B101E] px-1" />
                              <div className="w-full border-t-2 border-dashed border-white/20"></div>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Arrival</span>
                              <span className="text-xl font-bold text-white">HND</span>
                            </div>
                         </div>
            
                         <Link to={ROUTES.TRIPS}>
                           <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-colors flex items-center justify-center gap-2">
                             <Luggage className="w-4 h-4 text-emerald-400" /> Open Itinerary
                           </button>
                         </Link>
                      </div>
                   </div>
                </motion.div>
                
                {/* Decorative blur blobs behind ticket */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-purple-500/20 blur-[80px] sm:blur-[100px] rounded-full z-0"></div>
                <div className="absolute top-1/2 left-1/2 w-32 sm:w-48 h-32 sm:h-48 bg-emerald-500/20 blur-[60px] sm:blur-[80px] rounded-full z-0"></div>
              </motion.div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              {/* ORIGINAL LOGGED-OUT HERO LEFT CONTENT */}
              <motion.div variants={staggerContainer} initial="hidden" animate="show" className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left z-20 order-1">
                <motion.div variants={fadeInUp} className="\ inline-flex items-center gap-3 px-4 py-2 mb-4 lg:mb-8">
                  <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                  <span className="text-xs font-semibold tracking-wider text-[var(--theme-text-primary)] opacity-90 uppercase">Next Generation Planning</span>
                </motion.div>
                
                <motion.h1 
                  variants={fadeInUp} 
                  animate={isScrolled ? "show" : "show"}
                  whileTap={{ scale: 0.95 }}
                  className="text-4xl sm:text-6xl lg:text-[88px] font-semibold tracking-tighter leading-[1.05] text-[var(--theme-text-primary)] cursor-pointer select-none"
                >
                  Travel Smarter <br className="hidden lg:block" />
                  with AI.
                </motion.h1>
                
                <motion.p variants={fadeInUp} className="mt-4 sm:mt-8 text-base sm:text-xl lg:text-2xl text-[var(--theme-text-secondary)] max-w-xl font-light leading-relaxed">
                  Design the perfect journey. Automate logistics, discover hidden gems, and experience seamless travel tailored exclusively to you.
                </motion.p>
                
                <motion.div variants={fadeInUp} className="hidden lg:flex mt-8 sm:mt-12 flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <Link to={ROUTES.SIGNUP} className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                      <MapPin className="w-5 h-5" /> Start Exploring
                    </button>
                  </Link>
                  <a href="#features" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                      <PlayCircle className="w-5 h-5 opacity-70" /> Explore Features
                    </button>
                  </a>
                </motion.div>
              </motion.div>

              {/* ORIGINAL LOGGED-OUT HERO RIGHT VISUALS */}
              <div className="lg:col-span-6 relative h-[380px] sm:h-[550px] lg:h-[700px] w-full perspective-[1200px] z-10 mt-2 lg:mt-0 transform origin-center order-2">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[5%] lg:top-[10%] left-[5%] w-[90%] h-[90%] lg:h-[75%] z-20">
                  <div className="\ w-full h-full p-2 flex items-center justify-center relative overflow-hidden group">
                    <Image 
                      src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop" 
                      alt="Kyoto, Japan" 
                      className="absolute inset-0 w-full h-full object-cover rounded-[16px] transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-[16px]" />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10 text-white">
                      <div>
                        <div className="text-sm font-medium text-white/80 mb-1">Current Itinerary</div>
                        <div className="text-2xl font-bold">Kyoto, Japan</div>
                      </div>
                      <div className="px-4 py-2 text-xs font-bold text-white bg-white/20 backdrop-blur-md rounded-full border border-white/20">Active</div>
                    </div>
                  </div>
                </motion.div>
  
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-[5%] left-[-5%] z-30 hidden lg:block">
                  <div className="\ p-4 flex items-center gap-4 rotate-y-[15deg] rotate-z-[-5deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default shadow-xl">
                    <div className="group cursor-pointer relative overflow-hidden w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/40 to-indigo-500/10 border border-indigo-500/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.4),0_8px_16px_rgba(0,0,0,0.5)] flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      <BookOpen className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-700 group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_12px_rgba(129,140,248,0.8)] group-hover:scale-110" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--theme-text-secondary)]">Docs</div>
                      <div className="text-sm font-bold">Passport Ready</div>
                    </div>
                  </div>
                </motion.div>
  
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[10%] right-[0%] z-30">
                  <div className="\ p-5 flex flex-col gap-2 rotate-y-[-20deg] rotate-z-[5deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default shadow-xl">
                    <div className="flex items-center justify-between">
                      <CloudSun className="w-8 h-8 text-yellow-500" />
                      <span className="text-2xl font-bold">24°</span>
                    </div>
                    <div className="text-xs text-[var(--theme-text-secondary)] font-medium">Sunny • Kyoto</div>
                  </div>
                </motion.div>
  
                <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="absolute bottom-[2%] lg:bottom-[25%] left-[-2%] lg:left-[-10%] z-40">
                  <div className="\ p-5 rotate-y-[10deg] rotate-z-[2deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default min-w-[200px] shadow-xl">
                    <div className="flex justify-between items-center mb-3">
                      <Plane className="w-5 h-5 text-blue-500" />
                      <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">On Time</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="font-bold text-lg">SFO</div>
                      <div className="h-[2px] flex-1 bg-black/10 dark:bg-white/20 mx-2 mb-2 relative"><div className="absolute top-0 left-0 h-full bg-blue-500 w-1/2" /></div>
                      <div className="font-bold text-lg">KIX</div>
                    </div>
                  </div>
                </motion.div>
  
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-[5%] left-[20%] z-30 hidden lg:block">
                  <div className="\ p-4 flex items-center gap-3 rotate-y-[5deg] rotate-z-[-2deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default shadow-xl">
                    <div className="group cursor-pointer relative overflow-hidden w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/40 to-orange-500/10 border border-orange-500/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.4),0_8px_16px_rgba(0,0,0,0.5)] flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      <Luggage className="w-5 h-5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-700 group-hover:text-orange-400 group-hover:drop-shadow-[0_0_12px_rgba(251,146,60,0.8)] group-hover:scale-110" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--theme-text-secondary)]">Packing</div>
                      <div className="text-sm font-bold">42 / 50 Items</div>
                    </div>
                  </div>
                </motion.div>
  
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute bottom-[10%] right-[5%] z-40">
                  <div className="\ p-5 flex flex-col gap-1 rotate-y-[-15deg] rotate-z-[4deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="group cursor-pointer relative overflow-hidden w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/40 to-emerald-500/10 border border-emerald-500/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.5)] flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-700 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] group-hover:scale-110" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--theme-text-primary)]">Budget</span>
                    </div>
                    <div className="text-2xl font-bold">₹4,250</div>
                    <div className="text-xs text-[var(--theme-text-secondary)]">of ₹5,000 total</div>
                  </div>
                </motion.div>
  
                <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[40%] right-[-5%] z-30 hidden lg:block">
                  <div className="\ p-4 flex items-center gap-4 rotate-y-[-10deg] rotate-z-[-6deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default shadow-xl">
                    <div className="group cursor-pointer relative overflow-hidden w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/40 to-purple-500/10 border border-purple-500/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.4),0_8px_16px_rgba(0,0,0,0.5)] flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      <Map className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-700 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_12px_rgba(192,132,252,0.8)] group-hover:scale-110" />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--theme-text-secondary)]">Next Stop</div>
                      <div className="text-sm font-bold">Fushimi Inari</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* LOGGED-OUT MOBILE BUTTONS */}
              <motion.div variants={fadeInUp} className="lg:hidden flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto order-3 mt-4 z-20">
                <Link to={ROUTES.SIGNUP} className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                    <MapPin className="w-5 h-5" /> Start Exploring
                  </button>
                </Link>
                <a href="#features" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                    <PlayCircle className="w-5 h-5 opacity-70" /> Explore Features
                  </button>
                </a>
              </motion.div>
            </div>
          )}
        </section>
;

const startIndex = content.indexOf('        {/* HERO SECTION */}');
const endIndex = content.indexOf('        {/* FEATURES */}');
if (startIndex !== -1 && endIndex !== -1) {
  const newContent = content.substring(0, startIndex) + replacement.trimStart() + "\n" + content.substring(endIndex);
  fs.writeFileSync('src/pages/HomePage.jsx', newContent);
  console.log("Replaced successfully");
} else {
  console.log("Could not find boundaries");
}
