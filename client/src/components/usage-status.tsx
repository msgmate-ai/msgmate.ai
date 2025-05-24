import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useEffect, useState } from "react";

interface UsageStatusProps {
  className?: string;
}

const UsageStatus = ({ className }: UsageStatusProps) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [localUsage, setLocalUsage] = useState(0);

  // Get usage limit based on subscription tier
  const getUsageLimit = () => {
    if (!user) return 10; // Free tier default for unauthenticated users
    if (!subscription) return 10; // Free tier default
    
    switch(subscription.tier) {
      case 'basic':
        return 100;
      case 'pro':
        return 400;
      default:
        return 10;
    }
  };

  // Handle local storage updates for unauthenticated users
  useEffect(() => {
    const getLocalUsageCount = () => {
      const storedUsage = localStorage.getItem('msgmate_free_usage');
      return storedUsage ? parseInt(storedUsage) : 0;
    };

    if (!user) {
      setLocalUsage(getLocalUsageCount());
      
      // Listen for storage events to update the usage count in real-time
      const handleStorageChange = () => {
        setLocalUsage(getLocalUsageCount());
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [user]);

  // Determine usage count based on authentication status
  const usageCount = user ? (subscription?.usage || 0) : localUsage;
  const usageLimit = getUsageLimit();
  const usagePercentage = Math.min(100, Math.round((usageCount / usageLimit) * 100));

  // Get plan name based on subscription tier
  const getPlanName = () => {
    if (!user) return 'Free Plan';
    if (!subscription) return 'Free Plan';
    
    switch(subscription.tier) {
      case 'basic':
        return 'Basic+ Plan';
      case 'pro':
        return 'Pro Plan';
      default:
        return 'Free Plan';
    }
  };

  return (
    <div className={cn("bg-card border rounded-lg p-4", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="font-medium">
            <span>{getPlanName()}</span>: 
            <span> {usageCount}</span> / <span>{usageLimit}</span> messages used
          </p>
          <Progress value={usagePercentage} className="w-full md:w-64 h-2.5 mt-2" />
        </div>
        <Link to="/pricing" className="text-primary hover:underline font-medium transition-all">
          {usageCount >= usageLimit * 0.8 ? 'Upgrade for more messages →' : 'View plans →'}
        </Link>
      </div>
    </div>
  );
};

export default UsageStatus;
