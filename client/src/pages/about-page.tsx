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
                At MsgMate.AI, we're dedicated to helping people make meaningful connections through better communication.
                Online dating can be challenging, and finding the right words doesn't always come naturally to everyone.
              </p>
              <p className="text-muted-foreground mt-3">
                Our AI-powered platform helps you craft authentic, engaging messages that represent your personality
                while increasing your chances of making a connection in the dating world.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
              <p className="text-muted-foreground mb-3">
                MsgMate.AI uses the latest in artificial intelligence to help you create messages that stand out
                in your dating conversations. Simply paste a message you've received, choose a tone that matches
                your personality, and our AI will generate thoughtful reply options.
              </p>
              <p className="text-muted-foreground">
                With various subscription tiers, we offer features ranging from basic reply generation to
                advanced conversation starters, message coaching, and detailed message analysis to help you
                improve your dating communication skills over time.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">Features For Dating Success</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li><span className="font-medium">Reply Generator</span> - Create engaging responses to messages in your dating apps</li>
                <li><span className="font-medium">Conversation Starters</span> - Generate intriguing openers based on dating profiles</li>
                <li><span className="font-medium">Message Coach</span> - Get feedback on your messages before you send them</li>
                <li><span className="font-medium">Message Decoder</span> - Understand the subtext and intent behind messages you receive</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-3">Our Values</h2>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li><span className="font-medium">Authenticity</span> - We help you express your true self, not create a false persona</li>
                <li><span className="font-medium">Confidence</span> - We give you the tools to communicate with confidence in dating scenarios</li>
                <li><span className="font-medium">Privacy</span> - Your dating conversations and data are handled with the utmost care</li>
                <li><span className="font-medium">Empowerment</span> - We believe everyone deserves meaningful connections, regardless of natural communication skills</li>
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