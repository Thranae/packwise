import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { generateToken } from './token.service.js';
import axios from 'axios';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const signupUser = async ({ name, email, password, gender, travelPreference }) => {
  const normalizedEmail = email.toLowerCase();
  
  // If user exists and is verified, reject.
  // If user exists but is NOT verified, we can overwrite or just resend the OTP.
  // We'll resend OTP and update password if needed.
  let existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    if (existingUser.isVerified) {
      throw new ApiError(409, 'Email already in use');
    }
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  if (!existingUser) {
    existingUser = await User.create({ 
      name, 
      email: normalizedEmail, 
      password, 
      gender, 
      travelPreference,
      isVerified: false 
    });
  } else {
    // Update existing unverified user with new details in case they changed them
    existingUser.name = name;
    existingUser.password = password; // mongoose hooks will re-hash
    existingUser.gender = gender;
    existingUser.travelPreference = travelPreference;
  }

  existingUser.otp = hashedOtp;
  existingUser.otpExpires = otpExpires;
  await existingUser.save();

  // Send email via nodemailer
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Server configuration error: SMTP_USER or SMTP_PASS missing');
    throw new Error('Server configuration error: Email credentials missing');
  }

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
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
        <h2 style="color: #4F7CFF;">Voyage Genie</h2>
        <p>Your verification code to create an account is:</p>
        <h1 style="font-size: 32px; letter-spacing: 4px; color: #111827; background: #f3f4f6; padding: 10px; border-radius: 8px;">${otp}</h1>
        <p style="color: #6b7280; font-size: 12px;">This code expires in 10 minutes. Do not share this code with anyone.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email send error:', err);
    throw new Error('Failed to send verification email');
  }

  return { success: true, message: 'OTP sent to email for verification' };
};

export const verifySignupOtp = async (email, otpCode) => {
  const normalizedEmail = email.toLowerCase();
  const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');

  const user = await User.findOne({ 
    email: normalizedEmail, 
    otp: hashedOtp, 
    otpExpires: { $gt: Date.now() } 
  }).select('+otp +otpExpires');

  if (!user) {
    throw new ApiError(400, 'Invalid or expired OTP');
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    throw new ApiError(404, 'Account does not exist. Please create an account.');
  }
  if (!user || !user.password || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  
  if (!user.isVerified) {
    throw new ApiError(403, 'Email not verified. Please sign up again to receive a new OTP.');
  }

  const token = generateToken(user._id);
  
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

export const googleAuthUser = async (accessToken) => {
  try {
    const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const { email, name, picture, sub: googleId } = res.data;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.profileImage = user.profileImage || picture;
        user.isVerified = true;
        await user.save();
      } else if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        profileImage: picture,
        isVerified: true
      });
    }

    const token = generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  } catch (error) {
    console.error('Google Auth Error:', error.message);
    throw new ApiError(401, 'Invalid or expired Google access token');
  }
};

export const generateOtpAndSendEmail = async (email) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });
  
  if (!user) {
    throw new ApiError(404, 'Account does not exist. Please create an account.');
  }

  // Generate 6 digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  // Set expiration to 10 minutes from now
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.otp = otp;
  user.otpExpires = otpExpires;
  await user.save();

  // Send email via nodemailer
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Server configuration error: SMTP_USER or SMTP_PASS missing');
    throw new ApiError(500, 'Server configuration error: Email credentials missing');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Voyage Genie" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Your Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center;">
        <h2 style="color: #4F7CFF;">Voyage Genie</h2>
        <p>Your one-time password to sign in is:</p>
        <h1 style="font-size: 32px; letter-spacing: 4px; color: #111827; background: #f3f4f6; padding: 10px; border-radius: 8px;">${otp}</h1>
        <p style="color: #6b7280; font-size: 12px;">This code expires in 10 minutes. Do not share this code with anyone.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Email send error:', err);
    throw new ApiError(500, 'Failed to send OTP email');
  }

  return { message: 'OTP sent successfully' };
};

export const verifyOtpAndLogin = async ({ email, otp }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+otp +otpExpires');

  if (!user) {
    throw new ApiError(404, 'Account not found');
  }

  if (!user.otp || !user.otpExpires) {
    throw new ApiError(400, 'No OTP requested for this account');
  }

  if (Date.now() > user.otpExpires.getTime()) {
    throw new ApiError(400, 'OTP has expired');
  }

  if (user.otp !== otp) {
    throw new ApiError(401, 'Invalid OTP');
  }

  // Clear OTP
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  const token = generateToken(user._id);
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.otp;
  delete userObj.otpExpires;

  return { user: userObj, token };
};
