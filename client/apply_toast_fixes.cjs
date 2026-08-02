const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Change the Toast Container from bottom-right to dead-center
appContent = appContent.replace(
    'className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"',
    'className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] flex flex-col items-center justify-center gap-4 pointer-events-none w-[90%] sm:w-auto min-w-[300px] max-w-md"'
);

// 2. Make the toast design itself more like a sleek "modal card" (larger padding, centered text, heavier shadow)
appContent = appContent.replace(
    "'pointer-events-auto flex items-center gap-3 rounded-xl border px-5 py-3 shadow-lg backdrop-blur-sm',",
    "'pointer-events-auto flex items-center justify-center text-center gap-3 rounded-[24px] border border-white/20 px-6 py-5 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-xl bg-[#030712]/80',"
);
appContent = appContent.replace(
    "'text-sm font-medium transition-all',",
    "'text-base font-semibold transition-all w-full relative overflow-hidden',"
);

// 3. Improve the In/Out Animation to feel like a modal pop
appContent = appContent.replace(
    "initial={{ opacity: 0, y: 20, scale: 0.95 }}",
    "initial={{ opacity: 0, scale: 0.85, y: 15 }}"
);
appContent = appContent.replace(
    "exit={{ opacity: 0, y: -10, scale: 0.95 }}",
    "exit={{ opacity: 0, scale: 0.9, y: 10 }}"
);

fs.writeFileSync('src/App.jsx', appContent);
console.log("Toasts are now centered modal cards!");
