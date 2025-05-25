import { sendVerificationEmail } from './sendgrid';

/**
 * Test script for email verification
 * This allows testing email verification without needing to create a new user account
 */
async function testVerificationEmail() {
  console.log('Testing verification email sending...');
  
  // Replace with an email you can access to test the verification flow
  const testEmail = 'barryforduk@yahoo.co.uk';
  // Generate a fake verification token for testing
  const testToken = 'test-verification-token-' + Date.now();
  
  console.log(`Sending verification email to ${testEmail} with token: ${testToken}`);
  
  try {
    const result = await sendVerificationEmail(testEmail, testToken);
    
    if (result) {
      console.log('✅ Verification email sent successfully!');
      console.log(`Check your email inbox (including spam folder) at: ${testEmail}`);
      console.log(`The verification link will include the token: ${testToken}`);
    } else {
      console.log('❌ Failed to send verification email');
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

// Run the test
testVerificationEmail();