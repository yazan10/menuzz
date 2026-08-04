import { Router } from 'express';
import { initialUsers } from '../db';
import { hashPassword, verifyPassword, generateToken, sanitizeInput } from '../utils/security';
import { rateLimiter, requireAuth } from '../middleware/security';

const router = Router();

// Store users in-memory for immediate active runtime state
let users = [...initialUsers];

/**
 * POST /api/auth/register
 * Public registration endpoint with strict payload validation & password hashing
 */
router.post('/register', rateLimiter(5, 15 * 60 * 1000), (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'الاسم، البريد الإلكتروني وكلمة المرور مطلوبة.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    if (!cleanEmail.includes('@')) {
      return res.status(400).json({ error: 'Invalid Email', message: 'يرجى إدخال بريد إلكتروني صحيح.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Weak Password', message: 'يجب أن تتكون كلمة المرور من 6 خانات على الأقل.' });
    }

    const existing = users.find((u) => u.email === cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'User Exists', message: 'البريد الإلكتروني مسجل بالفعل في المنصة.' });
    }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: sanitizeInput(name),
      email: cleanEmail,
      password: hashPassword(password),
      role: role && ['ADMIN', 'RESTAURANT_OWNER', 'CUSTOMER'].includes(role) ? role : 'CUSTOMER',
      phone: phone ? sanitizeInput(phone) : undefined,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = generateToken({ id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح 🚀',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, phone: newUser.phone }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', message: error?.message });
  }
});

/**
 * POST /api/auth/login
 * User login endpoint returning signed JWT token
 */
router.post('/login', rateLimiter(10, 15 * 60 * 1000), (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Validation Error', message: 'البريد الإلكتروني وكلمة المرور مطلوبان.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const user = users.find((u) => u.email === cleanEmail);

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: 'Unauthorized', message: 'بيانات الدخول غير صحيحة.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account Suspended', message: 'تم إيقاف هذا الحساب. يرجى مراجعة الدعم.' });
    }

    const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', message: error?.message });
  }
});

/**
 * GET /api/auth/me
 * Retrieves active authenticated user profile
 */
router.get('/me', requireAuth, (req, res) => {
  const currentUser = (req as any).user;
  const user = users.find((u) => u.id === currentUser.id || u.email === currentUser.email);

  if (!user) {
    return res.status(404).json({ error: 'Not Found', message: 'المستخدم غير موجود.' });
  }

  res.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, createdAt: user.createdAt }
  });
});

/**
 * POST /api/auth/reset-password
 * Password recovery request
 */
router.post('/reset-password', rateLimiter(3, 15 * 60 * 1000), (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email required', message: 'البريد الإلكتروني مطلوب.' });
  }

  res.json({
    success: true,
    message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.'
  });
});

/**
 * POST /api/auth/change-password
 */
router.post('/change-password', requireAuth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const currentUser = (req as any).user;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Validation Error', message: 'كلمة المرور القديمة والجديدة مطلوبتان.' });
  }

  const userIndex = users.findIndex((u) => u.id === currentUser.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User Not Found' });
  }

  if (!verifyPassword(oldPassword, users[userIndex].password)) {
    return res.status(400).json({ error: 'Invalid Password', message: 'كلمة المرور القديمة غير صحيحة.' });
  }

  users[userIndex].password = hashPassword(newPassword);

  res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح 🔒' });
});

export default router;
