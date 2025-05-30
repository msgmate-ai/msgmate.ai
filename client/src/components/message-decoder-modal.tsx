import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X } from 'lucide-react';
import { logEvent, AnalyticsEvents } from '@/lib/analytics';

type MessageDecoderResult = {
  interpretation: string;
  tone: string[];
  intent: string;
  subtext: string[];
  responseStrategy: string;
  suggestedResponse: string;
};

type MessageDecoderModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MessageDecoderModal = ({ isOpen, onClose }: MessageDecoderModalProps) => {
  const [receivedMessage, setReceivedMessage] = useState('');
  const [analysis, setAnalysis] = useState<MessageDecoderResult | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      const res = await apiRequest('POST', '/api/message-decoder', data);
      return res.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
      
      // Track analytics event
      logEvent(AnalyticsEvents.MESSAGE_DECODED, { 
        messageLength: receivedMessage.length,
        intent: data.intent || 'unknown',
        toneCount: data.tone?.length || 0
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error decoding message',
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
        description: 'Please enter the message you received for analysis',
        variant: 'destructive',
      });
      return;
    }
    
    mutation.mutate({
      message: receivedMessage,
    });
  };

  const handleClose = () => {
    setReceivedMessage('');
    setAnalysis(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-primary">Message Decoder</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="received-message-decode" className="block text-sm font-medium text-secondary-dark mb-1">
              Message You Received
            </label>
            <Textarea 
              id="received-message-decode" 
              rows={5} 
              value={receivedMessage}
              onChange={(e) => setReceivedMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Paste the message you received that you'd like to analyze..."
              required
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
                  <span>Decoding...</span>
                </>
              ) : (
                <>
                  <span>Decode Message</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </form>
        
        {/* Results Section */}
        {analysis && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-lg font-medium text-primary mb-4">Message Decoded</h4>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              <div>
                <h5 className="font-medium text-primary mb-2">Overall Interpretation</h5>
                <div className="bg-secondary-light p-4 rounded-lg">
                  <p className="text-gray-700">
                    {analysis.interpretation}
                  </p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-primary mb-2">Detected Tone</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.tone.map((tone, index) => (
                    <span 
                      key={index}
                      className={`${
                        ['Positive', 'Enthusiastic', 'Friendly'].includes(tone)
                          ? 'bg-green-100 text-green-800' 
                          : ['Cautious', 'Neutral', 'Polite'].includes(tone)
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                      } text-xs font-medium px-2.5 py-0.5 rounded`}
                    >
                      {tone}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-primary mb-2">Possible Intent</h5>
                <div className="bg-secondary-light p-4 rounded-lg">
                  <p className="text-gray-700">
                    {analysis.intent}
                  </p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-primary mb-2">Subtext Analysis</h5>
                <div className="space-y-3">
                  {analysis.subtext.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-primary mb-2">How to Respond</h5>
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {analysis.responseStrategy}
                  </p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-primary mb-2">Suggested Response Strategy</h5>
                <div className="bg-white border border-green-300 p-4 rounded-lg">
                  <p className="text-gray-800 font-medium">
                    {analysis.suggestedResponse}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MessageDecoderModal;
