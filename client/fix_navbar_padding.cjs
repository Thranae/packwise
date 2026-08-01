const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// The Navbar is fixed and covers the top of the screen. pt-10 (40px) was hiding the welcome message under it!
// Reverting to pt-24 (96px) to ensure it clears the navbar safely on mobile.
content = content.replace(
    'className={`relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 ${isAuthenticated ? "pt-10 sm:pt-20 lg:pt-32" : "pt-32 sm:pt-36 lg:pt-48"}`}',
    'className={`relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 ${isAuthenticated ? "pt-24 sm:pt-28 lg:pt-32" : "pt-32 sm:pt-36 lg:pt-48"}`}'
);

fs.writeFileSync('src/pages/HomePage.jsx', content);
console.log("Reverted padding to prevent hiding under navbar.");
