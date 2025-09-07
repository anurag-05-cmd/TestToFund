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

    console.log('Raw udemyLink:', udemyLink); // Debug log

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

    console.log('Cleaned udemyLink:', udemyLink); // Debug log

    // Test your specific URL
    const testUrl = 'https://www.udemy.com/certificate/UC-d22f574a-f126-4131-96f9-20cfe4e7cc14/';
    console.log('Test URL matches your link:', udemyLink === testUrl);

    // Enhanced validation patterns - specifically for your URL format
    const patterns = [
      // Your exact format: UC- followed by UUID-like pattern
      /^https:\/\/www\.udemy\.com\/certificate\/UC-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\/?$/,
      // With or without www
      /^https:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\/?$/,
      // HTTP or HTTPS
      /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\/?$/,
      // Mixed case hex
      /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}\/?$/,
      // Original broader patterns
      /^https:\/\/www\.udemy\.com\/certificate\/UC-[a-fA-F0-9\-]+\/?$/,
      /^https:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[a-fA-F0-9\-]+\/?$/,
      /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[a-fA-F0-9\-]+\/?$/,
      /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-[\w\-]+\/?$/,
      /^https?:\/\/(?:www\.)?udemy\.com\/certificate\/UC-.+\/?$/,
      /udemy\.com\/certificate\/UC-/,
      /certificate\/UC-/
    ];

    let isValid = false;
    let matchedPattern = -1;
    
    for (let i = 0; i < patterns.length; i++) {
      if (patterns[i].test(udemyLink)) {
        isValid = true;
        matchedPattern = i;
        break;
      }
    }

    console.log('Pattern matched:', matchedPattern, 'isValid:', isValid); // Debug log

    // If still not valid, try case insensitive
    if (!isValid) {
      const caseInsensitivePattern = /certificate\/uc-/i;
      if (caseInsensitivePattern.test(udemyLink)) {
        isValid = true;
        matchedPattern = 'case-insensitive';
      }
    }

    // Fallback validation
    if (!isValid) {
      if (udemyLink.includes('udemy.com') && udemyLink.includes('certificate')) {
        isValid = true;
        matchedPattern = 'fallback';
      }
    }

    console.log('Final validation result:', isValid, 'Pattern:', matchedPattern); // Debug log

    if (!isValid) {
      return NextResponse.json({
        canClaim: false,
        alreadyClaimed: false,
        reason: 'Invalid Udemy certificate link format. Please ensure it is a valid Udemy certificate URL.',
        debug: {
          receivedUrl: udemyLink,
          testUrl: testUrl,
          matches: udemyLink === testUrl
        }
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
      udemyLinkValid: true,
      debug: {
        receivedUrl: udemyLink,
        normalizedUrl: normalizedUdemyLink,
        matchedPattern: matchedPattern
      }
    });

  } catch (error: any) {
    console.error('Eligibility check error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to check eligibility' },
      { status: 500 }
    );
  }
}
