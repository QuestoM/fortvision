'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp,
  DollarSign,
  MousePointerClick,
  Eye
} from 'lucide-react';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  status: string;
}

interface CampaignInsight {
  campaign_id: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  ctr?: number;
  cpc?: number;
}

interface CampaignCardProps {
  campaign: Campaign;
  insight?: CampaignInsight;
  platform: 'google' | 'facebook';
  accountId: string;
}

export default function CampaignCard({ 
  campaign, 
  insight, 
  platform,
  accountId
}: CampaignCardProps) {
  // Format metrics for display
  const formatNumber = (num: number = 0): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };
  
  const formatCurrency = (amount: number = 0): string => {
    return `$${amount.toFixed(2)}`;
  };
  
  const formatPercentage = (num: number = 0): string => {
    return `${(num * 100).toFixed(2)}%`;
  };
  
  // Determine status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'enabled':
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'paused':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'removed':
      case 'disabled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4 bg-primary/5">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={getStatusColor(campaign.status)}>
              {campaign.status}
            </Badge>
            <CardTitle className="mt-2 text-base truncate" title={campaign.name}>
              {campaign.name}
            </CardTitle>
          </div>
          <Link
            href={`/dashboard/${platform}/${accountId}/${campaign.id}`}
            className="text-sm text-muted-foreground hover:text-primary flex items-center"
          >
            <BarChart className="h-4 w-4 mr-1" />
            <span>Details</span>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center">
            <Eye className="h-3 w-3 mr-1" />
            Impressions
          </span>
          <span className="text-xl font-bold">
            {formatNumber(insight?.impressions || 0)}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center">
            <MousePointerClick className="h-3 w-3 mr-1" />
            Clicks
          </span>
          <span className="text-xl font-bold">
            {formatNumber(insight?.clicks || 0)}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center">
            <DollarSign className="h-3 w-3 mr-1" />
            Spend
          </span>
          <span className="text-xl font-bold">
            {formatCurrency(insight?.spend || 0)}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            CTR
          </span>
          <span className="text-xl font-bold">
            {formatPercentage(insight?.ctr || (insight?.clicks && insight?.impressions ? insight.clicks / insight.impressions : 0))}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 