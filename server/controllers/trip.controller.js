import Trip from '../models/Trip.js';
import { catchAsync } from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';
import * as geminiService from '../services/geminiService.js';

export const generateTrip = catchAsync(async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  
  // Mock generated data for now
  const tripData = {
    destination: "Generated: " + (prompt || "Unknown"),
    country: "AI Country",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    budget: 0,
    currency: "USD",
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
  
  // Call AI to generate the modified trip
  const updatedTripData = await geminiService.chatWithTrip(currentTrip, message);
  
  // Ensure we don't accidentally overwrite the ID
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
  ApiResponse.send(res, 200, 'Trips fetched successfully', trips);
});

export const createTrip = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  const newTrip = new Trip({
    ...req.body,
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
  // Find the trip by ID regardless of who owns it, so public links can be duplicated
  const tripToDuplicate = await Trip.findById(req.params.id).lean();
  
  if (!tripToDuplicate) return ApiResponse.send(res, 404, 'Trip not found');
  
  delete tripToDuplicate._id;
  delete tripToDuplicate.createdAt;
  delete tripToDuplicate.updatedAt;
  delete tripToDuplicate.__v;
  
  tripToDuplicate.destination = `${tripToDuplicate.destination} (Copy)`;
  tripToDuplicate.user = userId; // Assign new ownership
  
  const newTrip = new Trip(tripToDuplicate);
  await newTrip.save();
  ApiResponse.send(res, 201, 'Trip duplicated successfully', newTrip);
});

export const toggleFavorite = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  const trip = await Trip.findOne({ _id: req.params.id, user: userId });
  if (!trip) return ApiResponse.send(res, 404, 'Trip not found');
  
  trip.isFavorite = !trip.isFavorite;
  await trip.save();
  ApiResponse.send(res, 200, 'Trip favorite toggled', trip);
});

export const getPublicTrip = catchAsync(async (req, res) => {
  // Find trip by ID, lean() for performance
  const trip = await Trip.findById(req.params.id).lean();
  
  if (!trip) return ApiResponse.send(res, 404, 'Trip not found');
  
  // Strip out the user ID to ensure privacy, but return all public trip data
  delete trip.user;
  
  ApiResponse.send(res, 200, 'Public trip fetched successfully', trip);
});
