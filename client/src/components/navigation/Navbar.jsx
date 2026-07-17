import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Map, Package, Bot, Settings, LogOut, Menu, X, Banknote, Bell, User, Sparkles, Globe } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { Image } from '../ui/Image';
import { cn } from '@/utils/cn';
import { getInitials } from '@/utils/formatters';

const navItems = [
  { name: 'Overview', path: ROUTES.OVERVIEW, icon: LayoutDashboard, hoverColor: 'group-hover:text-purple-400 group-hover:drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]' },
  { name: 'Trips', path: '/trips', icon: Map, hoverColor: 'group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' },
  { name: 'Packing', path: '/packing', icon: Package, hoverColor: 'group-hover:text-orange-400 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]' },
  { name: 'Budget', path: ROUTES.BUDGET, icon: Banknote, hoverColor: 'group-hover:text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' },
  { name: 'AI', path: '/assistant', icon: Bot, hoverColor: 'group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' },
];

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
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

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-[24px] left-0 right-0 z-[100] pointer-events-none"
      >
        <header
          className="relative flex items-center justify-between w-full max-w-[1200px] mx-auto px-6 h-[64px] rounded-[24px] pointer-events-auto transition-all duration-700"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)'
          }}
        >
          {/* Left: Logo */}
          <Link to={isAuthenticated ? ROUTES.OVERVIEW : ROUTES.HOME} className="flex-shrink-0 z-10 relative pl-2 hover:scale-105 transition-transform duration-700">
            <Logo size="sm" />
          </Link>

          {/* Center: Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center justify-center space-x-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
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
                      onClick={() => setNotificationsOpen(!notificationsOpen)}
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
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
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
                          className="absolute right-0 top-full mt-4 w-64 rounded-2xl bg-[#0F172A]/90 backdrop-blur-[40px] shadow-[0_24px_48px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] p-2 z-[200] overflow-hidden border border-white/10"
                        >
                          <div className="flex items-center gap-3 p-3 mb-2 border-b border-white/10">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-gradient-to-tr from-blue-500 to-purple-500 border border-white/20 flex items-center justify-center shadow-inner">
                              {user?.profileImage ? (
                                <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-white text-sm font-bold drop-shadow-sm">{getInitials(user?.name || 'User')}</span>
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-white truncate tracking-tight">{user?.name || 'User'}</span>
                              <span className="text-[11px] font-medium text-white/60 truncate">{user?.email}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Link to={ROUTES.PROFILE} onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-all text-sm font-bold group/item">
                              <User className="w-4 h-4 group-hover/item:text-blue-400 group-hover/item:scale-110 transition-transform" />
                              My Profile
                            </Link>
                            <Link to={ROUTES.SETTINGS} onClick={() => setProfileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-white/10 text-white/80 hover:text-white transition-all text-sm font-bold group/item">
                              <Settings className="w-4 h-4 group-hover/item:text-purple-400 group-hover/item:scale-110 transition-transform" />
                              Settings
                            </Link>
                            <div className="h-px w-full bg-white/10 my-1" />
                            <button onClick={() => { setProfileMenuOpen(false); logout(); }} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm font-bold w-full text-left group/item">
                              <LogOut className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-24 left-4 right-4 z-50 glass-card p-4 sm:hidden flex flex-col gap-2 shadow-2xl"
          >
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-border-subtle">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white">
                    {getInitials(user?.name || 'Thranae')}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-text-primary">{user?.name || 'Thranae'}</span>
                    <span className="text-xs text-text-secondary">{user?.email}</span>
                  </div>
                </div>
                {navItems.map((item) => (
                  <Link key={item.name} to={item.path} className="flex items-center gap-3 px-4 py-3 rounded-[16px] text-text-secondary hover:bg-[var(--theme-bg-surface)] hover:text-text-primary transition-colors">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
                <Link to={ROUTES.SETTINGS} className="flex items-center gap-3 px-4 py-3 rounded-[16px] text-text-secondary hover:bg-[var(--theme-bg-surface)] hover:text-text-primary transition-colors">
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                <button onClick={logout} className="flex items-center w-full gap-3 px-4 py-3 mt-2 rounded-[16px] text-error-500 hover:bg-error-500/10 transition-colors">
                  <LogOut className="h-5 w-5" />
                  Log out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <Link to={ROUTES.LOGIN} className="w-full">
                  <button className="w-full px-5 py-3 rounded-[14px] ios-liquid-button text-white font-medium shadow-md">Log in</button>
                </Link>
                <Link to={ROUTES.SIGNUP} className="w-full">
                  <button className="w-full px-5 py-3 rounded-[14px] ios-liquid-button text-white font-bold shadow-lg">Sign up</button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
