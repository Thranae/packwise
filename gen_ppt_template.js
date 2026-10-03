import pptxgen from "pptxgenjs";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "THRANAESWANTH S";
pres.subject = "Packwise Presentation";
pres.title = "Packwise";

// Define a master slide to mimic the blue bars at top and bottom
pres.defineSlideMaster({
    title: "TEMPLATE_SLIDE",
    background: { color: "FFFFFF" },
    objects: [
        // Top blue bar
        { rect: { x: 0, y: 0, w: "100%", h: 0.35, fill: { color: "3769C4" } } },
        // Bottom blue bar
        { rect: { x: 0, y: 5.275, w: "100%", h: 0.35, fill: { color: "3769C4" } } }
    ]
});

const defaultMaster = "TEMPLATE_SLIDE";
const textColor = "000000";
const headingColor = "1E2838"; // Dark grey-blue
const titleBlue = "0066CC";
const titleRed = "E60000";

// Helper for Slide Title
const addTitle = (slide, text) => {
    slide.addText(text, { x: 0.5, y: 0.6, w: "90%", align: "center", fontSize: 44, bold: true, color: headingColor });
};

// Slide 1: Title Slide
let slide1 = pres.addSlide({ masterName: defaultMaster });

// College Logo placeholder (since we don't have the image file)
slide1.addShape(pres.ShapeType.rect, { x: 0.5, y: 0.5, w: 1.2, h: 1.2, fill: { color: "FFFFFF" }, line: { color: "000000", width: 2 } });
slide1.addText("LOGO", { x: 0.5, y: 0.5, w: 1.2, h: 1.2, align: "center", fontSize: 14, bold: true, color: "000000" });

slide1.addText("SRI KRISHNA ARTS AND SCIENCE COLLEGE", { x: 0.5, y: 0.7, w: "90%", align: "center", fontSize: 32, bold: true, color: headingColor });
slide1.addText("Department of Software Systems and AIML", { x: 0.5, y: 1.3, w: "90%", align: "center", fontSize: 28, bold: true, color: headingColor });

slide1.addText("III M.Sc. SS", { x: 0.5, y: 2.1, w: "90%", align: "center", fontSize: 32, bold: true, color: titleBlue });
slide1.addText("SEMESTER - VI", { x: 0.5, y: 2.6, w: "90%", align: "center", fontSize: 32, bold: true, color: titleBlue });
slide1.addText("23SSI39- Mini Project", { x: 0.5, y: 3.2, w: "90%", align: "center", fontSize: 32, bold: true, color: titleRed });
slide1.addText("Title: Packwise", { x: 0.5, y: 3.7, w: "90%", align: "center", fontSize: 36, bold: true, color: titleRed });

slide1.addText("Student Roll number: 23MSS059", { x: 0.6, y: 4.4, w: 4.5, fontSize: 18, bold: true, color: headingColor });
slide1.addText("Student Name: THRANAESWANTH S", { x: 0.6, y: 4.8, w: 4.5, fontSize: 18, bold: true, color: headingColor });

slide1.addText("Guide Name: Dr. M. Raju M.Sc.,Ph.D.,", { x: 5.0, y: 4.3, w: 4.5, align: "right", fontSize: 18, bold: true, color: headingColor });
slide1.addText("Assistant Professor", { x: 5.0, y: 4.7, w: 4.5, align: "right", fontSize: 18, bold: true, color: headingColor });

// Slide 2: Abstract
let slide2 = pres.addSlide({ masterName: defaultMaster });
addTitle(slide2, "Abstract");
slide2.addText([
    { text: "Packwise is an AI-powered intelligent travel companion.", options: { bullet: true, breakLine: true } },
    { text: "The system helps users plan personalized and optimal travel itineraries.", options: { bullet: true, breakLine: true } },
    { text: "Users can enter preferences and receive a detailed day-by-day plan.", options: { bullet: true, breakLine: true } },
    { text: "The project is developed using MongoDB, Express, React, Node.js, and GenAI.", options: { bullet: true, breakLine: true } },
    { text: "The main goal is to improve trip planning quality through an easy web interface.", options: { bullet: true } }
], { x: 0.5, y: 1.6, w: "90%", fontSize: 24, bold: true, color: textColor, paraSpaceAfter: 20 });

// Slide 3: Introduction
let slide3 = pres.addSlide({ masterName: defaultMaster });
addTitle(slide3, "Introduction");
slide3.addText([
    { text: "Trip planning is very complex and time-consuming in digital platforms.", options: { bullet: true, breakLine: true } },
    { text: "Many users find it difficult to organize flights, hotels, and activities clearly.", options: { bullet: true, breakLine: true } },
    { text: "Traditional tools mostly focus on booking independent services.", options: { bullet: true, breakLine: true } },
    { text: "They do not effectively connect various aspects of a trip together.", options: { bullet: true, breakLine: true } },
    { text: "Packwise provides a simple solution to create and manage cohesive travel plans.", options: { bullet: true } }
], { x: 0.5, y: 1.6, w: "90%", fontSize: 24, bold: true, color: textColor, paraSpaceAfter: 20 });

// Slide 4: Existing Methodology
let slide4 = pres.addSlide({ masterName: defaultMaster });
addTitle(slide4, "Existing Methodology");
slide4.addText([
    { text: "Traditional travel planning requires browsing multiple disconnected websites.", options: { bullet: true, breakLine: true } },
    { text: "Most tools only offer generic location recommendations.", options: { bullet: true, breakLine: true } },
    { text: "Limited support for generating comprehensive end-to-end itineraries.", options: { bullet: true, breakLine: true } },
    { text: "Some tools are complex and difficult to use for non-experienced travelers.", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 22, bold: true, color: textColor, paraSpaceAfter: 15 });

slide4.addText("Problems in existing systems:", { x: 0.5, y: 3.8, w: "90%", fontSize: 22, bold: true, color: textColor });
slide4.addText([
    { text: "Time consuming", options: { bullet: true } }
], { x: 0.5, y: 4.4, w: 2.8, fontSize: 22, bold: true, color: textColor });
slide4.addText([
    { text: "Limited personalization", options: { bullet: true } }
], { x: 3.3, y: 4.4, w: 3.5, fontSize: 22, bold: true, color: textColor });
slide4.addText([
    { text: "Poor user experience", options: { bullet: true } }
], { x: 6.8, y: 4.4, w: 3.0, fontSize: 22, bold: true, color: textColor });

// Slide 5: Proposed Methodology
let slide5 = pres.addSlide({ masterName: defaultMaster });
addTitle(slide5, "Proposed Methodology");
slide5.addText([
    { text: "Packwise provides a simple web-based AI itinerary generation platform.", options: { bullet: true, breakLine: true } },
    { text: "Users can easily input travel preferences through the website.", options: { bullet: true, breakLine: true } },
    { text: "The system processes the input and creates an optimal structured trip.", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 24, bold: true, color: textColor, paraSpaceAfter: 20 });

slide5.addText("FEATURES OF THE PROPOSED SYSTEM:", { x: 0.5, y: 3.4, w: "90%", fontSize: 24, bold: true, color: textColor });
slide5.addText([
    { text: "Easy to use interface", options: { bullet: true } }
], { x: 0.5, y: 4.0, w: 3.0, fontSize: 22, bold: true, color: textColor });
slide5.addText([
    { text: "Fast AI processing", options: { bullet: true } }
], { x: 3.5, y: 4.0, w: 3.0, fontSize: 22, bold: true, color: textColor });
slide5.addText([
    { text: "Improved plan clarity", options: { bullet: true } }
], { x: 6.8, y: 4.0, w: 3.0, fontSize: 22, bold: true, color: textColor });
slide5.addText([
    { text: "Better personalization", options: { bullet: true } }
], { x: 0.5, y: 4.5, w: 4.0, fontSize: 22, bold: true, color: textColor });

// Slide 6: Flow of Process
let slide6 = pres.addSlide({ masterName: defaultMaster });
addTitle(slide6, "Flow of Process");
slide6.addText("SYSTEM FLOW DIAGRAM :", { x: 0.5, y: 1.2, w: "45%", fontSize: 20, bold: true, color: textColor });
slide6.addText("DATA FLOW DIAGRAM :", { x: 5.5, y: 1.2, w: "45%", fontSize: 20, bold: true, color: textColor });

const processSteps = ["Start", "User Input", "Input Validation", "Data Processing Module", "AI / Core Logic Engine", "Performance Evaluation Module", "Output Generation", "Display Results to User", "End"];
processSteps.forEach((step, idx) => {
    let yPos = 1.6 + idx * 0.38;
    slide6.addShape(pres.ShapeType.rect, { 
        x: 1.0, y: yPos, w: 3.5, h: 0.3, 
        fill: idx === 0 || idx === processSteps.length - 1 ? { color: "2CA02C" } : { color: "4A76C4" }
    });
    slide6.addText(step, { 
        x: 1.0, y: yPos, w: 3.5, h: 0.3, 
        align: "center", color: "FFFFFF", fontSize: 12, bold: true, margin: 0 
    });
    
    if (idx < processSteps.length - 1) {
        slide6.addShape(pres.ShapeType.downArrow, { 
            x: 2.7, y: yPos + 0.3, w: 0.1, h: 0.08, 
            fill: { color: "000000" } 
        });
    }
});

// Mock DFD on the right
slide6.addShape(pres.ShapeType.rect, { x: 5.5, y: 2.0, w: 4.0, h: 2.5, fill: { color: "F3F6FA" }, line: { color: "A0B8E0", width: 1 } });
slide6.addText("System Data Flow:\nUser Request -> Input Validation\n-> AI Engine (Gemini) ->\nDatabase (MongoDB) ->\nAPI Response -> Display Results", {
    x: 5.5, y: 2.0, w: 4.0, h: 2.5, align: "center", fontSize: 16, bold: true, color: "333333"
});

// Slide 7: Technical Method
let slide7 = pres.addSlide({ masterName: defaultMaster });
addTitle(slide7, "Technical Method");

slide7.addText("Frontend Technologies", { x: 0.5, y: 1.5, w: "90%", fontSize: 24, bold: true, color: textColor });
slide7.addText([
    { text: "React – Used to create the dynamic structure of web pages", options: { bullet: true, breakLine: true } },
    { text: "Tailwind CSS – Used for rapid styling and layout design", options: { bullet: true, breakLine: true } },
    { text: "GSAP / Motion – Used for fluid interaction and animations", options: { bullet: true } }
], { x: 0.5, y: 2.0, w: "90%", fontSize: 22, bold: true, color: textColor, paraSpaceAfter: 10 });

slide7.addText("Database", { x: 0.5, y: 3.4, w: "90%", fontSize: 24, bold: true, color: textColor });
slide7.addText([
    { text: "MongoDB – Used to store user data, trips, and system information", options: { bullet: true } }
], { x: 0.5, y: 3.8, w: "90%", fontSize: 22, bold: true, color: textColor, paraSpaceAfter: 10 });

slide7.addText("Additional Technical Features", { x: 0.5, y: 4.5, w: "90%", fontSize: 24, bold: true, color: textColor });
slide7.addText([
    { text: "Node.js & AI Engine – Generative AI processes user inputs to output detailed travel plans.", options: { bullet: true } }
], { x: 0.5, y: 4.9, w: "90%", fontSize: 22, bold: true, color: textColor });

// Slide 8: Input/Output Design
let slide8 = pres.addSlide({ masterName: defaultMaster });
addTitle(slide8, "Input/Output Design");

slide8.addText("Input : User enters destination & dates", { x: 0.3, y: 1.2, w: 4.5, fontSize: 22, bold: true, color: textColor });
slide8.addShape(pres.ShapeType.rect, { x: 0.3, y: 1.8, w: 4.5, h: 3.0, fill: { color: "1E2838" } });
slide8.addText("Destination: Tokyo, Japan\nDuration: 7 Days\nBudget: Moderate\n\n[Generate Trip Button]", { x: 0.3, y: 1.8, w: 4.5, h: 3.0, align: "center", fontSize: 20, bold: true, color: "FFFFFF" });

slide8.addText("Output : The planner, plans the trip in detail", { x: 5.2, y: 1.2, w: 4.5, fontSize: 22, bold: true, color: textColor });
slide8.addShape(pres.ShapeType.rect, { x: 5.2, y: 1.8, w: 4.5, h: 3.0, fill: { color: "1E2838" } });
slide8.addText("Day 1: Arrival & Shinjuku\n- Morning: Check-in\n- Afternoon: Gyoen Park\n- Evening: Shibuya Crossing\n\n[Hotels & Places mapped]", { x: 5.2, y: 1.8, w: 4.5, h: 3.0, align: "center", fontSize: 18, bold: true, color: "FFFFFF" });

// Slide 9: Conclusion
let slide9 = pres.addSlide({ masterName: defaultMaster });
addTitle(slide9, "Conclusion");
slide9.addText([
    { text: "Packwise helps users improve travel planning clarity and speed.", options: { bullet: true, breakLine: true } },
    { text: "The system provides a simple and efficient trip organization platform.", options: { bullet: true, breakLine: true } },
    { text: "It uses modern web technologies like React, Node.js, and MongoDB.", options: { bullet: true, breakLine: true } },
    { text: "The platform improves the overall travel experience and management.", options: { bullet: true, breakLine: true } },
    { text: "Future improvements may include live bookings and multi-user collaboration.", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 24, bold: true, color: textColor, paraSpaceAfter: 20 });

// Slide 10: Thank you
let slide10 = pres.addSlide({ masterName: defaultMaster });
slide10.addText("Thank you", { x: 0.5, y: 2.5, w: "90%", align: "center", fontSize: 54, bold: true, color: headingColor });

pres.writeFile({ fileName: "packwise_presentation_template.pptx" }).then(() => {
    console.log("Presentation created successfully as packwise_presentation_template.pptx");
}).catch(err => {
    console.error("Error creating presentation", err);
});
