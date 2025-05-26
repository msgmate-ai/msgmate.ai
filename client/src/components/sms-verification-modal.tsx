import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

type SMSVerificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type SMSStep = 'phone' | 'code' | 'success';

export function SMSVerificationModal({ isOpen, onClose, onSuccess }: SMSVerificationModalProps) {
  const [step, setStep] = useState<SMSStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const { toast } = useToast();

  const sendSMSMutation = useMutation({
    mutationFn: async (phone: string) => {
      const response = await apiRequest('POST', '/api/send-sms-verification', {
        phoneNumber: phone
      });
      return response.json();
    },
    onSuccess: () => {
      setStep('code');
      toast({
        title: "SMS Sent",
        description: "Check your phone for the verification code",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send SMS verification code",
        variant: "destructive",
      });
    },
  });

  const verifySMSMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('POST', '/api/verify-sms', {
        code: code
      });
      return response.json();
    },
    onSuccess: () => {
      setStep('success');
      toast({
        title: "Phone Verified!",
        description: "Your account has been successfully verified",
      });
      setTimeout(() => {
        onSuccess();
        onClose();
        resetModal();
      }, 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired verification code",
        variant: "destructive",
      });
    },
  });

  const resetModal = () => {
    setStep('phone');
    setPhoneNumber('');
    setVerificationCode('');
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid UK phone number",
        variant: "destructive",
      });
      return;
    }
    sendSMSMutation.mutate(phoneNumber);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 6-digit verification code",
        variant: "destructive",
      });
      return;
    }
    verifySMSMutation.mutate(verificationCode);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Phone Verification
          </DialogTitle>
          <DialogDescription>
            {step === 'phone' && "Enter your phone number to receive a verification code"}
            {step === 'code' && "Enter the 6-digit code sent to your phone"}
            {step === 'success' && "Your phone has been verified successfully!"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="07123 456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground">
                  We'll send a verification code to this number
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={sendSMSMutation.isPending}
              >
                {sendSMSMutation.isPending ? (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2 animate-pulse" />
                    Sending SMS...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Verification Code
                  </>
                )}
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-center text-lg tracking-wider"
                  maxLength={6}
                />
                <p className="text-sm text-muted-foreground">
                  Code sent to {phoneNumber}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep('phone')}
                  className="flex-1"
                >
                  Change Number
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1" 
                  disabled={verifySMSMutation.isPending}
                >
                  {verifySMSMutation.isPending ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Your account is now verified and ready to use!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}