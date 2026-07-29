import flightTrackerService from '../services/flightTracker.service.js';

export const registerFlightAlert = async (req, res) => {
  try {
    const { tripId, destination, origin, targetPrice, departDate, currency } = req.body;
    const userId = req.user?._id || req.body.userId;

    if (!destination) return res.status(400).json({ error: 'Destination is required' });

    const alert = await flightTrackerService.registerAlert(
      userId, tripId, destination, origin, targetPrice, departDate, currency
    );
    res.json({ success: true, alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserFlightAlerts = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;
    const alerts = await flightTrackerService.getUserAlerts(userId);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCurrentPrice = async (req, res) => {
  try {
    const { destination } = req.query;
    const price = await flightTrackerService._fetchPrice(destination);
    res.json({ destination, estimatedPrice: price, currency: 'USD' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
