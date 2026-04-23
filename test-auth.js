const axios = require('axios');

async function testAuth() {
  try {
    const email = 'rukeshsg0001@gmail.com';
    const password = 'password123';
    
    // Test register
    console.log('Testing Register...');
    try {
      const regRes = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Rukesh SG',
        email,
        password
      });
      console.log('Register Success:', regRes.data);
    } catch (err) {
      console.log('Register Failed (Expected if user exists):', err.response?.data || err.message);
    }

    // Test login
    console.log('\nTesting Login...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password
    });
    console.log('Login Success:', loginRes.data);

  } catch (err) {
    console.log('\nLogin Failed:', err.response?.data || err.message);
  }
}

testAuth();
