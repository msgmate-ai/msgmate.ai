import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-please-change-in-production";

export function signToken(payload: object, expiresIn = "24h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}