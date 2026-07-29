import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

mongoose.connect('mongodb+srv://packwise:070405@cluster0.mletmwl.mongodb.net/packwise?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const password = await bcrypt.hash('password123', 12);
    const db = mongoose.connection.db;
    await db.collection('users').updateOne(
      { email: 'test@packwise.com' },
      { $set: { 
          name: 'Test User', 
          email: 'test@packwise.com', 
          password: password, 
          gender: 'prefer-not-to-say', 
          travelPreference: 'solo', 
          theme: 'dark' 
      }},
      { upsert: true }
    );
    console.log('Test user created: test@packwise.com / password123');
    process.exit(0);
  })
  .catch(console.error);
