import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from "./resend";
import { logEvent } from "./utils/analytics";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      email: string;
      username: string;
    };
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
  // Session is now configured in index.ts
  app.set("trust proxy", 1);
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
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    console.log('Deserializing user ID:', id);
    try {
      const user = await storage.getUser(id);
      if (!user) {
        console.log('User not found during deserialization for ID:', id);
        return done(null, false);
      }
      console.log('Deserialized user:', user.username);
      done(null, user);
    } catch (error) {
      console.error('Error deserializing user:', error);
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

      // Log signup event
      logEvent('signup', user.id, user.username);

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

  app.post("/api/login", (req, res, next) => {
    console.log('Login attempt for:', req.body.username);
    console.log('Session before login:', req.sessionID, req.session);
    
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      if (!user) {
        console.log('Login failed for:', req.body.username, 'Info:', info);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      req.logIn(user, (err: any) => {
        if (err) {
          console.error('Session creation error:', err);
          return next(err);
        }
        
        // Manually set session data to ensure persistence
        (req.session as any).user = {
          id: user.id,
          email: user.email,
          username: user.username
        };
        
        // Force session save to ensure it persists
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return next(err);
          }
          
          console.log('✅ Session user set:', (req.session as any).user);
          console.log('Login successful for:', user.username);
          console.log('Session after login:', req.session);
          res.json({ success: true, user });
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log('User check - Session ID:', req.sessionID);
    console.log('Session data:', req.session);
    console.log('Authenticated:', req.isAuthenticated());
    console.log('req.user:', req.user?.username);
    console.log('session.user:', (req.session as any).user);
    
    // Check session user data first, then fallback to passport user
    if ((req.session as any).user) {
      res.json((req.session as any).user);
    } else if (req.isAuthenticated() && req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
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
