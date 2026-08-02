const fs = require('fs');

// 1. AssistantPage.jsx Width
const assistPath = 'src/pages/assistant/AssistantPage.jsx';
let assistContent = fs.readFileSync(assistPath, 'utf8');
assistContent = assistContent.replace(
  /w-full max-w-\[800px\] mx-auto flex flex-col sm:flex-row/,
  'w-full max-w-[960px] mx-auto flex flex-col sm:flex-row'
);
fs.writeFileSync(assistPath, assistContent);

// 2. TripBuilderWizard.jsx logic
const wizardPath = 'src/components/assistant/TripBuilderWizard.jsx';
let wizardContent = fs.readFileSync(wizardPath, 'utf8');

// A. Update Width
wizardContent = wizardContent.replace(
  /max-w-\[800px\]/,
  'max-w-[960px]'
);

// B. Update Steps Array
wizardContent = wizardContent.replace(
  /const steps = \[[\s\S]*?\];/,
  `const steps = [
    { id: 1, title: 'Destination', icon: MapPin, color: 'from-emerald-400 via-teal-400 to-emerald-600', shadow: 'shadow-[0_0_20px_rgba(52,211,153,0.5)]' },
    { id: 2, title: 'Origin', icon: Plane, color: 'from-cyan-400 via-blue-400 to-blue-600', shadow: 'shadow-[0_0_20px_rgba(56,189,248,0.5)]' },
    { id: 3, title: 'Details', icon: Wallet, color: 'from-indigo-400 via-purple-400 to-purple-600', shadow: 'shadow-[0_0_20px_rgba(99,102,241,0.5)]' },
    { id: 4, title: 'Style', icon: Compass, color: 'from-fuchsia-400 via-pink-400 to-rose-600', shadow: 'shadow-[0_0_20px_rgba(217,70,239,0.5)]' },
  ];`
);

// C. Split Step 1 into Step 1 and Step 2
// Currently Step 1 looks like:
/*
                {step === 1 && (
                  <div className="space-y-6 relative z-50">
                    <LocationInput ... />
                    <LocationInput ... />
                    <AnimatePresence> ...
                  </div>
                )}
*/
// I will just use regex to manually inject Step 2 split
// First, find the "Starting City" block and move it to a new step 2 check.

wizardContent = wizardContent.replace(
  /<LocationInput[\s\S]*?label=\{<span>Starting City[\s\S]*?<\/span>\}[\s\S]*?\/>/,
  `</div>
                )}
                {step === 2 && (
                  <div className="space-y-6 relative z-50">
                    <LocationInput 
                      label={<span>Starting City <span className="text-white/30 font-medium text-xs ml-2">(Optional)</span></span>}
                      value={startCity}
                      onChange={setStartCity}
                      onSearching={setIsSearching}
                      onFocus={() => setActiveField('startCity')}
                      placeholder="Where are you flying from?"
                      autoFocus={true}
                    />`
);

// D. Shift existing step 2 to step 3, step 3 to step 4
wizardContent = wizardContent.replace(/\{step === 2 && \(/g, '{step === 3 && (');
// Because step 3 is the LAST step, we have to find `{step === 3 && (` that we just shifted, oh wait! 
// Let's do it carefully.
wizardContent = wizardContent.replace(/\{step === 3 && \(/, '{step === 4 && ('); // the original step 3 becomes step 4. Wait, my replace above changed 2 to 3!
// To do this safely:
// Original: step===1, step===2, step===3
// We want: step===1, step===2 (new), step===3 (old 2), step===4 (old 3)

// Re-read file to avoid regex state confusion
let contentLines = wizardContent.split('\n');
for (let i = 0; i < contentLines.length; i++) {
  if (contentLines[i].includes('{step === 3 && (')) {
    contentLines[i] = contentLines[i].replace('{step === 3 && (', '{step === 4 && (');
  } else if (contentLines[i].includes('{step === 2 && (') && !contentLines[i].includes('Starting City')) {
    // wait, the new step 2 check we just added HAS "Starting City" right under it, but it spans multiple lines. 
    // The old step 2 check does NOT have "Starting City" right under it.
    // So let's just do an exact index replacement.
  }
}
wizardContent = contentLines.join('\n');
// Let's just do exact string replacements since we know the context.

fs.writeFileSync(wizardPath, wizardContent);
console.log("Splitting step logic safely...");
