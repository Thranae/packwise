import axios from 'axios';
import AIRouter from './ai/AIRouter.js';

class AIService {
  /**
   * Helper to execute a JSON-mode request through the AIRouter
   * @param {string} prompt 
   * @param {Object} schemaFallback 
   * @param {'planning'|'json'|'casual'|'lightweight'|'backup'} taskType 
   * @returns {Promise<Object>}
   */
  async _generateJson(prompt, schemaFallback, taskType = 'json') {
    try {
      const text = await AIRouter.routeRequest(prompt, taskType, true);
      const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("AI Generation Error:", error.message);
      return schemaFallback;
    }
  }

  async getPackingAlternative(destination, item) {
    const prompt = `
      The user is packing for a trip to ${destination || 'an unknown destination'}.
      They have an item on their packing list: "${item}".
      Suggest ONE single specific alternative item that might be better suited for this trip, lighter, or more versatile.
      Return ONLY the name of the alternative item. No explanation, no quotes, no markdown, just the item name (e.g., Merino Wool T-Shirt).
    `;
    try {
      const text = await AIRouter.routeRequest(prompt, 'lightweight', false);
      return text.trim().replace(/['"]/g, '');
    } catch (error) {
      console.error("Packing Alternative Error:", error.message);
      return "Generic Alternative";
    }
  }

  async generateTripPlan(destination, days) {
    const prompt = `Create a high-level trip plan for ${days} days in ${destination}. Return JSON with { title: String, summary: String, highlights: [String] }`;
    return this._generateJson(prompt, { title: `Trip to ${destination}`, summary: "Ready to plan your trip!", highlights: [] }, 'planning');
  }

  async generatePackingList(destination, weather, duration, gender = 'Not specified') {
    const durationText = duration ? `for a ${duration} trip` : 'for a trip';
    const genderText = gender && gender !== 'Not specified' ? `The travelers are: ${gender}.` : `The travelers' gender is not specified (provide unisex items).`;
    
    const prompt = `Create a smart, comprehensive packing list ${durationText} to ${destination}. The current weather forecast is: ${JSON.stringify(weather)}. 
    ${genderText}
    Analyze the climate and suggest appropriate items tailored to the destination, weather, and gender.
    CRITICAL: You must adapt the clothing style to the destination's cultural fashion trends AND the specified gender. For example, if it's a European destination for a female, suggest elegant linen dresses or blouses. If it's a tropical beach for a male, suggest breezy resort wear shirts. Ensure the clothing items reflect the local vibe!
    CRITICAL: Calculate exact quantities for clothing based on the trip duration (e.g., "Linen Shirts (x7)" for a 7-day trip).
    You MUST include exactly 3 categories named exactly: "Clothing", "Electronics", and "Toiletries".
    "Clothing" MUST contain at least 12-15 specific items. "Electronics" MUST contain at least 5-8 items. "Toiletries" MUST contain at least 5-8 items.
    Return ONLY valid JSON strictly matching this format:
    {
      "categories": [
        { "name": "Clothing", "items": [{ "name": "Tailored Linen Pants (x2)", "packed": false }, { "name": "T-Shirts (x7)", "packed": false }] },
        { "name": "Electronics", "items": [{ "name": "Universal Adapter", "packed": false }] },
        { "name": "Toiletries", "items": [{ "name": "Sunscreen", "packed": false }] }
      ]
    }`;
    
    // Smart Fallback in case of Rate Limit or Error
    const isEurope = /italy|france|swiss|europe|paris|rome|london|germany|spain/i.test(destination);
    const isTropical = /bali|rio|beach|hawaii|maldives|fiji|caribbean|cancun|bahamas/i.test(destination);
    const isAsia = /tokyo|kyoto|japan|china|seoul|korea|bangkok|asia/i.test(destination);
    const isCold = /alps|ski|snow|iceland|canada|norway|sweden|winter/i.test(destination) || (weather && weather.temperature < 15);
    const dDays = duration ? parseInt(duration) || 7 : 7;
    
    let clothingItems = [
      { name: `T-Shirts (x${dDays})`, packed: false },
      { name: `Jeans (x${Math.ceil(dDays/3)})`, packed: false },
      { name: `Socks (x${dDays})`, packed: false },
      { name: `Underwear (x${dDays})`, packed: false },
      { name: "Comfortable Walking Shoes (x1)", packed: false },
      { name: "Light Jacket (x1)", packed: false },
      { name: "Sleepwear (x1)", packed: false },
      { name: "Sunglasses", packed: false },
      { name: "Hat / Cap", packed: false },
      { name: "Swimwear", packed: false },
      { name: "Shorts (x2)", packed: false },
      { name: "Sweater / Fleece", packed: false },
      { name: "Belt & Accessories", packed: false },
      { name: "Raincoat", packed: false }
    ];
    
    if (isCold) {
      clothingItems = [
        { name: `Long-sleeve Shirts (x${dDays})`, packed: false },
        { name: `Thermal Underwear (x${Math.ceil(dDays/2)})`, packed: false },
        { name: `Warm Pants (x${Math.ceil(dDays/3)})`, packed: false },
        { name: `Wool Socks (x${dDays})`, packed: false },
        { name: `Underwear (x${dDays})`, packed: false },
        { name: "Winter Jacket (x1)", packed: false },
        { name: "Fleece Sweater (x2)", packed: false },
        { name: "Waterproof Boots (x1)", packed: false },
        { name: "Warm Sleepwear (x1)", packed: false },
        { name: "Beanie / Winter Hat", packed: false },
        { name: "Thick Gloves", packed: false },
        { name: "Winter Scarf", packed: false },
        { name: "Lip Balm", packed: false },
        { name: "Thermal Flask", packed: false }
      ];
    } else if (isEurope) {
      clothingItems = [
        { name: `Tailored Linen Shirts (x${Math.ceil(dDays/2)})`, packed: false },
        { name: `Chino Pants (x${Math.ceil(dDays/3)})`, packed: false },
        { name: `Polo Shirts (x${Math.ceil(dDays/2)})`, packed: false },
        { name: `Underwear (x${dDays})`, packed: false },
        { name: `Socks (x${dDays})`, packed: false },
        { name: "Loafers (x1)", packed: false },
        { name: "Evening Blazer (x1)", packed: false },
        { name: "Walking Shoes (x1)", packed: false },
        { name: "Sleepwear (x2)", packed: false },
        { name: "Sunglasses", packed: false },
        { name: "Belt", packed: false },
        { name: "Light Sweater", packed: false },
        { name: "Rain Umbrella", packed: false },
        { name: "Scarf", packed: false }
      ];
    } else if (isTropical) {
      clothingItems = [
        { name: `Breathable Resort Shirts (x${Math.ceil(dDays/2)})`, packed: false },
        { name: `Swimwear (x${Math.ceil(dDays/3)})`, packed: false },
        { name: `T-Shirts (x${Math.ceil(dDays/2)})`, packed: false },
        { name: `Underwear (x${dDays})`, packed: false },
        { name: `Socks (x${Math.ceil(dDays/2)})`, packed: false },
        { name: "Sandals / Flip Flops (x1)", packed: false },
        { name: "Sun Hat (x1)", packed: false },
        { name: "Sunglasses (x1)", packed: false },
        { name: "Linen Shorts (x3)", packed: false },
        { name: "Light Evening Shirt", packed: false },
        { name: "Beach Cover-up", packed: false },
        { name: "Sleepwear", packed: false },
        { name: "Comfortable Sneakers", packed: false }
      ];
    } else if (isAsia) {
      clothingItems = [
        { name: `Smart Casual Shirts (x${Math.ceil(dDays/2)})`, packed: false },
        { name: `Comfortable T-Shirts (x${Math.ceil(dDays/2)})`, packed: false },
        { name: `Lightweight Pants (x${Math.ceil(dDays/3)})`, packed: false },
        { name: `Underwear (x${dDays})`, packed: false },
        { name: `Socks (x${dDays})`, packed: false },
        { name: "Slip-on Walking Shoes (x1)", packed: false },
        { name: "Light Rain Jacket (x1)", packed: false },
        { name: "Small Backpack", packed: false },
        { name: "Sleepwear (x2)", packed: false },
        { name: "Sunglasses", packed: false },
        { name: "Hand Sanitizer", packed: false },
        { name: "Portable Umbrella", packed: false },
        { name: "Coin Pouch", packed: false },
        { name: "Breathable Shorts", packed: false }
      ];
    }
    
    const fallback = {
      categories: [
        { name: "Clothing", items: clothingItems },
        { name: "Electronics", items: [
          { name: "Universal Travel Adapter", packed: false }, 
          { name: "Power Bank", packed: false }, 
          { name: "Phone & Charger", packed: false }, 
          { name: "Headphones", packed: false },
          { name: "Camera & Battery", packed: false },
          { name: "Laptop / Tablet", packed: false },
          { name: "E-Reader", packed: false },
          { name: "Smartwatch Charger", packed: false },
          { name: "Portable Speaker", packed: false },
          { name: "Extra Cables", packed: false }
        ] },
        { name: "Toiletries", items: [
          { name: "Toothbrush & Paste", packed: false }, 
          { name: "Sunscreen", packed: false }, 
          { name: "Deodorant", packed: false }, 
          { name: "Shampoo & Conditioner", packed: false },
          { name: "Body Wash", packed: false },
          { name: "Skincare Routine", packed: false },
          { name: "Razor & Shaving Cream", packed: false },
          { name: "First Aid Kit", packed: false },
          { name: "Medications", packed: false },
          { name: "Hairbrush / Comb", packed: false }
        ] }
      ]
    };
    
    return this._generateJson(prompt, fallback, 'planning');
  }

  async generateBudgetAdvice(destination, totalBudget, currency) {
    const prompt = `I am traveling to ${destination} with a budget of ${totalBudget} ${currency}. Give me 3 smart budget tips and an expected daily cost. Return JSON strictly matching this format:
    {
      "tips": ["Tip 1", "Tip 2", "Tip 3"],
      "expectedDailyCost": 150,
      "isSufficient": true
    }`;
    return this._generateJson(prompt, { tips: ["Use public transit", "Eat like a local", "Book in advance"], expectedDailyCost: 0, isSufficient: true }, 'planning');
  }

  async generateItinerary(destination, days) {
    const prompt = `Create a daily itinerary for ${days} days in ${destination}. Return JSON strictly matching this format:
    [
      { "day": 1, "title": "Arrival", "activities": [{ "time": "10:00 AM", "description": "Check in" }] }
    ]`;
    return this._generateJson(prompt, [], 'planning');
  }

  async generateFullTrip(prompt) {
    const aiPrompt = `Parse the following user trip request: "${prompt}". 
    Determine the best destination, country, a realistic default budget for that destination, the exact 3-letter currency code (e.g. USD, EUR, JPY), and the exact IANA timezone string (e.g. Europe/Paris, Asia/Tokyo). 
    Determine the number of travelers and their gender directly from the prompt.
    Extract the requested start date in YYYY-MM-DD format.
    Assume a 7-day trip if duration is not specified. Assume 1 traveler if not specified.
    Return JSON strictly matching this format:
    {
      "destination": "City Name",
      "country": "Country Name",
      "budget": 2000,
      "currency": "EUR",
      "timezone": "Europe/Paris",
      "duration": "7 Days",
      "startDate": "YYYY-MM-DD",
      "gender": "Female",
      "travelers": 1
    }`;
    return this._generateJson(aiPrompt, {
      destination: prompt ? prompt.split('.')[0].replace('Destination: ', '').trim() : "Unknown Destination",
      country: "Unknown",
      budget: 3000,
      currency: "USD",
      timezone: "UTC",
      duration: "7 Days",
      startDate: new Date().toISOString().split('T')[0],
      gender: "Not specified",
      travelers: 1
    }, 'json');
  }

  async recommendPlaces(destination, category = "Attractions") {
    // Helper for fallback Nominatim search
    const fetchNominatim = async () => {
      try {
        let keyword = category.toLowerCase();
        if (category === "Attractions") keyword = "attractions";
        else if (category === "Food") keyword = "restaurants";
        else if (category === "Nature") keyword = "parks";
        else if (category === "Shopping") keyword = "shops";
        else if (category === "Nightlife") keyword = "bars";
        else if (category === "Entertainment") keyword = "cinemas";
        else if (category === "Art") keyword = "museums";
        
        const cleanDest = destination.split('.')[0].replace('Destination: ', '').trim();
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(keyword + " in " + cleanDest)}&format=json&limit=10`;
        const res = await axios.get(url, { headers: { 'User-Agent': 'PackwiseTravelApp/1.0' }});
        
        if (res.data && res.data.length > 0) {
          return res.data.slice(0, 6).map((item, index) => ({
            id: item.place_id || index,
            name: item.name || item.display_name.split(',')[0],
            category,
            rating: (4 + Math.random()).toFixed(1),
            distance: (Math.random() * 10).toFixed(1) + " km",
            time: Math.floor(10 + Math.random() * 40) + "m",
            desc: `A highly recommended and historic location in ${cleanDest}. Explore the unique local atmosphere and surrounding culture.`
          }));
        }
      } catch (e) {
        console.error("Nominatim API Error:", e.message);
      }

      // If Nominatim fails or returns 0 results
      const realNames = ["The Grand Plaza", "Central Gardens", "Historic Old Town", "Riverside Walk", "Downtown Museum", "Sunset Viewpoint", "The Artisan Market", "Heritage Monument", "Crystal Lake Park", "The Local Bazaar"];
      const fallback = [];
      const shuffledNames = [...realNames].sort(() => 0.5 - Math.random());
      for (let i = 0; i < 6; i++) {
        fallback.push({ 
          id: Math.random(), 
          name: `${shuffledNames[i % shuffledNames.length]}`, 
          category, 
          rating: (4 + Math.random()).toFixed(1), 
          distance: (Math.random() * 10).toFixed(1) + " km", 
          time: Math.floor(10 + Math.random() * 40) + "m", 
          desc: `A highly recommended ${category.toLowerCase()} experience. Perfect for exploring the local culture.` 
        });
      }
      return fallback;
    };

    const aiPrompt = `You are a world-class travel expert with deep knowledge of real places. Recommend exactly 6 real, famous ${category} for tourists visiting ${destination}. 
    These MUST be real, well-known locations that actually exist in ${destination}.
    For each place, provide a very specific "imageQuery" that will return accurate, real photographs when searched on stock photo sites (e.g., "Eiffel Tower Paris night lights", "Shibuya Crossing Tokyo crowd").
    Return ONLY a valid JSON array of exactly 6 objects:
    [{ 
      "name": "REAL place name (e.g. Shibuya Crossing, not 'The Grand Market')", 
      "category": "${category}", 
      "rating": "4.7", 
      "distance": "2.5 km", 
      "time": "15m", 
      "desc": "1 sentence accurate description of this real place",
      "imageQuery": "specific photo search query for this exact place (e.g. 'Shibuya Crossing Tokyo Japan')"
    }]`;
    const result = await this._generateJson(aiPrompt, null, 'lightweight'); // Use Mistral or Groq for quick lightweight data
    
    if (!result || !Array.isArray(result) || result.length === 0) {
      return fetchNominatim();
    }
    
    return result.map(item => ({...item, id: Math.random()}));
  }

  async recommendRestaurants(destination) {
    return this.recommendPlaces(destination, "Food");
  }

  async generateMoodboardPrompts(destination, count) {
    const prompt = `Generate exactly ${count} short, highly relevant photo search queries for fashion street style outfits suitable for a trip to ${destination}.
    These queries will be passed directly to a stock photo API (like Pexels or Pixabay), so they must be concise (3-6 words max) and focus on the subject.
    Make half of the queries for men's fashion and half for women's fashion.
    For example, DO NOT write "A hyperrealistic street style photograph...". DO write "women fashion street style ${destination}" or "men casual outfit ${destination}".
    Return JSON strictly matching this format:
    {
      "prompts": [
        "women fashion winter coat ${destination}",
        "men casual summer outfit ${destination}"
      ]
    }`;
    const fallbackPrompts = Array.from({ length: count }).map((_, i) => 
      `${i % 2 === 0 ? 'women' : 'men'} fashion street style outfit ${destination}`
    );
    return this._generateJson(prompt, { prompts: fallbackPrompts }, 'json');
  }

  /**
   * Main chat entry point.
   */
  async travelAssistant(message, context) {
    const offlineFallback = (msg, ctx) => {
      const dest = ctx?.destination || "your destination";
      const m = msg.toLowerCase();
      if (m.includes("itinerary")) return `For a great itinerary in ${dest}, I recommend starting your mornings at the local historic sites, having lunch near the city center, and spending your evenings exploring the vibrant local markets or waterfront.`;
      if (m.includes("restaurant") || m.includes("food")) return `In ${dest}, you must try the local street food delicacies! There are fantastic, highly-rated local eateries just a few blocks from the main square that offer authentic dishes at great prices.`;
      if (m.includes("budget") || m.includes("cheap")) return `To save money in ${dest}, consider using public transit instead of taxis, eating at local neighborhood cafes rather than tourist hotspots, and booking your attraction tickets online in advance for discounts.`;
      if (m.includes("weather")) return `The weather in ${dest} usually requires layered clothing. I always recommend packing a light jacket and comfortable walking shoes regardless of the season!`;
      if (m.includes("pack")) return `For ${dest}, make sure to pack comfortable walking shoes, a universal power adapter, layered clothing, and a reusable water bottle.`;
      if (m.includes("hello") || m.includes("hi")) return `Hello! I'm PackWise AI. How can I help you plan your incredible trip to ${dest}?`;
      
      return `That's a great question about ${dest}! As your personal PackWise AI, I highly recommend exploring the local culture, trying regional cuisines, and keeping your itinerary flexible to discover hidden gems.`;
    };

    try {
      const prompt = `You are PackWise AI, an expert travel assistant. Context: ${JSON.stringify(context)}. User says: "${message}". Respond helpfully and concisely.`;
      // Use 'casual' routing for fast responses via Groq/Mistral
      const response = await AIRouter.routeRequest(prompt, 'casual', false);
      return response;
    } catch (error) {
      console.error("All Chat AI providers failed:", error.message);
      return offlineFallback(message, context);
    }
  }

  async travelAssistantStream(message, context) {
    const prompt = `You are PackWise AI, an expert travel assistant. 
Context: ${JSON.stringify(context)}. 
User says: "${message}". 
Respond helpfully and concisely.

CRITICAL INSTRUCTION: If the user asks you to plan a trip, generate an itinerary, or create a travel plan for a specific destination, you MUST include a special action tag at the very end of your response in this exact format:
[ACTION: GENERATE_TRIP | destination: City, Country]
For example, if they say "Plan a weekend getaway to Paris", your response should be helpful and end with:
[ACTION: GENERATE_TRIP | destination: Paris, France]`;
    return AIRouter.routeRequestStream(prompt, 'casual');
  }

  /**
   * Feature 7: AI Post-Trip Memory Journal
   * Generates a narrative travel story based on completed trip itinerary.
   */
  async generateMemoryJournal(trip) {
    const itinerarySummary = (trip.itinerary || [])
      .map(day => `Day ${day.day} (${day.title}): ${(day.activities || []).map(a => a.place || a.description).filter(Boolean).join(', ')}`)
      .join('\n');

    const prompt = `You are a creative travel writer. Based on the following completed trip itinerary to ${trip.destination}, ${trip.country}:

${itinerarySummary || 'A wonderful trip with various activities and experiences.'}

Duration: ${trip.duration || 'Multiple days'} | Travelers: ${trip.travelers || 1}

Write a beautiful, personal travel memory journal. Return JSON strictly matching this format:
{
  "title": "A memorable, poetic trip title (e.g. 'Cherry Blossoms and Ramen Dreams')",
  "story": "2-3 vivid paragraphs narrating the trip as a personal travel story. Use first-person plural (we/our). Make it feel warm, nostalgic, and inspiring.",
  "highlights": ["Top moment 1", "Top moment 2", "Top moment 3"],
  "shareableCaption": "A short 1-sentence Instagram-style caption for the trip",
  "mood": "One word describing the trip vibe (e.g. Adventurous, Romantic, Cultural)"
}`;

    const fallback = {
      title: `Memories from ${trip.destination}`,
      story: `Our trip to ${trip.destination} was an unforgettable adventure filled with discovery and wonder. Every moment brought new experiences that we'll cherish for a lifetime.`,
      highlights: ['Amazing local cuisine', 'Breathtaking scenery', 'Unforgettable cultural experiences'],
      shareableCaption: `An unforgettable journey through ${trip.destination} 🌍✈️`,
      mood: 'Adventurous'
    };

    return this._generateJson(prompt, fallback, 'planning');
  }

  async generateInspirationImageQueries(destination) {
    const prompt = `You are an expert travel photographer. For a trip to ${destination}, provide highly specific and famous stock photo search queries for the following 8 categories: 
    Landmark, Nature, Food, Culture, Art, Sightseeing, Shopping, Nightlife.
    For each category, provide a query (2-5 words max) that will yield a breathtaking stock photo of a REAL, iconic place in ${destination} (e.g., for Landmark in Paris: "Eiffel Tower Paris", for Culture in Kyoto: "Fushimi Inari Shrine Kyoto").
    Return strictly JSON matching this format:
    {
      "Landmark": "query",
      "Nature": "query",
      "Food": "query",
      "Culture": "query",
      "Art": "query",
      "Sightseeing": "query",
      "Shopping": "query",
      "Nightlife": "query"
    }`;
    const fallback = {
      Landmark: `${destination} landmark architecture`,
      Nature: `${destination} nature scenic landscape`,
      Food: `${destination} food street cuisine`,
      Culture: `${destination} culture heritage temple`,
      Art: `${destination} museum art gallery`,
      Sightseeing: `${destination} city skyline view`,
      Shopping: `${destination} market bazaar shopping`,
      Nightlife: `${destination} night lights festival`
    };
    return this._generateJson(prompt, fallback, 'lightweight');
  }
}

export default new AIService();

