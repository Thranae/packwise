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

  async generateTripPlan(destination, days) {
    const prompt = `Create a high-level trip plan for ${days} days in ${destination}. Return JSON with { title: String, summary: String, highlights: [String] }`;
    return this._generateJson(prompt, { title: `Trip to ${destination}`, summary: "Ready to plan your trip!", highlights: [] }, 'planning');
  }

  async generatePackingList(destination, weather, duration) {
    const durationText = duration ? `for a ${duration} trip` : 'for a trip';
    const prompt = `Create a smart, comprehensive packing list ${durationText} to ${destination}. The current weather forecast is: ${JSON.stringify(weather)}. 
    Analyze the climate and suggest appropriate items tailored to the destination and weather.
    CRITICAL: You must adapt the clothing style to the destination's cultural fashion trends. For example, if it's a European destination, suggest "Old Money" styling like linen shirts and tailored pants. If it's a tropical beach, suggest breezy, vibrant resort wear. Ensure the clothing items reflect the local vibe!
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
    Assume a 7-day trip if duration is not specified.
    Return JSON strictly matching this format:
    {
      "destination": "City Name",
      "country": "Country Name",
      "budget": 2000,
      "currency": "EUR",
      "timezone": "Europe/Paris",
      "duration": "7 Days"
    }`;
    return this._generateJson(aiPrompt, {
      destination: prompt ? prompt.split('.')[0].replace('Destination: ', '').trim() : "Unknown Destination",
      country: "Unknown",
      budget: 3000,
      currency: "USD",
      timezone: "UTC",
      duration: "7 Days"
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

    const aiPrompt = `Recommend 6 popular ${category} for a tourist visiting ${destination}. Return JSON as an array of objects: [{ "name": "Name of Place", "category": "${category}", "rating": "4.5", "distance": "2.5 km", "time": "15m", "desc": "Brief 1 sentence description" }]`;
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
    const prompt = `Generate exactly ${count} highly descriptive visual prompts for hyper-realistic fashion photography street style outfits suitable for a trip to ${destination}. 
    Make half of the prompts for men and half for women. 
    Each prompt should be a detailed string describing the outfit, setting, and lighting. 
    Return JSON strictly matching this format:
    {
      "prompts": [
        "A hyperrealistic street style photograph of a woman wearing...",
        "A hyperrealistic street style photograph of a man wearing..."
      ]
    }`;
    const fallbackPrompts = Array.from({ length: count }).map((_, i) => 
      `Hyperrealistic fashion photography street style outfit in ${destination}, high fashion, cinematic lighting, highly detailed ${i}`
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
}

export default new AIService();
