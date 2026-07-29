import mongoose from 'mongoose';

const FlightAlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  destination: { type: String, required: true },
  origin: { type: String, default: 'ANY' },
  targetPrice: { type: Number }, // alert if price drops below this
  lastCheckedPrice: { type: Number },
  currency: { type: String, default: 'USD' },
  departDate: { type: Date },
  isActive: { type: Boolean, default: true },
  alertsSent: { type: Number, default: 0 },
  lastAlertAt: { type: Date },
  priceHistory: [{
    price: Number,
    checkedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('FlightAlert', FlightAlertSchema);
