const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// 1. Move elements up by reducing padding
content = content.replace(
    'className={`relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 ${isAuthenticated ? "pt-20 sm:pt-24 lg:pt-32" : "pt-32 sm:pt-36 lg:pt-48"}`}',
    'className={`relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 ${isAuthenticated ? "pt-10 sm:pt-20 lg:pt-32" : "pt-32 sm:pt-36 lg:pt-48"}`}'
);

// 2. Reduce min-height slightly so it doesn't push down
content = content.replace(
    'className={`relative flex flex-col justify-center pb-10 lg:pb-20 ${isAuthenticated ? "min-h-[calc(100vh-140px)] mt-4 lg:mt-8" : "min-h-[70vh] lg:min-h-[90vh]"}`}',
    'className={`relative flex flex-col justify-start pb-10 lg:pb-20 ${isAuthenticated ? "mt-4 lg:mt-8" : "justify-center min-h-[70vh] lg:min-h-[90vh]"}`}'
);

// 3. Replace AI prompt bar with a button
const oldBar = `{/* Beautiful AI Prompt Bar */}
                  <motion.div variants={fadeInUp} className="mt-6 w-full max-w-[85vw] sm:max-w-md relative group">
                     <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-xl opacity-50 group-hover:opacity-100 transition-opacity rounded-full"></div>
                     <Link to={ROUTES.ASSISTANT}>
                       <div className="relative flex items-center bg-white/5 backdrop-blur-md border border-white/20 rounded-full p-2 pl-6 shadow-2xl hover:bg-white/10 transition-colors">
                          <Sparkles className="w-5 h-5 text-purple-400 mr-3 animate-pulse" />
                          <span className="flex-1 min-w-0 text-white/50 text-left text-sm sm:text-base whitespace-nowrap overflow-hidden text-ellipsis pr-4">E.g., 5 days in Tokyo for cherry blossoms...</span>
                          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-full shadow-lg group-hover:scale-105 transition-transform">
                             <ArrowRight className="w-5 h-5" />
                          </button>
                       </div>
                     </Link>
                  </motion.div>`;

const newBtn = `{/* Create New Trip Button */}
                  <motion.div variants={fadeInUp} className="mt-8">
                     <Link to={ROUTES.ASSISTANT}>
                        <button className="relative overflow-hidden group bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2">
                           <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
                           <Sparkles className="w-5 h-5 relative z-10" />
                           <span className="relative z-10 text-sm sm:text-base tracking-wide">Design New Itinerary</span>
                        </button>
                     </Link>
                  </motion.div>`;

content = content.replace(oldBar, newBtn);

fs.writeFileSync('src/pages/HomePage.jsx', content);
console.log("Updated alignments and button.");
