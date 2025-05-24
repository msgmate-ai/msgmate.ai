import { useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';
import { useAuth } from '@/hooks/use-auth';
import msgMateLogo from '@/assets/msgmate-logo.png';

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
          <div className="py-8 md:py-16 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex flex-col items-center md:items-start">
                <img 
                  src={msgMateLogo} 
                  alt="MsgMate.AI Logo" 
                  className="w-auto h-auto max-w-full md:max-w-md mb-6"
                />
              </div>
              <p className="text-lg text-muted-foreground">
                Struggle with what to say on dating apps? MsgMate helps you reply with confidence, start great conversations, and decode tricky messages — all with one smart tool.
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

          </div>

          {/* Features Section */}
          <div className="py-16 bg-gradient-to-b from-background to-muted/30 rounded-3xl my-12">
            <h2 className="text-4xl font-bold text-center mb-16 text-primary">Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
              <div className="bg-card border-2 hover:border-primary transition-colors duration-300 shadow-lg rounded-xl p-8 space-y-5 hover:shadow-xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-300"></div>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <h3 className="text-2xl font-bold">Reply Generator</h3>
                  <p className="text-muted-foreground my-3">Create perfect replies in multiple tones for any message you receive.</p>
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold">
                    Available in Free Tier
                  </div>
                </div>
              </div>
              
              <div className="bg-card border-2 hover:border-primary transition-colors duration-300 shadow-lg rounded-xl p-8 space-y-5 hover:shadow-xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-300"></div>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  <h3 className="text-2xl font-bold">Conversation Starters</h3>
                  <p className="text-muted-foreground my-3">Generate engaging conversation starters based on profiles and interests.</p>
                  <div className="inline-block px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-sm font-bold">
                    Basic+ Subscription
                  </div>
                </div>
              </div>
              
              <div className="bg-card border-2 hover:border-primary transition-colors duration-300 shadow-lg rounded-xl p-8 space-y-5 hover:shadow-xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-300"></div>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <h3 className="text-2xl font-bold">Message Coach</h3>
                  <p className="text-muted-foreground my-3">Get professional feedback on your draft messages with tone analysis and suggestions.</p>
                  <div className="inline-block px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-sm font-bold">
                    Pro Subscription
                  </div>
                </div>
              </div>
              
              <div className="bg-card border-2 hover:border-primary transition-colors duration-300 shadow-lg rounded-xl p-8 space-y-5 hover:shadow-xl relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors duration-300"></div>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4"></path>
                    <path d="M12 8h.01"></path>
                  </svg>
                  <h3 className="text-2xl font-bold">Message Decoder</h3>
                  <p className="text-muted-foreground my-3">Analyze received messages to understand hidden meanings and intents.</p>
                  <div className="inline-block px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-sm font-bold">
                    Pro Subscription
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="py-16 mb-12">
            <h2 className="text-4xl font-bold text-center mb-16 text-primary">Pricing Plans</h2>
            <div className="grid md:grid-cols-3 gap-8 px-6">
              {/* Free Plan */}
              <div className="bg-card border-2 border-muted hover:border-primary transition-all duration-300 rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl">
                <div className="p-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-transparent transition-all duration-500"></div>
                <div className="px-8 pt-8 pb-4">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-extrabold">£0</span>
                    <span className="text-base text-muted-foreground">/month</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-6">Perfect for trying out MsgMate.AI</div>
                </div>
                <div className="px-8 pb-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>5 Basic Tones</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>10 messages per month</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>No credit card required</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300" variant="outline">
                    <Link href="/app">Get Started</Link>
                  </Button>
                </div>
              </div>

              {/* Basic+ Plan */}
              <div className="bg-card border-2 border-primary rounded-2xl overflow-hidden shadow-xl transform scale-105 relative z-10">
                <div className="p-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent"></div>
                <div className="absolute -top-5 inset-x-0 flex justify-center">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </div>
                </div>
                <div className="px-8 pt-10 pb-4">
                  <h3 className="text-2xl font-bold">Basic+</h3>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-extrabold">£4.99</span>
                    <span className="text-base text-muted-foreground">/month</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-6">Enhanced dating conversation support</div>
                </div>
                <div className="px-8 pb-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-semibold">10 Tones</span> including empathetic, humorous</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-semibold">Conversation Starters</span> for dating profiles</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-semibold">100 messages</span> per month</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-primary hover:bg-primary/90">
                    <Link href="/auth">Subscribe</Link>
                  </Button>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="bg-card border-2 border-muted hover:border-primary transition-all duration-300 rounded-2xl overflow-hidden shadow-lg group hover:shadow-xl">
                <div className="p-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-transparent transition-all duration-500"></div>
                <div className="px-8 pt-8 pb-4">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <div className="mt-4 mb-6">
                    <span className="text-4xl font-extrabold">£9.99</span>
                    <span className="text-base text-muted-foreground">/month</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-6">Complete dating messaging toolkit</div>
                </div>
                <div className="px-8 pb-8">
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-semibold">15 Tones</span> including flirty, assertive</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-semibold">All premium features</span> included</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span><span className="font-semibold">400 messages</span> per month</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300" variant="outline">
                    <Link href="/auth">Subscribe</Link>
                  </Button>
                </div>
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