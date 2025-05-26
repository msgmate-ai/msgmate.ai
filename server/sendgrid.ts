import { MailService } from '@sendgrid/mail';

// Log whether the SendGrid API key is present (without revealing the actual key)
console.log("SendGrid key present:", !!process.env.SENDGRID_API_KEY);

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

// Create a from email that uses the domain of your app
// This should be a domain-authenticated sender in SendGrid
// Ensure this matches exactly with the authenticated sender in SendGrid dashboard
const FROM_EMAIL = 'noreply@msgmate.ai';

export async function sendEmail(params: EmailParams): Promise<boolean> {
  console.log("Attempting to send email to:", params.to);
  
  try {
    await mailService.send({
      to: params.to,
      from: FROM_EMAIL,
      replyTo: 'msgmateai@gmail.com', // Add reply-to address to improve deliverability
      subject: params.subject,
      text: params.text || ' ', // Ensure at least one character
      html: params.html || '<p> </p>', // Ensure at least one character
      // Add headers to improve email deliverability
      headers: {
        'X-Priority': '1',
        'Importance': 'high',
        'X-MSMail-Priority': 'High'
      }
    });
    console.log("Email sent successfully to:", params.to);
    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    if (error.response && error.response.body) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body));
    }
    return false;
  }
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  // Use the main domain for verification links to avoid subdomain issues
  const baseUrl = 'https://msgmate.ai';
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Verify Your MsgMate.AI Account',
    text: `Welcome to MsgMate.AI! 

Thank you for signing up! Please verify your email address to activate your account.

Click this link to verify your email: ${verificationLink}

If you did not create an account, you can safely ignore this email.

Best regards,
The MsgMate.AI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Welcome to MsgMate.AI</h2>
        <p>Thank you for signing up! Please verify your email address to activate your account.</p>
        <div style="margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4f46e5;">${verificationLink}</p>
        <p>If you did not create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The MsgMate.AI Team</p>
      </div>
    `
  });
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const baseUrl = 'https://msgmate.ai';
  
  return sendEmail({
    to: email,
    subject: 'Welcome to MsgMate.AI!',
    text: `Welcome to MsgMate.AI!

Thank you for joining MsgMate.AI, your AI-powered messaging assistant. We're excited to help you craft perfect replies for your dating conversations.

Getting Started:
- Generate replies in multiple tones
- Create engaging conversation starters
- Analyze messages to understand their tone and intent

Start using MsgMate.AI: ${baseUrl}

If you have any questions or need assistance, please reply to this email.

Best regards,
The MsgMate.AI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Welcome to MsgMate.AI!</h2>
        <p>Thank you for joining MsgMate.AI, your AI-powered messaging assistant. We're excited to help you craft perfect replies for your dating conversations.</p>
        
        <h3 style="color: #4f46e5; margin-top: 30px;">Getting Started</h3>
        <ul>
          <li>Generate replies in multiple tones</li>
          <li>Create engaging conversation starters</li>
          <li>Analyze messages to understand their tone and intent</li>
        </ul>
        
        <div style="margin: 30px 0;">
          <a href="${baseUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Start Using MsgMate.AI</a>
        </div>
        
        <p>If you have any questions or need assistance, please reply to this email.</p>
        <p>Best regards,<br>The MsgMate.AI Team</p>
      </div>
    `
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const baseUrl = 'https://msgmate.ai';
  const resetLink = `${baseUrl}/reset-password?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Reset Your MsgMate.AI Password',
    text: `Reset Your MsgMate.AI Password

We received a request to reset your password. If you didn't make this request, you can safely ignore this email.

Click this link to reset your password: ${resetLink}

This link will expire in 1 hour for security reasons.

Best regards,
The MsgMate.AI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Reset Your Password</h2>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #4f46e5;">${resetLink}</p>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>Best regards,<br>The MsgMate.AI Team</p>
      </div>
    `
  });
}

export async function sendSubscriptionConfirmationEmail(email: string, tier: string): Promise<boolean> {
  const tierName = tier === 'pro' ? 'Pro' : 'Basic+';
  const monthlyMessages = tier === 'pro' ? '400' : '100';
  const baseUrl = 'https://msgmate.ai';
  
  return sendEmail({
    to: email,
    subject: `Your MsgMate.AI ${tierName} Subscription is Active!`,
    text: `Your MsgMate.AI ${tierName} Subscription is Active!

Thank you for subscribing to MsgMate.AI ${tierName} Plan!

Your Subscription Details:
- Plan: ${tierName}
- Messages: ${monthlyMessages} per month
- Status: Active

You now have access to all ${tierName} features:
${tier === 'pro' ? `
- 400 messages per month
- All 15 messaging tones
- Conversation Starters
- Message Coach
- Message Decoder
` : `
- 100 messages per month
- 10 messaging tones
- Conversation Starters
`}

Manage your subscription: ${baseUrl}/account

Best regards,
The MsgMate.AI Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(to right, #4f46e5, #7c3aed); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Subscription Confirmed!</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <p>Thank you for subscribing to MsgMate.AI <strong>${tierName} Plan</strong>!</p>
          
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h2 style="color: #4f46e5; margin-top: 0;">Your Subscription Details</h2>
            <p><strong>Plan:</strong> ${tierName}</p>
            <p><strong>Messages:</strong> ${monthlyMessages} per month</p>
            <p><strong>Status:</strong> Active</p>
          </div>
          
          <p>You now have access to all ${tierName} features:</p>
          <ul>
            ${tier === 'pro' ? `
            <li>400 messages per month</li>
            <li>All 15 messaging tones</li>
            <li>Conversation Starters</li>
            <li>Message Coach</li>
            <li>Message Decoder</li>
            ` : `
            <li>100 messages per month</li>
            <li>10 messaging tones</li>
            <li>Conversation Starters</li>
            `}
          </ul>
          
          <div style="margin: 30px 0;">
            <a href="${baseUrl}/account" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Manage Your Subscription</a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
            <p>Best regards,<br>The MsgMate.AI Team</p>
          </div>
        </div>
      </div>
    `
  });
}