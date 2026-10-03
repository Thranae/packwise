const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, 'unpacked_template', 'ppt', 'slides');

// Round 2: Fix remaining mismatches
const replacements = [
    // Slide 3 - remaining
    ["Traditional tools mostly focus on grammar correction.", "Traditional travel tools mostly focus on booking independent services."],
    ["Packwise provides a simple solution to rewrite and improve text", "Packwise provides a simple solution to create and manage travel plans"],
    
    // Slide 7 - lowercase "rewordly"
    ["rewordly", "packwise"],
    
    // Slide 8 - remaining  
    ["The rewriter,rewrites the", "The planner, plans the trip"],
    ["sentence in 4 different ways", "in detail day by day"],
    ["User enters destination &amp; dates", "User enters destination &amp; dates"],
    
    // Slide 6 - flow diagram labels shouldn't need changes, they're generic
    
    // Clean up the "46f7qsxi" watermark text if desired (this appears to be a Google Slides ID)
];

const files = fs.readdirSync(slidesDir).filter(f => f.endsWith('.xml'));

files.forEach(file => {
    const filePath = path.join(slidesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let changeCount = 0;
    for (const [search, replace] of replacements) {
        if (content.includes(search)) {
            content = content.split(search).join(replace);
            changeCount++;
        }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    if (changeCount > 0) console.log(`${file}: ${changeCount} replacements`);
});

console.log('\nRound 2 done!');
