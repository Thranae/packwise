const fs = require('fs');
const path = 'src/components/assistant/TripBuilderWizard.jsx';
const content = fs.readFileSync(path, 'utf8');

let newContent = content.replace(
  /const steps = \[[\s\S]*?\];/,
  `const steps = [
    { id: 1, title: 'Destination', icon: MapPin, color: 'from-emerald-400 via-teal-400 to-emerald-600', shadow: 'shadow-[0_0_20px_rgba(52,211,153,0.5)]' },
    { id: 2, title: 'Details', icon: Wallet, color: 'from-blue-400 via-indigo-400 to-blue-600', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]' },
    { id: 3, title: 'Style', icon: Compass, color: 'from-fuchsia-400 via-purple-400 to-fuchsia-600', shadow: 'shadow-[0_0_20px_rgba(192,132,252,0.5)]' },
  ];`
);

// Update step rendering to look extremely 3D and premium
newContent = newContent.replace(
  /\{steps\.map\(\(s\) => \{[\s\S]*?return \([\s\S]*?<div key=\{s\.id\}[\s\S]*?<\/div>[\s\S]*?\)[\s\S]*?\}\)/,
  `{steps.map((s) => {
            const isActive = step === s.id;
            const isPast = step > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-3 w-16 relative">
                {isActive && (
                  <div className="absolute top-0 w-12 h-12 bg-white/20 rounded-full blur-xl animate-pulse" />
                )}
                <div className={\`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 \${
                  isActive || isPast 
                    ? \`bg-gradient-to-br \${s.color} text-white \${s.shadow} scale-110 rotate-3\` 
                    : 'bg-black/40 text-white/40 border border-white/5'
                }\`}
                style={{
                  boxShadow: isActive || isPast ? 'inset 0px 2px 4px rgba(255,255,255,0.6), inset 0px -4px 8px rgba(0,0,0,0.4), 0px 10px 20px rgba(0,0,0,0.5)' : 'inset 0px 1px 2px rgba(255,255,255,0.05)',
                  transformStyle: 'preserve-3d'
                }}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/30 to-transparent opacity-50" />
                  <s.icon className={\`w-5 h-5 transition-transform duration-300 \${isActive ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] scale-110' : ''}\`} style={{ transform: 'translateZ(10px)' }} />
                </div>
                <span className={\`text-[10px] font-black tracking-widest uppercase transition-all duration-300 \${isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-110' : isPast ? 'text-white/80' : 'text-white/30'}\`}>{s.title}</span>
              </div>
            );
          })}`
);

// Update Budget buttons to look 3D
newContent = newContent.replace(
  /\{budget === b[\s\S]*?'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'[\s\S]*?: 'text-white\/50 hover:text-white\/80 hover:bg-white\/5'[\s\S]*?\}/,
  `{budget === b 
    ? 'bg-gradient-to-b from-blue-400 to-indigo-600 text-white scale-105 border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.3),0_8px_16px_rgba(0,0,0,0.4)] rotate-1' 
    : 'bg-black/20 text-white/50 border border-transparent shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] hover:bg-white/5'}`
);

// Update Style buttons to look 3D
newContent = newContent.replace(
  /\{styles\.includes\(style\)[\s\S]*?'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105 border border-transparent'[\s\S]*?: 'bg-black\/40 text-white\/60 hover:text-white hover:bg-white\/10 border border-white\/10'[\s\S]*?\}/,
  `{styles.includes(style)
    ? 'bg-gradient-to-b from-emerald-400 to-teal-600 text-white scale-105 border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.3),0_8px_16px_rgba(0,0,0,0.4)] -rotate-1' 
    : 'bg-black/20 text-white/50 border border-white/5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] hover:text-white hover:bg-white/10'}`
);

// Update main card container to look more premium
newContent = newContent.replace(
  /className="relative w-full bg-\[\#050B14\]\/80 backdrop-blur-2xl border border-white\/10 rounded-\[32px\] p-6 sm:p-10 shadow-\[0_20px_60px_rgba\(0,0,0,0\.5\),inset_0_2px_10px_rgba\(255,255,255,0\.05\)\] flex flex-col overflow-hidden"/,
  'className="relative w-full bg-[#050B14]/60 backdrop-blur-[30px] border border-white/10 border-t-white/20 rounded-[40px] p-6 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.8),inset_0_2px_20px_rgba(255,255,255,0.1)] flex flex-col overflow-hidden"'
);

fs.writeFileSync(path, newContent);
console.log("TripBuilderWizard successfully upgraded to ultra-premium 3D styling without lag!");
