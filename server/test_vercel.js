const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('https://packwise-livid.vercel.app/api/forgot-password', {
      email: 'support.packwise@gmail.com'
    });
    console.log('STATUS:', res.status);
    console.log('DATA:', res.data);
  } catch (err) {
    console.error('ERROR STATUS:', err.response?.status);
    console.error('ERROR DATA:', err.response?.data);
    console.error('ERROR MESSAGE:', err.message);
  }
}

test();
