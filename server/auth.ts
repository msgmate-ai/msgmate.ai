import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "./resend";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

declare module 'express-session' {
  interface SessionData {
    user?: SelectUser;
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "msgmate-ai-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax' // Better cross-site compatibility
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }),
  );

  passport.serializeUser((user, done) => {
    console.log('SERIALIZE: Storing user ID in session:', user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    console.log('DESERIALIZE: Attempting to load user with ID:', id);
    try {
      const user = await storage.getUser(id);
      if (!user) {
        console.log('DESERIALIZE: User not found for ID:', id);
        return done(null, false);
      }
      console.log('DESERIALIZE: Successfully loaded user:', user.username);
      done(null, user);
    } catch (error) {
      console.error('DESERIALIZE: Error loading user:', error);
      done(null, false);
    }
  });

  // Helper function to generate random token
  const generateToken = () => randomBytes(32).toString('hex');

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      // Create the user with email set to username (since username is email)
      const user = await storage.createUser({
        ...req.body,
        email: req.body.username, // Store email in both fields for backward compatibility
        password: await hashPassword(req.body.password),
      });

      // Generate verification token
      const verificationToken = generateToken();
      await storage.setVerificationToken(user.id, verificationToken);

      // Send verification email
      await sendVerificationEmail(user.username, verificationToken);

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Store user in session for additional backup
    if (req.user) {
      (req.session as any).user = req.user;
      console.log('LOGIN: User authenticated:', req.user.username);
      console.log('LOGIN: Session ID:', req.sessionID);
      console.log('LOGIN: Session data:', JSON.stringify(req.session, null, 2));
      
      // Force session save before responding
      req.session.save((err) => {
        if (err) {
          console.error('LOGIN: Error saving session:', err);
          return res.status(500).json({ message: 'Session save failed' });
        }
        console.log('LOGIN: Session saved successfully');
        res.status(200).json(req.user);
      });
    } else {
      res.status(200).json(req.user);
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      // Clear session user as well
      if (req.session) {
        delete (req.session as any).user;
      }
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log('USER_CHECK: Session ID:', req.sessionID);
    console.log('USER_CHECK: isAuthenticated():', req.isAuthenticated());
    console.log('USER_CHECK: req.user:', req.user ? req.user.username : 'undefined');
    console.log('USER_CHECK: session data:', JSON.stringify(req.session, null, 2));
    
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // New /api/me endpoint for consistent session checking
  app.get("/api/me", (req, res) => {
    console.log('ME_CHECK: Session ID:', req.sessionID);
    console.log('ME_CHECK: isAuthenticated():', req.isAuthenticated());
    console.log('ME_CHECK: req.user:', req.user ? req.user.username : 'undefined');
    console.log('ME_CHECK: session data:', JSON.stringify(req.session, null, 2));
    
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json(req.user);
  });



  // Request password reset
  app.post("/api/forgot-password", async (req, res, next) => {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ message: "Email address is required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        // Don't reveal if the user exists or not for security
        return res.json({ success: true, message: "If your email is registered, you will receive a password reset link" });
      }

      // Generate reset token and set expiration (1 hour from now)
      const resetToken = generateToken();
      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      await storage.setPasswordResetToken(username, resetToken, expires);
      await sendPasswordResetEmail(username, resetToken);
      
      res.json({ success: true, message: "If your email is registered, you will receive a password reset link" });
    } catch (error) {
      next(error);
    }
  });

  // Reset password
  app.post("/api/reset-password", async (req, res, next) => {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      const user = await storage.getUserByResetToken(token);
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Hash the new password and update user
      const hashedPassword = await hashPassword(password);
      await storage.updatePassword(user.id, hashedPassword);
      
      res.json({ success: true, message: "Password reset successful" });
    } catch (error) {
      next(error);
    }
  });
}
