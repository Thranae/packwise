import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, MapPinned, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { updateProfile } from '@/services/user.service';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/navigation/ThemeToggle';
import { cn } from '@/utils/cn';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', bounce: 0.3 } }
};

const SelectableCard = ({ selected, onClick, icon, title, description }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "w-full p-4 flex flex-col items-center justify-center text-center border rounded-2xl transition-all duration-700",
      selected 
        ? "bg-[var(--color-accent)]/10 border-[var(--color-accent)] shadow-[0_4px_16px_rgba(79,125,255,0.15)] ring-1 ring-[var(--color-accent)]" 
        : "glass-card hover:bg-[var(--theme-bg-surface)] hover:border-[var(--theme-border-subtle)]"
    )}
  >
    <div className={cn("text-2xl mb-2 transition-transform duration-700", selected ? "scale-110" : "")}>{icon}</div>
    <div className="font-bold text-sm text-text-primary">{title}</div>
    {description && <div className="text-xs text-text-secondary mt-1">{description}</div>}
  </button>
);

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();
  const { success, error } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    country: '',
    travelStyle: '',
    budget: '',
    adventureLevel: ''
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateProfile({
        gender: formData.gender,
        travelPreference: formData.travelStyle, // map to existing schema
        // age, country, budget, adventureLevel are captured but might not be in backend yet. 
        // passing them anyway so they are saved if backend supports it or ignored safely.
        preferences: {
          age: formData.age,
          country: formData.country,
          budget: formData.budget,
          adventureLevel: formData.adventureLevel
        }
      });
      
      if (response.success) {
        updateUser(response.data);
        success('Profile updated! Welcome to Voyage Genie.');
        navigate(ROUTES.DASHBOARD, { replace: true });
      }
    } catch (err) {
      error('Failed to save preferences. You can update them later in settings.');
      // Proceed anyway
      navigate(ROUTES.DASHBOARD, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--theme-bg-base)] text-text-primary relative overflow-hidden flex flex-col pt-[calc(24px+env(safe-area-inset-top))] md:pt-8 pb-20">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] h-[600px] w-[600px] rounded-full bg-[var(--color-accent)] opacity-[0.06] blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] h-[700px] w-[700px] rounded-full bg-purple-500 opacity-[0.05] blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-[var(--color-accent)] p-2 rounded-xl text-white shadow-lg">
            <MapPinned className="h-5 w-5" />
          </div>
          <span className="text-xl font-semibold tracking-tighter">Voyage Genie<span className="text-[var(--color-accent)]">.</span></span>
        </div>
        <div className="glass-panel p-1 rounded-full border border-border-subtle">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-3xl mx-auto px-6 flex-1 flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-2xl mb-6 shadow-sm border border-[var(--color-accent)]/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">Tell us about your travel style.</h1>
          <p className="text-lg text-text-secondary">We'll use this to tailor your AI recommendations and itineraries.</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-12">
            
            {/* Travel Style */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">1. Who do you usually travel with?</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: 'solo', icon: '👤', title: 'Solo' },
                  { id: 'couple', icon: '👫', title: 'Couple' },
                  { id: 'family', icon: '👨‍👩‍👧‍👦', title: 'Family' },
                  { id: 'business', icon: '💼', title: 'Business' }
                ].map(item => (
                  <SelectableCard 
                    key={item.id}
                    selected={formData.travelStyle === item.id}
                    onClick={() => updateForm('travelStyle', item.id)}
                    icon={item.icon}
                    title={item.title}
                  />
                ))}
              </div>
            </motion.div>

            {/* Adventure Level */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-4">2. What's your pace?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'relaxed', icon: '🍹', title: 'Relaxed', desc: 'Take it easy, no rush.' },
                  { id: 'balanced', icon: '🚶‍♂️', title: 'Balanced', desc: 'A mix of chill and sightseeing.' },
                  { id: 'explorer', icon: '⛰️', title: 'Explorer', desc: 'Maximize every hour.' }
                ].map(item => (
                  <SelectableCard 
                    key={item.id}
                    selected={formData.adventureLevel === item.id}
                    onClick={() => updateForm('adventureLevel', item.id)}
                    icon={item.icon}
                    title={item.title}
                    description={item.desc}
                  />
                ))}
              </div>
            </motion.div>

            {/* Budget */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-bold mb-4">3. Budget Preference (per trip)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { id: '10k', title: '₹10K' },
                  { id: '25k', title: '₹25K' },
                  { id: '50k', title: '₹50K' },
                  { id: '100k+', title: '₹100K+' }
                ].map(item => (
                  <SelectableCard 
                    key={item.id}
                    selected={formData.budget === item.id}
                    onClick={() => updateForm('budget', item.id)}
                    title={item.title}
                  />
                ))}
              </div>
            </motion.div>

            {/* Demographics */}
            <motion.div variants={itemVariants} className="pt-4 border-t border-border-subtle">
              <h3 className="text-lg font-bold mb-4">4. Final Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 pl-1">Gender</label>
                  <select 
                    className="glass-input w-full px-4 py-3 outline-none focus:border-[var(--color-accent)]"
                    value={formData.gender}
                    onChange={(e) => updateForm('gender', e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <Input 
                    label="Age (Optional)"
                    type="number"
                    placeholder="25"
                    value={formData.age}
                    onChange={(e) => updateForm('age', e.target.value)}
                  />
                </div>
                <div>
                  <Input 
                    label="Country"
                    type="text"
                    placeholder="e.g. India"
                    value={formData.country}
                    onChange={(e) => updateForm('country', e.target.value)}
                  />
                </div>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-8 flex justify-end">
              <Button type="submit" size="lg" isLoading={isLoading} className="rounded-2xl px-8 flex items-center gap-2 group">
                Complete Setup <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

          </motion.div>
        </form>
      </main>
    </div>
  );
}

