import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Map, Plane, CloudSun, Luggage, DollarSign, BookOpen,
  Star, Globe, Shield, Zap, Sparkles, Moon, ArrowRight,
  Menu, X, CheckCircle2, PlayCircle, BarChart3, Clock,
  Smartphone, Compass, CreditCard, MapPin
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useTripContext } from '@/context/TripContext';
import { useDestinationImage } from '@/hooks/useDestinationImage';
import { ROUTES } from '@/constants/routes';
import { Logo } from '@/components/ui/Logo';
import { Image } from '@/components/ui/Image';
import { Navbar } from '@/components/navigation/Navbar';
import { BottomNav } from '@/components/layout/BottomNav';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';
import { GeneratingTripCard } from '@/components/trips/GeneratingTripCard';

// ---------------------------------------------------------------------------
const glassBase = "bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_16px_40px_rgba(0,0,0,0.4)]";
const glassRadius = "rounded-[32px]";
const glassHover = "transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] hover:-translate-y-2 hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2),0_24px_48px_rgba(0,0,0,0.5)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.15)] cursor-pointer";
const glassStyle = `${glassBase} ${glassRadius}`;
const glassPill = `${glassBase} rounded-full`;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const { addToast } = useToast();
  const { trips, currentTrip, isGeneratingTrip, generatingDestination, setCurrentTrip } = useTripContext();
  const navigate = useNavigate();
  const nextTrip = currentTrip || (trips && trips.length > 0 ? trips[0] : null);
  const { image: nextTripImage } = useDestinationImage(nextTrip?.destination);
  
  const tripDestination = nextTrip?.destination || 'Tokyo, Japan';
  const tripImage = nextTrip?.heroImage || nextTrip?.image || nextTripImage || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop';
  const tripCountry = nextTrip?.country || 'Japan';
  
  const daysUntil = nextTrip?.startDate 
      ? Math.max(0, Math.ceil((new Date(nextTrip.startDate) - new Date()) / (1000 * 60 * 60 * 24)))
      : 12;
  const startsText = nextTrip?.startDate ? `Starts in ${daysUntil} days` : 'Starts in 12 days';
  const tripDestCode = nextTrip?.destination ? (nextTrip.destination.length > 3 ? nextTrip.destination.substring(0,3).toUpperCase() : nextTrip.destination.toUpperCase()) : "HND";

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax Values
  const yBg = useTransform(scrollY, [0, 1000], [0, -150]);
  const floatY1 = useTransform(scrollY, [0, 1000], [0, -250]);
  const floatY2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const floatY3 = useTransform(scrollY, [0, 1000], [0, -350]);
  const floatY4 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <div className="bg-[#020617] min-h-screen text-white overflow-x-hidden font-sans selection:bg-white/20 selection:text-white transition-colors duration-700">
      
      <AnimatedBackground />

              {/* Native-feeling static frosted glass edges */}
        <div className="fixed top-0 left-0 right-0 h-[calc(10px+env(safe-area-inset-top))] z-[60] backdrop-blur-sm bg-gradient-to-b from-[#030712]/90 to-transparent pointer-events-none" />
        <div className="fixed bottom-0 left-0 right-0 h-[calc(10px+env(safe-area-inset-bottom))] z-[60] backdrop-blur-sm bg-gradient-to-t from-[#030712]/90 to-transparent pointer-events-none" />

        <Navbar />
        {isAuthenticated && <BottomNav />}

      {/* Main Layout Context */}
      <main className={`relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 ${isAuthenticated ? "pt-32 sm:pt-36 lg:pt-40" : "pt-32 sm:pt-36 lg:pt-48"}`}>
        
        {/* HERO SECTION */}
        <section className={`relative flex flex-col justify-start pb-10 lg:pb-20 ${isAuthenticated ? "mt-4 lg:mt-8" : "justify-center min-h-[70vh] lg:min-h-[90vh]"}`}>
          {isAuthenticated ? (
              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full mt-4 sm:mt-8">
              {/* Authenticated Dashboard: Left Side */}
              <motion.div variants={staggerContainer} initial="hidden" animate="show" className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left z-20 order-1">
                <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-[50px] font-semibold tracking-tighter leading-tight truncate w-full max-w-full text-[var(--theme-text-primary)]">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{user?.displayName?.split(' ')[0] || user?.name?.split(' ')[0] || 'Traveler'}</span>.
                </motion.h1>
                <motion.p variants={fadeInUp} className="mt-4 sm:mt-6 text-base sm:text-xl text-[var(--theme-text-secondary)] font-light max-w-lg">
                  Where is your next adventure taking you? Let our AI craft your perfect itinerary in seconds.
                </motion.p>
            
                {/* Dynamic Voice Waveform */}
                  <motion.div variants={fadeInUp} className="mt-8 relative group cursor-pointer">
                     <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-blue-500/20 blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                     <div onClick={(e) => { e.preventDefault(); addToast("AI Voice Assistant is coming in the next update!", "info"); }}>
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
                                    className={`w-1 rounded-full ${i % 2 === 0 ? 'bg-fuchsia-400' : 'bg-blue-400'} origin-center`}
                                    style={{ height: '100%' }}
                                 />
                              ))}
                           </div>
                           
                           {/* Text Prompt */}
                           <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">Tap to speak your adventure...</span>
                        </div>
                     </div>
                  </motion.div>
              </motion.div>

              {/* Authenticated Dashboard: Right Side Ticket Widget */}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="lg:col-span-6 w-full relative order-2 mt-4 sm:mt-6 lg:mt-0 flex items-center justify-center perspective-[1200px] px-2 sm:px-0">
                <motion.div 
                   animate={{ y: [-3, 3, -3] }} 
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                   className="w-full max-w-[85vw] sm:max-w-sm relative z-20"
                >
                   {/* Outer Liquid Glass Container */}
                   <div className="relative p-[1.5px] rounded-[32px] bg-gradient-to-br from-white/50 via-white/10 to-black/20 shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_2px_10px_rgba(255,255,255,0.5),inset_0_-2px_10px_rgba(0,0,0,0.3)] backdrop-blur-[40px] transform-gpu preserve-3d overflow-hidden">
                        {/* iOS Noise Texture Overlay */}
                        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                        
                        {/* 3D Liquid Glare Sheen */}
                        <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/30 to-transparent opacity-60 rounded-t-[32px] z-0 pointer-events-none" />
                        
                        {/* Vibrant Ambient Orbs */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-500/30 blur-[40px] rounded-full animate-pulse z-0" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/30 blur-[40px] rounded-full animate-pulse z-0" style={{ animationDelay: "1s" }} />
                      {/* Inner frosted content */}
                      {isGeneratingTrip ? (
                        <div className="bg-[#030712] rounded-[32px] overflow-hidden w-full h-[320px] sm:h-[400px]">
                          <GeneratingTripCard destination={generatingDestination} />
                        </div>
                    ) : nextTrip ? (
                      <div className="bg-[#030712]/30 rounded-[31px] p-2.5 flex flex-col gap-3 relative z-10 overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]">
                         {/* Beautiful subtle animated background glow */}
                         <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full animate-pulse" />
                         <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full animate-pulse" />
                         
                         {/* Hero Image Section */}
                         <div className="w-full h-[150px] sm:h-[170px] rounded-[24px] overflow-hidden relative shadow-[inset_0_2px_15px_rgba(0,0,0,0.4),0_10px_30px_rgba(0,0,0,0.4)] shrink-0 group transform-gpu z-10 border border-white/10">
                            <Image src={tripImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/90 via-black/20 to-transparent" />
                           <div className="absolute bottom-4 left-5">
                              <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 tracking-tight leading-none mb-1 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] truncate max-w-[200px]">{tripDestination}</h3>
                              <p className="text-[10px] sm:text-xs text-emerald-400 font-black tracking-widest uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{startsText}</p>
                           </div>
                            <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg">
                               <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                               </span>
                               <span className="text-[9px] uppercase font-bold text-white/90 tracking-wider">Upcoming</span>
                            </div>
                         </div>
                         
                         {/* Bottom Info Section */}
                         <div className="px-5 py-3 relative z-10">
                            <div className="flex justify-between items-center relative z-10">
                               <div className="text-left">
                                 <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">SFO</span>
                                 <p className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest mt-0.5 font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">Outbound</p>
                               </div>
                               
                               <div className="flex-1 flex items-center justify-center relative px-4">
                                 <div className="absolute w-full border-t-[1.5px] border-dashed border-white/20 top-1/2 -translate-y-1/2" />
                                 <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 relative z-10 bg-[#030712] px-1 rounded-full transform rotate-45" />
                               </div>
                               
                               <div className="text-right">
                                 <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/60 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{tripDestCode}</span>
                                 <p className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest mt-0.5 font-bold drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">Arrival</p>
                               </div>
                            </div>
                            
                            <div onClick={() => { setCurrentTrip(nextTrip); navigate(ROUTES.CALENDAR); }} className="relative z-10 mt-4 block cursor-pointer">
                              <button className="w-full py-3.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-white/10 rounded-2xl text-white text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] group hover:scale-[1.02] active:scale-[0.98]">
                                View Itinerary <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </button>
                            </div>
                         </div>
                      </div>
                    ) : (
                      <div className="bg-[#030712]/30 rounded-[31px] p-8 flex flex-col items-center justify-center relative z-10 overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] min-h-[320px] text-center border border-white/5">
                         <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 blur-[50px] rounded-full animate-pulse" />
                         <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 blur-[50px] rounded-full animate-pulse" />
                         
                         <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                            <Map className="w-8 h-8 text-white/60" />
                         </div>
                         
                         <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">Ready to explore?</h3>
                         <p className="text-xs sm:text-sm text-white/50 mb-8 max-w-[220px]">You don't have any upcoming trips. Let our AI build one for you in seconds.</p>
                         
                         <button onClick={() => navigate('/assistant')} className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 rounded-2xl text-white text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:scale-[1.02] active:scale-[0.98] border border-white/20">
                           Start Planning <ArrowRight className="w-4 h-4" />
                         </button>
                      </div>
                    )}
                   </div>
                </motion.div>
                
                {/* Decorative blur blobs behind ticket */}
</motion.div>

              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            
            {/* Hero Left Content */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left z-20 order-1"
            >
              <motion.div variants={fadeInUp} className={`${glassPill} inline-flex items-center gap-3 px-4 py-2 mb-4 lg:mb-8`}>
                <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="text-xs font-semibold tracking-wider text-[var(--theme-text-primary)] opacity-90 uppercase">Next Generation Planning</span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp} 
                animate={isScrolled ? "show" : "show"} // Keeps standard variants working
                whileTap={{ scale: 0.95 }}
                onDoubleClick={(e) => {
                  e.currentTarget.animate([
                    { transform: 'scale(1)', filter: 'hue-rotate(0deg)' },
                    { transform: 'scale(1.1) rotate(2deg)', filter: 'hue-rotate(90deg)' },
                    { transform: 'scale(0.9) rotate(-2deg)', filter: 'hue-rotate(180deg)' },
                    { transform: 'scale(1.05) rotate(1deg)', filter: 'hue-rotate(270deg)' },
                    { transform: 'scale(1)', filter: 'hue-rotate(360deg)' }
                  ], { duration: 600, easing: 'ease-in-out' });
                }}
                className="text-4xl sm:text-6xl lg:text-[88px] font-semibold tracking-tighter leading-[1.05] text-[var(--theme-text-primary)] cursor-pointer select-none"
              >
                Travel Smarter <br className="hidden lg:block" />
                with AI.
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="mt-4 sm:mt-8 text-base sm:text-xl lg:text-2xl text-[var(--theme-text-secondary)] max-w-xl font-light leading-relaxed">
                Design the perfect journey. Automate logistics, discover hidden gems, and experience seamless travel tailored exclusively to you.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="hidden lg:flex mt-8 sm:mt-12 flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                {isAuthenticated ? (
                  <>
                    <Link to={ROUTES.TRIPS} className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                        <Map className="w-5 h-5 text-emerald-400" />
                        My Trips
                      </button>
                    </Link>
                    <Link to={ROUTES.ASSISTANT} className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        AI Planner
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={ROUTES.SIGNUP} className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Start Exploring
                      </button>
                    </Link>
                    <a href="#features" className="w-full sm:w-auto">
                      <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                        <PlayCircle className="w-5 h-5 opacity-70" /> Explore Features
                      </button>
                    </a>
                  </>
                )}
              </motion.div>
            </motion.div>

            {/* Hero Right Visuals - 6 Floating Cards (Now visible on mobile/PWA) */}
            <div className="lg:col-span-6 relative h-[380px] sm:h-[550px] lg:h-[700px] w-full perspective-[1200px] z-10 mt-2 lg:mt-0 transform origin-center order-2">
              
              {/* Center Map / Main Art */}
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[5%] lg:top-[10%] left-[5%] w-[90%] h-[90%] lg:h-[75%] z-20">
                <div className="relative w-full h-full p-[1.5px] rounded-[32px] bg-gradient-to-br from-white/50 via-white/10 to-black/20 shadow-[0_40px_80px_rgba(0,0,0,0.6),inset_0_2px_10px_rgba(255,255,255,0.5),inset_0_-2px_10px_rgba(0,0,0,0.3)] backdrop-blur-[40px] transform-gpu preserve-3d overflow-hidden group hover:scale-[1.02] transition-transform duration-700 cursor-pointer">
                  {/* iOS Noise Texture Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
                  
                  {/* 3D Liquid Glare Sheen */}
                  <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/30 to-transparent opacity-60 rounded-t-[32px] z-0 pointer-events-none group-hover:h-[50%] transition-all duration-700" />
                  
                  {/* Vibrant Ambient Orbs */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-fuchsia-500/30 blur-[40px] rounded-full animate-pulse z-0" />
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cyan-500/30 blur-[40px] rounded-full animate-pulse z-0" style={{ animationDelay: "1s" }} />

                  {/* Inner frosted content */}
                  <div className="bg-[#030712]/30 rounded-[31px] p-2.5 flex flex-col gap-3 relative z-10 overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] w-full h-full">
                     {/* Beautiful subtle animated background glow */}
                     <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full animate-pulse group-hover:scale-125 transition-transform duration-700" />
                     <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 blur-[50px] rounded-full animate-pulse group-hover:scale-125 transition-transform duration-700" />
                     
                     {/* Hero Image Section */}
                     <div className="w-full h-[55%] md:h-[60%] rounded-[24px] overflow-hidden relative shadow-[inset_0_2px_15px_rgba(0,0,0,0.4),0_10px_30px_rgba(0,0,0,0.4)] shrink-0 transform-gpu z-10 border border-white/10">
                        <Image src={tripImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/90 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-5">
                           <h3 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/70 tracking-tight leading-none mb-1 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] truncate max-w-[200px] flex items-center gap-2">
                             <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" /> Voyage Genie
                           </h3>
                           <p className="text-[9px] sm:text-[10px] text-emerald-400 font-black tracking-widest uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">AI Travel Companion</p>
                        </div>
                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 shadow-lg">
                           <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                           </span>
                           <span className="text-[9px] uppercase font-bold text-white/90 tracking-wider">Active</span>
                        </div>
                     </div>
                     
                     {/* Bottom Info Section */}
                     <div className="px-3 sm:px-5 py-2 sm:py-3 relative z-10 flex-1 flex flex-col justify-center border-t border-white/5">
                        <p className="text-xs sm:text-sm text-white font-medium leading-relaxed text-center drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
                          Design the perfect journey. Voyage Genie instantly crafts hyper-personalized itineraries, automates logistics, and discovers hidden gems just for you.
                        </p>
                     </div>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Hero Mobile Buttons (Rendered below the visual) */}
            <motion.div variants={fadeInUp} className="lg:hidden flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto order-3 mt-4 z-20">
              {isAuthenticated ? (
                <>
                  <Link to={ROUTES.TRIPS} className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                      <Map className="w-5 h-5 text-emerald-400" />
                      My Trips
                    </button>
                  </Link>
                  <Link to={ROUTES.ASSISTANT} className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      AI Planner
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to={ROUTES.SIGNUP} className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Start Exploring
                    </button>
                  </Link>
                  <a href="#features" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto px-8 py-4 ios-liquid-button text-white font-semibold text-lg rounded-full flex items-center justify-center gap-2">
                      <PlayCircle className="w-5 h-5 opacity-70" /> Explore Features
                    </button>
                  </a>
                </>
              )}
            </motion.div>
          </div>
        
            )}
          </section>

        {!isAuthenticated && (
          <>
            {/* FEATURES */}
            <section id="features" className="py-16 lg:py-32 relative z-20">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-10 lg:mb-20 flex flex-col items-center"
          >
            <motion.div variants={fadeInUp} className="group cursor-pointer relative overflow-hidden px-5 py-2 text-sm font-bold text-blue-400 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(59,130,246,0.2)] rounded-full mb-6 inline-flex items-center justify-center hover:-translate-y-1 hover:scale-105 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.4),0_8px_16px_rgba(59,130,246,0.4)] hover:text-white transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-400/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                <Sparkles className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" /> Intelligent Tools
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-6xl font-semibold tracking-tighter">Everything you need.<br/>Nothing you don't.</motion.h2>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { icon: Compass, title: 'Smart Itineraries', desc: 'AI-generated timelines that adapt to your pace, preferences, and real-time conditions.', colorClass: 'text-blue-400 group-hover:drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]' },
              { icon: Luggage, title: 'Contextual Packing', desc: 'Generates packing lists based on destination weather, activities, and duration.', colorClass: 'text-orange-400 group-hover:drop-shadow-[0_0_12px_rgba(251,146,60,0.8)]' },
              { icon: BarChart3, title: 'Expense Tracking', desc: 'Monitor your budget in real-time with beautiful charts and multi-currency support.', colorClass: 'text-emerald-400 group-hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]' },
              { icon: Shield, title: 'Document Vault', desc: 'Securely store passports, visas, and tickets locally with military-grade encryption.', colorClass: 'text-red-400 group-hover:drop-shadow-[0_0_12px_rgba(248,113,113,0.8)]' },
              { icon: Globe, title: 'Offline Mode', desc: 'Access your entire trip timeline and maps without an active internet connection.', colorClass: 'text-indigo-400 group-hover:drop-shadow-[0_0_12px_rgba(129,140,248,0.8)]' },
              { icon: Zap, title: 'Instant Sync', desc: 'Changes made on any device instantly reflect everywhere. Collaboration made easy.', colorClass: 'text-yellow-400 group-hover:drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={scaleIn}
                className={`${glassStyle} ${glassHover} p-8 group`}
              >
                <div 
                  className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/20 to-white/5 border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.4),0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-[inset_0_2px_6px_rgba(255,255,255,0.5),inset_0_-2px_6px_rgba(0,0,0,0.5),0_16px_32px_rgba(0,0,0,0.6)] transition-all duration-700 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  <feature.icon className={`h-8 w-8 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-700 group-hover:scale-110 ${feature.colorClass}`} />
                </div>
                <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                <p className="text-base text-[var(--theme-text-secondary)] font-light leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-16 lg:py-32">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center"
          >
            <div>
              <motion.div variants={fadeInUp} className={`${glassPill} px-4 py-2 text-sm text-purple-500 dark:text-purple-400 font-medium mb-6 inline-block bg-purple-500/5`}>
                Workflow
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 leading-tight tracking-tight">
                From idea to reality in seconds.
              </motion.h2>
              <div className="space-y-8 md:space-y-10 mt-8 md:mt-12">
                {[
                  { step: '1', title: 'Define your vision', desc: 'Tell us where, when, and how you want to travel. Set your budget and style.' },
                  { step: '2', title: 'AI Generation', desc: 'Our neural engine crafts a complete, optimized itinerary instantly.' },
                  { step: '3', title: 'Customize & Execute', desc: 'Tweak details, invite friends, and enjoy a flawless trip experience.' },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    variants={fadeInUp}
                    className="flex gap-6 group"
                  >
                    <div className="relative overflow-hidden flex-shrink-0 text-lg font-bold text-white bg-gradient-to-br from-white/20 to-white/5 border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.4),0_8px_16px_rgba(0,0,0,0.5)] h-12 w-12 flex items-center justify-center rounded-full group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-700 z-10">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10">{item.step}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-[var(--theme-text-secondary)] font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div 
              variants={scaleIn} 
              whileHover={{ rotateY: -4, rotateX: 4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`${glassStyle} h-[350px] lg:h-[600px] w-full relative overflow-hidden flex flex-col shadow-[0_32px_64px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)] group [transform-style:preserve-3d] [perspective:1200px] bg-black`}
            >
              {/* Dynamic Animated Background Image */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }} 
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=2070&auto=format&fit=crop" 
                  alt="Tokyo Cityscape Landscape" 
                  className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 opacity-90 saturate-150"
                />
              </motion.div>

              {/* 3D Noise Texture, Vignette & Color Gradients */}
              <div className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-overlay z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
              
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20 mix-blend-overlay pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-1000 z-0" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020617]/90 to-transparent pointer-events-none z-0" />
              
              {/* Scanning Laser Line Animation */}
              <motion.div 
                className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(96,165,250,0.8)] z-10 opacity-0 group-hover:opacity-100"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              {/* 3D Floating Interactive Elements */}
              <motion.div 
                className="absolute top-[15%] left-[5%] sm:left-[10%] z-20 [transform:translateZ(40px)]"
                animate={{ y: [0, -15, 0], rotateZ: [0, 3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className={`${glassStyle} p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-[0_24px_48px_rgba(0,0,0,0.6)] backdrop-blur-3xl border-white/30 bg-white/10 group-hover:[transform:translateZ(60px)] transition-transform duration-700`}>
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/30 flex items-center justify-center border border-blue-400/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_0_15px_rgba(59,130,246,0.6)] overflow-hidden">
                    <div className="absolute inset-0 bg-blue-400/20 animate-ping opacity-50" />
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] relative z-10" />
                  </div>
                  <div className="flex flex-col pr-2">
                    <span className="text-xs sm:text-sm font-extrabold text-white drop-shadow-lg tracking-wide">AI Synthesizing</span>
                    <span className="text-[10px] sm:text-xs text-blue-200 font-semibold tracking-wider">Processing 1M+ data points</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute bottom-[25%] right-[5%] sm:right-[10%] z-20 [transform:translateZ(60px)]"
                animate={{ y: [0, 15, 0], rotateZ: [0, -3, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className={`${glassStyle} p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-[0_24px_48px_rgba(0,0,0,0.6)] backdrop-blur-3xl border-white/30 bg-white/10 group-hover:[transform:translateZ(90px)] transition-transform duration-700`}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-emerald-500/30 flex items-center justify-center border border-emerald-400/50 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_0_15px_rgba(16,185,129,0.6)]">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                  </div>
                  <div className="flex flex-col pr-2">
                    <span className="text-xs sm:text-sm font-extrabold text-white drop-shadow-lg tracking-wide">Route Optimized</span>
                    <span className="text-[10px] sm:text-xs text-emerald-200 font-semibold tracking-wider">Saved 45 mins of travel</span>
                  </div>
                </div>
              </motion.div>
              
              {/* 3D Central Globe Element */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 [transform:translateZ(80px)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border border-white/20 border-dashed flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur-[2px]">
                   <Globe className="w-12 h-12 sm:w-16 sm:h-16 text-white/40" />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* WHY PACKWISE */}
        <section id="why-us" className="py-16 lg:py-32">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={scaleIn}
            className={`${glassStyle} p-8 md:p-20 relative overflow-hidden flex flex-col items-center text-center shadow-2xl shadow-blue-500/5`}
          >
            <div className="absolute top-[-50%] left-[-10%] w-[1000px] h-[1000px] rounded-full bg-blue-500/5 dark:bg-white/5 blur-[120px] pointer-events-none" />
            
            <Logo size="md" className="mb-6 md:mb-10" />
            
            <h2 className="text-2xl md:text-5xl font-bold max-w-3xl leading-tight mb-4 md:mb-8">
              We believe travel software should be as beautiful as the destinations you visit.
            </h2>
            <p className="text-base md:text-xl text-[var(--theme-text-secondary)] max-w-2xl font-light mb-8 md:mb-12">
              Voyage Genie isn't just a utility. It's a premium ecosystem designed to remove the friction from exploration, built for the modern traveler.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--theme-border-subtle)] text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-green-500 transition-all duration-700 group-hover:text-green-400 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" /> Ad-free Forever
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--theme-border-subtle)] text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-green-500 transition-all duration-700 group-hover:text-green-400 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" /> Privacy First
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-[var(--theme-border-subtle)] text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-green-500 transition-all duration-700 group-hover:text-green-400 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" /> Premium Design
              </div>
            </div>
          </motion.div>
        </section>

        {/* STATISTICS */}
        <section className="py-12 lg:py-20 border-y border-[var(--theme-border-subtle)]">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center"
          >
            {[
              { value: '4.9', label: 'App Store Rating' },
              { value: '2M+', label: 'Trips Generated' },
              { value: '150+', label: 'Countries Covered' },
              { value: '0', label: 'Data Sold' }
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-semibold tracking-tighterer mb-2">{stat.value}</span>
                <span className="text-sm text-[var(--theme-text-secondary)] font-medium uppercase tracking-wider">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="py-16 lg:py-32">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold">Loved by professionals.</motion.h2>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { name: 'Elena R.', role: 'Creative Director', quote: 'The interface is stunning. It feels like Apple built a travel app. Voyage Genie anticipates my needs before I even realize them.' },
              { name: 'Marcus T.', role: 'Nomad Entrepreneur', quote: 'I live on the road. The offline capability and budget tracking are flawless. This app replaced four others on my home screen.' },
              { name: 'Sophia L.', role: 'Travel Photographer', quote: 'Visually impeccable and incredibly powerful under the hood. The spatial itinerary view is a game-changer for planning shoots.' }
            ].map((t, i) => (
              <motion.div key={i} variants={scaleIn} className={`${glassStyle} ${glassHover} p-8 flex flex-col h-full`}>
                <div className="flex gap-1 mb-6 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg text-[var(--theme-text-primary)] opacity-90 font-light leading-relaxed mb-8 flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="relative overflow-hidden w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.4),0_8px_16px_rgba(0,0,0,0.5)]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-[var(--theme-text-secondary)]">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="pt-12 lg:pt-20 pb-10 border-t border-[var(--theme-border-subtle)] mt-6 lg:mt-10">
          <div className="grid md:grid-cols-4 gap-8 lg:gap-12 mb-10 lg:mb-16">
            <div className="md:col-span-2">
              <Logo size="md" className="mb-6" />
              <p className="text-[var(--theme-text-secondary)] text-sm max-w-sm font-light leading-relaxed">
                Voyage Genie AI is the premium travel companion. Intelligent planning, beautiful design, and absolute privacy.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-[var(--theme-text-secondary)] hover:text-[var(--color-accent)] transition-colors text-sm">Features</a></li>
                <li><a href="#how-it-works" className="text-[var(--theme-text-secondary)] hover:text-[var(--color-accent)] transition-colors text-sm">Workflow</a></li>
                <li><a href="#" className="text-[var(--theme-text-secondary)] hover:text-[var(--color-accent)] transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-[var(--theme-text-secondary)] hover:text-[var(--color-accent)] transition-colors text-sm">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[var(--theme-text-secondary)] hover:text-[var(--color-accent)] transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-[var(--theme-text-secondary)] hover:text-[var(--color-accent)] transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-[var(--theme-text-secondary)] hover:text-[var(--color-accent)] transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-[var(--theme-text-secondary)] hover:text-[var(--color-accent)] transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-[var(--theme-border-subtle)] gap-4">
            <p className="text-sm text-[var(--theme-text-secondary)] font-light">
              © {new Date().getFullYear()} Voyage Genie AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs font-semibold tracking-widest text-[var(--theme-text-secondary)] opacity-70 uppercase">Designed in Tamilnadu</span>
            </div>
          </div>
        </footer>
          </>
        )}

      </main>
    </div>
  );
}




