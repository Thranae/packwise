import axios from 'axios';

async function test() {
  try {
    const email = 'test' + Date.now() + '@example.com';
    const signup = await axios.post('https://packwise-c35v.onrender.com/api/auth/signup', { name: 'TestUser', email, password: 'password123' });
    
    // We need to fetch OTP or just login? Wait, signup returns OTP? 
    console.log('Signup result:', signup.data);
    
    // Let's just send a request with NO token to see if it's a 401
    try {
        const update = await axios.put('https://packwise-c35v.onrender.com/api/users/profile', {
            name: 'Test',
            displayName: '',
            email: email,
            homeAirport: '',
            dietaryRestrictions: [],
            travelStyles: [],
            budgetPreference: 'Medium',
            currency: 'USD'
        });
    } catch(e) {
        console.log('Put error:', e.response?.data);
    }
  } catch (err) {
    console.log('Error:', err.response?.data || err.message);
  }
}
test();
