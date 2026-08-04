const axios = require('axios');

async function test() {
  try {
    const login = await axios.post('https://packwise-c35v.onrender.com/api/auth/login', {
      email: 'test@test.com',
      password: 'password123'
    });
    
    // If we can't login, we can't test. I don't know any user passwords.
    // Let me just inspect the endpoint by sending a bad token.
    console.log(login.data);
  } catch (err) {
    console.log('Login error:', err.response?.data || err.message);
  }
}
test();
