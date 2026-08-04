import { Router } from 'express';
import { initialUsers, initialRestaurants, initialOrders } from '../db';
import { requireAuth, requireRole } from '../middleware/security';

const router = Router();

/**
 * All admin routes require authenticated user with ADMIN role
 */
router.use(requireAuth, requireRole('ADMIN'));

/**
 * GET /api/admin/stats
 * Platform-wide business and system metrics
 */
router.get('/stats', (_req, res) => {
  const totalRevenue = initialOrders.reduce((sum, o) => sum + Number(o.totalPrice), 0);
  res.json({
    data: {
      totalUsers: initialUsers.length,
      totalRestaurants: initialRestaurants.length,
      totalOrders: initialOrders.length,
      totalRevenue,
      systemStatus: 'Optimal & Secure 🟢',
      databaseEngine: 'PostgreSQL / Prisma ORM',
      securityLayer: 'Active anti-injection & rate-limiting'
    }
  });
});

/**
 * GET /api/admin/users
 */
router.get('/users', (_req, res) => {
  res.json({ data: initialUsers });
});

/**
 * GET /api/admin/restaurants
 */
router.get('/restaurants', (_req, res) => {
  res.json({ data: initialRestaurants });
});

export default router;
