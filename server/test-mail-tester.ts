import { sendVerificationEmail } from './sendgrid';

async function testWithMailTester() {
  console.log('Testing email deliverability with mail-tester.com...');
  
  // Generate a unique mail-tester address
  const timestamp = Date.now();
  const mailTesterEmail = `test-${timestamp}@mail-tester.com`;
  const testToken = 'test-token-' + timestamp;
  
  console.log(`Sending test email to: ${mailTesterEmail}`);
  console.log('After sending, visit: https://www.mail-tester.com/ to check the spam score');
  
  try {
    const result = await sendVerificationEmail(mailTesterEmail, testToken);
    
    if (result) {
      console.log('✅ Test email sent successfully to mail-tester!');
      console.log('📧 Check your spam score at: https://www.mail-tester.com/');
      console.log('🔍 Look for any issues with:');
      console.log('   - SPF/DKIM/DMARC authentication');
      console.log('   - Content spam score');
      console.log('   - Sender reputation');
      console.log('   - Blacklist status');
    } else {
      console.log('❌ Failed to send test email to mail-tester');
    }
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

// Run the test
testWithMailTester();