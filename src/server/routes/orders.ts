import { Router } from 'express';
import { initialOrders } from '../db';
import { requireAuth } from '../middleware/security';
import { generateOrderNumber, sanitizeInput } from '../utils/security';

const router = Router();

let orders = [...initialOrders];

/**
 * GET /api/orders
 * Retrieve orders for restaurant or customer
 */
router.get('/', (req, res) => {
  const { restaurantId, userId, status, limit = 50, page = 1 } = req.query;

  let filtered = [...orders];

  if (restaurantId) {
    filtered = filtered.filter((o) => o.restaurantId === String(restaurantId));
  }

  if (userId) {
    filtered = filtered.filter((o) => o.userId === String(userId));
  }

  if (status) {
    filtered = filtered.filter((o) => o.status === String(status));
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
 * GET /api/orders/:id
 */
router.get('/:id', (req, res) => {
  const order = orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Not Found', message: 'الطلب غير موجود.' });
  }
  res.json({ data: order });
});

/**
 * POST /api/orders
 * Create new order with full item calculation and validation
 */
router.post('/', (req, res) => {
  try {
    const {
      restaurantId,
      customerName,
      customerPhone,
      tableNumber,
      deliveryAddress,
      items,
      paymentMethod = 'CASH',
      specialInstructions
    } = req.body;

    if (!restaurantId || !customerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'معلومات المطعم، اسم الزبون، وقائمة الأصناف مطلوبة لإتمام الطلب.'
      });
    }

    let subtotal = 0;
    const processedItems = items.map((item: any, idx: number) => {
      const q = Math.max(1, Number(item.quantity || 1));
      const price = Number(item.unitPrice || item.price || 0);
      const itemTotal = q * price;
      subtotal += itemTotal;

      return {
        id: `item_${Date.now()}_${idx}`,
        productId: item.productId || item.id,
        productName: sanitizeInput(item.productName || item.name || 'طبق'),
        quantity: q,
        unitPrice: price,
        totalPrice: itemTotal,
        addonDetails: item.addons || null
      };
    });

    const tax = Math.round(subtotal * 0.15 * 100) / 100;
    const deliveryFee = tableNumber ? 0 : 15.00;
    const totalPrice = subtotal + tax + deliveryFee;

    const newOrder = {
      id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      orderNumber: generateOrderNumber(),
      userId: (req as any).user?.id || null,
      restaurantId,
      status: 'PENDING',
      totalPrice,
      subtotal,
      tax,
      deliveryFee,
      tableNumber: tableNumber ? sanitizeInput(String(tableNumber)) : null,
      deliveryAddress: deliveryAddress ? sanitizeInput(deliveryAddress) : null,
      customerName: sanitizeInput(customerName),
      customerPhone: customerPhone ? sanitizeInput(customerPhone) : '',
      specialInstructions: specialInstructions ? sanitizeInput(specialInstructions) : '',
      paymentMethod,
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      items: processedItems
    };

    orders.unshift(newOrder);

    res.status(201).json({
      success: true,
      message: 'تم إرسال الطلب بنجاح إلى المطبخ 🔔',
      data: newOrder
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal Server Error', message: error?.message });
  }
});

/**
 * PATCH /api/orders/:id/status
 * Update order processing status (PENDING, PREPARING, READY, COMPLETED, CANCELLED)
 */
router.patch('/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'COMPLETED', 'CANCELLED'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid Status', message: 'حالة الطلب غير صالحة.' });
  }

  const index = orders.findIndex((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found', message: 'الطلب غير موجود.' });
  }

  orders[index].status = status;
  if (status === 'COMPLETED') {
    orders[index].paymentStatus = 'PAID';
  }

  res.json({
    success: true,
    message: `تم تحديث حالة الطلب إلى: ${status}`,
    data: orders[index]
  });
});

/**
 * DELETE /api/orders/:id
 */
router.delete('/:id', requireAuth, (req, res) => {
  const index = orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not Found' });
  }

  orders[index].status = 'CANCELLED';
  res.json({ success: true, message: 'تم إلغاء الطلب بنجاح' });
});

export default router;
