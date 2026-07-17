import twilio from 'twilio';
import schedule from 'node-schedule';

const scheduledJobs = new Map();

export const sendReminder = async (req, res) => {
  const { phoneNumber, departureTime, customScheduledTime } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }
  
  if (!departureTime && !customScheduledTime) {
    return res.status(400).json({ success: false, message: 'Departure time or custom scheduled time is required' });
  }

  let scheduledTime;
  if (customScheduledTime) {
    scheduledTime = new Date(customScheduledTime);
  } else {
    const departureDate = new Date(departureTime);
    scheduledTime = new Date(departureDate.getTime() - (4 * 60 * 60 * 1000));
  }
  
  const now = new Date();

  // Cancel any existing job for this number
  if (scheduledJobs.has(phoneNumber)) {
    scheduledJobs.get(phoneNumber).cancel();
    scheduledJobs.delete(phoneNumber);
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !twilioNumber) {
    console.warn("Twilio credentials missing in .env. Mocking SMS schedule.");
    
    // Mock the scheduling logic in memory as well
    if (scheduledTime > now) {
      const mockJob = schedule.scheduleJob(scheduledTime, () => {
         console.log(`Mock SMS executed for ${phoneNumber}`);
         scheduledJobs.delete(phoneNumber);
      });
      scheduledJobs.set(phoneNumber, mockJob);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: `Mock SMS scheduled for ${scheduledTime.toLocaleString()}`,
      scheduledTime,
      mock: true
    });
  }

  try {
    const client = twilio(accountSid, authToken);
    const messageBody = "Voyage Genie AI: Don't forget to lock the doors and unplug appliances before your trip! Safe travels! ✈️";
    
    // If scheduled time is in the past, send immediately
    if (scheduledTime <= now) {
      const message = await client.messages.create({
        body: messageBody,
        from: twilioNumber,
        to: phoneNumber
      });
      console.log(`SMS sent immediately to ${phoneNumber}. SID: ${message.sid}`);
      return res.status(200).json({ 
        success: true, 
        message: 'SMS reminder sent immediately (scheduled time is close)!',
        sid: message.sid
      });
    }

    // Otherwise, schedule it
    const job = schedule.scheduleJob(scheduledTime, async () => {
      try {
        const message = await client.messages.create({
          body: messageBody,
          from: twilioNumber,
          to: phoneNumber
        });
        console.log(`Scheduled SMS sent to ${phoneNumber}. SID: ${message.sid}`);
      } catch (err) {
        console.error("Failed to send scheduled SMS:", err);
      } finally {
        scheduledJobs.delete(phoneNumber); // Cleanup after execution
      }
    });

    scheduledJobs.set(phoneNumber, job);

    console.log(`SMS scheduled for ${scheduledTime.toLocaleString()} to ${phoneNumber}.`);
    
    return res.status(200).json({ 
      success: true, 
      message: `SMS reminder scheduled successfully for ${scheduledTime.toLocaleString()}`,
      scheduledTime
    });
  } catch (error) {
    console.error("Twilio Error:", error.message);
    
    // Fallback to mock in-memory scheduling if Twilio fails (common with Trial accounts/unverified numbers)
    console.warn("Falling back to mock SMS scheduling due to Twilio error.");
    
    if (scheduledTime > now) {
      const mockJob = schedule.scheduleJob(scheduledTime, () => {
         console.log(`Mock SMS executed for ${phoneNumber} at ${new Date().toLocaleString()}`);
         scheduledJobs.delete(phoneNumber);
      });
      scheduledJobs.set(phoneNumber, mockJob);
      
      return res.status(200).json({ 
        success: true, 
        message: `Simulated SMS scheduled successfully for ${scheduledTime.toLocaleString()}`,
        scheduledTime,
        mock: true
      });
    } else {
      return res.status(200).json({ 
        success: true, 
        message: 'Simulated SMS sent immediately!',
        mock: true
      });
    }
  }
};

export const cancelReminder = (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  if (scheduledJobs.has(phoneNumber)) {
    scheduledJobs.get(phoneNumber).cancel();
    scheduledJobs.delete(phoneNumber);
    console.log(`Cancelled scheduled SMS for ${phoneNumber}`);
    return res.status(200).json({ success: true, message: 'SMS reminder cancelled successfully' });
  }

  // Even if not found in memory (e.g. server restarted or it was sent), just return success to clear UI state
  return res.status(200).json({ success: true, message: 'No active reminder found, UI cleared' });
};
