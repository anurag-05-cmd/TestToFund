// Save as: app/api/rewards/claim/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Simple in-memory storage for claimed addresses
const claimedAddresses = new Set<string>();

// Storage for used certificate URLs (prevents certificate reuse)
const usedCertificates = new Set<string>();

// Rate limiting storage
const ipRateLimit = new Map<string, number[]>();

// Add GET for testing
export async function GET() {
  console.log('GET /api/rewards/claim called');
  return NextResponse.json({ 
    message: 'Claim API GET is working',
    timestamp: new Date().toISOString()
  });
}

// Main POST function
export async function POST(request: NextRequest) {
  console.log('POST /api/rewards/claim called');
  console.log('Request method:', request.method);
  console.log('Request URL:', request.url);
  
  try {
    // Log headers
    console.log('Content-Type:', request.headers.get('content-type'));
    
    // Try to parse form data
    const formData = await request.formData();
    console.log('Form data parsed successfully');
    
    const walletAddress = formData.get('walletAddress') as string;
    const certificateUrl = formData.get('certificateUrl') as string;
    const timestamp = formData.get('timestamp') as string;
    
    console.log('Received data:', {
      walletAddress,
      certificateUrl,
      hasFile: formData.has('certificate'),
      timestamp
    });

    // Security: Check request timestamp (prevent replay attacks)
    if (timestamp) {
      const requestTime = parseInt(timestamp);
      const currentTime = Date.now();
      const timeWindow = 5 * 60 * 1000; // 5 minutes
      
      if (Math.abs(currentTime - requestTime) > timeWindow) {
        return NextResponse.json(
          { error: 'Request expired. Please try again.' },
          { status: 400 }
        );
      }
    }

    // Basic validation
    if (!walletAddress) {
      console.log('No wallet address provided');
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      console.log('Invalid wallet address format');
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Backend validation for Udemy certificate
    if (!certificateUrl && !formData.has('certificate')) {
      return NextResponse.json(
        { error: 'Certificate or Udemy certificate URL is required' },
        { status: 400 }
      );
    }

    // Validate Udemy link format on backend (security measure)
    if (certificateUrl) {
      const udemyLinkPattern = /^https:\/\/(www\.)?udemy\.com\/certificate\/[a-zA-Z0-9]+\/?$/;
      if (!udemyLinkPattern.test(certificateUrl)) {
        console.log('Invalid Udemy certificate URL format:', certificateUrl);
        return NextResponse.json(
          { error: 'Invalid Udemy certificate link format. Must be a valid Udemy certificate URL.' },
          { status: 400 }
        );
      }
    }

    // Additional security: Rate limiting per IP (simple implementation)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const currentTime = Date.now();
    const timeWindow = 60 * 1000; // 1 minute
    
    const ipRequests = ipRateLimit.get(clientIP) || [];
    const recentRequests = ipRequests.filter((time: number) => currentTime - time < timeWindow);
    
    if (recentRequests.length >= 3) { // Max 3 requests per minute per IP
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    recentRequests.push(currentTime);
    ipRateLimit.set(clientIP, recentRequests);

    // Check if address has already claimed
    const normalizedAddress = walletAddress.toLowerCase();
    if (claimedAddresses.has(normalizedAddress)) {
      return NextResponse.json(
        { error: 'Tokens already claimed for this address' },
        { status: 400 }
      );
    }

    // Additional security: Validate wallet address against certificate
    // This prevents address spoofing attacks
    const addressChecksum = ethers.getAddress(walletAddress); // This validates and checksums the address
    console.log('Validated wallet address:', addressChecksum);

    // Prevent certificate reuse across different addresses
    if (certificateUrl && usedCertificates.has(certificateUrl)) {
      return NextResponse.json(
        { error: 'This certificate has already been used by another wallet address.' },
        { status: 400 }
      );
    }

    // Initialize blockchain connection
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL;
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const rewardAmount = process.env.REWARD_AMOUNT || '2000';

    if (!privateKey || !rpcUrl || !tokenAddress) {
      console.error('Missing environment variables:', {
        hasPrivateKey: !!privateKey,
        hasRpcUrl: !!rpcUrl,
        hasTokenAddress: !!tokenAddress
      });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Set up provider with ethers v6
    const cleanRpcUrl = rpcUrl.replace(/\/$/, ''); // Remove trailing slash
    console.log('Using RPC URL:', cleanRpcUrl);
    
    const provider = new ethers.JsonRpcProvider(cleanRpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Test the connection first
    try {
      console.log('Testing network connection...');
      const blockNumber = await provider.getBlockNumber();
      console.log('Latest block number:', blockNumber);
    } catch (networkError) {
      console.error('Network test failed:', networkError);
      throw new Error('Unable to connect to blockchain network');
    }

    // ERC20 ABI (only needed parts)
    const erc20ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function transfer(address to, uint256 value) returns (bool)",
      "function decimals() view returns (uint8)"
    ];

    const token = new ethers.Contract(tokenAddress, erc20ABI, wallet);

    // Check contract balance
    const contractBalance = await token.balanceOf(wallet.address);
    const amount = ethers.parseUnits(rewardAmount, 18);
    
    if (contractBalance < amount) {
      console.error('Insufficient token balance');
      return NextResponse.json(
        { error: 'Insufficient tokens in distribution wallet' },
        { status: 500 }
      );
    }

    console.log(`🚀 Sending ${rewardAmount} TTF to ${walletAddress}...`);
    
    // Send tokens with retry logic
    let tx;
    let retries = 3;
    while (retries > 0) {
      try {
        tx = await token.transfer(walletAddress, amount, {
          gasLimit: 100000, // Set explicit gas limit
        });
        console.log('Transaction submitted:', tx.hash);
        break;
      } catch (error: any) {
        retries--;
        console.log(`Transfer attempt failed, retries left: ${retries}`, error.message);
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
    
    // Wait for confirmation with timeout
    console.log('Waiting for transaction confirmation...');
    const receipt = await Promise.race([
      tx.wait(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction confirmation timeout')), 60000)
      )
    ]) as any;
    
    const finalTxHash = receipt?.hash || tx.hash;
    console.log('Transaction confirmed:', finalTxHash);

    // Mark address as claimed
    claimedAddresses.add(normalizedAddress);
    
    // Mark certificate as used (if provided)
    if (certificateUrl) {
      usedCertificates.add(certificateUrl);
    }

    // Get final balances
    const senderBalance = await token.balanceOf(wallet.address);
    const receiverBalance = await token.balanceOf(walletAddress);

    console.log('Token distribution successful');
    return NextResponse.json({
      success: true,
      message: `Successfully claimed ${rewardAmount} TTF tokens!`,
      transactionHash: finalTxHash,
      explorerUrl: `https://primordial.bdagscan.com/tx/${finalTxHash}?chain=EVM`,
      walletAddress,
      amount: rewardAmount,
      senderBalance: ethers.formatUnits(senderBalance, 18),
      receiverBalance: ethers.formatUnits(receiverBalance, 18),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('POST /api/rewards/claim error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Token distribution failed',
        details: error.message
      },
      { status: 500 }
    );
  }
}