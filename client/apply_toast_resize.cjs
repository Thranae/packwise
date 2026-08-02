const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Change the Toast Container to top-right corner
appContent = appContent.replace(
    'className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] flex flex-col items-center justify-center gap-4 pointer-events-none w-[90%] sm:w-auto min-w-[300px] max-w-md"',
    'className="fixed top-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none w-[90%] sm:w-auto max-w-sm"'
);

// 2. Reduce the size and padding of the toast
appContent = appContent.replace(
    "'pointer-events-auto flex items-center justify-center text-center gap-3 rounded-[24px] border border-white/20 px-6 py-5 shadow-[0_20px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-xl bg-[#030712]/80',",
    "'pointer-events-auto flex items-center gap-3 rounded-[16px] border border-white/10 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-lg bg-[#030712]/90',"
);
appContent = appContent.replace(
    "'text-base font-semibold transition-all w-full relative overflow-hidden',",
    "'text-sm font-medium transition-all w-full relative overflow-hidden',"
);

// 3. Update the In/Out Animation for sliding in from the right/top
appContent = appContent.replace(
    "initial={{ opacity: 0, scale: 0.85, y: 15 }}",
    "initial={{ opacity: 0, scale: 0.95, x: 20 }}"
);
appContent = appContent.replace(
    "exit={{ opacity: 0, scale: 0.9, y: 10 }}",
    "exit={{ opacity: 0, scale: 0.95, x: 20 }}"
);

fs.writeFileSync('src/App.jsx', appContent);
console.log("Toasts updated to smaller corner notifications!");
