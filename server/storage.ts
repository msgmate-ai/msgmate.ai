import { users, subscriptions, waitlist, type User, type InsertUser, type Subscription, type InsertSubscription, type Waitlist, type InsertWaitlist } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserSubscription(userId: number): Promise<Subscription | undefined>;
  createUserSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateUserSubscription(userId: number, updates: Partial<Subscription>): Promise<Subscription | undefined>;
  incrementUsage(userId: number): Promise<void>;
  getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined>;
  updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User>;
  // Email verification methods
  setVerificationToken(userId: number, token: string): Promise<User>;
  verifyUserEmail(token: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  // Password reset methods
  setPasswordResetToken(username: string, token: string, expires: Date): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  updatePassword(userId: number, password: string): Promise<User>;
  // SMS verification methods
  setSMSVerificationCode(userId: number, code: string, expires: Date): Promise<User>;
  verifySMSCode(userId: number, code: string): Promise<User | undefined>;
  updatePhoneNumber(userId: number, phoneNumber: string): Promise<User>;
  // Waitlist methods
  addToWaitlist(email: string): Promise<Waitlist>;
  getWaitlistByEmail(email: string): Promise<Waitlist | undefined>;
  sessionStore: any; // Using any for session store to avoid type issues
}

export class DatabaseStorage implements IStorage {
  sessionStore: any; // Using any for session store to avoid type issues

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    
    // Create a free tier subscription for the new user
    await db.insert(subscriptions).values({
      userId: user.id,
      tier: 'free',
      usage: 0
    });
    
    return user;
  }

  async getUserSubscription(userId: number): Promise<Subscription | undefined> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    
    return subscription || undefined;
  }

  async createUserSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [newSubscription] = await db
      .insert(subscriptions)
      .values(subscription)
      .returning();
    
    return newSubscription;
  }

  async updateUserSubscription(userId: number, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const [updatedSubscription] = await db
      .update(subscriptions)
      .set(updates)
      .where(eq(subscriptions.userId, userId))
      .returning();
    
    return updatedSubscription;
  }

  async incrementUsage(userId: number): Promise<void> {
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    
    if (subscription) {
      await db
        .update(subscriptions)
        .set({ usage: subscription.usage + 1 })
        .where(eq(subscriptions.userId, userId));
    }
  }

  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.stripeCustomerId, stripeCustomerId));
    
    return user || undefined;
  }

  async updateUserStripeInfo(userId: number, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<User> {
    const updates: any = { stripeCustomerId };
    
    if (stripeSubscriptionId) {
      updates.stripeSubscriptionId = stripeSubscriptionId;
    }
    
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  // Email verification methods
  async setVerificationToken(userId: number, token: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ verificationToken: token })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async verifyUserEmail(token: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({ 
          isVerified: true,
          verificationToken: null 
        })
        .where(eq(users.verificationToken, token))
        .returning();
      
      return user;
    } catch (error) {
      console.error('Error verifying user email:', error);
      return undefined;
    }
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.verificationToken, token));
    
    return user || undefined;
  }

  // Password reset methods
  async setPasswordResetToken(username: string, token: string, expires: Date): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({
          resetPasswordToken: token,
          resetPasswordExpires: expires
        })
        .where(eq(users.username, username))
        .returning();
      
      return user;
    } catch (error) {
      console.error('Error setting password reset token:', error);
      return undefined;
    }
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, token));
    
    // Check if token is expired
    if (user && user.resetPasswordExpires) {
      const now = new Date();
      if (user.resetPasswordExpires < now) {
        return undefined; // Token has expired
      }
    }
    
    return user || undefined;
  }

  async updatePassword(userId: number, password: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        password,
        resetPasswordToken: null,
        resetPasswordExpires: null
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  // SMS verification methods
  async setSMSVerificationCode(userId: number, code: string, expires: Date): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        smsVerificationCode: code,
        smsCodeExpires: expires
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async verifySMSCode(userId: number, code: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      
      if (!user || !user.smsVerificationCode || !user.smsCodeExpires) {
        return undefined;
      }
      
      // Check if code matches and hasn't expired
      const now = new Date();
      if (user.smsVerificationCode !== code || user.smsCodeExpires < now) {
        return undefined;
      }
      
      // Mark phone as verified and clear SMS code
      const [verifiedUser] = await db
        .update(users)
        .set({
          isPhoneVerified: true,
          isVerified: true, // Also mark overall account as verified
          smsVerificationCode: null,
          smsCodeExpires: null
        })
        .where(eq(users.id, userId))
        .returning();
      
      return verifiedUser;
    } catch (error) {
      console.error('Error verifying SMS code:', error);
      return undefined;
    }
  }

  async updatePhoneNumber(userId: number, phoneNumber: string): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ 
        phoneNumber,
        isPhoneVerified: false // Reset phone verification when number changes
      })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async addToWaitlist(email: string): Promise<Waitlist> {
    const [waitlistEntry] = await db
      .insert(waitlist)
      .values({ email })
      .returning();
    return waitlistEntry;
  }

  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    const [waitlistEntry] = await db
      .select()
      .from(waitlist)
      .where(eq(waitlist.email, email));
    return waitlistEntry || undefined;
  }
}

export const storage = new DatabaseStorage();
