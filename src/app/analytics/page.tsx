'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Pie,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  Line,
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  TrendingUp,
  LineChart as LineChartIcon,
  Loader2
} from 'lucide-react';
import AdAccountSelector from '@/components/dashboard/AdAccountSelector';
import DateRangeSelector from '@/components/dashboard/DateRangeSelector';

// Colors for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28'];

export default function AnalyticsPage() {
  const [googleAccountId, setGoogleAccountId] = useState<string | null>(null);
  const [facebookAccountId, setFacebookAccountId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ preset: 'last_30_days' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleData, setGoogleData] = useState<any>(null);
  const [facebookData, setFacebookData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (googleAccountId || facebookAccountId) {
      fetchData();
    }
  }, [googleAccountId, facebookAccountId, dateRange]);
  
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch Google Ads data if account is selected
      if (googleAccountId) {
        const googleResponse = await fetch(
          `/api/google-ads?accountId=${googleAccountId}&datePreset=${dateRange.preset}`
        );
        
        if (googleResponse.ok) {
          const data = await googleResponse.json();
          setGoogleData(data);
        }
      }
      
      // Fetch Facebook Ads data if account is selected
      if (facebookAccountId) {
        const facebookResponse = await fetch(
          `/api/facebook-ads?accountId=${facebookAccountId}&datePreset=${dateRange.preset}`
        );
        
        if (facebookResponse.ok) {
          const data = await facebookResponse.json();
          setFacebookData(data);
        }
      }
    } catch (error: any) {
      console.error('Error fetching analytics data:', error);
      setError(error.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleAccountSelect = (accountId: string) => {
    setGoogleAccountId(accountId);
  };
  
  const handleFacebookAccountSelect = (accountId: string) => {
    setFacebookAccountId(accountId);
  };
  
  const handleDateRangeChange = (range: { preset: string; from?: Date; to?: Date }) => {
    setDateRange(range);
  };
  
  // Helper functions for formatting data
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };
  
  // Calculate total metrics for Google Ads
  const getGoogleMetrics = () => {
    if (!googleData || !googleData.campaigns) return null;
    
    return googleData.campaigns.reduce((acc: any, campaign: any) => {
      acc.impressions += parseInt(campaign.metrics?.impressions || 0);
      acc.clicks += parseInt(campaign.metrics?.clicks || 0);
      acc.spend += parseInt(campaign.metrics?.cost_micros || 0) / 1000000;
      acc.conversions += parseFloat(campaign.metrics?.conversions || 0);
      return acc;
    }, { impressions: 0, clicks: 0, spend: 0, conversions: 0 });
  };
  
  // Calculate total metrics for Facebook Ads
  const getFacebookMetrics = () => {
    if (!facebookData || !facebookData.insights) return null;
    
    return facebookData.insights.reduce((acc: any, insight: any) => {
      acc.impressions += parseInt(insight.impressions || 0);
      acc.clicks += parseInt(insight.clicks || 0);
      acc.spend += parseFloat(insight.spend || 0);
      acc.conversions += parseFloat(insight.conversions || 0);
      return acc;
    }, { impressions: 0, clicks: 0, spend: 0, conversions: 0 });
  };
  
  // Prepare data for platform comparison chart
  const getPlatformComparisonData = () => {
    const googleMetrics = getGoogleMetrics();
    const facebookMetrics = getFacebookMetrics();
    
    if (!googleMetrics && !facebookMetrics) return [];
    
    return [
      {
        name: 'Impressions',
        Google: googleMetrics?.impressions || 0,
        Facebook: facebookMetrics?.impressions || 0
      },
      {
        name: 'Clicks',
        Google: googleMetrics?.clicks || 0,
        Facebook: facebookMetrics?.clicks || 0
      },
      {
        name: 'Spend',
        Google: googleMetrics?.spend || 0,
        Facebook: facebookMetrics?.spend || 0
      }
    ];
  };
  
  // Prepare data for spend distribution pie chart
  const getSpendDistributionData = () => {
    const googleMetrics = getGoogleMetrics();
    const facebookMetrics = getFacebookMetrics();
    
    if (!googleMetrics && !facebookMetrics) return [];
    
    const googleSpend = googleMetrics?.spend || 0;
    const facebookSpend = facebookMetrics?.spend || 0;
    const totalSpend = googleSpend + facebookSpend;
    
    return [
      {
        name: 'Google Ads',
        value: googleSpend,
        percentage: totalSpend > 0 ? (googleSpend / totalSpend) * 100 : 0
      },
      {
        name: 'Facebook Ads',
        value: facebookSpend,
        percentage: totalSpend > 0 ? (facebookSpend / totalSpend) * 100 : 0
      }
    ];
  };
  
  // Prepare data for campaign performance comparison
  const getCampaignComparisonData = () => {
    const result = [];
    
    // Add Google campaigns
    if (googleData && googleData.campaigns) {
      for (const campaign of googleData.campaigns.slice(0, 5)) { // Limit to top 5
        result.push({
          name: campaign.campaign?.name,
          platform: 'Google',
          impressions: parseInt(campaign.metrics?.impressions || 0),
          clicks: parseInt(campaign.metrics?.clicks || 0),
          spend: parseInt(campaign.metrics?.cost_micros || 0) / 1000000,
          ctr: parseFloat(campaign.metrics?.ctr || 0) * 100
        });
      }
    }
    
    // Add Facebook campaigns
    if (facebookData && facebookData.campaigns && facebookData.insights) {
      const campaignMap = new Map();
      
      // Map insights to campaigns
      for (const insight of facebookData.insights) {
        campaignMap.set(insight.campaign_id, insight);
      }
      
      for (const campaign of facebookData.campaigns.slice(0, 5)) { // Limit to top 5
        const insight = campaignMap.get(campaign.id);
        if (insight) {
          result.push({
            name: campaign.name,
            platform: 'Facebook',
            impressions: parseInt(insight.impressions || 0),
            clicks: parseInt(insight.clicks || 0),
            spend: parseFloat(insight.spend || 0),
            ctr: parseFloat(insight.ctr || 0) * 100
          });
        }
      }
    }
    
    // Sort by spend (highest first)
    return result.sort((a, b) => b.spend - a.spend);
  };
  
  // Calculate ROI or efficiency metrics
  const getEfficiencyMetrics = () => {
    const googleMetrics = getGoogleMetrics();
    const facebookMetrics = getFacebookMetrics();
    
    if (!googleMetrics && !facebookMetrics) return null;
    
    const googleCPC = googleMetrics?.clicks > 0 
      ? googleMetrics.spend / googleMetrics.clicks 
      : 0;
      
    const facebookCPC = facebookMetrics?.clicks > 0 
      ? facebookMetrics.spend / facebookMetrics.clicks 
      : 0;
      
    const googleCTR = googleMetrics?.impressions > 0 
      ? (googleMetrics.clicks / googleMetrics.impressions) * 100 
      : 0;
      
    const facebookCTR = facebookMetrics?.impressions > 0 
      ? (facebookMetrics.clicks / facebookMetrics.impressions) * 100 
      : 0;
    
    return {
      googleCPC,
      facebookCPC,
      googleCTR,
      facebookCTR
    };
  };
  
  const efficiencyMetrics = getEfficiencyMetrics();

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Cross-Platform Analytics</h1>
          <p className="text-muted-foreground">
          Compare performance metrics across your Google Ads and Facebook Ads campaigns
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-sm font-medium">Google Ads Account</h2>
          <AdAccountSelector platform="google" onSelect={handleGoogleAccountSelect} />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-sm font-medium">Facebook Ads Account</h2>
          <AdAccountSelector platform="facebook" onSelect={handleFacebookAccountSelect} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <DateRangeSelector onChange={handleDateRangeChange} defaultPreset={dateRange.preset} />
        
        <Button variant="outline" size="icon" title="Export Data">
          <Download className="h-4 w-4" />
        </Button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
            </div>
      ) : error ? (
        <Card>
          <CardContent className="flex items-center justify-center p-6 text-red-500">
            {error}
          </CardContent>
        </Card>
      ) : !googleAccountId && !facebookAccountId ? (
        <Card>
          <CardContent className="flex items-center justify-center p-12 text-center">
            <div className="max-w-md">
              <h3 className="text-lg font-medium mb-2">Select Advertising Accounts</h3>
              <p className="text-muted-foreground mb-4">
                Please select at least one Google Ads or Facebook Ads account to view analytics data
              </p>
            </div>
          </CardContent>
        </Card>
      ) : googleData || facebookData ? (
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="efficiency">
              <TrendingUp className="h-4 w-4 mr-2" />
              Efficiency
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="spend">
              <PieChartIcon className="h-4 w-4 mr-2" />
              Spend
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(
                      (getGoogleMetrics()?.impressions || 0) + 
                      (getFacebookMetrics()?.impressions || 0)
                    )}
            </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(
                      (getGoogleMetrics()?.clicks || 0) + 
                      (getFacebookMetrics()?.clicks || 0)
                    )}
                  </div>
          </CardContent>
        </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      (getGoogleMetrics()?.spend || 0) + 
                      (getFacebookMetrics()?.spend || 0)
                    )}
            </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
          </CardHeader>
          <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(
                      (getGoogleMetrics()?.conversions || 0) + 
                      (getFacebookMetrics()?.conversions || 0)
                    )}
                  </div>
          </CardContent>
        </Card>
      </div>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance Comparison</CardTitle>
                <CardDescription>
                  Comparing key metrics between Google Ads and Facebook Ads
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getPlatformComparisonData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Google" fill="#8884d8" name="Google Ads" />
                    <Bar dataKey="Facebook" fill="#82ca9d" name="Facebook Ads" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="efficiency" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Per Click (CPC)</CardTitle>
                  <CardDescription>
                    Average cost per click comparison
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: 'Google Ads',
                          value: efficiencyMetrics?.googleCPC || 0
                        },
                        {
                          name: 'Facebook Ads',
                          value: efficiencyMetrics?.facebookCPC || 0
                        }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(value as number), 'CPC']} />
                      <Bar dataKey="value" fill="#8884d8" name="CPC">
                        <Cell fill="#8884d8" />
                        <Cell fill="#82ca9d" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Click-Through Rate (CTR)</CardTitle>
                  <CardDescription>
                    Average CTR comparison
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: 'Google Ads',
                          value: efficiencyMetrics?.googleCTR || 0
                        },
                        {
                          name: 'Facebook Ads',
                          value: efficiencyMetrics?.facebookCTR || 0
                        }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${(value as number).toFixed(2)}%`, 'CTR']} />
                      <Bar dataKey="value" name="CTR">
                        <Cell fill="#8884d8" />
                        <Cell fill="#82ca9d" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
          </div>
          
            <Card>
            <CardHeader>
                <CardTitle>Platform Efficiency Analysis</CardTitle>
              <CardDescription>
                  Compare key performance indicators across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Google Ads Efficiency</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cost Per Click</span>
                        <span className="font-medium">{formatCurrency(efficiencyMetrics?.googleCPC || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Click-Through Rate</span>
                        <span className="font-medium">{(efficiencyMetrics?.googleCTR || 0).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cost Per 1000 Impressions</span>
                        <span className="font-medium">
                          {formatCurrency(
                            getGoogleMetrics()?.impressions 
                              ? (getGoogleMetrics()?.spend / getGoogleMetrics()?.impressions) * 1000 
                              : 0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Facebook Ads Efficiency</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cost Per Click</span>
                        <span className="font-medium">{formatCurrency(efficiencyMetrics?.facebookCPC || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Click-Through Rate</span>
                        <span className="font-medium">{(efficiencyMetrics?.facebookCTR || 0).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Cost Per 1000 Impressions</span>
                        <span className="font-medium">
                          {formatCurrency(
                            getFacebookMetrics()?.impressions 
                              ? (getFacebookMetrics()?.spend / getFacebookMetrics()?.impressions) * 1000 
                              : 0
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Campaigns by Spend</CardTitle>
                <CardDescription>
                  Comparing top performing campaigns across platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={getCampaignComparisonData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={150} />
                    <Tooltip formatter={(value, name) => {
                      if (name === 'spend') return [formatCurrency(value as number), 'Spend'];
                      if (name === 'ctr') return [`${(value as number).toFixed(2)}%`, 'CTR'];
                      return [formatNumber(value as number), name];
                    }} />
                    <Legend />
                    <Bar dataKey="spend" fill="#8884d8" name="Spend" />
                    <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                    <Bar dataKey="ctr" fill="#ffc658" name="CTR (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Google Ads Campaigns</CardTitle>
                  <CardDescription>
                    Showing up to 5 campaigns from Google Ads
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 border-b p-2 bg-muted/50">
                      <div className="col-span-2 font-medium">Campaign</div>
                      <div className="text-right font-medium">Impressions</div>
                      <div className="text-right font-medium">Clicks</div>
                      <div className="text-right font-medium">Spend</div>
                    </div>
                    {googleData && googleData.campaigns ? (
                      googleData.campaigns.slice(0, 5).map((campaign: any, index: number) => (
                        <div key={index} className="grid grid-cols-5 p-2 border-b last:border-0">
                          <div className="col-span-2 truncate" title={campaign.campaign?.name}>
                            {campaign.campaign?.name}
                          </div>
                          <div className="text-right">
                            {formatNumber(parseInt(campaign.metrics?.impressions || 0))}
                          </div>
                          <div className="text-right">
                            {formatNumber(parseInt(campaign.metrics?.clicks || 0))}
                          </div>
                          <div className="text-right">
                            {formatCurrency(parseInt(campaign.metrics?.cost_micros || 0) / 1000000)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No Google Ads campaigns data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
            <CardHeader>
                  <CardTitle>Facebook Ads Campaigns</CardTitle>
                  <CardDescription>
                    Showing up to 5 campaigns from Facebook Ads
                  </CardDescription>
            </CardHeader>
                <CardContent className="p-0">
                  <div className="rounded-md border">
                    <div className="grid grid-cols-5 border-b p-2 bg-muted/50">
                      <div className="col-span-2 font-medium">Campaign</div>
                      <div className="text-right font-medium">Impressions</div>
                      <div className="text-right font-medium">Clicks</div>
                      <div className="text-right font-medium">Spend</div>
                    </div>
                    {facebookData && facebookData.campaigns && facebookData.insights ? (
                      (() => {
                        const campaignMap = new Map();
                        
                        // Map insights to campaigns
                        for (const insight of facebookData.insights) {
                          campaignMap.set(insight.campaign_id, insight);
                        }
                        
                        return facebookData.campaigns.slice(0, 5).map((campaign: any, index: number) => {
                          const insight = campaignMap.get(campaign.id) || {};
                          
                          return (
                            <div key={index} className="grid grid-cols-5 p-2 border-b last:border-0">
                              <div className="col-span-2 truncate" title={campaign.name}>
                                {campaign.name}
                              </div>
                              <div className="text-right">
                                {formatNumber(parseInt(insight.impressions || 0))}
                              </div>
                              <div className="text-right">
                                {formatNumber(parseInt(insight.clicks || 0))}
                              </div>
                              <div className="text-right">
                                {formatCurrency(parseFloat(insight.spend || 0))}
                              </div>
                            </div>
                          );
                        });
                      })()
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">
                        No Facebook Ads campaigns data available
                      </div>
                    )}
                  </div>
            </CardContent>
          </Card>
            </div>
        </TabsContent>
        
          <TabsContent value="spend" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
            <CardHeader>
                  <CardTitle>Ad Spend Distribution</CardTitle>
                  <CardDescription>
                    How your advertising budget is allocated between platforms
                  </CardDescription>
            </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getSpendDistributionData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percentage }) => `${name} (${percentage.toFixed(1)}%)`}
                      >
                        {getSpendDistributionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(value as number), 'Spend']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
            </CardContent>
          </Card>
        
              <Card>
            <CardHeader>
                  <CardTitle>Spend Efficiency Analysis</CardTitle>
                  <CardDescription>
                    Key performance metrics related to ad spend
                  </CardDescription>
            </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Platform Spend</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Google Ads</span>
                          <span>{formatCurrency(getGoogleMetrics()?.spend || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Facebook Ads</span>
                          <span>{formatCurrency(getFacebookMetrics()?.spend || 0)}</span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span>Total Spend</span>
                          <span>
                            {formatCurrency(
                              (getGoogleMetrics()?.spend || 0) + 
                              (getFacebookMetrics()?.spend || 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Cost Per Acquisition</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Google Ads</span>
                          <span>
                            {formatCurrency(
                              getGoogleMetrics()?.conversions > 0
                                ? getGoogleMetrics().spend / getGoogleMetrics().conversions
                                : 0
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Facebook Ads</span>
                          <span>
                            {formatCurrency(
                              getFacebookMetrics()?.conversions > 0
                                ? getFacebookMetrics().spend / getFacebookMetrics().conversions
                                : 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">Spend Recommendations</h3>
                    <ul className="space-y-2 text-sm">
                      {efficiencyMetrics && (
                        <>
                          {efficiencyMetrics.googleCPC < efficiencyMetrics.facebookCPC && (
                            <li className="flex gap-2 items-start">
                              <ArrowUpRight className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>
                                Consider increasing Google Ads budget as it has a lower CPC
                                ({formatCurrency(efficiencyMetrics.googleCPC)} vs {formatCurrency(efficiencyMetrics.facebookCPC)})
                              </span>
                            </li>
                          )}
                          {efficiencyMetrics.facebookCPC < efficiencyMetrics.googleCPC && (
                            <li className="flex gap-2 items-start">
                              <ArrowUpRight className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>
                                Consider increasing Facebook Ads budget as it has a lower CPC
                                ({formatCurrency(efficiencyMetrics.facebookCPC)} vs {formatCurrency(efficiencyMetrics.googleCPC)})
                              </span>
                            </li>
                          )}
                          {efficiencyMetrics.googleCTR > efficiencyMetrics.facebookCTR && (
                            <li className="flex gap-2 items-start">
                              <ArrowUpRight className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>
                                Google Ads has higher CTR ({efficiencyMetrics.googleCTR.toFixed(2)}% vs {efficiencyMetrics.facebookCTR.toFixed(2)}%),
                                indicating better audience targeting
                              </span>
                            </li>
                          )}
                          {efficiencyMetrics.facebookCTR > efficiencyMetrics.googleCTR && (
                            <li className="flex gap-2 items-start">
                              <ArrowUpRight className="h-4 w-4 text-green-500 mt-0.5" />
                              <span>
                                Facebook Ads has higher CTR ({efficiencyMetrics.facebookCTR.toFixed(2)}% vs {efficiencyMetrics.googleCTR.toFixed(2)}%),
                                indicating better audience engagement
                              </span>
                            </li>
                          )}
                        </>
                      )}
                      <li className="flex gap-2 items-start">
                        <ArrowDownRight className="h-4 w-4 text-red-500 mt-0.5" />
                        <span>
                          Review underperforming campaigns and consider redistributing budget to higher performers
                        </span>
                      </li>
                    </ul>
                  </div>
            </CardContent>
          </Card>
            </div>
        </TabsContent>
      </Tabs>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center p-12 text-center">
            <div className="max-w-md">
              <h3 className="text-lg font-medium mb-2">No Data Available</h3>
              <p className="text-muted-foreground">
                No data is available for the selected accounts. Please make sure your accounts are properly connected and contain campaigns.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 