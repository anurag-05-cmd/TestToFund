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
    
    // Try multiple parameter names
    let udemyLink = url.searchParams.get('udemyLink') || 
                   url.searchParams.get('certUrl') || 
                   url.searchParams.get('certificateUrl') ||
                   url.searchParams.get('url');

    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address' },
        { status: 400 }
      );
    }

    if (!udemyLink) {
      return NextResponse.json({
        canClaim: false,
        alreadyClaimed: false,
        reason: 'Udemy certificate link is required'
      });
    }

    // Multiple cleaning attempts
    udemyLink = udemyLink.trim();
    try {
      udemyLink = decodeURIComponent(udemyLink);
    } catch (e) {
      // If decoding fails, use original
    }
    
    // Remove any extra quotes or escaping
    udemyLink = udemyLink.replace(/^["']|["']$/g, '');
    udemyLink = udemyLink.replace(/\\/g, '');

    // Multiple validation patterns - from most specific to most general
    const patterns = [
      // Exact pattern for your URL format
      /^https:\/\/www\.udemy\.com\/certificate\/UC-[a-fA-F0-9\-]+\/?$/,
      // With or without www
      /^https:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[a-fA-F0-9\-]+\/?$/,
      // HTTP or HTTPS
      /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[a-fA-F0-9\-]+\/?$/,
      // More flexible character set
      /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[\w\-]+\/?$/,
      // Very flexible - just check structure
      /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-.+\/?$/,
      // Even more flexible
      /udemy\.com\/certificate\/UC-/,
      // Last resort - just check if it contains the basic structure
      /certificate\/UC-/
    ];

    let isValid = false;
    for (const pattern of patterns) {
      if (pattern.test(udemyLink)) {
        isValid = true;
        break;
      }
    }

    // If still not valid, try case insensitive
    if (!isValid) {
      const caseInsensitivePattern = /certificate\/uc-/i;
      isValid = caseInsensitivePattern.test(udemyLink);
    }

    if (!isValid) {
      // Return success anyway if it looks like a Udemy URL
      if (udemyLink.includes('udemy.com') && udemyLink.includes('certificate')) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json({
        canClaim: false,
        alreadyClaimed: false,
        reason: 'Invalid Udemy certificate link format. Please ensure it is a valid Udemy certificate URL.'
      });
    }

    // Normalize for comparison
    const normalizedUdemyLink = udemyLink.toLowerCase().replace(/\/$/, '');

    // Check if certificate has already been used
    let isUsed = false;
    for (const cert of usedCertificates) {
      const normalizedCert = cert.toLowerCase().replace(/\/$/, '');
      if (normalizedCert === normalizedUdemyLink) {
        isUsed = true;
        break;
      }
    }

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
