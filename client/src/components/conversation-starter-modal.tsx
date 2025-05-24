import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, Copy } from 'lucide-react';

type ConversationStarter = {
  id: number;
  text: string;
};

type ConversationStarterModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ConversationStarterModal = ({ isOpen, onClose }: ConversationStarterModalProps) => {
  const [profileContext, setProfileContext] = useState('');
  const [interests, setInterests] = useState('');
  const [starters, setStarters] = useState<ConversationStarter[]>([]);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: { profileContext: string; interests?: string }) => {
      const res = await apiRequest('POST', '/api/conversation-starters', data);
      return res.json();
    },
    onSuccess: (data) => {
      setStarters(data.starters);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error generating conversation starters',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileContext) {
      toast({
        title: 'Missing profile context',
        description: 'Please enter profile information to generate conversation starters',
        variant: 'destructive',
      });
      return;
    }
    
    mutation.mutate({
      profileContext,
      interests: interests || undefined,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Conversation starter copied to clipboard',
    });
  };

  const handleClose = () => {
    setProfileContext('');
    setInterests('');
    setStarters([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-primary">Conversation Starters</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="profile-context" className="block text-sm font-medium text-secondary-dark mb-1">
              Their Profile Context
            </label>
            <Textarea 
              id="profile-context" 
              rows={3} 
              value={profileContext}
              onChange={(e) => setProfileContext(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Paste their profile info, bio, or anything you know about them..."
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="your-interests" className="block text-sm font-medium text-secondary-dark mb-1">
              Your Interests (Optional)
            </label>
            <Input 
              id="your-interests" 
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="e.g., hiking, photography, travel, cooking, music"
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
                  <span>Generate Conversation Starters</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </form>
        
        {/* Results Section */}
        {starters.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-medium text-primary mb-4">Generated Conversation Starters</h4>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {starters.map((starter, index) => (
                <div key={starter.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-primary">Starter #{index + 1}</h5>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(starter.text)}
                      className="text-secondary hover:text-primary transition-all h-8 w-8 p-0"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-gray-700">
                    {starter.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConversationStarterModal;
