'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  PlusCircle, 
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';

// Declare global window interface extension
declare global {
  interface Window {
    isFacebookInitialized?: boolean;
    FB?: any;
    fbAppId?: string;
    fbAsyncInit?: Function;
  }
}

// Google Ads form component
function GoogleAdsForm({ onRefresh }: { onRefresh: () => void }) {
  const [accountId, setAccountId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!accountId || !accountName || !refreshToken) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/google-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId,
          accountName,
          refreshToken,
          isDefault: true
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect Google Ads account');
      }
      
      toast.success('Google Ads account connected successfully');
      onRefresh();
      
      // Clear the form
      setAccountId('');
      setAccountName('');
      setRefreshToken('');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to connect Google Ads account';
      console.error('Google connection error:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="accountId">Account ID</Label>
        <Input
          id="accountId"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="e.g. 123-456-7890"
          required
        />
        <p className="text-xs text-muted-foreground">
          Your Google Ads customer ID (in the format 123-456-7890)
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="accountName">Account Name</Label>
        <Input
          id="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="e.g. My Google Ads Account"
          required
        />
        <p className="text-xs text-muted-foreground">
          A descriptive name for this account
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="refreshToken">Refresh Token</Label>
        <Input
          id="refreshToken"
          value={refreshToken}
          onChange={(e) => setRefreshToken(e.target.value)}
          type="password"
          placeholder="OAuth refresh token"
          required
        />
        <p className="text-xs text-muted-foreground">
          The OAuth refresh token for your Google Ads account. 
          <a 
            href="https://developers.google.com/google-ads/api/docs/oauth/overview" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline ml-1"
          >
            Learn how to get a token
          </a>
        </p>
      </div>
      
      <Button type="submit" disabled={loading} className="w-full bg-[#4285F4] hover:bg-[#3b77db] text-white">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Connect Google Ads Account
      </Button>
    </form>
  );
}

// Facebook Ads form component
function FacebookAdsForm({ onRefresh }: { onRefresh: () => void }) {
  const [accountId, setAccountId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [sdkLoading, setSdkLoading] = useState(true);
  const [formStep, setFormStep] = useState<'login' | 'details' | 'token'>('login');
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [facebookAppId, setFacebookAppId] = useState<string>('');
  
  // Load the Facebook SDK
  useEffect(() => {
    const loadFacebookSDK = () => {
      setSdkLoading(true);
      
      // Direct approach with the ID from .env.local
      const FACEBOOK_APP_ID = '274455496241026'; // Hardcoded from your .env.local
      
      (window as any).fbAsyncInit = function() {
        try {
          console.log("Initializing Facebook SDK with App ID:", FACEBOOK_APP_ID);
          
          (window as any).FB.init({
            appId: FACEBOOK_APP_ID,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
          
          // Set a flag when FB is initialized
          (window as any).isFacebookInitialized = true;
          console.log("Facebook SDK initialized successfully");
          setSdkLoading(false);
        } catch (error) {
          console.error("Error initializing Facebook SDK:", error);
          setError("Error initializing Facebook SDK. Please try again later.");
          setSdkLoading(false);
        }
      };

      // Load the Facebook SDK asynchronously
      (function(d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0] as HTMLElement;
        if (d.getElementById(id)) return;
        js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode?.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
      
      // Set a timeout to check if the SDK loaded properly
      setTimeout(() => {
        if (!(window as any).isFacebookInitialized) {
          console.warn("Facebook SDK initialization timed out");
          setSdkLoading(false);
        }
      }, 5000);
    };

    loadFacebookSDK();
  }, []);
  
  // Handle Facebook login
  const handleFacebookLogin = () => {
    setError(null);
    setLoading(true);
    
    // Check if FB is initialized
    if (!(window as any).FB || !(window as any).isFacebookInitialized) {
      console.error("Facebook SDK not initialized yet");
      setError("Facebook SDK not initialized yet. Please try again in a moment.");
      setLoading(false);
      return;
    }
    
    try {
      console.log("Attempting Facebook login with permissions:", 'ads_management,ads_read,public_profile,email,business_management');
      
      // Setup a timeout to detect if Facebook login is taking too long
      const loginTimeout = setTimeout(() => {
        if (loading) {
          console.warn("Facebook login timed out");
          setError("Facebook login request timed out. This may happen if pop-ups are blocked. Please check your browser settings and try again.");
          setLoading(false);
        }
      }, 20000); // 20 second timeout
      
      (window as any).FB.login(
        (response: any) => {
          clearTimeout(loginTimeout);
          console.log("Facebook login response:", response);
          
          if (response.status === 'connected') {
            // Get short-lived access token
            const shortLivedToken = response.authResponse.accessToken;
            console.log("Facebook login successful, token received");
            
            // Exchange for long-lived token
            exchangeToken(shortLivedToken);
          } else if (response.status === 'not_authorized') {
            setLoading(false);
            setError('App permissions not granted. You need to authorize the app to access your ads accounts.');
            console.error('Facebook login - not authorized:', response);
          } else {
            setLoading(false);
            setError('Facebook login was canceled or failed. Please try again.');
            console.error('Facebook login failed:', response);
          }
        },
        { scope: 'ads_management,ads_read,public_profile,email,business_management' }
      );
    } catch (err) {
      console.error('Facebook SDK error:', err);
      setLoading(false);
      setError('Failed to initialize Facebook login. Please ensure you are using HTTPS or localhost and try again.');
    }
  };
  
  // Exchange short-lived token for long-lived token
  const exchangeToken = async (shortLivedToken: string) => {
    try {
      console.log("Exchanging short-lived token for long-lived token");
      // In a production app, you would typically do this server-side
      // For now, we'll use the short-lived token directly
      setAccessToken(shortLivedToken);
      
      // Fetch ad accounts
      fetchAdAccounts(shortLivedToken);
    } catch (err) {
      console.error('Error exchanging token:', err);
      setLoading(false);
      setError('Failed to get a long-lived access token. Please try again.');
    }
  };
  
  // Fetch ad accounts using the token
  const fetchAdAccounts = async (token: string) => {
    try {
      console.log("Fetching Facebook ad accounts");
      
      // Make a direct Graph API call to get accounts
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me/adaccounts?fields=id,name,account_id,account_status&access_token=${token}`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch accounts: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Facebook ad accounts response:", data);
      
      if (data.data && data.data.length > 0) {
        setAccounts(data.data);
        setFormStep('details');
      } else {
        setError('No Facebook Ad accounts found. Make sure you have access to a Facebook Ad account.');
        console.warn('No Facebook ad accounts found in response:', data);
      }
    } catch (err) {
      console.error('Error fetching ad accounts:', err);
      setError('Failed to fetch Facebook Ad accounts. Check your permissions and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account selection
  const handleAccountSelect = (account: any) => {
    setSelectedAccount(account);
    setAccountId(account.account_id);
    setAccountName(account.name);
    
    // Auto-advance to token step when an account is selected
    setFormStep('token');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!accountId || !accountName || !accessToken) {
      toast.error('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/facebook-ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId,
          accountName,
          accessToken,
          isDefault: true
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to connect Facebook Ads account');
      }
      
      toast.success('Facebook Ads account connected successfully');
      onRefresh();
      
      // Clear the form
      setAccountId('');
      setAccountName('');
      setAccessToken('');
      setFormStep('login');
      setSelectedAccount(null);
      setAccounts([]);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to connect Facebook Ads account';
      console.error('Facebook connection error:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  if (formStep === 'login') {
    return (
      <div className="space-y-4">
        {error && (
          <div className="p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-800">
            {error}
          </div>
        )}
        
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="text-sm font-medium mb-2">Steps to connect your Facebook Ad Account:</h3>
          <ol className="list-decimal pl-5 text-sm space-y-1 text-gray-600">
            <li>Click the "Login with Facebook" button below</li>
            <li>Allow the necessary permissions</li>
            <li>Select your ad account</li>
            <li>Complete the connection</li>
          </ol>
        </div>
        
        {sdkLoading ? (
          <Button 
            type="button"
            disabled={true}
            className="w-full flex items-center justify-center gap-2 bg-gray-400 text-white cursor-not-allowed"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading Facebook SDK...
          </Button>
        ) : (
          <Button 
            type="button"
            onClick={handleFacebookLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <img src="/facebook.svg" alt="Facebook Logo" className="w-5 h-5 mr-2" />
            )}
            Login with Facebook
          </Button>
        )}
        
        {(!sdkLoading && !(window as any).isFacebookInitialized) && (
          <div className="p-4 mt-2 text-sm bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
            <p className="font-medium mb-2">Facebook SDK could not be loaded. Common troubleshooting steps:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Make sure you're on a secure connection (HTTPS or localhost)</li>
              <li>Check if your browser is blocking third-party cookies or scripts</li>
              <li>Try disabling ad-blockers or privacy extensions temporarily</li>
              <li>If using a popup blocker, allow popups for this site</li>
              <li>Try a different browser if the issue persists</li>
            </ul>
            <p className="mt-2">You're trying to connect with Facebook App ID: 274455496241026</p>
          </div>
        )}
      </div>
    );
  }
  
  if (formStep === 'details') {
    return (
      <div className="space-y-4">
        {error && (
          <div className="p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-800">
            {error}
          </div>
        )}
        
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-100 dark:border-blue-900">
          <h3 className="text-sm font-medium mb-3 text-blue-800 dark:text-blue-300">Select a Facebook Ad Account</h3>
          
          {accounts.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-sm text-gray-500">
                No ad accounts found for your Facebook user
              </p>
              <Button 
                className="mt-2"
                variant="outline"
                onClick={() => setFormStep('login')}
              >
                Go Back
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {accounts.map((account) => (
                <div 
                  key={account.id}
                  className={`p-3 border rounded-md cursor-pointer transition-all ${
                    selectedAccount?.id === account.id 
                      ? 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700' 
                      : 'bg-white hover:bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleAccountSelect(account)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{account.name}</div>
                      <div className="text-xs text-gray-500">ID: {account.account_id}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      selectedAccount?.id === account.id ? 'bg-blue-600' : 'border border-gray-300'
                    }`}>
                      {selectedAccount?.id === account.id && (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setFormStep('login')}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="button"
            disabled={!selectedAccount || loading}
            onClick={() => setFormStep('token')}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm bg-red-50 border border-red-200 rounded-md text-red-800">
          {error}
        </div>
      )}
      
      {selectedAccount && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
          <p className="text-sm font-medium">Selected Account:</p>
          <p className="text-sm">{selectedAccount.name} (ID: {selectedAccount.account_id})</p>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="fbAccessToken">Access Token</Label>
        <Input
          id="fbAccessToken"
          type="password"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          Your Facebook access token has been automatically generated when you logged in.
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => setFormStep('details')} className="flex-1">
          Back
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 bg-[#1877F2] hover:bg-[#166FE5] text-white">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Connect Facebook Account
        </Button>
      </div>
    </form>
  );
}

export default function AccountsPage() {
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');
  const defaultTab = platform === 'facebook' ? 'facebook' : 'google';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabTransitioning, setTabTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGoogleAddForm, setShowGoogleAddForm] = useState(false);
  const [showFacebookAddForm, setShowFacebookAddForm] = useState(false);
  
  // Handle tab change with smooth transition
  const handleTabChange = (value: string) => {
    setTabTransitioning(true);
    setActiveTab(value);
    
    // Reset after a short delay to show the transition
    setTimeout(() => {
      setTabTransitioning(false);
    }, 300);
  };
  
  // Update form visibility when tab changes
  useEffect(() => {
    if (activeTab === 'google') {
      setShowFacebookAddForm(false);
    } else if (activeTab === 'facebook') {
      setShowGoogleAddForm(false);
    }
  }, [activeTab]);
  
  // Update active tab when URL parameter changes
  useEffect(() => {
    if (platform === 'facebook') {
      handleTabChange('facebook');
    } else if (platform === 'google') {
      handleTabChange('google');
    }
  }, [platform]);
  
  // Auto-show Facebook form when coming from platform=facebook URL param
  useEffect(() => {
    if (activeTab === 'facebook' && !loading) {
      const facebookAccounts = accounts.filter(a => a.platform === 'facebook');
      if (facebookAccounts.length === 0 && 
          searchParams.get('platform') === 'facebook' && 
          !showFacebookAddForm) {
        setShowFacebookAddForm(true);
      }
    }
  }, [activeTab, accounts, searchParams, showFacebookAddForm, loading]);
  
  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use a common error flag to track API failures
      let apiFailureDetected = false;
      
      // Fetch Google accounts
      let googleAccounts = [];
      try {
        const googleRes = await fetch('/api/google-ads', {
          signal: AbortSignal.timeout(15000)
        }).catch(err => {
          console.warn('Google Ads API network error:', err.message);
          apiFailureDetected = true;
          return { ok: false, statusText: err.message } as Response;
        });
        
        if (googleRes.ok) {
          const googleData = await googleRes.json();
          googleAccounts = googleData.accounts || [];
        } else {
          console.warn(`Google Ads API error: ${googleRes.statusText}`);
          apiFailureDetected = true;
        }
      } catch (googleError: any) {
        console.error('Error fetching Google accounts:', googleError?.message || googleError);
        apiFailureDetected = true;
      }
      
      // Fetch Facebook accounts
      let facebookAccounts = [];
      try {
        const facebookRes = await fetch('/api/facebook-ads', {
          signal: AbortSignal.timeout(15000)
        }).catch(err => {
          console.warn('Facebook Ads API network error:', err.message);
          apiFailureDetected = true;
          return { ok: false, statusText: err.message } as Response;
        });
        
        if (facebookRes.ok) {
          const facebookData = await facebookRes.json();
          facebookAccounts = facebookData.accounts || [];
        } else {
          console.warn(`Facebook Ads API error: ${facebookRes.statusText}`);
          apiFailureDetected = true;
        }
      } catch (fbError: any) {
        console.error('Error fetching Facebook accounts:', fbError?.message || fbError);
        apiFailureDetected = true;
      }
      
      // Combine accounts and show what we have
      const combinedAccounts = [...googleAccounts, ...facebookAccounts];
      setAccounts(combinedAccounts);
      
      // If both APIs failed or returned empty results
      if (apiFailureDetected) {
        setError('Could not retrieve accounts from the API. Please check your connection and try again.');
      }
    } catch (error: any) {
      console.error('Error fetching accounts:', error?.message || error);
      setError('Failed to load accounts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAccounts();
  }, []);
  
  const handleDeleteAccount = async (id: string, platform: string) => {
    if (!confirm('Are you sure you want to delete this account?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/${platform}-ads?accountId=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      
      toast.success('Account deleted successfully');
      fetchAccounts();
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };
  
  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Advertising Accounts</h1>
        <p className="text-muted-foreground">
          Connect your Google Ads and Facebook Ads accounts to view campaign analytics.
        </p>
        
        {error && error.includes("Could not retrieve accounts") ? (
          <div className="p-4 mt-2 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="font-medium text-amber-800">API Connection Issue</h3>
            <p className="text-sm text-amber-700 mt-1">
              There seems to be an issue connecting to the ad platform APIs. This could be because:
            </p>
            <ul className="list-disc pl-5 mt-2 text-sm text-amber-700 space-y-1">
              <li>The database connection is unavailable</li>
              <li>The API servers are temporarily down</li>
              <li>There's a network issue</li>
            </ul>
            <p className="text-sm text-amber-700 mt-2">
              Please set up your environment variables and try again.
            </p>
          </div>
        ) : null}
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="google" className={tabTransitioning && activeTab === 'google' ? "animate-pulse" : ""}>Google Ads</TabsTrigger>
          <TabsTrigger 
            value="facebook" 
            className={tabTransitioning && activeTab === 'facebook' ? "animate-pulse" : ""}
          >
            Facebook Ads
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="google" className={`mt-6 ${tabTransitioning ? 'opacity-80' : 'opacity-100'} transition-opacity`}>
          <Card>
            <CardHeader>
              <CardTitle>Google Ads Accounts</CardTitle>
              <CardDescription>
                Manage your connected Google Ads accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {accounts.filter(a => a.platform === 'google').length === 0 ? (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground mb-4">No Google Ads accounts connected yet.</p>
                      <Button onClick={() => setShowGoogleAddForm(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Connect Google Ads Account
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {accounts
                        .filter(a => a.platform === 'google')
                        .map(account => (
                          <div key={account.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{account.name}</h3>
                                <p className="text-sm text-muted-foreground">Account ID: {account.accountId}</p>
                                {account.isDefault && (
                                  <span className="mt-1 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                                    Default Account
                                  </span>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteAccount(account.id, 'google')}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      
                      {!showGoogleAddForm && (
                        <Button variant="outline" onClick={() => setShowGoogleAddForm(true)} className="w-full">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Another Account
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {showGoogleAddForm && (
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Connect Google Ads Account</h3>
                      <GoogleAdsForm onRefresh={() => {
                        fetchAccounts();
                        setShowGoogleAddForm(false);
                      }} />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facebook" className={`mt-6 ${tabTransitioning ? 'opacity-80' : 'opacity-100'} transition-opacity`}>
          <Card>
            <CardHeader>
              <CardTitle>Facebook Ads Accounts</CardTitle>
              <CardDescription>
                Manage your connected Facebook Ads accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {accounts.filter(a => a.platform === 'facebook').length === 0 ? (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground mb-4">No Facebook Ads accounts connected yet.</p>
                      <Button onClick={() => setShowFacebookAddForm(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Connect Facebook Ads Account
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {accounts
                        .filter(a => a.platform === 'facebook')
                        .map(account => (
                          <div key={account.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{account.name}</h3>
                                <p className="text-sm text-muted-foreground">Account ID: {account.accountId}</p>
                                {account.isDefault && (
                                  <span className="mt-1 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                                    Default Account
                                  </span>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteAccount(account.id, 'facebook')}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      
                      {!showFacebookAddForm && (
                        <Button variant="outline" onClick={() => setShowFacebookAddForm(true)} className="w-full">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Another Account
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {showFacebookAddForm && (
                    <div className="mt-6 border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Connect Facebook Ads Account</h3>
                      <FacebookAdsForm onRefresh={() => {
                        fetchAccounts();
                        setShowFacebookAddForm(false);
                      }} />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}