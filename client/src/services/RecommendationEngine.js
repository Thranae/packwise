const DESTINATIONS = [
  {
    id: 'tokyo-1', city: 'Tokyo', country: 'Japan', rating: '4.9',
    weather: '18° Sunny', budget: '$$$', season: 'Cherry Blossoms', duration: '10 Days',
    matchPercent: 98, bestMonths: 'Mar–May',
    reasoning: "Tokyo in Spring offers perfect weather and world-class cherry blossoms. Flight prices dropped 15% this week.",
    searchQuery: 'Tokyo Japan cherry blossoms temple',
    highlights: ['Cultural Hub', 'Foodie Paradise', 'Night Markets'],
    tags: ['culture', 'food', 'city', 'adventure']
  },
  {
    id: 'bali-1', city: 'Bali', country: 'Indonesia', rating: '4.8',
    weather: '28° Sunny', budget: '$$', season: 'Dry Season', duration: '7 Days',
    matchPercent: 94, bestMonths: 'Apr–Oct',
    reasoning: "Bali is perfect for warm-weather lovers on a moderate budget. Start of dry season means fewer crowds and pristine beaches.",
    searchQuery: 'Bali Indonesia rice terrace beach',
    highlights: ['Beach Life', 'Yoga Retreats', 'Surf Culture'],
    tags: ['warm', 'beach', 'culture', 'budget', 'nature']
  },
  {
    id: 'swiss-1', city: 'Zermatt', country: 'Switzerland', rating: '4.9',
    weather: '-2° Snowy', budget: '$$$$', season: 'Winter', duration: '5 Days',
    matchPercent: 82, bestMonths: 'Dec–Mar',
    reasoning: "A stunning alpine escape. Zermatt offers some of the best skiing in the world right now with freshly powdered slopes.",
    searchQuery: 'Zermatt Switzerland Matterhorn snow',
    highlights: ['World-Class Skiing', 'Mountain Views', 'Luxury Chalets'],
    tags: ['cold', 'adventure', 'mountains', 'luxury']
  },
  {
    id: 'rome-1', city: 'Rome', country: 'Italy', rating: '4.7',
    weather: '22° Clear', budget: '$$$', season: 'Autumn', duration: '8 Days',
    matchPercent: 91, bestMonths: 'Sep–Nov',
    reasoning: "Rome aligns perfectly with your love for food and history. The autumn weather is ideal for walking tours.",
    searchQuery: 'Rome Italy Colosseum sunset',
    highlights: ['Ancient History', 'Italian Cuisine', 'Art & Architecture'],
    tags: ['culture', 'food', 'history', 'temperate']
  },
  {
    id: 'santorini-1', city: 'Santorini', country: 'Greece', rating: '4.9',
    weather: '26° Sunny', budget: '$$$', season: 'Summer', duration: '6 Days',
    matchPercent: 95, bestMonths: 'Jun–Sep',
    reasoning: "Iconic sunsets and whitewashed villages. Perfect romantic getaway with world-class dining and beaches.",
    searchQuery: 'Santorini Greece blue dome sunset',
    highlights: ['Romantic Sunsets', 'Wine Tasting', 'Volcanic Beaches'],
    tags: ['warm', 'beach', 'luxury', 'food']
  },
  {
    id: 'kyoto-1', city: 'Kyoto', country: 'Japan', rating: '4.8',
    weather: '16° Mild', budget: '$$', season: 'Autumn', duration: '5 Days',
    matchPercent: 93, bestMonths: 'Oct–Nov',
    reasoning: "Kyoto's temples surrounded by autumn foliage are breathtaking. A peaceful cultural immersion at moderate cost.",
    searchQuery: 'Kyoto Japan temple autumn foliage',
    highlights: ['Ancient Temples', 'Tea Ceremony', 'Bamboo Forest'],
    tags: ['culture', 'nature', 'temperate', 'budget']
  },
  {
    id: 'iceland-1', city: 'Reykjavik', country: 'Iceland', rating: '4.7',
    weather: '2° Cloudy', budget: '$$$', season: 'Winter', duration: '7 Days',
    matchPercent: 85, bestMonths: 'Sep–Mar',
    reasoning: "Northern lights season is in full swing. Iceland offers dramatic landscapes and geothermal hot springs.",
    searchQuery: 'Iceland northern lights waterfall',
    highlights: ['Northern Lights', 'Geothermal Spas', 'Glacier Hikes'],
    tags: ['cold', 'adventure', 'nature', 'mountains']
  },
  {
    id: 'morocco-1', city: 'Marrakech', country: 'Morocco', rating: '4.6',
    weather: '24° Warm', budget: '$', season: 'Spring', duration: '5 Days',
    matchPercent: 88, bestMonths: 'Mar–May',
    reasoning: "Vibrant souks, stunning riads, and incredible food. Marrakech is a sensory adventure on a very friendly budget.",
    searchQuery: 'Marrakech Morocco medina market',
    highlights: ['Vibrant Souks', 'Riad Stays', 'Desert Excursions'],
    tags: ['warm', 'culture', 'food', 'budget', 'adventure']
  }
];

const FILTER_MAP = {
  'Beach': ['beach'],
  'Luxury': ['luxury'],
  'Adventure': ['adventure'],
  'Culture': ['culture', 'history'],
  'Budget': ['budget'],
  'Nature': ['nature'],
  'Food': ['food'],
  'Solo': ['budget', 'culture'],
  'Mountains': ['mountains'],
  'Nightlife': ['city'],
  'Road Trips': ['adventure', 'nature'],
  'Wildlife': ['nature', 'adventure']
};

export class RecommendationEngine {
  static async generateRecommendation(userPreferences, sessionHistory, filterTag = null) {
    await new Promise(resolve => setTimeout(resolve, 800));

    const seenIds = new Set(sessionHistory.map(r => r.id));
    let pool = DESTINATIONS.filter(d => !seenIds.has(d.id));
    if (pool.length === 0) pool = [...DESTINATIONS];

    if (filterTag && FILTER_MAP[filterTag]) {
      const filterTags = FILTER_MAP[filterTag];
      const filtered = pool.filter(d => d.tags.some(t => filterTags.includes(t)));
      if (filtered.length > 0) pool = filtered;
    }

    let best = pool[0];
    let topScore = -1;

    for (const dest of pool) {
      let score = 0;
      if (userPreferences.preferredClimates?.some(c => dest.tags.includes(c))) score += 2;
      if (userPreferences.interests?.some(i => dest.tags.includes(i))) score += 3;
      score += Math.random() * 1.5;
      if (score > topScore) { topScore = score; best = dest; }
    }

    return best;
  }

  static getRecommendedDestinations(filterTag = null, limit = 6) {
    let pool = [...DESTINATIONS];
    if (filterTag && FILTER_MAP[filterTag]) {
      const tags = FILTER_MAP[filterTag];
      const filtered = pool.filter(d => d.tags.some(t => tags.includes(t)));
      if (filtered.length > 0) pool = filtered;
    }
    return pool.slice(0, limit);
  }

  static searchDestinations(query) {
    if (!query || query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return DESTINATIONS.filter(d =>
      d.city.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.tags.some(t => t.includes(q)) ||
      d.season.toLowerCase().includes(q)
    );
  }
}
