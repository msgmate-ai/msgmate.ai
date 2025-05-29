import { sendVerificationEmail } from './resend';

async function testResendEmail() {
  console.log('Testing Resend email integration...');
  
  // Test email address
  const testEmail = 'barryforduk@yahoo.co.uk';
  const testToken = 'test-verification-token-' + Date.now();
  
  console.log(`Sending verification email to ${testEmail} with token: ${testToken}`);
  
  try {
    const result = await sendVerificationEmail(testEmail, testToken);
    
    if (result) {
      console.log('✅ Verification email sent successfully via Resend!');
      console.log(`Check your email inbox at: ${testEmail}`);
      console.log(`The verification link includes token: ${testToken}`);
    } else {
      console.log('❌ Failed to send verification email via Resend');
    }
  } catch (error) {
    console.error('Error testing Resend email:', error);
  }
}

// Run the test
testResendEmail();