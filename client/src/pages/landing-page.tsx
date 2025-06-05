import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Footer from '@/components/footer';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import msgMateLogo from '@/assets/msgmate-logo.png';
import helpMeCraftInput from '@assets/IMG_2156_1749143979578.jpeg';
import helpMeCraftResults from '@assets/IMG_2157_1749143979578.jpeg';
import sayItBetterInput from '@assets/IMG_2155_1749143979578.jpeg';
import sayItBetterResults from '@assets/IMG_2154_1749143979578.png';

const LandingPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Your Personal AI Wingmate for Dating";
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call for beta signup
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Success!",
        description: "You've been added to our beta waiting list. We'll be in touch soon!",
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
      <main className="flex-1">
        <div className="container px-4 mx-auto">
          {/* Hero Section */}
          <div className="py-12 md:py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <img 
                  src={msgMateLogo} 
                  alt="MsgMate.AI Logo" 
                  className="w-auto h-auto max-w-sm mx-auto mb-6"
                />
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Your Personal AI Wingmate for 
                <span className="text-blue-600"> Confident Dating</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Helping you say it better – with confidence, charm, and authenticity. Never overthink a message again.
              </p>

              {/* Urgency Banner */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl mb-8 shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-bold text-lg">Limited Free Testing Subscriptions Available</span>
                </div>
                <p className="text-orange-100">Join the exclusive beta and help shape the future of dating conversations</p>
              </div>

              {/* Email Signup Form */}
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-12">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 text-lg p-4 border-2 border-gray-200 focus:border-blue-500"
                    required
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg whitespace-nowrap"
                  >
                    {isSubmitting ? 'Joining...' : 'Join Free Beta'}
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-3">Limited spots available • No spam, ever</p>
              </form>

              <div className="text-center mb-16">
                <p className="text-gray-600 mb-4">Already have an account?</p>
                <Button asChild variant="outline" size="lg" className="border-2">
                  <Link href="/auth">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-16 bg-white rounded-3xl shadow-xl mb-16">
            <div className="max-w-6xl mx-auto px-8">
              <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
                Message Helper Features
              </h2>
              <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
                Explore our message helper features – perfect for any stage of the conversation.
              </p>
              
              <div className="grid md:grid-cols-2 gap-12">
                {/* Say It Better Feature */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Say It Better</h3>
                    </div>
                    <p className="text-gray-700 mb-6 text-lg">
                      You write the message, we'll help you say it better. Get three distinct rewrites that keep your voice but add polish, engagement, or playful charm.
                    </p>
                    
                    {/* iPhone Mockups for Say It Better */}
                    <div className="flex flex-col items-center gap-8">
                      {/* Input Screen */}
                      <div className="relative max-w-sm">
                        <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
                          <div className="bg-white rounded-[2rem] overflow-hidden">
                            <img 
                              src={sayItBetterInput} 
                              alt="Say It Better Input Screen"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-4">1. Enter your message</p>
                      </div>
                      
                      {/* Results Screen */}
                      <div className="relative max-w-sm">
                        <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
                          <div className="bg-white rounded-[2rem] overflow-hidden">
                            <img 
                              src={sayItBetterResults} 
                              alt="Say It Better Results Screen"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-4">2. Get three enhanced versions</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Help Me Craft Feature */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Help Me Craft a Message</h3>
                    </div>
                    <p className="text-gray-700 mb-6 text-lg">
                      Received a message and not sure how to respond? Choose your tone and get three perfectly crafted replies that match your vibe.
                    </p>
                    
                    {/* iPhone Mockups for Help Me Craft */}
                    <div className="flex flex-col items-center gap-8">
                      {/* Input Screen */}
                      <div className="relative max-w-sm">
                        <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
                          <div className="bg-white rounded-[2rem] overflow-hidden">
                            <img 
                              src={helpMeCraftInput} 
                              alt="Help Me Craft Input Screen"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-4">1. Enter received message & choose tone</p>
                      </div>
                      
                      {/* Results Screen */}
                      <div className="relative max-w-sm">
                        <div className="relative bg-black rounded-[2.5rem] p-2 shadow-2xl">
                          <div className="bg-white rounded-[2rem] overflow-hidden">
                            <img 
                              src={helpMeCraftResults} 
                              alt="Help Me Craft Results Screen"
                              className="w-full h-auto object-contain"
                            />
                          </div>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-4">2. Get three perfect replies</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Tones Section */}
          <div className="py-16 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Express Yourself in Any Tone
              </h2>
              <p className="text-lg text-gray-600 mb-12">
                Free beta includes access to our core tones – perfect for every type of dating conversation.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-blue-200">
                  <div className="text-3xl mb-3">😊</div>
                  <h3 className="font-bold text-gray-900 mb-2">Playful</h3>
                  <p className="text-sm text-gray-600">Light and fun responses</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-green-200">
                  <div className="text-3xl mb-3">🤔</div>
                  <h3 className="font-bold text-gray-900 mb-2">Curious</h3>
                  <p className="text-sm text-gray-600">Thoughtful questions</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-purple-200">
                  <div className="text-3xl mb-3">💪</div>
                  <h3 className="font-bold text-gray-900 mb-2">Confident</h3>
                  <p className="text-sm text-gray-600">Self-assured communication</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-pink-200">
                  <div className="text-3xl mb-3">✨</div>
                  <h3 className="font-bold text-gray-900 mb-2">Charming</h3>
                  <p className="text-sm text-gray-600">Smooth and appealing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Who This Is For Section */}
          <div className="py-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl mb-16">
            <div className="max-w-4xl mx-auto text-center px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Perfect for Thoughtful Daters
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Value Connection</h3>
                  <p className="text-gray-600">You care about meaningful conversations and real connection.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Want to Stay Authentic</h3>
                  <p className="text-gray-600">You want help expressing yourself better, without sounding fake or robotic.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Overthink Messages</h3>
                  <p className="text-gray-600">You often know what you want to say, but struggle with how to phrase it just right.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="py-16 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Transform Your Dating Conversations?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Be part of our early access group and help shape the future of confident, enjoyable dating conversations.
              </p>
              
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 text-lg p-4 border-2 border-gray-200 focus:border-blue-500"
                    required
                  />
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg whitespace-nowrap shadow-lg"
                  >
                    {isSubmitting ? 'Joining...' : 'Join Free Beta'}
                  </Button>
                </div>
              </form>

              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Limited spots only
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No spam, ever
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free to try
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