// Save as: app/api/rewards/history/[address]/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Import the same storage as your claim route
// In production, this should be a database
const claimHistory: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    const normalizedAddress = address.toLowerCase();
    
    // Filter history for this specific address
    const userHistory = claimHistory.filter(
      claim => claim.walletAddress === normalizedAddress
    );

    return NextResponse.json(userHistory);

  } catch (error: any) {
    console.error('History fetch error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history' },
      { status: 500 }
    );
  }
}