var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/resend.ts
var resend_exports = {};
__export(resend_exports, {
  sendEmail: () => sendEmail,
  sendPasswordResetEmail: () => sendPasswordResetEmail,
  sendSubscriptionConfirmationEmail: () => sendSubscriptionConfirmationEmail,
  sendVerificationEmail: () => sendVerificationEmail,
  sendWelcomeEmail: () => sendWelcomeEmail
});
import axios from "axios";
async function sendEmail(params) {
  console.log("Attempting to send email via Resend to:", params.to);
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return false;
  }
  try {
    const response = await axios.post("https://api.resend.com/emails", {
      from: FROM_EMAIL,
      to: [params.to],
      subject: params.subject,
      text: params.text,
      html: params.html
    }, {
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    console.log("Email sent successfully via Resend to:", params.to);
    console.log("Resend response:", response.data);
    return true;
  } catch (error) {
    console.error("Resend email error:", error.response?.data || error.message);
    return false;
  }
}
async function sendVerificationEmail(email, token) {
  const BASE_URL = process.env.BASE_URL || "https://msgmate.ai";
  const verificationLink = `${BASE_URL}/verify-email?token=${token}`;
  return await sendEmail({
    to: email,
    subject: "Verify your MsgMate email",
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
          <p>\xA9 2025 MsgMate.AI. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      MsgMate.AI - Verify Your Email Address
      
      Thank you for signing up for MsgMate.AI! To complete your account setup and start using our AI-powered dating communication tools, please verify your email address.
      
      Click this link to verify: ${verificationLink}
      
      This verification link will expire in 24 hours.
      
      If you did not sign up for MsgMate.AI, please disregard this message.
      
      \xA9 2025 MsgMate.AI. All rights reserved.
    `
  });
}
async function sendWelcomeEmail(email) {
  const BASE_URL = process.env.BASE_URL || "https://msgmate.ai";
  return await sendEmail({
    to: email,
    subject: "Welcome to MsgMate.AI \u2013 Your AI Wingmate Awaits",
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
            Try Your First Message \u2192
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <div style="color: #6b7280; font-size: 12px; text-align: center;">
          <p>Need help? Check out our guides at <a href="${BASE_URL}/about" style="color: #4f46e5;">msgmate.ai/about</a></p>
          <p>\xA9 2025 MsgMate.AI. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Welcome to MsgMate.AI \u2013 Your AI Wingmate Awaits!
      
      Congratulations! Your account is now ready. MsgMate.AI is here to help you craft perfect messages, decode conversations, and boost your dating confidence with AI-powered insights.
      
      What you can do with MsgMate.AI:
      \u2022 AI Reply Generator: Get perfect responses for any message
      \u2022 Message Decoder: Understand what they really mean  
      \u2022 Conversation Starters: Break the ice with confidence
      \u2022 Message Coach: Improve your communication style
      
      Ready to transform your dating conversations?
      Start here: ${BASE_URL}/app
      
      Need help? Visit: ${BASE_URL}/about
      
      \xA9 2025 MsgMate.AI. All rights reserved.
    `
  });
}
async function sendPasswordResetEmail(email, token) {
  const BASE_URL = process.env.BASE_URL || "https://msgmate.ai";
  const resetLink = `${BASE_URL}/reset-password?token=${token}`;
  return await sendEmail({
    to: email,
    subject: "Reset your MsgMate password",
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
async function sendSubscriptionConfirmationEmail(email, tier) {
  return await sendEmail({
    to: email,
    subject: "MsgMate subscription confirmed",
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
var RESEND_API_KEY, FROM_EMAIL;
var init_resend = __esm({
  "server/resend.ts"() {
    "use strict";
    RESEND_API_KEY = "re_2hPjYiX9_K2pznnYgKnecT8fWNUmAkGYC";
    FROM_EMAIL = "MsgMate <hello@msgmate.ai>";
  }
});

// server/index.ts
import express2 from "express";
import path4 from "path";
import { fileURLToPath } from "url";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertSubscriptionSchema: () => insertSubscriptionSchema,
  insertUserSchema: () => insertUserSchema,
  insertWaitlistSchema: () => insertWaitlistSchema,
  subscriptions: () => subscriptions,
  users: () => users,
  waitlist: () => waitlist
});
import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  phoneNumber: text("phone_number"),
  isVerified: boolean("is_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  verificationToken: text("verification_token"),
  smsVerificationCode: text("sms_verification_code"),
  smsCodeExpires: timestamp("sms_code_expires"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow()
});
var subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  tier: text("tier").notNull().default("free"),
  // 'free', 'basic', or 'pro'
  usage: integer("usage").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  phoneNumber: true
});
var insertSubscriptionSchema = createInsertSchema(subscriptions).pick({
  userId: true,
  tier: true,
  usage: true
});
var insertWaitlistSchema = createInsertSchema(waitlist).pick({
  email: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set in production");
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
import session from "express-session";
import createMemoryStore from "memorystore";
var MemoryStore = createMemoryStore(session);
var DatabaseStorage = class {
  sessionStore;
  // Using any for session store to avoid type issues
  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 864e5
      // 24 hours
    });
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    await db.insert(subscriptions).values({
      userId: user.id,
      tier: "free",
      usage: 0
    });
    return user;
  }
  async getUserSubscription(userId) {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return subscription || void 0;
  }
  async createUserSubscription(subscription) {
    const [newSubscription] = await db.insert(subscriptions).values(subscription).returning();
    return newSubscription;
  }
  async updateUserSubscription(userId, updates) {
    const [updatedSubscription] = await db.update(subscriptions).set(updates).where(eq(subscriptions.userId, userId)).returning();
    return updatedSubscription;
  }
  async incrementUsage(userId) {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    if (subscription) {
      await db.update(subscriptions).set({ usage: subscription.usage + 1 }).where(eq(subscriptions.userId, userId));
    }
  }
  async getUserByStripeCustomerId(stripeCustomerId) {
    const [user] = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId));
    return user || void 0;
  }
  async updateUserStripeInfo(userId, stripeCustomerId, stripeSubscriptionId) {
    const updates = { stripeCustomerId };
    if (stripeSubscriptionId) {
      updates.stripeSubscriptionId = stripeSubscriptionId;
    }
    const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, userId)).returning();
    return updatedUser;
  }
  // Email verification methods
  async setVerificationToken(userId, token) {
    const [updatedUser] = await db.update(users).set({ verificationToken: token }).where(eq(users.id, userId)).returning();
    return updatedUser;
  }
  async verifyUserEmail(token) {
    try {
      const [user] = await db.update(users).set({
        isVerified: true,
        verificationToken: null
      }).where(eq(users.verificationToken, token)).returning();
      return user;
    } catch (error) {
      console.error("Error verifying user email:", error);
      return void 0;
    }
  }
  async getUserByVerificationToken(token) {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user || void 0;
  }
  // Password reset methods
  async setPasswordResetToken(username, token, expires) {
    try {
      const [user] = await db.update(users).set({
        resetPasswordToken: token,
        resetPasswordExpires: expires
      }).where(eq(users.username, username)).returning();
      return user;
    } catch (error) {
      console.error("Error setting password reset token:", error);
      return void 0;
    }
  }
  async getUserByResetToken(token) {
    const [user] = await db.select().from(users).where(eq(users.resetPasswordToken, token));
    if (user && user.resetPasswordExpires) {
      const now = /* @__PURE__ */ new Date();
      if (user.resetPasswordExpires < now) {
        return void 0;
      }
    }
    return user || void 0;
  }
  async updatePassword(userId, password) {
    const [updatedUser] = await db.update(users).set({
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null
    }).where(eq(users.id, userId)).returning();
    return updatedUser;
  }
  // SMS verification methods
  async setSMSVerificationCode(userId, code, expires) {
    const [updatedUser] = await db.update(users).set({
      smsVerificationCode: code,
      smsCodeExpires: expires
    }).where(eq(users.id, userId)).returning();
    return updatedUser;
  }
  async verifySMSCode(userId, code) {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user || !user.smsVerificationCode || !user.smsCodeExpires) {
        return void 0;
      }
      const now = /* @__PURE__ */ new Date();
      if (user.smsVerificationCode !== code || user.smsCodeExpires < now) {
        return void 0;
      }
      const [verifiedUser] = await db.update(users).set({
        isPhoneVerified: true,
        isVerified: true,
        // Also mark overall account as verified
        smsVerificationCode: null,
        smsCodeExpires: null
      }).where(eq(users.id, userId)).returning();
      return verifiedUser;
    } catch (error) {
      console.error("Error verifying SMS code:", error);
      return void 0;
    }
  }
  async updatePhoneNumber(userId, phoneNumber) {
    const [updatedUser] = await db.update(users).set({
      phoneNumber,
      isPhoneVerified: false
      // Reset phone verification when number changes
    }).where(eq(users.id, userId)).returning();
    return updatedUser;
  }
  async addToWaitlist(email) {
    const [waitlistEntry] = await db.insert(waitlist).values({ email }).returning();
    return waitlistEntry;
  }
  async getWaitlistByEmail(email) {
    const [waitlistEntry] = await db.select().from(waitlist).where(eq(waitlist.email, email));
    return waitlistEntry || void 0;
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
init_resend();
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}
async function comparePasswords(supplied, stored) {
  if (!stored || !stored.includes(".")) {
    return false;
  }
  const [hashed, salt] = stored.split(".");
  if (!hashed || !salt) {
    return false;
  }
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}
function setupAuth(app2) {
  app2.set("trust proxy", 1);
  console.log("\u{1F510} SESSION_SECRET starts with:", process.env.SESSION_SECRET?.slice(0, 5));
  const sessionSettings = {
    name: "connect.sid",
    secret: process.env.SESSION_SECRET || "msgmate-ai-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1e3 * 60 * 60 * 24 * 30
      // 30 days
    }
  };
  app2.use(session2(sessionSettings));
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !await comparePasswords(password, user.password)) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        console.log("User not found during deserialization, clearing session for user ID:", id);
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      console.error("Error deserializing user:", error);
      done(null, false);
    }
  });
  const generateToken = () => randomBytes(32).toString("hex");
  app2.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }
      const user = await storage.createUser({
        ...req.body,
        email: req.body.username,
        // Store email in both fields for backward compatibility
        password: await hashPassword(req.body.password)
      });
      const verificationToken = generateToken();
      await storage.setVerificationToken(user.id, verificationToken);
      await sendVerificationEmail(user.username, verificationToken);
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });
  app2.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });
  app2.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
  app2.post("/api/forgot-password", async (req, res, next) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ message: "Email address is required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.json({ success: true, message: "If your email is registered, you will receive a password reset link" });
      }
      const resetToken = generateToken();
      const expires = /* @__PURE__ */ new Date();
      expires.setHours(expires.getHours() + 1);
      await storage.setPasswordResetToken(username, resetToken, expires);
      await sendPasswordResetEmail(username, resetToken);
      res.json({ success: true, message: "If your email is registered, you will receive a password reset link" });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/reset-password", async (req, res, next) => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }
      const hashedPassword = await hashPassword(password);
      await storage.updatePassword(user.id, hashedPassword);
      res.json({ success: true, message: "Password reset successful" });
    } catch (error) {
      next(error);
    }
  });
}

// server/routes.ts
import { z } from "zod";

// server/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
var AI_MODEL = "gpt-4-turbo";
async function generateMessageReplies(message, tone, intent, mode) {
  try {
    const isAuthenticTone = tone === "authentic";
    let instructions = `
Provide the responses in JSON format as an array of objects with a 'text' property for each reply option.
Each reply should be between 1-3 sentences, natural sounding, and appropriate for the tone requested.
Use UK English spelling (e.g., "favourite" instead of "favorite") and phrasing that feels natural to British users.
The tone should be subtly British without relying on stereotypes, forced slang, or exaggerated regionalisms.
`;
    if (isAuthenticTone) {
      instructions += `
Since the 'authentic' tone was selected, create replies that:
- Show genuine thoughtfulness and deeper engagement with the message content
- Include personal insights or values where appropriate
- Demonstrate self-awareness and emotional intelligence
- Are slightly longer and more substantive than other tones (2-4 sentences)
- Balance honesty with tactfulness in a dating context
`;
    }
    let prompt;
    if (mode === "say_it_better") {
      prompt = `${message}

${instructions}

FORMAT YOUR RESPONSE AS JSON with this exact structure:
{
  "replies": [
    {"text": "First improved version here"},
    {"text": "Second improved version here"},
    {"text": "Third improved version here"}
  ]
}
`;
    } else {
      prompt = `Someone received this message:

"${message}"

Generate 1-3 possible replies in the tone of: ${tone}.
Keep them natural, emotionally appropriate, and context-aware.
${intent ? `My intent for the reply is: "${intent}"` : ""}

${instructions}

FORMAT YOUR RESPONSE AS JSON with this exact structure:
{
  "replies": [
    {"text": "First reply option here"},
    {"text": "Second reply option here"},
    {"text": "Third reply option here"}
  ]
}
`;
    }
    let systemPrompt;
    if (mode === "say_it_better") {
      systemPrompt = "You're a dating communication coach helping someone improve a message they want to send. Your job is to create 3 emotionally distinct rewrites that keep the core meaning but offer different vibes - from clean polish to confident warmth to creative reimagining. Each version should feel human, emotionally aware, and easy to send in real dating conversations. Use neutral, standard English without any regional slang, dialect words, or cultural expressions. Avoid terms like 'cuppa', 'fancy', 'brilliant', or other regional language. Keep responses clear and universally understandable.";
    } else {
      systemPrompt = "You are an AI assistant that helps people craft perfect message replies for dating apps and WhatsApp conversations. Use neutral, standard English that completely avoids regional slang, dialect words, or culturally specific phrases. Do not use terms like 'cuppa', 'fancy', 'brilliant', 'lovely', or other regional expressions. Focus on creating clear, universally understandable responses that feel authentic and genuine without being tied to any particular dialect or region.";
    }
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: mode === "say_it_better" ? 0.9 : 0.7,
      max_tokens: mode === "say_it_better" ? 350 : 200,
      response_format: { type: "json_object" }
    });
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    try {
      const parsedData = JSON.parse(content);
      if (!parsedData.replies || !Array.isArray(parsedData.replies)) {
        console.warn("OpenAI returned unexpected format:", content);
        return [{ text: "Sorry, I couldn't generate proper replies. Please try again." }];
      }
      if (parsedData.replies.length === 0) {
        return [{ text: "I need a bit more context to generate a good reply. Could you provide more details?" }];
      }
      return parsedData.replies;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError, "Content:", content);
      return [{ text: "Sorry, I couldn't generate proper replies. Please try again." }];
    }
  } catch (error) {
    console.error("OpenAI error generating replies:", error);
    throw new Error(`Failed to generate replies: ${error.message}`);
  }
}
async function generateConversationStarters(profileContext, interests) {
  try {
    const prompt = `Generate 3 engaging conversation starters based on the following profile information:
    
Profile Context: "${profileContext}"
${interests ? `My interests: "${interests}"` : ""}

FORMAT YOUR RESPONSE AS JSON with this exact structure:
{
  "starters": [
    {"text": "First conversation starter here"},
    {"text": "Second conversation starter here"},
    {"text": "Third conversation starter here"}
  ]
}

Each starter should be 1-2 sentences, feel natural, and be likely to spark an engaging conversation in a UK dating context.
`;
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that helps people start conversations based on profile information and shared interests. You always return exactly 3 conversation starters in the requested format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    try {
      const parsedData = JSON.parse(content);
      if (!parsedData.starters || !Array.isArray(parsedData.starters)) {
        console.warn("OpenAI returned unexpected format:", content);
        return [
          { text: "I noticed something interesting in your profile. What inspired you to include that?" },
          { text: "Your profile caught my attention. What's the story behind your interest in [topic mentioned in profile]?" },
          { text: "I'm curious about what you mentioned. Could you tell me more about that?" }
        ];
      }
      if (parsedData.starters.length === 0) {
        return [
          { text: "I noticed something interesting in your profile. What inspired you to include that?" },
          { text: "Your profile caught my attention. What's the story behind your interest in [topic mentioned in profile]?" },
          { text: "I'm curious about what you mentioned. Could you tell me more about that?" }
        ];
      }
      return parsedData.starters;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError, "Content:", content);
      return [
        { text: "I noticed something interesting in your profile. What inspired you to include that?" },
        { text: "Your profile caught my attention. What's the story behind your interest in [topic mentioned in profile]?" },
        { text: "I'm curious about what you mentioned. Could you tell me more about that?" }
      ];
    }
  } catch (error) {
    console.error("OpenAI error generating conversation starters:", error);
    throw new Error(`Failed to generate conversation starters: ${error.message}`);
  }
}
async function analyzeMessage(message) {
  try {
    const prompt = `Analyze the following drafted message and provide feedback:
    
Message: "${message}"

Provide the analysis in JSON format with the following structure:
{
  "toneAnalysis": {
    "overall": "Brief tone description",
    "description": "Detailed description of the tone",
    "tags": ["tag1", "tag2", "tag3"]
  },
  "clarity": {
    "score": 0-10 score,
    "feedback": "Detailed feedback on clarity and structure"
  },
  "emotionalImpact": {
    "tags": ["emotion1", "emotion2"],
    "description": "Description of emotional impact"
  },
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "improvedVersion": "An improved version of the message"
}
`;
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an AI messaging coach that provides detailed feedback and improvements for drafted messages."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI error analyzing message:", error);
    throw new Error(`Failed to analyze message: ${error.message}`);
  }
}
async function decodeMessage(message) {
  try {
    const prompt = `Decode and analyze the following received message:
    
Message: "${message}"

Provide the analysis in JSON format with the following structure:
{
  "interpretation": "Overall interpretation of the message",
  "tone": ["tone1", "tone2", "tone3"],
  "intent": "Likely intent behind the message",
  "subtext": ["subtextual meaning 1", "subtextual meaning 2", "subtextual meaning 3"],
  "responseStrategy": "General advice on how to respond",
  "suggestedResponse": "A specific suggested response strategy"
}
`;
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are an AI message decoder that helps people understand the intent, tone, and subtext behind messages they receive."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI");
    }
    return JSON.parse(content);
  } catch (error) {
    console.error("OpenAI error decoding message:", error);
    throw new Error(`Failed to decode message: ${error.message}`);
  }
}

// server/stripe.ts
import Stripe from "stripe";
var isTestMode = process.env.STRIPE_LIVE_MODE !== "true" && process.env.NODE_ENV !== "production";
var stripeSecretKey = isTestMode ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY_LIVE;
if (!stripeSecretKey) {
  console.warn(`STRIPE_SECRET_KEY_${isTestMode ? "TEST" : "LIVE"} is not set. Stripe functionality will not work correctly.`);
}
console.log("Stripe mode:", isTestMode ? "TEST" : "LIVE");
var stripe = new Stripe(stripeSecretKey || "sk_test_placeholder", {
  apiVersion: "2023-10-16"
});
var PRICE_IDS = {
  basic: isTestMode ? process.env.STRIPE_BASIC_PRICE_ID_TEST || "price_basic_placeholder" : process.env.STRIPE_BASIC_PRICE_ID_LIVE || "price_basic_placeholder",
  pro: isTestMode ? process.env.STRIPE_PRO_PRICE_ID_TEST || "price_pro_placeholder" : process.env.STRIPE_PRO_PRICE_ID_LIVE || "price_pro_placeholder"
};
console.log("Stripe configuration loaded:", {
  mode: isTestMode ? "TEST" : "LIVE",
  secretKeyPresent: !!stripeSecretKey,
  secretKeyPrefix: stripeSecretKey?.substring(0, 8) + "...",
  priceIds: {
    basic: PRICE_IDS.basic,
    pro: PRICE_IDS.pro
  }
});
async function createCheckoutSession(user, tier, req) {
  try {
    console.log("Creating checkout session for user:", user.id, user.username);
    let stripeCustomerId = user.stripeCustomerId;
    console.log("Existing stripe customer ID:", stripeCustomerId);
    if (!stripeCustomerId) {
      console.log("Creating new Stripe customer...");
      const customer = await stripe.customers.create({
        email: user.username,
        name: user.username,
        metadata: {
          userId: user.id.toString()
        }
      });
      stripeCustomerId = customer.id;
      console.log("Created Stripe customer:", stripeCustomerId);
      await storage.updateUserStripeInfo(user.id, stripeCustomerId);
      console.log("Updated user with Stripe customer ID");
    } else {
      console.log("Using existing Stripe customer:", stripeCustomerId);
      try {
        await stripe.customers.retrieve(stripeCustomerId);
        console.log("Stripe customer verified successfully");
      } catch (error) {
        if (error.type === "StripeInvalidRequestError" && error.code === "resource_missing") {
          console.log("Stripe customer no longer exists, creating new one...");
          const customer = await stripe.customers.create({
            email: user.username,
            name: user.username,
            metadata: {
              userId: user.id.toString()
            }
          });
          stripeCustomerId = customer.id;
          console.log("Created new Stripe customer:", stripeCustomerId);
          await storage.updateUserStripeInfo(user.id, stripeCustomerId);
          console.log("Updated user with new Stripe customer ID");
        } else {
          throw error;
        }
      }
    }
    const session3 = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: tier === "basic" ? PRICE_IDS.basic : PRICE_IDS.pro,
          quantity: 1
        }
      ],
      mode: "subscription",
      success_url: `${process.env.BASE_URL || `${req.protocol}://${req.get("host")}`}/subscription-success`,
      cancel_url: `${process.env.BASE_URL || `${req.protocol}://${req.get("host")}`}/account`,
      metadata: {
        userId: user.id.toString(),
        tier,
        email: user.username,
        test_mode: isTestMode.toString()
      }
    });
    console.log("Checkout session created:", {
      id: session3.id,
      mode: session3.mode,
      customer: session3.customer,
      metadata: session3.metadata,
      priceId: tier === "basic" ? PRICE_IDS.basic : PRICE_IDS.pro,
      url: session3.url
    });
    return session3.url || "";
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}
async function handleStripeWebhook(req, res) {
  console.log("\u{1F517} Stripe webhook received");
  const sig = req.headers["stripe-signature"];
  const endpointSecret = isTestMode ? process.env.STRIPE_WEBHOOK_SECRET : process.env.STRIPE_WEBHOOK_SECRET_LIVE;
  if (!endpointSecret) {
    console.error(`\u274C STRIPE_WEBHOOK_SECRET${isTestMode ? "" : "_LIVE"} not configured`);
    return res.status(400).send("Webhook secret not configured");
  }
  let event;
  try {
    const body = req.body;
    console.log("\u{1F4E6} Webhook body type:", typeof body);
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      endpointSecret
    );
    console.log("\u2705 Webhook event verified:", event.type);
  } catch (err) {
    console.error(`\u274C Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session3 = event.data.object;
      console.log("\u{1F4B3} Processing checkout.session.completed for session:", session3.id);
      console.log("\u{1F4B0} Customer ID:", session3.customer);
      const userId = parseInt(session3.metadata?.userId || "0");
      const tier = session3.metadata?.tier;
      const email = session3.metadata?.email;
      console.log("\u{1F4CB} Session metadata - userId:", userId, "tier:", tier, "email:", email);
      if (session3.line_items?.data?.[0]?.price?.id) {
        const priceId = session3.line_items.data[0].price.id;
        console.log("\u{1F4B5} Price ID from session:", priceId);
        let actualTier = "free";
        if (priceId === PRICE_IDS.basic) {
          actualTier = "basic";
        } else if (priceId === PRICE_IDS.pro) {
          actualTier = "pro";
        }
        console.log("\u{1F3AF} Determined tier from price ID:", actualTier);
        if (userId && actualTier !== "free") {
          console.log("\u{1F504} Updating user subscription for userId:", userId, "to tier:", actualTier);
          const updatedSubscription = await storage.updateUserSubscription(userId, {
            tier: actualTier,
            usage: 0
          });
          console.log("\u2705 Subscription updated successfully:", updatedSubscription);
          if (session3.subscription) {
            console.log("\u{1F517} Updating user Stripe info with subscription ID:", session3.subscription);
            await storage.updateUserStripeInfo(
              userId,
              session3.customer,
              session3.subscription
            );
            console.log("\u2705 User Stripe info updated successfully");
          }
          if (email) {
            console.log("\u{1F4E7} Sending confirmation email to:", email);
            const { sendSubscriptionConfirmationEmail: sendSubscriptionConfirmationEmail2 } = await Promise.resolve().then(() => (init_resend(), resend_exports));
            await sendSubscriptionConfirmationEmail2(email, actualTier);
            console.log("\u2705 Confirmation email sent successfully");
          }
        } else {
          console.error("\u274C Missing required data - userId:", userId, "tier:", actualTier);
        }
      } else {
        if (userId && tier) {
          console.log("\u{1F504} Fallback: Using metadata tier for userId:", userId, "to tier:", tier);
          const updatedSubscription = await storage.updateUserSubscription(userId, {
            tier,
            usage: 0
          });
          console.log("\u2705 Subscription updated successfully (fallback):", updatedSubscription);
        } else {
          console.error("\u274C Missing required metadata - userId or tier is missing");
        }
      }
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const stripeCustomerId = subscription.customer;
      const user = await storage.getUserByStripeCustomerId(stripeCustomerId);
      if (user) {
        const items = subscription.items.data;
        if (items && items.length > 0) {
          const priceId = items[0].price.id;
          if (priceId === PRICE_IDS.basic) {
            await storage.updateUserSubscription(user.id, { tier: "basic" });
            console.log("Updated user to basic tier via subscription.updated");
          } else if (priceId === PRICE_IDS.pro) {
            await storage.updateUserSubscription(user.id, { tier: "pro" });
            console.log("Updated user to pro tier via subscription.updated");
          }
        }
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const stripeCustomerId = subscription.customer;
      const user = await storage.getUserByStripeCustomerId(stripeCustomerId);
      if (user) {
        await storage.updateUserSubscription(user.id, { tier: "free", usage: 0 });
      }
      break;
    }
  }
  res.json({ received: true });
}

// server/routes.ts
init_resend();

// server/twilio.ts
import twilio from "twilio";
var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
var twilioClient = null;
if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}
function generateVerificationCode() {
  return Math.floor(1e5 + Math.random() * 9e5).toString();
}
async function sendVerificationSMS(phoneNumber, code) {
  if (!twilioClient || !twilioPhoneNumber) {
    console.error("Twilio not configured - missing credentials or phone number");
    return false;
  }
  try {
    const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+44${phoneNumber.replace(/^0/, "")}`;
    await twilioClient.messages.create({
      body: `Your MsgMate.AI verification code is: ${code}. This code expires in 10 minutes.`,
      from: twilioPhoneNumber,
      to: formattedPhone
    });
    console.log(`SMS verification code sent to ${formattedPhone}`);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
    return false;
  }
}
function isTwilioConfigured() {
  return !!(accountSid && authToken && twilioPhoneNumber);
}

// server/routes.ts
import { randomBytes as randomBytes2 } from "crypto";
import fs from "fs";
import path from "path";
var SMS_ENABLED = false;
async function registerRoutes(app2) {
  setupAuth(app2);
  app2.use("/api", (req, res, next) => {
    const publicRoutes = [
      "/api/register",
      "/api/login",
      "/api/forgot-password",
      "/api/reset-password",
      "/api/verify-email",
      "/api/webhook",
      "/api/generate-replies",
      "/api/generate-conversation-starters",
      "/api/analyze-message",
      "/api/decode-message"
    ];
    const isPublicRoute = publicRoutes.some((route) => req.path.startsWith(route));
    if (!isPublicRoute && req.session && req.session.passport && req.session.passport.user && !req.user) {
      req.session.destroy((err) => {
        if (err) console.error("Error destroying session:", err);
        res.status(401).json({
          message: "Session expired",
          redirect: "/login?expired=true"
        });
      });
      return;
    }
    next();
  });
  app2.post("/api/webhook", handleStripeWebhook);
  app2.post("/api/waitlist", async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes("@")) {
        return res.status(400).json({ success: false, message: "Valid email is required" });
      }
      const existingEntry = await storage.getWaitlistByEmail(email);
      if (existingEntry) {
        return res.status(200).json({ success: true, message: "Email already on waitlist" });
      }
      await storage.addToWaitlist(email);
      res.json({ success: true, message: "Successfully added to waitlist" });
    } catch (error) {
      console.error("Waitlist error:", error);
      res.status(500).json({ success: false, message: "Failed to add to waitlist" });
    }
  });
  app2.post("/api/log-event", async (req, res, next) => {
    try {
      const { event, props } = req.body;
      if (!event) {
        return res.status(400).json({ success: false, message: "Event name is required" });
      }
      const log2 = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        event,
        ...props
      };
      const logsDir = path.join(process.cwd(), "logs");
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      const filePath = path.join(logsDir, "analytics.jsonl");
      fs.appendFileSync(filePath, JSON.stringify(log2) + "\n");
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Analytics logging error:", error);
      res.status(500).json({ success: false, message: "Failed to log event" });
    }
  });
  app2.post("/api/generate-replies", async (req, res, next) => {
    try {
      const freeTones = ["Playful", "Curious", "Confident", "Charming"];
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
      const selectedToneClean = selectedTone?.trim();
      console.log("Tone requested:", selectedToneClean);
      let prompt;
      let tone;
      if (mode === "say_it_better") {
        if (!userInput) {
          return res.status(400).json({ message: "User input is required for Say It Better mode" });
        }
        prompt = `You are helping someone improve a message they want to send in a dating conversation.

Here's their original message:
"${userInput}"

Return 3 short, distinct rewrites:
1. Polished version \u2013 same meaning, smoother flow
2. Engaging version \u2013 ask something curious or spark a more interesting reply
3. Playful version \u2013 add light humour or a creative twist (if appropriate)

Keep the tone casual and natural. No formal phrasing, no intense emotion. If the original message is very neutral, keep all three versions aligned to that baseline.

Use neutral, standard English without any regional slang, dialect words, or cultural expressions. Avoid terms like 'cuppa', 'fancy', 'brilliant', 'lovely', or other regional language. Keep responses clear and universally understandable.`;
        const input = userInput.toLowerCase();
        if (input.includes("sorry") || input.includes("apologize") || input.includes("my fault")) {
          tone = "sincere";
        } else if (input.includes("thank") || input.includes("appreciate") || input.includes("grateful")) {
          tone = "supportive";
        } else if (input.includes("excited") || input.includes("amazing") || input.includes("awesome") || input.includes("!")) {
          tone = "enthusiastic";
        } else if (input.includes("love") || input.includes("miss") || input.includes("heart") || input.includes("feel")) {
          tone = "romantic";
        } else if (input.includes("haha") || input.includes("lol") || input.includes("funny") || input.includes("joke")) {
          tone = "witty";
        } else if (input.includes("?") && input.length < 50) {
          tone = "curious";
        } else {
          tone = "friendly";
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
      const isAuthenticated = req.isAuthenticated();
      let usageCount = 0;
      let usageLimit = 10;
      let availableTones = ["playful", "witty", "flirty", "authentic", "supportive"];
      if (isAuthenticated && req.user) {
        const subscription = await storage.getUserSubscription(req.user.id);
        usageCount = subscription ? subscription.usage : 0;
        usageLimit = subscription?.tier === "pro" ? 400 : subscription?.tier === "basic" ? 100 : 10;
        const freeTonesAuth = ["playful", "witty", "flirty", "authentic", "supportive"];
        const basicTones = [...freeTonesAuth, "confident", "humorous", "curious", "enthusiastic", "casual"];
        const proTones = [...basicTones, "romantic", "mysterious", "assertive", "sincere", "charming"];
        if (subscription?.tier === "basic") {
          availableTones = basicTones;
        } else if (subscription?.tier === "pro") {
          availableTones = proTones;
        }
        if (mode !== "say_it_better" && !availableTones.includes(tone)) {
          return res.status(403).json({ message: "This tone requires a higher subscription tier" });
        }
      } else {
        if (mode !== "say_it_better" && !freeTones.includes(tone)) {
          return res.status(403).json({ message: "This tone requires a higher tier" });
        }
      }
      const replies = await generateMessageReplies(prompt, tone, payload.intent, mode);
      if (isAuthenticated && req.user) {
        await storage.incrementUsage(req.user.id);
      }
      res.json({ replies: replies.map((reply, index) => ({ id: index + 1, text: reply.text })) });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/conversation-starters", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const subscription = await storage.getUserSubscription(req.user.id);
      if (!subscription || subscription.tier === "free") {
        return res.status(403).json({ message: "This feature requires a Basic+ or Pro subscription" });
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
      const starters = await generateConversationStarters(profileContext, interests);
      await storage.incrementUsage(req.user.id);
      res.json({ starters: starters.map((starter, index) => ({ id: index + 1, text: starter.text })) });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/message-coach", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const subscription = await storage.getUserSubscription(req.user.id);
      if (!subscription || subscription.tier !== "pro") {
        return res.status(403).json({ message: "This feature requires a Pro subscription" });
      }
      const schema = z.object({
        message: z.string().min(1, "Message is required")
      });
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }
      const { message } = result.data;
      const analysis = await analyzeMessage(message);
      await storage.incrementUsage(req.user.id);
      res.json(analysis);
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/message-decoder", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const subscription = await storage.getUserSubscription(req.user.id);
      if (!subscription || subscription.tier !== "pro") {
        return res.status(403).json({ message: "This feature requires a Pro subscription" });
      }
      const schema = z.object({
        message: z.string().min(1, "Message is required")
      });
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }
      const { message } = result.data;
      const decoded = await decodeMessage(message);
      await storage.incrementUsage(req.user.id);
      res.json(decoded);
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/subscription", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const subscription = await storage.getUserSubscription(req.user.id);
      res.json(subscription || { tier: "free", usage: 0 });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/create-subscription", async (req, res, next) => {
    try {
      console.log("Create subscription request - isAuthenticated:", req.isAuthenticated());
      console.log("Session ID:", req.sessionID);
      console.log("User in session:", req.user);
      if (!req.isAuthenticated()) {
        console.log("Authentication failed - redirecting to login");
        return res.status(401).json({ message: "Authentication required" });
      }
      const schema = z.object({
        tier: z.enum(["basic", "pro"])
      });
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }
      const { tier } = result.data;
      const sessionUrl = await createCheckoutSession(req.user, tier, req);
      res.json({ url: sessionUrl });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/cancel-subscription", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }
      const subscription = await storage.getUserSubscription(req.user.id);
      if (!subscription || subscription.tier === "free") {
        return res.status(400).json({ message: "No active subscription to cancel" });
      }
      await storage.updateUserSubscription(req.user.id, { tier: "free", usage: 0 });
      res.json({ message: "Subscription cancelled successfully" });
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/verify-email/:token", async (req, res, next) => {
    try {
      const { token } = req.params;
      console.log("Email verification attempt with token:", token);
      if (!token) {
        return res.status(400).json({ success: false, message: "Verification token is required" });
      }
      const existingUser = await storage.getUserByVerificationToken(token);
      console.log("User found with token:", existingUser ? "Yes" : "No");
      if (!existingUser) {
        return res.status(400).json({
          success: false,
          message: "This verification link has expired or is invalid. Please register again or request a new verification email."
        });
      }
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "This email address has already been verified. You can proceed to login."
        });
      }
      const user = await storage.verifyUserEmail(token);
      if (!user) {
        return res.status(500).json({
          success: false,
          message: "An error occurred during verification. Please try again or contact support."
        });
      }
      console.log("User email verified successfully:", user.username);
      try {
        await sendWelcomeEmail(user.username);
        console.log("Welcome email sent to:", user.username);
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
      }
      res.json({ success: true, message: "Email verification successful. Welcome to MsgMate.AI!" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({
        success: false,
        message: "An unexpected error occurred during verification. Please try again."
      });
    }
  });
  app2.post("/api/forgot-password", async (req, res, next) => {
    try {
      const schema = z.object({
        username: z.string().email("Please enter a valid email address")
      });
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.error.errors[0].message });
      }
      const { username } = result.data;
      const token = randomBytes2(32).toString("hex");
      const expires = /* @__PURE__ */ new Date();
      expires.setHours(expires.getHours() + 24);
      const user = await storage.setPasswordResetToken(username, token, expires);
      if (user) {
        await sendPasswordResetEmail(username, token);
      }
      res.json({ success: true, message: "If an account with that email exists, a password reset link has been sent" });
    } catch (error) {
      next(error);
    }
  });
  app2.post("/api/resend-verification", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }
      const verificationToken = randomBytes2(32).toString("hex");
      const user = await storage.setVerificationToken(req.user.id, verificationToken);
      if (!user) {
        return res.status(400).json({ success: false, message: "Failed to update verification token" });
      }
      const emailSent = await sendVerificationEmail(user.username, verificationToken);
      if (!emailSent) {
        return res.status(500).json({ success: false, message: "Failed to send verification email" });
      }
      res.json({ success: true, message: "Verification email sent successfully" });
    } catch (error) {
      next(error);
    }
  });
  if (SMS_ENABLED) {
    app2.post("/api/send-sms-verification", async (req, res, next) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ success: false, message: "Authentication required" });
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
          return res.status(500).json({ success: false, message: "SMS service is not configured" });
        }
        const code = generateVerificationCode();
        const expires = /* @__PURE__ */ new Date();
        expires.setMinutes(expires.getMinutes() + 10);
        await storage.updatePhoneNumber(req.user.id, phoneNumber);
        await storage.setSMSVerificationCode(req.user.id, code, expires);
        const smsSent = await sendVerificationSMS(phoneNumber, code);
        if (!smsSent) {
          return res.status(500).json({ success: false, message: "Failed to send SMS verification code" });
        }
        res.json({ success: true, message: "SMS verification code sent successfully" });
      } catch (error) {
        next(error);
      }
    });
    app2.post("/api/verify-sms", async (req, res, next) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ success: false, message: "Authentication required" });
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
          return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }
        await sendWelcomeEmail(user.username);
        res.json({ success: true, message: "Phone verification successful", user });
      } catch (error) {
        next(error);
      }
    });
  }
  app2.post("/api/reset-password", async (req, res, next) => {
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
      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
      }
      await storage.updatePassword(user.id, password);
      res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
      next(error);
    }
  });
  app2.get("/api/ping", (req, res) => {
    console.log("\u{1F525} Ping received at", (/* @__PURE__ */ new Date()).toISOString());
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}

// server/index.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path4.dirname(__filename);
var app = express2();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin || "http://localhost:5000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use("/api/webhook", express2.raw({ type: "application/json" }));
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.get("/ping", (_, res) => {
    res.send("\u2705 Server is running and responding");
  });
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    const publicPath = path4.resolve(__dirname, "./public");
    app.use(express2.static(publicPath));
    app.get("*", (_, res) => {
      res.sendFile(path4.join(publicPath, "index.html"));
    });
  }
  const port = parseInt(process.env.PORT || "5000");
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
