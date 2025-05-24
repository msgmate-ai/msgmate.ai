import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { generateMessageReplies, generateConversationStarters, analyzeMessage, decodeMessage } from "./openai";
import { setupStripe, createCheckoutSession, handleStripeWebhook } from "./stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
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
      if (!req.isAuthenticated()) {
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
      const sessionUrl = await createCheckoutSession(req.user, tier);
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

  const httpServer = createServer(app);

  return httpServer;
}
