/**
 * Menuz Enterprise Database Client Adapter
 * Integrates Prisma ORM with PostgreSQL and fallback mock/cached persistence layer
 */

import { generateOrderNumber, hashPassword } from './utils/security';

// In-memory initialized database tables (fallback & initial seed structure)
export const initialUsers = [
  {
    id: 'user_admin_01',
    name: 'Yazan Salaq',
    email: 'yazansalaq@gmail.com',
    password: hashPassword('Admin123!@#'),
    role: 'ADMIN',
    phone: '+966500000000',
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'user_owner_01',
    name: 'Palace Restaurant Owner',
    email: 'owner@palace.com',
    password: hashPassword('Owner123!@#'),
    role: 'RESTAURANT_OWNER',
    phone: '+966511111111',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export const initialRestaurants = [
  {
    id: 'rest_palace_01',
    name: 'مطعم وكافيه القصر',
    description: 'أفخر المأكولات الشرقية والغربية والحلويات الملكية في أجواء راقية',
    address: 'طريق الملك فهد، الرياض، المملكة العربية السعودية',
    phone: '+966112233444',
    logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&auto=format&fit=crop',
    coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop',
    ownerId: 'user_owner_01',
    isActive: true,
    isFeatured: true,
    openingTime: '08:00',
    closingTime: '23:30',
    currency: 'SAR',
    taxRate: 0.15,
    deliveryFee: 15.00,
    minOrderAmount: 30.00,
    rating: 4.9,
    createdAt: new Date().toISOString()
  }
];

export const initialCategories = [
  {
    id: 'cat_grill_01',
    name: 'المشويات الملكية',
    description: 'أفضل قطع اللحوم والدواجن الطازجة المشوية على الفحم الحجري',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop',
    restaurantId: 'rest_palace_01',
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'cat_main_02',
    name: 'الأطباق الرئيسية',
    description: 'كبسات وأرز باللحم الضأن والنعيمي والدجاج البلدي',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop',
    restaurantId: 'rest_palace_01',
    sortOrder: 2,
    isActive: true
  },
  {
    id: 'cat_dessert_03',
    name: 'الحلويات والمشروبات',
    description: 'كنافة نابلسية، عصائر طازجة وقهوة مختصة',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop',
    restaurantId: 'rest_palace_01',
    sortOrder: 3,
    isActive: true
  }
];

export const initialProducts = [
  {
    id: 'prod_kabsa_01',
    name: 'كبسة نعيمي ملكي',
    description: 'لحم ضأن نعيمي طازج مع الأرز البسمتي الفاخر والكسرات والمكسرات المقلية',
    price: 98.00,
    discountPrice: 88.00,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop',
    categoryId: 'cat_main_02',
    restaurantId: 'rest_palace_01',
    isAvailable: true,
    isFeatured: true,
    calories: 850,
    preparationTime: 25,
    sortOrder: 1
  },
  {
    id: 'prod_grill_02',
    name: 'مشاوي القصر المشكلة (1 كجم)',
    description: 'كباب لحم، كباب دجاج، شيس طاووق، وريش ضأن طازجة مع الخبز والمقبلات',
    price: 180.00,
    discountPrice: null,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop',
    categoryId: 'cat_grill_01',
    restaurantId: 'rest_palace_01',
    isAvailable: true,
    isFeatured: true,
    calories: 1200,
    preparationTime: 30,
    sortOrder: 2
  },
  {
    id: 'prod_kunafa_03',
    name: 'كنافة بالقشطة النابلسية',
    description: 'كنافة ذهبية مقرمشة محشوة بالقشطة البلدية ومغرق بالسيرب الدافئ',
    price: 36.00,
    discountPrice: 30.00,
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop',
    categoryId: 'cat_dessert_03',
    restaurantId: 'rest_palace_01',
    isAvailable: true,
    isFeatured: false,
    calories: 450,
    preparationTime: 15,
    sortOrder: 3
  }
];

export const initialOrders = [
  {
    id: 'ord_sample_01',
    orderNumber: generateOrderNumber(),
    userId: 'user_admin_01',
    restaurantId: 'rest_palace_01',
    status: 'PREPARING',
    totalPrice: 134.00,
    subtotal: 114.00,
    tax: 15.00,
    deliveryFee: 5.00,
    tableNumber: '12',
    customerName: 'يزن صلاق',
    customerPhone: '+966500000000',
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    createdAt: new Date().toISOString(),
    items: [
      {
        id: 'item_01',
        productId: 'prod_kabsa_01',
        productName: 'كبسة نعيمي ملكي',
        quantity: 1,
        unitPrice: 98.00,
        totalPrice: 98.00
      },
      {
        id: 'item_02',
        productId: 'prod_kunafa_03',
        productName: 'كنافة بالقشطة النابلسية',
        quantity: 1,
        unitPrice: 36.00,
        totalPrice: 36.00
      }
    ]
  }
];
