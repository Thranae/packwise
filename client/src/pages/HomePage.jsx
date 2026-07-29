import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Map, Plane, CloudSun, Luggage, DollarSign, BookOpen,
  Star, Globe, Shield, Zap, Sparkles, Moon, ArrowRight,
  Menu, X, CheckCircle2, PlayCircle, BarChart3, Clock,
  Smartphone, Compass, CreditCard, MapPin
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Logo } from '@/components/ui/Logo';
import { Image } from '@/components/ui/Image';
import { Navbar } from '@/components/navigation/Navbar';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';

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
  const { isAuthenticated } = useAuth();
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
    <div className="bg-[#020617] min-h-screen text-white overflow-hidden font-sans selection:bg-white/20 selection:text-white transition-colors duration-700">
      
      <AnimatedBackground />

      <Navbar />

      {/* Main Layout Context */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-36 lg:pt-40">
        
        {/* HERO SECTION */}
        <section className="relative min-h-[70vh] lg:min-h-[90vh] flex flex-col justify-center pb-10 lg:pb-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-left z-20 order-1"
            >
              <motion.div variants={fadeInUp} className={`${glassPill} inline-flex items-center gap-3 px-4 py-2 mb-8`}>
                <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="text-xs font-semibold tracking-wider text-[var(--theme-text-primary)] opacity-90 uppercase">Next Generation Planning</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl lg:text-[88px] font-semibold tracking-tighter leading-[1.05] text-[var(--theme-text-primary)]">
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
            <div className="lg:col-span-6 relative h-[450px] sm:h-[550px] lg:h-[700px] w-full perspective-[1200px] z-10 mt-12 lg:mt-0 transform scale-90 sm:scale-100 lg:scale-100 origin-center order-2">
              
              {/* Center Map / Main Art */}
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] left-[5%] w-[90%] h-[75%] z-20">
                <div className={`${glassStyle} w-full h-full p-2 flex items-center justify-center relative overflow-hidden group`}>
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
                    <div className="px-4 py-2 text-xs font-bold text-white bg-white/20 backdrop-blur-md rounded-full border border-white/20">
                      Active
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 1. Passport (Hidden on mobile to reduce clutter) */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute top-[5%] left-[-5%] z-30 hidden lg:block">
                <div className={`${glassStyle} p-4 flex items-center gap-4 rotate-y-[15deg] rotate-z-[-5deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default shadow-xl`}>
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

              {/* 2. Weather */}
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[10%] right-[0%] z-30">
                <div className={`${glassStyle} p-5 flex flex-col gap-2 rotate-y-[-20deg] rotate-z-[5deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default shadow-xl`}>
                  <div className="flex items-center justify-between">
                    <CloudSun className="w-8 h-8 text-yellow-500" />
                    <span className="text-2xl font-bold">24°</span>
                  </div>
                  <div className="text-xs text-[var(--theme-text-secondary)] font-medium">Sunny • Kyoto</div>
                </div>
              </motion.div>

              {/* 3. Flights */}
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} className="absolute bottom-[25%] left-[-10%] z-40">
                <div className={`${glassStyle} p-5 rotate-y-[10deg] rotate-z-[2deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default min-w-[200px] shadow-xl`}>
                  <div className="flex justify-between items-center mb-3">
                    <Plane className="w-5 h-5 text-blue-500" />
                    <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">On Time</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="font-bold text-lg">SFO</div>
                    <div className="h-[2px] flex-1 bg-black/10 dark:bg-white/20 mx-2 mb-2 relative">
                      <div className="absolute top-0 left-0 h-full bg-blue-500 w-1/2" />
                    </div>
                    <div className="font-bold text-lg">KIX</div>
                  </div>
                </div>
              </motion.div>

              {/* 4. Suitcase (Hidden on mobile to reduce clutter) */}
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} className="absolute bottom-[5%] left-[20%] z-30 hidden lg:block">
                <div className={`${glassStyle} p-4 flex items-center gap-3 rotate-y-[5deg] rotate-z-[-2deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default shadow-xl`}>
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

              {/* 5. Budget */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }} className="absolute bottom-[10%] right-[5%] z-40">
                <div className={`${glassStyle} p-5 flex flex-col gap-1 rotate-y-[-15deg] rotate-z-[4deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default shadow-xl`}>
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

              {/* 6. Maps (Hidden on mobile to reduce clutter) */}
              <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[40%] right-[-5%] z-30 hidden lg:block">
                <div className={`${glassStyle} p-4 flex items-center gap-4 rotate-y-[-10deg] rotate-z-[-6deg] hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-700 cursor-default shadow-xl`}>
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
        </section>

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
              { icon: Compass, title: 'Smart Itineraries', desc: 'AI-generated timelines that adapt to your pace, preferences, and real-time conditions.', colorClass: 'group-hover:text-blue-400 group-hover:drop-shadow-[0_0_12px_rgba(96,165,250,0.8)]' },
              { icon: Luggage, title: 'Contextual Packing', desc: 'Generates packing lists based on destination weather, activities, and duration.', colorClass: 'group-hover:text-orange-400 group-hover:drop-shadow-[0_0_12px_rgba(251,146,60,0.8)]' },
              { icon: BarChart3, title: 'Expense Tracking', desc: 'Monitor your budget in real-time with beautiful charts and multi-currency support.', colorClass: 'group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]' },
              { icon: Shield, title: 'Document Vault', desc: 'Securely store passports, visas, and tickets locally with military-grade encryption.', colorClass: 'group-hover:text-red-400 group-hover:drop-shadow-[0_0_12px_rgba(248,113,113,0.8)]' },
              { icon: Globe, title: 'Offline Mode', desc: 'Access your entire trip timeline and maps without an active internet connection.', colorClass: 'group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_12px_rgba(129,140,248,0.8)]' },
              { icon: Zap, title: 'Instant Sync', desc: 'Changes made on any device instantly reflect everywhere. Collaboration made easy.', colorClass: 'group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]' },
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
                  <feature.icon className={`h-8 w-8 text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-700 group-hover:scale-110 ${feature.colorClass}`} />
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
            <motion.div variants={scaleIn} className={`${glassStyle} h-[300px] lg:h-[600px] w-full relative overflow-hidden flex flex-col shadow-2xl shadow-blue-500/5 group`}>
              <Image 
                src="/assets/ai-travel-ui.jpg" 
                alt="AI Travel Itinerary Generation" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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

      </main>
    </div>
  );
}

