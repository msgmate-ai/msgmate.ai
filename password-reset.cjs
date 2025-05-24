// Simple script to generate a valid password hash
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = await scrypt(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function main() {
  const password = 'admin123';
  const hash = await hashPassword(password);
  console.log('Password:', password);
  console.log('Hash:', hash);
}

main().catch(console.error);