import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const CookiesPage = () => {
  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Cookie Policy";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last Updated: May 24, 2024</p>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>
                This Cookie Policy explains how MsgMate.AI ("we", "us", or "our") uses cookies and similar technologies 
                on our website and application (collectively, the "Service"). It explains what these technologies are and 
                why we use them, as well as your rights to control our use of them.
              </p>
              <p className="mt-3">
                Please read this Cookie Policy carefully. By using or accessing our Service, you agree to this Cookie Policy. 
                This policy may change from time to time, and your continued use of the Service is deemed to be acceptance of such changes.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently and provide information to the website owners.
              </p>
              <p className="mt-3">
                Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go offline, 
                while session cookies are deleted as soon as you close your web browser.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-medium mb-3">Essential Cookies</h3>
              <p>
                These cookies are necessary for the Service to function properly. They enable core functionality such as security, 
                network management, account authentication, and remembering your preferences. You can disable these by changing 
                your browser settings, but this may affect how the Service functions.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-4">Performance and Analytics Cookies</h3>
              <p>
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our Service. 
                They help us know which pages are the most and least popular and see how visitors move around the site. All information 
                these cookies collect is aggregated and anonymous.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-4">Functionality Cookies</h3>
              <p>
                These cookies enable the Service to provide enhanced functionality and personalization. They may be set by us or by 
                third-party providers whose services we have added to our pages. If you do not allow these cookies, some or all of 
                these services may not function properly.
              </p>
              
              <h3 className="text-xl font-medium mb-3 mt-4">Targeting and Advertising Cookies</h3>
              <p>
                These cookies may be set through our Service by our advertising partners. They may be used by those companies to build 
                a profile of your interests and show you relevant advertisements on other sites. They do not directly store personal 
                information but are based on uniquely identifying your browser and device.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Third-Party Cookies</h2>
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics, deliver 
                advertisements, and so on. These cookies may include:
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li>Analytics cookies from services like Google Analytics</li>
                <li>Payment processing cookies from our payment processor</li>
                <li>Authentication cookies from our authentication service providers</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
              <p>
                Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability 
                of websites to set cookies, you may impair your overall user experience, as it will no longer be personalized to you.
              </p>
              <p className="mt-3">
                Below are links to instructions on how to manage cookies in common web browsers:
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Internet Explorer</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Microsoft Edge</a></li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Do Not Track</h2>
              <p>
                Some browsers have a "Do Not Track" feature that lets you tell websites that you do not want to have your online activities tracked. 
                At this time, we do not respond to browser "Do Not Track" signals, but we continue to review new technologies and may adopt a 
                standard once one is created.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Cookie Policy</h2>
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page 
                and updating the "Last Updated" date. You are advised to review this Cookie Policy periodically for any changes.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at:
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

export default CookiesPage;