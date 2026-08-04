import axios from 'axios';

async function test() {
  try {
    const login = await axios.post('https://packwise-c35v.onrender.com/api/auth/login', { email: 'test1785856097313@example.com', password: 'password123' });
    const token = login.data.data.token;
    
    const update = await axios.put('https://packwise-c35v.onrender.com/api/users/profile', {
        name: 'Test',
        displayName: '',
        email: 'test1785856097313@example.com',
        homeAirport: '',
        dietaryRestrictions: [],
        travelStyles: [],
        budgetPreference: 'Medium',
        currency: 'USD'
    }, { headers: { Authorization: 'Bearer ' + token } });
    console.log('Update success:', update.data);
  } catch (err) {
    console.log('Put error:', err.response?.data || err.message);
  }
}
test();
