// Save as: app/api/rewards/check-eligibility/[address]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage (should match the claim route)
const claimedAddresses = new Set<string>();

// Storage for used certificate URLs (should match the claim route)
const usedCertificates = new Set<string>();

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address;
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

    // Clean the URL
    udemyLink = udemyLink.trim();
    
    try {
      udemyLink = decodeURIComponent(udemyLink);
    } catch (e) {
      // If decoding fails, use original
    }
    
    // Remove any extra quotes or escaping
    udemyLink = udemyLink.replace(/^["']|["']$/g, '');
    udemyLink = udemyLink.replace(/\\/g, '');

    // Validation patterns for Udemy certificate URLs
    const isValidUdemyUrl = (url: string): boolean => {
      // Check if it's a Udemy certificate URL with UC- format
      const udemyPattern = /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[a-fA-F0-9\-]+\/?$/i;
      
      if (udemyPattern.test(url)) {
        return true;
      }
      
      // Fallback: check if it contains the basic structure
      if (url.toLowerCase().includes('udemy.com') && 
          url.toLowerCase().includes('certificate') && 
          url.toLowerCase().includes('uc-')) {
        return true;
      }
      
      return false;
    };

    if (!isValidUdemyUrl(udemyLink)) {
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

  } catch (error) {
    console.error('Eligibility check error:', error);
    
    return NextResponse.json(
      { error: 'Failed to check eligibility' },
      { status: 500 }
    );
  }
}
