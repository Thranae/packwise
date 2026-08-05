import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { MapPin, ArrowRight, ArrowLeft, Bot, Users, Gauge, Wallet, UserCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { updateProfile } from '@/services/user.service';
import { ROUTES } from '@/constants/routes';

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------
const STEPS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'style', label: 'Travel Style' },
  { id: 'pace', label: 'Pace & Budget' },
  { id: 'details', label: 'Details' },
];

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const pageVariants = {
  enter: (direction) => ({ x: direction > 0 ? 120 : -120, opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (direction) => ({ x: direction > 0 ? -120 : 120, opacity: 0, scale: 0.96 }),
};

const cardStagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 18, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } },
};

// ---------------------------------------------------------------------------
// Reusable selectable card
// ---------------------------------------------------------------------------
const SelectCard = ({ selected, onClick, icon, title, description }) => (
  <motion.button
    type="button"
    onClick={onClick}
    variants={cardItem}
    whileHover={{ y: -4, transition: { duration: 0.25 } }}
    whileTap={{ scale: 0.97 }}
    className={`w-full p-5 flex flex-col items-center justify-center text-center rounded-[24px] transition-all duration-500 outline-none group
      ${selected
        ? 'bg-blue-500/15 border-2 border-blue-400/60 shadow-[0_0_24px_rgba(59,130,246,0.2),inset_0_1px_2px_rgba(255,255,255,0.15)] ring-1 ring-blue-400/30'
        : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] hover:border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.06),0_4px_16px_rgba(0,0,0,0.2)]'
      }`}
  >
    <div className={`text-3xl mb-2.5 transition-transform duration-500 ${selected ? 'scale-110' : 'group-hover:scale-105'}`}>{icon}</div>
    <div className="font-bold text-sm text-white tracking-tight">{title}</div>
    {description && <div className="text-[11px] text-white/50 mt-1 leading-snug">{description}</div>}
  </motion.button>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { success, error } = useToast();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    country: '',
    travelStyle: '',
    budget: '',
    adventureLevel: '',
  });

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const goNext = () => { setDirection(1); setStep(s => Math.min(s + 1, STEPS.length - 1)); };
  const goBack = () => { setDirection(-1); setStep(s => Math.max(s - 1, 0)); };

  const handleSkip = () => navigate(ROUTES.OVERVIEW, { replace: true });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await updateProfile({
        gender: formData.gender,
        travelPreference: formData.travelStyle,
        preferences: {
          age: formData.age,
          country: formData.country,
          budget: formData.budget,
          adventureLevel: formData.adventureLevel,
        },
      });

      if (response.success) {
        updateUser(response.data);
        success('You\'re all set! Welcome to Voyage Genie.');
      }
    } catch (err) {
      error('Preferences saved locally. You can update them anytime in Settings.');
    } finally {
      setIsLoading(false);
      navigate(ROUTES.OVERVIEW, { replace: true });
    }
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;
  const displayName = user?.name?.split(' ')[0] || 'Traveler';

  // ---------------------------------------------------------------------------
  // Step renderers
  // ---------------------------------------------------------------------------
  const renderWelcome = () => (
    <motion.div variants={cardStagger} initial="hidden" animate="show" className="flex flex-col items-center text-center px-2">
      <motion.div variants={cardItem} className="w-20 h-20 mb-6 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]">
        <span className="text-3xl">👋</span>
      </motion.div>

      <motion.h1 variants={cardItem} className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 leading-tight">
        Hey, {displayName}! 👋
      </motion.h1>

      <motion.p variants={cardItem} className="text-base text-white/60 leading-relaxed max-w-sm mb-10">
        Let's personalize your experience. This takes about 30 seconds and helps our AI craft better trips for you.
      </motion.p>

      <motion.button
        variants={cardItem}
        onClick={goNext}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="px-8 py-4 primary-liquid-button rounded-full text-white font-bold text-base flex items-center gap-2.5 group"
      >
        Let's Go
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );

  const renderTravelStyle = () => (
    <motion.div variants={cardStagger} initial="hidden" animate="show" className="w-full">
      <motion.div variants={cardItem} className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Who do you travel with?</h2>
      </motion.div>
      <motion.p variants={cardItem} className="text-sm text-white/50 mb-8 pl-[52px]">Pick the one that fits you best.</motion.p>

      <motion.div variants={cardStagger} className="grid grid-cols-2 gap-4">
        {[
          { id: 'solo', icon: '👤', title: 'Solo', desc: 'Just me & the world' },
          { id: 'couple', icon: '👫', title: 'Couple', desc: 'Romantic getaways' },
          { id: 'family', icon: '👨‍👩‍👧‍👦', title: 'Family', desc: 'Fun for everyone' },
          { id: 'business', icon: '💼', title: 'Business', desc: 'Work + leisure' },
        ].map(item => (
          <SelectCard
            key={item.id}
            selected={formData.travelStyle === item.id}
            onClick={() => updateForm('travelStyle', item.id)}
            icon={item.icon}
            title={item.title}
            description={item.desc}
          />
        ))}
      </motion.div>
    </motion.div>
  );

  const renderPaceBudget = () => (
    <motion.div variants={cardStagger} initial="hidden" animate="show" className="w-full space-y-10">
      {/* Pace */}
      <div>
        <motion.div variants={cardItem} className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Gauge className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">What's your pace?</h2>
        </motion.div>
        <motion.p variants={cardItem} className="text-sm text-white/50 mb-6 pl-[52px]">How packed should your days be?</motion.p>

        <motion.div variants={cardStagger} className="grid grid-cols-3 gap-3">
          {[
            { id: 'relaxed', icon: '🍹', title: 'Relaxed', desc: 'No rush' },
            { id: 'balanced', icon: '🚶', title: 'Balanced', desc: 'Best of both' },
            { id: 'explorer', icon: '⛰️', title: 'Explorer', desc: 'Max adventure' },
          ].map(item => (
            <SelectCard
              key={item.id}
              selected={formData.adventureLevel === item.id}
              onClick={() => updateForm('adventureLevel', item.id)}
              icon={item.icon}
              title={item.title}
              description={item.desc}
            />
          ))}
        </motion.div>
      </div>

      {/* Budget */}
      <div>
        <motion.div variants={cardItem} className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Budget per trip?</h2>
        </motion.div>
        <motion.p variants={cardItem} className="text-sm text-white/50 mb-6 pl-[52px]">We'll suggest options within your range.</motion.p>

        <motion.div variants={cardStagger} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'budget', title: '$500', desc: 'Budget' },
            { id: 'moderate', title: '$1,500', desc: 'Moderate' },
            { id: 'premium', title: '$3,000', desc: 'Premium' },
            { id: 'luxury', title: '$5,000+', desc: 'Luxury' },
          ].map(item => (
            <SelectCard
              key={item.id}
              selected={formData.budget === item.id}
              onClick={() => updateForm('budget', item.id)}
              icon={item.title}
              title={item.desc}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );

  const renderDetails = () => (
    <motion.div variants={cardStagger} initial="hidden" animate="show" className="w-full">
      <motion.div variants={cardItem} className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <UserCircle className="w-5 h-5 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">A few more details</h2>
      </motion.div>
      <motion.p variants={cardItem} className="text-sm text-white/50 mb-8 pl-[52px]">Helps us tailor AI packing lists & itineraries.</motion.p>

      <motion.div variants={cardStagger} className="space-y-5">
        {/* Gender */}
        <motion.div variants={cardItem}>
          <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 pl-1">Gender</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'male', icon: '♂️', title: 'Male' },
              { id: 'female', icon: '♀️', title: 'Female' },
              { id: 'other', icon: '⚧️', title: 'Other' },
            ].map(item => (
              <SelectCard
                key={item.id}
                selected={formData.gender === item.id}
                onClick={() => updateForm('gender', item.id)}
                icon={item.icon}
                title={item.title}
              />
            ))}
          </div>
        </motion.div>

        {/* Age & Country */}
        <motion.div variants={cardItem} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 pl-1">Age (optional)</label>
            <input
              type="number"
              placeholder="25"
              value={formData.age}
              onChange={(e) => updateForm('age', e.target.value)}
              className="w-full h-[50px] px-4 rounded-2xl glass-input text-white text-sm font-medium placeholder:text-white/30 outline-none transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 pl-1">Country</label>
            <input
              type="text"
              placeholder="e.g. India"
              value={formData.country}
              onChange={(e) => updateForm('country', e.target.value)}
              className="w-full h-[50px] px-4 rounded-2xl glass-input text-white text-sm font-medium placeholder:text-white/30 outline-none transition-all duration-300"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );

  const stepRenderers = [renderWelcome, renderTravelStyle, renderPaceBudget, renderDetails];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-[#020617] text-white relative overflow-hidden flex flex-col">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-[15%] -left-[15%] h-[600px] w-[600px] rounded-full bg-blue-500 opacity-[0.04] blur-[140px]" />
        <div className="absolute top-[30%] -right-[15%] h-[700px] w-[700px] rounded-full bg-purple-500 opacity-[0.03] blur-[160px]" />
        <div className="absolute bottom-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-emerald-500 opacity-[0.03] blur-[120px]" />
      </div>

      {/* Top bar — progress + skip */}
      <header className="relative z-20 w-full max-w-lg mx-auto px-6 pt-[calc(16px+var(--safe-top))] md:pt-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-[0_4px_12px_rgba(59,130,246,0.3)]">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-white">Voyage Genie</span>
          </div>
          <button
            onClick={handleSkip}
            className="text-xs font-bold text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest"
          >
            Skip
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <span className={`text-[11px] font-bold transition-colors duration-300 ${i <= step ? 'text-white/70' : 'text-white/20'}`}>
                {s.label}
              </span>
              {i < STEPS.length - 1 && <ChevronRight className={`w-3 h-3 transition-colors duration-300 ${i < step ? 'text-white/40' : 'text-white/10'}`} />}
            </div>
          ))}
        </div>
      </header>

      {/* Step content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-6 py-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {stepRenderers[step]()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer navigation */}
      {step > 0 && (
        <footer className="relative z-20 w-full max-w-lg mx-auto px-6 pb-[calc(24px+var(--safe-bottom))] md:pb-8">
          <div className="flex items-center justify-between gap-4">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={goBack}
              className="flex items-center gap-2 px-5 py-3 rounded-full ios-liquid-button text-white/80 hover:text-white transition-all duration-300 font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </motion.button>

            {step < STEPS.length - 1 ? (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={goNext}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3 rounded-full primary-liquid-button text-white font-bold text-sm group"
              >
                Next
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            ) : (
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleSubmit}
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3 rounded-full ios-liquid-button bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm shadow-[0_8px_24px_rgba(16,185,129,0.3)] group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Setup
                    <Bot className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
