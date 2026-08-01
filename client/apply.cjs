const fs = require('fs');

let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf-8');
const hero = fs.readFileSync('hero_replacement.txt', 'utf-8');

// 1. Add user to useAuth destructuring
content = content.replace('const { isAuthenticated } = useAuth();', 'const { isAuthenticated, user } = useAuth();');

// 2. Add BottomNav import
if (!content.includes('import { BottomNav }')) {
    content = content.replace(
        "import { Navbar } from '@/components/navigation/Navbar';",
        "import { Navbar } from '@/components/navigation/Navbar';\nimport { BottomNav } from '@/components/layout/BottomNav';"
    );
}

// 3. Update main wrapper spacing
const mainOld = '<main className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-32 sm:pt-36 lg:pt-48">';
const mainNew = '<main className={`relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 ${isAuthenticated ? "pt-20 sm:pt-24 lg:pt-32" : "pt-32 sm:pt-36 lg:pt-48"}`}>';
content = content.replace(mainOld, mainNew);

// 4. Update section spacing
const sectionOld = '<section className="relative min-h-[70vh] lg:min-h-[90vh] flex flex-col justify-center pb-10 lg:pb-20">';
const sectionNew = '<section className={`relative flex flex-col justify-center pb-10 lg:pb-20 ${isAuthenticated ? "min-h-[calc(100vh-140px)] mt-4 lg:mt-8" : "min-h-[70vh] lg:min-h-[90vh]"}`}>';
content = content.replace(sectionOld, sectionNew);

// 5. Inject Authenticated Layout
const gridStartStr = '<div className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">';
const gridStartIdx = content.indexOf(gridStartStr);
const endSectionStr = '</section>';
const endSectionIdx = content.indexOf(endSectionStr, gridStartIdx);

if (gridStartIdx !== -1 && endSectionIdx !== -1) {
    const originalGrid = content.substring(gridStartIdx, endSectionIdx);
    
    const conditionalGrid = '{isAuthenticated ? (\n' + 
      '              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full mt-4 sm:mt-8">\n' +
      hero + '\n' + 
      '              </div>\n' +
      '            ) : (\n' + 
      '              ' + originalGrid + '\n' + 
      '            )}\n          ';
      
    content = content.substring(0, gridStartIdx) + conditionalGrid + content.substring(endSectionIdx);
}

// 6. Add BottomNav & Edges
const navbarStr = '<Navbar />';
const navIdx = content.indexOf(navbarStr);
if (navIdx !== -1 && !content.includes('BottomNav />')) {
    const edges = '        {/* Native-feeling static frosted glass edges */}\n' +
                  '        <div className="fixed top-0 left-0 right-0 h-[calc(10px+env(safe-area-inset-top))] z-[60] backdrop-blur-sm bg-gradient-to-b from-[#030712]/90 to-transparent pointer-events-none" />\n' +
                  '        <div className="fixed bottom-0 left-0 right-0 h-[calc(10px+env(safe-area-inset-bottom))] z-[60] backdrop-blur-sm bg-gradient-to-t from-[#030712]/90 to-transparent pointer-events-none" />\n\n' +
                  '        <Navbar />\n' +
                  '        {isAuthenticated && <BottomNav />}';
    content = content.replace(navbarStr, edges);
}

fs.writeFileSync('src/pages/HomePage.jsx', content);
console.log("Node script completed.");
