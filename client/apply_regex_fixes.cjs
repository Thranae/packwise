const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');
const originalContent = content;

// Normalize line endings for replacement
content = content.replace(/\r\n/g, '\n');

// 1. Fix Trip Card iOS 26 Glass Effect
const oldOuterRegex = /<div className="relative p-\[1px\] rounded-\[32px\] overflow-hidden bg-gradient-to-br from-white\/40 via-white\/10 to-transparent shadow-\[0_32px_64px_rgba\(0,0,0,0\.4\),inset_0_2px_4px_rgba\(255,255,255,0\.2\)\] backdrop-blur-\[24px\]">/;
const newOuter = `<div className="relative p-[1.5px] rounded-[32px] bg-gradient-to-br from-white/50 via-white/10 to-black/20 shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_2px_10px_rgba(255,255,255,0.5),inset_0_-2px_10px_rgba(0,0,0,0.3)] backdrop-blur-[40px] transform-gpu preserve-3d overflow-hidden">
                        {/* iOS Noise Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                        {/* 3D Liquid Glare Sheen */}
                        <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/30 to-transparent opacity-60 rounded-t-[32px] z-0 pointer-events-none" />
                        {/* Vibrant Ambient Orbs */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-500/30 blur-[40px] rounded-full animate-pulse z-0" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/30 blur-[40px] rounded-full animate-pulse z-0" style={{ animationDelay: "1s" }} />`;

content = content.replace(oldOuterRegex, newOuter);

const oldInnerRegex = /<div className="bg-\[#030712\]\/40 backdrop-blur-3xl rounded-\[32px\] p-2 flex flex-col gap-2 relative overflow-hidden border border-white\/5">/;
const newInner = `<div className="bg-[#030712]/30 rounded-[31px] p-2.5 flex flex-col gap-3 relative z-10 overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">`;
content = content.replace(oldInnerRegex, newInner);

const oldImgWrapRegex = /<div className="w-full h-\[140px\] sm:h-\[160px\] rounded-\[28px\] overflow-hidden relative border border-white\/10 shadow-\[0_4px_20px_rgba\(0,0,0,0\.3\)\] shrink-0 group">/;
const newImgWrap = `<div className="w-full h-[150px] sm:h-[170px] rounded-[24px] overflow-hidden relative shadow-[inset_0_2px_15px_rgba(0,0,0,0.4),0_10px_30px_rgba(0,0,0,0.4)] shrink-0 group transform-gpu z-10 border border-white/10">`;
content = content.replace(oldImgWrapRegex, newImgWrap);

const oldBtnRegex = /<button className="w-full bg-white\/10 hover:bg-white\/20 active:bg-white\/30 border border-white\/10 backdrop-blur-md rounded-\[20px\] py-3\.5 px-4 text-white font-semibold flex justify-center items-center gap-2 transition-all duration-300 shadow-lg">/;
const newBtn = `<button className="w-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 border border-white/20 backdrop-blur-xl rounded-[20px] py-3.5 px-4 text-white font-semibold flex justify-center items-center gap-2 transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.2)] active:scale-[0.98] group relative overflow-hidden"><div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />`;
content = content.replace(oldBtnRegex, newBtn);


// 2. Replace the AI Prompt Bar with Dynamic Voice Waveform
const promptBarRegex = /\{\/\* Beautiful AI Prompt Bar \*\/\}[\s\S]*?<\/motion\.div>/;
const voiceWaveform = `{/* Dynamic Voice Waveform */}
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
content = content.replace(promptBarRegex, voiceWaveform);


// 3. Push elements slightly further down as requested ("push those elemnts and texts lil bit down ,just a lil bit is enough")
// We currently have pt-24 (96px). Let's increase to pt-32 (128px) for mobile.
content = content.replace(
    /className=\{\`relative z-10 w-full max-w-\[1440px\] mx-auto px-4 sm:px-8 lg:px-12 \$\{isAuthenticated \? "pt-24 sm:pt-28 lg:pt-32" : "pt-32 sm:pt-36 lg:pt-48"\}\`\}/,
    'className={`relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 ${isAuthenticated ? "pt-32 sm:pt-36 lg:pt-40" : "pt-32 sm:pt-36 lg:pt-48"}`}'
);

if (content !== originalContent.replace(/\r\n/g, '\n')) {
    fs.writeFileSync('src/pages/HomePage.jsx', content);
    console.log("Successfully applied regex replacements!");
} else {
    console.log("FAILED to modify content. Regex did not match.");
}
