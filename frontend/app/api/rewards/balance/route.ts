// API route to check distribution wallet balance
import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function GET() {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL;
    const tokenAddress = process.env.TOKEN_ADDRESS;

    if (!privateKey || !rpcUrl || !tokenAddress) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Set up provider with ethers v6
    const cleanRpcUrl = rpcUrl.replace(/\/$/, ''); // Remove trailing slash
    const provider = new ethers.JsonRpcProvider(cleanRpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Test the connection
    try {
      await provider.getNetwork();
      console.log('Network connection established for balance check');
    } catch (networkError) {
      console.error('Network connection failed:', networkError);
      throw new Error('Unable to connect to blockchain network');
    }

    // ERC20 ABI
    const erc20ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function decimals() view returns (uint8)"
    ];

    const token = new ethers.Contract(tokenAddress, erc20ABI, wallet);

    // Get token info and balance
    const [balance, name, symbol, decimals] = await Promise.all([
      token.balanceOf(wallet.address),
      token.name(),
      token.symbol(),
      token.decimals()
    ]);

    const formattedBalance = ethers.formatUnits(balance, decimals);
    const rewardAmount = process.env.REWARD_AMOUNT || '2000';
    const remainingClaims = Math.floor(parseFloat(formattedBalance) / parseFloat(rewardAmount));

    return NextResponse.json({
      walletAddress: wallet.address,
      tokenName: name,
      tokenSymbol: symbol,
      balance: formattedBalance,
      rewardAmount,
      remainingClaims,
      tokenContract: tokenAddress,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Balance check error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check balance',
        details: error.message
      },
      { status: 500 }
    );
  }
}
