import React, { useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { LayoutGrid, Map, Box, Wallet, Sparkles, FileText, User, Settings, Calendar, Compass, Plane } from 'lucide-react';
import { LogoIcon, useLogoDoubleTap } from '@/components/ui/Logo';
import { motion } from 'framer-motion';
export const GLASS = "bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_16px_40px_rgba(0,0,0,0.4)] rounded-[24px]";
export const GLASS_HOVER = "transition-all duration-700 hover:-translate-y-1 hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),0_24px_48px_rgba(0,0,0,0.5)] hover:bg-[rgba(255,255,255,0.04)]";

const navItems = [
  { label: 'Home', path: '/overview', icon: LayoutGrid, colorClass: 'group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' },
  { label: 'Trips', path: '/trips', icon: Map, colorClass: 'group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' },
  { label: 'AI Planner', path: '/assistant', icon: Sparkles, colorClass: 'group-hover:text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]' },
  { label: 'Packing', path: '/packing', icon: Box, colorClass: 'group-hover:text-orange-400 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]' },
  { label: 'Calendar', path: '/calendar', icon: Calendar, colorClass: 'group-hover:text-pink-400 group-hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]' },
  { label: 'Budget', path: '/budget', icon: Wallet, colorClass: 'group-hover:text-green-400 group-hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]' },
  { label: 'Explore', path: '/explore', icon: Compass, colorClass: 'group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' },
  { label: 'Journal', path: '/journal', icon: FileText, colorClass: 'group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' },
  { label: 'Flights', path: '/flights', icon: Plane, colorClass: 'group-hover:text-sky-400 group-hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]' },
  { label: 'Profile', path: '/profile', icon: User, colorClass: 'group-hover:text-rose-400 group-hover:drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]' },
  { label: 'Settings', path: '/settings', icon: Settings, colorClass: 'group-hover:text-gray-300 group-hover:drop-shadow-[0_0_8px_rgba(209,213,219,0.8)]' },
];

export function Sidebar() {
  const location = useLocation();
  const sidebarRef = useRef(null);
  const { rotateX, rotateY } = useMouseTilt(sidebarRef, { maxTilt: 3, stiffness: 200, damping: 20 });
  const { isHoverSimulated, handlePointerDown } = useLogoDoubleTap();

  return (
    <motion.aside
      ref={sidebarRef}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      className="hidden lg:flex fixed left-6 top-6 h-[calc(100vh-3rem)] w-[240px] z-50 flex-col rounded-[32px] overflow-hidden bg-[#050B14]/30 backdrop-blur-[60px] backdrop-saturate-[250%] border-[1.5px] border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(255,255,255,0.05)]"
    >
      {/* Subtle Shine Layer */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-white/[0.08] to-transparent opacity-60 pointer-events-none" />
      <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-blue-400/10 to-transparent blur-3xl rounded-full pointer-events-none z-0" />
      
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 relative z-10">
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer" onPointerDown={handlePointerDown}>
          <motion.div
            className={`bg-white/10 rounded-xl p-1.5 transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:bg-gradient-to-br group-hover:from-white/20 group-hover:to-white/5 group-hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_16px_rgba(0,0,0,0.2)]`}
            whileHover={{ rotate: 15, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            <LogoIcon size="md" isHoverSimulated={isHoverSimulated} />
          </motion.div>
          <div className="flex flex-col relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:translate-x-1.5">
            <span className="text-white font-bold text-sm tracking-wide leading-tight transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:drop-shadow-[0_2px_10px_rgba(255,255,255,0.6)] group-hover:scale-[1.03] origin-left">
              Voyage Genie
            </span>
            <span className="text-white/40 text-[10px] tracking-wider uppercase leading-tight transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]">
              AI Travel Companion
            </span>
          </div>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-none relative z-10 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3.5 px-3 py-3 rounded-[16px] transition-all duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)] relative overflow-hidden ${isActive ? 'bg-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3)]' : 'hover:bg-white/[0.04]'}`}
            >
              {/* Active pill background */}
              {isActive && (
                <motion.div
                  layoutId="activeNavPill"
                  className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/15 to-white/5 border border-white/20 saturate-150"
                  style={{
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.2), inset 0 -1px 1px rgba(0,0,0,0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}

              {/* Icon */}
              <span className="relative z-10 transition-transform duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:translate-x-1">
                <Icon
                  size={16}
                  className={`transition-all duration-700 ${
                    isActive 
                      ? item.colorClass.replace(/group-hover:/g, '') 
                      : `text-white/50 ${item.colorClass}`
                  }`}
                />
              </span>

              {/* Label */}
              <span
                className={`relative z-10 font-medium transition-transform duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] group-hover:translate-x-1 ${
                  isActive ? 'text-white' : 'text-white/60 group-hover:text-white transition-colors duration-700'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Bottom AI card */}
      <div className="px-3 py-4">
        <div className={`rounded-xl p-3 flex flex-col group/ai ${GLASS} ${GLASS_HOVER}`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="text-white/90 text-xs font-semibold">Voyage Genie AI</span>
          </div>
          <p className="text-white/40 text-[11px] leading-relaxed mb-2.5">
            Plan smarter. Pack lighter. Travel better.
          </p>
          <NavLink
            to="/assistant"
            className="flex items-center justify-center w-full py-2 rounded-xl text-[12px] font-semibold text-white overflow-hidden relative ios-liquid-button"
          >
            Chat with AI →
          </NavLink>
        </div>
      </div>
    </motion.aside>
  );
}
