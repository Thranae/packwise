const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// 1. Fix AI Prompt Bar max width
content = content.replace(
    'className="mt-6 w-full max-w-md relative group"',
    'className="mt-6 w-full max-w-[85vw] sm:max-w-md relative group"'
);

// 2. Fix Authenticated Trip Card max width
content = content.replace(
    'className="w-full max-w-sm relative z-20"',
    'className="w-full max-w-[85vw] sm:max-w-sm relative z-20"'
);

// 3. Just to be absolutely sure the main container doesn't overflow horizontally on mobile
content = content.replace(
    'className="relative z-10 w-full max-w-[1440px]',
    'className="relative z-10 w-full max-w-[1440px] overflow-hidden sm:overflow-visible'
);

fs.writeFileSync('src/pages/HomePage.jsx', content);
console.log("Fixed mobile clipping issues via max-w-[85vw]");
