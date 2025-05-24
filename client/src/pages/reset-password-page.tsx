import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import Logo from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();
  
  // Extract token from URL query parameter
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Reset Password";
  }, []);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast({
        title: 'Error',
        description: 'Reset token is missing. Please use the link from your email.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiRequest('POST', '/api/reset-password', {
        token,
        password: values.password,
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        setIsError(true);
        setErrorMessage(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show error if no token is provided
  if (!token && !isSuccess && !isError) {
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
              <CardTitle>Invalid Reset Link</CardTitle>
              <CardDescription>
                The password reset link is invalid or expired.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-center">
                Please request a new password reset link.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link href="/forgot-password">
                <Button>Request New Link</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

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
            <CardTitle>
              {isSuccess ? 'Password Reset Successful' : isError ? 'Password Reset Failed' : 'Reset Your Password'}
            </CardTitle>
            <CardDescription>
              {isSuccess ? 'Your password has been updated.' : 
               isError ? 'There was a problem resetting your password.' : 
               'Enter your new password below'}
            </CardDescription>
          </CardHeader>
          
          {isSuccess ? (
            <CardContent className="flex flex-col items-center py-6">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-center">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
            </CardContent>
          ) : isError ? (
            <CardContent className="flex flex-col items-center py-6">
              <XCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-center">
                {errorMessage}
              </p>
            </CardContent>
          ) : (
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            disabled={isSubmitting}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            disabled={isSubmitting}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          )}
          
          <CardFooter className="flex justify-center">
            <Link href="/auth">
              <Button variant="link">
                {isSuccess ? 'Go to Login' : 'Back to Login'}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;