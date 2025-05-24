import { useEffect } from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const TermsPage = () => {
  // Set page title
  useEffect(() => {
    document.title = "MsgMate.AI - Terms of Service";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-6">Last Updated: May 24, 2024</p>
          
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p>
                Welcome to MsgMate.AI. These Terms of Service ("Terms") govern your access to and use of our website, applications, 
                and services (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms. 
                If you disagree with any part of the Terms, you may not access the Service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p>
                MsgMate.AI provides an AI-powered messaging assistant designed to help users craft effective communications for dating and 
                social interactions. Our features include reply generation, conversation starters, message analysis, and coaching.
              </p>
              <p className="mt-3">
                We offer different subscription tiers with varying features and usage limits. The specifics of each subscription tier 
                are described on our Pricing page.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <p>
                To access certain features of the Service, you must register for an account. When you register, you agree to provide 
                accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account 
                credentials and for all activities that occur under your account.
              </p>
              <p className="mt-3">
                You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We cannot 
                and will not be liable for any loss or damage arising from your failure to comply with this section.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payment</h2>
              <p>
                Certain aspects of the Service require payment through a subscription. By subscribing to MsgMate.AI, you agree to pay 
                all fees associated with your subscription. All payments are processed securely through our payment processor.
              </p>
              <p className="mt-3">
                Subscriptions automatically renew unless canceled at least 24 hours before the end of the current billing period. 
                You can cancel your subscription at any time through your account settings.
              </p>
              <p className="mt-3">
                We reserve the right to change our subscription fees at any time, upon reasonable notice. If you do not agree to any 
                fee changes, you must cancel your subscription before it renews under the new fee structure.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. User Content and Conduct</h2>
              <p>
                Our Service allows you to input and process messages and other content ("User Content"). You retain all rights to your 
                User Content, but you grant us a non-exclusive, transferable, sublicensable, royalty-free, worldwide license to use, 
                store, and process your User Content solely for the purpose of providing and improving the Service.
              </p>
              <p className="mt-3">
                You are solely responsible for your User Content and the consequences of sharing or publishing it. You represent and 
                warrant that:
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li>You own or have the necessary rights to your User Content</li>
                <li>Your User Content does not violate the privacy rights, publicity rights, copyright, contractual rights, or any other rights of any person</li>
                <li>Your User Content does not contain harmful, offensive, or illegal material</li>
              </ul>
              <p>
                We reserve the right to remove any User Content that violates these Terms or that we find objectionable for any reason.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Prohibited Uses</h2>
              <p>
                You agree not to use the Service:
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To send, upload, or distribute any content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
                <li>To impersonate or attempt to impersonate MsgMate.AI, its employees, or other users</li>
                <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service</li>
                <li>To use the Service for any commercial solicitation purposes without our express consent</li>
                <li>To generate content that is intended to harm, deceive, or manipulate others</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
              <p>
                The Service and its original content (excluding User Content), features, and functionality are and will remain the 
                exclusive property of MsgMate.AI and its licensors. The Service is protected by copyright, trademark, and other laws.
              </p>
              <p className="mt-3">
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written 
                consent of MsgMate.AI.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. 
                WE EXPRESSLY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
                PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p className="mt-3">
                We do not guarantee that the Service will be uninterrupted, timely, secure, or error-free, or that the results obtained 
                from the use of the Service will be accurate or reliable.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
              <p>
                IN NO EVENT SHALL MSGMATE.AI, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY 
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, 
                USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless MsgMate.AI and its licensees and licensors, and their employees, 
                contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, 
                liabilities, costs, or debt, and expenses (including but not limited to attorney's fees) arising from your use of 
                the Service or your violation of these Terms.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, 
                for any reason, including without limitation if you breach the Terms.
              </p>
              <p className="mt-3">
                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, 
                you may simply discontinue using the Service or delete your account through the account settings.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at 
                least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined 
                at our sole discretion.
              </p>
              <p className="mt-3">
                By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United Kingdom, without regard 
                to its conflict of law provisions.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> legal@msgmate.ai
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;