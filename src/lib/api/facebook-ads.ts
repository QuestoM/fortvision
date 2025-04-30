import axios from 'axios';

export class FacebookAdsService {
  private accessToken: string;
  private apiVersion: string = 'v18.0'; // Use the latest API version

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  /**
   * Static method to check if a token is valid without creating an instance
   */
  static async isTokenValid(accessToken: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/debug_token`,
        {
          params: {
            input_token: accessToken,
            access_token: accessToken,
          },
        }
      );
      const data = response.data?.data;
      return data?.is_valid === true && !data?.error && 
             Array.isArray(data?.scopes) && 
             data.scopes.includes('ads_management');
    } catch (error) {
      console.error('Error validating Facebook token:', error);
      return false;
    }
  }

  /**
   * Get ad accounts user has access to
   */
  async getAdAccounts() {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${this.apiVersion}/me/adaccounts`,
        {
          params: {
            fields: 'id,name,account_id,account_status,amount_spent,balance,currency,business',
            access_token: this.accessToken,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      throw error;
    }
  }

  /**
   * Get campaigns for a specific ad account
   */
  async getCampaigns(adAccountId: string) {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${this.apiVersion}/act_${adAccountId}/campaigns`,
        {
          params: {
            fields: 'id,name,status,objective,budget_remaining,daily_budget,lifetime_budget,start_time,stop_time',
            access_token: this.accessToken,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  /**
   * Get campaign insights
   */
  async getCampaignInsights(adAccountId: string, campaignIds: string[], timeRange: string = 'last_30_days') {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${this.apiVersion}/act_${adAccountId}/insights`,
        {
          params: {
            level: 'campaign',
            time_range: `{"since":"${timeRange}"}`,
            campaign_ids: `[${campaignIds.join(',')}]`,
            fields: 'campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,reach,frequency',
            access_token: this.accessToken,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching campaign insights:', error);
      throw error;
    }
  }

  /**
   * Get ad sets for a campaign
   */
  async getAdSetInsights(adAccountId: string, campaignId: string, timeRange: string = 'last_30_days') {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${this.apiVersion}/act_${adAccountId}/adsets`,
        {
          params: {
            campaign_id: campaignId,
            fields: 'id,name,status,targeting,bid_amount,budget_remaining,daily_budget,lifetime_budget',
            access_token: this.accessToken,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching ad sets:', error);
      throw error;
    }
  }

  /**
   * Get daily insights for an ad account
   */
  async getDailyInsights(adAccountId: string, days: number = 30) {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - days);

    const since = pastDate.toISOString().split('T')[0];
    const until = today.toISOString().split('T')[0];

    try {
      const response = await axios.get(
        `https://graph.facebook.com/${this.apiVersion}/act_${adAccountId}/insights`,
        {
          params: {
            time_range: `{"since":"${since}","until":"${until}"}`,
            time_increment: 1,
            fields: 'date_start,spend,impressions,clicks,ctr,cpc,reach',
            access_token: this.accessToken,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching daily insights:', error);
      throw error;
    }
  }

  /**
   * Get age and gender breakdown
   */
  async getAgeGenderBreakdown(adAccountId: string, timeRange: string = 'last_30_days') {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/${this.apiVersion}/act_${adAccountId}/insights`,
        {
          params: {
            breakdowns: 'age,gender',
            time_range: `{"since":"${timeRange}"}`,
            fields: 'age,gender,impressions,clicks,spend,reach',
            access_token: this.accessToken,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching age/gender breakdown:', error);
      throw error;
    }
  }

  /**
   * Verify access token
   */
  async verifyToken() {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/debug_token`,
        {
          params: {
            input_token: this.accessToken,
            access_token: this.accessToken,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  }
} 