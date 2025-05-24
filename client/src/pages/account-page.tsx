import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import UsageStatus from "@/components/usage-status";
import { Loader2, CreditCard, Calendar, Settings, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProtectedRoute } from "@/lib/protected-route";

function AccountPageContent() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const { subscription, refetchSubscription } = useSubscription();
  const { toast } = useToast();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  
  const subscriptionMutation = useMutation({
    mutationFn: async (tier: string) => {
      const res = await apiRequest('POST', '/api/create-subscription', { tier });
      return res.json();
    },
    onSuccess: (data) => {
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

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/cancel-subscription');
      return res.json();
    },
    onSuccess: () => {
      refetchSubscription();
      setCancelDialogOpen(false);
      toast({
        title: 'Subscription canceled',
        description: 'Your subscription has been canceled. You will still have access until the end of the billing period.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Cancellation error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleUpgrade = (tier: string) => {
    subscriptionMutation.mutate(tier);
  };

  const handleCancelSubscription = () => {
    cancelSubscriptionMutation.mutate();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">Account Settings</h1>
            <p className="text-gray-600">Manage your subscription and account settings</p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0" 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            {logoutMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogOut className="h-4 w-4 mr-2" />}
            Sign Out
          </Button>
        </div>

        <div className="mb-8">
          <UsageStatus className="w-full" />
        </div>

        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="subscription" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Account Details
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>Your Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription plan and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Current Plan</p>
                      <p className="text-lg font-semibold">
                        {subscription?.tier === 'pro' ? 'Pro Plan' : 
                         subscription?.tier === 'basic' ? 'Basic+ Plan' : 'Free Plan'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <div className="flex items-center">
                        <div className={`h-2.5 w-2.5 rounded-full mr-2 ${subscription?.tier !== 'free' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <p className="text-lg font-semibold">{subscription?.tier !== 'free' ? 'Active' : 'No active subscription'}</p>
                      </div>
                    </div>
                    
                    {subscription?.createdAt && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Start Date</p>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <p>{formatDate(subscription.createdAt.toString())}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Next Billing Date</p>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <p>{subscription?.tier !== 'free' ? 'Monthly renewal' : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
                    <ul className="space-y-2">
                      {subscription?.tier === 'pro' ? (
                        <>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>400 messages per month</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>All 15 messaging tones</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Conversation Starters</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Message Coach</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Message Decoder</span>
                          </li>
                        </>
                      ) : subscription?.tier === 'basic' ? (
                        <>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>100 messages per month</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>10 messaging tones</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Conversation Starters</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>10 messages per month</span>
                          </li>
                          <li className="flex items-center">
                            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>5 basic tones</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                {subscription?.tier === 'free' ? (
                  <>
                    <Button 
                      onClick={() => handleUpgrade('basic')}
                      disabled={subscriptionMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {subscriptionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Upgrade to Basic+ (£4.99/month)
                    </Button>
                    <Button 
                      onClick={() => handleUpgrade('pro')}
                      disabled={subscriptionMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {subscriptionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Upgrade to Pro (£9.99/month)
                    </Button>
                  </>
                ) : subscription?.tier === 'basic' ? (
                  <>
                    <Button 
                      onClick={() => handleUpgrade('pro')}
                      disabled={subscriptionMutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {subscriptionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Upgrade to Pro (£9.99/month)
                    </Button>
                    <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Cancel Subscription
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure you want to cancel?</DialogTitle>
                          <DialogDescription>
                            You will lose access to premium features at the end of your current billing period.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                            Keep Subscription
                          </Button>
                          <Button 
                            variant="destructive" 
                            onClick={handleCancelSubscription}
                            disabled={cancelSubscriptionMutation.isPending}
                          >
                            {cancelSubscriptionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Yes, Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full sm:w-auto">
                        Cancel Subscription
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure you want to cancel?</DialogTitle>
                        <DialogDescription>
                          You will lose access to premium features at the end of your current billing period.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                          Keep Subscription
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleCancelSubscription}
                          disabled={cancelSubscriptionMutation.isPending}
                        >
                          {cancelSubscriptionMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                          Yes, Cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{user?.username}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                    <p>{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500">Email Verified</p>
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${user?.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <p>{user?.emailVerified ? 'Verified' : 'Not verified'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                {!user?.emailVerified && (
                  <Button
                    onClick={() => {
                      apiRequest('POST', '/api/resend-verification', {})
                        .then(() => {
                          toast({
                            title: 'Verification email sent',
                            description: 'Please check your inbox for the verification link',
                          });
                        })
                        .catch((error) => {
                          toast({
                            title: 'Error',
                            description: error.message,
                            variant: 'destructive',
                          });
                        });
                    }}
                  >
                    Resend Verification Email
                  </Button>
                )}
                <Button 
                  variant="outline"
                  onClick={() => navigate('/forgot-password')}
                >
                  Change Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return <ProtectedRoute path="/account" component={AccountPageContent} />;
}