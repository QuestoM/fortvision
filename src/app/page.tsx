import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  BarChart3, 
  LineChart, 
  PieChart, 
  TrendingUp,
  MousePointerClick,
  Users,
  DollarSign,
  BarChart,
  Eye,
  Target,
  Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <Header />

      {/* Hero Section - Asymmetric Design */}
      <section className="relative pt-28 pb-24 overflow-hidden border-b border-gray-200 dark:border-gray-800">
        <div className="absolute inset-0 overflow-hidden z-0">
          {/* Google brand color shapes */}
          <div className="absolute top-10 right-[10%] w-64 h-64 rounded-full bg-blue-500/10 dark:bg-blue-500/5"></div>
          <div className="absolute top-40 right-[20%] w-32 h-32 rounded-full bg-red-500/10 dark:bg-red-500/5"></div>
          <div className="absolute bottom-20 right-[15%] w-48 h-48 rounded-full bg-yellow-400/10 dark:bg-yellow-400/5"></div>
          <div className="absolute bottom-40 right-[25%] w-24 h-24 rounded-full bg-green-500/10 dark:bg-green-500/5"></div>
          
          {/* Facebook brand color shapes */}
          <div className="absolute top-20 left-[5%] w-52 h-52 rounded-full bg-[#1877F2]/10 dark:bg-[#1877F2]/5"></div>
          <div className="absolute bottom-10 left-[15%] w-40 h-40 rounded-full bg-[#1877F2]/5 dark:bg-[#1877F2]/5"></div>
        </div>

        <div className="container relative mx-auto px-4 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center mb-6 px-3 py-1 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex space-x-1">
                  <span className="h-2 w-2 rounded-full bg-[#4285F4]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#EA4335]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#FBBC05]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#34A853]"></span>
                  <span className="h-2 w-2 rounded-full bg-[#1877F2] ml-1"></span>
                </div>
                <span className="text-sm font-medium ml-3 text-gray-800 dark:text-gray-200">Advertising Analytics Platform</span>
            </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Manage <span className="text-google-gradient">Google</span> and <span className="text-facebook-gradient">Facebook</span> Ads in One Platform
            </h1>
              
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl">
                All the data, metrics, and insights needed to optimize your advertising campaigns, centralized in one place.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center sm:items-start bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-2">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold">8.7M</p>
                  <p className="text-sm text-gray-500">Impressions</p>
                </div>
                
                <div className="flex flex-col items-center sm:items-start bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-2">
                    <MousePointerClick className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-2xl font-bold">342K</p>
                  <p className="text-sm text-gray-500">Clicks</p>
                </div>
                
                <div className="flex flex-col items-center sm:items-start bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-2xl font-bold">1.8x</p>
                  <p className="text-sm text-gray-500">ROI</p>
                </div>
            </div>
              
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="bg-[#4285F4] hover:bg-[#3367d6] text-white">
                    View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
                <Link href="/sign-up">
                  <Button size="lg" variant="outline" className="border-[#1877F2] text-[#1877F2] hover:bg-[#1877F2]/10">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-5 relative">
              <div className="relative">
                {/* Main screenshot with Google branding */}
                <div className="absolute -top-4 -right-4 h-12 w-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg z-20 border-2 border-[#4285F4]">
                  <div className="flex">
                    <div className="h-2 w-2 rounded-full bg-[#4285F4] mx-0.5"></div>
                    <div className="h-2 w-2 rounded-full bg-[#EA4335] mx-0.5"></div>
                    <div className="h-2 w-2 rounded-full bg-[#FBBC05] mx-0.5"></div>
                    <div className="h-2 w-2 rounded-full bg-[#34A853] mx-0.5"></div>
          </div>
              </div>
              
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 aspect-[4/3] transform">
                <Image 
                    src="https://i.imgur.com/uZshILa.png" 
                    alt="Google Ads Dashboard" 
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4285F4]/30 to-transparent"></div>
                  
                  {/* Floating Analytics Card */}
                  <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-[180px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-[#4285F4]" />
                      <div className="text-xs font-semibold">Campaign Performance</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">CTR</span>
                        <span className="font-medium">4.2%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">CPC</span>
                        <span className="font-medium">$1.24</span>
                      </div>
                    </div>
                  </div>
              </div>
              
                {/* Facebook screenshot overlay */}
                <div className="absolute -bottom-8 -left-8 h-12 w-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg z-20 border-2 border-[#1877F2]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
              </div>

                <div className="absolute -bottom-12 left-10 w-3/4 h-40 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 transform">
                  <Image 
                    src="https://i.imgur.com/RGCVhDg.jpg" 
                    alt="Facebook Ads Dashboard" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1877F2]/30 to-transparent"></div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section - Split with Visual Emphasis */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Smarter Campaign Management with Advanced Integration</h2>
            <p className="text-gray-600 dark:text-gray-400">A system that connects leading advertising platforms and provides real-time analytical insights</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Google Ads Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex flex-shrink-0">
                  <span className="h-3 w-3 rounded-full bg-[#4285F4]"></span>
                  <span className="h-3 w-3 rounded-full bg-[#EA4335] -ml-1"></span>
                  <span className="h-3 w-3 rounded-full bg-[#FBBC05] -ml-1"></span>
                  <span className="h-3 w-3 rounded-full bg-[#34A853] -ml-1"></span>
                </div>
                <h3 className="text-2xl font-bold">Google Ads</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#4285F4]/10 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-[#4285F4]"/>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Comprehensive Campaign Analysis</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track campaign performance, ad groups, and keywords</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#EA4335]/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-[#EA4335]"/>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Key Performance Indicators</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">CTR, CPC, quality score, and conversion rates in one dashboard</p>
          </div>
        </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#FBBC05]/10 rounded-lg flex items-center justify-center">
                    <LineChart className="h-5 w-5 text-[#FBBC05]"/>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Trend Reports Over Time</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Compare historical performance and identify growth opportunities</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/dashboard?platform=google">
                  <Button className="bg-[#4285F4] hover:bg-[#3367d6] text-white">View Google Ads Data</Button>
                </Link>
              </div>
            </div>
            
            {/* Facebook Ads Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Facebook Ads</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#1877F2]/10 rounded-lg flex items-center justify-center">
                    <Megaphone className="h-5 w-5 text-[#1877F2]"/>
            </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ad Management and Strategy</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Track performance of campaigns, ad sets, and creative assets</p>
          </div>
        </div>
        
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#1877F2]/10 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-[#1877F2]"/>
            </div>
                  <div>
                    <h4 className="font-semibold mb-1">Advanced Audience Segmentation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Analyze audience performance and detailed demographic data</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#1877F2]/10 rounded-lg flex items-center justify-center">
                    <PieChart className="h-5 w-5 text-[#1877F2]"/>
              </div>
                  <div>
                    <h4 className="font-semibold mb-1">Placement Effectiveness</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Deep understanding of ad performance in feed, stories, and other placements</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/dashboard?platform=facebook">
                  <Button className="bg-[#1877F2] hover:bg-[#166fe5] text-white">View Facebook Ads Data</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Platform Analysis Section - Full Width Gradient */}
      <section className="py-16 bg-gradient-to-r from-[#4285F4]/10 via-[#FBBC05]/10 to-[#1877F2]/10 dark:from-[#4285F4]/5 dark:via-[#FBBC05]/5 dark:to-[#1877F2]/5 border-y border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unified Analysis and Comprehensive View</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Simple comparison between campaign performance across platforms for smarter decision-making
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="p-5 bg-gradient-to-r from-[#4285F4] to-[#34A853] text-white">
                  <h3 className="text-xl font-bold mb-2">Cross-Platform Comparison</h3>
                  <p className="text-sm opacity-90">Parallel analysis of campaign performance in Google and Facebook</p>
              </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#4285F4]"></div>
                      <span className="text-sm">Track key metrics across all platforms</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#1877F2]"></div>
                      <span className="text-sm">ROI reports and cost-benefit comparison</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#EA4335]"></div>
                      <span className="text-sm">Conversion attribution and channel contribution</span>
                    </li>
                  </ul>
            </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="p-5 bg-gradient-to-r from-[#EA4335] to-[#FBBC05] text-white">
                  <h3 className="text-xl font-bold mb-2">Alerts and Performance Threshold</h3>
                  <p className="text-sm opacity-90">Smart alert system to identify issues and anomalies</p>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#EA4335]"></div>
                      <span className="text-sm">Detection of sudden performance changes</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#FBBC05]"></div>
                      <span className="text-sm">Budget alerts and spend monitoring</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#34A853]"></div>
                      <span className="text-sm">Recommendations for improvement and optimization</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="p-5 bg-gradient-to-r from-[#1877F2] to-[#1DA1F2] text-white">
                  <h3 className="text-xl font-bold mb-2">Data Export and Sharing</h3>
                  <p className="text-sm opacity-90">Advanced options for report generation and sharing</p>
              </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#1877F2]"></div>
                      <span className="text-sm">Export data in various formats (CSV, PDF)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#1DA1F2]"></div>
                      <span className="text-sm">Share reports with team members</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-[#4285F4]"></div>
                      <span className="text-sm">Schedule automated reports by day and time</span>
                    </li>
                  </ul>
            </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark Bar */}
      <section className="py-10 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold">Ready to analyze your campaigns?</h2>
              <p className="text-gray-300 mt-2">Connect your Google Ads and Facebook Ads accounts today</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  Open Free Account
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer - Brand Consistent */}
      <footer className="py-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden">
                <div className="flex">
                  <div className="h-8 w-2 bg-[#4285F4]"></div>
                  <div className="h-8 w-2 bg-[#EA4335]"></div>
                  <div className="h-8 w-2 bg-[#FBBC05]"></div>
                  <div className="h-8 w-2 bg-[#34A853]"></div>
                </div>
              </div>
              <span className="text-lg font-bold">Ad Analytics</span>
            </div>
            
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} Ad Analytics Dashboard. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
