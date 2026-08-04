import { Router } from 'express';
import { requireAuth } from '../middleware/security';
import { sanitizeInput } from '../utils/security';

const router = Router();

let reviews: any[] = [
  {
    id: 'rev_01',
    userId: 'user_admin_01',
    restaurantId: 'rest_palace_01',
    rating: 5,
    comment: 'خدمة ممتازة وطباعة سريعة للطلبات والكبسة لديدة جداً!',
    createdAt: new Date().toISOString()
  }
];

/**
 * GET /api/reviews
 */
router.get('/', (req, res) => {
  const { restaurantId } = req.query;
  let filtered = [...reviews];
  if (restaurantId) {
    filtered = filtered.filter((r) => r.restaurantId === String(restaurantId));
  }
  res.json({ data: filtered });
});

/**
 * POST /api/reviews
 */
router.post('/', requireAuth, (req, res) => {
  const { restaurantId, rating, comment } = req.body;
  const user = (req as any).user;

  if (!restaurantId || !rating) {
    return res.status(400).json({ error: 'Restaurant ID and rating required' });
  }

  const newReview = {
    id: `rev_${Date.now()}`,
    userId: user.id,
    restaurantId,
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: comment ? sanitizeInput(comment) : '',
    createdAt: new Date().toISOString()
  };

  reviews.push(newReview);
  res.status(201).json({ success: true, data: newReview });
});

export default router;
