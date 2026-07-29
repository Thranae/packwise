import twilio from 'twilio';
import Trip from '../models/Trip.js';
import User from '../models/User.js';

/**
 * Notifications Service
 * Handles SMS notifications via Twilio and builds smart trip reminders.
 */
class NotificationsService {
  constructor() {
    try {
      this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      this.from = process.env.TWILIO_PHONE_NUMBER;
      this.enabled = !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN);
    } catch (_) {
      this.enabled = false;
    }
  }

  /**
   * Send a raw SMS message
   */
  async sendSMS(to, message) {
    if (!this.enabled) {
      console.log(`[SMS Mock] To: ${to} | Message: ${message}`);
      return { mock: true, to, message };
    }

    try {
      const msg = await this.client.messages.create({
        body: message,
        from: this.from,
        to,
      });
      console.log(`[SMS] Sent to ${to}: ${msg.sid}`);
      return msg;
    } catch (err) {
      console.error(`[SMS Error] Failed to send to ${to}:`, err.message);
      throw err;
    }
  }

  /**
   * Run all automated trip reminder checks.
   * Called by node-cron every hour.
   */
  async runTripReminders() {
    console.log('[Notifications] Running trip reminder checks...');
    try {
      const now = new Date();
      const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const in1Day  = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

      // Find trips starting in ~7 days (within a 2-hour window)
      const tripsIn7Days = await Trip.find({
        startDate: { $gte: in7Days, $lte: new Date(in7Days.getTime() + 2 * 60 * 60 * 1000) },
        status: { $in: ['upcoming', 'planning'] }
      }).populate('user', 'name phone');

      for (const trip of tripsIn7Days) {
        if (!trip.user?.phone) continue;
        const packingPct = this._getPackingPercentage(trip);
        const msg = `🌍 Voyage Genie: Your trip to ${trip.destination} starts in 7 days! Your packing is ${packingPct}% complete. Open the app to finish up!`;
        await this.sendSMS(trip.user.phone, msg).catch(console.error);
      }

      // Find trips starting in ~1 day
      const tripsIn1Day = await Trip.find({
        startDate: { $gte: in1Day, $lte: new Date(in1Day.getTime() + 2 * 60 * 60 * 1000) },
        status: { $in: ['upcoming', 'planning'] }
      }).populate('user', 'name phone');

      for (const trip of tripsIn1Day) {
        if (!trip.user?.phone) continue;
        const msg = `✈️ Voyage Genie: Heads up! Your trip to ${trip.destination} is TOMORROW. Don't forget your passport and travel documents. Safe travels!`;
        await this.sendSMS(trip.user.phone, msg).catch(console.error);
      }

      console.log(`[Notifications] Checked ${tripsIn7Days.length + tripsIn1Day.length} trips for reminders.`);
    } catch (err) {
      console.error('[Notifications] Error running reminders:', err.message);
    }
  }

  /**
   * Send a custom notification to a specific trip's user
   */
  async notifyTripUser(tripId, message) {
    const trip = await Trip.findById(tripId).populate('user', 'phone name');
    if (!trip?.user?.phone) throw new Error('User phone number not found for this trip');
    return this.sendSMS(trip.user.phone, message);
  }

  /**
   * Send a budget alert when spending exceeds threshold
   */
  async sendBudgetAlert(trip, spentAmount) {
    const user = await User.findById(trip.user).select('phone');
    if (!user?.phone) return;

    const pct = Math.round((spentAmount / trip.budget) * 100);
    const msg = `💰 Voyage Genie Budget Alert: You've used ${pct}% of your ${trip.destination} trip budget ($${spentAmount} of $${trip.budget}). Open the app for AI re-allocation suggestions!`;
    return this.sendSMS(user.phone, msg);
  }

  _getPackingPercentage(trip) {
    if (!trip.packingList?.length) return 0;
    let total = 0, packed = 0;
    for (const cat of trip.packingList) {
      for (const item of cat.items || []) {
        total++;
        if (item.isPacked) packed++;
      }
    }
    return total > 0 ? Math.round((packed / total) * 100) : 0;
  }
}

export default new NotificationsService();
