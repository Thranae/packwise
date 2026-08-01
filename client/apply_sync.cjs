const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// 1. Add missing imports
if (!content.includes('useTripContext')) {
    content = content.replace(
        "import { useAuth } from '@/hooks/useAuth';",
        "import { useAuth } from '@/hooks/useAuth';\nimport { useTripContext } from '@/context/TripContext';\nimport { useDestinationImage } from '@/hooks/useDestinationImage';"
    );
}

// 2. Add hooks to component
const hookStr = 'const { isAuthenticated, user } = useAuth();';
if (content.includes(hookStr) && !content.includes('const { trips, isGenerating } = useTripContext();')) {
    const tripLogic = `
  const { trips, isGenerating } = useTripContext();
  const nextTrip = trips && trips.length > 0 ? trips[0] : null;
  const { imageUrl: nextTripImage } = useDestinationImage(nextTrip?.destination);
  
  const tripDestination = nextTrip?.destination || 'Tokyo, Japan';
  const tripImage = nextTripImage || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop';
  const tripCountry = nextTrip?.country || 'Japan';
  
  const daysUntil = nextTrip?.startDate 
      ? Math.max(0, Math.ceil((new Date(nextTrip.startDate) - new Date()) / (1000 * 60 * 60 * 24)))
      : 12;
  const startsText = nextTrip?.startDate ? \`Starts in \${daysUntil} days\` : 'Starts in 12 days';
  const tripDestCode = nextTrip?.destination ? (nextTrip.destination.length > 3 ? nextTrip.destination.substring(0,3).toUpperCase() : nextTrip.destination.toUpperCase()) : "HND";
`;
    content = content.replace(hookStr, hookStr + tripLogic);
}

// 3. Fix welcome message to be single line, smaller, and truncate
const welcomeOld = `Welcome back, <br className="hidden lg:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Traveler'}</span>.`;
const welcomeNew = `Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Traveler'}</span>.`;
content = content.replace(welcomeOld, welcomeNew);

// Resize text-4xl sm:text-5xl lg:text-[60px] to text-3xl sm:text-4xl lg:text-[50px]
content = content.replace(
    'className="text-4xl sm:text-5xl lg:text-[60px] font-semibold tracking-tighter leading-tight break-words max-w-full text-[var(--theme-text-primary)]"',
    'className="text-3xl sm:text-4xl lg:text-[50px] font-semibold tracking-tighter leading-tight truncate w-full max-w-full text-[var(--theme-text-primary)]"'
);


// 4. Update Trip Card dynamically and handle isGenerating
const ticketInnerStart = '<div className="bg-[#030712]/40 backdrop-blur-3xl rounded-[32px] p-2 flex flex-col gap-2 relative overflow-hidden border border-white/5">';
const ticketInnerEndStr = '</button>\n                            </Link>\n                         </div>\n                      </div>';
const startIdx = content.indexOf(ticketInnerStart);
const endIdx = content.indexOf(ticketInnerEndStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const fullEnd = endIdx + ticketInnerEndStr.length;
    
    // Replace hardcoded values in the extracted string
    let cardContent = content.substring(startIdx, fullEnd);
    
    cardContent = cardContent.replace(
        'src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop"',
        'src={tripImage}'
    );
    cardContent = cardContent.replace(
        '<h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none mb-1 drop-shadow-md">Tokyo, Japan</h3>',
        '<h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-none mb-1 drop-shadow-md truncate max-w-[200px]">{tripDestination}</h3>'
    );
    cardContent = cardContent.replace(
        '<p className="text-[10px] sm:text-xs text-emerald-400 font-bold tracking-widest uppercase drop-shadow-md">Starts in 12 days</p>',
        '<p className="text-[10px] sm:text-xs text-emerald-400 font-bold tracking-widest uppercase drop-shadow-md">{startsText}</p>'
    );
    
    // Also, we want to replace HND with {tripDestCode}
    cardContent = cardContent.replace(
        '<span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">HND</span>',
        '<span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">{tripDestCode}</span>'
    );
    
    // Wrap with isGenerating
    const newCardLogic = `{isGenerating ? (
                      <div className="bg-[#030712]/40 backdrop-blur-3xl rounded-[32px] p-8 flex flex-col items-center justify-center relative overflow-hidden border border-white/5 min-h-[320px]">
                         <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full animate-pulse" />
                         <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full animate-pulse" />
                         
                         {/* Modern AI Generating Animation */}
                         <div className="relative w-24 h-24 mb-6">
                             <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-purple-500 animate-spin" style={{ animationDuration: '2s' }} />
                             <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-blue-400 animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <Sparkles className="w-8 h-8 text-white animate-pulse" />
                             </div>
                         </div>
                         
                         <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 text-center">Crafting Journey...</h3>
                         <p className="text-xs sm:text-sm text-white/50 text-center max-w-[200px]">Our AI is analyzing millions of data points to build your perfect itinerary.</p>
                      </div>
                    ) : (
                      ${cardContent}
                    )}`;
                    
    content = content.substring(0, startIdx) + newCardLogic + content.substring(fullEnd);
}

fs.writeFileSync('src/pages/HomePage.jsx', content);
console.log("HomePage trip sync and generating logic added.");
