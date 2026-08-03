const fs = require('fs');
let code = fs.readFileSync('D:/packwise/client/src/pages/ProfilePage.jsx', 'utf8');

// 1. Add AnimatedBackground import and glass styles
code = code.replace(
  /import \{ PageTransition \} from '@\/components\/common\/PageTransition';/,
  `import { PageTransition } from '@/components/common/PageTransition';
import { AnimatedBackground } from '@/components/common/AnimatedBackground';

const glassBase = "bg-[rgba(255,255,255,0.02)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(0,0,0,0.2),0_16px_40px_rgba(0,0,0,0.4)]";
const glassRadius = "rounded-[32px]";
const glassStyle = \`\${glassBase} \${glassRadius}\`;
const glassPill = \`\${glassBase} rounded-full\`;
const glassHover = "transition-all duration-700 ease-[cubic-bezier(0.16, 1, 0.3, 1)] hover:-translate-y-1 hover:shadow-[inset_0_2px_8px_rgba(255,255,255,0.2),inset_0_-1px_2px_rgba(0,0,0,0.2),0_12px_24px_rgba(0,0,0,0.4)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.15)] cursor-pointer";`
);

// 2. Wrap with the same background div as HomePage and remove mesh-bg
code = code.replace(
  /<PageTransition className="col-span-12 relative min-h-screen">\s*\{\/\* Ambient Mesh Background \*\/\}\s*<div className="fixed inset-0 mesh-bg z-\[-1\] pointer-events-none w-full h-full object-cover"><\/div>\s*<main className="max-w-3xl mx-auto px-4 md:px-6 pt-10 pb-24">/,
  `<div className="bg-[#020617] min-h-screen text-white overflow-x-hidden font-sans selection:bg-white/20 selection:text-white transition-colors duration-700">
      <AnimatedBackground />
      <PageTransition className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 pb-20">
        <main className="max-w-3xl mx-auto">`
);

// Close the new wrapper div at the end
code = code.replace(
  /<\/main>\s*<\/PageTransition>\s*\);\s*}/,
  `<\/main>\n      <\/PageTransition>\n    <\/div>\n  );\n}`
);

// 3. Update paddings and replace ios-glass-card and buttons
// Replace profile header padding
code = code.replace(/<section className="flex flex-col items-center justify-center space-y-4 mb-10">/, '<section className="flex flex-col items-center justify-center space-y-3 mb-6">');

// Replace stagger space
code = code.replace(/<motion.div variants=\{staggerContainer\} initial="hidden" animate="show" className="space-y-8">/, '<motion.div variants={staggerContainer} initial="hidden" animate="show" className="space-y-5">');

// Replace all ios-glass-card occurrences with standard glass styles
// Need to carefully replace className="ios-glass-card ..."
code = code.replace(/className="ios-glass-card rounded-\[24px\] p-5 (.*?)"/g, 'className={`\\${glassStyle} \\${glassHover} p-4 $1`}');
code = code.replace(/className="ios-glass-card rounded-\[24px\] p-5"/g, 'className={`\\${glassStyle} \\${glassHover} p-4`}');

// Also some might just be ios-glass-card alone
code = code.replace(/ios-glass-card/g, '${glassStyle} ${glassHover}');

// Adjust button styles
code = code.replace(/ios-liquid-button/g, '${glassPill}');
// Also replace the pill styles used for tags
code = code.replace(/ios-glass-pill/g, '${glassPill}');

fs.writeFileSync('D:/packwise/client/src/pages/ProfilePage.jsx', code);
console.log('Successfully updated ProfilePage.jsx with matching gradient bg and layout.');
