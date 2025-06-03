import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { Loader2, Lock } from 'lucide-react';
import { logEvent, AnalyticsEvents } from '@/lib/analytics';

type Reply = {
  id: number;
  text: string;
};

type Mode = 'say-it-better' | 'help-me-craft';

type ToneData = {
  name: string;
  emoji: string;
  intent: string;
};

type ToneGroup = {
  label: string;
  tier: 'free' | 'basic' | 'pro' | 'elite';
  tones: ToneData[];
  comingSoon?: boolean;
};

const toneGroups: ToneGroup[] = [
  {
    label: "💌 First Message",
    tier: "free",
    tones: [
      { name: "Playful", emoji: "😊", intent: "Break the ice with charm and fun." },
      { name: "Curious", emoji: "🤔", intent: "Spark interest with a thoughtful tone." },
      { name: "Confident", emoji: "💪", intent: "Start strong and self-assured." },
      { name: "Charming", emoji: "✨", intent: "Leave a memorable first impression." },
    ],
  },
  {
    label: "💬 Getting to Know Each Other",
    tier: "basic",
    tones: [
      { name: "Flirty", emoji: "😘", intent: "Keep things cheeky and light-hearted." },
      { name: "Authentic", emoji: "💯", intent: "Show your true self, no filters." },
      { name: "Witty", emoji: "😏", intent: "Make them laugh and think." },
      { name: "Supportive", emoji: "🤗", intent: "Offer kindness and care." },
    ],
  },
  {
    label: "💞 Going Deeper",
    tier: "pro",
    tones: [
      { name: "Romantic", emoji: "❤️", intent: "Let your feelings show." },
      { name: "Sincere", emoji: "🙏", intent: "Be honest and open." },
      { name: "Assertive", emoji: "👊", intent: "Speak your truth boldly." },
      { name: "Mysterious", emoji: "🔮", intent: "Keep them intrigued." },
    ],
  },
  {
    label: "🧘 Keeping It Light",
    tier: "elite",
    comingSoon: true,
    tones: [
      { name: "Casual", emoji: "✌️", intent: "Keep it breezy and easy-going." },
      { name: "Supportive", emoji: "🤗", intent: "Show up as their cheerleader." },
      { name: "Authentic", emoji: "💯", intent: "Keep things real and relaxed." },
    ],
  },
];

const ReplyGenerator = () => {
  const [mode, setMode] = useState<Mode>('say-it-better');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [selectedToneGroup, setSelectedToneGroup] = useState<string>('');
  const [replies, setReplies] = useState<Reply[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { subscription, refetchSubscription } = useSubscription();

  // Get stored usage count for non-authenticated users
  const getLocalUsage = () => {
    if (!user) {
      const storedUsage = localStorage.getItem('msgmate_free_usage');
      return storedUsage ? parseInt(storedUsage) : 0;
    }
    return 0;
  };

  // Update local usage for non-authenticated users
  const updateLocalUsage = () => {
    if (!user) {
      const currentUsage = getLocalUsage();
      const newUsage = currentUsage + 1;
      localStorage.setItem('msgmate_free_usage', newUsage.toString());
      // Force a re-render of components that depend on this value
      window.dispatchEvent(new Event('storage'));
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: { message: string; tone: string; intent?: string }) => {
      const res = await apiRequest('POST', '/api/generate-replies', data);
      return res.json();
    },
    onSuccess: (data) => {
      setReplies(data.replies);
      
      // Track analytics event
      logEvent(AnalyticsEvents.MESSAGE_SENT, { 
        tone: selectedTone,
        mode: mode,
        userType: user ? 'authenticated' : 'anonymous',
        tier: subscription?.tier || 'free'
      });
      
      // Update usage tracking
      if (user) {
        refetchSubscription();
      } else {
        updateLocalUsage();
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error generating replies',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const getUserTier = (): 'free' | 'basic' | 'pro' => {
    if (!subscription) return 'free';
    return subscription.tier as 'free' | 'basic' | 'pro';
  };

  const isGroupAccessible = (tier: string): boolean => {
    const userTier = getUserTier();
    if (tier === 'free') return true;
    if (tier === 'basic') return ['basic', 'pro'].includes(userTier);
    if (tier === 'pro') return userTier === 'pro';
    return false; // elite is coming soon
  };

  const handleToneSelect = (groupIndex: number, toneIndex: number) => {
    const group = toneGroups[groupIndex];
    if (!isGroupAccessible(group.tier) || group.comingSoon) return;
    
    setSelectedToneGroup(`${groupIndex}`);
    setSelectedTone(`${groupIndex}-${toneIndex}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'say-it-better') {
      if (!userMessage) {
        toast({
          title: 'Missing message',
          description: 'Please enter what you would like to say',
          variant: 'destructive',
        });
        return;
      }
      
      mutation.mutate({
        message: userMessage,
        tone: 'enhance', // Special tone for enhancement mode
      });
    } else {
      if (!receivedMessage) {
        toast({
          title: 'Missing message',
          description: 'Please enter the message you received',
          variant: 'destructive',
        });
        return;
      }
      
      if (!selectedTone) {
        toast({
          title: 'Missing tone',
          description: 'Please select a tone for your reply',
          variant: 'destructive',
        });
        return;
      }
      
      const [groupIndex, toneIndex] = selectedTone.split('-').map(Number);
      const toneName = toneGroups[groupIndex]?.tones[toneIndex]?.name?.toLowerCase();
      
      mutation.mutate({
        message: receivedMessage,
        tone: toneName || 'friendly',
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Reply copied to clipboard',
    });
  };

  return (
    <section className="bg-white rounded-xl shadow-md p-6 mb-10">
      <h2 className="text-2xl font-semibold text-primary mb-6 flex items-center">
        🧠 <span className="ml-2">Find the Right Words</span>
      </h2>
      
      {/* Mode Selector */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => setMode('say-it-better')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              mode === 'say-it-better' 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-left">
              <h3 className="font-medium mb-1">Say It Better</h3>
              <p className="text-sm text-gray-600">You've got the idea, we'll help you express it.</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMode('help-me-craft')}
            className={`flex-1 p-4 rounded-lg border-2 transition-all ${
              mode === 'help-me-craft' 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-left">
              <h3 className="font-medium mb-1">Help Me Craft a Message</h3>
              <p className="text-sm text-gray-600">Not sure what to say? Let's write it together.</p>
            </div>
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Conditional Input Display */}
        {mode === 'say-it-better' ? (
          <div className="mb-6">
            <label htmlFor="user-message" className="block text-sm font-medium text-secondary-dark mb-1">
              What would you like to say?
            </label>
            <Textarea 
              id="user-message" 
              rows={4} 
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Type your message idea here and we'll help you express it better..."
              required
            />
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="received-message" className="block text-sm font-medium text-secondary-dark mb-1">
                Message you received
              </label>
              <Textarea 
                id="received-message" 
                rows={3} 
                value={receivedMessage}
                onChange={(e) => setReceivedMessage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Paste the message you received here..."
                required
              />
            </div>
            
            {/* Grouped Tone Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-secondary-dark mb-3">
                Choose your reply tone
              </label>
              <div className="space-y-4">
                {toneGroups.map((group, groupIndex) => (
                  <div key={groupIndex} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{group.label}</h4>
                      {!isGroupAccessible(group.tier) && (
                        <div className="flex items-center text-gray-400 text-sm">
                          <Lock className="h-4 w-4 mr-1" />
                          <span className="capitalize">{group.tier}+ Plan</span>
                        </div>
                      )}
                      {group.comingSoon && (
                        <span className="text-gray-400 text-sm">Coming Soon</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.tones.map((tone, toneIndex) => (
                        <button
                          key={toneIndex}
                          type="button"
                          onClick={() => handleToneSelect(groupIndex, toneIndex)}
                          disabled={!isGroupAccessible(group.tier) || group.comingSoon}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedTone === `${groupIndex}-${toneIndex}`
                              ? 'border-primary bg-primary/5 text-primary'
                              : isGroupAccessible(group.tier) && !group.comingSoon
                              ? 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            <span className="mr-2">{tone.emoji}</span>
                            <span className="font-medium">{tone.name}</span>
                            {(!isGroupAccessible(group.tier) || group.comingSoon) && (
                              <Lock className="h-3 w-3 ml-auto" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600">{tone.intent}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Tone Selector Tooltip for Say It Better Mode */}
        {mode === 'say-it-better' && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">
              💡 In "Say It Better" mode, tone selection is not used. We'll enhance your message while preserving your intended meaning.
            </p>
          </div>
        )}
        
        <div className="flex justify-center">
          <Button 
            type="submit"
            className="bg-primary hover:bg-primary-light text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>Generate Replies</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </Button>
        </div>
      </form>
      
      {/* Loading State */}
      {mutation.isPending && (
        <div className="mt-8 flex justify-center">
          <div className="spinner w-10 h-10 border-4 border-secondary-light rounded-full"></div>
          <p className="ml-3 text-secondary">Generating thoughtful replies...</p>
        </div>
      )}
      
      {/* Results Section */}
      {replies.length > 0 && !mutation.isPending && (
        <div className="mt-8">
          <h3 className="text-xl font-medium text-primary mb-4">Generated Replies</h3>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {replies.map((reply, index) => (
              <div key={reply.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-primary">Option {index + 1}</h4>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => copyToClipboard(reply.text)}
                      className="text-secondary hover:text-primary transition-all" 
                      title="Copy to clipboard"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">
                  {reply.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ReplyGenerator;
