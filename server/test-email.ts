import { sendEmail } from './sendgrid';

async function testEmailSending() {
  console.log('Testing email sending functionality...');
  
  const testEmail = 'your-test-email@example.com'; // Replace with your email for testing
  
  const result = await sendEmail({
    to: testEmail,
    subject: 'MsgMate.AI Email Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">MsgMate.AI Email Test</h2>
        <p>This is a test email to verify that the SendGrid integration is working correctly.</p>
        <p>If you're seeing this, the email sending functionality is working!</p>
        <p>Time sent: ${new Date().toISOString()}</p>
      </div>
    `
  });
  
  if (result) {
    console.log('Test email sent successfully!');
  } else {
    console.log('Failed to send test email.');
  }
}

// Run the test
testEmailSending();