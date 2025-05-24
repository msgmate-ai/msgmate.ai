import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, X, Copy } from 'lucide-react';

type MessageCoachResult = {
  toneAnalysis: {
    overall: string;
    description: string;
    tags: string[];
  };
  clarity: {
    score: number;
    feedback: string;
  };
  emotionalImpact: {
    tags: string[];
    description: string;
  };
  improvements: string[];
  improvedVersion: string;
};

type MessageCoachModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MessageCoachModal = ({ isOpen, onClose }: MessageCoachModalProps) => {
  const [draftMessage, setDraftMessage] = useState('');
  const [analysis, setAnalysis] = useState<MessageCoachResult | null>(null);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: { message: string }) => {
      const res = await apiRequest('POST', '/api/message-coach', data);
      return res.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
    onError: (error: Error) => {
      toast({
        title: 'Error analyzing message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!draftMessage) {
      toast({
        title: 'Missing message',
        description: 'Please enter your draft message for analysis',
        variant: 'destructive',
      });
      return;
    }
    
    mutation.mutate({
      message: draftMessage,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Improved message copied to clipboard',
    });
  };

  const handleClose = () => {
    setDraftMessage('');
    setAnalysis(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-primary">Message Coach</DialogTitle>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="draft-message" className="block text-sm font-medium text-secondary-dark mb-1">
              Your Draft Message
            </label>
            <Textarea 
              id="draft-message" 
              rows={5} 
              value={draftMessage}
              onChange={(e) => setDraftMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Paste your drafted message here for analysis and feedback..."
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
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Analyze Message</span>
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
            <h4 className="text-lg font-medium text-primary mb-4">Message Analysis</h4>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              <div>
                <h5 className="font-medium text-primary mb-2">Tone Analysis</h5>
                <div className="bg-secondary-light p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="font-medium">Overall Tone:</span>
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{analysis.toneAnalysis.overall}</span>
                  </div>
                  <p className="text-gray-700">
                    {analysis.toneAnalysis.description}
                  </p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-primary mb-2">Clarity & Structure</h5>
                <div className="bg-secondary-light p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="font-medium">Clarity Score:</span>
                    <div className="ml-2 w-24 bg-gray-300 rounded-full h-2.5">
                      <div 
                        className={`${
                          analysis.clarity.score >= 8 
                            ? 'bg-green-500' 
                            : analysis.clarity.score >= 5 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                        } h-2.5 rounded-full`} 
                        style={{ width: `${analysis.clarity.score * 10}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm">{analysis.clarity.score}/10</span>
                  </div>
                  <p className="text-gray-700">
                    {analysis.clarity.feedback}
                  </p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-primary mb-2">Emotional Impact</h5>
                <div className="bg-secondary-light p-4 rounded-lg">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {analysis.emotionalImpact.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className={`${
                          ['Positive', 'Enthusiastic', 'Interested', 'Friendly'].includes(tag)
                            ? 'bg-green-100 text-green-800' 
                            : ['Neutral', 'Curious'].includes(tag)
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                        } text-xs font-medium px-2.5 py-0.5 rounded`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700">
                    {analysis.emotionalImpact.description}
                  </p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-primary mb-2">Suggested Improvements</h5>
                <div className="space-y-2">
                  {analysis.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-primary mb-2">Improved Version</h5>
                <div className="border border-green-300 bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {analysis.improvedVersion}
                  </p>
                  <div className="mt-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(analysis.improvedVersion)}
                      className="text-primary hover:text-primary-light font-medium flex items-center ml-auto"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      <span>Copy improved message</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MessageCoachModal;
