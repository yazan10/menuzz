import { Router } from 'express';
import { initialRestaurants, initialCategories } from '../db';
import { requireAuth, requireRole } from '../middleware/security';
import { sanitizeInput } from '../utils/security';

const router = Router();

let restaurants = [...initialRestaurants];
let categories = [...initialCategories];

/**
 * GET /api/restaurants
 * Retrieve restaurants list with search, pagination, and status filtering
 */
router.get('/', (req, res) => {
  const { search, isActive, isFeatured, limit = 20, page = 1 } = req.query;

  let filtered = [...restaurants];

  if (isActive !== undefined) {
    filtered = filtered.filter((r) => r.isActive === (isActive === 'true'));
  }

  if (isFeatured !== undefined) {
    filtered = filtered.filter((r) => r.isFeatured === (isFeatured === 'true'));
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (r) => r.name.toLowerCase().includes(q) || (r.description && r.description.toLowerCase().includes(q))
    );
  }

  const p = Math.max(1, Number(page));
  const l = Math.max(1, Number(limit));
  const total = filtered.length;
  const paginated = filtered.slice((p - 1) * l, p * l);

  res.json({
    total,
    page: p,
    limit: l,
    totalPages: Math.ceil(total / l),
    data: paginated
  });
});

/**
 * GET /api/restaurants/:id
 * Retrieve specific restaurant details
 */
router.get('/:id', (req, res) => {
  const restaurant = restaurants.find((r) => r.id === req.params.id);

  if (!restaurant) {
    return res.status(404).json({ error: 'Not Found', message: 'المطعم غير موجود.' });
  }

  res.json({ data: restaurant });
});

/**
 * POST /api/restaurants
 * Create new restaurant (Authenticated ADMIN / OWNER)
 */
router.post('/', requireAuth, requireRole('ADMIN', 'RESTAURANT_OWNER'), (req, res) => {
  try {
    const { name, description, address, phone, logoUrl, coverUrl, currency, deliveryFee } = req.body;
    const currentUser = (req as any).user;

    if (!name) {
      return res.status(400).json({ error: 'Validation Error', message: 'اسم المطعم مطلوب.' });
    }

    const newRestaurant = {
      id: `rest_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: sanitizeInput(name),
      description: description ? sanitizeInput(description) : '',
      address: address ? sanitizeInput(address) : '',
      phone: phone ? sanitizeInput(phone) : '',
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop',
      ownerId: currentUser.id || 'user_owner_01',
      isActive: true,
      isFeatured: false,
      openingTime: '08:00',
      closingTime: '23:30',
      currency: currency || 'SAR',
      taxRate: 0.15,
      deliveryFee: deliveryFee ? Number(deliveryFee) : 15.00,
      minOrderAmount: 0,
      rating: 5.0,
      createdAt: new Date().toISOString()
    };

    restaurants.push(newRestaurant);

    res.status(201).json({
      success: true,
      message: 'تم إضافة المطعم الجديد بنجاح 🍽️',
      data: newRestaurant
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', message: error?.message });
  }
});

/**
 * PUT /api/restaurants/:id
 */
router.put('/:id', requireAuth, requireRole('ADMIN', 'RESTAURANT_OWNER'), (req, res) => {
  const index = restaurants.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found' });
  }

  restaurants[index] = {
    ...restaurants[index],
    ...sanitizeInput(req.body)
  };

  res.json({ success: true, message: 'تم تحديث بيانات المطعم بنجاح', data: restaurants[index] });
});

/**
 * DELETE /api/restaurants/:id
 */
router.delete('/:id', requireAuth, requireRole('ADMIN'), (req, res) => {
  const index = restaurants.findIndex((r) => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found' });
  }

  restaurants.splice(index, 1);
  res.json({ success: true, message: 'تم حذف المطعم من النظام' });
});

/**
 * GET /api/restaurants/:id/categories
 */
router.get('/:id/categories', (req, res) => {
  const restCategories = categories.filter((c) => c.restaurantId === req.params.id && c.isActive);
  res.json({ data: restCategories });
});

/**
 * POST /api/restaurants/:id/categories
 */
router.post('/:id/categories', requireAuth, requireRole('ADMIN', 'RESTAURANT_OWNER'), (req, res) => {
  const { name, description, imageUrl } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const newCat = {
    id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: sanitizeInput(name),
    description: description ? sanitizeInput(description) : '',
    imageUrl: imageUrl || '',
    restaurantId: req.params.id,
    sortOrder: categories.length + 1,
    isActive: true
  };

  categories.push(newCat);
  res.status(201).json({ success: true, data: newCat });
});

export default router;
