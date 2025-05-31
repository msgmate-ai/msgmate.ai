import bcrypt from 'bcrypt';
import { pool } from './server/db.ts';

async function createTestUsers() {
  const hashedPassword = await bcrypt.hash('password', 10);
  
  const testUsers = [
    'msgmatetest1@gmail.com',
    'msgmatetest2@gmail.com', 
    'msgmatetest3@gmail.com',
    'msgmatetest4@gmail.com',
    'msgmatetest5@gmail.com'
  ];

  try {
    for (const email of testUsers) {
      // Insert user
      const userResult = await pool.query(`
        INSERT INTO users (username, password, email, is_verified, created_at) 
        VALUES ($1, $2, $3, $4, NOW()) 
        RETURNING id
      `, [email, hashedPassword, email, true]);
      
      const userId = userResult.rows[0].id;
      
      // Create Pro subscription (expires in 1 month)
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      
      await pool.query(`
        INSERT INTO subscriptions (user_id, tier, status, usage, created_at, expires_at) 
        VALUES ($1, $2, $3, $4, NOW(), $5)
      `, [userId, 'pro', 'active', 0, expiresAt]);
      
      console.log(`Created test user: ${email} with Pro subscription`);
    }
    
    console.log('\nAll test users created successfully!');
    console.log('\nLogin credentials:');
    testUsers.forEach((email, index) => {
      console.log(`${index + 1}. Email: ${email}`);
      console.log(`   Password: password`);
    });
    
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await pool.end();
  }
}

createTestUsers();