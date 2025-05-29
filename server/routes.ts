import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { generateMessageReplies, generateConversationStarters, analyzeMessage, decodeMessage } from "./openai";
import { setupStripe, createCheckoutSession, handleStripeWebhook } from "./stripe";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "./resend";
import { sendVerificationSMS, generateVerificationCode, isTwilioConfigured } from "./twilio";
import { randomBytes } from "crypto";

// Feature flag to disable SMS verification
const SMS_ENABLED = false;

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication is now set up in server/index.ts before routes
  
  // Middleware to handle session deserialization failures gracefully
  app.use('/api', (req, res, next) => {
    // Only check for authenticated routes
    const publicRoutes = [
      '/api/register', '/api/login', '/api/forgot-password', '/api/reset-password',
      '/api/verify-email', '/api/webhook', '/api/generate-replies', '/api/generate-conversation-starters',
      '/api/analyze-message', '/api/decode-message'
    ];
    
    const isPublicRoute = publicRoutes.some(route => req.path.startsWith(route));
    
    if (!isPublicRoute && req.session && (req.session as any).passport && (req.session as any).passport.user && !req.user) {
      // Session exists but user deserialization failed - clear session and redirect
      req.session.destroy((err) => {
        if (err) console.error('Error destroying session:', err);
        res.status(401).json({ 
          message: 'Session expired', 
          redirect: '/login?expired=true' 
        });
      });
      return;
    }
    
    next();
  });
  
  // Set up Stripe webhook handler
  app.post('/api/webhook', handleStripeWebhook);
  
  // Generate message replies
  app.post('/api/generate-replies', async (req, res, next) => {
    try {
      // Allow unauthenticated users to access the free tier features
      // Authenticated users will have their usage tracked
      
      const schema = z.object({
        message: z.string().min(1, "Message is required"),
        tone: z.string().min(1, "Tone is required"),
        intent: z.string().optional()
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }
      
      const { message, tone, intent } = result.data;
      
      // Check if user is authenticated
      const isAuthenticated = req.isAuthenticated();
      
      // Set default values for non-authenticated users (free tier)
      let usageCount = 0;
      let usageLimit = 10;
      let availableTones = ['playful', 'witty', 'flirty', 'authentic', 'supportive'];
      
      // If authenticated, check subscription tier and usage
      if (isAuthenticated && req.user) {
        const subscription = await storage.getUserSubscription(req.user.id);
        usageCount = subscription ? subscription.usage : 0;
        usageLimit = subscription?.tier === 'pro' ? 400 : subscription?.tier === 'basic' ? 100 : 10;
        
        // Set available tones based on subscription tier
        const freeTones = ['playful', 'witty', 'flirty', 'authentic', 'supportive'];
        const basicTones = [...freeTones, 'confident', 'humorous', 'curious', 'enthusiastic', 'casual'];
        const proTones = [...basicTones, 'romantic', 'mysterious', 'assertive', 'sincere', 'charming'];
        
        if (subscription?.tier === 'basic') {
          availableTones = basicTones;
        } else if (subscription?.tier === 'pro') {
          availableTones = proTones;
        }
      }
      
      if (!availableTones.includes(tone)) {
        return res.status(403).json({ message: 'This tone requires a higher subscription tier' });
      }
      
      // Generate replies
      const replies = await generateMessageReplies(message, tone, intent);
      
      // Update usage count for authenticated users only
      if (isAuthenticated && req.user) {
        await storage.incrementUsage(req.user.id);
      }
      
      res.json({ replies: replies.map((reply, index) => ({ id: index + 1, text: reply.text })) });
    } catch (error: any) {
      next(error);
    }
  });
  
  // Generate conversation starters (Basic+ and Pro only)
  app.post('/api/conversation-starters', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const subscription = await storage.getUserSubscription(req.user.id);
      if (!subscription || subscription.tier === 'free') {
        return res.status(403).json({ message: 'This feature requires a Basic+ or Pro subscription' });
      }
      
      const schema = z.object({
        profileContext: z.string().min(1, "Profile context is required"),
        interests: z.string().optional()
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }
      
      const { profileContext, interests } = result.data;
      
      // Generate conversation starters
      const starters = await generateConversationStarters(profileContext, interests);
      
      // Update usage count
      await storage.incrementUsage(req.user.id);
      
      res.json({ starters: starters.map((starter, index) => ({ id: index + 1, text: starter.text })) });
    } catch (error: any) {
      next(error);
    }
  });
  
  // Message coach analysis (Pro only)
  app.post('/api/message-coach', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const subscription = await storage.getUserSubscription(req.user.id);
      if (!subscription || subscription.tier !== 'pro') {
        return res.status(403).json({ message: 'This feature requires a Pro subscription' });
      }
      
      const schema = z.object({
        message: z.string().min(1, "Message is required")
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }
      
      const { message } = result.data;
      
      // Analyze message
      const analysis = await analyzeMessage(message);
      
      // Update usage count
      await storage.incrementUsage(req.user.id);
      
      res.json(analysis);
    } catch (error: any) {
      next(error);
    }
  });
  
  // Message decoder (Pro only)
  app.post('/api/message-decoder', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const subscription = await storage.getUserSubscription(req.user.id);
      if (!subscription || subscription.tier !== 'pro') {
        return res.status(403).json({ message: 'This feature requires a Pro subscription' });
      }
      
      const schema = z.object({
        message: z.string().min(1, "Message is required")
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }
      
      const { message } = result.data;
      
      // Decode message
      const decoded = await decodeMessage(message);
      
      // Update usage count
      await storage.incrementUsage(req.user.id);
      
      res.json(decoded);
    } catch (error: any) {
      next(error);
    }
  });
  
  // Get user subscription
  app.get('/api/subscription', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const subscription = await storage.getUserSubscription(req.user.id);
      res.json(subscription || { tier: 'free', usage: 0 });
    } catch (error: any) {
      next(error);
    }
  });
  
  // Create subscription checkout session
  app.post('/api/create-subscription', async (req, res, next) => {
    try {
      console.log('Create subscription request - isAuthenticated:', req.isAuthenticated());
      console.log('Session ID:', req.sessionID);
      console.log('User in session:', req.user);
      
      if (!req.isAuthenticated()) {
        console.log('Authentication failed - redirecting to login');
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const schema = z.object({
        tier: z.enum(['basic', 'pro'])
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }
      
      const { tier } = result.data;
      
      // Create checkout session
      const sessionUrl = await createCheckoutSession(req.user, tier, req);
      res.json({ url: sessionUrl });
    } catch (error: any) {
      next(error);
    }
  });
  
  // Cancel subscription
  app.post('/api/cancel-subscription', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const subscription = await storage.getUserSubscription(req.user.id);
      if (!subscription || subscription.tier === 'free') {
        return res.status(400).json({ message: 'No active subscription to cancel' });
      }
      
      // Cancel the subscription
      await storage.updateUserSubscription(req.user.id, { tier: 'free', usage: 0 });
      
      res.json({ message: 'Subscription cancelled successfully' });
    } catch (error: any) {
      next(error);
    }
  });
  
  // Email verification route
  app.get('/api/verify-email/:token', async (req, res, next) => {
    try {
      const { token } = req.params;
      
      console.log('Email verification attempt with token:', token);
      
      if (!token) {
        return res.status(400).json({ success: false, message: 'Verification token is required' });
      }
      
      // First, check if a user exists with this token
      const existingUser = await storage.getUserByVerificationToken(token);
      console.log('User found with token:', existingUser ? 'Yes' : 'No');
      
      if (!existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'This verification link has expired or is invalid. Please register again or request a new verification email.' 
        });
      }
      
      if (existingUser.isVerified) {
        return res.status(400).json({ 
          success: false, 
          message: 'This email address has already been verified. You can proceed to login.' 
        });
      }
      
      const user = await storage.verifyUserEmail(token);
      
      if (!user) {
        return res.status(500).json({ 
          success: false, 
          message: 'An error occurred during verification. Please try again or contact support.' 
        });
      }
      
      console.log('User email verified successfully:', user.username);
      
      // Send welcome email after successful verification
      try {
        await sendWelcomeEmail(user.username);
        console.log('Welcome email sent to:', user.username);
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Don't fail the verification if welcome email fails
      }
      
      res.json({ success: true, message: 'Email verification successful. Welcome to MsgMate.AI!' });
    } catch (error: any) {
      console.error('Email verification error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'An unexpected error occurred during verification. Please try again.' 
      });
    }
  });
  
  // Forgot password route
  app.post('/api/forgot-password', async (req, res, next) => {
    try {
      const schema = z.object({
        username: z.string().email("Please enter a valid email address")
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.error.errors[0].message });
      }
      
      const { username } = result.data;
      
      // Generate token and expiry (24 hours from now)
      const token = randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);
      
      const user = await storage.setPasswordResetToken(username, token, expires);
      
      if (user) {
        // Send password reset email
        await sendPasswordResetEmail(username, token);
      }
      
      // Always return success even if email doesn't exist for security reasons
      res.json({ success: true, message: 'If an account with that email exists, a password reset link has been sent' });
    } catch (error: any) {
      next(error);
    }
  });
  
  // Resend verification email route
  app.post('/api/resend-verification', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      
      // Generate new verification token
      const verificationToken = randomBytes(32).toString('hex');
      
      // Update the user's verification token
      const user = await storage.setVerificationToken(req.user.id, verificationToken);
      
      if (!user) {
        return res.status(400).json({ success: false, message: 'Failed to update verification token' });
      }
      
      // Send verification email
      const emailSent = await sendVerificationEmail(user.username, verificationToken);
      
      if (!emailSent) {
        return res.status(500).json({ success: false, message: 'Failed to send verification email' });
      }
      
      res.json({ success: true, message: 'Verification email sent successfully' });
    } catch (error: any) {
      next(error);
    }
  });
  
  // SMS Verification routes
  if (SMS_ENABLED) {
  // Send SMS verification code
  app.post('/api/send-sms-verification', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      
      const schema = z.object({
        phoneNumber: z.string().min(10, "Please enter a valid phone number")
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.error.errors[0].message });
      }
      
      const { phoneNumber } = result.data;
      
      if (!isTwilioConfigured()) {
        return res.status(500).json({ success: false, message: 'SMS service is not configured' });
      }
      
      // Generate verification code and set expiry (10 minutes from now)
      const code = generateVerificationCode();
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 10);
      
      // Update user's phone number and set SMS verification code
      await storage.updatePhoneNumber(req.user.id, phoneNumber);
      await storage.setSMSVerificationCode(req.user.id, code, expires);
      
      // Send SMS
      const smsSent = await sendVerificationSMS(phoneNumber, code);
      
      if (!smsSent) {
        return res.status(500).json({ success: false, message: 'Failed to send SMS verification code' });
      }
      
      res.json({ success: true, message: 'SMS verification code sent successfully' });
    } catch (error: any) {
      next(error);
    }
  });
  
  // Verify SMS code
  app.post('/api/verify-sms', async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      
      const schema = z.object({
        code: z.string().length(6, "Verification code must be 6 digits")
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.error.errors[0].message });
      }
      
      const { code } = result.data;
      
      const user = await storage.verifySMSCode(req.user.id, code);
      
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
      }
      
      // Send welcome email after successful verification
      await sendWelcomeEmail(user.username);
      
      res.json({ success: true, message: 'Phone verification successful', user });
    } catch (error: any) {
      next(error);
    }
  });
  } // End SMS_ENABLED feature flag
  
  // Reset password route
  app.post('/api/reset-password', async (req, res, next) => {
    try {
      const schema = z.object({
        token: z.string().min(1, "Reset token is required"),
        password: z.string().min(6, "Password must be at least 6 characters")
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.error.errors[0].message });
      }
      
      const { token, password } = result.data;
      
      // Get user by reset token
      const user = await storage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
      }
      
      // Update password
      await storage.updatePassword(user.id, password);
      
      res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (error: any) {
      next(error);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
