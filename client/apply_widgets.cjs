const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// 1. Passport
content = content.replace(
    'className="absolute top-[5%] left-[-5%] z-30 hidden lg:block"',
    'className="absolute top-[-2%] left-[-2%] lg:top-[5%] lg:left-[-5%] z-30 scale-[0.6] sm:scale-75 lg:scale-100 origin-top-left"'
);

// 2. Weather
content = content.replace(
    'className="absolute top-[10%] right-[0%] z-30 hidden lg:block"',
    'className="absolute top-[20%] right-[-5%] lg:top-[10%] lg:right-[0%] z-30 scale-[0.6] sm:scale-75 lg:scale-100 origin-top-right"'
);

// 3. Flights
content = content.replace(
    'className="absolute bottom-[2%] lg:bottom-[25%] left-[-2%] lg:left-[-10%] z-40 hidden lg:block"',
    'className="absolute bottom-[-2%] left-[-2%] lg:bottom-[25%] lg:left-[-10%] z-40 scale-[0.65] sm:scale-75 lg:scale-100 origin-bottom-left"'
);

// 4. Budget
content = content.replace(
    'className="absolute bottom-[10%] right-[5%] z-40 hidden lg:block"',
    'className="absolute bottom-[25%] right-[-5%] lg:bottom-[10%] lg:right-[5%] z-40 scale-[0.65] sm:scale-75 lg:scale-100 origin-bottom-right"'
);

// 5. Suitcase
content = content.replace(
    'className="absolute bottom-[5%] left-[20%] z-30 hidden lg:block"',
    'className="absolute bottom-[5%] left-[20%] z-30 hidden lg:block"' // keep hidden on mobile since 5 is too many
);

fs.writeFileSync('src/pages/HomePage.jsx', content);
console.log("Successfully restored and positioned 4 floating widgets for mobile.");
