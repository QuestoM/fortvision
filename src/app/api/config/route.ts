import { NextResponse } from 'next/server';

// This is a simple API endpoint to expose configuration values that
// need to be accessible to the client but are stored as environment variables
export async function GET() {
  return NextResponse.json({
    facebookAppId: process.env.FACEBOOK_APP_ID || '274455496241026',
  });
} 