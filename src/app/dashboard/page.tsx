'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  MousePointerClick, 
  DollarSign, 
  TrendingUp, 
  Download
} from 'lucide-react';
import AdAccountSelector from '@/components/dashboard/AdAccountSelector';
import DateRangeSelector from '@/components/dashboard/DateRangeSelector';
import CampaignCard from '@/components/dashboard/CampaignCard';
import { useRouter } from 'next/navigation';

// Dashboard overview stats card
function StatsCard({ 
  title, 
  value, 
  icon, 
  change, 
  isLoading 
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode;
  change?: {value: number; label: string};
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <p className={`text-xs ${change.value > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change.value > 0 ? '+' : ''}{change.value}% {change.label}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [platform, setPlatform] = useState<'google' | 'facebook'>('google');
  const [accountId, setAccountId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ preset: 'last_30_days' });
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [stats, setStats] = useState({
    impressions: 0,
    clicks: 0,
    spend: 0,
    ctr: 0
  });
  
  const router = useRouter();
  
  // Handle account selection
  const handleAccountSelect = async (selectedAccountId: string) => {
    setAccountId(selectedAccountId);
    
    if (selectedAccountId) {
      await fetchCampaignData(selectedAccountId, platform, dateRange.preset);
    }
  };
  
  // Handle date range change
  const handleDateRangeChange = async (range: { preset: string; from?: Date; to?: Date }) => {
    setDateRange(range);
    
    if (accountId) {
      await fetchCampaignData(accountId, platform, range.preset);
    }
  };
  
  // Fetch campaign data from API
  const fetchCampaignData = async (
    accountId: string, 
    platform: 'google' | 'facebook', 
    datePreset: string
  ) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/${platform}-ads?accountId=${accountId}&datePreset=${datePreset}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle platform-specific data structures
      if (platform === 'google') {
        setCampaigns(data.campaigns || []);
        
        // Calculate aggregate stats
        const totalStats = (data.campaigns || []).reduce((acc: any, campaign: any) => {
          acc.impressions += parseInt(campaign.metrics?.impressions || 0);
          acc.clicks += parseInt(campaign.metrics?.clicks || 0);
          acc.spend += parseInt(campaign.metrics?.cost_micros || 0) / 1000000;
          return acc;
        }, { impressions: 0, clicks: 0, spend: 0 });
        
        totalStats.ctr = totalStats.impressions > 0 ? 
          (totalStats.clicks / totalStats.impressions) : 0;
        
        setStats(totalStats);
      } else {
        // Handle Facebook data
        setCampaigns(data.campaigns || []);
        setInsights(data.insights || []);
        
        // Calculate aggregate stats from insights
        const totalStats = (data.insights || []).reduce((acc: any, insight: any) => {
          acc.impressions += parseInt(insight.impressions || 0);
          acc.clicks += parseInt(insight.clicks || 0);
          acc.spend += parseFloat(insight.spend || 0);
          return acc;
        }, { impressions: 0, clicks: 0, spend: 0 });
        
        totalStats.ctr = totalStats.impressions > 0 ? 
          (totalStats.clicks / totalStats.impressions) : 0;
        
        setStats(totalStats);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format numbers for display
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };
  
  // Handle platform change
  const handlePlatformChange = (value: string) => {
    setPlatform(value as 'google' | 'facebook');
    setCampaigns([]);
    setInsights([]);
    setStats({
      impressions: 0,
      clicks: 0,
      spend: 0,
      ctr: 0
    });
    
    // Reset account ID
    setAccountId(null);
  };
  
  // Handle export data
  const handleExportData = () => {
    if (!campaigns.length) return;
    
    const formatDataForCsv = () => {
      // Create header row
      let csvContent = 'Campaign Name,Status,Impressions,Clicks,Spend,CTR(%)\n';
      
      // Add data rows
      campaigns.forEach((campaign) => {
        const insight = platform === 'facebook' 
          ? insights.find((i) => i.campaign_id === campaign.id)
          : null;
        
        const impressions = platform === 'facebook' 
          ? (insight?.impressions || 0) 
          : (campaign.metrics?.impressions || 0);
          
        const clicks = platform === 'facebook'
          ? (insight?.clicks || 0)
          : (campaign.metrics?.clicks || 0);
          
        const spend = platform === 'facebook'
          ? (insight?.spend || 0)
          : ((campaign.metrics?.cost_micros || 0) / 1000000);
          
        const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
        
        csvContent += `"${campaign.name}","${campaign.status}",${impressions},${clicks},${spend},${ctr}\n`;
      });
      
      return csvContent;
    };
    
    // Create CSV blob
    const csvData = formatDataForCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${platform}-campaigns-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
  };
  
  // Find campaign insight (for Facebook)
  const findCampaignInsight = (campaignId: string) => {
    return insights.find(insight => insight.campaign_id === campaignId);
  };

  return (
    <div className="space-y-4 p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Ad Campaigns Dashboard</h1>
      
      <Tabs defaultValue="google" onValueChange={handlePlatformChange}>
        <TabsList>
          <TabsTrigger value="google">Google Ads</TabsTrigger>
          <TabsTrigger value="facebook">Facebook Ads</TabsTrigger>
        </TabsList>
        
        <TabsContent value="google" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <AdAccountSelector 
              platform="google" 
              onSelect={handleAccountSelect}
            />
            
            {accountId && (
              <div className="flex flex-col sm:flex-row gap-2">
                <DateRangeSelector onChange={handleDateRangeChange} />
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleExportData}
                  disabled={!campaigns.length}
                  title="Export to CSV"
                >
                  <Download className="h-4 w-4" />
                  </Button>
              </div>
            )}
          </div>
          
          {accountId ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                  title="Impressions" 
                  value={formatNumber(stats.impressions)}
                  icon={<Eye className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoading}
                />
                <StatsCard 
                  title="Clicks" 
                  value={formatNumber(stats.clicks)}
                  icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoading}
                />
                <StatsCard 
                  title="Spend" 
                  value={`$${stats.spend.toFixed(2)}`}
                  icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoading}
                />
                <StatsCard 
                  title="CTR" 
                  value={`${(stats.ctr * 100).toFixed(2)}%`}
                  icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoading}
                />
              </div>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">Active Campaigns</h2>
              
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-48 animate-pulse bg-muted/50" />
                  ))}
                </div>
              ) : campaigns.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {campaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={{
                        id: campaign.id,
                        name: campaign.name,
                        status: campaign.status
                      }}
                      insight={{
                        campaign_id: campaign.id,
                        impressions: parseInt(campaign.metrics?.impressions || 0),
                        clicks: parseInt(campaign.metrics?.clicks || 0),
                        spend: parseInt(campaign.metrics?.cost_micros || 0) / 1000000,
                        conversions: parseInt(campaign.metrics?.conversions || 0)
                      }}
                      platform="google"
                      accountId={accountId}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="text-center text-muted-foreground mb-4">
                      No campaigns found for this account.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/settings/accounts?platform=google')}
                    >
                      Manage Accounts
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-muted-foreground mb-4">
                  Please select a Google Ads account to view your campaigns.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/settings/accounts?platform=google')}
                >
                  Connect New Account
                </Button>
        </CardContent>
      </Card>
          )}
        </TabsContent>
        
        <TabsContent value="facebook" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <AdAccountSelector 
              platform="facebook" 
              onSelect={handleAccountSelect}
            />
            
            {accountId && (
              <div className="flex flex-col sm:flex-row gap-2">
                <DateRangeSelector onChange={handleDateRangeChange} />
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleExportData}
                  disabled={!campaigns.length}
                  title="Export to CSV"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            )}
              </div>
          
          {accountId ? (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard 
                  title="Impressions" 
                  value={formatNumber(stats.impressions)}
                  icon={<Eye className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoading}
                />
                <StatsCard 
                  title="Clicks" 
                  value={formatNumber(stats.clicks)}
                  icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoading}
                />
                <StatsCard 
                  title="Spend" 
                  value={`$${stats.spend.toFixed(2)}`}
                  icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoading}
                />
                <StatsCard 
                  title="CTR" 
                  value={`${(stats.ctr * 100).toFixed(2)}%`}
                  icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                  isLoading={isLoading}
                />
              </div>
              
              <h2 className="text-xl font-semibold mt-6 mb-4">Active Campaigns</h2>
              
              {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-48 animate-pulse bg-muted/50" />
                  ))}
            </div>
              ) : campaigns.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {campaigns.map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={{
                        id: campaign.id,
                        name: campaign.name,
                        status: campaign.status
                      }}
                      insight={findCampaignInsight(campaign.id)}
                      platform="facebook"
                      accountId={accountId}
                    />
                  ))}
              </div>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <p className="text-center text-muted-foreground mb-4">
                      No campaigns found for this account.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/settings/accounts?platform=facebook')}
                    >
                      Manage Accounts
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-center text-muted-foreground mb-4">
                  Please select a Facebook Ads account to view your campaigns.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/settings/accounts?platform=facebook')}
                >
                  Connect New Account
            </Button>
          </CardContent>
        </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 