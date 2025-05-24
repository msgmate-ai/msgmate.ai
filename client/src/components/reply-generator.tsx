import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { Loader2 } from 'lucide-react';
import { getTones } from '@/lib/tones';

type Reply = {
  id: number;
  text: string;
};

const ReplyGenerator = () => {
  const [receivedMessage, setReceivedMessage] = useState('');
  const [selectedTone, setSelectedTone] = useState('friendly');
  const [replyIntent, setReplyIntent] = useState('');
  const [replies, setReplies] = useState<Reply[]>([]);
  const [showLockedToneMessage, setShowLockedToneMessage] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { subscription } = useSubscription();

  const mutation = useMutation({
    mutationFn: async (data: { message: string; tone: string; intent?: string }) => {
      const res = await apiRequest('POST', '/api/generate-replies', data);
      return res.json();
    },
    onSuccess: (data) => {
      setReplies(data.replies);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error generating replies',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    mutation.mutate({
      message: receivedMessage,
      tone: selectedTone,
      intent: replyIntent || undefined,
    });
  };

  const handleToneChange = (value: string) => {
    const { freeTones, basicTones, proTones } = getTones();
    const allTones = [...freeTones, ...basicTones, ...proTones];
    const selectedToneObj = allTones.find(tone => tone.value === value);
    
    if (!selectedToneObj) return;
    
    // Check if tone is locked based on subscription
    let toneLocked = false;
    
    if (selectedToneObj.tier === 'basic' && (!subscription || subscription.tier === 'free')) {
      toneLocked = true;
    } else if (selectedToneObj.tier === 'pro' && (!subscription || ['free', 'basic'].includes(subscription.tier))) {
      toneLocked = true;
    }
    
    if (toneLocked) {
      setShowLockedToneMessage(true);
      return;
    }
    
    setShowLockedToneMessage(false);
    setSelectedTone(value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Reply copied to clipboard',
    });
  };

  const { freeTones, basicTones, proTones } = getTones();

  return (
    <section className="bg-white rounded-xl shadow-md p-6 mb-10">
      <h2 className="text-2xl font-semibold text-primary mb-6">Reply Generator: Get help with your reply</h2>
      
      <form onSubmit={handleSubmit}>
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
        
        <div className="mb-4">
          <label htmlFor="tone-selector" className="block text-sm font-medium text-secondary-dark mb-1">
            Choose your reply tone
          </label>
          <Select defaultValue={selectedTone} onValueChange={handleToneChange}>
            <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Free Tones</SelectLabel>
                {freeTones.map(tone => (
                  <SelectItem key={tone.value} value={tone.value}>{tone.label}</SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Basic+ Tones</SelectLabel>
                {basicTones.map(tone => (
                  <SelectItem 
                    key={tone.value} 
                    value={tone.value}
                    disabled={!subscription || subscription.tier === 'free'}
                  >
                    {tone.label} {(!subscription || subscription.tier === 'free') ? '🔒' : ''}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Pro Tones</SelectLabel>
                {proTones.map(tone => (
                  <SelectItem 
                    key={tone.value} 
                    value={tone.value}
                    disabled={!subscription || ['free', 'basic'].includes(subscription.tier)}
                  >
                    {tone.label} {(!subscription || ['free', 'basic'].includes(subscription.tier)) ? '🔒' : ''}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {showLockedToneMessage && (
            <p className="text-xs text-secondary mt-1">
              This tone is available on higher tiers. <a href="#pricing" className="text-primary hover:underline">Upgrade your plan</a> to unlock.
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="reply-intent" className="block text-sm font-medium text-secondary-dark mb-1">
            Have a rough idea of what you want to say? <span className="text-secondary text-xs">(Optional)</span>
          </label>
          <Textarea 
            id="reply-intent" 
            rows={2} 
            value={replyIntent}
            onChange={(e) => setReplyIntent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Write your message and we will help you say it better"
          />
        </div>
        
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
          
          <div className="space-y-4">
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
