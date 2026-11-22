const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest';

export const COUNTRY_DATA = {
  'India': { currency: 'INR', symbol: '₹', code: 'IN', flag: '🇮🇳', rates: { budget: { hotel: 1500, food: 800, transport: 300, attractions: 200, insurance: 100 }, standard: { hotel: 5000, food: 2000, transport: 1000, attractions: 1000, insurance: 300 }, luxury: { hotel: 15000, food: 6000, transport: 3000, attractions: 3000, insurance: 800 } } },
  'United States': { currency: 'USD', symbol: '$', code: 'US', flag: '🇺🇸', rates: { budget: { hotel: 90, food: 45, transport: 18, attractions: 25, insurance: 8 }, standard: { hotel: 200, food: 90, transport: 35, attractions: 55, insurance: 15 }, luxury: { hotel: 480, food: 220, transport: 110, attractions: 160, insurance: 35 } } },
  'United Kingdom': { currency: 'GBP', symbol: '£', code: 'GB', flag: '🇬🇧', rates: { budget: { hotel: 70, food: 35, transport: 14, attractions: 20, insurance: 6 }, standard: { hotel: 150, food: 70, transport: 30, attractions: 45, insurance: 12 }, luxury: { hotel: 360, food: 170, transport: 90, attractions: 120, insurance: 30 } } },
  'Switzerland': { currency: 'CHF', symbol: 'CHF', code: 'CH', flag: '🇨🇭', rates: { budget: { hotel: 120, food: 55, transport: 28, attractions: 35, insurance: 10 }, standard: { hotel: 260, food: 110, transport: 55, attractions: 75, insurance: 25 }, luxury: { hotel: 620, food: 260, transport: 130, attractions: 180, insurance: 60 } } },
  'Italy': { currency: 'EUR', symbol: '€', code: 'IT', flag: '🇮🇹', rates: { budget: { hotel: 65, food: 35, transport: 12, attractions: 20, insurance: 5 }, standard: { hotel: 140, food: 70, transport: 25, attractions: 45, insurance: 10 }, luxury: { hotel: 340, food: 160, transport: 75, attractions: 110, insurance: 25 } } },
  'France': { currency: 'EUR', symbol: '€', code: 'FR', flag: '🇫🇷', rates: { budget: { hotel: 75, food: 40, transport: 14, attractions: 22, insurance: 6 }, standard: { hotel: 160, food: 75, transport: 28, attractions: 50, insurance: 12 }, luxury: { hotel: 380, food: 190, transport: 85, attractions: 130, insurance: 28 } } },
  'Germany': { currency: 'EUR', symbol: '€', code: 'DE', flag: '🇩🇪', rates: { budget: { hotel: 65, food: 32, transport: 12, attractions: 18, insurance: 5 }, standard: { hotel: 135, food: 68, transport: 26, attractions: 42, insurance: 10 }, luxury: { hotel: 300, food: 155, transport: 80, attractions: 105, insurance: 25 } } },
  'Spain': { currency: 'EUR', symbol: '€', code: 'ES', flag: '🇪🇸', rates: { budget: { hotel: 55, food: 30, transport: 10, attractions: 18, insurance: 5 }, standard: { hotel: 125, food: 60, transport: 22, attractions: 38, insurance: 10 }, luxury: { hotel: 290, food: 145, transport: 65, attractions: 95, insurance: 22 } } },
  'Japan': { currency: 'JPY', symbol: '¥', code: 'JP', flag: '🇯🇵', rates: { budget: { hotel: 7000, food: 3500, transport: 1200, attractions: 1800, insurance: 600 }, standard: { hotel: 16000, food: 7500, transport: 3200, attractions: 4500, insurance: 1200 }, luxury: { hotel: 45000, food: 22000, transport: 11000, attractions: 12000, insurance: 3500 } } },
  'UAE': { currency: 'AED', symbol: 'د.إ', code: 'AE', flag: '🇦🇪', rates: { budget: { hotel: 280, food: 110, transport: 55, attractions: 110, insurance: 25 }, standard: { hotel: 650, food: 270, transport: 160, attractions: 270, insurance: 45 }, luxury: { hotel: 2200, food: 850, transport: 420, attractions: 850, insurance: 110 } } },
  'Singapore': { currency: 'SGD', symbol: 'S$', code: 'SG', flag: '🇸🇬', rates: { budget: { hotel: 90, food: 35, transport: 16, attractions: 35, insurance: 10 }, standard: { hotel: 220, food: 85, transport: 32, attractions: 85, insurance: 22 }, luxury: { hotel: 550, food: 210, transport: 85, attractions: 220, insurance: 55 } } },
  'Australia': { currency: 'AUD', symbol: 'A$', code: 'AU', flag: '🇦🇺', rates: { budget: { hotel: 110, food: 55, transport: 22, attractions: 35, insurance: 12 }, standard: { hotel: 230, food: 105, transport: 42, attractions: 75, insurance: 22 }, luxury: { hotel: 540, food: 260, transport: 125, attractions: 190, insurance: 55 } } },
  'Canada': { currency: 'CAD', symbol: 'C$', code: 'CA', flag: '🇨🇦', rates: { budget: { hotel: 95, food: 45, transport: 18, attractions: 28, insurance: 10 }, standard: { hotel: 210, food: 95, transport: 38, attractions: 65, insurance: 20 }, luxury: { hotel: 480, food: 230, transport: 110, attractions: 160, insurance: 55 } } },
  'Thailand': { currency: 'THB', symbol: '฿', code: 'TH', flag: '🇹🇭', rates: { budget: { hotel: 700, food: 350, transport: 180, attractions: 250, insurance: 100 }, standard: { hotel: 2200, food: 900, transport: 450, attractions: 900, insurance: 220 }, luxury: { hotel: 8500, food: 2800, transport: 1100, attractions: 2200, insurance: 650 } } },
  'Malaysia': { currency: 'MYR', symbol: 'RM', code: 'MY', flag: '🇲🇾', rates: { budget: { hotel: 90, food: 45, transport: 22, attractions: 35, insurance: 12 }, standard: { hotel: 270, food: 130, transport: 65, attractions: 110, insurance: 22 }, luxury: { hotel: 850, food: 380, transport: 160, attractions: 320, insurance: 65 } } },
  'Indonesia': { currency: 'IDR', symbol: 'Rp', code: 'ID', flag: '🇮🇩', rates: { budget: { hotel: 350000, food: 160000, transport: 80000, attractions: 120000, insurance: 40000 }, standard: { hotel: 950000, food: 420000, transport: 220000, attractions: 320000, insurance: 85000 }, luxury: { hotel: 3200000, food: 1300000, transport: 550000, attractions: 850000, insurance: 220000 } } },
  'Vietnam': { currency: 'VND', symbol: '₫', code: 'VN', flag: '🇻🇳', rates: { budget: { hotel: 550000, food: 280000, transport: 120000, attractions: 160000, insurance: 50000 }, standard: { hotel: 1600000, food: 650000, transport: 320000, attractions: 420000, insurance: 130000 }, luxury: { hotel: 5200000, food: 1900000, transport: 850000, attractions: 1300000, insurance: 320000 } } },
  'Maldives': { currency: 'USD', symbol: '$', code: 'MV', flag: '🇲🇻', rates: { budget: { hotel: 130, food: 55, transport: 35, attractions: 45, insurance: 15 }, standard: { hotel: 380, food: 130, transport: 85, attractions: 110, insurance: 35 }, luxury: { hotel: 1300, food: 380, transport: 260, attractions: 320, insurance: 85 } } },
  'Turkey': { currency: 'TRY', symbol: '₺', code: 'TR', flag: '🇹🇷', rates: { budget: { hotel: 1300, food: 650, transport: 220, attractions: 420, insurance: 110 }, standard: { hotel: 3200, food: 1600, transport: 550, attractions: 1100, insurance: 260 }, luxury: { hotel: 9500, food: 4200, transport: 1600, attractions: 2600, insurance: 650 } } },
  'Greece': { currency: 'EUR', symbol: '€', code: 'GR', flag: '🇬🇷', rates: { budget: { hotel: 65, food: 38, transport: 16, attractions: 22, insurance: 6 }, standard: { hotel: 145, food: 75, transport: 32, attractions: 48, insurance: 12 }, luxury: { hotel: 360, food: 180, transport: 85, attractions: 125, insurance: 26 } } },
  'Portugal': { currency: 'EUR', symbol: '€', code: 'PT', flag: '🇵🇹', rates: { budget: { hotel: 55, food: 32, transport: 12, attractions: 16, insurance: 5 }, standard: { hotel: 115, food: 58, transport: 22, attractions: 36, insurance: 10 }, luxury: { hotel: 270, food: 135, transport: 65, attractions: 85, insurance: 22 } } },
  'Netherlands': { currency: 'EUR', symbol: '€', code: 'NL', flag: '🇳🇱', rates: { budget: { hotel: 80, food: 42, transport: 16, attractions: 26, insurance: 8 }, standard: { hotel: 170, food: 85, transport: 32, attractions: 58, insurance: 15 }, luxury: { hotel: 390, food: 200, transport: 95, attractions: 145, insurance: 32 } } },
  'South Korea': { currency: 'KRW', symbol: '₩', code: 'KR', flag: '🇰🇷', rates: { budget: { hotel: 55000, food: 22000, transport: 11000, attractions: 16000, insurance: 5500 }, standard: { hotel: 130000, food: 55000, transport: 28000, attractions: 42000, insurance: 11000 }, luxury: { hotel: 380000, food: 160000, transport: 65000, attractions: 110000, insurance: 32000 } } },
  'Nepal': { currency: 'NPR', symbol: 'रू', code: 'NP', flag: '🇳🇵', rates: { budget: { hotel: 1600, food: 850, transport: 320, attractions: 550, insurance: 160 }, standard: { hotel: 5200, food: 2100, transport: 1100, attractions: 1600, insurance: 320 }, luxury: { hotel: 16000, food: 6500, transport: 3200, attractions: 4800, insurance: 1100 } } },
  'Sri Lanka': { currency: 'LKR', symbol: 'Rs', code: 'LK', flag: '🇱🇰', rates: { budget: { hotel: 4200, food: 2100, transport: 1100, attractions: 1600, insurance: 550 }, standard: { hotel: 16000, food: 6500, transport: 3200, attractions: 4200, insurance: 1100 }, luxury: { hotel: 48000, food: 19000, transport: 9500, attractions: 13000, insurance: 3200 } } },
  'Mexico': { currency: 'MXN', symbol: '$', code: 'MX', flag: '🇲🇽', rates: { budget: { hotel: 850, food: 420, transport: 160, attractions: 260, insurance: 85 }, standard: { hotel: 2100, food: 950, transport: 370, attractions: 620, insurance: 190 }, luxury: { hotel: 6300, food: 2600, transport: 1050, attractions: 1700, insurance: 520 } } },
  'Brazil': { currency: 'BRL', symbol: 'R$', code: 'BR', flag: '🇧🇷', rates: { budget: { hotel: 210, food: 105, transport: 42, attractions: 65, insurance: 22 }, standard: { hotel: 470, food: 230, transport: 95, attractions: 145, insurance: 48 }, luxury: { hotel: 1250, food: 580, transport: 260, attractions: 370, insurance: 125 } } },
  'South Africa': { currency: 'ZAR', symbol: 'R', code: 'ZA', flag: '🇿🇦', rates: { budget: { hotel: 850, food: 420, transport: 160, attractions: 210, insurance: 85 }, standard: { hotel: 1900, food: 880, transport: 360, attractions: 520, insurance: 190 }, luxury: { hotel: 4800, food: 2100, transport: 950, attractions: 1250, insurance: 420 } } },
  'New Zealand': { currency: 'NZD', symbol: 'NZ$', code: 'NZ', flag: '🇳🇿', rates: { budget: { hotel: 115, food: 58, transport: 26, attractions: 38, insurance: 12 }, standard: { hotel: 250, food: 115, transport: 52, attractions: 85, insurance: 26 }, luxury: { hotel: 570, food: 270, transport: 135, attractions: 200, insurance: 65 } } },
  'Austria': { currency: 'EUR', symbol: '€', code: 'AT', flag: '🇦🇹', rates: { budget: { hotel: 70, food: 36, transport: 14, attractions: 22, insurance: 6 }, standard: { hotel: 145, food: 72, transport: 28, attractions: 48, insurance: 12 }, luxury: { hotel: 330, food: 165, transport: 75, attractions: 115, insurance: 26 } } },
  'Norway': { currency: 'NOK', symbol: 'kr', code: 'NO', flag: '🇳🇴', rates: { budget: { hotel: 950, food: 480, transport: 160, attractions: 260, insurance: 85 }, standard: { hotel: 2100, food: 980, transport: 370, attractions: 580, insurance: 190 }, luxury: { hotel: 4700, food: 2300, transport: 950, attractions: 1350, insurance: 420 } } },
  'Sweden': { currency: 'SEK', symbol: 'kr', code: 'SE', flag: '🇸🇪', rates: { budget: { hotel: 850, food: 420, transport: 140, attractions: 210, insurance: 75 }, standard: { hotel: 1900, food: 880, transport: 320, attractions: 500, insurance: 160 }, luxury: { hotel: 4200, food: 2000, transport: 850, attractions: 1150, insurance: 370 } } },
  'Denmark': { currency: 'DKK', symbol: 'kr', code: 'DK', flag: '🇩🇰', rates: { budget: { hotel: 680, food: 360, transport: 130, attractions: 190, insurance: 65 }, standard: { hotel: 1450, food: 780, transport: 260, attractions: 440, insurance: 135 }, luxury: { hotel: 3350, food: 1650, transport: 680, attractions: 980, insurance: 310 } } },
  'Ireland': { currency: 'EUR', symbol: '€', code: 'IE', flag: '🇮🇪', rates: { budget: { hotel: 78, food: 42, transport: 16, attractions: 26, insurance: 8 }, standard: { hotel: 165, food: 82, transport: 32, attractions: 52, insurance: 15 }, luxury: { hotel: 370, food: 185, transport: 85, attractions: 135, insurance: 32 } } },
  'Belgium': { currency: 'EUR', symbol: '€', code: 'BE', flag: '🇧🇪', rates: { budget: { hotel: 72, food: 36, transport: 14, attractions: 22, insurance: 6 }, standard: { hotel: 155, food: 78, transport: 26, attractions: 46, insurance: 12 }, luxury: { hotel: 350, food: 175, transport: 78, attractions: 120, insurance: 26 } } },
  'Egypt': { currency: 'EGP', symbol: 'E£', code: 'EG', flag: '🇪🇬', rates: { budget: { hotel: 1300, food: 650, transport: 220, attractions: 420, insurance: 110 }, standard: { hotel: 3400, food: 1600, transport: 650, attractions: 1150, insurance: 270 }, luxury: { hotel: 9800, food: 4200, transport: 1700, attractions: 2700, insurance: 700 } } },
  'Saudi Arabia': { currency: 'SAR', symbol: '﷼', code: 'SA', flag: '🇸🇦', rates: { budget: { hotel: 260, food: 125, transport: 55, attractions: 85, insurance: 26 }, standard: { hotel: 680, food: 290, transport: 160, attractions: 230, insurance: 52 }, luxury: { hotel: 1950, food: 780, transport: 420, attractions: 720, insurance: 125 } } },
  'Qatar': { currency: 'QAR', symbol: 'QR', code: 'QA', flag: '🇶🇦', rates: { budget: { hotel: 290, food: 135, transport: 65, attractions: 95, insurance: 32 }, standard: { hotel: 720, food: 310, transport: 170, attractions: 250, insurance: 62 }, luxury: { hotel: 2150, food: 880, transport: 470, attractions: 820, insurance: 155 } } }
};

// Aliases and destination keywords mapping to country keys
const COUNTRY_ALIASES = {
  'usa': 'United States',
  'us': 'United States',
  'united states of america': 'United States',
  'america': 'United States',
  'uk': 'United Kingdom',
  'great britain': 'United Kingdom',
  'britain': 'United Kingdom',
  'england': 'United Kingdom',
  'scotland': 'United Kingdom',
  'london': 'United Kingdom',
  'uae': 'UAE',
  'united arab emirates': 'UAE',
  'dubai': 'UAE',
  'abu dhabi': 'UAE',
  'tokyo': 'Japan',
  'kyoto': 'Japan',
  'osaka': 'Japan',
  'korea': 'South Korea',
  'seoul': 'South Korea',
  'swiss': 'Switzerland',
  'swiss alps': 'Switzerland',
  'zurich': 'Switzerland',
  'geneva': 'Switzerland',
  'interlaken': 'Switzerland',
  'rome': 'Italy',
  'florence': 'Italy',
  'venice': 'Italy',
  'milan': 'Italy',
  'amalfi': 'Italy',
  'amalfi coast': 'Italy',
  'paris': 'France',
  'nice': 'France',
  'berlin': 'Germany',
  'munich': 'Germany',
  'frankfurt': 'Germany',
  'madrid': 'Spain',
  'barcelona': 'Spain',
  'seville': 'Spain',
  'ibiza': 'Spain',
  'bangkok': 'Thailand',
  'phuket': 'Thailand',
  'chiang mai': 'Thailand',
  'bali': 'Indonesia',
  'jakarta': 'Indonesia',
  'hanoi': 'Vietnam',
  'ho chi minh': 'Vietnam',
  'danang': 'Vietnam',
  'amsterdam': 'Netherlands',
  'holland': 'Netherlands',
  'athens': 'Greece',
  'santorini': 'Greece',
  'mykonos': 'Greece',
  'lisbon': 'Portugal',
  'porto': 'Portugal',
  'vienna': 'Austria',
  'cairo': 'Egypt',
  'sydney': 'Australia',
  'melbourne': 'Australia',
  'toronto': 'Canada',
  'vancouver': 'Canada',
  'colombo': 'Sri Lanka',
  'kathmandu': 'Nepal',
  'delhi': 'India',
  'mumbai': 'India',
  'bangalore': 'India',
  'goa': 'India',
  'kerala': 'India'
};

// Fallback rates if API fails
export const FALLBACK_RATES = {
  'USD': 1, 'INR': 83.12, 'GBP': 0.79, 'JPY': 155.2, 'AED': 3.67, 'SGD': 1.35, 'AUD': 1.53,
  'CAD': 1.37, 'EUR': 0.92, 'THB': 36.8, 'MYR': 4.75, 'KRW': 1360.5, 'NPR': 133.2, 'LKR': 298.5,
  'CHF': 0.91, 'IDR': 16250, 'VND': 25400, 'TRY': 32.5, 'MXN': 17.1, 'BRL': 5.15, 'ZAR': 18.5,
  'NZD': 1.65, 'NOK': 10.7, 'SEK': 10.8, 'DKK': 6.9, 'SAR': 3.75, 'QAR': 3.64, 'EGP': 47.8
};

let cachedRates = null;
let lastFetchTime = null;

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  if (cachedRates && lastFetchTime && (Date.now() - lastFetchTime.getTime() < 3600000)) {
    return { rates: cachedRates, isCached: true, lastUpdated: lastFetchTime };
  }

  try {
    const response = await fetch(`${EXCHANGE_API_URL}/${baseCurrency}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    cachedRates = { ...FALLBACK_RATES, ...data.rates };
    lastFetchTime = new Date();
    return { rates: cachedRates, isCached: false, lastUpdated: lastFetchTime };
  } catch (error) {
    console.warn('Failed to fetch live rates, using fallback rates', error);
    lastFetchTime = new Date();
    return { rates: FALLBACK_RATES, isCached: true, lastUpdated: lastFetchTime };
  }
};

/**
 * Resolves any country name, alias, or destination string into a known country entry.
 */
export const getCountryData = (countryOrDest) => {
  if (!countryOrDest || typeof countryOrDest !== 'string') {
    return { name: 'United States', ...COUNTRY_DATA['United States'] };
  }

  const raw = countryOrDest.trim();
  
  // 1. Exact match in COUNTRY_DATA
  if (COUNTRY_DATA[raw]) {
    return { name: raw, ...COUNTRY_DATA[raw] };
  }

  const clean = raw.toLowerCase();

  // 2. Case-insensitive search in COUNTRY_DATA
  for (const [country, data] of Object.entries(COUNTRY_DATA)) {
    if (country.toLowerCase() === clean) {
      return { name: country, ...data };
    }
  }

  // 3. Match alias table
  if (COUNTRY_ALIASES[clean]) {
    const target = COUNTRY_ALIASES[clean];
    return { name: target, ...COUNTRY_DATA[target] };
  }

  // 4. Substring matching for destinations (e.g. "Swiss Alps Retreat" -> "Switzerland")
  for (const [alias, target] of Object.entries(COUNTRY_ALIASES)) {
    if (clean.includes(alias)) {
      return { name: target, ...COUNTRY_DATA[target] };
    }
  }

  for (const [country, data] of Object.entries(COUNTRY_DATA)) {
    if (clean.includes(country.toLowerCase())) {
      return { name: country, ...data };
    }
  }

  // 5. Safe global fallback
  return {
    name: raw,
    currency: 'USD',
    symbol: '$',
    code: 'US',
    flag: '🌍',
    rates: {
      budget: { hotel: 85, food: 40, transport: 15, attractions: 20, insurance: 6 },
      standard: { hotel: 180, food: 80, transport: 30, attractions: 50, insurance: 12 },
      luxury: { hotel: 420, food: 200, transport: 95, attractions: 145, insurance: 30 }
    }
  };
};

/**
 * Calculates a comprehensive trip budget based on country rates, duration, travelers, and style.
 */
export const calculateTripCost = (destCountry, days, travelers, style = 'standard') => {
  const destData = getCountryData(destCountry);
  const safeDays = Math.max(1, parseInt(days) || 1);
  const safeTravelers = Math.max(1, parseInt(travelers) || 1);

  // Normalize style safely
  const normStyle = String(style || '').toLowerCase();
  let selectedStyle = 'standard';
  if (normStyle.includes('lux') || normStyle.includes('high') || normStyle.includes('expensive')) {
    selectedStyle = 'luxury';
  } else if (normStyle.includes('budg') || normStyle.includes('cheap') || normStyle.includes('low')) {
    selectedStyle = 'budget';
  }

  const rates = destData.rates[selectedStyle] || destData.rates['standard'] || {
    hotel: 180, food: 80, transport: 30, attractions: 50, insurance: 12
  };

  const dailyHotel = rates.hotel;
  const roomsNeeded = Math.ceil(safeTravelers / 2);

  const dailyFood = rates.food * safeTravelers;
  const dailyTransport = rates.transport * safeTravelers;
  const dailyAttractions = rates.attractions * safeTravelers;
  const dailyInsurance = rates.insurance * safeTravelers;
  const dailyShopping = Math.round((rates.food + rates.transport) * 0.3 * safeTravelers);

  const dailyTotal = (dailyHotel * roomsNeeded) + dailyFood + dailyTransport + dailyAttractions + dailyInsurance + dailyShopping;

  const internetSim = Math.max(10, Math.round(dailyTotal * 0.05));
  const visaFees = Math.round(dailyTotal * 0.15);

  const totalBaseCost = (dailyTotal * safeDays) + internetSim + visaFees;
  const emergencyBuffer = Math.round(totalBaseCost * 0.12);
  const miscellaneous = Math.round(totalBaseCost * 0.05);

  const totalCost = totalBaseCost + emergencyBuffer + miscellaneous;

  return {
    dailyBreakdown: {
      hotel: dailyHotel * roomsNeeded,
      food: dailyFood,
      transport: dailyTransport,
      attractions: dailyAttractions,
      shopping: dailyShopping,
      insurance: dailyInsurance,
      total: dailyTotal
    },
    summary: {
      totalBudget: totalCost,
      averageDailySpend: dailyTotal,
      emergencyReserve: emergencyBuffer,
      internetSim,
      visaFees,
      miscellaneous
    },
    destCountry: destData.name,
    destCurrency: destData.currency,
    destSymbol: destData.symbol,
    destCode: destData.code,
    destFlag: destData.flag
  };
};

/**
 * Returns a guaranteed positive, country-appropriate budget for any trip object.
 */
export const getRealisticTripBudget = (trip) => {
  if (!trip) return 3000;
  
  const numBudget = Number(trip.budget);
  if (Number.isFinite(numBudget) && numBudget > 0) {
    return numBudget;
  }

  const country = trip.country || trip.destination || 'United States';
  let days = 5;
  if (trip.startDate && trip.endDate) {
    const diff = new Date(trip.endDate) - new Date(trip.startDate);
    const calculatedDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (calculatedDays > 0) days = calculatedDays;
  } else if (trip.duration) {
    const parsed = parseInt(trip.duration);
    if (!isNaN(parsed) && parsed > 0) days = parsed;
  }

  const travelers = trip.travelers || 1;
  const style = trip.travelStyle || 'standard';

  const costs = calculateTripCost(country, days, travelers, style);
  return costs.summary.totalBudget;
};

export const convertCurrency = (amount, fromCurrency, toCurrency, rates = FALLBACK_RATES) => {
  if (!amount || fromCurrency === toCurrency) return amount || 0;
  const fromRate = rates[fromCurrency] || FALLBACK_RATES[fromCurrency] || 1;
  const toRate = rates[toCurrency] || FALLBACK_RATES[toCurrency] || 1;
  const amountInUSD = amount / fromRate;
  return amountInUSD * toRate;
};
