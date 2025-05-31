import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { pool } from './server/db.ts';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function fixTestPasswords() {
  try {
    const correctHash = await hashPassword('password');
    console.log('Generated correct hash:', correctHash);
    
    // Update all test accounts with the correct password format
    const testEmails = [
      'msgmatetest1@gmail.com',
      'msgmatetest2@gmail.com', 
      'msgmatetest3@gmail.com',
      'msgmatetest4@gmail.com',
      'msgmatetest5@gmail.com'
    ];
    
    for (const email of testEmails) {
      await pool.query('UPDATE users SET password = $1 WHERE username = $2', [correctHash, email]);
      console.log(`Updated password for ${email}`);
    }
    
    console.log('All test account passwords fixed!');
    
  } catch (error) {
    console.error('Error fixing passwords:', error);
  } finally {
    await pool.end();
  }
}

fixTestPasswords();