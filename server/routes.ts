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
import fs from "fs";
import path from "path";

// Feature flag to disable SMS verification
const SMS_ENABLED = false;

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
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
  
  // Waitlist endpoint
  app.post('/api/waitlist', async (req, res, next) => {
    try {
      const { email } = req.body;
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ success: false, message: "Valid email is required" });
      }

      // Check if email already exists in waitlist
      const existingEntry = await storage.getWaitlistByEmail(email);
      if (existingEntry) {
        return res.status(200).json({ success: true, message: "Email already on waitlist" });
      }

      // Add to waitlist
      await storage.addToWaitlist(email);
      
      res.json({ success: true, message: "Successfully added to waitlist" });
    } catch (error: any) {
      console.error("Waitlist error:", error);
      res.status(500).json({ success: false, message: "Failed to add to waitlist" });
    }
  });

  // Analytics logging endpoint
  app.post('/api/log-event', async (req, res, next) => {
    try {
      const { event, props } = req.body;
      
      if (!event) {
        return res.status(400).json({ success: false, message: 'Event name is required' });
      }
      
      const log = {
        timestamp: new Date().toISOString(),
        event,
        ...props,
      };
      
      const logsDir = path.join(process.cwd(), 'logs');
      
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      
      const filePath = path.join(logsDir, 'analytics.jsonl');
      fs.appendFileSync(filePath, JSON.stringify(log) + '\n');
      
      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Analytics logging error:', error);
      res.status(500).json({ success: false, message: 'Failed to log event' });
    }
  });
  
  // Generate message replies
  app.post('/api/generate-replies', async (req, res, next) => {
    try {
      // Define free tones that are accessible without login or subscription
      const freeTones = ['Playful', 'Curious', 'Confident', 'Charming'];
      
      // Allow unauthenticated users to access the free tier features
      // Authenticated users will have their usage tracked
      
      const schema = z.object({
        mode: z.string().optional(),
        message: z.string().optional(),
        userInput: z.string().optional(),
        messageToReplyTo: z.string().optional(),
        tone: z.string().optional(),
        selectedTone: z.string().optional(),
        intent: z.string().optional()
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }
      
      const payload = result.data;
      const { mode, userInput, messageToReplyTo, selectedTone } = payload;
      console.log("Mode:", mode);
      
      // Extract the selected tone cleanly
      const selectedToneClean = selectedTone?.trim();
      console.log("Tone requested:", selectedToneClean);
      
      let prompt: string;
      let tone: string;
      
      if (mode === "say_it_better") {
        if (!userInput) {
          return res.status(400).json({ message: "User input is required for Say It Better mode" });
        }
        
        // Build the enhanced coaching prompt using userInput
        prompt = `You are helping someone improve a message they want to send in a dating conversation.

Here's their original message:
"${userInput}"

Return 3 short, distinct rewrites:
1. Polished version – same meaning, smoother flow
2. Engaging version – ask something curious or spark a more interesting reply
3. Playful version – add light humour or a creative twist (if appropriate)

Keep the tone casual and natural. No formal phrasing, no intense emotion. If the original message is very neutral, keep all three versions aligned to that baseline.

Use neutral, standard English without any regional slang, dialect words, or cultural expressions. Avoid terms like 'cuppa', 'fancy', 'brilliant', 'lovely', or other regional language. Keep responses clear and universally understandable.`;
        
        // Rule-based tone detection (for analytics purposes)
        const input = userInput.toLowerCase();
        if (input.includes('sorry') || input.includes('apologize') || input.includes('my fault')) {
          tone = "sincere";
        } else if (input.includes('thank') || input.includes('appreciate') || input.includes('grateful')) {
          tone = "supportive";
        } else if (input.includes('excited') || input.includes('amazing') || input.includes('awesome') || input.includes('!')) {
          tone = "enthusiastic";
        } else if (input.includes('love') || input.includes('miss') || input.includes('heart') || input.includes('feel')) {
          tone = "romantic";
        } else if (input.includes('haha') || input.includes('lol') || input.includes('funny') || input.includes('joke')) {
          tone = "witty";
        } else if (input.includes('?') && input.length < 50) {
          tone = "curious";
        } else {
          tone = "friendly"; // Default fallback
        }
        
        console.log("AI prompt being sent:", prompt);
        console.log("Detected tone:", tone);
      } else if (mode === "tone_reply") {
        if (!messageToReplyTo) {
          return res.status(400).json({ message: "Message to reply to is required" });
        }
        if (!selectedTone) {
          return res.status(400).json({ message: "Tone selection is required" });
        }
        prompt = messageToReplyTo;
        tone = selectedTone;
        console.log("Prompt used:", prompt);
      } else {
        // Backward compatibility fallback
        const { message, tone: legacyTone } = payload;
        if (!message) {
          return res.status(400).json({ message: "Message is required" });
        }
        if (!legacyTone) {
          return res.status(400).json({ message: "Tone is required" });
        }
        prompt = message;
        tone = legacyTone;
        console.log("Prompt used (legacy):", prompt);
      }
      
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
        const freeTonesAuth = ['playful', 'witty', 'flirty', 'authentic', 'supportive'];
        const basicTones = [...freeTonesAuth, 'confident', 'humorous', 'curious', 'enthusiastic', 'casual'];
        const proTones = [...basicTones, 'romantic', 'mysterious', 'assertive', 'sincere', 'charming'];
        
        if (subscription?.tier === 'basic') {
          availableTones = basicTones;
        } else if (subscription?.tier === 'pro') {
          availableTones = proTones;
        }
        
        // Skip tone restrictions for "Say It Better" mode completely for authenticated users
        if (mode !== "say_it_better" && !availableTones.includes(tone)) {
          return res.status(403).json({ message: 'This tone requires a higher subscription tier' });
        }
      } else {
        // For unauthenticated users, only allow free tones (except in "Say It Better" mode)
        if (mode !== "say_it_better" && !freeTones.includes(tone)) {
          return res.status(403).json({ message: 'This tone requires a higher tier' });
        }
      }
      
      // Generate replies
      const replies = await generateMessageReplies(prompt, tone, payload.intent, mode);
      
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

  // Health check endpoint
  app.get("/api/ping", (req, res) => {
    console.log("🔥 Ping received at", new Date().toISOString());
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
