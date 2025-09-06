const path = require('path');
const { ethers } = require('ethers');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function main() {
  const RPC_URL = process.env.RPC_URL;
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
  if (!RPC_URL || !TOKEN_ADDRESS) {
    console.error('RPC_URL and TOKEN_ADDRESS must be set in contracts/.env');
    process.exit(1);
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const ERC20 = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address) view returns (uint256)'
  ];

  const contract = new ethers.Contract(TOKEN_ADDRESS, ERC20, provider);

  try {
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ]);

    console.log(`Token: ${name} (${symbol})`);
    console.log(`Address: ${TOKEN_ADDRESS}`);
    console.log(`Decimals: ${decimals}`);

    // addresses to check: from env or default to first arg or none
    const addresses = [];
    if (process.env.CHECK_ADDRESS) addresses.push(process.env.CHECK_ADDRESS);
    if (process.argv[2]) addresses.push(process.argv[2]);

    if (addresses.length === 0) {
      console.log('No addresses provided to check balances. Pass an address as the first arg or set CHECK_ADDRESS in contracts/.env');
      process.exit(0);
    }

    for (const a of addresses) {
      try {
        const bal = await contract.balanceOf(a);
        const fmt = ethers.utils.formatUnits(bal, decimals);
        console.log(`${a} balance: ${fmt} ${symbol}`);
      } catch (err) {
        console.error(`Failed to read balance for ${a}:`, err.message || err);
      }
    }
  } catch (err) {
    console.error('Error querying token contract:', err.message || err);
    process.exit(1);
  }
}

main();
