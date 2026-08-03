import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export const GeneratingTripCard = ({ destination }) => (
  <motion.div 
    key="generating"
    initial={{ opacity: 0, scale: 0.92, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -20 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="relative w-full h-[460px] rounded-[32px] overflow-hidden transform-gpu will-change-transform max-w-lg mx-auto"
  >
    {/* Multi-layer Liquid Glass Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0e1a]/90 via-[#0d1220]/95 to-[#080c18]/90 backdrop-blur-3xl" />
    <div className="absolute inset-0 rounded-[32px] border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-1px_1px_rgba(0,0,0,0.3),0_20px_60px_rgba(0,0,0,0.5)]" />
    
    {/* Aurora Gradient — morphing color wash */}
    <div className="absolute inset-0 opacity-40 animate-[aurora_8s_ease-in-out_infinite]" style={{ background: 'radial-gradient(ellipse 80% 50% at 20% 80%, rgba(56,189,248,0.3), transparent), radial-gradient(ellipse 60% 40% at 80% 20%, rgba(168,85,247,0.25), transparent), radial-gradient(ellipse 50% 60% at 50% 50%, rgba(52,211,153,0.15), transparent)' }} />
    
    {/* Noise texture */}
    <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")' }} />

    {/* Shimmer sweep */}
    <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,transparent_40%,rgba(255,255,255,0.04)_45%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.04)_55%,transparent_60%,transparent_100%)] bg-[length:250%_100%] animate-[glass-shimmer_4s_ease-in-out_infinite]" />

    {/* Orbiting Particles */}
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} className="absolute w-1.5 h-1.5 rounded-full animate-[orbit_6s_linear_infinite]" style={{ 
          background: `radial-gradient(circle, ${['#38bdf8','#a855f7','#34d399','#f472b6','#fbbf24','#818cf8'][i]}, transparent)`,
          boxShadow: `0 0 8px ${['#38bdf8','#a855f7','#34d399','#f472b6','#fbbf24','#818cf8'][i]}`,
          animationDelay: `${i * -1}s`,
          offsetPath: 'ellipse(140px 90px)',
          offsetRotate: '0deg'
        }} />
      ))}
    </div>

    {/* Central Content */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
      
      {/* Globe with 3D depth rings */}
      <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
        {/* Outer pulsing glow */}
        <div className="absolute -inset-4 rounded-full bg-blue-500/10 animate-[pulse_3s_ease-in-out_infinite] blur-xl" />
        
        {/* Concentric rotating rings */}
        <div className="absolute inset-[-8px] rounded-full border border-white/[0.06] animate-[spin_20s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-400/60 shadow-[0_0_6px_rgba(96,165,250,0.8)]" />
        </div>
        <div className="absolute inset-[-2px] rounded-full border border-dashed border-white/[0.08] animate-[spin_15s_linear_infinite_reverse]" />
        <div className="absolute inset-[6px] rounded-full border border-white/[0.1] animate-[spin_25s_linear_infinite]">
          <div className="absolute bottom-0 right-0 w-1 h-1 rounded-full bg-purple-400/70 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
        </div>
        
        {/* Globe icon with glow */}
        <div className="relative flex items-center justify-center animate-[float_4s_ease-in-out_infinite]">
          <div className="absolute w-10 h-10 bg-blue-500/20 rounded-full blur-lg" />
          <Globe className="w-10 h-10 text-white/90 drop-shadow-[0_0_20px_rgba(96,165,250,0.6)]" strokeWidth={1.2} />
        </div>
      </div>
      
      {/* Status text with stagger animation */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex items-center gap-2 mb-5"
      >
        <div className="flex gap-[3px]">
          {[0,1,2].map(i => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-blue-400/80 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
        <h3 className="text-[11px] font-bold text-white/70 tracking-[0.3em] uppercase">Curating Journey</h3>
        <div className="flex gap-[3px]">
          {[0,1,2].map(i => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-blue-400/80 animate-[pulse_1.5s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2 + 0.6}s` }} />
          ))}
        </div>
      </motion.div>
      
      {/* Destination name with reveal */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <p className="text-[13px] text-white/40 font-medium tracking-wide mb-2">Destination</p>
        <p className="text-2xl font-extrabold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">{destination}</p>
      </motion.div>

      {/* Animated loading steps */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 flex items-center gap-3"
      >
        <div className="flex gap-1">
          {[0,1,2,3].map(i => (
            <div key={i} className="w-1 h-4 rounded-full bg-white/10 animate-[eq_1.2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <span className="text-[11px] text-white/30 font-medium tracking-wider uppercase animate-pulse">Analyzing routes & experiences</span>
      </motion.div>
    </div>
    
    {/* Scanning Laser Line — refined with blur trail */}
    <div className="absolute inset-x-0 z-10 animate-[scan_4s_ease-in-out_infinite]">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />
      <div className="h-8 bg-gradient-to-b from-blue-400/[0.07] to-transparent -mt-4" />
    </div>
    
    {/* Bottom progress bar */}
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.03] overflow-hidden z-20">
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-blue-500/70 via-purple-500/70 to-emerald-400/70 animate-[gen-progress_7s_cubic-bezier(0.4,0,0.2,1)_forwards]" />
    </div>
    
    <style>{`
      @keyframes scan {
        0% { top: -5%; opacity: 0; }
        5% { opacity: 1; }
        95% { opacity: 1; }
        100% { top: 105%; opacity: 0; }
      }
      @keyframes glass-shimmer {
        0% { background-position: 250% 0; }
        100% { background-position: -250% 0; }
      }
      @keyframes gen-progress {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(0%); }
      }
      @keyframes aurora {
        0%, 100% { opacity: 0.3; transform: scale(1) rotate(0deg); }
        33% { opacity: 0.5; transform: scale(1.1) rotate(2deg); }
        66% { opacity: 0.35; transform: scale(0.95) rotate(-2deg); }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
      @keyframes orbit {
        from { offset-distance: 0%; }
        to { offset-distance: 100%; }
      }
      @keyframes eq {
        0%, 100% { height: 4px; opacity: 0.3; }
        50% { height: 16px; opacity: 0.8; }
      }
    `}</style>
  </motion.div>
);
