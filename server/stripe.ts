import Stripe from "stripe";
import { storage } from "./storage";
import { User } from "@shared/schema";
import express from "express";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe functionality will not work correctly.");
}

// Determine if we're in test mode based on the secret key
const isTestMode = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
console.log('Stripe mode:', isTestMode ? 'TEST' : 'LIVE');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: "2023-10-16" as any,
});

// Test mode product and price IDs from Stripe dashboard
const PRODUCTS = {
  basic: 'prod_SJPkOcAOBNIWA8', // Basic+ Plan
  pro: 'prod_SJPmqxh8m9Neim'    // Pro Plan
};

// Price IDs - automatically select based on environment (test vs live)
const PRICE_IDS = {
  basic: isTestMode 
    ? (process.env.STRIPE_BASIC_PRICE_ID_TEST || 'price_basic_placeholder')
    : (process.env.STRIPE_BASIC_PRICE_ID_LIVE || 'price_basic_placeholder'),
  pro: isTestMode 
    ? (process.env.STRIPE_PRO_PRICE_ID_TEST || 'price_pro_placeholder')
    : (process.env.STRIPE_PRO_PRICE_ID_LIVE || 'price_pro_placeholder')
};

console.log('Price IDs loaded:', {
  mode: isTestMode ? 'TEST' : 'LIVE',
  basic: PRICE_IDS.basic,
  pro: PRICE_IDS.pro
});

export function setupStripe() {
  // Any setup required
}

export async function createCheckoutSession(user: User, tier: 'basic' | 'pro', req?: any): Promise<string> {
  try {
    console.log('Creating checkout session for user:', user.id, user.username);
    let stripeCustomerId = user.stripeCustomerId;
    console.log('Existing stripe customer ID:', stripeCustomerId);
    
    // Create or get customer
    if (!stripeCustomerId) {
      console.log('Creating new Stripe customer...');
      const customer = await stripe.customers.create({
        email: user.username,
        name: user.username,
        metadata: {
          userId: user.id.toString()
        }
      });
      
      stripeCustomerId = customer.id;
      console.log('Created Stripe customer:', stripeCustomerId);
      
      // Update user with Stripe customer ID
      await storage.updateUserStripeInfo(user.id, stripeCustomerId);
      console.log('Updated user with Stripe customer ID');
    } else {
      console.log('Using existing Stripe customer:', stripeCustomerId);
      
      // Verify the customer still exists in Stripe
      try {
        await stripe.customers.retrieve(stripeCustomerId);
        console.log('Stripe customer verified successfully');
      } catch (error: any) {
        if (error.type === 'StripeInvalidRequestError' && error.code === 'resource_missing') {
          console.log('Stripe customer no longer exists, creating new one...');
          
          // Customer doesn't exist — reset the ID so a new one can be created
          const customer = await stripe.customers.create({
            email: user.username,
            name: user.username,
            metadata: {
              userId: user.id.toString()
            }
          });
          
          stripeCustomerId = customer.id;
          console.log('Created new Stripe customer:', stripeCustomerId);
          
          // Update user with new Stripe customer ID
          await storage.updateUserStripeInfo(user.id, stripeCustomerId);
          console.log('Updated user with new Stripe customer ID');
        } else {
          throw error;
        }
      }
    }
    
    // Create checkout session with explicit test mode configuration
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: tier === 'basic' ? PRICE_IDS.basic : PRICE_IDS.pro,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.BASE_URL || `${req.protocol}://${req.get('host')}`}/subscription-success`,
      cancel_url: `${process.env.BASE_URL || `${req.protocol}://${req.get('host')}`}/account`,
      metadata: {
        userId: user.id.toString(),
        tier,
        email: user.username,
        test_mode: isTestMode.toString()
      }
    });
    
    console.log('Checkout session created:', {
      id: session.id,
      mode: session.mode,
      customer: session.customer,
      metadata: session.metadata,
      priceId: tier === 'basic' ? PRICE_IDS.basic : PRICE_IDS.pro,
      url: session.url
    });
    
    return session.url || '';
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

export async function handleStripeWebhook(req: express.Request, res: express.Response) {
  console.log('🔗 Stripe webhook received');
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!endpointSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET not configured');
    return res.status(400).send('Webhook secret not configured');
  }
  
  let event;
  
  try {
    const body = req.body;
    console.log('📦 Webhook body type:', typeof body);
    event = stripe.webhooks.constructEvent(
      body, 
      sig, 
      endpointSecret
    );
    console.log('✅ Webhook event verified:', event.type);
  } catch (err: any) {
    console.error(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('💳 Processing checkout.session.completed for session:', session.id);
      console.log('💰 Customer ID:', session.customer);
      
      // Extract metadata
      const userId = parseInt(session.metadata?.userId || '0');
      const tier = session.metadata?.tier as 'basic' | 'pro';
      const email = session.metadata?.email;
      
      console.log('📋 Session metadata - userId:', userId, 'tier:', tier, 'email:', email);
      
      // Get line items to determine the price ID
      if (session.line_items?.data?.[0]?.price?.id) {
        const priceId = session.line_items.data[0].price.id;
        console.log('💵 Price ID from session:', priceId);
        
        // Determine tier from price ID for accuracy
        let actualTier: 'basic' | 'pro' | 'free' = 'free';
        if (priceId === PRICE_IDS.basic) {
          actualTier = 'basic';
        } else if (priceId === PRICE_IDS.pro) {
          actualTier = 'pro';
        }
        
        console.log('🎯 Determined tier from price ID:', actualTier);
        
        if (userId && actualTier !== 'free') {
          console.log('🔄 Updating user subscription for userId:', userId, 'to tier:', actualTier);
          
          // Update user subscription
          const updatedSubscription = await storage.updateUserSubscription(userId, {
            tier: actualTier,
            usage: 0
          });
          
          console.log('✅ Subscription updated successfully:', updatedSubscription);
          
          // Store subscription ID with user
          if (session.subscription) {
            console.log('🔗 Updating user Stripe info with subscription ID:', session.subscription);
            await storage.updateUserStripeInfo(
              userId, 
              session.customer as string, 
              session.subscription as string
            );
            console.log('✅ User Stripe info updated successfully');
          }
          
          // Send confirmation email
          if (email) {
            console.log('📧 Sending confirmation email to:', email);
            const { sendSubscriptionConfirmationEmail } = await import('./resend');
            await sendSubscriptionConfirmationEmail(email, actualTier);
            console.log('✅ Confirmation email sent successfully');
          }
        } else {
          console.error('❌ Missing required data - userId:', userId, 'tier:', actualTier);
        }
      } else {
        // Fallback to metadata if line items not available
        if (userId && tier) {
          console.log('🔄 Fallback: Using metadata tier for userId:', userId, 'to tier:', tier);
          
          const updatedSubscription = await storage.updateUserSubscription(userId, {
            tier,
            usage: 0
          });
          
          console.log('✅ Subscription updated successfully (fallback):', updatedSubscription);
        } else {
          console.error('❌ Missing required metadata - userId or tier is missing');
        }
      }
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;
      
      // Find user by Stripe customer ID
      const user = await storage.getUserByStripeCustomerId(stripeCustomerId);
      
      if (user) {
        // Update subscription tier based on price ID
        const items = subscription.items.data;
        if (items && items.length > 0) {
          const priceId = items[0].price.id;
          
          if (priceId === PRICE_IDS.basic) {
            await storage.updateUserSubscription(user.id, { tier: 'basic' });
            console.log('Updated user to basic tier via subscription.updated');
          } else if (priceId === PRICE_IDS.pro) {
            await storage.updateUserSubscription(user.id, { tier: 'pro' });
            console.log('Updated user to pro tier via subscription.updated');
          }
        }
      }
      break;
    }
    
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;
      
      // Find user by Stripe customer ID
      const user = await storage.getUserByStripeCustomerId(stripeCustomerId);
      
      if (user) {
        // Downgrade to free tier
        await storage.updateUserSubscription(user.id, { tier: 'free', usage: 0 });
      }
      break;
    }
  }
  
  // Return success
  res.json({ received: true });
}
