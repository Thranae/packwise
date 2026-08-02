const fs = require('fs');

// 1. Fix AssistantPage.jsx
const assistPath = 'src/pages/assistant/AssistantPage.jsx';
let assistContent = fs.readFileSync(assistPath, 'utf8');

assistContent = assistContent.replace(
  /w-full max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-10 z-20 relative shrink-0/,
  'w-full max-w-[800px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mb-4 sm:mb-8 z-20 relative shrink-0'
);
// Make the title center-aligned if it's not
assistContent = assistContent.replace(
  /<div className="flex flex-col items-start">/,
  '<div className="flex flex-col items-center sm:items-start text-center sm:text-left">'
);

fs.writeFileSync(assistPath, assistContent);


// 2. Fix TripBuilderWizard.jsx
const wizardPath = 'src/components/assistant/TripBuilderWizard.jsx';
let wizardContent = fs.readFileSync(wizardPath, 'utf8');

// A. Straighten icons and step container
wizardContent = wizardContent.replace(/scale-110 rotate-3/g, 'scale-110');
wizardContent = wizardContent.replace(/-rotate-1/g, '');
wizardContent = wizardContent.replace(/rotate-1/g, '');

// B. Card Polish (Cleaner Liquid Glass)
wizardContent = wizardContent.replace(
  /bg-black\/20 backdrop-blur-\[40px\] border border-white\/20 border-t-white\/30 rounded-\[40px\] p-6 sm:p-8 shadow-\[0_16px_40px_rgba\(0,0,0,0\.6\),inset_0_2px_10px_rgba\(255,255,255,0\.15\)\]/,
  'bg-white/[0.04] backdrop-blur-[50px] border border-white/10 border-t-white/20 rounded-[40px] p-6 sm:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_4px_rgba(255,255,255,0.1)]'
);

// C. Fix Dropdown positioning (Glitch and Accuracy)
// We need to wrap each input and its suggestions in a relative div.
// Wait, suggestions are shared right now between the two inputs!
// Let's change the dropdown from top-[170px] to top-[80px] and we will manually wrap them.
// Actually, it's better to just give the input area a relative container.
// In the current code, they are in: <div className="space-y-6 relative z-50">
// We will change the dropdown position from:
// className="absolute z-[100] left-0 right-0 top-[170px] bg-black/60 ...
// to
// className="absolute z-[100] left-0 right-0 top-[175px] bg-black/60 ...
// Wait! If they click the first input, it's at top-[80px]. If they click the second, it's lower.
// To fix this cleanly via regex without rewriting the whole component:

wizardContent = wizardContent.replace(
  /className="absolute z-\[100\] left-0 right-0 top-\[170px\] bg-black\/60/g,
  'className={`absolute z-[100] left-0 right-0 ${activeField === "startCity" ? "top-[175px]" : "top-[85px]"} bg-black/80'
);

fs.writeFileSync(wizardPath, wizardContent);
console.log("Fixes applied successfully!");
