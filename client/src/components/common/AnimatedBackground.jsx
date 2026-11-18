import React from 'react';

export const AnimatedBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-blue-50/50 dark:bg-[#020617] transition-colors duration-500">
      {/* Light Mode Soft Glows - Static GPU-friendly ambient gradients */}
      <div 
        className="absolute rounded-full pointer-events-none dark:hidden" 
        style={{ 
          background: 'radial-gradient(circle, rgba(147,197,253,0.3) 0%, transparent 70%)', 
          width: '50vw', 
          height: '50vw', 
          top: '-10%', 
          left: '-10%' 
        }} 
      />
      <div 
        className="absolute rounded-full pointer-events-none dark:hidden" 
        style={{ 
          background: 'radial-gradient(circle, rgba(196,181,253,0.25) 0%, transparent 70%)', 
          width: '45vw', 
          height: '45vw', 
          bottom: '5%', 
          right: '5%' 
        }} 
      />

      {/* Dark Mode Deep Subtle Ambient Glows - Static */}
      <div 
        className="absolute rounded-full pointer-events-none hidden dark:block" 
        style={{ 
          background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', 
          width: '50vw', 
          height: '50vw', 
          top: '-10%', 
          left: '-10%' 
        }} 
      />
      <div 
        className="absolute rounded-full pointer-events-none hidden dark:block" 
        style={{ 
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', 
          width: '45vw', 
          height: '45vw', 
          bottom: '5%', 
          right: '5%' 
        }} 
      />
    </div>
  );
});
