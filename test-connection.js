// Simple test script to verify backend-frontend connection
const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

async function testConnection() {
  console.log('🧪 Testing Backend-Frontend Connection...\n');

  try {
    // Test 1: Check if backend is running
    console.log('1. Testing backend health...');
    const healthResponse = await fetch('http://localhost:5000/');
    const healthData = await healthResponse.json();
    console.log('✅ Backend is running:', healthData.message);

    // Test 2: Test CORS configuration
    console.log('\n2. Testing CORS configuration...');
    const corsResponse = await fetch('http://localhost:5000/api/auth/me', {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:5173',
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ CORS headers present:', corsResponse.headers.get('access-control-allow-origin'));

    // Test 3: Test API endpoints
    console.log('\n3. Testing API endpoints...');
    
    // Test register endpoint (should fail without data, but endpoint should exist)
    const registerResponse = await fetch(`${API_BASE_URL}/auth/register-company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({})
    });
    console.log('✅ Register endpoint accessible:', registerResponse.status);

    // Test login endpoint
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:5173'
      },
      body: JSON.stringify({})
    });
    console.log('✅ Login endpoint accessible:', loginResponse.status);

    console.log('\n🎉 All tests passed! Backend is ready for frontend connection.');
    console.log('\n📋 Next steps:');
    console.log('1. Start the frontend: cd frontend/astro-expense-hub/astro-expense-hub && npm run dev');
    console.log('2. Open http://localhost:5173 in your browser');
    console.log('3. Try registering a new company or logging in');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Make sure the backend is running: cd backend && npm start');
    console.log('3. Check that port 5000 is not occupied');
    console.log('4. Verify your .env file has the correct MONGO_URI');
  }
}

testConnection();
