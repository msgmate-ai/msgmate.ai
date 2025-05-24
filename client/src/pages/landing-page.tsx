import { useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';
import LogoSvg from '@/components/ui/logo-svg';
import { useAuth } from '@/hooks/use-auth';

const LandingPage = () => {
  const { user } = useAuth();
  
  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Your personal AI Wingmate";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container px-4 mx-auto">
          {/* Hero Section */}
          <div className="py-12 md:py-20 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <div className="mb-6">
                <LogoSvg width={400} height={200} className="text-foreground" />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Your personal AI messaging assistant
              </h2>
              <p className="text-lg text-muted-foreground">
                Generate perfect replies, craft conversation starters, decode messages, and get professional coaching for your important conversations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="font-semibold">
                  <Link href="/app">Try for Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth">Sign In</Link>
                </Button>
              </div>
              <div className="pt-4 text-sm text-muted-foreground">
                <p>No registration required to try basic features.</p>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="bg-card border rounded-xl shadow-lg p-6">
                  <h3 className="font-medium mb-4">Example AI Replies</h3>
                  <div className="space-y-3">
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Friendly:</span> "Thanks for reaching out! I'd love to catch up this weekend. How about coffee on Saturday?"
                      </p>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Professional:</span> "Thank you for your inquiry. I've reviewed the proposal and can schedule a discussion this Thursday at 2pm if that works for you."
                      </p>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">
                        <span className="font-medium">Casual:</span> "Hey! Yeah I'm down for the movie tonight. Want me to bring snacks?"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-12 space-y-12">
            <h2 className="text-3xl font-bold text-center">Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Reply Generator</h3>
                <p className="text-muted-foreground">Create perfect replies in multiple tones for any message you receive.</p>
                <p className="text-sm font-medium text-primary">Available in Free Tier</p>
              </div>
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Conversation Starters</h3>
                <p className="text-muted-foreground">Generate engaging conversation starters based on profiles and interests.</p>
                <p className="text-sm font-medium">Basic+ Subscription</p>
              </div>
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Message Coach</h3>
                <p className="text-muted-foreground">Get professional feedback on your draft messages with tone analysis and suggestions.</p>
                <p className="text-sm font-medium">Pro Subscription</p>
              </div>
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Message Decoder</h3>
                <p className="text-muted-foreground">Analyze received messages to understand hidden meanings and intents.</p>
                <p className="text-sm font-medium">Pro Subscription</p>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="py-12 space-y-8">
            <h2 className="text-3xl font-bold text-center">Pricing Plans</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Free</h3>
                <p className="text-3xl font-bold">£0 <span className="text-base font-normal text-muted-foreground">/month</span></p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>5 Basic Tones</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>10 messages per month</span>
                  </li>
                </ul>
                <Button asChild className="w-full mt-4" variant="outline">
                  <Link href="/app">Get Started</Link>
                </Button>
              </div>
              <div className="bg-card border rounded-lg p-6 space-y-4 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Popular
                </div>
                <h3 className="text-xl font-semibold">Basic+</h3>
                <p className="text-3xl font-bold">£4.99 <span className="text-base font-normal text-muted-foreground">/month</span></p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>10 Tones</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>Conversation Starters</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>100 messages per month</span>
                  </li>
                </ul>
                <Button asChild className="w-full mt-4">
                  <Link href="/auth">Subscribe</Link>
                </Button>
              </div>
              <div className="bg-card border rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Pro</h3>
                <p className="text-3xl font-bold">£9.99 <span className="text-base font-normal text-muted-foreground">/month</span></p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>15 Tones</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>All Features Included</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    <span>400 messages per month</span>
                  </li>
                </ul>
                <Button asChild className="w-full mt-4">
                  <Link href="/auth">Subscribe</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;