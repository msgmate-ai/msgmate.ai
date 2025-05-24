import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/logo';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const VerifyEmailPage = () => {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [, params] = useLocation();
  
  // Extract token from URL query parameter
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  useEffect(() => {
    document.title = "MsgMate.AI - Verify Email";
    
    const verifyEmail = async () => {
      if (!token) {
        setIsVerifying(false);
        setErrorMessage('Invalid verification link. No token provided.');
        return;
      }

      try {
        const response = await apiRequest('GET', `/api/verify-email/${token}`);
        const data = await response.json();
        
        setIsVerifying(false);
        if (response.ok) {
          setIsSuccess(true);
        } else {
          setErrorMessage(data.message || 'Failed to verify email.');
        }
      } catch (error) {
        setIsVerifying(false);
        setErrorMessage('An error occurred during verification. Please try again.');
        console.error('Email verification error:', error);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen bg-secondary-light flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Logo />
            <div>
              <h1 className="font-medium text-xl text-primary">MsgMate.AI</h1>
              <p className="text-xs text-secondary">Your personal AI Wingmate</p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>
              {isVerifying ? 'Verifying your email address...' : 
                isSuccess ? 'Your email has been verified!' : 'There was a problem verifying your email.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-6">
            {isVerifying ? (
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            ) : isSuccess ? (
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            ) : (
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
            )}
            
            <p className="text-center">
              {isVerifying ? 'Please wait while we verify your email address.' : 
                isSuccess ? 'Thank you for verifying your email address. Your account is now fully activated.' : 
                errorMessage}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            {!isVerifying && (
              <Link href="/auth">
                <Button>{isSuccess ? 'Go to Login' : 'Back to Login'}</Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;