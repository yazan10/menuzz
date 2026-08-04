export type Language = 'ar' | 'en' | 'tr' | 'he' | 'ru' | 'zh' | 'hi' | 'de' | 'fr' | 'es';

export interface Branch {
  id: string;
  name: string;
  nameEn: string;
  address: string;
  phone: string;
  city: string;
  lat: number;
  lng: number;
  openingHours: string;
  tablesCount: number;
  active: boolean;
}

export interface OptionChoice {
  id: string;
  name: string;
  nameEn: string;
  price: number;
}

export interface DishOption {
  id: string;
  title: string;
  titleEn: string;
  required: boolean;
  choices: OptionChoice[];
}

export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  calories?: number;
  image: string;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isGlutenFree?: boolean;
  isChefSpecial?: boolean;
  isBestSeller?: boolean;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  options?: DishOption[];
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface OrderItem {
  dishId: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
  selectedChoices?: string[];
  notes?: string;
}

export type PaymentMethod = 'cash' | 'visa' | 'apple_pay' | 'stc_pay' | 'mada';
export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'served' | 'cancelled';
export type OrderType = 'table' | 'takeaway' | 'delivery';

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  expiryDate?: string;
  usageLimit?: number;
  timesUsed: number;
  active: boolean;
  createdAt: string;
}

export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  vehicle: 'motorcycle' | 'car' | 'bicycle';
  status: 'available' | 'busy' | 'offline';
  activeOrdersCount: number;
  avatar?: string;
  rating?: number;
}

export interface SocialStoryTemplate {
  id: string;
  title: string;
  titleEn: string;
  category: 'qr' | 'offer' | 'dish' | 'delivery';
  bgGradient: string;
  accentColor: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  badge?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  branchId: string;
  branchName: string;
  tableNumber?: number;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee?: number;
  loyaltyDiscountAmount?: number;
  loyaltyPointsEarned?: number;
  loyaltyPointsRedeemed?: number;
  couponCode?: string;
  couponDiscountAmount?: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  type: OrderType;
  deliveryAddress?: string;
  deliveryNotes?: string;
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  estimatedDeliveryMinutes?: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  branchId: string;
  branchName: string;
  date: string;
  time: string;
  guestsCount: number;
  tableNumber?: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  branchId: string;
  customerName: string;
  rating: number;
  comment: string;
  dishName?: string;
  date: string;
  adminReply?: string;
}

export type SubscriptionPlanTier = 'plan_1' | 'plan_2' | 'plan_3' | 'plan_3_enterprise' | 'plan_4_enterprise';

export interface SubscriptionPlan {
  id: SubscriptionPlanTier;
  nameAr: string;
  nameEn: string;
  priceMonthly: number;
  priceYearly?: number;
  priceDisplayAr: string;
  priceDisplayEn: string;
  canRemoveBranding: boolean; // Plan 3 can remove "Powered by menuz"
  maxStoresAllowed: number;
  description: string;
  features: string[];
}

export interface Post {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  contentEn?: string;
  image: string;
  badge?: string; // e.g. "عرض خاص 🔥", "خصم 20%", "إعلان جديد"
  discountCode?: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  dishId?: string; // Link to a specific dish
  likesCount?: number;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn?: string;
  logo: string;
  heroBanner: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  currency: string;
  phone: string;
  email: string;
  branches: Branch[];
  darkThemeEnabled: boolean;
  plan: SubscriptionPlanTier;
  showPoweredByBranding: boolean; // True for Plan 1 & 2; configurable for Plan 3 (Enterprise)
  ownerId?: string;
  posts?: Post[];
  address?: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    whatsapp?: string;
    tiktok?: string;
    snapchat?: string;
  };
  customCss?: string;
  isMaintenanceMode?: boolean;
  maintenanceNote?: string;
  isDevMode?: boolean;
  loyaltyEnabled?: boolean;
  nerdDiceGameEnabled?: boolean;
  loyaltyPointsPerCurrency?: number; // e.g. 1 point for 1 SAR/JOD spent
  loyaltyRedeemRate?: number; // e.g. 10 points = 1 SAR/JOD discount
  defaultDeliveryFee?: number; // e.g. 10 SAR or 3 JOD
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'staff' | 'superadmin' | 'customer';
  isSuperAdmin?: boolean;
  restaurantId: string;
  managedRestaurantIds: string[]; // List of stores/websites owned by this user
  currentPlan: SubscriptionPlanTier;
  isVerified: boolean;
  isBanned?: boolean;
  banReason?: string;
  promoCode?: string;
  referralCount?: number;
  referralEarningsILS?: number;
  usedPromoCode?: string;
}

export interface PromoPayoutRequest {
  id: string;
  userId: string;
  userName: string;
  promoCode: string;
  referralCount: number;
  amountILS: number;
  payoutMethod: 'jawwal_pay' | 'bank_transfer' | 'paypal' | 'cash';
  accountDetails: string;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'ai';
  message: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'order' | 'reservation' | 'review' | 'system' | 'promo';
  linkView?: 'landing' | 'menu' | 'admin' | 'qr';
}

export interface SalesReport {
  date: string;
  branchName: string;
  ordersCount: number;
  revenue: number;
}
