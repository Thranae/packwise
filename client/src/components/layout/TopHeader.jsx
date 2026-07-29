import React, { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Bell, Globe, User, Settings, LogOut, Mic, Map, Book, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useMouseTilt } from '@/hooks/useMouseTilt';
import { useAuth } from '@/hooks/useAuth';
import { useTripContext } from '@/context/TripContext';
import { useAI } from '@/hooks/useAI';
import { ROUTES } from '@/constants/routes';
import { getInitials } from '@/utils/formatters';
import { GenieSlideOut } from '../ai/GenieSlideOut';
import { LogoIcon } from '@/components/ui/Logo';
import api from '@/services/api';

export const TopHeader = () => {
  const { user, logout } = useAuth();
  const { currentTrip, packedItems, generateTrip } = useTripContext();
  const { getPackingList } = useAI();
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [slideOutOpen, setSlideOutOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [packingData, setPackingData] = useState(null);
  
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingAI(true);
      const q = query.toLowerCase();
      let results = [];
      
      try {
        const res = await api.post('/ai/resolve-destination', { query: q });
        if (res.status >= 200 && res.status < 300) {
          results = res.data.data || [];
        }
      } catch(e) {
        console.error(e);
      }
      setSuggestions(results);
      setIsSearchingAI(false);
    }, 400); // debounce
    return () => clearTimeout(timer);
  }, [query]);
  
  const headerRef = useRef(null);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  
  useEffect(() => {
    if (currentTrip?.destination) {
      getPackingList(currentTrip.destination, currentTrip.weather || 'Sunny').then(setPackingData);
    }
  }, [currentTrip?.destination]);

  const totalItemsList = packingData?.categories?.flatMap(cat => cat.items) || [];
  const total = totalItemsList.length;
  const packed = totalItemsList.filter(item => item.packed || packedItems?.has(item.name || item.text)).length;
  const percentage = total > 0 ? (packed / total) * 100 : 0;
  const dashOffset = 100.5 - (percentage / 100) * 100.5;

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
  
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.header 
      ref={headerRef}
      whileHover={{ y: -2, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      className="relative z-50 w-full flex items-center justify-between h-[60px] lg:h-[72px] mt-2 lg:mt-6 px-4 lg:px-6 bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-md border border-white/30 shadow-[0_8px_16px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-1px_2px_rgba(0,0,0,0.2)] rounded-[24px] lg:rounded-[36px]"
    >
      
      {/* Mobile Logo */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center border border-white/20 shadow-inner">
          <LogoIcon size="sm" />
        </div>
        <span className="text-white font-bold text-sm tracking-wide">Voyage Genie</span>
      </div>

      {/* Search Bar (occupies ~60% of available space) */}
      <div className="hidden md:flex flex-1 justify-center max-w-[60%] ml-4 lg:ml-8">
        <div 
          className={`
            relative flex items-center w-full h-[52px] rounded-[24px] 
            transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
            bg-[rgba(255,255,255,0.03)] backdrop-blur-2xl
            border border-[rgba(255,255,255,0.1)] border-t-[rgba(255,255,255,0.2)] border-l-[rgba(255,255,255,0.15)]
            shadow-[0_10px_40px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.2)]
            ${isFocused ? 'scale-[1.02] bg-[rgba(255,255,255,0.06)] shadow-[0_20px_50px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.4)] border-white/30' : 'hover:scale-[1.01] hover:bg-[rgba(255,255,255,0.05)]'}
          `}
        >
          <div className="pl-5 flex items-center pointer-events-none text-white/50">
            <Sparkles className={`w-5 h-5 transition-colors duration-700 ${isFocused || isListening ? 'text-blue-400' : ''}`} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                setSlideOutOpen(true);
                setIsFocused(false);
              }
            }}
            placeholder={isListening ? "Listening..." : "Ask Voyage Genie AI to search..."}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="w-full bg-transparent border-none outline-none text-white placeholder-white/80 px-4 font-bold text-[15px] drop-shadow-sm"
          />

          {/* Voice Search Button */}
          <button 
            onClick={() => {
              if (isListening) {
                setIsListening(false);
              } else {
                if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                  alert("Voice search is not supported in your browser.");
                  return;
                }
                setIsListening(true);
                setQuery('');
                
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                
                recognition.onresult = (event) => {
                  let interimTranscript = '';
                  for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                      setQuery(event.results[i][0].transcript);
                      setIsListening(false);
                      setTimeout(() => setSlideOutOpen(true), 500);
                    } else {
                      interimTranscript += event.results[i][0].transcript;
                      setQuery(interimTranscript);
                    }
                  }
                };
                
                recognition.onerror = (event) => {
                  console.error('Speech recognition error', event.error);
                  setIsListening(false);
                };
                
                recognition.onend = () => {
                  setIsListening(false);
                };
                
                recognition.start();
              }
            }}
            className="pr-4 flex items-center justify-center h-full relative"
          >
            {isListening && (
              <div className="absolute inset-0 flex items-center justify-center pr-4">
                <span className="flex gap-0.5 items-center justify-center">
                  <motion.span animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-blue-400 rounded-full" />
                  <motion.span animate={{ height: [4, 24, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-purple-400 rounded-full" />
                  <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-emerald-400 rounded-full" />
                </span>
              </div>
            )}
            <Mic className={`w-5 h-5 transition-all duration-300 hover:scale-110 ${isListening ? 'opacity-0' : 'text-white/60 hover:text-white'}`} />
          </button>

          {/* Rich Auto-Complete Dropdown */}
          <AnimatePresence>
            {isFocused && query && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-[60px] left-0 w-full bg-[#0F172A]/90 backdrop-blur-[40px] border border-white/10 rounded-[24px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden z-[100]"
              >
                <div className="p-2 flex flex-col">
                  {/* AI Quick Suggestion */}
                  <button 
                    onMouseDown={() => setSlideOutOpen(true)}
                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Ask Genie about "{query}"</span>
                        <span className="text-xs text-white/50">Press Enter to chat</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                  
                  <div className="h-px w-full bg-white/10 my-2" />

                  {/* Dynamic AI Suggestions */}
                  {isSearchingAI ? (
                    <div className="w-full flex items-center justify-center p-4">
                      <div className="flex items-center gap-2 text-white/50">
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span className="text-xs font-semibold">AI is searching the globe...</span>
                      </div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      <span className="px-4 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white/40">Suggested Destinations</span>
                      {suggestions.map((sug, idx) => (
                        <button 
                          key={idx}
                          onMouseDown={(e) => { 
                            e.preventDefault();
                            generateTrip(`${sug.name}, ${sug.location}`);
                            navigate(ROUTES.TRIPS);
                            setIsFocused(false);
                            setQuery('');
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/10 transition-colors text-left group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-lg shadow-inner">
                              {sug.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                                Plan trip to <span className="font-black text-emerald-400">{sug.name}</span>
                              </span>
                              <span className="text-xs text-white/50 capitalize">{sug.type} • {sug.location}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button 
                      onMouseDown={(e) => { 
                        e.preventDefault();
                        generateTrip(query);
                        navigate(ROUTES.TRIPS);
                        setIsFocused(false);
                        setQuery('');
                      }}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/10 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                          <Map className="w-5 h-5 text-white/50" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">Plan trip to <span className="font-black text-emerald-400">{query}</span></span>
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-4">
        
        {/* Trip Readiness Score (WOW Feature) */}
        <div className="hidden xl:flex relative items-center gap-3 px-4 h-[52px] rounded-[24px] bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.06)] transition-all duration-500 cursor-default group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* Background Track */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-white/10" strokeWidth="3" />
              {/* Animated Progress Ring */}
              <motion.circle 
                cx="18" cy="18" r="16" fill="none" 
                className="stroke-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]" 
                strokeWidth="3" strokeLinecap="round"
                strokeDasharray="100.5"
                initial={{ strokeDashoffset: 100.5 }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white drop-shadow-md">{Math.round(percentage)}%</span>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/60 leading-none mb-1">Status</span>
            <span className="text-[12px] font-bold text-white drop-shadow-md leading-none group-hover:text-emerald-400 transition-colors">{percentage === 100 ? 'Ready' : 'Packing'}</span>
          </div>
        </div>

        {/* Dynamic AI Core (WOW Feature) */}
        <div className="hidden lg:flex items-center gap-3 px-4 h-[52px] bg-[rgba(255,255,255,0.02)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] border-t-[rgba(255,255,255,0.15)] rounded-[24px] mr-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_40px_rgba(0,0,0,0.1)] hover:bg-[rgba(255,255,255,0.06)] hover:border-white/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.15),inset_0_1px_2px_rgba(255,255,255,0.3)] transition-all duration-300 cursor-default group">
          <div className="relative w-7 h-7 flex items-center justify-center">
            {/* Pulsing Aura */}
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }} 
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 blur-sm"
            />
            {/* Spinning Mesh Core */}
            <motion.div 
              animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
              transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } }} 
              className="relative w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_12px_rgba(59,130,246,0.6)] flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 mix-blend-overlay" />
            </motion.div>
            <Sparkles className="absolute w-3 h-3 text-white drop-shadow-md z-10" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none mb-1">Genie AI</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
              </span>
              <span className="text-[11px] font-bold text-white drop-shadow-md leading-none">Syncing</span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex items-center justify-center w-[52px] h-[52px] rounded-[24px] bg-[rgba(255,255,255,0.03)] backdrop-blur-2xl border border-[rgba(255,255,255,0.1)] border-t-[rgba(255,255,255,0.2)] shadow-[0_10px_40px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.06)] hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            <Bell className="w-5 h-5 text-white/80" />
            <div className="absolute top-[14px] right-[14px] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
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
                  {/* Notification 1 */}
                  <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Tokyo Itinerary Ready</span>
                      <span className="text-xs text-white/60 leading-relaxed">Your 14-day Tokyo & Kyoto Explorer plan has been generated.</span>
                      <span className="text-[10px] text-white/40 font-medium">Just now</span>
                    </div>
                  </div>

                  {/* Notification 2 */}
                  <div className="flex gap-3 items-start p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Globe className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Welcome to Voyage Genie</span>
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

        {/* Profile Avatar with Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button 
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center justify-center w-[52px] h-[52px] rounded-[24px] overflow-hidden ml-2 bg-gradient-to-br from-white/20 to-white/5 border border-[rgba(255,255,255,0.2)] border-t-[rgba(255,255,255,0.4)] shadow-[0_10px_40px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-white font-bold drop-shadow-md">{getInitials(user?.name || 'User')}</span>
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
                className="absolute right-0 top-full mt-4 w-64 rounded-2xl bg-[#0F172A]/90 backdrop-blur-[40px] shadow-[0_24px_48px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] p-2 z-[200] border border-white/10"
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

      </div>
      
      <GenieSlideOut isOpen={slideOutOpen} onClose={() => setSlideOutOpen(false)} initialQuery={query} />
    </motion.header>
  );
};
