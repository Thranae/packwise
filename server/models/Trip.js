import mongoose from 'mongoose';

const TripSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  destination: { type: String, required: true },
  country: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  travelers: { type: Number, default: 1 },
  budget: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
  travelStyle: { type: String },
  interests: [{ type: String }],
  status: {
    type: String,
    enum: ['draft', 'planning', 'upcoming', 'ongoing', 'completed', 'archived'],
    default: 'planning'
  },
  
  // Retain UI fields for the travel planner features
  heroImage: String,
  itinerary: [{
    day: Number,
    title: String,
    activities: [{
      time: String,
      place: String,
      description: String,
      image: String
    }]
  }],
  packingList: [{
    category: String,
    items: [{ 
      name: String, 
      isPacked: { type: Boolean, default: false } 
    }]
  }],
  recommendations: [{
    category: String,
    places: [String]
  }],
  tips: [String],

  // Extra context from previous schema for UI
  weather: {
    current: { temp: Number, condition: String },
    forecast: [{
      day: String,
      temp: Number,
      min: Number,
      condition: String
    }]
  },
  budgetDetails: {
    total: Number,
    categories: [{
      name: String,
      amount: Number,
      percent: Number,
      color: String,
      stroke: String
    }]
  }
}, { timestamps: true });

const Trip = mongoose.model('Trip', TripSchema);

export default Trip;
