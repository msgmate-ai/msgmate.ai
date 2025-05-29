import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/navbar';
import ReplyGenerator from '@/components/reply-generator';
import AdditionalTools from '@/components/additional-tools';
import Footer from '@/components/footer';
import UsageStatus from '@/components/usage-status';
import { useAuth } from '@/hooks/use-auth';
import { SubscriptionProvider } from '@/hooks/use-subscription';
import { useToast } from '@/hooks/use-toast';

// Feature flag to disable SMS verification
const SMS_ENABLED = false;

const AppPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSMSModalOpen, setIsSMSModalOpen] = useState(false);
  
  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Reply Generator";
  }, []);

  return (
    <SubscriptionProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="mb-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Your AI Dating Assistant</h1>
            <p className="text-muted-foreground">
              {user ? 'Welcome back! Generate perfect replies for any conversation.' : 'Struggling with replies on dating apps? Get help crafting the perfect message.'}
            </p>
            
            {user && (
              <>
                {user.isVerified === false && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-yellow-800">Please verify your email</h3>
                        <p className="text-sm text-yellow-700 mb-2">
                          We've sent a verification link to {user.email}. Please check your inbox and spam folder.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button 
                            onClick={() => {
                              fetch('/api/resend-verification', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                credentials: 'include'
                              })
                              .then(res => res.json())
                              .then(data => {
                                if (data.success) {
                                  toast({
                                    title: "Email Sent",
                                    description: "Verification email sent! Check your inbox and spam folder.",
                                  });
                                } else {
                                  toast({
                                    title: "Error",
                                    description: "Error sending verification email. Please try again later.",
                                    variant: "destructive",
                                  });
                                }
                              })
                              .catch(err => {
                                console.error('Error:', err);
                                toast({
                                  title: "Error",
                                  description: "Error sending verification email. Please try again later.",
                                  variant: "destructive",
                                });
                              });
                            }}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                          >
                            Resend verification email
                          </button>
                          {SMS_ENABLED && (
                            <>
                              <span className="text-sm text-yellow-700 hidden sm:inline">or</span>
                              <button 
                                onClick={() => setIsSMSModalOpen(true)}
                                className="text-sm text-green-600 hover:text-green-800 font-medium underline"
                              >
                                Verify by phone instead
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <UsageStatus className="mt-4" />
              </>
            )}
            
            {!user && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium">Using Free Version</h3>
                    <p className="text-sm text-muted-foreground">Create an account for more tones and features</p>
                  </div>
                  <Link href="/auth">
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
                      Sign Up
                    </button>
                  </Link>
                </div>
                <UsageStatus className="mt-4" />
              </div>
            )}
          </div>
          
          <div className="space-y-10 max-w-4xl mx-auto">
            <ReplyGenerator />
            <AdditionalTools />
          </div>
        </main>
        <Footer />
        
        {/* SMS Verification Modal - Disabled */}
      </div>
    </SubscriptionProvider>
  );
};

export default AppPage;