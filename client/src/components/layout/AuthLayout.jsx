import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { LogoIcon } from '../ui/Logo';
import { Cloud, Plane, FileCheck } from 'lucide-react';
import { Image } from '../ui/Image';
import { ThemeToggle } from '../navigation/ThemeToggle';
import { AnimatedBackground } from '../common/AnimatedBackground';

export const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--theme-bg-base)] text-[var(--theme-text-primary)] font-sans overflow-hidden p-6 sm:p-10 relative">
      
      {/* Global Background */}
      <AnimatedBackground />

      {/* Floating Theme Toggle (Top Right) */}
      <div className="absolute top-8 right-8 z-30">
        <ThemeToggle />
      </div>
      
      {/* Ambient background glows - Simplified to prevent lag */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none" />
      
      {/* 
        ONE Premium Integrated Floating Container 
        Width: ~800px total (400px image + 400px login card)
      */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[800px] flex flex-col lg:flex-row overflow-hidden rounded-[24px] ios-glass-card shadow-2xl"
      >

        {/* LEFT PANEL: Travel Image & Widgets */}
        <div className="relative hidden lg:flex lg:w-1/2 shrink-0 flex-col overflow-hidden bg-black/20 z-10">
          
          {/* Premium Landscape Image (e.g., Hallstatt / Swiss Alps - No People) */}
          <div className="absolute inset-0">
            <Image 
              src="https://images.unsplash.com/photo-1527668752968-14dc70a27c95?q=80&w=2070&auto=format&fit=crop"
              alt="Premium Travel Landscape"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlays for depth and readability */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/10" />

          {/* Top-Left Logo */}
          <div className="relative z-20 p-8">
            <Link to={ROUTES.HOME} className="flex items-center gap-2 w-fit hover:opacity-80 transition-opacity">
              <LogoIcon size="sm" className="text-white" />
              <span className="font-extrabold tracking-tight text-white text-xl">
                Voyage Genie<span className="text-[var(--color-accent)]">.</span>
              </span>
            </Link>
          </div>

          {/* Micro-Interaction Floating Widgets */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Weather */}
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[25%] left-[55%] flex items-center gap-2 bg-[var(--theme-bg-glass)] backdrop-blur-[12px] border border-[var(--theme-border-subtle)] px-3 py-1.5 rounded-full shadow-lg"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-300" />
              <span className="text-white font-medium text-[11px] tracking-wide">22°C Clear</span>
            </motion.div>

            {/* Passport */}
            <motion.div 
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[40%] right-[10%] flex items-center gap-2 bg-[var(--theme-bg-glass)] backdrop-blur-[12px] border border-[var(--theme-border-subtle)] px-3 py-1.5 rounded-full shadow-lg"
            >
              <FileCheck className="w-3.5 h-3.5 text-purple-300" />
              <span className="text-white font-medium text-[11px] tracking-wide">Passport Ready</span>
            </motion.div>

            {/* Flight */}
            <motion.div 
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute top-[50%] left-[20%] flex items-center gap-2 bg-[var(--theme-bg-glass)] backdrop-blur-[12px] border border-[var(--theme-border-subtle)] px-3 py-1.5 rounded-full shadow-lg"
            >
              <Plane className="w-3.5 h-3.5 text-blue-200" />
              <span className="text-white font-medium text-[11px] tracking-wide">Flight On Time</span>
            </motion.div>
          </div>

          {/* Bottom Headline */}
          <div className="relative z-20 p-8 mt-auto pb-10">
            <h1 className="text-3xl font-bold leading-tight text-white tracking-tight mb-2">
              Plan journeys, not spreadsheets.
            </h1>
            <p className="text-[14px] text-white/80 font-normal leading-relaxed">
              AI-powered trip planning that organizes your itinerary into one intelligent workspace.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Login Card */}
        <div className="relative w-full lg:w-1/2 flex items-center justify-center p-8 z-10 bg-transparent">
          <div className="w-full max-w-[380px]">
            {children}
          </div>
        </div>
        
      </motion.div>
    </div>
  );
};
