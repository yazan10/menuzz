import React, { useState } from 'react';
import { 
  BarChart3, 
  UtensilsCrossed, 
  Clock, 
  Calendar, 
  Palette, 
  MapPin, 
  CreditCard, 
  Star, 
  Plus, 
  Edit, 
  Download, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles,
  Megaphone,
  Upload,
  Trash2,
  Image,
  Tag,
  Flame,
  Check,
  Eye,
  RefreshCw,
  X,
  Sliders,
  Share2,
  PlusCircle,
  HelpCircle,
  Bell,
  Volume2,
  ShieldCheck,
  Users,
  Building2,
  Crown,
  Key,
  Lock,
  Unlock,
  Globe,
  Activity,
  Zap,
  Search,
  Filter,
  AlertTriangle,
  Send,
  Radio,
  FileText,
  UserCheck,
  Server,
  Gift,
  ShieldAlert,
  Wrench,
  Printer,
  ChevronRight,
  ChevronLeft,
  Bike,
  Ticket,
  Camera
} from 'lucide-react';
import { AnalyticsRecharts } from './AnalyticsRecharts';
import { CouponsManager } from './CouponsManager';
import { DeliveryManager } from './DeliveryManager';
import { SocialStoriesGenerator } from './SocialStoriesGenerator';
import { PromoAffiliateSection } from '../PromoAffiliateSection';
import { UnifiedFileUpload } from '../UnifiedFileUpload';
import { requestNotificationPermission, triggerBrowserNotification, stopOrderAlertSound } from '../../lib/notifications';
import { testTelegramBotPing, getTelegramBotStatus, linkRestaurantTelegram } from '../../lib/telegram';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  Restaurant, 
  Category, 
  Dish, 
  Order, 
  Reservation, 
  Review, 
  SalesReport, 
  OrderStatus, 
  Language,
  Post,
  User,
  Coupon,
  DeliveryDriver
} from '../../types';
import { getTranslation } from '../../lib/translations';
import { formatPrice } from '../../lib/currencies';

// Reusable Image File Upload Dropzone Component
interface FileImageUploaderProps {
  currentImage?: string;
  onImageChange: (base64Url: string) => void;
  label?: string;
}

const FileImageUploader: React.FC<FileImageUploaderProps> = ({ currentImage, onImageChange, label = 'صورة' }) => {
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlText, setUrlText] = useState(currentImage || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2 text-right">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {label} (رفع ملف صورة من جهازك 📁)
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[10px] text-orange-600 dark:text-orange-400 font-extrabold hover:underline"
        >
          {showUrlInput ? 'الاعتماد على رفع الملفات' : 'أو إدخال رابط URL 🔗'}
        </button>
      </div>

      {showUrlInput ? (
        <input
          type="text"
          placeholder="https://images.unsplash.com/..."
          value={urlText}
          onChange={(e) => {
            setUrlText(e.target.value);
            onImageChange(e.target.value);
          }}
          className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
        />
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-slate-300 dark:border-slate-700 hover:border-orange-400 bg-slate-50 dark:bg-slate-800/50'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
          />

          {currentImage ? (
            <div className="flex items-center gap-4 text-right">
              <img
                src={currentImage}
                alt="Uploaded preview"
                className="w-20 h-20 object-cover rounded-xl shadow-md border border-slate-200 dark:border-slate-700 shrink-0"
              />
              <div className="space-y-1">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> تم رفع الصورة بنجاح
                </span>
                <p className="text-[10px] text-slate-500">انقر أو اسحب صورة جديدة لاستبدالها</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onImageChange(''); }}
                  className="text-[10px] text-rose-500 font-bold hover:underline"
                >
                  حذف الصورة الحالية
                </button>
              </div>
            </div>
          ) : (
            <div className="py-2 flex flex-col items-center justify-center gap-2">
              <UnifiedFileUpload
                onFileSelect={(base64) => onImageChange(base64)}
                label=""
              />
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  انقر الأيقونة النيون أو اسحب ملف الصورة من جهازك
                </p>
                <p className="text-[10px] text-slate-400">
                  يدعم صيغ الصور الممتازة (PNG, JPG, WEBP, GIF)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface AdminDashboardProps {
  restaurant: Restaurant;
  onUpdateRestaurant: (updated: Restaurant) => void;
  categories: Category[];
  onUpdateCategories: (updated: Category[]) => void;
  dishes: Dish[];
  onUpdateDishes: (updated: Dish[]) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  reservations: Reservation[];
  onUpdateReservationStatus: (resId: string, newStatus: 'confirmed' | 'cancelled') => void;
  reviews: Review[];
  salesReports: SalesReport[];
  currentLang: Language;
  currentCurrency?: string;
  currentUser?: User | null;
  userStores?: Restaurant[];
  onSelectRestaurant?: (selected: Restaurant) => void;
  isMaintenanceMode?: boolean;
  onToggleMaintenanceMode?: () => void;
  maintenanceNote?: string;
  onUpdateMaintenanceNote?: (note: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  restaurant,
  onUpdateRestaurant,
  categories,
  onUpdateCategories,
  dishes,
  onUpdateDishes,
  orders,
  onUpdateOrderStatus,
  reservations,
  onUpdateReservationStatus,
  reviews,
  salesReports,
  currentLang,
  currentCurrency = 'ILS',
  currentUser,
  userStores = [],
  onSelectRestaurant,
  isMaintenanceMode = false,
  onToggleMaintenanceMode,
  maintenanceNote = 'نقوم حالياً بإجراء تحديثات دورية وتحسينات للسرعة لضمان أفضل خدمة للمطاعم والزبائن.',
  onUpdateMaintenanceNote,
}) => {
  const isSuperAdmin = currentUser?.email?.toLowerCase().trim() === 'yazansalaq@gmail.com' || currentUser?.role === 'superadmin' || currentUser?.isSuperAdmin === true;

  const [activeTab, setActiveTab] = useState<'superadmin' | 'overview' | 'analytics' | 'affiliate' | 'menu' | 'posts' | 'kitchen' | 'reservations' | 'reports' | 'theme' | 'branches' | 'payments' | 'telegram' | 'coupons' | 'delivery' | 'stories'>(
    isSuperAdmin ? 'superadmin' : 'overview'
  );

  // Coupons State
  const [couponsList, setCouponsList] = useState<Coupon[]>([
    {
      id: 'coup_1',
      code: 'PALACE2026',
      type: 'percentage',
      value: 20,
      minOrderAmount: 100,
      maxDiscountAmount: 50,
      timesUsed: 14,
      active: true,
      createdAt: '2026-08-01'
    },
    {
      id: 'coup_2',
      code: 'FREEDELIVERY',
      type: 'fixed',
      value: 15,
      minOrderAmount: 50,
      timesUsed: 28,
      active: true,
      createdAt: '2026-08-02'
    }
  ]);

  // Delivery Drivers State
  const [deliveryDrivers, setDeliveryDrivers] = useState<DeliveryDriver[]>([
    {
      id: 'drv_1',
      name: 'الكابتن أحمد محمود',
      phone: '0599123456',
      vehicle: 'motorcycle',
      status: 'available',
      activeOrdersCount: 1,
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop'
    },
    {
      id: 'drv_2',
      name: 'الكابتن طارق خليل',
      phone: '0599887766',
      vehicle: 'car',
      status: 'busy',
      activeOrdersCount: 2,
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&h=120&fit=crop'
    }
  ]);

  // Telegram Integration State
  const [telegramChatInput, setTelegramChatInput] = useState<string>('6368977651');
  const [telegramTestSuccess, setTelegramTestSuccess] = useState<string | null>(null);
  const [telegramLoading, setTelegramLoading] = useState<boolean>(false);

  // Banned Stores / Accounts State
  const [bannedStoreIds, setBannedStoreIds] = useState<string[]>([]);
  const [banReasonModalStore, setBanReasonModalStore] = useState<Restaurant | null>(null);
  const [banInputReason, setBanInputReason] = useState<string>('مخالفة شروط الاستخدام والاستخدام غير المصرح به.');

  // Super Admin Local Management State
  const [platformStores, setPlatformStores] = useState<Restaurant[]>(userStores.length > 0 ? userStores : [restaurant]);
  const [storeSearchQuery, setStoreSearchQuery] = useState<string>('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('all');
  const [broadcastMessage, setBroadcastMessage] = useState<string>('مرحباً بكافة أصحاب المطاعم! تم إطلاق التحديث الجديد لمنصة menuz بسرعة أعلى وأداء محسّن 🚀');
  const [broadcastSuccess, setBroadcastSuccess] = useState<boolean>(false);
  const [newPromoCode, setNewPromoCode] = useState<string>('');
  const [newPromoDiscount, setNewPromoDiscount] = useState<number>(20);
  const [promoCodesList, setPromoCodesList] = useState<Array<{ code: string; discount: number; active: boolean }>>([
    { code: 'YAZAN2026', discount: 100, active: true },
    { code: 'MENUZ50', discount: 50, active: true },
    { code: 'WELCOME20', discount: 20, active: true }
  ]);
  const [superAdminAlert, setSuperAdminAlert] = useState<string | null>(null);

  // Admin Tabs Horizontal Scroll & Slider State
  const adminTabsScrollRef = React.useRef<HTMLDivElement>(null);
  const [adminTabsScrollProgress, setAdminTabsScrollProgress] = useState<number>(0);

  const handleAdminTabsScroll = () => {
    if (adminTabsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = adminTabsScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        const currentScroll = Math.abs(scrollLeft);
        const progress = Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100));
        setAdminTabsScrollProgress(progress);
      }
    }
  };

  const handleAdminTabsSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setAdminTabsScrollProgress(val);
    if (adminTabsScrollRef.current) {
      const { scrollWidth, clientWidth } = adminTabsScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const isRTL = document.documentElement.dir === 'rtl' || true;
      const targetScroll = (val / 100) * maxScroll;
      adminTabsScrollRef.current.scrollLeft = isRTL ? -targetScroll : targetScroll;
    }
  };

  const scrollAdminTabs = (direction: 'left' | 'right') => {
    if (adminTabsScrollRef.current) {
      const scrollAmount = 280;
      adminTabsScrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Modal Editing Dish State
  const [dishModalOpen, setDishModalOpen] = useState<boolean>(false);
  const [editingDish, setEditingDish] = useState<Partial<Dish>>({});

  // Modal Editing Post State
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Partial<Post>>({});

  // Kitchen Checklist State for Checked Off Items/Dishes
  const [completedKitchenItems, setCompletedKitchenItems] = useState<Record<string, boolean>>({});

  // Theme Config State
  const [themeTagline, setThemeTagline] = useState<string>(restaurant.tagline);
  const [themePrimary, setThemePrimary] = useState<string>(restaurant.primaryColor || '#0b4f42');
  const [themeSecondary, setThemeSecondary] = useState<string>(restaurant.secondaryColor || '#ea580c');
  const [themeFontFamily, setThemeFontFamily] = useState<string>(restaurant.fontFamily || 'IBM Plex Sans Arabic');
  const [themeLogo, setThemeLogo] = useState<string>(restaurant.logo || '');
  const [themeBanner, setThemeBanner] = useState<string>(restaurant.heroBanner || '');
  const [nerdDiceGameEnabled, setNerdDiceGameEnabled] = useState<boolean>(restaurant.nerdDiceGameEnabled !== false);
  const [themeSavedAlert, setThemeSavedAlert] = useState<boolean>(false);

  const postsList: Post[] = restaurant.posts || [];

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLang, key);

  // Preset Theme Palettes for Restaurant Brand Identity
  const BRAND_COLOR_PRESETS = [
    { name: 'الزمرد الملكي', color: '#0b4f42', desc: 'أخضر زمردي فاخر للمطاعم الشرقية والراقية' },
    { name: 'البرتقالي العصري', color: '#ea580c', desc: 'برتقالي حيوي مشهي للمطاعم السريعة والمقاهي' },
    { name: 'الأزرق الملكي', color: '#1d4ed8', desc: 'أزرق فاخر وموثوق للمأكولات البحرية والمطاعم المودرن' },
    { name: 'العنابي الملكي', color: '#991b1b', desc: 'أحمر داكن كلاسيكي للمشاوي والمطاعم الإيطالية' },
    { name: 'البنفسجي الإمبريالي', color: '#6b21a8', desc: 'بنفسجي ملكي للمقاهي والحلويات الراقية' },
    { name: 'الذهبي الملوكي', color: '#b45309', desc: 'ذهبي دافئ للمطاعم العائلية والوجبات العربية' },
    { name: 'الوردي الزاهي', color: '#be185d', desc: 'وردي أنيق للحلويات والآيس كريم والعصائر' },
    { name: 'الأخضر النعناعي', color: '#047857', desc: 'أخضر طازج للمأكولات الصحية والوجبات النباتية' },
    { name: 'الفحمي الأنيق', color: '#1e293b', desc: 'أسود فحمي فاخر للستيك هاوس والمطاعم العصرية' },
  ];

  // Browser Notifications State for Owners
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied'
  );
  const [testNotifSuccess, setTestNotifSuccess] = useState<boolean>(false);

  const handleEnableNotifications = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    if (perm === 'granted') {
      triggerBrowserNotification('تم تفعيل إشعارات المتصفح بنجاح! 🔔', {
        body: 'ستصلك تنبيهات فورية بالصوت والصورة عند وصول أي طلب جديد أو حجز طاولة.'
      });
    }
  };

  const handleTestNotification = () => {
    triggerBrowserNotification('تجربة إشعار مطعم جديد 🛎️', {
      body: 'طلب جديد #ORD-9999 • طاولة 03 • إجمالي: 150 ₪ (Apple Pay)',
      isOrder: true,
    });
    setTestNotifSuccess(true);
    setTimeout(() => setTestNotifSuccess(false), 3000);
  };

  // Calculations
  const totalRevenue = salesReports.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalOrdersCount = orders.length;
  const pendingResCount = reservations.filter(r => r.status === 'pending').length;
  const activeDishesCount = dishes.filter(d => d.isAvailable).length;

  // Handlers
  const handleSaveTheme = () => {
    onUpdateRestaurant({
      ...restaurant,
      tagline: themeTagline,
      primaryColor: themePrimary,
      secondaryColor: themeSecondary,
      fontFamily: themeFontFamily,
      logo: themeLogo || restaurant.logo,
      heroBanner: themeBanner || restaurant.heroBanner,
      nerdDiceGameEnabled: nerdDiceGameEnabled
    });
    setThemeSavedAlert(true);
    setTimeout(() => setThemeSavedAlert(false), 2500);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish.name || !editingDish.price) return;

    if (editingDish.id) {
      // Update existing
      onUpdateDishes(dishes.map(d => d.id === editingDish.id ? { ...d, ...editingDish } as Dish : d));
    } else {
      // Add new
      const newDish: Dish = {
        id: `dish_${Date.now()}`,
        name: editingDish.name,
        nameEn: editingDish.nameEn || editingDish.name,
        description: editingDish.description || '',
        descriptionEn: editingDish.descriptionEn || editingDish.description || '',
        price: Number(editingDish.price),
        categoryId: editingDish.categoryId || categories[0]?.id || 'cat_1',
        image: editingDish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop',
        isAvailable: editingDish.isAvailable ?? true,
        preparationTimeMinutes: editingDish.preparationTimeMinutes || 15,
        isSpicy: editingDish.isSpicy,
        isVegetarian: editingDish.isVegetarian,
        isGlutenFree: editingDish.isGlutenFree,
        isBestSeller: editingDish.isBestSeller,
        isChefSpecial: editingDish.isChefSpecial
      };
      onUpdateDishes([newDish, ...dishes]);
    }

    setDishModalOpen(false);
  };

  const handleToggleAvailability = (dishId: string) => {
    const updated = dishes.map(d => d.id === dishId ? { ...d, isAvailable: !d.isAvailable } : d);
    onUpdateDishes(updated);
  };

  const handleDeleteDish = (dishId: string) => {
    onUpdateDishes(dishes.filter(d => d.id !== dishId));
  };

  // POSTS MANAGEMENT HANDLERS
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost.title) return;

    let updatedPosts: Post[] = [];
    if (editingPost.id) {
      updatedPosts = postsList.map(p => p.id === editingPost.id ? { ...p, ...editingPost } as Post : p);
    } else {
      const newPost: Post = {
        id: `post_${Date.now()}`,
        title: editingPost.title,
        titleEn: editingPost.titleEn,
        content: editingPost.content || '',
        contentEn: editingPost.contentEn,
        image: editingPost.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&fit=crop',
        badge: editingPost.badge || 'عرض جديد 🔥',
        discountCode: editingPost.discountCode,
        active: editingPost.active ?? true,
        likesCount: editingPost.likesCount || 0
      };
      updatedPosts = [newPost, ...postsList];
    }

    onUpdateRestaurant({
      ...restaurant,
      posts: updatedPosts
    });

    setPostModalOpen(false);
  };

  const handleTogglePostActive = (postId: string) => {
    const updatedPosts = postsList.map(p => p.id === postId ? { ...p, active: !p.active } : p);
    onUpdateRestaurant({
      ...restaurant,
      posts: updatedPosts
    });
  };

  const handleDeletePost = (postId: string) => {
    const updatedPosts = postsList.filter(p => p.id !== postId);
    onUpdateRestaurant({
      ...restaurant,
      posts: updatedPosts
    });
  };

  // Thermal Invoice & Kitchen Ticket Printing
  const handlePrintTicket = (order: Order) => {
    const printWindow = window.open('', '_blank', 'width=380,height=600');
    if (!printWindow) return;

    const orderItemsHtml = order.items.map(it => `
      <tr>
        <td style="padding: 5px 0; text-align: right;">${it.dishName}</td>
        <td style="text-align: center; padding: 5px 0;">${it.quantity}</td>
        <td style="text-align: left; padding: 5px 0;">${(it.unitPrice * it.quantity).toFixed(2)} ${currentCurrency}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8">
        <title>تذكرة مطبخ - ${order.orderNumber}</title>
        <style>
          body { font-family: 'Courier New', Courier, monospace, sans-serif; width: 280px; margin: 0 auto; padding: 10px; text-align: right; color: #000; font-size: 12px; }
          .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 8px; margin-bottom: 8px; }
          .header h2 { margin: 0; font-size: 18px; font-weight: bold; }
          .header p { margin: 2px 0; font-size: 11px; }
          .table-info { font-weight: bold; font-size: 15px; margin: 8px 0; text-align: center; border: 1.5px solid #000; padding: 6px; background-color: #f8f8f8; }
          table { width: 100%; font-size: 12px; border-collapse: collapse; margin-top: 8px; }
          th { border-bottom: 1px solid #000; text-align: right; padding-bottom: 4px; font-weight: bold; }
          .totals { border-top: 2px dashed #000; margin-top: 8px; padding-top: 8px; }
          .footer { text-align: center; margin-top: 12px; font-size: 10px; border-top: 1px solid #ddd; padding-top: 6px; }
          @media print {
            @page { margin: 0; size: 80mm auto; }
            body { width: 100%; margin: 0; padding: 8px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${restaurant.name}</h2>
          <p>${restaurant.branches?.[0]?.name || 'الفرع الرئيسي'}</p>
          <p>التاريخ: ${new Date(order.createdAt).toLocaleString('ar-EG')}</p>
        </div>

        <div class="table-info">
          رقم الطلب: ${order.orderNumber}<br/>
          طاولة رقم: ${order.tableNumber || 'سفري'}
        </div>

        <p style="margin: 4px 0;"><strong>الزبون:</strong> ${order.customerName}</p>
        ${order.customerPhone ? `<p style="margin: 2px 0;"><strong>الهاتف:</strong> ${order.customerPhone}</p>` : ''}
        ${order.notes ? `<p style="margin: 4px 0; background: #eee; padding: 3px;"><strong>ملاحظات المطبخ:</strong> ${order.notes}</p>` : ''}

        <table>
          <thead>
            <tr>
              <th>الصنف</th>
              <th style="text-align: center;">العدد</th>
              <th style="text-align: left;">السعر</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;"><span>المجموع:</span><span>${(order.subtotal || order.totalAmount).toFixed(2)} ${currentCurrency}</span></div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;"><span>الضريبة:</span><span>${(order.tax || 0).toFixed(2)} ${currentCurrency}</span></div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; margin-top: 4px; border-top: 1px solid #000; padding-top: 4px;"><span>الإجمالي:</span><span>${order.totalAmount.toFixed(2)} ${currentCurrency}</span></div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px;"><span>طريقة الدفع:</span><span>${order.paymentMethod === 'apple_pay' ? 'Apple Pay' : order.paymentMethod === 'mada' ? 'مدى' : 'نقداً'}</span></div>
        </div>

        <div class="footer">
          شكرًا لطلبكم! 🍽️<br/>
          نظام Menuz الرقمي لإدارة المطاعم
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = `تقرير مبيعات وطلبات menuz - ${restaurant.name}\n`;
    csvContent += `التاريخ,الفرع,عدد الطلبات,الإيرادات (${currentCurrency})\n`;
    salesReports.forEach(s => {
      csvContent += `${s.date},${s.branchName},${s.ordersCount},${s.revenue}\n`;
    });
    csvContent += `\nسجل الطلبات الحالية\n`;
    csvContent += `رقم الطلب,اسم الزبون,الهاتف,نوع الطلب,المبلغ,طريقة الدفع,الحالة\n`;
    orders.forEach(o => {
      csvContent += `${o.orderNumber},"${o.customerName}",${o.customerPhone || '-'},${o.orderType},${o.totalAmount},${o.paymentMethod},${o.status}\n`;
    });

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `تقارير_المبيعات_والطلبات_${restaurant.name}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF Report
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const totalRev = salesReports.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalOrd = salesReports.reduce((acc, curr) => acc + curr.ordersCount, 0);

    const salesRows = salesReports.map(s => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${s.date}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${s.branchName}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${s.ordersCount}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: left; font-weight: bold;">${s.revenue.toFixed(2)} ${currentCurrency}</td>
      </tr>
    `).join('');

    const orderRows = orders.slice(0, 30).map(o => `
      <tr>
        <td style="padding: 6px; border: 1px solid #eee; font-weight: bold;">#${o.orderNumber}</td>
        <td style="padding: 6px; border: 1px solid #eee;">${o.customerName}</td>
        <td style="padding: 6px; border: 1px solid #eee;">${o.orderType === 'dine_in' ? 'طاولة' : 'سفري'}</td>
        <td style="padding: 6px; border: 1px solid #eee; text-align: left; font-weight: bold;">${o.totalAmount.toFixed(2)} ${currentCurrency}</td>
        <td style="padding: 6px; border: 1px solid #eee;">${o.status}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="utf-8" />
        <title>تقرير المبيعات والطلبات - ${restaurant.name}</title>
        <style>
          body { font-family: 'Tajawal', system-ui, sans-serif; padding: 30px; color: #1e293b; direction: rtl; }
          .header { text-align: center; border-bottom: 2px solid #f97316; padding-bottom: 15px; margin-bottom: 25px; }
          .title { font-size: 24px; font-weight: 900; color: #0f172a; margin: 0; }
          .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
          .stats-grid { display: flex; gap: 15px; margin-bottom: 25px; }
          .stat-card { flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px; text-align: center; }
          .stat-val { font-size: 20px; font-weight: bold; color: #ea580c; }
          .stat-lbl { font-size: 12px; color: #64748b; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; }
          th { background: #0f172a; color: #fff; padding: 10px; border: 1px solid #0f172a; text-align: right; }
          h3 { color: #0f172a; border-right: 4px solid #f97316; padding-right: 10px; font-size: 16px; margin-bottom: 10px; }
          .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${restaurant.name}</h1>
          <div class="subtitle">تقرير المبيعات والطلبات الشهرية الشامل • تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}</div>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-val">${totalRev.toFixed(2)} ${currentCurrency}</div>
            <div class="stat-lbl">إجمالي الإيرادات</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${totalOrd}</div>
            <div class="stat-lbl">إجمالي عدد الطلبات</div>
          </div>
          <div class="stat-card">
            <div class="stat-val">${orders.length}</div>
            <div class="stat-lbl">الطلبات الحالية بالنظام</div>
          </div>
        </div>

        <h3>1. ملخص المبيعات حسب الأيام/الفروع</h3>
        <table>
          <thead>
            <tr>
              <th>التاريخ</th>
              <th>الفرع</th>
              <th style="text-align: center;">عدد الطلبات</th>
              <th style="text-align: left;">الإيراد</th>
            </tr>
          </thead>
          <tbody>
            ${salesRows}
          </tbody>
        </table>

        <h3>2. سجل الطلبات الأخيرة</h3>
        <table>
          <thead>
            <tr>
              <th>رقم الطلب</th>
              <th>اسم الزبون</th>
              <th>نوع الطلب</th>
              <th style="text-align: left;">المبلغ</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            ${orderRows}
          </tbody>
        </table>

        <div class="footer">
          تم إنشاء هذا التقرير تلقائياً عبر منصة Menuz الرقمية لـ ${restaurant.name}
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 600);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-['Tajawal',sans-serif] text-right">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* MAINTENANCE MODE ACTIVE TOP WARNING BANNER */}
        {isMaintenanceMode && (
          <div className="bg-amber-500/10 border-2 border-amber-500/40 p-5 rounded-3xl text-amber-900 dark:text-amber-200 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0 text-amber-500 border border-amber-500/30">
                <Wrench className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-sm text-slate-900 dark:text-amber-100">وضع الصيانة مفعّل حالياً بالموقع 🛠️</h3>
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">مباشر</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                  الموقع والمنيو محجوبان بشاشة الصيانة للزوار والزبائن. بصفتك مسؤولي النظام يمكنك المعاينة والعمل بحرية.
                </p>
              </div>
            </div>
            {onToggleMaintenanceMode && (
              <button
                onClick={onToggleMaintenanceMode}
                className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md shrink-0 cursor-pointer transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>إيقاف الصيانة وإعادة الموقع ⚡</span>
              </button>
            )}
          </div>
        )}

        {/* ADMIN HEADER BAR */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="px-3 py-1 rounded-full text-white text-xs font-black shadow-sm"
                style={{ backgroundColor: themePrimary }}
              >
                لوحة التحكم الإدارية
              </span>
              <span className="text-xs text-slate-400 font-bold">• {restaurant.name}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {t('adminDashboard')}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>تصدير CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>تصدير تقرير PDF 📄</span>
            </button>
          </div>
        </div>

        {/* BROWSER NOTIFICATIONS CONTROL BANNER */}
        <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-emerald-950 text-white p-5 rounded-3xl border border-orange-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/20 text-orange-400 rounded-2xl shrink-0">
              <Bell className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">نظام إشعارات المتصفح الفورية (Browser Notifications)</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                  notifPermission === 'granted' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {notifPermission === 'granted' ? 'مفعل بنجاح ⚡' : 'بانتظار التفعيل'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                احصل على تنبيه صوتي وبصري فوري على شاشة جهازك عند وصول أي طلب جديد أو حجز طاولة، حتى أثناء تصفح مواقع أخرى!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {notifPermission !== 'granted' ? (
              <button
                onClick={handleEnableNotifications}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span>تفعيل الإشعارات الفورية</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTestNotification}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>تجربة نغمة الإشعار الصوتيي 🛎️</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {testNotifSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم تشغيل نغمة الإشعار الصوتيي وإرسال إشعار المتصفح التجريبي بنجاح!</span>
          </div>
        )}

        {/* NAVIGATION TABS WITH DRAG & SCROLL SLIDER */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          {/* Header & Scroll Controls */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>أقسام ولوحات الإدارة (اسحب أو مرر للجانب ⇄)</span>
            </span>

            {/* Scroll Control Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollAdminTabs('right')}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-orange-500 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95"
                title="التمرير لليمين"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollAdminTabs('left')}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-orange-500 hover:text-white transition-all shadow-sm cursor-pointer active:scale-95"
                title="التمرير لليسار"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Container */}
          <div 
            ref={adminTabsScrollRef}
            onScroll={handleAdminTabsScroll}
            className="flex items-center gap-2 overflow-x-auto category-slider-scrollbar pb-3 pt-1 scroll-smooth rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-2 border border-slate-200/80 dark:border-slate-700/80"
          >
            {[
              ...(isSuperAdmin ? [{ id: 'superadmin', name: 'لوحة السوبر أدمن ⚡', icon: ShieldCheck }] : []),
              { id: 'overview', name: t('overview'), icon: TrendingUp },
              { id: 'analytics', name: 'الرسوم البيانية Recharts 📊', icon: BarChart3 },
              { id: 'affiliate', name: 'نظام البرومو كود 🎁', icon: Gift },
              { id: 'menu', name: t('menuManagement'), icon: UtensilsCrossed },
              { id: 'posts', name: 'المنشورات والعروض', icon: Megaphone },
              { id: 'kitchen', name: t('liveKitchen'), icon: Clock },
              { id: 'reservations', name: t('reservations'), icon: Calendar },
              { id: 'reports', name: t('reports'), icon: BarChart3 },
              { id: 'theme', name: 'الهوية البصرية والألوان', icon: Palette },
              { id: 'branches', name: t('branchesManager'), icon: MapPin },
              { id: 'payments', name: t('paymentSettings'), icon: CreditCard },
              { id: 'coupons', name: 'إدارة الكوبونات 🏷️', icon: Ticket },
              { id: 'delivery', name: 'إدارة التوصيل والكباتن 🛵', icon: Bike },
              { id: 'stories', name: 'مولّد الاستوريات 📸', icon: Camera },
              { id: 'telegram', name: 'ربط بوت التيليجرام 🤖', icon: Send },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isSuperTab = tab.id === 'superadmin';
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? isSuperTab
                        ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white shadow-lg shadow-orange-600/30 scale-105'
                        : 'text-white shadow-lg scale-105'
                      : isSuperTab
                        ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  style={isActive && !isSuperTab ? { backgroundColor: themePrimary } : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Drag Slider Controller */}
          <div className="pt-2 px-1 flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
              ↔️ شريط تمرير الأقسام
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={adminTabsScrollProgress}
              onChange={handleAdminTabsSliderChange}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600 transition-all"
              title="سحب للتمرير بين جميع أقسام اللوحة"
            />
          </div>
        </div>

        {/* 0. SUPER ADMIN MASTER TAB */}
        {activeTab === 'superadmin' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Super Admin Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 md:p-8 text-white shadow-2xl border border-amber-500/30">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>لوحة السوبر أدمن العليا • Super Admin Master Suite</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                    <span>مرحباً بك يزن سلق ⚡</span>
                  </h2>
                  <p className="text-xs md:text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
                    حساب السوبر أدمن المعتمد للمنصة: <span className="font-mono text-amber-300 font-bold">yazansalaq@gmail.com</span> • لديك الصلاحية الكاملة للتحكم في كافة المطاعم والاشتراكات وإدارة الباقات والخصومات ومراقبة المنصة بشكل كلي.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-3 shrink-0">
                  <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-right space-y-0.5">
                    <span className="text-[10px] text-slate-300 font-bold block">كلمة المرور الخاصة بالحساب</span>
                    <span className="text-sm font-mono font-black text-amber-300">jana@#5Y</span>
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold">السيرفرات: متصلة 100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification alert banner */}
            {superAdminAlert && (
              <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{superAdminAlert}</span>
                </div>
                <button onClick={() => setSuperAdminAlert(null)} className="text-amber-300 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Platform Master Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-extrabold">المطاعم المسجلة بالمنصة</span>
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  {platformStores.length} <span className="text-xs text-slate-400 font-normal">مطعم ومقهى</span>
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+3 مطاعم جديدة هذا الأسبوع</span>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-extrabold">إيرادات الاشتراكات الشهرية</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  $4,850 <span className="text-xs text-slate-400 font-normal">/ شهرياً</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  8 Enterprise • 3 Pro • 1 Starter
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-extrabold">إجمالي مبيعات المنيوهات</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  184,250 ₪
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                  عبر 3,420 طلب معالج إلكترونياً
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-extrabold">زوار المنيوهات الرقمية</span>
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">
                  82.4K <span className="text-xs text-slate-400 font-normal">زيارة</span>
                </div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                  متوسط بقاء الزائر: 3.4 دقيقة
                </div>
              </div>

            </div>

            {/* SECTION 1: ALL RESTAURANTS DIRECTORY & IMPERSONATION */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-500" />
                    <span>دليل كافة المطاعم والمشتركين بالمنصة</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    إدارة المطاعم المسجلة، ترقية الخطط، والتبديل المباشر كصاحب مطعم (Impersonation).
                  </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={storeSearchQuery}
                      onChange={(e) => setStoreSearchQuery(e.target.value)}
                      placeholder="بحث باسم المطعم أو البريد..."
                      className="w-full pr-10 pl-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <select
                    value={selectedPlanFilter}
                    onChange={(e) => setSelectedPlanFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="all">كافة الخطط</option>
                    <option value="plan_3_enterprise">👑 الخطة الملكية (Enterprise)</option>
                    <option value="plan_2">⭐ الخطة الاحترافية (Pro)</option>
                    <option value="plan_1">🚀 خطة البداية (Starter)</option>
                  </select>
                </div>
              </div>

              {/* Stores Grid / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {platformStores
                  .filter(st => {
                    const matchesSearch = st.name.toLowerCase().includes(storeSearchQuery.toLowerCase()) || 
                                          (st.email && st.email.toLowerCase().includes(storeSearchQuery.toLowerCase()));
                    const matchesPlan = selectedPlanFilter === 'all' || st.plan === selectedPlanFilter;
                    return matchesSearch && matchesPlan;
                  })
                  .map((st) => {
                    const isCurrentActive = st.id === restaurant.id;
                    return (
                      <div 
                        key={st.id}
                        className={`p-5 rounded-3xl border transition-all space-y-4 flex flex-col justify-between ${
                          isCurrentActive
                            ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-950/20 ring-2 ring-orange-500/30 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-3">
                          
                          {/* Logo & Name */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={st.logo} 
                                alt={st.name} 
                                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700 shadow-sm"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{st.name}</span>
                                  {isCurrentActive && (
                                    <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">النشط حالياً</span>
                                  )}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-1">{st.tagline}</p>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{st.email || 'yazansalaq@gmail.com'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Country & Branches count */}
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                              🇵🇸 القدس - فلسطين
                            </span>
                            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                              {st.branches?.length || 1} فروع
                            </span>
                          </div>

                          {/* Current Plan Badge and Upgrade Selector */}
                          <div className="space-y-1.5 pt-1">
                            <label className="text-[10px] font-bold text-slate-400 block">باقة الاشتراك المفعّلة</label>
                            <select
                              value={st.plan}
                              onChange={(e) => {
                                const newPlan = e.target.value as any;
                                setPlatformStores(prev => prev.map(p => p.id === st.id ? { ...p, plan: newPlan } : p));
                                setSuperAdminAlert(`تم تغيير خطة مطعم (${st.name}) بنجاح إلى: ${newPlan}`);
                              }}
                              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
                            >
                              <option value="plan_3_enterprise">👑 الخطة الملكية Enterprise (غير محدودة)</option>
                              <option value="plan_2">⭐ الخطة الاحترافية Pro (متاجر متعددة)</option>
                              <option value="plan_1">🚀 خطة البداية Starter (فرع واحد)</option>
                            </select>
                          </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (onSelectRestaurant) {
                                onSelectRestaurant(st);
                                setActiveTab('overview');
                                setSuperAdminAlert(`تم التبديل والدخول بصفتك صاحب مطعم (${st.name}) بنجاح! 🔑`);
                              }
                            }}
                            className="flex-1 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                            title="دخول مباشر كصاحب المطعم"
                          >
                            <Key className="w-3.5 h-3.5" />
                            <span>دخول كالمطعم 🔑</span>
                          </button>

                          <button
                            onClick={() => {
                              setSuperAdminAlert(`رابط المنيو المباشر لمطعم (${st.name}): https://menuz.app/r/${st.slug}`);
                            }}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                            title="معاينة المنيو الرقمي"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
              </div>

            </div>

            {/* SECTION 2: PROMO CODES & SUBSCRIPTION MANAGER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Promo Code Generator */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-lg">
                  <Tag className="w-5 h-5 text-amber-500" />
                  <span>إنشاء كودات خصم وترخيص للاشتراكات</span>
                </div>
                <p className="text-xs text-slate-500">
                  قم بإنشاء كود خصم مخصص لمطاعم أو حملات تسويقية (خصومات حتى 100% مجانية).
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                      placeholder="رمز الكود (مثال: YAZAN2026)"
                      className="flex-1 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold focus:outline-none"
                    />
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newPromoDiscount}
                      onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                      placeholder="نسبة الخصم %"
                      className="w-24 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-center focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (newPromoCode.trim()) {
                        setPromoCodesList(prev => [{ code: newPromoCode.trim(), discount: newPromoDiscount, active: true }, ...prev]);
                        setSuperAdminAlert(`تم إضافة كود الخصم (${newPromoCode}) بنسبة خصم ${newPromoDiscount}% بنجاح!`);
                        setNewPromoCode('');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>تأكيد وإنشاء كود الخصم</span>
                  </button>
                </div>

                {/* Active Promo Codes List */}
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-bold text-slate-400 block">الكودات الفعالة حالياً:</span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {promoCodesList.map((pc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                        <span className="font-mono font-black text-amber-500">{pc.code}</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">خصم {pc.discount}%</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">مفعل 🟢</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Broadcast System Announcement */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-lg">
                  <Megaphone className="w-5 h-5 text-orange-500" />
                  <span>إرسال بث إشعار عام لجميع المطاعم</span>
                </div>
                <p className="text-xs text-slate-500">
                  سيظهر هذا الإشعار أعلى لوحة تحكم جميع أصحاب المطاعم المسجلين بالمنصة فوراً.
                </p>

                <div className="space-y-3 pt-2">
                  <textarea
                    rows={3}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="اكتب نص التنبيه أو الإعلان العام..."
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none"
                  />

                  <button
                    onClick={() => {
                      setBroadcastSuccess(true);
                      setSuperAdminAlert('تم إرسال البث الإشعاري لكافة أصحاب المطاعم بنجاح! 📡');
                      setTimeout(() => setBroadcastSuccess(false), 4000);
                    }}
                    className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>إرسال البث الآن 📡</span>
                  </button>

                  {broadcastSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تم نشر التنبيه بنجاح بكافة اللوحات النشطة!</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* SECTION 3: SYSTEM DIAGNOSTICS */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-lg">
                <Server className="w-5 h-5 text-emerald-500" />
                <span>تشخيصات وبنية المنصة السحابية (Platform Infrastructure)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold block">قواعد البيانات (Firestore)</span>
                  <div className="text-sm font-black text-emerald-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>متصلة وعاملة 🟢</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold block">ذكاء الاصطناعي (Gemini 2.5 API)</span>
                  <div className="text-sm font-black text-emerald-500 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>نشط ومفعل ⚡</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold block">خادم الإشعارات الصوتية والتنبيهات</span>
                  <div className="text-sm font-black text-emerald-500 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-emerald-500" />
                    <span>جاهز 100% 🛎️</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold block">نسخ حماية البيانات الأسبوعية</span>
                  <div className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>تلقائي محفوظ 📦</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-bold block">{t('totalRevenue')}</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                    {formatPrice(totalRevenue, currentCurrency)}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-bold block">{t('todayOrders')}</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                    {totalOrdersCount} <span className="text-xs text-slate-400">طلبات</span>
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-bold block">{t('pendingReservations')}</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                    {pendingResCount} <span className="text-xs text-slate-400">حجوزات</span>
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-bold block">{t('activeDishesCount')}</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">
                    {activeDishesCount} <span className="text-xs text-slate-400">طبق</span>
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Sales Chart & Recent Orders Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Sales Chart */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {t('salesOverviewChart')}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesReports}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke={themePrimary} fill={themePrimary} fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Orders Stream */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-lg font-bold">بث الطلبات المباشر</h3>
                  <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    مباشر
                  </span>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold">{ord.orderNumber} • طاولة {ord.tableNumber}</div>
                        <div className="text-slate-400">{ord.customerName} ({ord.items.length} أطباق)</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePrintTicket(ord)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white cursor-pointer"
                          title="طباعة تذكرة الطلب / الفاتورة"
                        >
                          <Printer className="w-3.5 h-3.5 text-orange-500" />
                        </button>
                        <div className="text-left font-bold">
                          <div style={{ color: themePrimary }}>{formatPrice(ord.totalAmount, currentCurrency)}</div>
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <AnalyticsRecharts
            orders={orders}
            salesReports={salesReports}
            categories={categories}
            currentCurrency={currentCurrency}
            primaryColor={themePrimary}
          />
        )}

        {/* AFFILIATE PROMO CODE TAB */}
        {activeTab === 'affiliate' && (
          <PromoAffiliateSection
            currentUser={currentUser}
            currentCurrency={currentCurrency}
            isSuperAdmin={isSuperAdmin}
          />
        )}

        {/* 2. MENU DISHES EDITOR TAB */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">قائمة الأطباق والمأكولات ({dishes.length})</h3>
                <p className="text-xs text-slate-500">عدّل براحتك في أسعار وصور وتفاصيل كل طبق مع رفع الصور مباشرة من الجهاز</p>
              </div>
              <button
                onClick={() => {
                  setEditingDish({
                    name: '',
                    nameEn: '',
                    description: '',
                    descriptionEn: '',
                    price: 45,
                    categoryId: categories[0]?.id || 'cat_1',
                    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&fit=crop',
                    isAvailable: true,
                    preparationTimeMinutes: 15
                  });
                  setDishModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer transition-all"
                style={{ backgroundColor: themePrimary }}
              >
                <Plus className="w-4 h-4" />
                <span>إضافة طبق جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map((dish) => (
                <div key={dish.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="relative">
                      <img src={dish.image} alt={dish.name} className="w-full h-40 object-cover rounded-2xl" />
                      {!dish.isAvailable && (
                        <span className="absolute top-2 right-2 bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow">
                          غير متاح حالياً
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-white">{dish.name}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">{dish.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-3">
                    <span className="font-black text-lg" style={{ color: themePrimary }}>
                      {formatPrice(dish.price, currentCurrency)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleAvailability(dish.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          dish.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {dish.isAvailable ? 'متاح' : 'غير متاح'}
                      </button>

                      <button
                        onClick={() => { setEditingDish(dish); setDishModalOpen(true); }}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 cursor-pointer"
                        title="تعديل الطبق"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteDish(dish.id)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 cursor-pointer"
                        title="حذف الطبق"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. POSTS & PROMOTIONS MANAGER TAB */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-orange-500/10 text-orange-600 rounded-2xl">
                    <Megaphone className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    إدارة المنشورات والإعلانات الترويجية ({postsList.length})
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  صمِّم وعدِّل منشورات مطعمك وعروض الخصومات بحرية تامة مع رفع الصور مباشرة من ملفات جهازك 📸
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingPost({
                    title: '',
                    titleEn: '',
                    content: '',
                    contentEn: '',
                    badge: 'عرض خاص 🔥',
                    discountCode: '',
                    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&fit=crop',
                    active: true,
                    likesCount: 0
                  });
                  setPostModalOpen(true);
                }}
                className="px-5 py-3 rounded-2xl text-white font-black text-xs shadow-lg flex items-center gap-2 cursor-pointer shrink-0 transition-all"
                style={{ backgroundColor: themePrimary }}
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء منشور ترويجي جديد</span>
              </button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postsList.map((post) => (
                <div 
                  key={post.id} 
                  className={`bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border shadow-sm transition-all flex flex-col justify-between ${
                    post.active ? 'border-slate-200 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative h-48 bg-slate-900">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      {post.badge && (
                        <span className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                          {post.badge}
                        </span>
                      )}

                      <span className={`absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full ${
                        post.active ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {post.active ? 'نشط الآن' : 'مسودة غير معلنة'}
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="font-black text-lg text-slate-900 dark:text-white leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {post.content}
                      </p>

                      {post.discountCode && (
                        <div className="mt-3 p-2.5 bg-orange-50 dark:bg-orange-950/40 rounded-xl border border-orange-200 dark:border-orange-800 flex items-center justify-between text-xs font-bold text-orange-700 dark:text-orange-300">
                          <span>كود الخصم المرفق:</span>
                          <span className="bg-orange-600 text-white px-2.5 py-0.5 rounded-lg font-mono">
                            {post.discountCode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-4">
                    <button
                      onClick={() => handleTogglePostActive(post.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        post.active 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' 
                          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800'
                      }`}
                    >
                      {post.active ? 'تعطيل العرض' : 'تفعيل العرض'}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditingPost(post); setPostModalOpen(true); }}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                        title="تعديل المنشور"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 cursor-pointer"
                        title="حذف المنشور"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. LIVE KITCHEN DISPLAY TAB */}
        {activeTab === 'kitchen' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span>شاشة طلبات المطبخ الحية</span>
              </h3>
              <span className="text-xs text-slate-400">تنبيهات صوتية فورية</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['new', 'preparing', 'ready'] as OrderStatus[]).map((status) => {
                const statusOrders = orders.filter(o => o.status === status);
                return (
                  <div key={status} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-orange-600 pb-2 border-b flex items-center gap-1.5">
                      {status === 'new' ? (
                        <>
                          <Sparkles className="w-4 h-4 text-orange-500" />
                          <span>طلبات جديدة</span>
                        </>
                      ) : status === 'preparing' ? (
                        <>
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>جاري التحضير</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>جاهز للتقديم</span>
                        </>
                      )}
                      <span className="text-xs font-normal">({statusOrders.length})</span>
                    </h4>

                    <div className="space-y-3">
                      {statusOrders.map((ord) => (
                        <div key={ord.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border space-y-2">
                          <div className="flex justify-between font-bold text-sm">
                            <span>{ord.orderNumber}</span>
                            <span className="text-orange-600">طاولة {ord.tableNumber}</span>
                          </div>

                          <div className="kitchen-checklist pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                            {ord.items.map((it, i) => {
                              const itemKey = `${ord.id}_item_${i}`;
                              const isChecked = !!completedKitchenItems[itemKey];
                              return (
                                <div key={i} className="kitchen-checklist-item">
                                  <input
                                    type="checkbox"
                                    id={itemKey}
                                    checked={isChecked}
                                    onChange={(e) => {
                                      setCompletedKitchenItems(prev => ({
                                        ...prev,
                                        [itemKey]: e.target.checked
                                      }));
                                    }}
                                  />
                                  <label htmlFor={itemKey}>
                                    <span>{it.quantity}x {it.dishName}</span>
                                    {it.selectedOptions && it.selectedOptions.length > 0 && (
                                      <span className="text-[10px] text-slate-400 mr-1">
                                        ({it.selectedOptions.join(', ')})
                                      </span>
                                    )}
                                  </label>
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-700/60 mt-2">
                            <button
                              onClick={() => handlePrintTicket(ord)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                              title="طباعة تذكرة المطبخ / الفاتورة الحرارية"
                            >
                              <Printer className="w-3.5 h-3.5 text-orange-500" />
                              <span>طباعة 🖨️</span>
                            </button>

                            <div className="flex gap-1.5">
                              {status === 'new' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(ord.id, 'preparing')}
                                  className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs cursor-pointer"
                                >
                                  بدء التحضير
                                </button>
                              )}
                              {status === 'preparing' && (
                                <button
                                  onClick={() => onUpdateOrderStatus(ord.id, 'ready')}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                                >
                                  اكتمل الطلب
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 5. TABLE RESERVATIONS TAB */}
        {activeTab === 'reservations' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-bold">قائمة حجوزات الطاولات</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 font-bold">
                  <tr>
                    <th className="p-3">اسم العميل</th>
                    <th className="p-3">الفرع</th>
                    <th className="p-3">التاريخ والوقت</th>
                    <th className="p-3">عدد الأشخاص</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reservations.map((res) => (
                    <tr key={res.id}>
                      <td className="p-3 font-bold">{res.customerName} ({res.customerPhone})</td>
                      <td className="p-3">{res.branchName}</td>
                      <td className="p-3">{res.date} • {res.time}</td>
                      <td className="p-3">{res.guestsCount} أشخاص</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {res.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => onUpdateReservationStatus(res.id, 'confirmed')}
                              className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer"
                            >
                              تأكيد
                            </button>
                            <button
                              onClick={() => onUpdateReservationStatus(res.id, 'cancelled')}
                              className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold cursor-pointer"
                            >
                              إلغاء
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. REPORTS & ANALYTICS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">تقارير المبيعات والطلبات التفصيلية</h3>
                  <p className="text-xs text-slate-500 mt-1">يمكنك معاينة المبيعات وتصدير السجلات بصيغ CSV و PDF للطباعة أو الحفظ</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs flex items-center gap-2 shadow cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>تصدير ملف CSV</span>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="px-4 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs flex items-center gap-2 shadow cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>تصدير تقرير PDF 📄</span>
                  </button>
                </div>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesReports}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill={themePrimary} radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Summary Table */}
              <div className="overflow-x-auto pt-4">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold">
                      <th className="py-3 px-2">التاريخ</th>
                      <th className="py-3 px-2">الفرع</th>
                      <th className="py-3 px-2 text-center">عدد الطلبات</th>
                      <th className="py-3 px-2 text-left">إجمالي الإيراد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {salesReports.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-2 font-bold">{s.date}</td>
                        <td className="py-3 px-2">{s.branchName}</td>
                        <td className="py-3 px-2 text-center font-bold text-orange-500">{s.ordersCount} طلب</td>
                        <td className="py-3 px-2 text-left font-black text-emerald-600 dark:text-emerald-400">{s.revenue.toFixed(2)} {currentCurrency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. THEME & BRAND COLOR CUSTOMIZER TAB */}
        {activeTab === 'theme' && (
          <div className="space-y-8">
            
            {themeSavedAlert && (
              <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg flex items-center justify-between animate-in fade-in">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>تم حفظ لون وتصاميم الهوية البصرية بنجاح وتطبيقها فوراً على المنيو الرقمي! 🎉</span>
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Color Controls */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-orange-500" />
                    <span>تخصيص اللون الأساسي (Primary Brand Color) للمنيو</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    اختر اللون الأساسي المطابق لهويتك البصرية، سيتم استخدامه في الأزرار، الأقسام، الشارات، وواجهة المنيو الحية.
                  </p>
                </div>

                {/* Preset Brand Color Palettes */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                    1. لوحات ألوان جاهزة ومختارة بعناية للهوية:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {BRAND_COLOR_PRESETS.map((preset) => {
                      const isSelected = themePrimary.toLowerCase() === preset.color.toLowerCase();
                      return (
                        <button
                          key={preset.color}
                          type="button"
                          onClick={() => setThemePrimary(preset.color)}
                          className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? 'border-2 border-slate-900 dark:border-white shadow-md ring-2 ring-slate-400/40 bg-slate-50 dark:bg-slate-800'
                              : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-xs text-slate-900 dark:text-white">{preset.name}</span>
                            <span 
                              className="w-6 h-6 rounded-full border border-white shadow-md shrink-0" 
                              style={{ backgroundColor: preset.color }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight">{preset.desc}</p>
                          {isSelected && (
                            <span className="mt-2 text-[10px] font-black text-emerald-600 flex items-center gap-1">
                              <Check className="w-3 h-3" /> تم الاختيار
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Hex Color Pickers */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200">
                    2. أو تخصيص درجات ألوان دقيقة عبر كود Hex:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">اللون الأساسي (Primary Color)</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themePrimary}
                          onChange={(e) => setThemePrimary(e.target.value)}
                          className="w-12 h-12 rounded-2xl cursor-pointer border-2 border-slate-200 dark:border-slate-700 p-1 bg-white"
                        />
                        <input
                          type="text"
                          value={themePrimary}
                          onChange={(e) => setThemePrimary(e.target.value)}
                          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">اللون الثانوي التكميلي</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={themeSecondary}
                          onChange={(e) => setThemeSecondary(e.target.value)}
                          className="w-12 h-12 rounded-2xl cursor-pointer border-2 border-slate-200 dark:border-slate-700 p-1 bg-white"
                        />
                        <input
                          type="text"
                          value={themeSecondary}
                          onChange={(e) => setThemeSecondary(e.target.value)}
                          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Font Selection Control for Restaurant Menu */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    نوع خط المنيو الخاص بمطعمك (اختر خط المنيو) 🔤
                  </label>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    يمكنك اختيار خط المنيو الإلكتروني الخاص بمطعمك (خط المنصة IBM Plex Sans Arabic، خط كايرو Cairo، أو خط تجوال Tajawal)
                  </p>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setThemeFontFamily('IBM Plex Sans Arabic')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-['IBM_Plex_Sans_Arabic',sans-serif] ${
                        themeFontFamily === 'IBM Plex Sans Arabic' || themeFontFamily === 'خط المنصة' || themeFontFamily === 'منصة'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold ring-2 ring-orange-500/30'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-black">خط المنصة</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">IBM Plex Sans</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setThemeFontFamily('Cairo')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-['Cairo',sans-serif] ${
                        themeFontFamily === 'Cairo' || themeFontFamily === 'كايرو'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold ring-2 ring-orange-500/30'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-black">خط كايرو</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">Cairo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setThemeFontFamily('Tajawal')}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-['Tajawal',sans-serif] ${
                        themeFontFamily === 'Tajawal' || themeFontFamily === 'تجوال'
                          ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold ring-2 ring-orange-500/30'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-black">خط تجوال</span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">Tajawal</span>
                    </button>
                  </div>
                </div>

                {/* Tagline & Branding Info */}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">شعار المطعم الفرعي (Tagline)</label>
                    <input
                      type="text"
                      value={themeTagline}
                      onChange={(e) => setThemeTagline(e.target.value)}
                      className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Logo & Banner File Uploads */}
                  <FileImageUploader
                    label="شعار المطعم (Logo)"
                    currentImage={themeLogo}
                    onImageChange={(val) => setThemeLogo(val)}
                  />

                  <FileImageUploader
                    label="غلاف رأس المنيو (Hero Banner)"
                    currentImage={themeBanner}
                    onImageChange={(val) => setThemeBanner(val)}
                  />
                </div>

                {/* NERD DICE GAME FEATURE TOGGLE CARD */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-red-500/10 border-2 border-orange-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-500/20 text-orange-600 rounded-2xl">
                        <Gift className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>تفعيل ميزة "لعبة حجار نيرد" 🎲</span>
                          <span className="text-[10px] bg-orange-500/20 text-orange-600 font-extrabold px-2 py-0.5 rounded-full">
                            زيادة مبيعات 🚀
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          تتيح للزبائن رمي النرد في المنيو والحصول على خصم مساوٍ لمجموع النقاط التي يربحونها بالطاولة (مرة كل 48 ساعة لكل عنوان IP)
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNerdDiceGameEnabled(!nerdDiceGameEnabled)}
                      className={`px-4 py-2 rounded-xl text-xs font-black cursor-pointer transition-all shadow-sm ${
                        nerdDiceGameEnabled
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {nerdDiceGameEnabled ? 'الميزة مفعّلة 🟢' : 'الميزة معطلة ⚪'}
                    </button>
                  </div>
                </div>

                {/* MAINTENANCE MODE SYSTEM CONTROL CARD */}
                <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-amber-500" />
                      <div>
                        <h4 className="font-black text-xs text-slate-900 dark:text-amber-100">إدارة وضع الصيانة للموقع 🛠️</h4>
                        <p className="text-[11px] text-slate-500 dark:text-amber-300/80">تفعيل شاشة الصيانة وإغلاق المنيو أمام الزوار مؤقتاً</p>
                      </div>
                    </div>
                    {onToggleMaintenanceMode && (
                      <button
                        type="button"
                        onClick={onToggleMaintenanceMode}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black cursor-pointer transition-all shadow-sm ${
                          isMaintenanceMode
                            ? 'bg-rose-600 hover:bg-rose-500 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        {isMaintenanceMode ? 'تعطيل وضع الصيانة 🟢' : 'تفعيل وضع الصيانة 🛑'}
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-amber-500/20">
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      رسالة الصيانة المخصصة التي تظهر للزبائن:
                    </label>
                    <textarea
                      rows={2}
                      value={maintenanceNote}
                      onChange={(e) => onUpdateMaintenanceNote?.(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveTheme}
                  className="w-full py-4 rounded-2xl text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                  style={{ backgroundColor: themePrimary }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>حفظ اللون والتصميم للهوية 🚀</span>
                </button>
              </div>

              {/* Interactive Live Menu Theme Preview */}
              <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 self-start">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Eye className="w-4 h-4 text-orange-500" />
                    <span>معاينة فورية حية للتصميم للمنيو الرقمي</span>
                  </h4>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-extrabold px-2 py-0.5 rounded-full">
                    مباشر ⚡
                  </span>
                </div>

                {/* Simulated Digital Menu Mockup Card */}
                <div 
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg bg-slate-50 dark:bg-slate-950 text-right"
                  style={{ fontFamily: themeFontFamily === 'Cairo' ? "'Cairo', sans-serif" : themeFontFamily === 'Tajawal' ? "'Tajawal', sans-serif" : "'IBM Plex Sans Arabic', sans-serif" }}
                >
                  {/* Hero Header */}
                  <div 
                    className="p-5 text-white space-y-2 relative"
                    style={{ backgroundColor: themePrimary }}
                  >
                    <div className="flex items-center gap-3">
                      <img src={themeLogo || restaurant.logo} alt="Logo" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/50" />
                      <div>
                        <h5 className="font-black text-base">{restaurant.name}</h5>
                        <p className="text-[10px] text-white/80 line-clamp-1">{themeTagline}</p>
                      </div>
                    </div>
                  </div>

                  {/* Active Category Bar Preview */}
                  <div className="p-3 flex items-center gap-2 overflow-x-auto bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                    <span 
                      className="px-3 py-1 rounded-xl text-white text-[11px] font-black shrink-0 shadow-sm"
                      style={{ backgroundColor: themePrimary }}
                    >
                      الأكثر طلباً 🔥
                    </span>
                    <span className="px-3 py-1 rounded-xl text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 text-[11px] font-bold shrink-0">
                      الوجبات الرئيسية
                    </span>
                    <span className="px-3 py-1 rounded-xl text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 text-[11px] font-bold shrink-0">
                      المشروبات
                    </span>
                  </div>

                  {/* Sample Dish Card Preview */}
                  <div className="p-4 space-y-3">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                      <img 
                        src={dishes[0]?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'} 
                        alt="Dish" 
                        className="w-16 h-16 rounded-xl object-cover" 
                      />
                      <div className="flex-1 min-w-0">
                        <h6 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {dishes[0]?.name || 'مشاوي مشكلة فاخرة'}
                        </h6>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">شيش طاووق وكباب مع أرز بالزعفران</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-black text-xs" style={{ color: themePrimary }}>
                            {dishes[0]?.price || 75} {currentCurrency}
                          </span>
                          <button 
                            type="button" 
                            className="px-2.5 py-1 rounded-lg text-white font-bold text-[10px] shadow"
                            style={{ backgroundColor: themePrimary }}
                          >
                            + إضافة
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Primary Button Sample */}
                    <button 
                      type="button"
                      className="w-full py-2.5 rounded-xl text-white text-xs font-black shadow-md flex items-center justify-center gap-2"
                      style={{ backgroundColor: themePrimary }}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>عرض السلة وإرسال الطلب (3 عناصر)</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 12. TELEGRAM BOT INTEGRATION TAB */}
        {activeTab === 'telegram' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Telegram Bot Master Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-950 via-slate-900 to-cyan-950 p-6 md:p-8 text-white shadow-2xl border border-sky-500/30">
              <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-500/30 shadow-inner">
                    <Send className="w-8 h-8 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-xl font-black text-white">ربط بوت التيليجرام الفوري (Telegram Bot) 🤖</h2>
                      <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                        متصل ومفعّل 🟢
                      </span>
                    </div>
                    <p className="text-xs text-sky-200/80 leading-relaxed max-w-2xl">
                      تلقَّ إشعارات الطلبات المباشرة وحجوزات الطاولات فور حدوثها على حاسوبك أو هاتفك عبر تطبيق Telegram بكل سهولة، دون حاجة لتسجيل دخول الزبائن!
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-sky-500/30 p-4 rounded-2xl text-xs space-y-1 font-mono shrink-0">
                  <p className="text-sky-300 font-bold">🤖 Bot Username:</p>
                  <p className="text-slate-300">@MenuZzbot</p>
                  <p className="text-amber-400 font-bold pt-1">⚙️ Bot Status:</p>
                  <p className="text-emerald-400 font-bold">نشط ومتصل بالبيئة</p>
                </div>
              </div>
            </div>

            {/* Main Grid: Restaurant Link Controls & Setup Instructions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form & Connection Test Box */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Radio className="w-5 h-5 text-sky-500" />
                    <span>إعدادات ربط المطعم بالحساب في Telegram</span>
                  </h3>
                  <span className="text-xs bg-sky-500/10 text-sky-600 font-bold px-3 py-1 rounded-full">
                    {restaurant.name}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Step-by-Step Activation Guide Header */}
                  <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                        <Send className="w-4 h-4 text-sky-500 animate-pulse" />
                        <span>خطوات تفعيل البوت وحل مشكلة (chat not found):</span>
                      </span>
                      <a
                        href="https://t.me/MenuZzbot"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>فتح البوت @MenuZzbot 🤖</span>
                      </a>
                    </div>
                    <ol className="text-xs text-sky-800 dark:text-sky-300 space-y-1.5 pr-2 list-decimal list-inside font-medium">
                      <li>اضغط على <b>فتح البوت @MenuZzbot</b> بالأعلى.</li>
                      <li>داخل تطبيق تيليجرام، اضغط على زر <b>(Start / ابدأ)</b>.</li>
                      <li>سيقوم البوت بإعطائك <b>Chat ID الخاص بك</b> (أو يمكنك استخدام <code>6368977651</code>).</li>
                      <li>أدخل المعرف أدناه واضغط <b>حفظ واختبار الإشعار</b>.</li>
                    </ol>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                      معرف الشات أو الحساب الشخصي بالتيليجرام (Telegram Chat ID):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={telegramChatInput}
                        onChange={(e) => setTelegramChatInput(e.target.value)}
                        placeholder="مثال: 6368977651"
                        className="flex-1 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm text-slate-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setTelegramChatInput('6368977651')}
                        className="px-4 py-3.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/20 transition-colors shrink-0 cursor-pointer"
                        title="تعيين معرف الأدمن المالك"
                      >
                        أدمن المالك 👑
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      المعرف الافتراضي للأدمن المالك هو <code>6368977651</code>. يمكنك إدخال أي معرف حساب أو جروب آخر.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      disabled={telegramLoading}
                      onClick={async () => {
                        setTelegramLoading(true);
                        setTelegramTestSuccess(null);
                        const res = await linkRestaurantTelegram(restaurant.id, telegramChatInput, restaurant.name);
                        setTelegramLoading(false);
                        if (res.success) {
                          setTelegramTestSuccess(`✅ تم ربط المطعم (${restaurant.name}) بالحساب ${telegramChatInput} بنجاح!`);
                        } else {
                          setTelegramTestSuccess(`⚠️ حدث خطأ أثناء الربط: ${res.error || 'يرجى التحقق من الخادم'}`);
                        }
                      }}
                      className="flex-1 py-3.5 px-5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>حفظ وربط المطعم بـ Telegram 📱</span>
                    </button>

                    <button
                      type="button"
                      disabled={telegramLoading}
                      onClick={async () => {
                        setTelegramLoading(true);
                        setTelegramTestSuccess(null);
                        const res = await testTelegramBotPing(telegramChatInput);
                        setTelegramLoading(false);
                        if (res.ok) {
                          setTelegramTestSuccess(`🎉 تم إرسال رسالة الفحص بنجاح إلى حساب التيليجرام (${telegramChatInput})! افحص تطبيق Telegram الآن.`);
                        } else {
                          const errDesc = res.description || '';
                          if (errDesc.includes('chat not found') || errDesc.includes('blocked') || res.needsStart) {
                            setTelegramTestSuccess(`NEED_START::${errDesc}`);
                          } else {
                            setTelegramTestSuccess(`❌ فشل الإرسال: ${errDesc}`);
                          }
                        }
                      }}
                      className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700 disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>إرسال تجربة إشعار فوري 🚀</span>
                    </button>
                  </div>

                  {telegramTestSuccess && (
                    telegramTestSuccess.startsWith('NEED_START::') ? (
                      <div className="p-5 rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border-2 border-amber-500/40 text-xs space-y-3 animate-in fade-in">
                        <div className="flex items-start gap-2 text-amber-800 dark:text-amber-200">
                          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-black text-sm">⚠️ سبب العطل: (Bad Request: chat not found)</p>
                            <p className="leading-relaxed">
                              تمنع قوانين تيليجرام البوتات من مراسلة أي حساب قبل أن يقوم صاحب الحساب ببدء المحادثة والضغط على <b>/start</b> أولاً!
                            </p>
                          </div>
                        </div>
                        <div className="pt-1 flex items-center justify-between gap-2 border-t border-amber-500/20">
                          <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                            حل المشكلة فوراً (اضغط للفتح والبدء):
                          </span>
                          <a
                            href="https://t.me/MenuZzbot"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>1️⃣ افتح @MenuZzbot واضغط Start</span>
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 animate-in fade-in">
                        {telegramTestSuccess}
                      </div>
                    )
                  )}
                </div>

                {/* Workflow Architecture Card */}
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span>سلسلة إرسال الطلبات وحجوزات الطاولات عبر المنصة:</span>
                  </h4>
                  <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">1</span>
                      <span><b>الزبائن في المنيو:</b> يتصفحون الوجبات ويطلبون مباشرة بدون تسجيل دخول أو تعقيدات حسابات.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">2</span>
                      <span><b>لوحة التحكم وشاشة المطبخ:</b> يصل الطلب فوراً مع نغمة تنبيه وصوت جرس مستمر للطلب الجديد.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">3</span>
                      <span><b>إشعار بوت Telegram:</b> يُرسل إشعار HTML يحتوي كافة تفاصيل الطلب، اسم الزبون، ورقم الطاولة، ومبلغ الإجمالي.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">4</span>
                      <span><b>طباعة الفاتورة 🖨️:</b> يستطيع صاحب المطعم تأكيد الطلب وطباعة فاتورة حرارية أو A4 بضغطة زر.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Telegram Instructions & Commands Guide */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* How to use Telegram Bot */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-sky-500" />
                    <span>خطوات تشغيل البوت في تطبيق Telegram</span>
                  </h3>

                  <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">الخطوة 1: البحث عن البوت</p>
                      <p className="text-slate-500">افتح تطبيق Telegram وابحث عن اسم البوت أو اكتب <code>@MenuzAppBot</code> في خانة البحث.</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">الخطوة 2: بدء المحادثة</p>
                      <p className="text-slate-500">انقر على <b>Start / بدء</b> أو ارسل الأمر <code>/start</code> للبوت لاستلام المعرف الخاص بك.</p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">الخطوة 3: ربط المطعم</p>
                      <p className="text-slate-500">ارسل الأمر <code>/link {restaurant.id}</code> للبوت لربط مطعمك وتأكيد استقبال جميع الطلبات هنا.</p>
                    </div>
                  </div>
                </div>

                {/* Super Admin Commands Center */}
                {isSuperAdmin && (
                  <div className="bg-gradient-to-br from-slate-900 to-amber-950 p-6 rounded-3xl border border-amber-500/30 text-white space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <h4 className="font-black text-sm text-amber-300 flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <span>أوامر الأدمن المالك (Super Admin Telegram Commands)</span>
                      </h4>
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        ID: 6368977651
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                        <span><code>/stats</code> - إحصائيات المبيعات الحية</span>
                        <span className="text-[10px] text-emerald-400">متاح</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                        <span><code>/restaurants</code> - قائمة المطاعم النشطة</span>
                        <span className="text-[10px] text-emerald-400">متاح</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                        <span><code>/broadcast &lt;النص&gt;</code> - تعميم للمطاعم</span>
                        <span className="text-[10px] text-emerald-400">متاح</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

        {/* COUPONS MANAGER TAB */}
        {activeTab === 'coupons' && (
          <CouponsManager
            coupons={couponsList}
            onUpdateCoupons={setCouponsList}
            currentCurrency={currentCurrency}
          />
        )}

        {/* DELIVERY MANAGER TAB */}
        {activeTab === 'delivery' && (
          <DeliveryManager
            orders={orders}
            drivers={deliveryDrivers}
            onUpdateOrderStatus={onUpdateOrderStatus}
            onUpdateDrivers={setDeliveryDrivers}
            currentCurrency={currentCurrency}
          />
        )}

        {/* SOCIAL STORIES GENERATOR TAB */}
        {activeTab === 'stories' && (
          <SocialStoriesGenerator
            restaurant={restaurant}
            dishes={dishes}
            currentCurrency={currentCurrency}
          />
        )}

      </div>

      {/* DISH EDIT MODAL WITH DIRECT FILE UPLOAD */}
      {dishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-orange-500" />
                <span>{editingDish.id ? 'تعديل بيانات الطبق' : 'إضافة طبق جديد للمنيو'}</span>
              </h3>
              <button onClick={() => setDishModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4">
              
              {/* Image File Uploader */}
              <FileImageUploader
                label="صورة الطبق"
                currentImage={editingDish.image}
                onImageChange={(val) => setEditingDish({ ...editingDish, image: val })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">اسم الطبق بالعربية *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: كباب بالكرز الملكي"
                    value={editingDish.name || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">اسم الطبق بالإنجليزية</label>
                  <input
                    type="text"
                    placeholder="Dish Name in English"
                    value={editingDish.nameEn || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, nameEn: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">السعر ({currentCurrency}) *</label>
                  <input
                    type="number"
                    required
                    placeholder="السعر"
                    value={editingDish.price || ''}
                    onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">قسم المنيو</label>
                  <select
                    value={editingDish.categoryId || categories[0]?.id}
                    onChange={(e) => setEditingDish({ ...editingDish, categoryId: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">وقت التحضير (دقيقة)</label>
                  <input
                    type="number"
                    placeholder="15"
                    value={editingDish.preparationTimeMinutes || 15}
                    onChange={(e) => setEditingDish({ ...editingDish, preparationTimeMinutes: Number(e.target.value) })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">وصف الطبق والمكونات بالعربية</label>
                <textarea
                  rows={2}
                  placeholder="الوصف التفصيلي للطبق وشرح المكونات..."
                  value={editingDish.description || ''}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                />
              </div>

              {/* Special Badges Checkboxes */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2">
                <span className="block text-xs font-bold text-slate-600 dark:text-slate-400">شارات ومميزات الطبق:</span>
                <div className="flex flex-wrap gap-4 text-xs font-bold">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingDish.isSpicy}
                      onChange={(e) => setEditingDish({ ...editingDish, isSpicy: e.target.checked })}
                    />
                    <span>حار 🌶️</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingDish.isVegetarian}
                      onChange={(e) => setEditingDish({ ...editingDish, isVegetarian: e.target.checked })}
                    />
                    <span>نباتي 🥬</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingDish.isBestSeller}
                      onChange={(e) => setEditingDish({ ...editingDish, isBestSeller: e.target.checked })}
                    />
                    <span>الأكثر مبيعاً 🔥</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingDish.isChefSpecial}
                      onChange={(e) => setEditingDish({ ...editingDish, isChefSpecial: e.target.checked })}
                    />
                    <span>توصية الشيف ⭐</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDishModalOpen(false)}
                  className="w-1/2 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3.5 rounded-2xl text-white font-black text-xs shadow-md cursor-pointer"
                  style={{ backgroundColor: themePrimary }}
                >
                  حفظ الطبق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POST EDIT MODAL WITH DIRECT FILE UPLOAD */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-right space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-orange-500" />
                <span>{editingPost.id ? 'تعديل المنشور الترويجي' : 'إنشاء منشور ترويجي جديد'}</span>
              </h3>
              <button onClick={() => setPostModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              
              {/* Image File Uploader */}
              <FileImageUploader
                label="صورة المنشور أو العرض الترويجي"
                currentImage={editingPost.image}
                onImageChange={(val) => setEditingPost({ ...editingPost, image: val })}
              />

              <div>
                <label className="block text-xs font-bold mb-1">عنوان المنشور / العرض *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: 🔥 عرض نهاية الأسبوع العائلي - خصم 30%"
                  value={editingPost.title || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">شارة المنشور (Badge)</label>
                  <input
                    type="text"
                    placeholder="مثال: عرض خاص 🔥 / جديد ✨"
                    value={editingPost.badge || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, badge: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">كود الخصم المرفق (اختياري)</label>
                  <input
                    type="text"
                    placeholder="مثال: PALACE25"
                    value={editingPost.discountCode || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, discountCode: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">تفاصيل العرض ومحتوى المنشور</label>
                <textarea
                  rows={3}
                  placeholder="اكتب شرحاً مشوقاً للعملاء عن العرض والوجبات المشمولة فيه..."
                  value={editingPost.content || ''}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs font-bold"
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  تفعيل ونشر المنشور فوراً في المنيو
                </span>
                <input
                  type="checkbox"
                  checked={editingPost.active ?? true}
                  onChange={(e) => setEditingPost({ ...editingPost, active: e.target.checked })}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="w-1/2 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3.5 rounded-2xl text-white font-black text-xs shadow-md cursor-pointer"
                  style={{ backgroundColor: themePrimary }}
                >
                  حفظ ونشر المنشور
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
