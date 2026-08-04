import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Map, Package, Bot, Settings, LogOut, Menu, X, Banknote, Bell, User, Plane, Globe, Book, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSoundEffect } from '@/hooks/useSoundEffect';
import { ROUTES } from '@/constants/routes';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Image } from '../ui/Image';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/formatters';

const navItems = [
  { name: 'Overview', path: ROUTES.OVERVIEW, icon: LayoutDashboard, hoverColor: 'group-hover:text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]' },
  { name: 'Trips', path: '/trips', icon: Map, hoverColor: 'group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' },
  { name: 'Journal', path: ROUTES.JOURNAL, icon: Book, hoverColor: 'group-hover:text-pink-400 group-hover:drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]' },
  { name: 'Packing', path: '/packing', icon: Package, hoverColor: 'group-hover:text-orange-400 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]' },
  { name: 'Budget', path: ROUTES.BUDGET, icon: Banknote, hoverColor: 'group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' },
  { name: 'AI', path: '/assistant', icon: Bot, hoverColor: 'group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' },
];

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { playSound } = useSoundEffect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-[calc(16px+var(--safe-top))] sm:top-[calc(24px+var(--safe-top))] left-3 right-3 sm:left-6 sm:right-6 md:left-8 md:right-8 z-[100] pointer-events-none flex justify-center"
      >
        {/* SVG definitions for 3D icon textures */}
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="icon-3d-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="icon-3d-purple" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="icon-3d-slate" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </linearGradient>
          </defs>
        </svg>

        <header
          className="relative flex items-center justify-between w-full max-w-[1200px] px-5 sm:px-6 h-[56px] sm:h-[64px] rounded-[24px] pointer-events-auto transition-all duration-700 overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(60px) saturate(200%)',
            WebkitBackdropFilter: 'blur(60px) saturate(200%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderTop: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 24px 48px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 6px rgba(0,0,0,0.5)'
          }}
        >
          {/* Subtle noise texture for frosted liquid look */}
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
          {/* Left: Logo */}
          <div className="flex-shrink-0 z-10 relative pl-2 hover:scale-105 transition-transform duration-700">
            <Logo 
              size="md" 
              onClick={() => {
                navigate(isAuthenticated ? ROUTES.OVERVIEW : ROUTES.HOME);
              }} 
            />
          </div>

          {/* Center: Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center justify-center space-x-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => playSound('tap')}
                  className={({ isActive }) =>
                    cn(
                      'relative overflow-hidden group flex items-center justify-center px-4 py-2 text-sm font-bold rounded-full transition-all duration-700',
                      isActive 
                        ? 'text-white bg-gradient-to-br from-[#5B8CFF] to-[#4D7FFF] border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(91,140,255,0.4)] scale-105' 
                        : 'text-text-secondary hover:text-white bg-transparent border border-transparent hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5 hover:border-white/20 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.3)] hover:-translate-y-0.5'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      
                      <span className={cn("relative z-10 flex items-center gap-2", isActive ? "drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]" : "group-hover:drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]")}>
                        <item.icon className={cn(
                          'h-4 w-4 transition-all duration-700', 
                          isActive ? 'text-white' : item.hoverColor
                        )} />
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          )}

          {/* Right: Actions */}
          <div className="flex items-center gap-[10px] z-10 relative">
            
            <div className="hidden sm:flex items-center gap-[10px]">
              {isAuthenticated ? (
                <>
                  <div className="relative" ref={notificationsRef}>
                    <button 
                      onClick={() => { playSound('tap'); setNotificationsOpen(!notificationsOpen); }}
                      className="relative overflow-hidden group flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.3)] hover:scale-110 hover:-translate-y-1 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.4),0_8px_16px_rgba(0,0,0,0.5)] transition-all duration-700"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      <Bell className="h-5 w-5 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] relative z-10 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-all duration-700" />
                      <div className="absolute top-[8px] right-[8px] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] z-20" />
                    </button>

                    <AnimatePresence>
                      {notificationsOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-4 w-80 rounded-2xl bg-[#0F172A]/90 backdrop-blur-[40px] shadow-[0_24px_48px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] p-4 z-[200] border border-white/10"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white tracking-tight">Notifications</h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full">2 New</span>
                          </div>

                          <div className="flex flex-col gap-3">
                            <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group/notif">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-white group-hover/notif:text-emerald-400 transition-colors">Tokyo Itinerary Ready</span>
                                <span className="text-xs text-white/60 leading-relaxed">Your 14-day Tokyo & Kyoto Explorer plan has been generated.</span>
                                <span className="text-[10px] text-white/40 font-medium">Just now</span>
                              </div>
                            </div>
                            <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group/notif">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Globe className="w-4 h-4 text-blue-400" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-white group-hover/notif:text-blue-400 transition-colors">Welcome to Voyage Genie</span>
                                <span className="text-xs text-white/60 leading-relaxed">Start planning your next trip with the power of AI.</span>
                                <span className="text-[10px] text-white/40 font-medium">2 hours ago</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-white/10 text-center">
                            <button className="text-xs font-bold text-white/50 hover:text-white transition-colors uppercase tracking-wider">Mark all as read</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative" ref={profileMenuRef}>
                    <button 
                      onClick={() => { playSound('tap'); setProfileMenuOpen(!profileMenuOpen); }}
                      className="relative overflow-hidden group flex ml-1 h-[40px] w-[40px] rounded-full bg-gradient-to-br from-[#5B8CFF] to-[#4D7FFF] border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.3)] hover:scale-110 hover:-translate-y-1 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-2px_4px_rgba(0,0,0,0.4),0_8px_16px_rgba(79,124,255,0.5)] transition-all duration-700"
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-20" />
                      {user?.profileImage ? (
                        <Image src={user.profileImage} alt={user.name} className="h-full w-full rounded-full object-cover relative z-10" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-full text-xs font-bold text-white relative z-10 drop-shadow-md">
                          {getInitials(user?.name || 'Thranae')}
                        </div>
                      )}
                    </button>

                    <AnimatePresence>
                      {profileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-4 w-64 rounded-2xl bg-slate-900/95 backdrop-blur-[60px] shadow-[0_24px_48px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] p-2 z-[200] overflow-hidden border border-white/20"
                        >
                          <div className="flex items-center gap-3 p-3 mb-2 border-b border-white/10">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20 flex items-center justify-center shadow-inner">
                              {user?.profileImage ? (
                                <img src={user.profileImage} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white text-sm font-bold drop-shadow-sm">{getInitials(user?.name || 'User')}</span>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-white truncate tracking-tight">{user?.displayName || user?.name || 'User'}</span>
                              <span className="text-[11px] font-medium text-white/80 truncate">{user?.email}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Link to={ROUTES.PROFILE} onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-white/10 text-white transition-all text-sm font-bold group/item">
                              <User className="w-4 h-4 text-blue-400 group-hover/item:scale-110 transition-transform drop-shadow-md" />
                              My Profile
                            </Link>
                            <Link to={ROUTES.SETTINGS} onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-white/10 text-white transition-all text-sm font-bold group/item">
                              <Settings className="w-4 h-4 text-purple-400 group-hover/item:scale-110 transition-transform drop-shadow-md" />
                              Settings
                            </Link>
                            <div className="h-px w-full bg-white/10 my-1" />
                            <button onClick={() => { setProfileMenuOpen(false); logout(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm font-bold w-full text-left group/item">
                              <LogOut className="w-4 h-4 text-red-500 group-hover/item:scale-110 transition-transform drop-shadow-md" />
                              Log Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} className="hidden sm:flex">
                    <button className="px-5 py-2.5 rounded-[14px] ios-liquid-button text-white font-medium shadow-md">Log in</button>
                  </Link>
                  <Link to={ROUTES.SIGNUP} className="hidden sm:flex">
                    <button className="px-6 py-2.5 rounded-[14px] ios-liquid-button text-white font-bold shadow-lg">Get Started</button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => { playSound('tap'); setMobileMenuOpen(!mobileMenuOpen); }}
              className="ml-2 relative overflow-hidden group flex h-[40px] w-[40px] items-center justify-center text-white bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.3)] rounded-full hover:scale-105 hover:-translate-y-1 hover:shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.4),0_8px_16px_rgba(0,0,0,0.5)] sm:hidden transition-all duration-700"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              {mobileMenuOpen ? <X className="h-5 w-5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] relative z-10 group-hover:text-red-400 group-hover:drop-shadow-[0_0_8px_rgba(248,113,113,0.8)] transition-colors duration-700" /> : <Menu className="h-5 w-5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] relative z-10 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)] transition-colors duration-700" />}
            </button>
          </div>
        </header>
      </motion.div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div key="mobile-menu" className="fixed inset-0 z-[90] sm:hidden" style={{ touchAction: 'none', overscrollBehavior: 'contain' }}>
            {/* Blurred Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => { playSound('tap'); setMobileMenuOpen(false); }}
              className="absolute inset-0 bg-[#060B14]/80"
            />
            
            {/* Menu Card - iOS 18 Liquid Glass */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ willChange: 'transform, opacity' }}
              className="absolute top-[calc(96px+var(--safe-top))] left-4 right-4 rounded-[32px] bg-[#111827]/75 backdrop-blur-md border border-white/[0.12] shadow-[0_32px_64px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_0_32px_rgba(255,255,255,0.03)] p-5 flex flex-col overflow-hidden"
            >
              {/* Subtle noise for glass texture */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
              
              <div className="relative z-10 flex flex-col w-full">
              {isAuthenticated ? (
                  <div className="flex flex-col w-full">
                    {/* User Profile Row */}
                    <div className="flex items-center gap-3.5 px-2 py-3 mb-2">
                      <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border border-white/20 shrink-0 overflow-hidden">
                        {user?.profileImage ? (
                          <img src={user.profileImage} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-sm font-bold text-white">{getInitials(user?.name || 'User')}</span>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-white text-[15px] truncate">{user?.displayName || user?.name || 'User'}</span>
                        <span className="text-[12px] text-white/40 truncate">{user?.email}</span>
                      </div>
                    </div>

                    <div className="h-px w-full bg-white/[0.06] mb-1" />

                    {/* Navigation Items */}
                    <div className="flex flex-col gap-1 mt-1">
                      {navItems.map((item) => (
                        <Link key={item.name} to={item.path} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-3 py-3 rounded-[16px] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-200">
                          <div className="w-8 h-8 rounded-[12px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                            <item.icon className="h-[18px] w-[18px]" style={{ stroke: 'url(#icon-3d-slate)', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }} />
                          </div>
                          <span className="font-semibold text-[15px] tracking-wide">{item.name}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="h-px w-full bg-white/[0.08] my-2" />
                    
                    <div className="flex flex-col gap-1">
                      <Link to={ROUTES.SETTINGS} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 px-3 py-3 rounded-[16px] text-white/70 hover:bg-white/[0.08] hover:text-white transition-all duration-200">
                        <div className="w-8 h-8 rounded-[12px] bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                          <Settings className="h-[18px] w-[18px]" style={{ stroke: 'url(#icon-3d-slate)', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }} />
                        </div>
                        <span className="font-semibold text-[15px] tracking-wide">Settings</span>
                      </Link>

                      <button onClick={() => { setMobileMenuOpen(false); logout(); }} className="flex items-center w-full gap-4 px-3 py-3 rounded-[16px] text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
                        <div className="w-8 h-8 rounded-[12px] bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                          <LogOut className="h-[18px] w-[18px] text-red-400" style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }} />
                        </div>
                        <span className="font-semibold text-[15px] tracking-wide">Log out</span>
                      </button>
                    </div>
                  </div>
              ) : (
                <div className="flex flex-col w-full py-3 px-1">
                  {/* Compact travel-themed header */}
                  <div className="flex items-center gap-4 px-2 mb-5">
                    <div className="w-12 h-12 rounded-[16px] bg-white/[0.05] border border-white/[0.12] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),0_8px_16px_rgba(0,0,0,0.4)] relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                      <Plane className="w-6 h-6 relative z-10" style={{ stroke: 'url(#icon-3d-blue)', filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.6))' }} />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-semibold text-white tracking-tight">Voyage Genie<span className="text-blue-400">.</span></h2>
                      <p className="text-[11px] text-white/35">Plan your next adventure</p>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col gap-2.5 px-1">
                    <Link to={ROUTES.SIGNUP} onClick={() => setMobileMenuOpen(false)} className="w-full block">
                      <button className="w-full relative overflow-hidden group py-3.5 rounded-2xl text-white font-semibold text-[14px] tracking-wide transition-all duration-300 active:scale-[0.97]" style={{ background: 'linear-gradient(135deg, #4F7CFF 0%, #6366F1 100%)' }}>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Get Started
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </button>
                    </Link>

                    <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)} className="w-full block">
                      <button className="w-full py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white/70 hover:text-white font-medium text-[14px] transition-colors duration-200 active:scale-[0.97]">
                        Log in
                      </button>
                    </Link>
                  </div>

                  {/* Footer */}
                  <p className="text-[9px] font-medium tracking-[0.15em] text-white/15 uppercase mt-5 text-center">
                    Powered by Thranaeswanth
                  </p>
                </div>
              )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
