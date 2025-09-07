// Test RPC connection
const { ethers } = require('ethers');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Testing RPC connection...');
    console.log('RPC URL:', process.env.RPC_URL);
    console.log('Token Address:', process.env.TOKEN_ADDRESS);
    
    if (!process.env.RPC_URL) {
      throw new Error('RPC_URL not found in environment variables');
    }
    
    // Create provider with ethers v6
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL.replace(/\/$/, ''));
    
    // Test basic connection
    console.log('Getting network info...');
    const network = await provider.getNetwork();
    console.log('Network:', network);
    
    // Test block number
    console.log('Getting latest block...');
    const blockNumber = await provider.getBlockNumber();
    console.log('Latest block:', blockNumber);
    
    // Test wallet creation
    console.log('Testing wallet...');
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    console.log('Wallet address:', wallet.address);
    
    // Test balance
    console.log('Getting wallet balance...');
    const balance = await provider.getBalance(wallet.address);
    console.log('Wallet balance:', ethers.formatEther(balance), 'ETH');
    
    console.log('✅ All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
