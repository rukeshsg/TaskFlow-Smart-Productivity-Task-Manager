async function testAuth() {
  const email = 'rukeshsg0001@gmail.com';
  const password = 'password123';
  
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    console.log('Login Response:', res.status, data);
  } catch (err) {
    console.log('Login Error:', err);
  }
}

testAuth();
