import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const PrivacyPage = () => {
  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Privacy Policy";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last Updated: May 24, 2024</p>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>
                At MsgMate.AI ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal information.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our MsgMate.AI service and website (collectively, the "Service").
              </p>
              <p className="mt-3">
                Please read this Privacy Policy carefully. By accessing or using our Service, you acknowledge that you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
                If you do not agree with our policies, please do not access or use our Service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3">Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>Register for an account</li>
                <li>Subscribe to our service</li>
                <li>Request assistance or customer support</li>
                <li>Provide feedback or contact us</li>
              </ul>
              <p>This information may include:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Username and password</li>
                <li>Payment information (processed securely through our payment processor)</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3">Message Content</h3>
              <p>
                When you use our Service to generate replies, analyze messages, or create conversation starters, we process the content 
                you provide. This may include messages you've received, messages you're drafting, and context you provide about the communication.
              </p>
              <p className="mt-3">
                We use this content solely to provide our service functionality. We do not permanently store message content after it has been processed 
                unless you explicitly save it to your account.
              </p>
              
              <h3 className="text-xl font-medium mb-3">Usage Data</h3>
              <p>
                We automatically collect certain information when you visit, use, or navigate our Service. This information may include:
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li>Device and browser information</li>
                <li>IP address</li>
                <li>Pages visited and features used</li>
                <li>Time and date of your visit</li>
                <li>Other technical information</li>
              </ul>
              <p>
                This information is used to maintain, optimize, and improve our Service, and for security purposes.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p>We use the information we collect for various purposes, including to:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and manage your account</li>
                <li>Respond to your requests, comments, or questions</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Monitor usage patterns and analyze trends</li>
                <li>Protect against unauthorized access and fraud</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Sharing Your Information</h2>
              <p>We may share your information in the following situations:</p>
              <ul className="list-disc pl-5 mb-4">
                <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party vendors, service providers, and other business partners who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting, and customer service.</li>
                <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with a merger, acquisition, reorganization, or sale of all or a portion of our assets.</li>
                <li><strong>With Your Consent:</strong> We may disclose your information for any other purpose with your consent.</li>
              </ul>
              <p>
                We do not sell your personal information to third parties.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect the security of your personal information. 
                However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and 
                we cannot guarantee absolute security.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Data Rights</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul className="list-disc pl-5 mb-4">
                <li>The right to access the personal information we have about you</li>
                <li>The right to request correction of inaccurate information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to object to or restrict processing of your personal information</li>
                <li>The right to data portability</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided at the end of this policy.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p>
                Our Service is not directed to individuals under the age of 16. We do not knowingly collect personal information 
                from children. If you are a parent or guardian and believe your child has provided us with personal information, 
                please contact us, and we will take steps to remove that information.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
                on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> privacy@msgmate.ai
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;