// Test balance API
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testBalanceAPI() {
  try {
    console.log('Testing balance API...');
    const response = await fetch('http://localhost:3000/api/rewards/balance');
    const data = await response.json();
    console.log('Balance API response:', data);
  } catch (error) {
    console.error('Balance API test failed:', error.message);
  }
}

testBalanceAPI();
