import { MailService } from '@sendgrid/mail';

// Check SendGrid suppression lists and domain reputation
async function checkSendGridStatus() {
  if (!process.env.SENDGRID_API_KEY) {
    console.log('No SendGrid API key found');
    return;
  }

  console.log('Checking SendGrid status and suppressions...');
  
  // Check if Yahoo addresses are being suppressed
  const testYahooAddresses = [
    'barryforduk@yahoo.co.uk',
    'mrbombuk@yahoo.co.uk'
  ];

  for (const email of testYahooAddresses) {
    try {
      // Check suppression lists
      const response = await fetch(`https://api.sendgrid.com/v3/suppression/bounces/${email}`, {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`${email} bounce status:`, data);
      } else if (response.status === 404) {
        console.log(`${email} - Not in bounce suppression list (good)`);
      }
    } catch (error) {
      console.log(`Could not check bounce status for ${email}`);
    }

    try {
      // Check spam reports
      const spamResponse = await fetch(`https://api.sendgrid.com/v3/suppression/spam_reports/${email}`, {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
        }
      });
      
      if (spamResponse.ok) {
        const spamData = await spamResponse.json();
        console.log(`${email} spam report:`, spamData);
      } else if (spamResponse.status === 404) {
        console.log(`${email} - No spam reports (good)`);
      }
    } catch (error) {
      console.log(`Could not check spam reports for ${email}`);
    }
  }
}

// Run the check
checkSendGridStatus();