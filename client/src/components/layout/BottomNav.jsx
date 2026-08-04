import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Map, Bot, Banknote, User, PlaneTakeoff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHaptics } from '@/hooks/useHaptics';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { useTransitionNavigate } from '@/contexts/TransitionContext';

const navItems = [
  { label: 'Home', path: '/overview', icon: LayoutGrid, activeColor: 'text-blue-400', shadowColor: 'shadow-blue-500/50' },
  { label: 'Trips', path: '/trips', icon: Map, activeColor: 'text-yellow-400', shadowColor: 'shadow-yellow-500/50' },
  { label: 'Genie', path: '/assistant', icon: PlaneTakeoff, activeColor: 'text-white', isCenter: true },
  { label: 'Budget', path: '/budget', icon: Banknote, activeColor: 'text-emerald-400', shadowColor: 'shadow-emerald-500/50' },
  { label: 'Profile', path: '/profile', icon: User, activeColor: 'text-rose-400', shadowColor: 'shadow-rose-500/50' },
];

export function BottomNav() {
  const location = useLocation();
  const { lightTap } = useHaptics();
  const { playSound } = useSoundEffect();
  const triggerTransition = useTransitionNavigate();

  const handleNavClick = (e, path) => {
    lightTap();
    playSound('tap');
    
    // Trigger the fake delay animation whenever navigating to Home
    if (path === '/overview') {
      e.preventDefault();
      triggerTransition(path, { text: 'Fetching real time data...' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] lg:hidden pb-[calc(0.5rem+var(--safe-bottom))] pt-2 px-4 pointer-events-none">
      
      {/* SVG Definitions for 3D Icon Textures */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="icon-3d-blue-takeoff" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="w-full h-[56px] relative flex items-center justify-around px-2 pointer-events-auto">
        
        {/* iOS 18 Ultra Liquid Glass Background */}
        <div className="absolute inset-0 rounded-[28px] bg-[#050B14]/40 backdrop-blur-[60px] backdrop-saturate-[250%] border-[1.5px] border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(255,255,255,0.05)] overflow-hidden pointer-events-none">
          {/* Dynamic Light Sweep */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.03] via-white/[0.1] to-transparent opacity-60" />
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/15 to-transparent blur-2xl rounded-full" />
        </div>
        
        {/* Nav Items (Foreground) */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={(e) => handleNavClick(e, item.path)}
              className={`relative flex items-center justify-center w-[50px] h-full rounded-[20px] transition-all duration-300 z-10 ${item.isCenter ? '-mt-6' : ''} group`}
            >
              {/* 3D Glass Pill for Active State */}
              {isActive && !item.isCenter && (
                <motion.div
                  layoutId="activeBottomNavPill"
                  className="absolute inset-0 top-1 bottom-1 bg-white/[0.18] rounded-[20px] backdrop-blur-lg shadow-[inset_0_2px_6px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.6),0_8px_16px_rgba(0,0,0,0.6)] border border-white/30"
                  transition={{ type: 'spring', stiffness: 350, damping: 25, mass: 0.8 }}
                />
              )}
              
              {/* Center Floating 3D Genie Button */}
              {item.isCenter ? (
                <div className="relative group-hover:-translate-y-1 transition-transform duration-500 z-20">
                  {/* Mild Aurora */}
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-cyan-400/30 via-blue-500/30 to-purple-500/30 blur-[16px] -z-10 animate-pulse" />
                  <div className="w-[58px] h-[58px] rounded-full bg-gradient-to-b from-white/20 to-white/5 p-[1px] shadow-[0_12px_24px_rgba(0,0,0,0.4)]">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#5b8cff] to-[#4d7fff] flex items-center justify-center shadow-[inset_0_4px_8px_rgba(255,255,255,0.6),inset_0_-4px_8px_rgba(0,0,0,0.2)] border border-white/30 relative overflow-hidden group-active:scale-95 transition-transform duration-200">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                      <Icon 
                        className="w-[28px] h-[28px] text-white" 
                        strokeWidth={2.5} 
                        style={{ stroke: 'url(#icon-3d-blue-takeoff)', filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.3))' }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`relative z-10 flex flex-col items-center justify-center transition-all duration-400 ${isActive ? `drop-shadow-[0_3px_5px_rgba(0,0,0,0.8)] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] ${item.activeColor}` : 'text-white/60 drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)] group-hover:text-white group-hover:scale-110'}`}>
                    <Icon className="w-[22px] h-[22px]" strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className={`absolute bottom-1.5 text-[8.5px] font-extrabold tracking-widest uppercase transition-all duration-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-10 ${isActive ? `${item.activeColor} opacity-100 translate-y-0` : 'text-white/40 opacity-0 translate-y-2'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
