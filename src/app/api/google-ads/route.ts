import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { GoogleAdsService } from '@/lib/api/google-ads';
import dbConnect from '@/lib/dbConnect';
import AdAccount from '@/lib/models/adAccount';

// Configure longer timeout for API route
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = 'force-dynamic'; // Disable caching for this route

// Connect to database
try {
  dbConnect();
} catch (error) {
  console.warn('Database connection failed, some features may be limited:', error);
}

export async function GET(request: NextRequest) {
  try {
    const auth = getAuth(request);
    const { userId } = auth;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    const campaignId = searchParams.get('campaignId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    
    // If no accountId is provided, return a list of accounts
    if (!accountId) {
      const accounts = await AdAccount.find({ 
        userId, 
        platform: 'google'
      });
      
      return NextResponse.json({ accounts });
    }
    
    // Get the account credentials
    const account = await AdAccount.findOne({ 
      userId, 
      platform: 'google',
      accountId 
    });
    
    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    
    // Create a Google Ads service
    const googleAds = new GoogleAdsService(
      account.refreshToken,
      process.env.GOOGLE_CLIENT_ID!,
      process.env.GOOGLE_CLIENT_SECRET!,
      process.env.GOOGLE_DEVELOPER_TOKEN!
    );
    
    // Get campaigns if no campaignId is provided
    if (!campaignId) {
      const campaigns = await googleAds.getCampaigns(accountId);
      return NextResponse.json({ campaigns });
    }
    
    // Get campaign details
    const campaignDetails = await googleAds.getCampaignDetails(accountId, campaignId);
    
    // Get ad group performance
    const adGroups = await googleAds.getAdGroupPerformance(accountId, campaignId);
    
    // Get performance by date if date range is provided
    let performanceByDate = null;
    if (dateFrom && dateTo) {
      performanceByDate = await googleAds.getPerformanceByDate(
        accountId,
        dateFrom,
        dateTo
      );
    }
    
    return NextResponse.json({
      campaignDetails,
      adGroups,
      performanceByDate
    });
    
  } catch (error: any) {
    console.error('Google Ads API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST endpoint to add or update a Google Ads account
export async function POST(request: NextRequest) {
  try {
    const auth = getAuth(request);
    const { userId } = auth;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { accountId, accountName, refreshToken, isDefault } = body;
    
    if (!accountId || !accountName || !refreshToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // If setting as default, unset any existing default
    if (isDefault) {
      await AdAccount.updateMany(
        { userId, platform: 'google', isDefault: true },
        { $set: { isDefault: false } }
      );
    }
    
    // Upsert the account
    const result = await AdAccount.findOneAndUpdate(
      { userId, platform: 'google', accountId },
      {
        userId,
        platform: 'google',
        accountId,
        accountName,
        refreshToken,
        isDefault: isDefault || false,
        lastSyncDate: new Date()
      },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ success: true, account: result });
    
  } catch (error: any) {
    console.error('Error saving Google Ads account:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to remove a Google Ads account
export async function DELETE(request: NextRequest) {
  try {
    const auth = getAuth(request);
    const { userId } = auth;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const accountId = searchParams.get('accountId');
    
    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }
    
    const result = await AdAccount.findOneAndDelete({
      userId,
      platform: 'google',
      accountId
    });
    
    if (!result) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error: any) {
    console.error('Error deleting Google Ads account:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 