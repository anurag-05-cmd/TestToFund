// Save as: app/api/rewards/check-eligibility/[address]/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage (should match the claim route)
const claimedAddresses = new Set<string>();

// Storage for used certificate URLs (should match the claim route)
const usedCertificates = new Set<string>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const url = new URL(request.url);
    const udemyLink = url.searchParams.get('udemyLink') || url.searchParams.get('certUrl');

    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // Check if Udemy link is provided and valid
    if (!udemyLink) {
      return NextResponse.json({
        canClaim: false,
        alreadyClaimed: false,
        reason: 'Udemy certificate link is required'
      });
    }

    // Validate Udemy link format
    const udemyLinkPattern = /^https?:\/\/(?:ude\.my\/UC-[\w-]{6,}|(?:www\.)?udemy\.com\/certificate\/UC-[\w-]{10,})$/;
    if (!udemyLinkPattern.test(udemyLink)) {
      return NextResponse.json({
        canClaim: false,
        alreadyClaimed: false,
        reason: 'Invalid Udemy certificate link format. Must be a valid Udemy certificate URL.'
      });
    }

    // Check if certificate has already been used by another address
    if (usedCertificates.has(udemyLink)) {
      return NextResponse.json({
        canClaim: false,
        alreadyClaimed: false,
        reason: 'This certificate has already been used by another wallet address.'
      });
    }

    const normalizedAddress = address.toLowerCase();
    const alreadyClaimed = claimedAddresses.has(normalizedAddress);

    return NextResponse.json({
      canClaim: !alreadyClaimed,
      alreadyClaimed,
      reason: alreadyClaimed ? 'Already claimed rewards' : undefined,
      udemyLinkValid: true
    });

  } catch (error: any) {
    console.error('Eligibility check error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to check eligibility' },
      { status: 500 }
    );
  }
}