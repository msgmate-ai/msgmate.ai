import axios from 'axios';

// Resend API configuration
const RESEND_API_KEY = 're_2hPjYiX9_K2pznnYgKnecT8fWNUmAkGYC';
const FROM_EMAIL = 'MsgMate <hello@msgmate.ai>';

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  console.log("Attempting to send email via Resend to:", params.to);
  
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured');
    return false;
  }
  
  try {
    const response = await axios.post('https://api.resend.com/emails', {
      from: FROM_EMAIL,
      to: [params.to],
      subject: params.subject,
      text: params.text,
      html: params.html
    }, {
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Email sent successfully via Resend to:", params.to);
    console.log("Resend response:", response.data);
    return true;
    
  } catch (error: any) {
    console.error('Resend email error:', error.response?.data || error.message);
    return false;
  }
}

export async function sendVerificationEmail(email: string, token: string): Promise<boolean> {
  const BASE_URL = process.env.BASE_URL || 'https://msgmate.ai';
  const verificationLink = `${BASE_URL}/verify-email?token=${token}`;
  
  return await sendEmail({
    to: email,
    subject: 'Verify your MsgMate email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">MsgMate.AI</h1>
          <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">AI-Powered Dating Communication</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Verify Your Email Address</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Thank you for signing up for MsgMate.AI! To complete your account setup and start using our AI-powered dating communication tools, please verify your email address.
          </p>
          
          <a href="${verificationLink}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Verify Email Address
          </a>
          
          <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
            <strong>Security Notice:</strong> This verification link will expire in 24 hours.
          </p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.5;">
          If the button above doesn't work, copy and paste this link into your browser:<br>
          <span style="word-break: break-all; color: #4f46e5;">${verificationLink}</span>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <div style="color: #6b7280; font-size: 12px; text-align: center;">
          <p>This is an automated message from MsgMate.AI. Please do not reply to this email.</p>
          <p>If you did not sign up for MsgMate.AI, please disregard this message.</p>
          <p>© 2025 MsgMate.AI. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      MsgMate.AI - Verify Your Email Address
      
      Thank you for signing up for MsgMate.AI! To complete your account setup and start using our AI-powered dating communication tools, please verify your email address.
      
      Click this link to verify: ${verificationLink}
      
      This verification link will expire in 24 hours.
      
      If you did not sign up for MsgMate.AI, please disregard this message.
      
      © 2025 MsgMate.AI. All rights reserved.
    `
  });
}

export async function sendWelcomeEmail(email: string): Promise<boolean> {
  const BASE_URL = process.env.BASE_URL || 'https://msgmate.ai';
  
  return await sendEmail({
    to: email,
    subject: 'Welcome to MsgMate.AI – Your AI Wingmate Awaits',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin: 0;">MsgMate.AI</h1>
          <p style="color: #6b7280; font-size: 16px; margin: 10px 0 0 0;">Your AI-Powered Dating Wingmate</p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 20px 0;">Welcome to MsgMate.AI!</h2>
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
            Congratulations! Your account is now ready. MsgMate.AI is here to help you craft perfect messages, decode conversations, and boost your dating confidence with AI-powered insights.
          </p>
          
          <a href="${BASE_URL}/app" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">
            Start Your First Message
          </a>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #1f2937; font-size: 18px; margin: 0 0 15px 0;">What you can do with MsgMate.AI:</h3>
          <ul style="color: #4b5563; font-size: 16px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li><strong>AI Reply Generator:</strong> Get perfect responses for any message</li>
            <li><strong>Message Decoder:</strong> Understand what they really mean</li>
            <li><strong>Conversation Starters:</strong> Break the ice with confidence</li>
            <li><strong>Message Coach:</strong> Improve your communication style</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #4b5563; font-size: 16px; margin: 0 0 20px 0;">
            Ready to transform your dating conversations?
          </p>
          <a href="${BASE_URL}/app" style="display: inline-block; background-color: #10b981; color: white; text-decoration: none; padding: 10px 25px; border-radius: 6px; font-weight: bold;">
            Try Your First Message →
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <div style="color: #6b7280; font-size: 12px; text-align: center;">
          <p>Need help? Check out our guides at <a href="${BASE_URL}/about" style="color: #4f46e5;">msgmate.ai/about</a></p>
          <p>© 2025 MsgMate.AI. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Welcome to MsgMate.AI – Your AI Wingmate Awaits!
      
      Congratulations! Your account is now ready. MsgMate.AI is here to help you craft perfect messages, decode conversations, and boost your dating confidence with AI-powered insights.
      
      What you can do with MsgMate.AI:
      • AI Reply Generator: Get perfect responses for any message
      • Message Decoder: Understand what they really mean  
      • Conversation Starters: Break the ice with confidence
      • Message Coach: Improve your communication style
      
      Ready to transform your dating conversations?
      Start here: ${BASE_URL}/app
      
      Need help? Visit: ${BASE_URL}/about
      
      © 2025 MsgMate.AI. All rights reserved.
    `
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
  const BASE_URL = process.env.BASE_URL || 'https://msgmate.ai';
  const resetLink = `${BASE_URL}/reset-password?token=${token}`;
  
  return await sendEmail({
    to: email,
    subject: 'Reset your MsgMate password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Reset Your Password</h2>
        <p>You requested a password reset for your MsgMate.AI account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; background-color: #4f46e5; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
      </div>
    `
  });
}

export async function sendSubscriptionConfirmationEmail(email: string, tier: string): Promise<boolean> {
  return await sendEmail({
    to: email,
    subject: 'MsgMate subscription confirmed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4f46e5;">Subscription Confirmed!</h2>
        <p>Thank you for subscribing to MsgMate.AI ${tier} plan!</p>
        <p>Your subscription is now active and you have access to all ${tier} features.</p>
        <p>Start using your enhanced features by logging into your account.</p>
      </div>
    `
  });
}