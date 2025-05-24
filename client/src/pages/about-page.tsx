import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import msgMateLogo from '@/assets/msgmate-logo.png';

const AboutPage = () => {
  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - About Us";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 flex flex-col items-center">
            <img 
              src={msgMateLogo} 
              alt="MsgMate.AI Logo" 
              className="w-auto h-auto max-w-xs mb-6" 
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-6">About MsgMate.AI</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
              <p className="text-muted-foreground">
                At MsgMate.AI, we're on a mission to transform how people communicate in the digital age. 
                We believe that everyone deserves to express themselves clearly, confidently, and authentically
                in every conversation.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">What We Do</h2>
              <p className="text-muted-foreground mb-3">
                MsgMate.AI is your personal AI-powered messaging assistant that helps you craft the perfect 
                responses for any situation. Whether you're networking professionally, connecting with friends, 
                or navigating complex social situations, our tools help you communicate with confidence.
              </p>
              <p className="text-muted-foreground">
                Our suite of tools includes reply generation in multiple tones, conversation starters, 
                message analysis, and response coaching—all designed to enhance your natural communication style.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Technology</h2>
              <p className="text-muted-foreground">
                MsgMate.AI is powered by advanced AI language models that understand context, tone, and intent. 
                We've developed our technology to provide suggestions that sound natural and authentic to your
                personal style, while helping you communicate more effectively.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Values</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li><span className="font-medium">Authenticity</span> - We help enhance your natural voice, not replace it</li>
                <li><span className="font-medium">Privacy</span> - Your messages and data are handled with the utmost care</li>
                <li><span className="font-medium">Accessibility</span> - Communication tools should be available to everyone</li>
                <li><span className="font-medium">Growth</span> - We're constantly improving our technology to serve you better</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;