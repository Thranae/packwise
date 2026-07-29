import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Map, Sparkles, Compass, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHaptics } from '@/hooks/useHaptics';
import { useSoundEffect } from '@/hooks/useSoundEffect';

const navItems = [
  { label: 'Home', path: '/overview', icon: LayoutGrid, activeColor: 'text-blue-400' },
  { label: 'Trips', path: '/trips', icon: Map, activeColor: 'text-emerald-400' },
  { label: 'Genie', path: '/assistant', icon: Sparkles, activeColor: 'text-white', isCenter: true },
  { label: 'Explore', path: '/explore', icon: Compass, activeColor: 'text-cyan-400' },
  { label: 'Profile', path: '/profile', icon: User, activeColor: 'text-rose-400' },
];

export function BottomNav() {
  const location = useLocation();
  const { lightTap } = useHaptics();
  const { playSound } = useSoundEffect();

  const handleNavClick = () => {
    lightTap();
    playSound('tap');
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 lg:hidden pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 px-4">
      <div className="w-full h-[72px] relative flex items-center justify-around px-2">
        
        {/* Glass Background Layer (handles overflow-hidden and rounded corners) */}
        <div className="absolute inset-0 rounded-[36px] bg-[#0A0F1E]/20 backdrop-blur-[40px] backdrop-saturate-[200%] border border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-1px_1px_rgba(255,255,255,0.05)] overflow-hidden pointer-events-none">
          {/* Subtle Shine Layer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 opacity-50" />
        </div>
        
        {/* Nav Items (Foreground) */}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={`relative flex flex-col items-center justify-center w-14 h-full rounded-[20px] transition-all duration-300 z-10 ${item.isCenter ? '-mt-7' : ''} group`}
            >
              {isActive && !item.isCenter && (
                <motion.div
                  layoutId="activeBottomNavPill"
                  className="absolute inset-0 top-1.5 bottom-1.5 bg-white/10 rounded-[22px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.5),0_4px_8px_rgba(0,0,0,0.3)] border border-white/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              
              {item.isCenter ? (
                <div className="relative group-hover:scale-110 transition-transform duration-500 z-20">
                  {/* Spinning magical aura ring behind the button */}
                  <div className="absolute -inset-1.5 rounded-full bg-gradient-to-tr from-blue-400 via-purple-500 to-emerald-400 opacity-40 blur-[8px] -z-10 animate-[spin_4s_linear_infinite]" />
                  <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.4)] border border-white/20 relative">
                    <Icon size={26} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
                    <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-[1.5px] border-indigo-600 shadow-[0_0_12px_rgba(52,211,153,1)] animate-pulse" />
                  </div>
                </div>
              ) : (
                <div className={`relative z-10 flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'scale-105' : ''}`}>
                  <div className={`transition-all duration-300 ${isActive ? `drop-shadow-[0_0_12px_rgba(96,165,250,0.6)] ${item.activeColor}` : 'text-white/40 group-hover:text-white/70 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]'}`}>
                    <Icon size={22} className={isActive ? 'stroke-[2.5px]' : 'stroke-2'} />
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide transition-colors ${isActive ? item.activeColor : 'text-white/30'}`}>
                    {item.label}
                  </span>
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
