import axios from 'axios';

async function test() {
  try {
    const signup = await axios.post('https://packwise-c35v.onrender.com/api/auth/signup', { name: 'Test', email: 'test33333@example.com', password: 'password123' });
    const token = signup.data.data.token;
    const update = await axios.put('https://packwise-c35v.onrender.com/api/users/profile', { name: 'Test', budgetPreference: 'Medium', travelStyles: ['Adventure'] }, { headers: { Authorization: 'Bearer ' + token } });
    console.log('Success:', update.data);
  } catch (err) {
    console.log('Error:', err.response?.data || err.message);
  }
}
test();
