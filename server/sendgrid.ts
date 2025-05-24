import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
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

export async function sendVerificationEmail(
  email: string, 
  verificationToken: string,
  baseUrl: string
): Promise<boolean> {
  const verificationLink = `${baseUrl}/verify-email?token=${verificationToken}`;
  
  return sendEmail({
    to: email,
    from: 'no-reply@msgmate.ai',
    subject: 'Verify your MsgMate.AI account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to MsgMate.AI!</h2>
        <p>Thank you for creating an account. Please verify your email address by clicking the button below:</p>
        <div style="margin: 30px 0;">
          <a href="${verificationLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280;">${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">MsgMate.AI - Your AI dating message assistant</p>
      </div>
    `
  });
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  return sendEmail({
    to: email,
    from: 'no-reply@msgmate.ai',
    subject: 'Welcome to MsgMate.AI!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to MsgMate.AI!</h2>
        <p>Thank you for joining MsgMate.AI! We're excited to help you craft perfect dating app messages.</p>
        <div style="margin: 30px 0;">
          <a href="https://msgmate.ai/app" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Start Using MsgMate</a>
        </div>
        <p>Here's what you can do with your account:</p>
        <ul>
          <li>Generate perfect replies in various tones</li>
          <li>Get conversation starters based on profile information</li>
          <li>Analyze message sentiment and improve your communication</li>
        </ul>
        <p>If you have any questions, please visit our <a href="https://msgmate.ai/contact" style="color: #4f46e5;">help center</a>.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">MsgMate.AI - Your AI dating message assistant</p>
      </div>
    `
  });
}