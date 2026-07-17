import React, { useState } from 'react';
import { Bell, Shield, CreditCard, Smartphone, Globe, Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
    marketing: false,
  });

  const toggleToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold tracking-tight text-text-primary"
          >
            Settings
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-lg font-medium text-text-secondary"
          >
            Customize your Voyage Genie experience.
          </motion.p>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Appearance */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-8 rounded-[24px]">
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-6">
              <Monitor className="w-5 h-5 text-[var(--color-accent)]" />
              Appearance
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'light', label: 'Light', icon: Sun },
                { id: 'dark', label: 'Dark', icon: Moon },
                { id: 'system', label: 'System', icon: Monitor },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    theme === t.id 
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]' 
                      : 'border-white/5 bg-white/[0.02] text-text-secondary hover:border-white/20 hover:text-text-primary'
                  }`}
                >
                  <t.icon className="w-6 h-6 mb-2" />
                  <span className="font-medium text-sm">{t.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-8 rounded-[24px]">
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-amber-400" />
              Notifications
            </h3>
            <div className="flex flex-col gap-6">
              {[
                { id: 'email', label: 'Email Notifications', desc: 'Receive daily itineraries and flight updates via email.' },
                { id: 'push', label: 'Push Notifications', desc: 'Get real-time alerts on your devices for gate changes.' },
                { id: 'updates', label: 'Product Updates', desc: 'Hear about new features and improvements.' },
                { id: 'marketing', label: 'Marketing Emails', desc: 'Receive exclusive travel deals and partner offers.' },
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="pr-8">
                    <h4 className="font-medium text-text-primary mb-1">{item.label}</h4>
                    <p className="text-sm text-text-secondary">{item.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleToggle(item.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-700 focus:outline-none shrink-0 ${notifications[item.id] ? 'bg-[var(--color-accent)]' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-700 ${notifications[item.id] ? 'transform translate-x-6' : ''}`} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Billing / Subscription */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-8 rounded-[24px]">
            <h3 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              Subscription
            </h3>
            <div className="p-6 rounded-[20px] bg-gradient-to-r from-[var(--color-accent)]/20 to-purple-500/10 border border-[var(--color-accent)]/30 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-accent)] text-white text-xs font-semibold uppercase tracking-[0.15em] mb-3">
                  Pro Plan
                </div>
                <h4 className="text-lg font-bold text-text-primary mb-1">Voyage Genie Premium</h4>
                <p className="text-sm text-text-secondary">Unlimited trips, AI chat, and document storage.</p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-3">
                <span className="text-sm font-medium text-text-primary">Next billing: Nov 1, 2024</span>
                <Button variant="secondary" className="px-6 bg-white/10 hover:bg-white/20 border-white/20">Manage Billing</Button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </PageTransition>
  );
}

