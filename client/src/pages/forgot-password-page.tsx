import { useState } from 'react';
import { Link } from 'wouter';
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
import { Loader2, MailCheck } from 'lucide-react';

const forgotPasswordSchema = z.object({
  username: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Set page title
  document.title = "MsgMate.AI - Forgot Password";

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await apiRequest('POST', '/api/forgot-password', values);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsSuccess(true);
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to process request. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      console.error('Forgot password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <CardTitle>Reset Your Password</CardTitle>
            <CardDescription>
              {isSuccess ? 
                'Check your email for reset instructions' : 
                'Enter your email address and we will send you a password reset link'}
            </CardDescription>
          </CardHeader>
          
          {isSuccess ? (
            <CardContent className="flex flex-col items-center py-6">
              <MailCheck className="h-12 w-12 text-primary mb-4" />
              <p className="text-center">
                If an account exists with the email you entered, we've sent password reset instructions.
                Please check your inbox and spam folder.
              </p>
            </CardContent>
          ) : (
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="you@example.com" 
                            type="email" 
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
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          )}
          
          <CardFooter className="flex justify-center">
            <Link href="/auth">
              <Button variant="link">Back to Login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;