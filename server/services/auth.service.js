import User from '../models/User.js';
import ApiError from '../utils/ApiError.js';
import { generateToken } from './token.service.js';

export const signupUser = async ({ name, email, password, gender, travelPreference }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already in use');
  }

  const user = await User.create({ name, email, password, gender, travelPreference });
  const token = generateToken(user._id);

  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);
  
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};
