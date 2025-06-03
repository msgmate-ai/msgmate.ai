import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const Pricing = () => {
  const { user } = useAuth();
  const { subscription, refetchSubscription } = useSubscription();
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
    mutationFn: async (tier: string) => {
      const res = await apiRequest('POST', '/api/create-subscription', { tier });
      
      if (!res.ok) {
        const cloned = res.clone();
        const error = await cloned.json();
        throw new Error(error.message || 'Subscription failed');
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast({
        title: 'Subscription error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubscribe = (tier: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to continue',
        variant: 'destructive',
      });
      // Redirect to login page
      window.location.href = '/auth';
      return;
    }
    
    subscriptionMutation.mutate(tier);
  };

  return (
    <section id="pricing" className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-primary mb-4">Choose Your Plan</h2>
        <p className="text-secondary-dark max-w-2xl mx-auto">
          Find the perfect plan to enhance your messaging experience with our AI-powered tools.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Free Tier */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col">
          <div className="bg-secondary-light p-6 text-center">
            <h3 className="font-bold text-xl text-primary">Free</h3>
            <div className="mt-4">
              <span className="text-3xl font-bold">£0</span>
              <span className="text-secondary">/month</span>
            </div>
          </div>
          
          <div className="p-6 flex-grow">
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>10 message replies per month</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Access to 4 tones in "First Message" group</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Basic reply suggestions</span>
              </li>
              <li className="flex items-start text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Conversation Starters</span>
              </li>
              <li className="flex items-start text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Message Coach</span>
              </li>
              <li className="flex items-start text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Message Decoder</span>
              </li>
            </ul>
          </div>
          
          <div className="px-6 pb-6">
            {subscription?.tier === 'free' || !subscription ? (
              <Button disabled className="w-full bg-secondary hover:bg-secondary-dark text-white font-medium py-2 px-4 rounded-lg">
                Current Plan
              </Button>
            ) : (
              <Button 
                onClick={() => handleSubscribe('free')}
                disabled={subscriptionMutation.isPending}
                className="w-full bg-secondary hover:bg-secondary-dark text-white font-medium py-2 px-4 rounded-lg"
              >
                {subscriptionMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Downgrade'
                )}
              </Button>
            )}
          </div>
        </div>
        
        {/* Basic+ Tier */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-yellow-400 flex flex-col relative transform lg:scale-105 z-10">
          <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            POPULAR
          </div>
          <div className="bg-yellow-50 p-6 text-center">
            <h3 className="font-bold text-xl text-primary">Basic+</h3>
            <div className="mt-4">
              <span className="text-3xl font-bold">£4.99</span>
              <span className="text-secondary">/month</span>
            </div>
          </div>
          
          <div className="p-6 flex-grow">
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100 message replies per month</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Access to 8 tones (First Message + Getting to Know Each Other groups)</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Enhanced reply suggestions</span>
              </li>
              <li className="flex items-start font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Conversation Starters</span>
              </li>
              <li className="flex items-start text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Message Coach</span>
              </li>
              <li className="flex items-start text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Message Decoder</span>
              </li>
            </ul>
          </div>
          
          <div className="px-6 pb-6">
            {subscription?.tier === 'basic' ? (
              <Button disabled className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-lg">
                Current Plan
              </Button>
            ) : (
              <Button
                onClick={() => handleSubscribe('basic')}
                disabled={subscriptionMutation.isPending}
                className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-lg"
              >
                {subscriptionMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  subscription?.tier === 'pro' ? 'Downgrade' : 'Subscribe Now'
                )}
              </Button>
            )}
          </div>
        </div>
        
        {/* Pro Tier */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-400 flex flex-col">
          <div className="bg-purple-50 p-6 text-center">
            <h3 className="font-bold text-xl text-primary">Pro</h3>
            <div className="mt-4">
              <span className="text-3xl font-bold">£9.99</span>
              <span className="text-secondary">/month</span>
            </div>
          </div>
          
          <div className="p-6 flex-grow">
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>400 message replies per month</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Access to 12 tones (First Message + Getting to Know + Going Deeper groups)</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Premium reply suggestions</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Conversation Starters</span>
              </li>
              <li className="flex items-start font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Message Coach</span>
              </li>
              <li className="flex items-start font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Message Decoder</span>
              </li>
            </ul>
          </div>
          
          <div className="px-6 pb-6">
            {subscription?.tier === 'pro' ? (
              <Button disabled className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-lg">
                Current Plan
              </Button>
            ) : (
              <Button
                onClick={() => handleSubscribe('pro')}
                disabled={subscriptionMutation.isPending}
                className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-lg"
              >
                {subscriptionMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Subscribe Now'
                )}
              </Button>
            )}
          </div>
        </div>
        
        {/* Elite Tier (Coming Soon) */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 flex flex-col opacity-75">
          <div className="bg-gradient-to-r from-primary to-purple-700 p-6 text-center">
            <h3 className="font-bold text-xl text-white">Elite</h3>
            <div className="mt-4 text-white">
              <span className="text-xl font-medium">Coming Soon</span>
            </div>
          </div>
          
          <div className="p-6 flex-grow">
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-secondary-light mb-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              <p className="text-secondary font-medium">Elite plan features are being developed.</p>
              <p className="text-secondary mt-2">Stay tuned for advanced features and exclusive benefits.</p>
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <Button disabled className="w-full bg-gray-300 text-secondary-dark font-medium py-2 px-4 rounded-lg cursor-not-allowed">
              Coming Soon
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
