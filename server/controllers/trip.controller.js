import Trip from '../models/Trip.js';
import { catchAsync } from '../utils/catchAsync.js';
import ApiResponse from '../utils/ApiResponse.js';

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
  const updatedTrip = await Trip.findByIdAndUpdate(
    currentTrip._id, 
    { $set: { destination: currentTrip.destination + " (Modified)" } }, 
    { new: true }
  );
  ApiResponse.send(res, 200, 'Trip modified successfully', updatedTrip);
});

export const getUserTrips = catchAsync(async (req, res) => {
  const userId = req.user ? req.user.id : "65a000000000000000000000";
  const trips = await Trip.find({ user: userId }).sort({ createdAt: -1 });
  ApiResponse.send(res, 200, 'Trips fetched successfully', trips);
});
