import Stripe from "stripe";
import { storage } from "./storage";
import { User } from "@shared/schema";
import express from "express";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not set. Stripe functionality will not work correctly.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: "2023-10-16" as any,
});

// Price IDs should be environment variables in production
const PRICE_IDS = {
  basic: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic',
  pro: process.env.STRIPE_PRO_PRICE_ID || 'price_pro'
};

const PRICES = {
  basic: 499, // £4.99
  pro: 999   // £9.99
};

export function setupStripe() {
  // Any setup required
}

export async function createCheckoutSession(user: User, tier: 'basic' | 'pro'): Promise<string> {
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
    }
    
    // Create checkout session
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
      success_url: `${process.env.BASE_URL || 'http://localhost:5000'}/subscription-success`,
      cancel_url: `${process.env.BASE_URL || 'http://localhost:5000'}/account`,
      metadata: {
        userId: user.id.toString(),
        tier,
        email: user.username
      }
    });
    
    return session.url || '';
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

export async function handleStripeWebhook(req: express.Request, res: express.Response) {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!endpointSecret) {
    return res.status(400).send('Webhook secret not configured');
  }
  
  let event;
  
  try {
    const body = req.body;
    event = stripe.webhooks.constructEvent(
      body, 
      sig, 
      endpointSecret
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract metadata
      const userId = parseInt(session.metadata?.userId || '0');
      const tier = session.metadata?.tier as 'basic' | 'pro';
      const email = session.metadata?.email;
      
      if (userId && tier) {
        // Update user subscription
        await storage.updateUserSubscription(userId, {
          tier,
          usage: 0
        });
        
        // Store subscription ID with user
        if (session.subscription) {
          await storage.updateUserStripeInfo(
            userId, 
            session.customer as string, 
            session.subscription as string
          );
        }
        
        // Send confirmation email
        if (email) {
          const { sendSubscriptionConfirmationEmail } = await import('./sendgrid');
          await sendSubscriptionConfirmationEmail(email, tier);
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
        // Update subscription tier based on price
        const items = subscription.items.data;
        if (items && items.length > 0) {
          const priceId = items[0].price.id;
          
          if (priceId === PRICE_IDS.basic) {
            await storage.updateUserSubscription(user.id, { tier: 'basic' });
          } else if (priceId === PRICE_IDS.pro) {
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
