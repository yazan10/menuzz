import { Router } from 'express';
import { initialProducts } from '../db';
import { requireAuth, requireRole } from '../middleware/security';
import { sanitizeInput } from '../utils/security';

const router = Router();

let products = [...initialProducts];
let addons: any[] = [];

/**
 * GET /api/products
 * Retrieve menu items with search, filters (category, restaurant, minPrice, maxPrice, isAvailable)
 */
router.get('/', (req, res) => {
  const { restaurantId, categoryId, search, isAvailable, minPrice, maxPrice, limit = 50, page = 1 } = req.query;

  let filtered = [...products];

  if (restaurantId) {
    filtered = filtered.filter((p) => p.restaurantId === String(restaurantId));
  }

  if (categoryId) {
    filtered = filtered.filter((p) => p.categoryId === String(categoryId));
  }

  if (isAvailable !== undefined) {
    filtered = filtered.filter((p) => p.isAvailable === (isAvailable === 'true'));
  }

  if (minPrice) {
    filtered = filtered.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    filtered = filtered.filter((p) => p.price <= Number(maxPrice));
  }

  if (search) {
    const q = String(search).toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))
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
 * GET /api/products/:id
 */
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Not Found', message: 'المنتج غير موجود.' });
  }

  const productAddons = addons.filter((a) => a.productId === product.id);
  res.json({ data: { ...product, addons: productAddons } });
});

/**
 * POST /api/products
 * Add new dish/product
 */
router.post('/', requireAuth, requireRole('ADMIN', 'RESTAURANT_OWNER'), (req, res) => {
  try {
    const { name, description, price, discountPrice, imageUrl, categoryId, restaurantId, calories, preparationTime } = req.body;

    if (!name || price === undefined || !categoryId || !restaurantId) {
      return res.status(400).json({ error: 'Validation Error', message: 'الاسم، السعر، التصنيف والمطعم حقول إجبارية.' });
    }

    const newProduct = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: sanitizeInput(name),
      description: description ? sanitizeInput(description) : '',
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : null,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop',
      categoryId,
      restaurantId,
      isAvailable: true,
      isFeatured: false,
      calories: calories ? Number(calories) : null,
      preparationTime: preparationTime ? Number(preparationTime) : 15,
      sortOrder: products.length + 1
    };

    products.push(newProduct);

    res.status(201).json({
      success: true,
      message: 'تم إضافة المنتج إلى المنيو بنجاح 🍲',
      data: newProduct
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', message: error?.message });
  }
});

/**
 * PUT /api/products/:id
 */
router.put('/:id', requireAuth, requireRole('ADMIN', 'RESTAURANT_OWNER'), (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found' });
  }

  products[index] = {
    ...products[index],
    ...sanitizeInput(req.body)
  };

  res.json({ success: true, message: 'تم تحديث بيانات الطبق', data: products[index] });
});

/**
 * DELETE /api/products/:id
 */
router.delete('/:id', requireAuth, requireRole('ADMIN', 'RESTAURANT_OWNER'), (req, res) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found' });
  }

  products.splice(index, 1);
  res.json({ success: true, message: 'تم حذف المنتج من المنيو' });
});

/**
 * GET /api/products/:id/addons
 */
router.get('/:id/addons', (req, res) => {
  const prodAddons = addons.filter((a) => a.productId === req.params.id);
  res.json({ data: prodAddons });
});

/**
 * POST /api/products/:id/addons
 */
router.post('/:id/addons', requireAuth, requireRole('ADMIN', 'RESTAURANT_OWNER'), (req, res) => {
  const { name, price, isRequired, maxSelect } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Name and price required' });
  }

  const newAddon = {
    id: `addon_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: sanitizeInput(name),
    price: Number(price),
    productId: req.params.id,
    isRequired: Boolean(isRequired),
    maxSelect: maxSelect ? Number(maxSelect) : 1,
    sortOrder: addons.length + 1
  };

  addons.push(newAddon);
  res.status(201).json({ success: true, data: newAddon });
});

export default router;
