import React from 'react';

export const AnimatedBackground = React.memo(() => {
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
          pointer-events: none;
        }
      `}} />
      
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020617] transition-colors duration-700">
        {/* Soft White Moonlight Glows */}
        <div className="vision-blob" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', width: '50vw', height: '50vw', top: '-10%', left: '-10%', animation: 'floatWide1 20s ease-in-out infinite' }} />
        <div className="vision-blob" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', width: '40vw', height: '40vw', bottom: '10%', right: '10%', animation: 'floatWide3 25s ease-in-out infinite' }} />
        
        {/* Deep Dark Combos (Slate & Indigo) that suit the background */}
        <div className="vision-blob" style={{ background: 'radial-gradient(circle, rgba(51,65,85,0.4) 0%, transparent 70%)', width: '60vw', height: '60vw', top: '20%', left: '20%', animation: 'floatWide2 22s ease-in-out infinite' }} />
        <div className="vision-blob" style={{ background: 'radial-gradient(circle, rgba(49,46,129,0.5) 0%, transparent 70%)', width: '70vw', height: '70vw', bottom: '-20%', right: '-20%', animation: 'floatWide4 28s ease-in-out infinite' }} />
        <div className="vision-blob" style={{ background: 'radial-gradient(circle, rgba(39,39,42,0.4) 0%, transparent 70%)', width: '55vw', height: '55vw', top: '-20%', right: '10%', animation: 'floatWide1 24s ease-in-out infinite reverse' }} />
        
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
});
