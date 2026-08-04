import { Request, Response, NextFunction } from 'express';
import { sanitizeInput, verifyToken, API_SECRET_HEADER } from '../utils/security';

// In-Memory Rate Limiter Store
const rateLimitStore = new Map<string, { count: number; firstRequestTime: number }>();

/**
 * Enhanced Security Headers Middleware
 * Fortifies the platform against Clickjacking, MIME sniffing, XSS, and unauthorized framing
 */
export function applySecurityHeaders(_req: Request, res: Response, next: NextFunction) {
  // Prevent clickjacking & framing attacks
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  // Disable MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Enable XSS protection filter in older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Closed-Source API Identification Header
  res.setHeader('X-Powered-By-Platform', 'menuz-Enterprise-Security-V2');
  
  next();
}

/**
 * Strict Input Sanitization & Anti-Injection Middleware
 * Cleans request body, query parameters, and route params from SQL/XSS payloads
 */
export function sanitizeRequestMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeInput(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeInput(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeInput(req.params);
  }
  next();
}

/**
 * Rate Limiting Middleware
 * Protects endpoints from Brute-Force, Spam, and Denial of Service (DoS) attacks
 */
export function rateLimiter(limit = 100, windowMs = 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.ip || '127.0.0.1';
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    const record = rateLimitStore.get(key);

    if (!record) {
      rateLimitStore.set(key, { count: 1, firstRequestTime: now });
      return next();
    }

    if (now - record.firstRequestTime > windowMs) {
      // Reset window
      rateLimitStore.set(key, { count: 1, firstRequestTime: now });
      return next();
    }

    record.count += 1;
    if (record.count > limit) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'تم كشف نشاط مرتفع جداً. تم حظر الطلبات المؤقتة لحماية أمان المنصة.',
        retryAfterSeconds: Math.ceil((windowMs - (now - record.firstRequestTime)) / 1000)
      });
    }

    next();
  };
}

/**
 * Private API Authentication Guard Middleware
 * Protects closed-source endpoints requiring valid JWT or Secret key
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const privateSecret = req.headers['x-menuz-api-secret'];

  // Allow internal requests with secret key
  if (privateSecret && privateSecret === API_SECRET_HEADER) {
    (req as any).user = { role: 'ADMIN', name: 'Internal Service' };
    return next();
  }

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'غير مصرح الوصول. يرجى تسجيل الدخول أولاً.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid Token', message: 'رمز الجلسة غير صالحة أو منتهي الصلاحية.' });
  }

  (req as any).user = decoded;
  next();
}

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 * Validates user roles (ADMIN, OWNER / RESTAURANT_OWNER, USER / CUSTOMER)
 */
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !user.role) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'ليس لديك صلاحية لإجراء هذه العملية على المنصة.'
      });
    }

    // Normalize roles to handle aliases (e.g., OWNER <-> RESTAURANT_OWNER, USER <-> CUSTOMER)
    const normalizedUserRole = user.role.toUpperCase();
    const expandedAllowedRoles = roles.flatMap((r) => {
      const upper = r.toUpperCase();
      if (upper === 'OWNER') return ['OWNER', 'RESTAURANT_OWNER'];
      if (upper === 'RESTAURANT_OWNER') return ['OWNER', 'RESTAURANT_OWNER'];
      if (upper === 'USER') return ['USER', 'CUSTOMER'];
      if (upper === 'CUSTOMER') return ['USER', 'CUSTOMER'];
      return [upper];
    });

    if (!expandedAllowedRoles.includes(normalizedUserRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'ليس لديك صلاحية لإجراء هذه العملية على المنصة.'
      });
    }

    next();
  };
}
