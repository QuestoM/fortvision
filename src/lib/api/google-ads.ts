import { GoogleAdsApi } from 'google-ads-api';

export class GoogleAdsService {
  private client: any;
  private refreshToken: string;

  constructor(refreshToken: string, clientId: string, clientSecret: string, developerToken: string) {
    this.client = new GoogleAdsApi({
      client_id: clientId,
      client_secret: clientSecret,
      developer_token: developerToken
    });
    
    this.refreshToken = refreshToken;
  }

  async getCustomer(customerId: string) {
    return this.client.Customer({
      customer_id: customerId,
      refresh_token: this.refreshToken
    });
  }

  async getCampaigns(customerId: string) {
    const customer = await this.getCustomer(customerId);
    return customer.report({
      entity: 'campaign',
      attributes: [
        'campaign.id',
        'campaign.name',
        'campaign.status'
      ],
      metrics: [
        'metrics.clicks',
        'metrics.impressions',
        'metrics.cost_micros',
        'metrics.conversions'
      ]
    });
  }

  async getCampaignDetails(customerId: string, campaignId: string) {
    const customer = await this.getCustomer(customerId);
    return customer.report({
      entity: 'campaign',
      attributes: [
        'campaign.id',
        'campaign.name',
        'campaign.status',
        'campaign.advertising_channel_type',
        'campaign.bidding_strategy_type'
      ],
      metrics: [
        'metrics.clicks',
        'metrics.impressions',
        'metrics.cost_micros',
        'metrics.conversions',
        'metrics.ctr',
        'metrics.average_cpc',
        'metrics.cost_per_conversion'
      ],
      constraints: {
        'campaign.id': campaignId
      }
    });
  }

  async getAdGroupPerformance(customerId: string, campaignId: string) {
    const customer = await this.getCustomer(customerId);
    return customer.report({
      entity: 'ad_group',
      attributes: [
        'ad_group.id',
        'ad_group.name',
        'ad_group.status',
        'campaign.id'
      ],
      metrics: [
        'metrics.clicks',
        'metrics.impressions',
        'metrics.cost_micros',
        'metrics.conversions',
        'metrics.ctr',
        'metrics.average_cpc'
      ],
      constraints: {
        'campaign.id': campaignId
      }
    });
  }

  async getPerformanceByDate(customerId: string, dateFrom: string, dateTo: string) {
    const customer = await this.getCustomer(customerId);
    return customer.report({
      entity: 'campaign',
      attributes: [
        'campaign.id',
        'campaign.name'
      ],
      metrics: [
        'metrics.clicks',
        'metrics.impressions',
        'metrics.cost_micros',
        'metrics.conversions'
      ],
      segments: ['segments.date'],
      from_date: dateFrom,
      to_date: dateTo
    });
  }
} 