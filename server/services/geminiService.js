import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure you have GEMINI_API_KEY in your .env
const apiKey = process.env.GEMINI_API_KEY || "YOUR_API_KEY"; 
const genAI = new GoogleGenerativeAI(apiKey);

export const generateTripPlan = async (prompt) => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not set. Please set it in your .env file.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    }
  });

  const systemInstruction = `
You are an expert AI travel planner. The user will provide a prompt requesting a travel plan.
You must return the response as a single, valid JSON object exactly matching the structure below.
Do not include markdown blocks like \`\`\`json around the response, just the raw JSON object.

REQUIRED JSON STRUCTURE:
{
  "destination": "Full destination name (e.g., Bangalore)",
  "country": "Country of destination (e.g., India)",
  "startDate": "YYYY-MM-DD string (e.g. 2026-08-01)",
  "endDate": "YYYY-MM-DD string (e.g. 2026-08-07)",
  "travelers": 2,
  "budget": 50000,
  "currency": "INR",
  "travelStyle": "Luxury / Budget / Adventure",
  "interests": ["Culture", "Food"],
  "status": "planning",
  "theme": {
    "primary": "Hex color code representing the primary vibe of the destination (e.g. #3B82F6 for beach/sky)",
    "secondary": "Hex color code for the secondary accent (e.g. #8B5CF6)"
  },
  "budgetDetails": {
    "total": Number (estimated total cost),
    "categories": [
      { "name": "Hotel", "amount": Number, "percent": "Percentage string (e.g., '40%')", "color": "bg-blue-400", "stroke": "#60A5FA", "dashArray": "40 100", "dashOffset": "0" },
      { "name": "Food", "amount": Number, "percent": "Percentage", "color": "bg-emerald-400", "stroke": "#34D399", "dashArray": "24 100", "dashOffset": "-40" },
      { "name": "Transport", "amount": Number, "percent": "Percentage", "color": "bg-purple-400", "stroke": "#A78BFA", "dashArray": "16 100", "dashOffset": "-64" },
      { "name": "Shopping", "amount": Number, "percent": "Percentage", "color": "bg-orange-400", "stroke": "#FB923C", "dashArray": "12 100", "dashOffset": "-80" },
      { "name": "Misc", "amount": Number, "percent": "Percentage", "color": "bg-pink-400", "stroke": "#F472B6", "dashArray": "8 100", "dashOffset": "-92" }
    ]
  },
  "weather": {
    "current": { "temp": Number, "condition": "Partly Cloudy / Sunny / Rainy" },
    "forecast": [
       // EXACTLY 7 DAYS starting from today
      { "day": "Mon", "temp": Number, "min": Number, "condition": "Sunny" },
      ...
    ]
  },
  "itinerary": [
    // Array of day objects covering the full duration
    {
      "day": Number,
      "title": "Short title for the day",
      "activities": [
        // Breakfast, Morning Activity, Lunch, Afternoon, Dinner
        { "time": "Morning", "place": "Place Name", "description": "What to do there", "imageSearchQuery": "keyword for unsplash search" }
      ]
    }
  ],
  "packingList": [
    {
      "category": "Clothes",
      "items": [ { "name": "T-Shirts" }, { "name": "Jeans" } ]
    },
    {
      "category": "Electronics",
      "items": [ { "name": "Camera" }, { "name": "Power Bank" } ]
    }
    // Add Essentials, Toiletries, etc.
  ],
  "recommendations": [
    {
      "category": "Must Visit",
      "places": ["Place 1", "Place 2"]
    },
    {
      "category": "Food",
      "places": ["Restaurant 1", "Cafe 2"]
    }
  ],
  "tips": [
    "Tip 1", "Tip 2"
  ],
  "heroImageSearchQuery": "high quality 2-3 word keyword to search unsplash for the main destination background"
}

IMPORTANT RULES:
- Verify if the destination actually has a major commercial airport before suggesting flights or airport check-ins. If it does not (e.g., Udhagamandalam/Ooty, which is accessed via Coimbatore airport or by road), suggest the appropriate nearest transit hub or road/rail travel instead.
- Ensure the budget is calculated accurately and realistically based on the destination and travel style, and that all category percentages mathematically sum exactly to 100%.
- Ensure the sum of budget category amounts exactly equals the budget total.
- Ensure the dashOffsets for the budget chart correctly stack up to 100 (dashOffset starts at 0, then subtracts previous percent).
- Generate a realistic and highly detailed itinerary.
`;

  try {
    const result = await model.generateContent([
      { text: systemInstruction },
      { text: `User Request: ${prompt}` }
    ]);
    const response = await result.response;
    let text = response.text();
    // Sometimes Gemini wraps JSON in markdown despite responseMimeType
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating trip plan with Gemini:", error);
    throw error;
  }
};

export const chatWithTrip = async (currentTrip, userMessage) => {
  // Logic for modifying an existing trip
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.7,
    }
  });

  const systemInstruction = `
You are an expert AI travel assistant. The user wants to modify their existing trip plan.
You are given the CURRENT TRIP JSON state, and a USER MESSAGE.
You must return the ENTIRE updated trip JSON matching the exact same structure as before, incorporating the user's requested changes.
Do not include markdown blocks.

CURRENT TRIP JSON:
${JSON.stringify(currentTrip)}

Apply the changes requested by the user and return the full updated JSON.
  `;

  try {
    const result = await model.generateContent([
      { text: systemInstruction },
      { text: `User Request: ${userMessage}` }
    ]);
    const response = await result.response;
    let text = response.text();
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/^\`\`\`json/, '').replace(/\`\`\`$/, '').trim();
    }
    return JSON.parse(text);
  } catch (error) {
    console.error("Error modifying trip plan:", error);
    throw error;
  }
};
