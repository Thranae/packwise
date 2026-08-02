const fs = require('fs');

let homeContent = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');

// 1. Update the context destructuring
homeContent = homeContent.replace(
    'const { trips, isGenerating } = useTripContext();',
    'const { trips, currentTrip, isGenerating } = useTripContext();'
);

// 2. Prioritize currentTrip for nextTrip
homeContent = homeContent.replace(
    'const nextTrip = trips && trips.length > 0 ? trips[0] : null;',
    'const nextTrip = currentTrip || (trips && trips.length > 0 ? trips[0] : null);'
);

// 3. Change routing from ROUTES.TRIPS to ROUTES.OVERVIEW for the View Itinerary buttons
// There are a few Link tags with to={ROUTES.TRIPS} inside the trip card
homeContent = homeContent.replace(
    /<Link to=\{ROUTES\.TRIPS\} className="relative z-10 mt-4 block">/g,
    '<Link to={ROUTES.OVERVIEW} className="relative z-10 mt-4 block">'
);

fs.writeFileSync('src/pages/HomePage.jsx', homeContent);
console.log("HomePage updated to show currentTrip and route to OVERVIEW!");
