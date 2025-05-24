import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UsageStatusProps {
  className?: string;
}

const UsageStatus = ({ className }: UsageStatusProps) => {
  const { user } = useAuth();
  const { subscription } = useSubscription();

  // Allow displaying for non-authenticated users too (free tier)

  const getUsageLimit = () => {
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

  const usageCount = subscription?.usage || 0;
  const usageLimit = getUsageLimit();
  const usagePercentage = Math.min(100, Math.round((usageCount / usageLimit) * 100));

  return (
    <div className={cn("bg-card border rounded-lg p-4", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="font-medium">
            <span>{subscription?.tier === 'basic' ? 'Basic+ Plan' : subscription?.tier === 'pro' ? 'Pro Plan' : 'Free Plan'}</span>: 
            <span> {usageCount}</span> / <span>{usageLimit}</span> messages used
          </p>
          <Progress value={usagePercentage} className="w-full md:w-64 h-2.5 mt-2" />
        </div>
        <a href="#pricing" className="text-primary hover:underline font-medium transition-all">
          {usageCount >= usageLimit * 0.8 ? 'Upgrade for more messages →' : 'View plans →'}
        </a>
      </div>
    </div>
  );
};

export default UsageStatus;
