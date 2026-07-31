import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

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

  const { name, email, password, gender, travelPreference } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
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
    const usersCollection = db.collection('users');

    let existingUser = await usersCollection.findOne({ email: normalizedEmail });
    if (existingUser && existingUser.isVerified) {
      await client.close();
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    // Generate and hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!existingUser) {
      await usersCollection.insertOne({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        gender,
        travelPreference,
        isVerified: false,
        otp: hashedOtp,
        otpExpires: otpExpires
      });
    } else {
      await usersCollection.updateOne(
        { _id: existingUser._id },
        { 
          $set: { 
            name, 
            password: hashedPassword, 
            gender, 
            travelPreference, 
            otp: hashedOtp, 
            otpExpires: otpExpires 
          } 
        }
      );
    }
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
        subject: 'Your Voyage Genie Signup OTP',
        text: `Your signup verification code is: ${otp}. It is valid for 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
            <h2 style="color: #4F7CFF;">Voyage Genie</h2>
            <p>Your verification code to create an account is:</p>
            <h1 style="font-size: 32px; letter-spacing: 4px; color: #111827; background: #f3f4f6; padding: 10px; border-radius: 8px;">${otp}</h1>
            <p style="color: #6b7280; font-size: 12px;">This code expires in 10 minutes. Do not share this code with anyone.</p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    } else {
      console.log('SMTP credentials missing, signup OTP not sent:', otp);
      return res.status(500).json({ success: false, message: 'Server configuration error: SMTP credentials missing in Vercel' });
    }

    return res.status(201).json({ success: true, message: 'OTP sent! Please check your email to verify.' });
  } catch (error) {
    console.error('Vercel API signup error:', error);
    if (client) await client.close();
    return res.status(500).json({ success: false, message: 'Internal server error while signing up' });
  }
}
