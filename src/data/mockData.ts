import { Restaurant, Category, Dish, Order, Reservation, Review, SalesReport, AppNotification, User, SubscriptionPlan, Post } from '../types';

export const initialPosts: Post[] = [];

export const subscriptionPlansList: SubscriptionPlan[] = [
  {
    id: 'plan_1',
    nameAr: 'الباقة المجانية (Free Trial)',
    nameEn: 'Free Trial',
    priceMonthly: 0,
    priceYearly: 0,
    priceDisplayAr: 'مجاني لمدة 7 أيام',
    priceDisplayEn: 'Free 7-Day Trial',
    canRemoveBranding: false,
    maxStoresAllowed: 1,
    description: 'تجربة كاملة للمنصة مدتها 7 أيام وبعدها يتوقف الموقع تلقائياً لحين الاشتراك',
    features: [
      'تجربة مجانية للموقع بالكامل لمدة 7 أيام',
      'يتوقف الموقع تلقائياً بعد انتهاء المدة',
      'منيو رقمي أساسي تفاعلي',
      'توليد رمز الاستجابة السريع QR'
    ]
  },
  {
    id: 'plan_2',
    nameAr: 'الباقة الأساسية (Basic Plan)',
    nameEn: 'Basic Plan',
    priceMonthly: 65,
    priceYearly: 650,
    priceDisplayAr: '650 ₪ سنوياً',
    priceDisplayEn: '650 ₪ / Year',
    canRemoveBranding: false,
    maxStoresAllowed: 2,
    description: 'الباقة الأساسية للمطاعم والكافيهات الناشئة',
    features: [
      'إمكانية إضافة 100 عنصر و 15 قسم',
      'منيو رقمي كامل متصل بالذكاء الاصطناعي',
      'دعم كامل لرمز الاستجابة السريع QR',
      'احصائيات وتحسين ظهور محركات البحث SEO',
      'مشرف واحد وإدارة الأوقات والتقييمات'
    ]
  },
  {
    id: 'plan_3',
    nameAr: 'باقة التميز (Excellence Plan)',
    nameEn: 'Excellence Plan',
    priceMonthly: 95,
    priceYearly: 950,
    priceDisplayAr: '950 ₪ سنوياً',
    priceDisplayEn: '950 ₪ / Year',
    canRemoveBranding: false,
    maxStoresAllowed: 5,
    description: 'الباقة الأكثر طلباً للمطاعم النشطة والكافيهات مع كامل مميزات المنصة الحية',
    features: [
      'أطباق وفئات وأقسام غير محدودة',
      'نظام الطلبات الحية والدفع الإلكتروني المباشر',
      'نظام حجز الطاولات مع التنبيهات المباشرة',
      'تخصيص التصميم والألوان الكامل والهوية البصرية',
      '3 مشرفين ودعم كامل لجميع المميزات'
    ]
  },
  {
    id: 'plan_4_enterprise',
    nameAr: 'باقة شاملة (Comprehensive Plan)',
    nameEn: 'Comprehensive Plan',
    priceMonthly: 210,
    priceYearly: 2100,
    priceDisplayAr: '2100 ₪ سنوياً (أو 210 ₪ شهرياً)',
    priceDisplayEn: '2100 ₪/yr or 210 ₪/mo',
    canRemoveBranding: true,
    maxStoresAllowed: 10,
    description: 'للمطاعم الكبرى ذات الفروع المتعددة وعلامات الامتياز التجاري لإدارة متكاملة لكل الفروع',
    features: [
      'إدارة حتى 10 فروع منفصلة بالكامل',
      'تتضمن كافة مميزات باقة التميز بالكامل',
      'خرائط تفاعلية دقيقة للفروع وتحديد المواقع',
      'تقارير وتحليلات مبيعات متقدمة ومفصلة لكل فرع',
      'مدير حساب مباشر مخصص ودعم فني متواصل 24/7',
      'إلغاء وإخفاء حقوق العلامة "menuz" بالكامل (White-label)'
    ]
  }
];

export const initialRestaurant: Restaurant = {
  id: 'rest_01',
  slug: 'alqasar',
  name: 'مطعم و كافيه القصر',
  nameEn: 'The Palace Restaurant & Cafe',
  tagline: 'أرقى المأكولات الشرقية والعالمية بأجواء ملكية',
  logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop&crop=faces',
  heroBanner: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=400&fit=crop',
  primaryColor: '#0b4f42', // Deep emerald teal matching menuz screenshot
  secondaryColor: '#ea580c', // Terracotta orange
  fontFamily: 'IBM Plex Sans Arabic',
  currency: '₪',
  phone: '+966 50 123 4567',
  email: 'info@alqasar-restaurant.com',
  darkThemeEnabled: false,
  plan: 'plan_2',
  showPoweredByBranding: true,
  ownerId: 'usr_01',
  posts: initialPosts,
  loyaltyEnabled: true,
  loyaltyPointsPerCurrency: 1,
  loyaltyRedeemRate: 10,
  defaultDeliveryFee: 15,
  socialLinks: {
    instagram: 'https://instagram.com/menuz_app',
    twitter: 'https://twitter.com/menuz_app',
    whatsapp: 'https://wa.me/966501234567',
  },
  branches: [
    {
      id: 'br_1',
      name: 'فرع الرياض - حي العليا',
      nameEn: 'Riyadh Branch - Olaya',
      address: 'طريق الملك فهد، حي العليا، الرياض',
      phone: '+966 11 456 7890',
      city: 'الرياض',
      lat: 24.7136,
      lng: 46.6753,
      openingHours: '12:00 م - 01:00 ص',
      tablesCount: 24,
      active: true,
    },
    {
      id: 'br_2',
      name: 'فرع جدة - الكورنيش الشمالي',
      nameEn: 'Jeddah Branch - North Corniche',
      address: 'طريق الكورنيش، الشاطئ، جدة',
      phone: '+966 12 678 9012',
      city: 'جدة',
      lat: 21.5433,
      lng: 39.1728,
      openingHours: '01:00 م - 02:00 ص',
      tablesCount: 18,
      active: true,
    },
    {
      id: 'br_3',
      name: 'فرع الدمام - طريق الشاطئ',
      nameEn: 'Dammam Branch - Beach Road',
      address: 'طريق الخليج، حي الشاطئ، الدمام',
      phone: '+966 13 890 1234',
      city: 'الدمام',
      lat: 26.4207,
      lng: 50.0888,
      openingHours: '12:30 م - 12:30 ص',
      tablesCount: 15,
      active: true,
    }
  ]
};

export const initialCategories: Category[] = [
  { id: 'cat_hot', name: 'مشروبات ساخنة', nameEn: 'Hot Beverages', icon: 'Coffee', order: 1, active: true },
  { id: 'cat_cold', name: 'مشروبات باردة وعصائر', nameEn: 'Cold Drinks & Juices', icon: 'Coffee', order: 2, active: true },
  { id: 'cat_appetizers', name: 'المقبلات والسلطات', nameEn: 'Appetizers & Salads', icon: 'Soup', order: 3, active: true },
  { id: 'cat_mains', name: 'الأطباق الرئيسية والمشويات', nameEn: 'Main Courses & Grills', icon: 'UtensilsCrossed', order: 4, active: true },
  { id: 'cat_desserts', name: 'الحلويات الملكية', nameEn: 'Royal Desserts', icon: 'Cake', order: 5, active: true },
  { id: 'cat_delivery', name: 'قسم الدليفري والعروض', nameEn: 'Delivery Packages', icon: 'PackageCheck', order: 6, active: true },
];

export const initialDishes: Dish[] = [
  // Hot Beverages
  {
    id: 'dish_hot_1',
    categoryId: 'cat_hot',
    name: 'إسبريسو سينجل / دبل',
    nameEn: 'Single / Double Espresso',
    description: 'قهوة إسبريسو غنية ومستخلصة بعناية من أجود حبوب البن الكولومبي.',
    descriptionEn: 'Rich extracted espresso from premium Colombian coffee beans.',
    price: 15,
    calories: 10,
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500&fit=crop',
    isAvailable: true,
    preparationTimeMinutes: 5,
  },
  {
    id: 'dish_hot_2',
    categoryId: 'cat_hot',
    name: 'كابتشينو برغوة الحليب الدافئة',
    nameEn: 'Classic Cappuccino',
    description: 'جرعة إسبريسو مزدوجة مع حليب مبخر ورغوة حليب مخملية ولمسة قرفة.',
    descriptionEn: 'Double espresso shot with steamed milk and velvety foam.',
    price: 22,
    calories: 140,
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=500&fit=crop',
    isBestSeller: true,
    isAvailable: true,
    preparationTimeMinutes: 5,
  },
  {
    id: 'dish_hot_3',
    categoryId: 'cat_hot',
    name: 'شاي القصر بالنعناع والهيل',
    nameEn: 'Royal Palace Tea',
    description: 'شاي إبريق فاخر مع أوراق النعناع الطازجة وحبات الهيل الزكية.',
    descriptionEn: 'Premium brewed tea pot with fresh mint leaves and cardamom.',
    price: 18,
    calories: 25,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&fit=crop',
    isAvailable: true,
    preparationTimeMinutes: 5,
  },

  // Cold Drinks
  {
    id: 'dish_cold_1',
    categoryId: 'cat_cold',
    name: 'موهيتو الرمان والنعناع البارد',
    nameEn: 'Fresh Pomegranate Mojito',
    description: 'منعش الرمان مع الليمون الطازج، أوراق النعناع، والثلج المجروش.',
    descriptionEn: 'Refreshing pomegranate with fresh lime, mint leaves, and crushed ice.',
    price: 28,
    calories: 160,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&fit=crop',
    isBestSeller: true,
    isAvailable: true,
    preparationTimeMinutes: 5,
  },
  {
    id: 'dish_cold_2',
    categoryId: 'cat_cold',
    name: 'عصير برتقال طبيعي طازج 100%',
    nameEn: '100% Fresh Orange Juice',
    description: 'معصور طازجاً عند الطلب بدون إضافة سكر أو مواد حافظة.',
    descriptionEn: 'Freshly squeezed to order with no added sugar.',
    price: 24,
    calories: 110,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&fit=crop',
    isAvailable: true,
    preparationTimeMinutes: 5,
  },
  {
    id: 'dish_cold_3',
    categoryId: 'cat_cold',
    name: 'سبانيش لاتيه بارد بالمكسرات',
    nameEn: 'Iced Spanish Latte',
    description: 'قهوة باردة منعشة مع الحليب المكثف المحلى ونكهة الفانيليا الفاخرة.',
    descriptionEn: 'Cold espresso with condensed milk and premium vanilla notes.',
    price: 29,
    calories: 210,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&fit=crop',
    isBestSeller: true,
    isAvailable: true,
    preparationTimeMinutes: 5,
  },

  // Appetizers
  {
    id: 'dish_1',
    categoryId: 'cat_appetizers',
    name: 'شوربة الكريمة بالفطر البري',
    nameEn: 'Wild Mushroom Cream Soup',
    description: 'شوربة طازجة مجهزة من أجود أنواع الفطر البري مع الكريمة الغنية ولسمة زيت الترفل.',
    descriptionEn: 'Fresh rich cream soup made with wild mushrooms and finished with truffle oil.',
    price: 38,
    calories: 280,
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=500&fit=crop',
    isVegetarian: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 12,
  },
  {
    id: 'dish_2',
    categoryId: 'cat_appetizers',
    name: 'مقبلات القصر المشكلة',
    nameEn: 'Palace Mixed Mezza',
    description: 'تشكيلة راقية تضم الحمص، المتبل، المحمرة، وورق العنب الطازج مع الخبز المحمص.',
    descriptionEn: 'Selection of fresh hummus, mutabbal, muhammara, and stuffed grape leaves.',
    price: 52,
    calories: 410,
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=500&fit=crop',
    isVegetarian: true,
    isBestSeller: true,
    isAvailable: true,
    preparationTimeMinutes: 10,
  },

  // Mains
  {
    id: 'dish_3',
    categoryId: 'cat_mains',
    name: 'كبسة اللحم النعيمي مع الأرز البسمتي',
    nameEn: 'Royal Naimi Lamb Kabsa',
    description: 'موزات لحم نعيمي طازجة مطهوة على نار هادئة مع بهارات الكبسة الخاطفة وأرز بسمتي بالفستق.',
    descriptionEn: 'Tender fresh Naimi lamb cooked slow with aromatic spices and saffron basmati rice.',
    price: 98,
    calories: 890,
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=500&fit=crop',
    isBestSeller: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 25,
  },
  {
    id: 'dish_4',
    categoryId: 'cat_mains',
    name: 'مشويات القصر الشرقية المشكلة',
    nameEn: 'Palace Mixed Grills',
    description: 'أسياخ كباب، أوصال لحم، وطاووق مشوية على الفحم مع الخبز المحمّر والسلطة.',
    descriptionEn: 'Selection of charcoal grilled meat kebabs, lamb cubes, and shish taouk.',
    price: 110,
    calories: 750,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&fit=crop',
    isBestSeller: true,
    isAvailable: true,
    preparationTimeMinutes: 20,
  },

  // Desserts
  {
    id: 'dish_dessert_1',
    categoryId: 'cat_desserts',
    name: 'كنافة القصر الملكية بالقشطة والنابلسية',
    nameEn: 'Royal Nabulsi Kunafa',
    description: 'كنافة ساخنة ذهبية محشوة بالقشطة البلدية والجبن النابلسي مع الفستق والقطر.',
    descriptionEn: 'Golden hot kunafa stuffed with cream and Nabulsi cheese topped with pistachios.',
    price: 35,
    calories: 450,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&fit=crop',
    isBestSeller: true,
    isAvailable: true,
    preparationTimeMinutes: 10,
  },

  // Delivery Specials
  {
    id: 'dish_deliv_1',
    categoryId: 'cat_delivery',
    name: 'وجبة العائلة السريعة ديلفري (توصيل مجاني)',
    nameEn: 'Express Family Delivery Meal',
    description: 'كيلو مشويات مشكلة + 2 طبق أرز + حمص ومقبلات + 2 لتر عصير طبيعي طازج.',
    descriptionEn: '1KG Mixed Grills + 2 Rice Dishes + Appetizers + 2L Fresh Juice with Free Delivery.',
    price: 210,
    calories: 2200,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&fit=crop',
    isBestSeller: true,
    isChefSpecial: true,
    isAvailable: true,
    preparationTimeMinutes: 30,
  },
  {
    id: 'dish_deliv_2',
    categoryId: 'cat_delivery',
    name: 'كومبو الأصدقاء ديلفري السريع',
    nameEn: 'Friends Combo Delivery Package',
    description: '3 برجر أنجوس فاخر + بطاطس حجم عائلي + 3 موهيتو بارد طازج.',
    descriptionEn: '3 Angus Burgers + Large Fries + 3 Fresh Cold Mojitos.',
    price: 140,
    calories: 1650,
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&fit=crop',
    isBestSeller: true,
    isAvailable: true,
    preparationTimeMinutes: 20,
  },
  {
    id: 'dish_5',
    categoryId: 'cat_mains',
    name: 'مشاوي القصر الفاخرة (1 كجم)',
    nameEn: 'Palace Mixed Grill Platter (1kg)',
    description: 'مشكل كباب لحم، كباب دجاج، أوصال لحم بلدي، وتوك طاووق مع الخضار المشوية والصوصات.',
    descriptionEn: 'Assorted lamb kabab, chicken kabab, beef skewers, and shish tawook with grilled veggies.',
    price: 180,
    calories: 1250,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&fit=crop',
    isSpicy: true,
    isBestSeller: true,
    isAvailable: true,
    preparationTimeMinutes: 22,
  },
  {
    id: 'dish_6',
    categoryId: 'cat_appetizers',
    name: 'سلطة سيزر الدجاج المشوي',
    nameEn: 'Grilled Chicken Caesar Salad',
    description: 'خس روماني طازج مع شرائح الدجاج المشوي، جبن البارميزان العتيق، وخبز السيزر المقرمش.',
    descriptionEn: 'Fresh romaine lettuce topped with grilled chicken, aged parmesan, and crispy croutons.',
    price: 44,
    calories: 340,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&fit=crop',
    isGlutenFree: false,
    isAvailable: true,
    preparationTimeMinutes: 10,
  },
  {
    id: 'dish_7',
    categoryId: 'cat_desserts',
    name: 'كنافة القصر الناعمة بالقشطة',
    nameEn: 'Palace Creamy Kunafa with Pistachios',
    description: 'كنافة ذهبية ناعمة محشوة بالقشطة الطازجة ومرشوشة بالفستق الحلبي وقطر الزهر.',
    descriptionEn: 'Golden smooth kunafa filled with fresh cream and garnished with crushed pistachios.',
    price: 36,
    calories: 520,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&fit=crop',
    isVegetarian: true,
    isBestSeller: true,
    isAvailable: true,
    preparationTimeMinutes: 12,
  },
  {
    id: 'dish_8',
    categoryId: 'cat_cold',
    name: 'عصير موهيتو التوت والنعناع',
    nameEn: 'Berry & Mint Refreshing Mojito',
    description: 'مزيج منعش من التوت المشكل، النعناع الطازج، الليمون والماء الفوار والمثلج.',
    descriptionEn: 'Cool blend of wild berries, fresh mint leaves, lime juice and sparkling soda.',
    price: 26,
    calories: 160,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&fit=crop',
    isVegetarian: true,
    isAvailable: true,
    preparationTimeMinutes: 5,
  }
];

import { generateRandomPromoCode } from '../lib/promo';

export const initialOrders: Order[] = [];

export const initialReservations: Reservation[] = [];

export const initialReviews: Review[] = [];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'جاهزية منصة menuz للإطلاق الرسمي 🚀',
    message: 'تم صفر البيانات التوضيحية وتأكيد إعدادات النظام للتشغيل الفعلي.',
    timestamp: 'الآن',
    read: false,
    type: 'system'
  }
];

export const initialSalesReports: SalesReport[] = [];

export const initialUserStores: Restaurant[] = [
  initialRestaurant,
  {
    id: 'rest_02',
    slug: 'ward-and-sham',
    name: 'كافيه ورد وشام المختص',
    nameEn: 'Ward & Sham Specialty Cafe',
    tagline: 'أجود أنواع القهوة المختصة والحلويات الدمشقية الفاخرة',
    taglineEn: 'Specialty Coffee & Fine Levantine Pastries',
    logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&h=150&fit=crop',
    heroBanner: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&fit=crop',
    primaryColor: '#8b5cf6',
    secondaryColor: '#ec4899',
    fontFamily: 'Tajawal',
    currency: 'JOD',
    phone: '+962 6 500 1122',
    email: 'info@ward-sham.com',
    darkThemeEnabled: false,
    plan: 'plan_3',
    showPoweredByBranding: true,
    loyaltyEnabled: true,
    loyaltyPointsPerCurrency: 1,
    loyaltyRedeemRate: 10,
    defaultDeliveryFee: 3,
    socialLinks: {
      instagram: 'https://instagram.com/ward_sham_cafe',
      whatsapp: 'https://wa.me/96265001122'
    },
    branches: [
      {
        id: 'br_ws_1',
        name: 'فرع اللويبدة',
        nameEn: 'Lweibdeh Branch',
        address: 'شارع الشريعة، اللويبدة، عمّان',
        phone: '+962 6 500 1122',
        city: 'عمّان',
        lat: 31.956,
        lng: 35.923,
        openingHours: '08:00 ص - 12:00 ص',
        tablesCount: 16,
        active: true,
      }
    ]
  },
  {
    id: 'rest_03',
    slug: 'gulbahar',
    name: 'مطعم جلبهار الشرق',
    nameEn: 'Gulbahar Orient Restaurant',
    tagline: 'المشويات العثمانية والكبب الحلبية الملكية',
    taglineEn: 'Ottoman Grills & Aleppian Kibbeh',
    logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=150&h=150&fit=crop',
    heroBanner: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&fit=crop',
    primaryColor: '#ea580c',
    secondaryColor: '#f97316',
    fontFamily: 'Tajawal',
    currency: 'SAR',
    phone: '+966 11 456 7890',
    email: 'contact@gulbahar.sa',
    darkThemeEnabled: false,
    plan: 'plan_3',
    showPoweredByBranding: false,
    loyaltyEnabled: true,
    loyaltyPointsPerCurrency: 1,
    loyaltyRedeemRate: 10,
    defaultDeliveryFee: 15,
    socialLinks: {
      instagram: 'https://instagram.com/gulbahar_sa',
      whatsapp: 'https://wa.me/966114567890'
    },
    branches: [
      {
        id: 'br_gb_1',
        name: 'فرع العليا الرئيسي',
        nameEn: 'Olaya Main Branch',
        address: 'طريق الملك فهد، العليا، الرياض',
        phone: '+966 11 456 7890',
        city: 'الرياض',
        lat: 24.7136,
        lng: 46.6753,
        openingHours: '12:00 م - 01:30 ص',
        tablesCount: 25,
        active: true,
      }
    ]
  }
];

export const initialUser: User = {
  id: 'usr_superadmin',
  name: 'المسؤول الرئيسي (Super Admin ⚡)',
  email: 'admin@menuz.app',
  phone: '0590000000',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop',
  role: 'superadmin',
  isSuperAdmin: true,
  restaurantId: 'rest_01',
  managedRestaurantIds: ['rest_01'],
  currentPlan: 'plan_3_enterprise',
  isVerified: true,
  promoCode: generateRandomPromoCode('ADMIN'),
  referralCount: 0,
  referralEarningsILS: 0
};

export const initialCoupons = [
  {
    id: 'coup_1',
    code: 'MENUZ20',
    type: 'percentage' as const,
    value: 20,
    minOrderAmount: 50,
    maxDiscountAmount: 40,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    timesUsed: 142,
    active: true,
    createdAt: '2026-01-15',
  },
  {
    id: 'coup_2',
    code: 'WELCOME15',
    type: 'fixed' as const,
    value: 15,
    minOrderAmount: 40,
    expiryDate: '2026-11-30',
    usageLimit: 200,
    timesUsed: 89,
    active: true,
    createdAt: '2026-02-01',
  },
  {
    id: 'coup_3',
    code: 'DELIVERYFREE',
    type: 'fixed' as const,
    value: 15,
    minOrderAmount: 60,
    expiryDate: '2026-10-15',
    usageLimit: 300,
    timesUsed: 210,
    active: true,
    createdAt: '2026-03-10',
  }
];

export const initialDrivers = [
  {
    id: 'drv_1',
    name: 'الكابتن أحمد محمود',
    phone: '0599123456',
    vehicle: 'motorcycle' as const,
    status: 'available' as const,
    activeOrdersCount: 1,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
    rating: 4.9,
  },
  {
    id: 'drv_2',
    name: 'الكابتن طارق خليل',
    phone: '0598765432',
    vehicle: 'car' as const,
    status: 'busy' as const,
    activeOrdersCount: 2,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop',
    rating: 4.8,
  },
  {
    id: 'drv_3',
    name: 'الكابتن سامر العلي',
    phone: '0597112233',
    vehicle: 'motorcycle' as const,
    status: 'available' as const,
    activeOrdersCount: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
    rating: 5.0,
  }
];

export const clientLogos = [
  { name: 'مطعم وقصر الماصيون', region: 'فلسطين - رام الله', country: 'فلسطين', flag: '🇵🇸', logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop' },
  { name: 'مطعم القصر الملكي', region: 'فلسطين - القدس', country: 'فلسطين', flag: '🇵🇸', logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&h=200&fit=crop' },
  { name: 'كافيه حكاية نابلس', region: 'فلسطين - نابلس', country: 'فلسطين', flag: '🇵🇸', logo: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=200&h=200&fit=crop' },
  { name: 'كافيه ورد وشام', region: 'الأردن - عمّان', country: 'الأردن', flag: '🇯🇴', logo: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop' },
  { name: 'مطعم جلبهار الفاخر', region: 'السعودية - الرياض', country: 'السعودية', flag: '🇸🇦', logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=200&h=200&fit=crop' },
  { name: 'سلسلة مطاعم تهامة', region: 'السعودية - جدة', country: 'السعودية', flag: '🇸🇦', logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&h=200&fit=crop' },
  { name: 'مطعم السفير الشرقي', region: 'فلسطين - الخليل', country: 'فلسطين', flag: '🇵🇸', logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&h=200&fit=crop' },
  { name: 'لاونج دجلة والفرات', region: 'العراق - بغداد', country: 'العراق', flag: '🇮🇶', logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=200&h=200&fit=crop' },
  { name: 'مقهى البوم التاريخي', region: 'الكويت - الكويت', country: 'الكويت', flag: '🇰🇼', logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&h=200&fit=crop' },
  { name: 'مطعم العصر الذهبي', region: 'الإمارات - دبي', country: 'الإمارات', flag: '🇦🇪', logo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&h=200&fit=crop' },
  { name: 'منتجع ونادي النخيل', region: 'عمان - مسقط', country: 'عمان', flag: '🇴🇲', logo: 'https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?w=200&h=200&fit=crop' },
  { name: 'مطعم البوسفور الملكي', region: 'تركيا - إسطنبول', country: 'تركيا', flag: '🇹🇷', logo: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=200&h=200&fit=crop' },
  { name: 'مطعم غزة هاشم الفاخر', region: 'فلسطين - غزة', country: 'فلسطين', flag: '🇵🇸', logo: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=200&h=200&fit=crop' },
  { name: 'كافيه الفولكلور العربي', region: 'قطر - الدوحة', country: 'قطر', flag: '🇶🇦', logo: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=200&h=200&fit=crop' }
];
