const EXCHANGE_API_URL = 'https://open.er-api.com/v6/latest';

export const COUNTRY_DATA = {
  'India': { currency: 'INR', symbol: '₹', code: 'IN', flag: '🇮🇳', rates: { budget: { hotel: 1500, food: 800, transport: 300, attractions: 200, insurance: 100 }, standard: { hotel: 5000, food: 2000, transport: 1000, attractions: 1000, insurance: 300 }, luxury: { hotel: 15000, food: 6000, transport: 3000, attractions: 3000, insurance: 800 } } },
  'United States': { currency: 'USD', symbol: '$', code: 'US', flag: '🇺🇸', rates: { budget: { hotel: 80, food: 40, transport: 15, attractions: 20, insurance: 5 }, standard: { hotel: 180, food: 80, transport: 30, attractions: 50, insurance: 10 }, luxury: { hotel: 400, food: 200, transport: 100, attractions: 150, insurance: 25 } } },
  'United Kingdom': { currency: 'GBP', symbol: '£', code: 'GB', flag: '🇬🇧', rates: { budget: { hotel: 60, food: 30, transport: 10, attractions: 15, insurance: 5 }, standard: { hotel: 130, food: 60, transport: 25, attractions: 40, insurance: 10 }, luxury: { hotel: 300, food: 150, transport: 80, attractions: 100, insurance: 25 } } },
  'Japan': { currency: 'JPY', symbol: '¥', code: 'JP', flag: '🇯🇵', rates: { budget: { hotel: 6000, food: 3000, transport: 1000, attractions: 1500, insurance: 500 }, standard: { hotel: 15000, food: 7000, transport: 3000, attractions: 4000, insurance: 1000 }, luxury: { hotel: 40000, food: 20000, transport: 10000, attractions: 10000, insurance: 3000 } } },
  'UAE': { currency: 'AED', symbol: 'د.إ', code: 'AE', flag: '🇦🇪', rates: { budget: { hotel: 250, food: 100, transport: 50, attractions: 100, insurance: 20 }, standard: { hotel: 600, food: 250, transport: 150, attractions: 250, insurance: 40 }, luxury: { hotel: 2000, food: 800, transport: 400, attractions: 800, insurance: 100 } } },
  'Singapore': { currency: 'SGD', symbol: 'S$', code: 'SG', flag: '🇸🇬', rates: { budget: { hotel: 80, food: 30, transport: 15, attractions: 30, insurance: 10 }, standard: { hotel: 200, food: 80, transport: 30, attractions: 80, insurance: 20 }, luxury: { hotel: 500, food: 200, transport: 80, attractions: 200, insurance: 50 } } },
  'Australia': { currency: 'AUD', symbol: 'A$', code: 'AU', flag: '🇦🇺', rates: { budget: { hotel: 100, food: 50, transport: 20, attractions: 30, insurance: 10 }, standard: { hotel: 220, food: 100, transport: 40, attractions: 70, insurance: 20 }, luxury: { hotel: 500, food: 250, transport: 120, attractions: 180, insurance: 50 } } },
  'Canada': { currency: 'CAD', symbol: 'C$', code: 'CA', flag: '🇨🇦', rates: { budget: { hotel: 90, food: 40, transport: 15, attractions: 25, insurance: 10 }, standard: { hotel: 200, food: 90, transport: 35, attractions: 60, insurance: 20 }, luxury: { hotel: 450, food: 220, transport: 100, attractions: 150, insurance: 50 } } },
  'Germany': { currency: 'EUR', symbol: '€', code: 'DE', flag: '🇩🇪', rates: { budget: { hotel: 60, food: 30, transport: 10, attractions: 15, insurance: 5 }, standard: { hotel: 130, food: 65, transport: 25, attractions: 40, insurance: 10 }, luxury: { hotel: 280, food: 150, transport: 80, attractions: 100, insurance: 25 } } },
  'France': { currency: 'EUR', symbol: '€', code: 'FR', flag: '🇫🇷', rates: { budget: { hotel: 70, food: 35, transport: 10, attractions: 20, insurance: 5 }, standard: { hotel: 150, food: 70, transport: 25, attractions: 50, insurance: 10 }, luxury: { hotel: 350, food: 180, transport: 80, attractions: 120, insurance: 25 } } },
  'Thailand': { currency: 'THB', symbol: '฿', code: 'TH', flag: '🇹🇭', rates: { budget: { hotel: 600, food: 300, transport: 150, attractions: 200, insurance: 100 }, standard: { hotel: 2000, food: 800, transport: 400, attractions: 800, insurance: 200 }, luxury: { hotel: 8000, food: 2500, transport: 1000, attractions: 2000, insurance: 600 } } },
  'Malaysia': { currency: 'MYR', symbol: 'RM', code: 'MY', flag: '🇲🇾', rates: { budget: { hotel: 80, food: 40, transport: 20, attractions: 30, insurance: 10 }, standard: { hotel: 250, food: 120, transport: 60, attractions: 100, insurance: 20 }, luxury: { hotel: 800, food: 350, transport: 150, attractions: 300, insurance: 60 } } },
  'South Korea': { currency: 'KRW', symbol: '₩', code: 'KR', flag: '🇰🇷', rates: { budget: { hotel: 50000, food: 20000, transport: 10000, attractions: 15000, insurance: 5000 }, standard: { hotel: 120000, food: 50000, transport: 25000, attractions: 40000, insurance: 10000 }, luxury: { hotel: 350000, food: 150000, transport: 60000, attractions: 100000, insurance: 30000 } } },
  'Nepal': { currency: 'NPR', symbol: 'रू', code: 'NP', flag: '🇳🇵', rates: { budget: { hotel: 1500, food: 800, transport: 300, attractions: 500, insurance: 150 }, standard: { hotel: 5000, food: 2000, transport: 1000, attractions: 1500, insurance: 300 }, luxury: { hotel: 15000, food: 6000, transport: 3000, attractions: 4500, insurance: 1000 } } },
  'Sri Lanka': { currency: 'LKR', symbol: 'Rs', code: 'LK', flag: '🇱🇰', rates: { budget: { hotel: 4000, food: 2000, transport: 1000, attractions: 1500, insurance: 500 }, standard: { hotel: 15000, food: 6000, transport: 3000, attractions: 4000, insurance: 1000 }, luxury: { hotel: 45000, food: 18000, transport: 9000, attractions: 12000, insurance: 3000 } } }
};

// Fallback rates if API fails
const FALLBACK_RATES = {
  'USD': 1, 'INR': 83.12, 'GBP': 0.79, 'JPY': 155.2, 'AED': 3.67, 'SGD': 1.35, 'AUD': 1.53, 'CAD': 1.37, 'EUR': 0.92, 'THB': 36.8, 'MYR': 4.75, 'KRW': 1360.5, 'NPR': 133.2, 'LKR': 298.5
};

let cachedRates = null;
let lastFetchTime = null;

export const fetchExchangeRates = async (baseCurrency = 'USD') => {
  // Use cache if less than 1 hour old
  if (cachedRates && lastFetchTime && (Date.now() - lastFetchTime.getTime() < 3600000)) {
    return { rates: cachedRates, isCached: true, lastUpdated: lastFetchTime };
  }

  try {
    const response = await fetch(`${EXCHANGE_API_URL}/${baseCurrency}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    cachedRates = data.rates;
    lastFetchTime = new Date();
    return { rates: data.rates, isCached: false, lastUpdated: lastFetchTime };
  } catch (error) {
    console.warn('Failed to fetch live rates, using fallback rates', error);
    lastFetchTime = new Date(); // Update to current time for UI
    return { rates: FALLBACK_RATES, isCached: true, lastUpdated: lastFetchTime };
  }
};

export const calculateTripCost = (destCountry, days, travelers, style) => {
  const destData = COUNTRY_DATA[destCountry];
  if (!destData) return null; // Used to trigger "Live data unavailable"

  const rates = destData.rates[style.toLowerCase()];
  
  const dailyHotel = rates.hotel; // per room (assume 2 per room)
  const roomsNeeded = Math.ceil(travelers / 2);
  
  const dailyFood = rates.food * travelers;
  const dailyTransport = rates.transport * travelers;
  const dailyAttractions = rates.attractions * travelers;
  const dailyInsurance = rates.insurance * travelers; // Added insurance
  const dailyShopping = Math.round((rates.food + rates.transport) * 0.3 * travelers); // shopping budget

  const dailyTotal = (dailyHotel * roomsNeeded) + dailyFood + dailyTransport + dailyAttractions + dailyInsurance + dailyShopping;
  
  // Local tourist SIM pricing and Visa fees
  const internetSim = Math.round(dailyTotal * 0.05); // roughly 5% of daily total for SIM
  const visaFees = Math.round(dailyTotal * 0.2); // roughly 20% of daily total for Visa
  
  const totalBaseCost = (dailyTotal * days) + internetSim + visaFees;
  const emergencyBuffer = Math.round(totalBaseCost * 0.12); // ~12% emergency
  const miscellaneous = Math.round(totalBaseCost * 0.05); // 5% miscellaneous

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
    destCurrency: destData.currency,
    destSymbol: destData.symbol,
    destCode: destData.code,
    destFlag: destData.flag
  };
};

export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  if (fromCurrency === toCurrency) return amount;
  const amountInUSD = amount / (rates[fromCurrency] || 1);
  return amountInUSD * (rates[toCurrency] || 1);
};
