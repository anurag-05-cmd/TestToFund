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
    let udemyLink = url.searchParams.get('udemyLink') || url.searchParams.get('certUrl');

    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    // Check if Udemy link is provided
    if (!udemyLink) {
      return NextResponse.json({
        canClaim: false,
        alreadyClaimed: false,
        reason: 'Udemy certificate link is required'
      });
    }

    // Clean the URL - remove extra whitespace and decode if needed
    udemyLink = decodeURIComponent(udemyLink.trim());
    
    // Log for debugging
    console.log('Checking Udemy link:', udemyLink);

    // More flexible regex pattern that handles various formats
    const udemyLinkPatterns = [
      // Standard certificate URLs
      /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[a-fA-F0-9\-]{10,}\/?$/,
      // Short URLs  
      /^https?:\/\/ude\.my\/UC-[a-fA-F0-9\-]{6,}\/?$/,
      // More flexible pattern to catch edge cases
      /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[\w\-]{10,}\/?$/
    ];

    let isValidFormat = false;
    for (const pattern of udemyLinkPatterns) {
      if (pattern.test(udemyLink)) {
        isValidFormat = true;
        console.log('Matched pattern:', pattern);
        break;
      }
    }

    if (!isValidFormat) {
      console.log('No pattern matched for URL:', udemyLink);
      return NextResponse.json({
        canClaim: false,
        alreadyClaimed: false,
        reason: 'Invalid Udemy certificate link format. Please ensure it is a valid Udemy certificate URL (e.g., https://www.udemy.com/certificate/UC-...)'
      });
    }

    // Normalize the URL for comparison (remove trailing slash, convert to lowercase)
    const normalizedUdemyLink = udemyLink.toLowerCase().replace(/\/$/, '');

    // Check if certificate has already been used by another address
    const isUsed = Array.from(usedCertificates).some(cert => 
      cert.toLowerCase().replace(/\/$/, '') === normalizedUdemyLink
    );

    if (isUsed) {
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
      udemyLinkValid: true,
      processedUrl: normalizedUdemyLink // For debugging
    });

  } catch (error: any) {
    console.error('Eligibility check error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to check eligibility' },
      { status: 500 }
    );
  }
}
