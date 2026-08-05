import React from 'react';

export const AnimatedBackground = React.memo(() => {
  return (
    <>
      {/* BACKGROUND - VisionOS Style Freely Moving Aurora (GPU Accelerated - OPTIMIZED) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes floatWide1 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(15vw, 10vh, 0) scale(1.1); }
        }
        @keyframes floatWide2 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-15vw, -10vh, 0) scale(1.1); }
        }
        @keyframes floatWide3 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(20vw, -20vh, 0) scale(1.05); }
        }
        @keyframes floatWide4 {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-20vw, 15vh, 0) scale(1.05); }
        }
        .vision-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          will-change: transform;
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }
      `}} />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-blue-50/50 dark:bg-[#020617] transition-colors duration-700">
        {/* Reduced number of orbs from 6 to 4, simplified animations */}
        {/* Soft White Moonlight Glows (Light mode: soft vibrant colors) */}
        <div className="vision-blob dark:hidden" style={{ background: 'radial-gradient(circle, rgba(147,197,253,0.4) 0%, transparent 70%)', width: '40vw', height: '40vw', top: '-5%', left: '-5%', animation: 'floatWide1 25s ease-in-out infinite' }} />
        <div className="vision-blob dark:hidden" style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.4) 0%, transparent 70%)', width: '35vw', height: '35vw', bottom: '10%', right: '10%', animation: 'floatWide3 30s ease-in-out infinite' }} />
        <div className="vision-blob dark:hidden" style={{ background: 'radial-gradient(circle, rgba(253,164,175,0.3) 0%, transparent 70%)', width: '50vw', height: '50vw', top: '20%', left: '20%', animation: 'floatWide2 28s ease-in-out infinite' }} />
        <div className="vision-blob dark:hidden" style={{ background: 'radial-gradient(circle, rgba(253,186,116,0.3) 0%, transparent 70%)', width: '55vw', height: '55vw', bottom: '-10%', right: '-10%', animation: 'floatWide4 32s ease-in-out infinite' }} />

        {/* Deep Dark Combos - Reduced opacity and size */}
        <div className="vision-blob hidden dark:block" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', width: '40vw', height: '40vw', top: '-5%', left: '-5%', animation: 'floatWide1 25s ease-in-out infinite' }} />
        <div className="vision-blob hidden dark:block" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', width: '35vw', height: '35vw', bottom: '10%', right: '10%', animation: 'floatWide3 30s ease-in-out infinite' }} />
        <div className="vision-blob hidden dark:block" style={{ background: 'radial-gradient(circle, rgba(51,65,85,0.3) 0%, transparent 70%)', width: '50vw', height: '50vw', top: '20%', left: '20%', animation: 'floatWide2 28s ease-in-out infinite' }} />
        <div className="vision-blob hidden dark:block" style={{ background: 'radial-gradient(circle, rgba(49,46,129,0.35) 0%, transparent 70%)', width: '55vw', height: '55vw', bottom: '-10%', right: '-10%', animation: 'floatWide4 32s ease-in-out infinite' }} />

        {/* Removed Dotted Texture Overlay for performance */}
      </div>
    </>
  );
});
