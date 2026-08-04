import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name must be at most 50 characters'],
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: [30, 'Display Name must be at most 30 characters'],
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
      required: function() {
        return !this.googleId;
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other', 'prefer-not-to-say'],
        message: '{VALUE} is not a valid gender option',
      },
      default: 'prefer-not-to-say',
    },
    travelPreference: {
      type: String,
      enum: {
        values: ['solo', 'couple', 'family', 'group', 'business'],
        message: '{VALUE} is not a valid travel preference',
      },
      default: 'solo',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    hasReceivedWelcomeEmail: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      enum: {
        values: ['light', 'dark'],
        message: '{VALUE} is not a valid theme',
      },
      default: 'dark',
    },
    dietaryRestrictions: {
      type: [String],
      default: [],
    },
    travelPreferences: {
      budget: {
        type: String,
        enum: ['Budget', 'Medium', 'Luxury'],
        default: 'Medium',
      },
      males: {
        type: Number,
        default: 1,
      },
      females: {
        type: Number,
        default: 1,
      },
      styles: {
        type: [String],
        default: [],
      },
    },
    profileImage: {
      type: String,
      default: '',
    },
    homeAirport: {
      type: String,
      trim: true,
      maxlength: [10, 'Home Airport must be at most 10 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare candidate password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
