import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';
import crypto from 'crypto';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  const normalizedEmail = email.toLowerCase();
  
  if (!process.env.MONGO_URI) {
    return res.status(500).json({ success: false, message: 'Server configuration error (missing database)' });
  }

  let client;
  try {
    client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const db = client.db(); 

    const user = await db.collection('users').findOne({ email: normalizedEmail });
    if (!user) {
      await client.close();
      return res.status(404).json({ success: false, message: 'Account does not exist. Please create an account.' });
    }

    // Generate 6 digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to user document
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { otp: otp, otpExpires: otpExpires } }
    );
    await client.close();

    // Send email
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"Voyage Genie" <${process.env.SMTP_USER}>`,
        to: normalizedEmail,
        subject: 'Your Password Reset OTP',
        text: `Your OTP for signing into Voyage Genie is: ${otp}. It will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
            <h2 style="color: #4F7CFF;">Voyage Genie</h2>
            <p>Your one-time password to sign in is:</p>
            <h1 style="font-size: 32px; letter-spacing: 4px; color: #111827; background: #f3f4f6; padding: 10px; border-radius: 8px;">${otp}</h1>
            <p style="color: #6b7280; font-size: 12px;">This code expires in 10 minutes. Do not share this code with anyone.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.log('SMTP credentials missing, OTP not sent:', otp);
      return res.status(500).json({ success: false, message: 'Server configuration error: SMTP credentials missing in Vercel' });
    }

    return res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Vercel API forgot-password error:', error);
    if (client) await client.close();
    return res.status(500).json({ success: false, message: 'Internal server error while sending OTP' });
  }
}
