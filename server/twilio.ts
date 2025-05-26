import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: twilio.Twilio | null = null;

if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

/**
 * Generate a 6-digit verification code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send SMS verification code to a phone number
 */
export async function sendVerificationSMS(phoneNumber: string, code: string): Promise<boolean> {
  if (!twilioClient || !twilioPhoneNumber) {
    console.error('Twilio not configured - missing credentials or phone number');
    return false;
  }

  try {
    // Format phone number to include country code if not present
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+44${phoneNumber.replace(/^0/, '')}`;
    
    await twilioClient.messages.create({
      body: `Your MsgMate.AI verification code is: ${code}. This code expires in 10 minutes.`,
      from: twilioPhoneNumber,
      to: formattedPhone,
    });

    console.log(`SMS verification code sent to ${formattedPhone}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

/**
 * Check if Twilio is properly configured
 */
export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && twilioPhoneNumber);
}