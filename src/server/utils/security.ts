import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Secret keys for cryptographic signing and token validation
const JWT_SECRET = process.env.JWT_SECRET || 'menuz_ultra_secure_closed_source_jwt_secret_key_2026';
const API_SECRET_HEADER = process.env.API_SECRET_HEADER || 'menuz_private_api_key_v1';
const BCRYPT_SALT_ROUNDS = 10;

/**
 * Hash password securely using Bcrypt (10 salt rounds)
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Compare plain password against stored Bcrypt hash or SHA-256 fallback
 */
export function verifyPassword(password: string, hash: string): boolean {
  if (!hash) return false;
  
  // Bcrypt hashes start with $2a$, $2b$, or $2y$
  if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
    return bcrypt.compareSync(password, hash);
  }
  
  // Fallback check for legacy SHA-256 seed hashes
  const salt = 'menuz_salt_981273';
  const legacyHash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return legacyHash === hash;
}

/**
 * Generate JWT token using JsonWebToken library with expiration
 */
export function generateToken(payload: Record<string, any>, expiresInHours = 24): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: `${expiresInHours}h`,
    algorithm: 'HS256'
  });
}

/**
 * Verify JWT token and return decoded payload if valid
 */
export function verifyToken(token: string): Record<string, any> | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    return typeof decoded === 'object' ? decoded : null;
  } catch {
    return null;
  }
}

/**
 * Sanitize string input against XSS, HTML injection, and SQL injection characters
 */
export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/['"`;]/g, '') // Strip SQL injection unsafe quotes
      .trim();
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === 'object' && input !== null) {
    const sanitized: Record<string, any> = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }
  return input;
}

/**
 * Generate unique Order Number (e.g., ORD-2026-9812)
 */
export function generateOrderNumber(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${new Date().getFullYear()}-${randomDigits}`;
}

export { JWT_SECRET, API_SECRET_HEADER };
