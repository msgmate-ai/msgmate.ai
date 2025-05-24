import { useState } from 'react';
import { useSubscription } from '@/hooks/use-subscription';
import { Button } from '@/components/ui/button';
import ConversationStarterModal from '@/components/conversation-starter-modal';
import MessageCoachModal from '@/components/message-coach-modal';
import MessageDecoderModal from '@/components/message-decoder-modal';

const AdditionalTools = () => {
  const { subscription } = useSubscription();
  const [conversationModalOpen, setConversationModalOpen] = useState(false);
  const [messageCoachModalOpen, setMessageCoachModalOpen] = useState(false);
  const [messageDecoderModalOpen, setMessageDecoderModalOpen] = useState(false);

  const hasBasicPlan = subscription && ['basic', 'pro'].includes(subscription.tier);
  const hasProPlan = subscription && subscription.tier === 'pro';

  return (
    <>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-primary mb-6">Additional Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Conversation Starters (Basic+) */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-primary-light p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Conversation Starters</h3>
                <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">Basic+</span>
              </div>
            </div>
            
            <div className="p-5">
              <p className="text-secondary-dark mb-4">
                Generate engaging openers based on interests and profile context.
              </p>
              
              {!hasBasicPlan ? (
                <div className="bg-secondary-light rounded-lg p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-secondary mb-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p className="mb-2 font-medium">This feature requires Basic+ plan</p>
                  <a href="#pricing" className="text-primary hover:underline font-medium">Upgrade to unlock</a>
                </div>
              ) : (
                <Button 
                  onClick={() => setConversationModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                  Use Tool
                </Button>
              )}
            </div>
          </div>
          
          {/* Message Coach (Pro) */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-primary-light p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Message Coach</h3>
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Pro</span>
              </div>
            </div>
            
            <div className="p-5">
              <p className="text-secondary-dark mb-4">
                Get feedback on your drafted messages for tone, clarity, and emotional impact.
              </p>
              
              {!hasProPlan ? (
                <div className="bg-secondary-light rounded-lg p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-secondary mb-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p className="mb-2 font-medium">This feature requires Pro plan</p>
                  <a href="#pricing" className="text-primary hover:underline font-medium">Upgrade to unlock</a>
                </div>
              ) : (
                <Button 
                  onClick={() => setMessageCoachModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                  Use Tool
                </Button>
              )}
            </div>
          </div>
          
          {/* Message Decoder (Pro) */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-primary-light p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Message Decoder</h3>
                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">Pro</span>
              </div>
            </div>
            
            <div className="p-5">
              <p className="text-secondary-dark mb-4">
                Analyze received messages to understand intent, tone, subtext, and how to interpret them.
              </p>
              
              {!hasProPlan ? (
                <div className="bg-secondary-light rounded-lg p-4 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-secondary mb-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p className="mb-2 font-medium">This feature requires Pro plan</p>
                  <a href="#pricing" className="text-primary hover:underline font-medium">Upgrade to unlock</a>
                </div>
              ) : (
                <Button 
                  onClick={() => setMessageDecoderModalOpen(true)}
                  className="w-full bg-primary hover:bg-primary-light text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                  Use Tool
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Modals */}
      <ConversationStarterModal isOpen={conversationModalOpen} onClose={() => setConversationModalOpen(false)} />
      <MessageCoachModal isOpen={messageCoachModalOpen} onClose={() => setMessageCoachModalOpen(false)} />
      <MessageDecoderModal isOpen={messageDecoderModalOpen} onClose={() => setMessageDecoderModalOpen(false)} />
    </>
  );
};

export default AdditionalTools;
