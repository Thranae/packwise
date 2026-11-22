import Trip from '../models/Trip.js';
import { catchAsync } from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as geminiService from '../services/geminiService.js';

export const estimateTripBudget = (countryOrDest, days = 7, travelers = 1, style = 'standard') => {
  const c = String(countryOrDest || '').toLowerCase();
  let baseDailyUSD = 180;
  let currency = 'USD';
  let country = 'United States';
  
  if (c.includes('india') || c.includes('delhi') || c.includes('mumbai') || c.includes('goa') || c.includes('bangalore')) {
    baseDailyUSD = 50;
    currency = 'INR';
    country = 'India';
  } else if (c.includes('japan') || c.includes('tokyo') || c.includes('kyoto') || c.includes('osaka')) {
    baseDailyUSD = 160;
    currency = 'JPY';
    country = 'Japan';
  } else if (c.includes('switzerland') || c.includes('swiss') || c.includes('zurich') || c.includes('geneva')) {
    baseDailyUSD = 260;
    currency = 'CHF';
    country = 'Switzerland';
  } else if (c.includes('uk') || c.includes('united kingdom') || c.includes('london') || c.includes('britain') || c.includes('england')) {
    baseDailyUSD = 190;
    currency = 'GBP';
    country = 'United Kingdom';
  } else if (c.includes('france') || c.includes('paris')) {
    baseDailyUSD = 170;
    currency = 'EUR';
    country = 'France';
  } else if (c.includes('italy') || c.includes('rome') || c.includes('amalfi') || c.includes('florence') || c.includes('venice')) {
    baseDailyUSD = 150;
    currency = 'EUR';
    country = 'Italy';
  } else if (c.includes('germany') || c.includes('berlin') || c.includes('munich')) {
    baseDailyUSD = 145;
    currency = 'EUR';
    country = 'Germany';
  } else if (c.includes('spain') || c.includes('madrid') || c.includes('barcelona')) {
    baseDailyUSD = 135;
    currency = 'EUR';
    country = 'Spain';
  } else if (c.includes('uae') || c.includes('dubai') || c.includes('abu dhabi')) {
    baseDailyUSD = 220;
    currency = 'AED';
    country = 'UAE';
  } else if (c.includes('singapore')) {
    baseDailyUSD = 190;
    currency = 'SGD';
    country = 'Singapore';
  } else if (c.includes('australia') || c.includes('sydney') || c.includes('melbourne')) {
    baseDailyUSD = 200;
    currency = 'AUD';
    country = 'Australia';
  } else if (c.includes('canada') || c.includes('toronto') || c.includes('vancouver')) {
    baseDailyUSD = 180;
    currency = 'CAD';
    country = 'Canada';
  } else if (c.includes('thailand') || c.includes('bangkok') || c.includes('phuket')) {
    baseDailyUSD = 70;
    currency = 'THB';
    country = 'Thailand';
  } else if (c.includes('indonesia') || c.includes('bali')) {
    baseDailyUSD = 65;
    currency = 'IDR';
    country = 'Indonesia';
  } else if (c.includes('malaysia') || c.includes('kuala lumpur')) {
    baseDailyUSD = 75;
    currency = 'MYR';
    country = 'Malaysia';
  } else if (c.includes('korea') || c.includes('seoul')) {
    baseDailyUSD = 150;
    currency = 'KRW';
    country = 'South Korea';
  }

  const mult = String(style).toLowerCase().includes('lux') ? 2.2 : String(style).toLowerCase().includes('budg') ? 0.6 : 1.0;
  const ratesToUSD = {
    'USD': 1, 'INR': 83.12, 'JPY': 155.2, 'CHF': 0.91, 'GBP': 0.79, 'EUR': 0.92,
    'AED': 3.67, 'SGD': 1.35, 'AUD': 1.53, 'CAD': 1.37, 'THB': 36.8, 'IDR': 16250,
    'MYR': 4.75, 'KRW': 1360.5
  };
  const rate = ratesToUSD[currency] || 1;
  const safeDays = Math.max(1, parseInt(days) || 7);
  const safeTravelers = Math.max(1, parseInt(travelers) || 1);
  const total = Math.round(baseDailyUSD * mult * safeDays * safeTravelers * rate);
  return { budget: total, currency, country };
};

export const generateTrip = catchAsync(async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  
  const est = estimateTripBudget(prompt, 7, 2, 'standard');

  const tripData = {
    destination: prompt || "Unknown Destination",
    country: est.country,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    budget: est.budget,
    currency: est.currency,
    itinerary: []
  };

  const newTrip = new Trip({
    ...tripData,
    user: userId
  });

  await newTrip.save();
  ApiResponse.send(res, 201, 'Trip generated successfully', newTrip);
});

export const modifyTrip = catchAsync(async (req, res) => {
  const { currentTrip, message } = req.body;
  
  const updatedTripData = await geminiService.chatWithTrip(currentTrip, message);
  delete updatedTripData._id;
  
  const updatedTrip = await Trip.findByIdAndUpdate(
    currentTrip._id, 
    { $set: updatedTripData }, 
    { new: true }
  );
  ApiResponse.send(res, 200, 'Trip modified successfully', updatedTrip);
});

export const getUserTrips = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  const trips = await Trip.find({ user: userId }).sort({ createdAt: -1 });

  // Auto-heal any legacy trips with budget: 0 so client receives realistic country budgets
  const healedTrips = trips.map(t => {
    const doc = t.toObject();
    if (!doc.budget || Number(doc.budget) === 0) {
      const days = doc.startDate && doc.endDate ? Math.max(1, Math.ceil((new Date(doc.endDate) - new Date(doc.startDate)) / 86400000)) : 7;
      const est = estimateTripBudget(doc.country || doc.destination, days, doc.travelers || 1, doc.travelStyle || 'standard');
      doc.budget = est.budget;
      if (!doc.currency || doc.currency === 'USD') doc.currency = est.currency;
      if (!doc.country || doc.country === 'Unknown') doc.country = est.country;
    }
    return doc;
  });

  ApiResponse.send(res, 200, 'Trips fetched successfully', healedTrips);
});

export const createTrip = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  const body = { ...req.body };

  let numericBudget = Number(body.budget);
  if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
    const days = body.startDate && body.endDate ? Math.max(1, Math.ceil((new Date(body.endDate) - new Date(body.startDate)) / 86400000)) : 7;
    const est = estimateTripBudget(body.country || body.destination, days, body.travelers || 1, body.travelStyle || body.budget || 'standard');
    body.budget = est.budget;
    if (!body.currency || body.currency === 'USD') body.currency = est.currency;
    if (!body.country || body.country === 'Unknown') body.country = est.country;
  } else {
    body.budget = numericBudget;
  }

  const newTrip = new Trip({
    ...body,
    user: userId
  });
  await newTrip.save();
  ApiResponse.send(res, 201, 'Trip created successfully', newTrip);
});

export const deleteTrip = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: userId });
  if (!trip) return ApiResponse.send(res, 404, 'Trip not found');
  ApiResponse.send(res, 200, 'Trip deleted successfully');
});

export const duplicateTrip = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  const trip = await Trip.findOne({ _id: req.params.id, user: userId });
  if (!trip) return ApiResponse.send(res, 404, 'Trip not found');

  const tripObj = trip.toObject();
  delete tripObj._id;
  delete tripObj.createdAt;
  delete tripObj.updatedAt;

  tripObj.destination = `${tripObj.destination} (Copy)`;
  tripObj.user = userId;

  const newTrip = new Trip(tripObj);
  await newTrip.save();
  ApiResponse.send(res, 201, 'Trip duplicated successfully', newTrip);
});

export const toggleFavorite = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  const trip = await Trip.findOne({ _id: req.params.id, user: userId });
  if (!trip) return ApiResponse.send(res, 404, 'Trip not found');

  trip.isFavorite = !trip.isFavorite;
  await trip.save();
  ApiResponse.send(res, 200, 'Favorite status toggled successfully', trip);
});

export const getPublicTrip = catchAsync(async (req, res) => {
  const trip = await Trip.findById(req.params.id).lean();
  if (!trip) return ApiResponse.send(res, 404, 'Trip not found');
  delete trip.user;
  ApiResponse.send(res, 200, 'Public trip fetched successfully', trip);
});

export const updateTrip = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  const body = { ...req.body };

  if (body.budget !== undefined) {
    const num = Number(body.budget);
    if (Number.isFinite(num) && num > 0) {
      body.budget = num;
    } else if (typeof body.budget === 'string') {
      const est = estimateTripBudget(body.country, 7, 1, body.budget);
      body.budget = est.budget;
    }
  }

  const updatedTrip = await Trip.findOneAndUpdate(
    { _id: req.params.id, user: userId },
    { $set: body },
    { new: true, runValidators: true }
  );
  if (!updatedTrip) return ApiResponse.send(res, 404, 'Trip not found');
  ApiResponse.send(res, 200, 'Trip updated successfully', updatedTrip);
});
