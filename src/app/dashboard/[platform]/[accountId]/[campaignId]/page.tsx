'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  LineChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Sector
} from 'recharts';
import { 
  ArrowLeft, 
  Download, 
  Eye, 
  MousePointerClick, 
  DollarSign, 
  TrendingUp,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import DateRangeSelector from '@/components/dashboard/DateRangeSelector';

// Colors for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28'];

export default function CampaignDetailPage({ 
  params 
}: { 
  params: { platform: string; accountId: string; campaignId: string } 
}) {
  const { platform, accountId, campaignId } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [dateRange, setDateRange] = useState({ preset: 'last_30_days' });
  const [activeTab, setActiveTab] = useState('overview');
  
  const router = useRouter();
  
  useEffect(() => {
    fetchCampaignData();
  }, [dateRange]);
  
  const fetchCampaignData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `/api/${platform}-ads?accountId=${accountId}&campaignId=${campaignId}&datePreset=${dateRange.preset}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch campaign data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setCampaignData(data);
    } catch (error: any) {
      console.error('Error fetching campaign data:', error);
      setError(error.message || 'Failed to load campaign data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateRangeChange = (range: { preset: string; from?: Date; to?: Date }) => {
    setDateRange(range);
  };
  
  // Helper function to format numbers
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };
  
  // Helper function to format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };
  
  // Prepare data for daily chart
  const getDailyChartData = () => {
    if (!campaignData) return [];
    
    // For Google Ads
    if (platform === 'google' && campaignData.performanceByDate) {
      return campaignData.performanceByDate.map((item: any) => ({
        date: item.segments?.date,
        impressions: parseInt(item.metrics?.impressions || 0),
        clicks: parseInt(item.metrics?.clicks || 0),
        cost: parseInt(item.metrics?.cost_micros || 0) / 1000000,
      }));
    }
    
    // For Facebook Ads
    if (platform === 'facebook' && campaignData.dailyInsights) {
      return campaignData.dailyInsights.map((item: any) => ({
        date: item.date_start,
        impressions: parseInt(item.impressions || 0),
        clicks: parseInt(item.clicks || 0),
        cost: parseFloat(item.spend || 0),
      }));
    }
    
    return [];
  };
  
  // Prepare data for ad group / ad set chart
  const getAdGroupData = () => {
    if (!campaignData) return [];
    
    // For Google Ads
    if (platform === 'google' && campaignData.adGroups) {
      return campaignData.adGroups.map((item: any) => ({
        name: item.ad_group?.name,
        impressions: parseInt(item.metrics?.impressions || 0),
        clicks: parseInt(item.metrics?.clicks || 0),
        cost: parseInt(item.metrics?.cost_micros || 0) / 1000000,
        ctr: parseFloat(item.metrics?.ctr || 0),
      }));
    }
    
    // For Facebook Ads
    if (platform === 'facebook' && campaignData.adSetInsights) {
      return campaignData.adSetInsights.map((item: any) => ({
        name: item.adset_name,
        impressions: parseInt(item.impressions || 0),
        clicks: parseInt(item.clicks || 0),
        cost: parseFloat(item.spend || 0),
        ctr: parseFloat(item.ctr || 0),
      }));
    }
    
    return [];
  };
  
  // Get demographic data for Facebook
  const getDemographicData = () => {
    if (!campaignData || platform !== 'facebook' || !campaignData.demographics) {
      return [];
    }
    
    const demographicMap = new Map();
    
    campaignData.demographics.forEach((item: any) => {
      const key = `${item.age} - ${item.gender}`;
      demographicMap.set(key, {
        name: key,
        value: parseInt(item.impressions || 0),
      });
    });
    
    return Array.from(demographicMap.values());
  };
  
  // Format campaign metrics based on platform
  const getCampaignMetrics = () => {
    if (!campaignData) return null;
    
    if (platform === 'google' && campaignData.campaignDetails) {
      const details = campaignData.campaignDetails[0];
      return {
        name: details.campaign?.name,
        status: details.campaign?.status,
        impressions: parseInt(details.metrics?.impressions || 0),
        clicks: parseInt(details.metrics?.clicks || 0),
        cost: parseInt(details.metrics?.cost_micros || 0) / 1000000,
        conversions: parseFloat(details.metrics?.conversions || 0),
        ctr: parseFloat(details.metrics?.ctr || 0),
        cpc: parseInt(details.metrics?.average_cpc || 0) / 1000000,
        conversionRate: parseFloat(details.metrics?.cost_per_conversion || 0) / 1000000,
      };
    }
    
    if (platform === 'facebook') {
      const campaign = campaignData.campaign || {};
      const insight = campaignData.insights && campaignData.insights[0] ? campaignData.insights[0] : {};
      
      return {
        name: campaign.name,
        status: campaign.status,
        impressions: parseInt(insight.impressions || 0),
        clicks: parseInt(insight.clicks || 0),
        cost: parseFloat(insight.spend || 0),
        conversions: parseFloat(insight.conversions || 0),
        ctr: parseFloat(insight.ctr || 0),
        cpc: parseFloat(insight.cpc || 0),
        conversionRate: 0, // Facebook doesn't directly provide this
      };
    }
    
    return null;
  };
  
  const metrics = getCampaignMetrics();
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2 -ml-2"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
          <h1 className="text-2xl font-bold">
            {metrics?.name || 'Campaign Details'}
          </h1>
          <p className="text-muted-foreground">
            {platform === 'google' ? 'Google Ads' : 'Facebook Ads'} Campaign
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <DateRangeSelector onChange={handleDateRangeChange} defaultPreset={dateRange.preset} />
          
          <Button variant="outline" size="icon" title="Export Data">
            <Download className="h-4 w-4" />
          </Button>
        </div>
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
      ) : metrics ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(metrics.impressions)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Clicks</CardTitle>
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(metrics.clicks)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Spend</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(metrics.cost)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">CTR</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(metrics.ctr)}</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="daily">Daily Performance</TabsTrigger>
              <TabsTrigger value="adgroups">
                {platform === 'google' ? 'Ad Groups' : 'Ad Sets'}
              </TabsTrigger>
              {platform === 'facebook' && (
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Details</CardTitle>
                  <CardDescription>
                    Detailed information about the campaign
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Campaign ID</p>
                      <p className="text-sm text-muted-foreground">{campaignId}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Status</p>
                      <p className="text-sm text-muted-foreground capitalize">{metrics.status}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Platform</p>
                      <p className="text-sm text-muted-foreground capitalize">{platform}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">CPC</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(metrics.cpc)}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Conversions</p>
                      <p className="text-sm text-muted-foreground">{metrics.conversions}</p>
                    </div>
                    
                    {metrics.conversionRate > 0 && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Cost Per Conversion</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(metrics.conversionRate)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Clicks vs. Impressions</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getDailyChartData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="impressions" fill="#8884d8" name="Impressions" />
                        <Bar yAxisId="right" dataKey="clicks" fill="#82ca9d" name="Clicks" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Spend Over Time</CardTitle>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getDailyChartData()}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${formatCurrency(value as number)}`, 'Spend']} />
                        <Legend />
                        <Line type="monotone" dataKey="cost" stroke="#ff7300" name="Spend" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="daily" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Performance</CardTitle>
                  <CardDescription>
                    Track how your campaign performed over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getDailyChartData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressions" />
                      <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                      <Line yAxisId="right" type="monotone" dataKey="cost" stroke="#ff7300" name="Spend" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="adgroups" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {platform === 'google' ? 'Ad Groups' : 'Ad Sets'} Performance
                  </CardTitle>
                  <CardDescription>
                    Compare performance across different {platform === 'google' ? 'ad groups' : 'ad sets'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={getAdGroupData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="impressions" fill="#8884d8" name="Impressions" />
                      <Bar dataKey="clicks" fill="#82ca9d" name="Clicks" />
                      <Bar dataKey="cost" fill="#ff7300" name="Spend" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            {platform === 'facebook' && (
              <TabsContent value="demographics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Demographic Distribution</CardTitle>
                    <CardDescription>
                      Age and gender breakdown of your audience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getDemographicData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {getDemographicData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <p className="text-muted-foreground">No campaign data found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 