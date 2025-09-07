// Save as: frontend/app/api/rewards/claim/route.ts

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
    console.log('Content-Type:', request.headers.get('content-type'));
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
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Certificate validation
    if (!certificateUrl && !formData.has('certificate')) {
      return NextResponse.json(
        { error: 'Certificate or Udemy certificate URL is required' },
        { status: 400 }
      );
    }

    // Unified Udemy certificate regex (supports with/without slash at end)
    if (certificateUrl) {
      const udemyLinkPattern =
        /^https?:\/\/(?:(?:www\.)?udemy\.com\/certificate\/UC-[A-Za-z0-9\-]+|ude\.my\/UC-[A-Za-z0-9\-]+)\/?$/;
      
      if (!udemyLinkPattern.test(certificateUrl)) {
        return NextResponse.json(
          { error: 'Invalid Udemy certificate link format. Must be a valid Udemy certificate URL.' },
          { status: 400 }
        );
      }
    }

    // Rate limiting per IP
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const currentTime = Date.now();
    const timeWindow = 60 * 1000;
    const ipRequests = ipRateLimit.get(clientIP) || [];
    const recentRequests = ipRequests.filter((time: number) => currentTime - time < timeWindow);
    
    if (recentRequests.length >= 3) {
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

    // Validate and checksum wallet address
    const addressChecksum = ethers.getAddress(walletAddress);
    console.log('Validated wallet address:', addressChecksum);

    // Prevent certificate reuse
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
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const cleanRpcUrl = rpcUrl.replace(/\/$/, '');
    console.log('Using RPC URL:', cleanRpcUrl);
    
    const provider = new ethers.JsonRpcProvider(cleanRpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    try {
      const blockNumber = await provider.getBlockNumber();
      console.log('Latest block number:', blockNumber);
    } catch (networkError) {
      throw new Error('Unable to connect to blockchain network');
    }

    const erc20ABI = [
      "function balanceOf(address owner) view returns (uint256)",
      "function transfer(address to, uint256 value) returns (bool)",
      "function decimals() view returns (uint8)"
    ];

    const token = new ethers.Contract(tokenAddress, erc20ABI, wallet);

    const contractBalance = await token.balanceOf(wallet.address);
    const amount = ethers.parseUnits(rewardAmount, 18);
    
    if (contractBalance < amount) {
      return NextResponse.json(
        { error: 'Insufficient tokens in distribution wallet' },
        { status: 500 }
      );
    }

    console.log(`🚀 Sending ${rewardAmount} TTF to ${walletAddress}...`);
    let tx;
    let retries = 3;
    while (retries > 0) {
      try {
        tx = await token.transfer(walletAddress, amount, { gasLimit: 100000 });
        console.log('Transaction submitted:', tx.hash);
        break;
      } catch (error: any) {
        retries--;
        console.log(`Transfer attempt failed, retries left: ${retries}`, error.message);
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('Waiting for transaction confirmation...');
    let receipt;
    let finalTxHash = tx.hash;
    
    try {
      receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction confirmation timeout')), 120000)
        )
      ]) as any;
      
      finalTxHash = receipt?.hash || tx.hash;
      console.log('Transaction confirmed:', finalTxHash);
    } catch (confirmationError: any) {
      console.warn('Transaction confirmation timeout:', confirmationError.message);
    }

    claimedAddresses.add(normalizedAddress);
    if (certificateUrl) {
      usedCertificates.add(certificateUrl);
    }

    let senderBalance, receiverBalance;
    let balanceRetries = 3;
    while (balanceRetries > 0) {
      try {
        [senderBalance, receiverBalance] = await Promise.all([
          token.balanceOf(wallet.address),
          token.balanceOf(walletAddress)
        ]);
        break;
      } catch (balanceError: any) {
        balanceRetries--;
        if (balanceRetries === 0) {
          senderBalance = BigInt(0);
          receiverBalance = amount;
        } else {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully claimed ${rewardAmount} TTF tokens!`,
      transactionHash: finalTxHash,
      explorerUrl: `https://primordial.bdagscan.com/tx/${finalTxHash}?chain=EVM`,
      walletAddress,
      amount: rewardAmount,
      senderBalance: senderBalance ? ethers.formatUnits(senderBalance, 18) : '0',
      receiverBalance: receiverBalance ? ethers.formatUnits(receiverBalance, 18) : rewardAmount,
      timestamp: new Date().toISOString(),
      note: receipt ? 'Transaction confirmed' : 'Transaction submitted successfully'
    });

  } catch (error: any) {
    console.error('POST /api/rewards/claim error:', error);

    if (error.message?.includes('Transaction confirmation timeout')) {
      return NextResponse.json(
        { 
          error: 'Transaction submitted but confirmation timed out. Please check the explorer to verify.',
          details: error.message,
          note: 'Your tokens may have been transferred successfully.'
        },
        { status: 202 }
      );
    }
    
    if (error.message?.includes('network') || error.message?.includes('connection')) {
      return NextResponse.json(
        { error: 'Network connection issue. Please try again later.', details: error.message },
        { status: 503 }
      );
    }
    
    if (error.message?.includes('insufficient funds') || error.message?.includes('balance')) {
      return NextResponse.json(
        { error: 'Insufficient tokens in distribution wallet.', details: error.message },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Token distribution failed', details: error.message },
      { status: 500 }
    );
  }
}
