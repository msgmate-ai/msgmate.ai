import { MailService } from '@sendgrid/mail';

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
const FROM_EMAIL = 'noreply@msgmate.ai';

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: FROM_EMAIL,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const baseUrl = process.env.APP_URL || 'http://localhost:5000';
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Verify Your MsgMate.AI Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Welcome to MsgMate.AI</h2>
        <p>Thank you for signing up! Please verify your email address to activate your account.</p>
        <div style="margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Verify Email Address</a>
        </div>
        <p>If you did not create an account, you can safely ignore this email.</p>
        <p>Best regards,<br>The MsgMate.AI Team</p>
      </div>
    `
  });
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Welcome to MsgMate.AI!',
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
          <a href="${process.env.APP_URL || 'http://localhost:5000'}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Start Using MsgMate.AI</a>
        </div>
        
        <p>If you have any questions or need assistance, please reply to this email.</p>
        <p>Best regards,<br>The MsgMate.AI Team</p>
      </div>
    `
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const baseUrl = process.env.APP_URL || 'http://localhost:5000';
  const resetLink = `${baseUrl}/reset-password?token=${token}`;
  
  return sendEmail({
    to: email,
    subject: 'Reset Your MsgMate.AI Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Reset Your Password</h2>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <div style="margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>Best regards,<br>The MsgMate.AI Team</p>
      </div>
    `
  });
}