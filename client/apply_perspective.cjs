const fs = require('fs');
const path = 'src/components/assistant/TripBuilderWizard.jsx';
const content = fs.readFileSync(path, 'utf8');

// Ensure perspective is added to the flex container so translateZ actually works
let newContent = content.replace(
  /<div key=\{s\.id\} className="flex flex-col items-center gap-3 w-16 relative">/,
  '<div key={s.id} className="flex flex-col items-center gap-3 w-16 relative" style={{ perspective: "1000px" }}>'
);

fs.writeFileSync(path, newContent);
console.log("TripBuilderWizard 3D perspective applied!");
