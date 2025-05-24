import { useState } from 'react';
import { Link } from 'wouter';
import Logo from '@/components/ui/logo';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { subscription } = useSubscription();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getPlanLabel = () => {
    if (!subscription) return 'Free';
    
    switch (subscription.tier) {
      case 'basic':
        return 'Basic+';
      case 'pro':
        return 'Pro';
      default:
        return 'Free';
    }
  };

  const getPlanColor = () => {
    if (!subscription) return 'bg-green-500';
    
    switch (subscription.tier) {
      case 'basic':
        return 'bg-yellow-500';
      case 'pro':
        return 'bg-purple-600';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <nav className="bg-primary text-white py-3 px-4 md:px-6 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Logo />
          <div>
            <h1 className="font-medium font-sans text-xl">MsgMate.AI</h1>
            <p className="text-xs text-gray-300">Your personal AI Wingmate</p>
          </div>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="hover:text-gray-300 transition-all">Home</Link>
          <Link href="/#pricing" className="hover:text-gray-300 transition-all">Pricing</Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/account" className="hover:text-gray-300 transition-all flex items-center">
                <span>{user.username}</span>
                <Badge className={`px-2 py-0.5 rounded-full text-xs ml-2 ${getPlanColor()}`}>
                  {getPlanLabel()}
                </Badge>
              </Link>
              <Link href="/account" className="hover:text-gray-300 transition-all">
                My Account
              </Link>
              <Button 
                variant="outline" 
                onClick={handleLogout} 
                className="text-white bg-primary-light hover:bg-primary-dark"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <Link href="/auth">
                <Button variant="outline" className="text-white bg-primary-light hover:bg-primary-dark">
                  Login
                </Button>
              </Link>
              <Link href="/auth">
                <Button className="ml-2 text-primary bg-white hover:bg-gray-100">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile Navigation Button */}
        <button 
          className="md:hidden text-white" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-primary-light mt-2 rounded">
            <Link href="/" className="block px-3 py-2 rounded hover:bg-primary-dark">Home</Link>
            <Link href="/#pricing" className="block px-3 py-2 rounded hover:bg-primary-dark">Pricing</Link>
            
            {user ? (
              <>
                <div className="px-3 py-2">
                  <span>{user.username}</span>
                  <Badge className={`px-2 py-0.5 rounded-full text-xs ml-2 ${getPlanColor()}`}>
                    {getPlanLabel()}
                  </Badge>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-center bg-primary-dark hover:bg-opacity-80 px-3 py-2 rounded mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <button className="w-full text-center bg-primary-dark hover:bg-opacity-80 px-3 py-2 rounded mt-2">
                    Login
                  </button>
                </Link>
                <Link href="/auth">
                  <button className="w-full text-center bg-white text-primary hover:bg-gray-100 px-3 py-2 rounded mt-2">
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
