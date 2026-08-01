const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

const oldBtn = `{/* Create New Trip Button */}
                  <motion.div variants={fadeInUp} className="mt-8">
                     <Link to={ROUTES.ASSISTANT}>
                        <button className="relative overflow-hidden group bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
                           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
                           <Sparkles className="w-5 h-5 relative z-10" />
                           <span className="relative z-10 text-sm sm:text-base tracking-wide">Design New Itinerary</span>
                        </button>
                     </Link>
                  </motion.div>`;

const newBtn = `{/* Dynamic Voice Waveform */}
                  <motion.div variants={fadeInUp} className="mt-8 relative group cursor-pointer">
                     <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-blue-500/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                     <Link to={ROUTES.ASSISTANT}>
                        <div className="relative flex items-center bg-[#030712]/40 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-4 pr-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_20px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:bg-[#030712]/60 group-hover:border-white/20">
                           {/* Mic Icon */}
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] relative overflow-hidden shrink-0 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] transition-shadow">
                              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white relative z-10"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
                           </div>
                           
                           {/* Animated Waveform */}
                           <div className="flex items-center gap-1 mx-4 h-6">
                              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                 <motion.div 
                                    key={i}
                                    animate={{ scaleY: [0.3, 1, 0.3] }}
                                    transition={{ duration: 1 + (i % 3) * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                                    className={\`w-1 rounded-full \${i % 2 === 0 ? 'bg-fuchsia-400' : 'bg-blue-400'} origin-center\`}
                                    style={{ height: '100%' }}
                                 />
                              ))}
                           </div>
                           
                           {/* Text Prompt */}
                           <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">Tap to speak your adventure...</span>
                        </div>
                     </Link>
                  </motion.div>`;

content = content.replace(oldBtn, newBtn);

fs.writeFileSync('src/pages/HomePage.jsx', content);
console.log("Added Dynamic Voice Waveform component.");
