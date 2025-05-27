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

// Test mode price configuration - using price_data for consistency
const PRICES = {
  basic: 499, // £4.99 in pence
  pro: 999   // £9.99 in pence
};

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
          price_data: {
            currency: 'gbp',
            product_data: {
              name: tier === 'basic' ? 'MsgMate.AI Basic+ Plan' : 'MsgMate.AI Pro Plan',
              description: tier === 'basic' 
                ? '100 messages/month, 10 tones, Conversation Starters'
                : '400 messages/month, 15 tones, all premium features'
            },
            unit_amount: tier === 'basic' ? PRICES.basic : PRICES.pro,
            recurring: {
              interval: 'month'
            }
          },
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
      },
      // Force test mode if using test keys
      ...(isTestMode && { 
        payment_intent_data: { 
          setup_future_usage: 'off_session' 
        }
      })
    });
    
    console.log('Checkout session created:', {
      id: session.id,
      mode: session.mode,
      customer: session.customer,
      metadata: session.metadata,
      url: session.url
    });
    
    return session.url || '';
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

export async function handleStripeWebhook(req: express.Request, res: express.Response) {
  console.log('Stripe webhook received');
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!endpointSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured');
    return res.status(400).send('Webhook secret not configured');
  }
  
  let event;
  
  try {
    const body = req.body;
    console.log('Webhook body type:', typeof body);
    event = stripe.webhooks.constructEvent(
      body, 
      sig, 
      endpointSecret
    );
    console.log('Webhook event verified:', event.type);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Processing checkout.session.completed for session:', session.id);
      
      // Extract metadata
      const userId = parseInt(session.metadata?.userId || '0');
      const tier = session.metadata?.tier as 'basic' | 'pro';
      const email = session.metadata?.email;
      
      console.log('Session metadata - userId:', userId, 'tier:', tier, 'email:', email);
      
      if (userId && tier) {
        console.log('Updating user subscription for userId:', userId, 'to tier:', tier);
        
        // Update user subscription
        const updatedSubscription = await storage.updateUserSubscription(userId, {
          tier,
          usage: 0
        });
        
        console.log('Subscription updated successfully:', updatedSubscription);
        
        // Store subscription ID with user
        if (session.subscription) {
          console.log('Updating user Stripe info with subscription ID:', session.subscription);
          await storage.updateUserStripeInfo(
            userId, 
            session.customer as string, 
            session.subscription as string
          );
          console.log('User Stripe info updated successfully');
        }
        
        // Send confirmation email
        if (email) {
          console.log('Sending confirmation email to:', email);
          const { sendSubscriptionConfirmationEmail } = await import('./sendgrid');
          await sendSubscriptionConfirmationEmail(email, tier);
          console.log('Confirmation email sent successfully');
        }
      } else {
        console.error('Missing required metadata - userId or tier is missing');
      }
      break;
    }
    
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeCustomerId = subscription.customer as string;
      
      // Find user by Stripe customer ID
      const user = await storage.getUserByStripeCustomerId(stripeCustomerId);
      
      if (user) {
        // Update subscription tier based on price amount (since we're using price_data)
        const items = subscription.items.data;
        if (items && items.length > 0) {
          const priceAmount = items[0].price.unit_amount;
          
          if (priceAmount === PRICES.basic) {
            await storage.updateUserSubscription(user.id, { tier: 'basic' });
          } else if (priceAmount === PRICES.pro) {
            await storage.updateUserSubscription(user.id, { tier: 'pro' });
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
