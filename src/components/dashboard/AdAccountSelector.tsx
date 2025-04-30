'use client';

import { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdAccount {
  _id: string;
  userId: string;
  platform: string;
  accountId: string;
  accountName: string;
  isDefault: boolean;
}

interface AdAccountSelectorProps {
  platform: 'google' | 'facebook';
  onSelect: (accountId: string) => void;
  showAddButton?: boolean;
}

export default function AdAccountSelector({ 
  platform, 
  onSelect,
  showAddButton = true 
}: AdAccountSelectorProps) {
  const [accounts, setAccounts] = useState<AdAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    async function fetchAccounts() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/${platform}-ads`, {
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000) 
        }).catch(err => {
          throw new Error(`Network error: ${err.message}`);
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch accounts: ${response.statusText}`);
        }
        
        const data = await response.json();
        const fetchedAccounts = data.accounts || [];
        
        if (fetchedAccounts.length === 0) {
          // No accounts found, show message
          setError('No accounts found. Please add an account in the settings.');
          return;
        }
        
        // If there are accounts and one is marked as default, select it
        setAccounts(fetchedAccounts);
        
        const defaultAccount = fetchedAccounts.find((account: AdAccount) => account.isDefault);
        
        if (defaultAccount) {
          onSelect(defaultAccount.accountId);
        } else if (fetchedAccounts[0]) {
          // Otherwise select the first account
          onSelect(fetchedAccounts[0].accountId);
        }
      } catch (error: any) {
        console.error('Error fetching accounts:', error);
        // Use more descriptive error message
        setError('Could not retrieve accounts. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchAccounts();
  }, [platform, onSelect]);
  
  const handleAddAccount = () => {
    router.push(`/settings/accounts?platform=${platform}`);
  };
  
  if (loading) {
    return <div className="flex items-center text-sm text-muted-foreground">Loading accounts...</div>;
  }
  
  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }
  
  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-muted-foreground">No {platform} accounts connected</p>
        {showAddButton && (
          <Button 
            variant={platform === 'facebook' ? "default" : "outline"} 
            size="sm" 
            onClick={handleAddAccount}
            className={platform === 'facebook' ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            {platform === 'facebook' ? 'Connect Facebook Account' : 'Connect Account'}
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="flex gap-2 items-center">
      <Select onValueChange={onSelect} defaultValue={accounts.find(a => a.isDefault)?.accountId || accounts[0]?.accountId}>
        <SelectTrigger className="w-[240px]">
          <SelectValue placeholder={`Select ${platform} Ad Account`} />
        </SelectTrigger>
        <SelectContent>
          {accounts.map(account => (
            <SelectItem key={account._id} value={account.accountId}>
              {account.accountName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {showAddButton && (
        <Button variant="outline" size="icon" onClick={handleAddAccount} title="Add new account">
          <PlusCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 