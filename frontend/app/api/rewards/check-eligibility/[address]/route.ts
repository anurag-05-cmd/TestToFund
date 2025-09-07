// Save as: app/api/rewards/check-eligibility/[address]/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Import the same storage as your claim route
// In production, this should be a database
const claimedAddresses = new Set<string>();

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
    const alreadyClaimed = claimedAddresses.has(normalizedAddress);

    return NextResponse.json({
      canClaim: !alreadyClaimed,
      alreadyClaimed,
      reason: alreadyClaimed ? 'Already claimed rewards' : undefined
    });

  } catch (error: any) {
    console.error('Eligibility check error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to check eligibility' },
      { status: 500 }
    );
  }
}