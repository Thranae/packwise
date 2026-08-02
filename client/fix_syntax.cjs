const fs = require('fs');
const wizardPath = 'src/components/assistant/TripBuilderWizard.jsx';
let wizardContent = fs.readFileSync(wizardPath, 'utf8');

wizardContent = wizardContent.replace(
  /className=\{\`absolute z-\[100\] left-0 right-0 \$\{activeField === "startCity" \? "top-\[175px\]" : "top-\[85px\]"\} bg-black\/80 backdrop-blur-3xl border border-white\/20 rounded-\[24px\] p-3 shadow-\[0_20px_60px_rgba\(0,0,0,0\.8\),inset_0_2px_10px_rgba\(255,255,255,0\.1\)\]"/g,
  'className={`absolute z-[100] left-0 right-0 ${activeField === "startCity" ? "top-[175px]" : "top-[85px]"} bg-black/80 backdrop-blur-3xl border border-white/20 rounded-[24px] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.1)]`}'
);

fs.writeFileSync(wizardPath, wizardContent);
console.log("Syntax fixed!");
