import pptxgen from "pptxgenjs";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "THRANAESWANTH S";
pres.company = "Sri Krishna Arts and Science College";
pres.subject = "Packwise Presentation";
pres.title = "Packwise";

const primaryColor = "1E3A8A"; // blue-900
const accentColor = "2563EB"; // blue-600

// Slide 1: Title Slide
let slide1 = pres.addSlide();
slide1.addText("SRI KRISHNA ARTS AND SCIENCE COLLEGE", { x: 0.5, y: 0.8, w: "90%", align: "center", fontSize: 28, bold: true, color: "000000" });
slide1.addText("Department of Software Systems and AIML", { x: 0.5, y: 1.4, w: "90%", align: "center", fontSize: 24, bold: true, color: "333333" });

slide1.addText("III M.Sc. SS", { x: 0.5, y: 2.2, w: "90%", align: "center", fontSize: 24, bold: true, color: accentColor });
slide1.addText("SEMESTER - VI", { x: 0.5, y: 2.7, w: "90%", align: "center", fontSize: 24, bold: true, color: accentColor });
slide1.addText("23SSI39 - Mini Project", { x: 0.5, y: 3.2, w: "90%", align: "center", fontSize: 24, bold: true, color: "CC0000" });
slide1.addText("Title: Packwise", { x: 0.5, y: 3.7, w: "90%", align: "center", fontSize: 28, bold: true, color: "CC0000" });

slide1.addText("Student Roll number: 23MSS059", { x: 0.5, y: 4.5, w: 4.5, fontSize: 16, bold: true });
slide1.addText("Student Name: THRANAESWANTH S", { x: 0.5, y: 4.8, w: 4.5, fontSize: 16, bold: true });
slide1.addText("Guide Name: Dr. M. Raju M.Sc.,Ph.D.,", { x: 5.0, y: 4.5, w: 4.5, align: "right", fontSize: 16, bold: true });
slide1.addText("Assistant Professor", { x: 5.0, y: 4.8, w: 4.5, align: "right", fontSize: 16, bold: true });

// Helper for Slide Title
const addTitle = (slide, text) => {
    slide.addText(text, { x: 0.5, y: 0.5, w: "90%", align: "center", fontSize: 36, bold: true, color: "111111" });
};

// Slide 2: Abstract
let slide2 = pres.addSlide();
addTitle(slide2, "Abstract");
slide2.addText([
    { text: "Packwise is a web-based AI-powered travel companion.", options: { bullet: true, breakLine: true } },
    { text: "The system helps users plan personalized travel itineraries seamlessly.", options: { bullet: true, breakLine: true } },
    { text: "Users can specify their destination, dates, and preferences to receive a detailed plan.", options: { bullet: true, breakLine: true } },
    { text: "The project is developed using the MERN stack (MongoDB, Express, React, Node.js) and GenAI.", options: { bullet: true, breakLine: true } },
    { text: "The main goal is to improve the travel planning experience through an intuitive web interface.", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 20, paraSpaceAfter: 15 });

// Slide 3: Introduction
let slide3 = pres.addSlide();
addTitle(slide3, "Introduction");
slide3.addText([
    { text: "Planning a trip often involves tedious research and coordination.", options: { bullet: true, breakLine: true } },
    { text: "Many users find it difficult to create an optimal travel itinerary from scratch.", options: { bullet: true, breakLine: true } },
    { text: "Traditional tools mostly focus on booking flights or hotels independently.", options: { bullet: true, breakLine: true } },
    { text: "They do not effectively combine all aspects of a trip into a cohesive plan.", options: { bullet: true, breakLine: true } },
    { text: "Packwise provides a simple, intelligent solution to design and manage trips effortlessly.", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 20, paraSpaceAfter: 15 });

// Slide 4: Existing Methodology
let slide4 = pres.addSlide();
addTitle(slide4, "Existing Methodology");
slide4.addText([
    { text: "Traditional travel planning requires browsing multiple websites.", options: { bullet: true, breakLine: true } },
    { text: "Most tools only offer generic recommendations without personalization.", options: { bullet: true, breakLine: true } },
    { text: "Limited support for end-to-end itinerary generation.", options: { bullet: true, breakLine: true } },
    { text: "Managing flight, hotel, and activity details manually is complex.", options: { bullet: true } }
], { x: 0.5, y: 1.3, w: "90%", fontSize: 20, paraSpaceAfter: 12 });

slide4.addText("Problems in existing systems:", { x: 0.5, y: 3.8, w: "90%", fontSize: 20, bold: true });
slide4.addText([
    { text: "Time consuming", options: { bullet: true } }
], { x: 0.5, y: 4.4, w: 2.5, fontSize: 18 });
slide4.addText([
    { text: "Limited personalization", options: { bullet: true } }
], { x: 3.5, y: 4.4, w: 3.0, fontSize: 18 });
slide4.addText([
    { text: "Fragmented user experience", options: { bullet: true } }
], { x: 6.8, y: 4.4, w: 3.0, fontSize: 18 });

// Slide 5: Proposed Methodology
let slide5 = pres.addSlide();
addTitle(slide5, "Proposed Methodology");
slide5.addText([
    { text: "Packwise provides a simple web-based intelligent travel planning platform.", options: { bullet: true, breakLine: true } },
    { text: "Users can easily input their travel preferences through the website.", options: { bullet: true, breakLine: true } },
    { text: "The system processes the input using AI to generate customized itineraries.", options: { bullet: true } }
], { x: 0.5, y: 1.3, w: "90%", fontSize: 20, paraSpaceAfter: 15 });

slide5.addText("FEATURES OF THE PROPOSED SYSTEM:", { x: 0.5, y: 3.3, w: "90%", fontSize: 20, bold: true });
slide5.addText([
    { text: "Easy to use interface", options: { bullet: true } }
], { x: 0.5, y: 4.0, w: 3.0, fontSize: 18 });
slide5.addText([
    { text: "Fast AI itinerary generation", options: { bullet: true } }
], { x: 3.5, y: 4.0, w: 3.0, fontSize: 18 });
slide5.addText([
    { text: "Personalized recommendations", options: { bullet: true } }
], { x: 6.8, y: 4.0, w: 3.0, fontSize: 18 });
slide5.addText([
    { text: "Centralized trip management", options: { bullet: true } }
], { x: 0.5, y: 4.6, w: 4.0, fontSize: 18 });

// Slide 6: Flow of Process
let slide6 = pres.addSlide();
addTitle(slide6, "Flow of Process");

slide6.addText("SYSTEM FLOW DIAGRAM :", { x: 0.5, y: 1.2, w: "90%", fontSize: 18, bold: true });

const steps = ["Start", "User Input (Preferences)", "Input Validation", "AI Processing Engine", "Generate Itinerary", "Output Generation", "Display Results to User", "End"];
steps.forEach((step, idx) => {
    slide6.addShape(pres.ShapeType.rect, { 
        x: 1.5, y: 1.8 + idx * 0.45, w: 3.0, h: 0.35, 
        fill: accentColor, 
        line: { color: "111111", width: 1 } 
    });
    slide6.addText(step, { 
        x: 1.5, y: 1.8 + idx * 0.45, w: 3.0, h: 0.35, 
        align: "center", color: "FFFFFF", fontSize: 12, margin: 0 
    });
    
    if (idx < steps.length - 1) {
        slide6.addShape(pres.ShapeType.downArrow, { 
            x: 2.9, y: 2.15 + idx * 0.45, w: 0.2, h: 0.1, 
            fill: "000000" 
        });
    }
});

slide6.addText("DATA FLOW DIAGRAM :", { x: 5.5, y: 1.2, w: "90%", fontSize: 18, bold: true });
slide6.addShape(pres.ShapeType.rect, {
    x: 6.0, y: 2.5, w: 3.0, h: 1.5, fill: "F3F4F6", line: { color: "CCCCCC", width: 1 }
});
slide6.addText("Data processing involves sending user\npreferences to the backend,\nwhich validates the request, calls\nthe Gemini AI API, and stores\nthe generated trip in MongoDB.", {
    x: 6.0, y: 2.5, w: 3.0, h: 1.5, align: "center", fontSize: 14, margin: 0
});

// Slide 7: Technical Method
let slide7 = pres.addSlide();
addTitle(slide7, "Technical Method");

slide7.addText("Frontend Technologies", { x: 0.5, y: 1.5, w: "90%", fontSize: 20, bold: true });
slide7.addText([
    { text: "React – Used to create the dynamic structure of web pages", options: { bullet: true, breakLine: true } },
    { text: "Tailwind CSS – Used for rapid styling and layout design", options: { bullet: true, breakLine: true } },
    { text: "GSAP – Used for fluid interaction and animations", options: { bullet: true } }
], { x: 0.5, y: 1.9, w: "90%", fontSize: 18, paraSpaceAfter: 5 });

slide7.addText("Backend & Database", { x: 0.5, y: 3.2, w: "90%", fontSize: 20, bold: true });
slide7.addText([
    { text: "Node.js & Express – Used for building the robust API", options: { bullet: true, breakLine: true } },
    { text: "MongoDB – Used to store user data and trips", options: { bullet: true } }
], { x: 0.5, y: 3.6, w: "90%", fontSize: 18, paraSpaceAfter: 5 });

slide7.addText("Additional Technical Features", { x: 0.5, y: 4.5, w: "90%", fontSize: 20, bold: true });
slide7.addText([
    { text: "Generative AI – Google Gemini processes preferences into detailed plans.", options: { bullet: true } }
], { x: 0.5, y: 4.9, w: "90%", fontSize: 18 });

// Slide 8: Input/Output Design
let slide8 = pres.addSlide();
addTitle(slide8, "Input/Output Design");

slide8.addText("Input : User enters destination & dates", { x: 0.5, y: 1.5, w: 4.0, fontSize: 18, bold: true });
slide8.addShape(pres.ShapeType.rect, { x: 0.5, y: 2.0, w: 4.0, h: 2.5, fill: "E5E7EB", line: { color: "9CA3AF", width: 1 } });
slide8.addText("Search form for:\n- Destination (e.g. Paris)\n- Dates (e.g. 5 days)\n- Budget (e.g. Moderate)", { x: 0.5, y: 2.0, w: 4.0, h: 2.5, align: "center", fontSize: 16, margin: 0 });

slide8.addText("Output : The AI generates an itinerary", { x: 5.5, y: 1.5, w: 4.0, fontSize: 18, bold: true });
slide8.addShape(pres.ShapeType.rect, { x: 5.5, y: 2.0, w: 4.0, h: 2.5, fill: "DBEAFE", line: { color: "93C5FD", width: 1 } });
slide8.addText("Detailed day-by-day plan:\n- Morning / Afternoon / Evening\n- Hotels & Flights info\n- Images and budget estimates", { x: 5.5, y: 2.0, w: 4.0, h: 2.5, align: "center", fontSize: 16, margin: 0 });

// Slide 9: Conclusion
let slide9 = pres.addSlide();
addTitle(slide9, "Conclusion");
slide9.addText([
    { text: "Packwise helps users plan their travels with clarity and ease.", options: { bullet: true, breakLine: true } },
    { text: "The system provides a centralized and intelligent travel planning platform.", options: { bullet: true, breakLine: true } },
    { text: "It uses modern web technologies like React, Node.js, and MongoDB.", options: { bullet: true, breakLine: true } },
    { text: "The platform improves the overall trip planning and management experience.", options: { bullet: true, breakLine: true } },
    { text: "Future improvements may include live booking integrations and collaborative planning.", options: { bullet: true } }
], { x: 0.5, y: 1.5, w: "90%", fontSize: 20, paraSpaceAfter: 15 });

// Slide 10: Thank you
let slide10 = pres.addSlide();
slide10.addText("Thank you", { x: 0.5, y: 2.5, w: "90%", align: "center", fontSize: 48, bold: true, color: "111111" });

pres.writeFile({ fileName: "packwise_presentation.pptx" }).then(() => {
    console.log("Presentation created successfully as packwise_presentation.pptx");
}).catch(err => {
    console.error("Error creating presentation", err);
});
