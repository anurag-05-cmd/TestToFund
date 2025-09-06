require('dotenv').config();
const ethers = require('ethers');

async function main() {
  const RPC_URL = process.env.RPC_URL;
  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

  if (!RPC_URL || !TOKEN_ADDRESS) {
    console.error('RPC_URL and TOKEN_ADDRESS must be set in contracts/.env');
    process.exit(1);
  }

  // CLI args: node sendTokens.js <to> <amount> [--confirm]
  const argv = process.argv.slice(2);
  const to = argv[0] || process.env.TO_ADDRESS;
  const amountInput = argv[1] || process.env.AMOUNT || '0';
  const confirm = argv.includes('--confirm') || process.env.CONFIRM === '1';

  if (!to) {
    console.error('Missing recipient address. Usage: node sendTokens.js <to> <amount> [--confirm]');
    process.exit(1);
  }

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

  let wallet;
  if (PRIVATE_KEY) {
    wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  }

  const erc20ABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function decimals() view returns (uint8)',
    'function balanceOf(address owner) view returns (uint256)',
    'function transfer(address to, uint256 value) returns (bool)'
  ];

  const signerOrProvider = wallet || provider;
  const token = new ethers.Contract(TOKEN_ADDRESS, erc20ABI, signerOrProvider);

  try {
    const [name, symbol, decimals] = await Promise.all([
      token.name().catch(() => 'TTF'),
      token.symbol().catch(() => 'TTF'),
      token.decimals().catch(() => 18)
    ]);

    console.log(`Token: ${name} (${symbol})`);
    console.log(`Address: ${TOKEN_ADDRESS}`);
    console.log(`Decimals: ${decimals}`);

    // Validate recipient
    if (!ethers.utils.isAddress(to)) {
      throw new Error('Invalid recipient address');
    }

    const amount = ethers.utils.parseUnits(amountInput || '0', decimals);

    // Show balances before
    if (wallet) {
      const balanceBefore = await token.balanceOf(wallet.address);
      console.log(`Sender balance before: ${ethers.utils.formatUnits(balanceBefore, decimals)} ${symbol}`);
    } else {
      console.log('No PRIVATE_KEY provided; running in read-only / dry-run mode.');
    }

    const receiverBefore = await token.balanceOf(to);
    console.log(`Receiver balance before: ${ethers.utils.formatUnits(receiverBefore, decimals)} ${symbol}`);

    console.log(`Prepared transfer: ${ethers.utils.formatUnits(amount, decimals)} ${symbol} -> ${to}`);

    // If not confirmed, just print the encoded tx data and exit
    const iface = new ethers.utils.Interface(erc20ABI);
    const data = iface.encodeFunctionData('transfer', [to, amount]);
    console.log('Encoded tx data:', data);

    if (!confirm) {
      console.log('Dry-run (no transfer). Re-run with --confirm or set CONFIRM=1 to actually send.');
      process.exit(0);
    }

    if (!wallet) {
      console.error('Cannot send transaction: PRIVATE_KEY not set in contracts/.env');
      process.exit(1);
    }

    console.log(`Sending ${ethers.utils.formatUnits(amount, decimals)} ${symbol} to ${to}...`);
    const tx = await token.transfer(to, amount);
    const receipt = await tx.wait();
    console.log('✅ Transfer confirmed:', receipt.transactionHash);

    const balanceAfter = await token.balanceOf(wallet.address);
    console.log(`Sender balance after: ${ethers.utils.formatUnits(balanceAfter, decimals)} ${symbol}`);
    const receiverAfter = await token.balanceOf(to);
    console.log(`Receiver balance after: ${ethers.utils.formatUnits(receiverAfter, decimals)} ${symbol}`);
  } catch (err) {
    console.error('Error:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

main();
