import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import ReplyGenerator from '@/components/reply-generator';
import AdditionalTools from '@/components/additional-tools';
import Pricing from '@/components/pricing';
import Footer from '@/components/footer';
import UsageStatus from '@/components/usage-status';
import { useAuth } from '@/hooks/use-auth';
import { SubscriptionProvider } from '@/hooks/use-subscription';

const HomePage = () => {
  const { user } = useAuth();
  
  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Your personal AI Wingmate";
  }, []);

  return (
    <SubscriptionProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="container mx-auto px-4 py-6 md:py-10 flex-grow">
          {/* Usage Status Bar for logged in users */}
          {user && <UsageStatus />}
          
          {/* Reply Generator */}
          <ReplyGenerator />
          
          {/* Additional Tools */}
          <AdditionalTools />
          
          {/* Pricing Section */}
          <Pricing />
        </main>
        
        <Footer />
      </div>
    </SubscriptionProvider>
  );
};

export default HomePage;
