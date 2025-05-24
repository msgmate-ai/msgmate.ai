import { useEffect } from 'react';
import { Link } from 'wouter';
import Navbar from '@/components/navbar';
import ReplyGenerator from '@/components/reply-generator';
import AdditionalTools from '@/components/additional-tools';
import Footer from '@/components/footer';
import UsageStatus from '@/components/usage-status';
import { useAuth } from '@/hooks/use-auth';
import { SubscriptionProvider } from '@/hooks/use-subscription';

const AppPage = () => {
  const { user } = useAuth();
  
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
            
            {user && <UsageStatus className="mt-4" />}
            
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
              </div>
            )}
          </div>
          
          <div className="space-y-10 max-w-4xl mx-auto">
            <ReplyGenerator />
            <AdditionalTools />
          </div>
        </main>
        <Footer />
      </div>
    </SubscriptionProvider>
  );
};

export default AppPage;