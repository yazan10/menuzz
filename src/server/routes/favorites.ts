import { Router } from 'express';
import { requireAuth } from '../middleware/security';

const router = Router();

let favorites: any[] = [];

/**
 * GET /api/favorites
 */
router.get('/', requireAuth, (req, res) => {
  const user = (req as any).user;
  const userFavs = favorites.filter((f) => f.userId === user.id);
  res.json({ data: userFavs });
});

/**
 * POST /api/favorites
 */
router.post('/', requireAuth, (req, res) => {
  const { restaurantId } = req.body;
  const user = (req as any).user;

  if (!restaurantId) {
    return res.status(400).json({ error: 'Restaurant ID required' });
  }

  const existing = favorites.find((f) => f.userId === user.id && f.restaurantId === restaurantId);
  if (existing) {
    return res.json({ success: true, message: 'المطعم مضاف بالفعل للمفضلة', data: existing });
  }

  const newFav = {
    id: `fav_${Date.now()}`,
    userId: user.id,
    restaurantId,
    createdAt: new Date().toISOString()
  };

  favorites.push(newFav);
  res.status(201).json({ success: true, message: 'تم الإضافة للمفضلة ❤️', data: newFav });
});

/**
 * DELETE /api/favorites/:id
 */
router.delete('/:id', requireAuth, (req, res) => {
  const user = (req as any).user;
  const index = favorites.findIndex((f) => f.id === req.params.id && f.userId === user.id);
  if (index !== -1) {
    favorites.splice(index, 1);
  }
  res.json({ success: true, message: 'تم إزالة المطعم من المفضلة' });
});

export default router;
