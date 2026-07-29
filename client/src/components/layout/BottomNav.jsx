import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Map, Sparkles, Compass, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Home', path: '/overview', icon: LayoutGrid, activeColor: 'text-blue-400' },
  { label: 'Trips', path: '/trips', icon: Map, activeColor: 'text-emerald-400' },
  { label: 'Genie', path: '/assistant', icon: Sparkles, activeColor: 'text-white', isCenter: true },
  { label: 'Explore', path: '/explore', icon: Compass, activeColor: 'text-cyan-400' },
  { label: 'Profile', path: '/profile', icon: User, activeColor: 'text-rose-400' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 lg:hidden pb-4 pt-2 px-4">
      <div className="w-full h-[68px] rounded-[32px] bg-[rgba(10,15,30,0.85)] backdrop-blur-[24px] border border-[rgba(255,255,255,0.15)] border-t-[rgba(255,255,255,0.25)] shadow-[0_-10px_40px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.3)] flex items-center justify-around px-2 relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center w-14 h-full rounded-2xl transition-all duration-300 ${item.isCenter ? '-mt-8' : ''}`}
            >
              {isActive && !item.isCenter && (
                <motion.div
                  layoutId="activeBottomNavPill"
                  className="absolute inset-0 top-1 bottom-1 bg-white/10 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              
              {item.isCenter ? (
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-[0_10px_30px_rgba(59,130,246,0.6)] border-[3px] border-[#0A0F1E] relative z-20 hover:scale-105 transition-transform">
                  <Icon size={26} className="text-white drop-shadow-md" />
                </div>
              ) : (
                <>
                  <Icon size={22} className={`relative z-10 transition-colors ${isActive ? item.activeColor : 'text-white/40 group-hover:text-white/70'}`} />
                  <span className={`relative z-10 text-[10px] mt-1 font-bold transition-colors ${isActive ? item.activeColor : 'text-white/30'}`}>
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
