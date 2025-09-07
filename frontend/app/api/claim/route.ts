// Save as: app/api/rewards/claim/route.ts

import { NextRequest, NextResponse } from 'next/server';

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
    
    console.log('Received data:', {
      walletAddress,
      certificateUrl,
      hasFile: formData.has('certificate')
    });

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

    // For now, just return success for testing
    console.log('Returning success response');
    return NextResponse.json({
      success: true,
      message: 'Test claim successful!',
      walletAddress,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('POST /api/rewards/claim error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
}