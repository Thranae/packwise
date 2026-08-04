import mongoose from 'mongoose';
import User from '../server/models/User.js';

const MONGO_URI = "mongodb+srv://packwise:070405@cluster0.mletmwl.mongodb.net/packwise?retryWrites=true&w=majority&appName=Cluster0";

async function test() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Find the test user
    const user = await User.findOne({ email: 'test1785856097313@example.com' });
    if (user) {
        user.isVerified = true;
        await user.save();
        console.log('User verified');
    } else {
        console.log('User not found');
    }
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}
test();
