const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  {
    file: 'src/pages/assistant/AssistantPage.jsx',
    replacements: [
      { find: 'pb-[90px] sm:pb-12 pt-6', replace: 'pb-[90px] sm:pb-12 pt-[calc(24px+env(safe-area-inset-top))] md:pt-6' }
    ]
  },
  {
    file: 'src/pages/authentication/OnboardingPage.jsx',
    replacements: [
      { find: 'flex-col pt-8 pb-20', replace: 'flex-col pt-[calc(24px+env(safe-area-inset-top))] md:pt-8 pb-20' }
    ]
  },
  {
    file: 'src/pages/budget/CostIntelligencePage.jsx',
    replacements: [
      { find: 'pb-20 px-4 pt-6', replace: 'pb-20 px-4 pt-[calc(24px+env(safe-area-inset-top))] md:pt-6' }
    ]
  },
  {
    file: 'src/pages/calendar/CalendarPage.jsx',
    replacements: [
      { find: 'flex-col pt-8 pb-28', replace: 'flex-col pt-[calc(32px+env(safe-area-inset-top))] md:pt-8 pb-28' }
    ]
  },
  {
    file: 'src/pages/explore/ExplorePage.jsx',
    replacements: [
      { find: 'flex-col pt-8 pb-20 relative', replace: 'flex-col pt-[calc(32px+env(safe-area-inset-top))] md:pt-8 pb-20 relative' }
    ]
  },
  {
    file: 'src/pages/flights/FlightsPage.jsx',
    replacements: [
      { find: 'flex-col pt-8 pb-20', replace: 'flex-col pt-[calc(32px+env(safe-area-inset-top))] md:pt-8 pb-20' }
    ]
  },
  {
    file: 'src/pages/journal/JournalPage.jsx',
    replacements: [
      { find: 'px-4 md:px-8 py-8 md:py-12', replace: 'px-4 md:px-8 pb-8 md:pb-12 pt-[calc(32px+env(safe-area-inset-top))] md:pt-12' }
    ]
  },
  {
    file: 'src/pages/packing/PackingPage.jsx',
    replacements: [
      { find: '<div className="w-full pt-8 pb-24">', replace: '<div className="w-full pt-[calc(32px+env(safe-area-inset-top))] md:pt-8 pb-24">' }
    ]
  },
  {
    file: 'src/pages/public/SharedTripPage.jsx',
    replacements: [
      { find: 'items-center justify-center p-6 text-center', replace: 'items-center justify-center px-6 pb-6 pt-[calc(24px+env(safe-area-inset-top))] md:pt-6 text-center' }
    ]
  },
  {
    file: 'src/pages/ProfilePage.jsx',
    replacements: [
      { find: 'mx-auto px-6 py-8 md:py-12', replace: 'mx-auto px-6 pb-8 md:pb-12 pt-[calc(32px+env(safe-area-inset-top))] md:pt-12' }
    ]
  }
];

filesToUpdate.forEach(({ file, replacements }) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    replacements.forEach(({ find, replace }) => {
      if (content.includes(find)) {
        content = content.replace(find, replace);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`No replacements made in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
