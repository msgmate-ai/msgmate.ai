import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const ContactPage = () => {
  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Contact Us";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be handled here in a real implementation
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <p className="text-muted-foreground mb-8">
            Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <Input 
                  id="name"
                  type="text" 
                  placeholder="Your name" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Your email address" 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium">
                Subject
              </label>
              <Input 
                id="subject"
                type="text" 
                placeholder="What is your message about?" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <Textarea 
                id="message"
                placeholder="Your message" 
                rows={6} 
                required 
              />
            </div>
            
            <Button type="submit" className="w-full md:w-auto">
              Send Message
            </Button>
          </form>
          
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">support@msgmate.ai</p>
              </div>
              
              <div>
                <h3 className="font-medium">Business Hours</h3>
                <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 5:00 PM GMT</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;