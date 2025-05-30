import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { insertUserSchema } from '@shared/schema';
import Logo from '@/components/ui/logo';
import { logEvent, AnalyticsEvents } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

const loginSchema = insertUserSchema.extend({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<string>('login');
  const { user, loginMutation, registerMutation, isLoading } = useAuth();
  const [, navigate] = useLocation();
  const [sessionExpired, setSessionExpired] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Log in or Sign up";
  }, []);

  // Check for session expiration parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('expired') === 'true') {
      setSessionExpired(true);
      // Clear the URL parameter
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onLoginSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    const { confirmPassword, ...userData } = values;
    registerMutation.mutate(userData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-light flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-light flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Authentication Form */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2">
              <Logo />
              <div>
                <h1 className="font-medium text-xl text-primary">MsgMate.AI</h1>
                <p className="text-xs text-secondary">Your personal AI Wingmate</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Login to MsgMate.AI</CardTitle>
                  <CardDescription>
                    Enter your details to access your account
                  </CardDescription>
                  {sessionExpired && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
                      <p className="text-sm text-yellow-800">
                        Your session has expired. Please log in again.
                      </p>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                        {loginMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          'Login'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex flex-col items-center space-y-2">
                  <Link href="/forgot-password">
                    <Button variant="link" className="text-sm">
                      Forgot your password?
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Sign up to start using MsgMate.AI
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormDescription>
                              Password must be at least 6 characters long
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
                        {registerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-muted-foreground text-center w-full">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms">
                      <Button variant="link" className="text-xs p-0 h-auto">
                        Terms of Service
                      </Button>
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy">
                      <Button variant="link" className="text-xs p-0 h-auto">
                        Privacy Policy
                      </Button>
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Features Showcase */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Your AI Wingmate for Perfect Messages</h2>
            <p className="text-xl text-primary-light opacity-90">
              Transform your dating conversations with AI-powered message crafting, tone analysis, and conversation starters.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Smart Reply Generation</h3>
                <p className="text-gray-300">Get personalized message suggestions in any tone</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Message Analysis</h3>
                <p className="text-gray-300">Understand tone, sentiment, and improve your communication</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Conversation Starters</h3>
                <p className="text-gray-300">Break the ice with engaging opening messages</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h3 className="font-semibold text-lg">Advanced Analysis</h3>
                <p className="text-gray-300">Get insights and improve your communication skills</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-primary-light rounded-lg">
            <p className="italic">
              "MsgMate.AI has completely transformed how I communicate online. The perfect wingmate for any conversation."
            </p>
            <p className="text-right mt-2 font-medium">— Sarah T.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;