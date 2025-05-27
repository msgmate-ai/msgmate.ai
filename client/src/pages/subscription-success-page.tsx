import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function SubscriptionSuccessPage() {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { subscription, refetchSubscription } = useSubscription();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isActivating, setIsActivating] = useState(false);

  useEffect(() => {
    // Show welcome toast immediately
    toast({
      title: "Payment Successful!",
      description: "Thank you for subscribing to MsgMate.AI!",
    });

    // Set loading to false after a short delay to show the page
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Refresh subscription data if user is available
    if (user) {
      const fetchData = async () => {
        try {
          await refetchSubscription();
        } catch (error) {
          console.error("Error fetching subscription data:", error);
        }
      };
      fetchData();
    }

    return () => clearTimeout(timer);
  }, [user, refetchSubscription, toast]);

  const getSubscriptionDetails = () => {
    if (!subscription) return { name: "Free Plan", messages: 10, features: ["5 basic tones", "Message replies"] };

    switch (subscription.tier) {
      case "basic":
        return {
          name: "Basic+ Plan",
          messages: 100,
          features: [
            "100 messages per month",
            "10 messaging tones",
            "Enhanced reply suggestions",
            "Conversation starters"
          ]
        };
      case "pro":
        return {
          name: "Pro Plan",
          messages: 400,
          features: [
            "400 messages per month",
            "All 15 messaging tones",
            "Premium reply suggestions",
            "Conversation starters",
            "Message coach",
            "Message decoder"
          ]
        };
      default:
        return { name: "Free Plan", messages: 10, features: ["5 basic tones", "Message replies"] };
    }
  };

  const details = getSubscriptionDetails();

  const handleActivateSubscription = async (tier: 'basic' | 'pro') => {
    setIsActivating(true);
    try {
      const response = await fetch('/api/activate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier }),
      });

      if (!response.ok) {
        throw new Error('Failed to activate subscription');
      }
      
      await refetchSubscription();
      
      toast({
        title: "Subscription Activated!",
        description: `Your ${tier} subscription is now active.`,
      });
    } catch (error: any) {
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate subscription",
        variant: "destructive",
      });
    } finally {
      setIsActivating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-8 px-6 text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-white mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-white text-opacity-90">
            Your subscription to MsgMate.AI is being processed
          </p>
        </div>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome to {details.name}
            </h2>
            <p className="text-gray-600">
              Your subscription is now active and ready to use.
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Your subscription includes:</h3>
            <ul className="space-y-3">
              {details.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Next steps:</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              <li>Explore your new premium features</li>
              <li>Try out different tones for your messages</li>
              <li>Check your subscription details in your account</li>
            </ol>
          </div>

          {subscription?.tier === 'free' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="text-yellow-800 font-medium mb-2">Complete Your Subscription</h4>
              <p className="text-yellow-700 text-sm mb-3">
                Your payment was successful! Click below to activate your subscription features.
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleActivateSubscription('basic')}
                  disabled={isActivating}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {isActivating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Activate Basic+ Plan
                </Button>
                <Button 
                  onClick={() => handleActivateSubscription('pro')}
                  disabled={isActivating}
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  {isActivating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Activate Pro Plan
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => navigate("/app")} 
              className="bg-primary hover:bg-primary-light text-white"
            >
              Start Using Premium Features
            </Button>
            <Button 
              onClick={() => navigate("/account")} 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary-light/10"
            >
              Manage Your Subscription
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}