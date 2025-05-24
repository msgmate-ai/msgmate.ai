import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import Pricing from '@/components/pricing';
import Footer from '@/components/footer';

const PricingPage = () => {
  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Pricing";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Pricing Plans</h1>
          <p className="text-muted-foreground mb-8">
            Choose the plan that's right for you. All plans include our core features with different usage limits and premium tools.
          </p>
          <Pricing />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;