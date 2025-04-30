import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { FacebookAdsService } from '@/lib/api/facebook-ads';
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

// Mock function for development when DB is unavailable
async function getMockAccounts(userId: string) {
  return [];
}

async function getMockAccount(userId: string, accountId: string, accessToken?: string) {
  // If access token is provided from the request, use it
  if (accessToken) {
    return {
      userId,
      platform: 'facebook',
      accountId,
      accountName: 'Development Account',
      accessToken,
      isDefault: true,
      lastSyncDate: new Date()
    };
  }
  return null;
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
    const datePreset = searchParams.get('datePreset') || 'last_30_days';
    const accessToken = searchParams.get('access_token'); // For development without DB
    
    // If no accountId is provided, return a list of accounts from DB
    if (!accountId) {
      try {
        const accounts = await AdAccount.find({ 
          userId, 
          platform: 'facebook'
        });
        return NextResponse.json({ accounts });
      } catch (error) {
        console.warn('Database error, using mock accounts:', error);
        const mockAccounts = await getMockAccounts(userId);
        return NextResponse.json({ accounts: mockAccounts });
      }
    }
    
    // Get the account credentials
    let account;
    try {
      account = await AdAccount.findOne({ 
        userId, 
        platform: 'facebook',
        accountId 
      });
    } catch (error) {
      console.warn('Database error, using mock account:', error);
      account = await getMockAccount(userId, accountId, accessToken as string);
    }
    
    if (!account && !accessToken) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    
    // For development without DB, use the access token from query param
    const token = account?.accessToken || accessToken;
    
    if (!token) {
      return NextResponse.json({ 
        error: 'No access token available. Please provide an access_token parameter or connect your account properly.', 
        code: 'NO_TOKEN' 
      }, { status: 400 });
    }
    
    // Create a Facebook Ads service
    const fbAds = new FacebookAdsService(token);
    
    // Try to verify the token before making any API calls
    try {
      await fbAds.verifyToken();
    } catch (error) {
      console.error('Facebook token validation error:', error);
      return NextResponse.json({ 
        error: 'Facebook access token is invalid or expired. Please reconnect your account.',
        code: 'TOKEN_INVALID'
      }, { status: 401 });
    }
    
    // Get campaigns if no campaignId is provided
    if (!campaignId) {
      const campaigns = await fbAds.getCampaigns(accountId);
      
      // Get insights for all campaigns
      const campaignIds = campaigns.map((campaign: any) => campaign.id);
      const insights = await fbAds.getCampaignInsights(accountId, campaignIds, datePreset as string);
      
      return NextResponse.json({ campaigns, insights });
    }
    
    // Get detailed data for a specific campaign
    const campaigns = await fbAds.getCampaigns(accountId);
    const campaign = campaigns.find((c: any) => c.id === campaignId);
    
    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }
    
    // Get campaign insights
    const insights = await fbAds.getCampaignInsights(accountId, [campaignId], datePreset as string);
    
    // Get ad set insights
    const adSetInsights = await fbAds.getAdSetInsights(accountId, campaignId, datePreset as string);
    
    // Get daily breakdown
    const dailyInsights = await fbAds.getDailyInsights(accountId, 30);
    
    // Get demographic breakdown
    const demographics = await fbAds.getAgeGenderBreakdown(accountId, datePreset as string);
    
    return NextResponse.json({
      campaign,
      insights,
      adSetInsights,
      dailyInsights,
      demographics
    });
    
  } catch (error: any) {
    console.error('Facebook Ads API error:', error);
    
    // Detect authentication issues
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return NextResponse.json({ 
        error: 'Authentication error with Facebook API. Please reconnect your account.',
        code: 'AUTH_ERROR'
      }, { status: 401 });
    }
    
    // Special handling for rate limiting
    if (error.response && error.response.status === 429) {
      return NextResponse.json({ 
        error: 'Facebook API rate limit exceeded. Please try again later.',
        code: 'RATE_LIMIT'
      }, { status: 429 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// This endpoint is used to add or update a Facebook Ads account
export async function POST(request: NextRequest) {
  try {
    const auth = getAuth(request);
    const { userId } = auth;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { accountId, accountName, accessToken, isDefault } = body;
    
    if (!accountId || !accountName || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // If setting as default, unset any existing default
    if (isDefault) {
      await AdAccount.updateMany(
        { userId, platform: 'facebook', isDefault: true },
        { $set: { isDefault: false } }
      );
    }
    
    // Validate the token by trying to use it
    try {
      const fbAds = new FacebookAdsService(accessToken);
      // Verify the token and that it has access to the specified account
      const tokenInfo = await fbAds.verifyToken();
      
      // Check if token has ads_management permission
      if (!tokenInfo.scopes || !tokenInfo.scopes.includes('ads_management')) {
        return NextResponse.json(
          { error: 'The Facebook access token does not have ads_management permission' },
          { status: 400 }
        );
      }
      
      // Verify account access by attempting to get the account details
      const accounts = await fbAds.getAdAccounts();
      const hasAccess = accounts.some((acc: any) => 
        acc.id === `act_${accountId}` || acc.account_id === accountId
      );
      
      if (!hasAccess) {
        return NextResponse.json(
          { error: 'The provided token does not have access to this ad account' },
          { status: 400 }
        );
      }
    } catch (error: any) {
      console.error('Error validating Facebook token:', error);
      return NextResponse.json(
        { error: 'Invalid Facebook access token' },
        { status: 400 }
      );
    }
    
    // Upsert the account
    const result = await AdAccount.findOneAndUpdate(
      { userId, platform: 'facebook', accountId },
      {
        userId,
        platform: 'facebook',
        accountId,
        accountName,
        accessToken,
        isDefault: isDefault || false,
        lastSyncDate: new Date()
      },
      { upsert: true, new: true }
    );
    
    return NextResponse.json({ 
      success: true, 
      account: {
        _id: result._id,
        userId: result.userId,
        platform: result.platform,
        accountId: result.accountId,
        accountName: result.accountName,
        isDefault: result.isDefault,
        lastSyncDate: result.lastSyncDate,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      } 
    });
    
  } catch (error: any) {
    console.error('Error saving Facebook Ads account:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a Facebook Ads account
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
      platform: 'facebook',
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
    console.error('Error deleting Facebook Ads account:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 