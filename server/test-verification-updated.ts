import { sendVerificationEmail } from './sendgrid';

/**
 * Test script for email verification after domain re-authentication
 * This allows testing email verification with the newly authenticated domain
 */
async function testVerificationWithUpdatedDomain() {
  console.log('Testing verification email with updated domain authentication...');
  
  // Replace with an email you can access to test the verification flow
  const testEmail = 'mrbombuk@yahoo.co.uk';
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
testVerificationWithUpdatedDomain();