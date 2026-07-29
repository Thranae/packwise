import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { generateToken } from './token.service.js';
import axios from 'axios';

export const signupUser = async ({ name, email, password, gender, travelPreference }) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw new ApiError(409, 'Email already in use');
  }

  const user = await User.create({ name, email: normalizedEmail, password, gender, travelPreference });
  const token = generateToken(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user || !user.password || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
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
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        profileImage: picture,
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
