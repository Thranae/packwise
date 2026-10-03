const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, 'unpacked_template', 'ppt', 'slides');

// These are exact strings found inside <a:t> tags in the XML.
// The key is the original text and the value is the replacement.
// We do the longer strings first to avoid partial matches.
const replacements = [
    // Slide 1 - Title
    ["Title: Rewordly", "Title: Packwise"],
    
    // Slide 2 - Abstract
    ["Rewordly is a web-based text rewriting system.", "Packwise is a web-based AI-powered travel companion."],
    ["The system helps users improve sentence clarity and readability.", "The system helps users plan personalized travel itineraries seamlessly."],
    ["Users can enter text and receive a better rewritten version.", "Users can enter preferences and receive a detailed day-by-day plan."],
    ["The project is developed using HTML, CSS, JavaScript, and MySQL.", "The project is developed using MongoDB, Express, React, Node.js, and GenAI."],
    ["The main goal is to improve communication quality through an easy web", "The main goal is to improve trip planning quality through an easy web"],
    
    // Slide 3 - Introduction
    ["Clear communication is very important in digital platforms.", "Trip planning is very complex and time-consuming in digital platforms."],
    ["Many users find it difficult to rewrite sentences clearly.", "Many users find it difficult to organize flights, hotels, and activities."],
    ["Traditional text editors mostly focus on grammar correction.", "Traditional travel tools mostly focus on booking independent services."],
    ["They do not effectively improve sentence structure.", "They do not effectively connect various aspects of a trip together."],
    ["Rewordly provides a simple solution to rewrite and improve text.", "Packwise provides a simple solution to create and manage travel plans."],
    
    // Slide 4 - Existing Methodology
    ["Traditional text editors require manual rewriting.", "Traditional travel planning requires browsing multiple websites."],
    ["Most tools only check spelling and grammar.", "Most tools only offer generic location recommendations."],
    ["Limited support for improving sentence structure.", "Limited support for generating end-to-end itineraries."],
    ["Some tools are complex and difficult to use.", "Some tools are complex and difficult to use for travelers."],
    ["Time consuming", "Time consuming"],
    ["Limited rewriting support", "Limited personalization"],
    ["Poor user experience", "Fragmented user experience"],
    
    // Slide 5 - Proposed Methodology
    ["Rewordly provides a simple web-based rewriting platform.", "Packwise provides a simple web-based AI planning platform."],
    ["Users can easily input text through the website.", "Users can easily input travel preferences through the website."],
    ["The system processes the input and improves sentence structure.", "The system processes the input and creates an optimal travel plan."],
    ["Easy to use interface", "Easy to use interface"],
    ["Fast text processing", "Fast AI processing"],
    ["Improved sentence clarity", "Improved plan clarity"],
    ["Better readability", "Better personalization"],
    
    // Slide 6 - Flow of Process (these are in the flow diagram boxes)
    // Most flow boxes are generic enough to keep, but let's update the specific ones
    
    // Slide 7 - Technical Method
    ["HTML – Used to create the structure of web pages", "React – Used to create the dynamic structure of web pages"],
    ["CSS – Used for styling and layout design", "Tailwind CSS – Used for rapid styling and layout design"],
    ["JavaScript – Used for interaction and text processing", "GSAP / Motion – Used for fluid interaction and animations"],
    ["MySQL – Used to store user data and system information", "MongoDB – Used to store user data, trips, and system info"],
    ["Client-side Processing – JavaScript processes user input quickly without", "Generative AI – Google Gemini processes preferences into detailed"],
    ["reloading the page.", "travel plans quickly."],
    
    // Slide 8 - Input / Output
    ["User types a sentence", "User enters destination &amp; dates"],
    ["can you write my assignments?", "Where should I go in Tokyo for 5 days?"],
    ["The rewriter,rewrites the sentence in 4 different ways", "The planner plans the trip in detail"],
    ["Professional", "Day 1: Arrival"],
    ["Could you please assist me with completing my assignments?", "Morning: Check in at hotel, explore Shinjuku area"],
    ["Polite", "Day 2: Culture"],
    ["Would you mind helping me with my assignments?", "Visit Senso-ji temple, Asakusa, TeamLab Borderless"],
    ["Confident", "Day 3: Nature"],
    ["I need someone to help me complete my assignments efficiently.", "Day trip to Mount Fuji, Hakone hot springs"],
    ["Emotional", "Day 4: Shopping"],
    ["I'm really struggling with my assignments and could use some help.", "Shibuya, Harajuku, Akihabara electronics district"],
    
    // Slide 9 - Conclusion
    ["Rewordly helps users improve sentence clarity and readability.", "Packwise helps users plan their travels with clarity and ease."],
    ["The system provides a simple and efficient text rewriting platform.", "The system provides a centralized and intelligent trip planning platform."],
    ["It uses web technologies like HTML, CSS, JavaScript, and MySQL.", "It uses modern web technologies like React, Node.js, and MongoDB."],
    ["The platform improves communication and writing quality.", "The platform improves the overall travel experience and management."],
    ["Future improvements may include AI-based text rewriting.", "Future improvements may include live bookings and collaboration."],
    
    // Slide 10 - Thank you (no changes needed)
    
    // Catch remaining "Rewordly" anywhere
    ["Rewordly", "Packwise"],
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
    console.log(`${file}: ${changeCount} replacements`);
});

console.log('\nDone! All text replaced.');
