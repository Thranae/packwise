import React from 'react';

export const AnimatedBackground = () => {
  return (
    <>
      {/* BACKGROUND - VisionOS Style Freely Moving Aurora */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatWide1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(25vw, 15vh) scale(1.2); }
          66% { transform: translate(-20vw, 30vh) scale(0.9); }
        }
        @keyframes floatWide2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30vw, -20vh) scale(1.3); }
          66% { transform: translate(25vw, -30vh) scale(0.8); }
        }
        @keyframes floatWide3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(35vw, -35vh) scale(0.9); }
          66% { transform: translate(-30vw, 20vh) scale(1.4); }
        }
        @keyframes floatWide4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-20vw, 25vh) scale(1.1); }
          66% { transform: translate(30vw, -15vh) scale(1.2); }
        }
        .vision-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(140px);
          pointer-events: none;
        }
      `}} />
      
      <div className="fixed inset-0 z-0 bg-[#020617] overflow-hidden pointer-events-none transition-colors duration-1000">
        {/* Soft White Moonlight Glows */}
        <div className="vision-blob bg-white opacity-20" style={{ width: '50vw', height: '50vw', top: '-10%', left: '-10%', animation: 'floatWide1 20s ease-in-out infinite' }} />
        <div className="vision-blob bg-white opacity-15" style={{ width: '40vw', height: '40vw', bottom: '10%', right: '10%', animation: 'floatWide3 25s ease-in-out infinite' }} />
        
        {/* Deep Dark Combos (Slate & Indigo) that suit the background */}
        <div className="vision-blob bg-slate-700 opacity-40" style={{ width: '60vw', height: '60vw', top: '20%', left: '20%', animation: 'floatWide2 22s ease-in-out infinite' }} />
        <div className="vision-blob bg-indigo-900 opacity-50" style={{ width: '70vw', height: '70vw', bottom: '-20%', right: '-20%', animation: 'floatWide4 28s ease-in-out infinite' }} />
        <div className="vision-blob bg-zinc-800 opacity-40" style={{ width: '55vw', height: '55vw', top: '-20%', right: '10%', animation: 'floatWide1 24s ease-in-out infinite reverse' }} />
        
        {/* Dotted Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{ 
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
      </div>
    </>
  );
};
