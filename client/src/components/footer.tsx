import Logo from '@/components/ui/logo';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Logo />
              <h3 className="font-medium text-lg">MsgMate.AI</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Your personal AI Wingmate for crafting the perfect messages in any situation.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-all">Home</a></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-white transition-all">Pricing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-all">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-light mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} MsgMate.AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
