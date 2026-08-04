import React, { useState } from 'react';
import { RestaurantSocialCard } from '../RestaurantSocialCard';
import { 
  Search, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2,
  UtensilsCrossed, 
  MapPin, 
  Calendar, 
  Star, 
  Send, 
  Flame, 
  Sparkles, 
  X, 
  CheckCircle2, 
  CreditCard, 
  Phone, 
  Clock, 
  Soup, 
  Salad, 
  Cake, 
  Coffee, 
  Bot,
  Smartphone,
  Banknote,
  Utensils,
  Users,
  QrCode,
  MessageSquare,
  Share2,
  Crown,
  Building2,
  Grid,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Check,
  Megaphone,
  Copy,
  Tag,
  Truck,
  Gift,
  Award,
  PackageCheck,
  Dices,
  Heart
} from 'lucide-react';
import { 
  Restaurant, 
  Category, 
  Dish, 
  Order, 
  OrderItem, 
  PaymentMethod, 
  Language, 
  Review,
  ChatMessage,
  Reservation,
  User
} from '../../types';
import { getTranslation } from '../../lib/translations';
import { formatPrice } from '../../lib/currencies';
import { sendOrderTelegramAlert, sendReservationTelegramAlert } from '../../lib/telegram';
import { DeliveryTrackerModal } from './DeliveryTrackerModal';
import { AnimatedStarRating } from '../AnimatedStarRating';
import { DiceGameWidget } from '../DiceGameWidget';
import { GooeySearchBar } from '../GooeySearchBar';
import { FavoriteButton } from '../FavoriteButton';

interface UserMenuProps {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
  currentLang: Language;
  currentCurrency?: string;
  selectedBranchId: string;
  onBranchChange: (branchId: string) => void;
  tableNumber: number;
  onTableNumberChange: (num: number) => void;
  onNewOrderSubmitted: (order: Order) => void;
  onNewReservationSubmitted?: (reservation: Reservation) => void;
  reviews: Review[];
  onAddReview: (review: Review) => void;
  currentUser?: User | null;
  allRestaurants?: Restaurant[];
  onSelectRestaurant?: (restaurant: Restaurant) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  restaurant,
  categories,
  dishes,
  currentLang,
  currentCurrency = 'ILS',
  selectedBranchId,
  onBranchChange,
  tableNumber,
  onTableNumberChange,
  onNewOrderSubmitted,
  onNewReservationSubmitted,
  reviews,
  onAddReview,
  currentUser,
  allRestaurants = [],
  onSelectRestaurant,
  onOpenAuth,
}) => {
  const primaryColor = restaurant.primaryColor || '#0b4f42';
  const categoryScrollRef = React.useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const handleCategoryScroll = () => {
    if (categoryScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        // RTL scroll handling support
        const currentScroll = Math.abs(scrollLeft);
        const progress = Math.min(100, Math.max(0, (currentScroll / maxScroll) * 100));
        setScrollProgress(progress);
      }
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setScrollProgress(val);
    if (categoryScrollRef.current) {
      const { scrollWidth, clientWidth } = categoryScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      // Depending on direction or standard scrollLeft
      const isRTL = document.documentElement.dir === 'rtl' || true;
      const targetScroll = (val / 100) * maxScroll;
      categoryScrollRef.current.scrollLeft = isRTL ? -targetScroll : targetScroll;
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 260;
      categoryScrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSpicy, setFilterSpicy] = useState<boolean>(false);
  const [filterVegetarian, setFilterVegetarian] = useState<boolean>(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState<boolean>(false);
  const [filterBestSeller, setFilterBestSeller] = useState<boolean>(false);

  // Favorites List State
  const [favoriteDishIds, setFavoriteDishIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('menuz_favorite_dishes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavoriteDish = (dishId: string) => {
    setFavoriteDishIds((prev) => {
      const updated = prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId];
      try {
        localStorage.setItem('menuz_favorite_dishes', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save favorites', e);
      }
      return updated;
    });
  };

  // Cart & Checkout
  const [cartItems, setCartItems] = useState<{ dish: Dish; quantity: number; notes?: string; selectedChoices?: string[] }[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('apple_pay');
  const [orderType, setOrderType] = useState<'table' | 'takeaway' | 'delivery'>('table');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [redeemLoyalty, setRedeemLoyalty] = useState<boolean>(false);
  const [customerLoyaltyPoints, setCustomerLoyaltyPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('menuz_loyalty_points');
      return saved ? parseInt(saved, 10) : 150; // Welcome 150 loyalty points
    } catch {
      return 150;
    }
  });
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [deliveryTrackerOpen, setDeliveryTrackerOpen] = useState<boolean>(false);
  const [socialCardModalOpen, setSocialCardModalOpen] = useState<boolean>(false);

  // Dish Customization Modal
  const [activeDish, setActiveDish] = useState<Dish | null>(null);
  const [dishQuantity, setDishQuantity] = useState<number>(1);
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [dishNotes, setDishNotes] = useState<string>('');

  // Advanced Table Reservation Modal State
  const [reservationModalOpen, setReservationModalOpen] = useState<boolean>(false);
  const [resDate, setResDate] = useState<string>('2026-07-28');
  const [resTime, setResTime] = useState<string>('19:30');
  const [resGuests, setResGuests] = useState<number>(4);
  const [resArea, setResArea] = useState<'all' | 'indoor' | 'outdoor' | 'family' | 'vip'>('all');
  const [selectedTableId, setSelectedTableId] = useState<string>('auto');
  const [manualTableSelect, setManualTableSelect] = useState<boolean>(false);
  const [resNotes, setResNotes] = useState<string>('');
  const [resCustomerName, setResCustomerName] = useState<string>('');
  const [resCustomerPhone, setResCustomerPhone] = useState<string>('');
  const [resStep, setResStep] = useState<'details' | 'confirmation'>('details');
  const [resTicketCode, setResTicketCode] = useState<string>('');
  const [resSubmitting, setResSubmitting] = useState<boolean>(false);

  // Mock Branch Floor Tables Inventory
  const branchTables = [
    { id: 'tbl_1', number: 1, name: 'طاولة #1 - واجهة البانوراما', capacity: 4, area: 'indoor', areaLabel: 'صالة داخلية', status: 'available', isVip: true },
    { id: 'tbl_2', number: 2, name: 'طاولة #2 - التراس الخارجي الملكي', capacity: 2, area: 'outdoor', areaLabel: 'تراس خارجي', status: 'available', isVip: false },
    { id: 'tbl_3', number: 3, name: 'طاولة #3 - الجناح العائلي الكبير', capacity: 8, area: 'family', areaLabel: 'قسم العائلات', status: 'available', isVip: false },
    { id: 'tbl_4', number: 4, name: 'طاولة #4 - الجلسة الرئيسية', capacity: 4, area: 'indoor', areaLabel: 'صالة داخلية', status: 'available', isVip: false },
    { id: 'tbl_5', number: 5, name: 'طاولة #5 - كابينة VIP الخصوصية', capacity: 6, area: 'vip', areaLabel: 'جناح VIP', status: 'available', isVip: true },
    { id: 'tbl_6', number: 6, name: 'طاولة #6 - ركن الحديقة الخارجي', capacity: 4, area: 'outdoor', areaLabel: 'تراس خارجي', status: 'busy', isVip: false },
    { id: 'tbl_7', number: 7, name: 'طاولة #7 - الركن الهادئ المزدوج', capacity: 2, area: 'indoor', areaLabel: 'صالة داخلية', status: 'available', isVip: false },
    { id: 'tbl_8', number: 8, name: 'طاولة #8 - جناح المناسبات الاحتفالي', capacity: 10, area: 'family', areaLabel: 'قسم العائلات', status: 'available', isVip: true },
  ];

  // Mock Available Time Slots with Live Occupancy Status
  const availableTimeSlots = [
    { time: '12:30', label: '12:30 ظهراً', status: 'available', badge: 'متاحة ✨', occupancy: '20%' },
    { time: '14:00', label: '02:00 عصراً', status: 'available', badge: 'متاحة ✨', occupancy: '35%' },
    { time: '16:30', label: '04:30 مساءً', status: 'available', badge: 'متاحة ✨', occupancy: '40%' },
    { time: '18:00', label: '06:00 مساءً', status: 'busy', badge: 'مزدحمة ⚠️', occupancy: '80%' },
    { time: '19:30', label: '07:30 مساءً', status: 'available', badge: 'الأكثر طلباً ⭐', occupancy: '65%' },
    { time: '21:00', label: '09:00 مساءً', status: 'busy', badge: 'مزدحمة ⚠️', occupancy: '85%' },
    { time: '22:30', label: '10:30 مساءً', status: 'available', badge: 'متاحة ✨', occupancy: '30%' },
  ];

  // Dynamic Real-time Calculations
  const filteredBranchTables = branchTables.filter(t => {
    if (resArea !== 'all' && t.area !== resArea) return false;
    if (t.capacity < resGuests) return false;
    return true;
  });

  const availableTablesCount = filteredBranchTables.filter(t => t.status === 'available').length;

  // Reviews Modal
  const [reviewsModalOpen, setReviewsModalOpen] = useState<boolean>(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');

  // Nerd Dice Game Modal & Discount State
  const [diceGameModalOpen, setDiceGameModalOpen] = useState<boolean>(false);
  const [diceDiscountAmount, setDiceDiscountAmount] = useState<number>(0);

  // AI Live Chat Assistant Widget
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c_1',
      sender: 'ai',
      message: 'أهلاً بك في مطعم القصر! كيف يمكنني مساعدتك في اختيار وجبتك أو حجز طاولتك اليوم؟ 🍽️',
      timestamp: 'الآن'
    }
  ]);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLang, key);

  const currentBranch = restaurant.branches.find(b => b.id === selectedBranchId) || restaurant.branches[0];

  // Map category icon string to Lucide component
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return Flame;
      case 'Soup': return Soup;
      case 'Salad': return Salad;
      case 'Cake': return Cake;
      case 'Coffee': return Coffee;
      default: return UtensilsCrossed;
    }
  };

  // Filter Dishes
  const filteredDishes = dishes.filter((d) => {
    if (!d.available) return false;
    if (selectedCategory === 'bestsellers' && !d.isBestSeller) return false;
    if (selectedCategory === 'chef_specials' && !d.isChefSpecial) return false;
    if (selectedCategory === 'favorites' && !favoriteDishIds.includes(d.id)) return false;
    if (selectedCategory !== 'all' && selectedCategory !== 'bestsellers' && selectedCategory !== 'chef_specials' && selectedCategory !== 'favorites' && d.categoryId !== selectedCategory) return false;
    
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q) || (d.nameEn && d.nameEn.toLowerCase().includes(q));
      const matchDesc = d.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }

    // Tags Filters
    if (filterSpicy && !d.isSpicy) return false;
    if (filterVegetarian && !d.isVegetarian) return false;
    if (filterGlutenFree && !d.isGlutenFree) return false;
    if (filterBestSeller && !d.isBestSeller) return false;

    return true;
  });

  // Calculate Cart Subtotals, Delivery & Loyalty Discounts
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.dish.price * item.quantity), 0);
  const cartTax = cartSubtotal * 0.15;
  
  // Delivery Fee calculation
  const deliveryFee = orderType === 'delivery' ? (restaurant.defaultDeliveryFee || 10) : 0;
  
  // Loyalty Points calculations
  const pointsRate = restaurant.loyaltyPointsPerCurrency || 1;
  const redeemRate = restaurant.loyaltyRedeemRate || 10; // 10 points = 1 currency
  const pointsEarnedOnOrder = Math.floor(cartSubtotal * pointsRate);
  const maxPossibleDiscount = Math.floor(customerLoyaltyPoints / redeemRate);
  const loyaltyDiscount = redeemLoyalty ? Math.min(cartSubtotal, maxPossibleDiscount) : 0;
  const pointsRedeemedOnOrder = redeemLoyalty ? Math.min(customerLoyaltyPoints, loyaltyDiscount * redeemRate) : 0;

  const cartTotal = Math.max(0, cartSubtotal + cartTax + deliveryFee - loyaltyDiscount - diceDiscountAmount);

  // Handlers
  const handleOpenDishModal = (dish: Dish) => {
    setActiveDish(dish);
    setDishQuantity(1);
    setSelectedChoices([]);
    setDishNotes('');
  };

  const handleAddToCart = () => {
    if (!activeDish) return;
    setCartItems(prev => [
      ...prev,
      {
        dish: activeDish,
        quantity: dishQuantity,
        notes: dishNotes,
        selectedChoices: selectedChoices
      }
    ]);
    setActiveDish(null);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    const items: OrderItem[] = cartItems.map(item => ({
      dishId: item.dish.id,
      dishName: currentLang === 'en' ? item.dish.nameEn : item.dish.name,
      quantity: item.quantity,
      unitPrice: item.dish.price,
      totalPrice: item.dish.price * item.quantity,
      selectedOptions: item.selectedChoices,
      notes: item.notes
    }));

    const newOrderNumber = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: newOrderNumber,
      branchId: currentBranch.id,
      branchName: currentBranch.name,
      tableNumber: orderType === 'table' ? tableNumber : undefined,
      customerName: customerName || 'عميل المنيو',
      customerPhone: customerPhone || '0500000000',
      items: items,
      subtotal: cartSubtotal,
      tax: cartTax,
      deliveryFee: deliveryFee > 0 ? deliveryFee : undefined,
      loyaltyDiscountAmount: loyaltyDiscount > 0 ? loyaltyDiscount : undefined,
      loyaltyPointsEarned: pointsEarnedOnOrder,
      loyaltyPointsRedeemed: pointsRedeemedOnOrder > 0 ? pointsRedeemedOnOrder : undefined,
      totalAmount: cartTotal,
      status: 'new',
      paymentMethod: paymentMethod,
      paymentStatus: 'paid',
      type: orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      deliveryNotes: orderType === 'delivery' ? deliveryNotes : undefined,
      createdAt: 'الآن'
    };

    // Update Local Loyalty Points
    const updatedLoyaltyPoints = customerLoyaltyPoints - pointsRedeemedOnOrder + pointsEarnedOnOrder;
    setCustomerLoyaltyPoints(updatedLoyaltyPoints);
    try {
      localStorage.setItem('menuz_loyalty_points', updatedLoyaltyPoints.toString());
    } catch {}

    onNewOrderSubmitted(newOrder);
    setActiveOrder(newOrder);
    if (orderType === 'delivery') {
      setDeliveryTrackerOpen(true);
    }
    setCheckoutStep('success');
    setCartItems([]);

    // Send instant Telegram alert to restaurant owner & bot
    sendOrderTelegramAlert(newOrder, restaurant.name);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResSubmitting(true);
    setTimeout(() => {
      const ticketCode = `MENUZ-${Math.floor(1000 + Math.random() * 9000)}`;
      setResTicketCode(ticketCode);
      setResSubmitting(false);
      setResStep('confirmation');

      const newReservationData = {
        id: `res_${Date.now()}`,
        customerName: resCustomerName || 'عميل المنيو',
        customerPhone: resCustomerPhone || '0590000000',
        guestsCount: resGuests,
        date: resDate || 'اليوم',
        time: resTime || '20:00',
        status: 'pending' as const,
        branchName: currentBranch.name,
        notes: resNotes || ''
      };

      if (onNewReservationSubmitted) {
        onNewReservationSubmitted(newReservationData);
      }

      // Dispatch Telegram Alert for Table Reservation
      sendReservationTelegramAlert(newReservationData, restaurant.name);
    }, 600);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddReview({
      id: `rev_${Date.now()}`,
      customerName: 'ضيف المنيو',
      rating: newRating,
      comment: newComment,
      date: 'الآن'
    });

    setNewComment('');
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const userMsg: ChatMessage = {
      id: `c_${Date.now()}`,
      sender: 'user',
      message: userText,
      timestamp: 'الآن'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setChatLoading(true);

    try {
      // Send message to Gemini server-side route
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, lang: currentLang })
      });
      const data = await res.json();
      
      const botMsg: ChatMessage = {
        id: `c_${Date.now() + 1}`,
        sender: 'ai',
        message: data.reply || 'يسعدنا خدمتك دائماً! يمكنك استعراض وجباتنا وإضافتها مباشرة إلى السلة.',
        timestamp: 'الآن'
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch {
      const botMsg: ChatMessage = {
        id: `c_${Date.now() + 1}`,
        sender: 'ai',
        message: 'أهلاً بك! يمكنك تصفح وجباتنا الفاخرة وإرسال الطلب مباشرة إلى المطبخ مع تحديد طاولة طعامك.',
        timestamp: 'الآن'
      };
      setChatMessages(prev => [...prev, botMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Determine font family selected by restaurant owner (IBM Plex Sans Arabic, Cairo, or Tajawal)
  const getSelectedFontFamily = (fontName?: string) => {
    if (fontName === 'Cairo' || fontName === 'كايرو') return "'Cairo', sans-serif";
    if (fontName === 'Tajawal' || fontName === 'تجوال') return "'Tajawal', sans-serif";
    return "'IBM Plex Sans Arabic', sans-serif";
  };

  return (
    <div 
      className="pb-24 font-bold" 
      style={{ fontFamily: getSelectedFontFamily(restaurant.fontFamily) }}
    >
      
      {/* PUBLIC EXPLORER / NON-LOGGED-IN NOTICE BANNER */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-b border-amber-500/30 py-3 px-4 text-slate-800 dark:text-amber-100 text-xs sm:text-sm font-bold shadow-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-right">
              <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
              <span>
                تستعرض الآن قائمة المنيو العامة لجميع المطاعم المسجلة في منصتنا. لإدارة لوحة تحكم مطعمك وتعديل الوجبات والأسعار، يلزم تسجيل الدخول.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs cursor-pointer shadow-sm transition-all"
              >
                تسجيل الدخول 🔑
              </button>
              <button
                onClick={() => onOpenAuth && onOpenAuth('signup')}
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs cursor-pointer shadow-sm transition-all"
              >
                إنشاء حساب مطعم 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESTAURANT HERO HEADER */}
      <div 
        className="relative bg-cover bg-center py-16 px-4 sm:px-6 lg:px-8 text-white shadow-xl border-b border-black/20"
        style={{ backgroundImage: `linear-gradient(to bottom, ${primaryColor}ee, ${primaryColor}f8), url(${restaurant.heroBanner || restaurant.coverImage})` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-right">
            <img 
              src={restaurant.logo} 
              alt={restaurant.name} 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white/30 shadow-2xl" 
            />
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
                <span>{restaurant.name}</span>
                <span className="text-xs bg-white/20 text-white backdrop-blur-md px-2.5 py-0.5 rounded-full font-bold">
                  منيو رقمي موثق
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                {restaurant.tagline}
              </p>

              {/* Social Media & Contact Icon Bar (Icons only with profile URL in background) */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {restaurant.socialLinks?.instagram && (
                  <a
                    href={restaurant.socialLinks.instagram.startsWith('http') ? restaurant.socialLinks.instagram : `https://instagram.com/${restaurant.socialLinks.instagram.replace('@','')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                    title="Instagram"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}

                {restaurant.socialLinks?.whatsapp && (
                  <a
                    href={restaurant.socialLinks.whatsapp.startsWith('http') ? restaurant.socialLinks.whatsapp : `https://wa.me/${restaurant.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                    title="WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                    </svg>
                  </a>
                )}

                {restaurant.socialLinks?.facebook && (
                  <a
                    href={restaurant.socialLinks.facebook.startsWith('http') ? restaurant.socialLinks.facebook : `https://facebook.com/${restaurant.socialLinks.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md"
                    title="Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}

                {restaurant.socialLinks?.tiktok && (
                  <a
                    href={restaurant.socialLinks.tiktok.startsWith('http') ? restaurant.socialLinks.tiktok : `https://tiktok.com/@${restaurant.socialLinks.tiktok.replace('@','')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-black hover:bg-slate-900 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-md border border-white/20"
                    title="TikTok"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.28 2.57.02.82.41 1.61 1.05 2.13.78.63 1.83.84 2.81.6 1.01-.22 1.86-.96 2.19-1.93.18-.57.24-1.18.23-1.78l.02-15.65z"/>
                    </svg>
                  </a>
                )}

                {restaurant.socialLinks?.snapchat && (
                  <a
                    href={restaurant.socialLinks.snapchat.startsWith('http') ? restaurant.socialLinks.snapchat : `https://snapchat.com/add/${restaurant.socialLinks.snapchat.replace('@','')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-amber-400 hover:bg-amber-300 flex items-center justify-center text-slate-950 hover:scale-110 transition-transform shadow-md"
                    title="Snapchat"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.013 2.1c-2.73 0-4.8 1.95-4.8 4.65 0 1.2.45 2.1.9 2.85-.3.15-.6.3-.9.3-.45 0-.75-.3-.9-.75-.15-.45-.45-.6-.75-.6s-.6.15-.75.45c-.3.6-.15 1.5.45 2.1.45.45.9.6 1.35.6.3 0 .6-.15.9-.3.15.75.6 1.5 1.2 2.1-1.35.6-3 1.5-3.6 2.7-.3.6-.15 1.35.45 1.65.6.3 1.5.15 2.25-.3 1.05-.6 2.1-1.05 3.3-1.05s2.25.45 3.3 1.05c.75.45 1.65.6 2.25.3.6-.3.75-1.05.45-1.65-.6-1.2-2.25-2.1-3.6-2.7.6-.6 1.05-1.35 1.2-2.1.3.15.6.3.9.3.45 0 .9-.15 1.35-.6.6-.6.75-1.5.45-2.1-.15-.3-.45-.45-.75-.45s-.6.15-.75.6c-.15.45-.45.75-.9.75-.3 0-.6-.15-.9-.3.45-.75.9-1.65.9-2.85 0-2.7-2.07-4.65-4.8-4.65z"/>
                    </svg>
                  </a>
                )}

                {restaurant.phone && (
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md backdrop-blur-md"
                    title={`اتصل بنا: ${restaurant.phone}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}

                {restaurant.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                    title={`الموقع: ${restaurant.address}`}
                  >
                    <MapPin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {restaurant.loyaltyEnabled !== false && (
              <div 
                className="px-3.5 py-2.5 rounded-2xl bg-amber-500/20 text-amber-100 border border-amber-400/30 backdrop-blur-md font-extrabold text-xs flex items-center gap-2 shadow-sm"
                title="نقاط الولاء المكتسبة"
              >
                <Award className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>رصيد نقاطك: <strong className="text-amber-300 font-black">{customerLoyaltyPoints}</strong> نقطة ⭐</span>
              </div>
            )}

            <button
              onClick={() => setReservationModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-black text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Calendar className="w-4 h-4 text-orange-600" />
              <span>{t('reserveTableBtn')}</span>
            </button>

            <button
              onClick={() => setReviewsModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md font-bold text-xs border border-white/30 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>التقييمات ({reviews.length})</span>
            </button>

            <button
              onClick={() => setSocialCardModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer transition-all border border-pink-400/40"
              title="تابع صفحات المطاعم وحسابات التواصل"
            >
              <Share2 className="w-4 h-4 text-amber-200" />
              <span>تابع حساباتنا 📲</span>
            </button>

            {/* Nerd Dice Game Feature Trigger Button */}
            {restaurant.nerdDiceGameEnabled !== false && (
              <button
                onClick={() => setDiceGameModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs shadow-lg border border-orange-300/40 flex items-center gap-1.5 cursor-pointer transition-all animate-pulse"
              >
                <Dices className="w-4 h-4 text-white" />
                <span>لعبة حجار نيرد 🎲 {diceDiscountAmount > 0 ? `(خصم ${diceDiscountAmount} ${currentCurrency})` : ''}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TOP CONFIG BAR (Branch & Table Selector & Registered Restaurant Switcher) */}
      <div className="sticky top-20 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Registered Restaurant Switcher */}
            {allRestaurants && allRestaurants.length > 0 && (
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
                <Crown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">تصفح المطاعم المسجلة:</span>
                <select
                  value={restaurant.id}
                  onChange={(e) => {
                    const targetRest = allRestaurants.find(r => r.id === e.target.value);
                    if (targetRest && onSelectRestaurant) {
                      onSelectRestaurant(targetRest);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-xs font-black text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {allRestaurants.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Branch Switcher */}
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-bold text-slate-500">{t('selectBranch')}:</span>
              <select
                value={selectedBranchId}
                onChange={(e) => onBranchChange(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {restaurant.branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Number Badge */}
          <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/60 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-orange-900 text-orange-700 dark:text-orange-400 text-xs font-bold">
            <Utensils className="w-4 h-4 text-orange-600" />
            <span>{t('tableNo')}:</span>
            <input
              type="number"
              min={1}
              max={currentBranch.tablesCount || 50}
              value={tableNumber}
              onChange={(e) => onTableNumberChange(Number(e.target.value))}
              className="w-12 text-center bg-white dark:bg-slate-800 border border-orange-300 rounded-lg text-xs font-bold py-0.5"
            />
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* PROMOTIONAL POSTS & OFFERS SECTION */}
        {restaurant.posts && restaurant.posts.filter(p => p.active !== false).length > 0 && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-2xl text-white shadow-md" style={{ backgroundColor: primaryColor }}>
                  <Megaphone className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    المنشورات والعروض الترويجية الحصرية 🔥
                  </h3>
                  <p className="text-xs text-slate-400">تابع أحدث العروض والخصومات المقدمة من المطعم مباشرة</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.posts.filter(p => p.active !== false).map((post) => (
                <div key={post.id} className="bg-slate-50 dark:bg-slate-800/80 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700/60 shadow-sm flex flex-col justify-between group">
                  <div>
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      {post.badge && (
                        <span className="absolute top-3 right-3 bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-lg">
                          {post.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-5 space-y-2">
                      <h4 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                        {currentLang === 'en' && post.titleEn ? post.titleEn : post.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {currentLang === 'en' && post.contentEn ? post.contentEn : post.content}
                      </p>

                      {post.discountCode && (
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/50 rounded-2xl border border-orange-200 dark:border-orange-800 flex items-center justify-between text-xs">
                          <span className="font-bold text-orange-800 dark:text-orange-300">كود الخصم:</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-orange-600 bg-white dark:bg-slate-900 px-3 py-1 rounded-xl border border-orange-300">
                              {post.discountCode}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(post.discountCode || '');
                                alert(`تم نسخ كود الخصم (${post.discountCode}) بنجاح!`);
                              }}
                              className="text-[10px] bg-orange-600 hover:bg-orange-700 text-white font-bold px-2.5 py-1 rounded-lg cursor-pointer"
                            >
                              نسخ
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* SEARCH & DIETARY TAG FILTERS */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          
          {/* Search Bar with Gooey Orb Effect */}
          <div className="py-2 flex justify-center">
            <GooeySearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={t('searchDishes')}
            />
          </div>

          {/* Dietary Filter Pills (Pure Icons) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold pt-1">
            <span className="text-slate-400 text-[11px] ml-2">تصفية حسب:</span>

            <button
              onClick={() => setFilterSpicy(!filterSpicy)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                filterSpicy ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>{t('spicy')}</span>
            </button>

            <button
              onClick={() => setFilterVegetarian(!filterVegetarian)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                filterVegetarian ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Salad className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('vegetarian')}</span>
            </button>

            <button
              onClick={() => setFilterGlutenFree(!filterGlutenFree)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                filterGlutenFree ? 'bg-amber-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('glutenFree')}</span>
            </button>

            <button
              onClick={() => setFilterBestSeller(!filterBestSeller)}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                filterBestSeller ? 'bg-orange-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{t('bestSeller')}</span>
            </button>
          </div>

        </div>

        {/* CATEGORIES HORIZONTAL SLIDER BAR WITH ANIMATED SCROLL CONTROLS */}
        <div className="relative group bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          {/* Header indicator & Scroll buttons bar */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>تصفح الأقسام والمميزات (مرر للجانب ⇄)</span>
            </span>

            {/* Scroll Control Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollCategories('right')}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all shadow-sm cursor-pointer active:scale-95"
                title="التمرير لليمين"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollCategories('left')}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all shadow-sm cursor-pointer active:scale-95"
                title="التمرير لليسار"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Container with Custom Slider Styling */}
          <div 
            ref={categoryScrollRef}
            onScroll={handleCategoryScroll}
            className="flex items-center gap-3 overflow-x-auto category-slider-scrollbar pb-3 pt-1 scroll-smooth rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-2 border border-slate-200/80 dark:border-slate-700/80"
          >
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              style={selectedCategory === 'all' ? { backgroundColor: primaryColor } : undefined}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>{t('allCategories')}</span>
            </button>

            {/* Quick Filter: Best Sellers */}
            <button
              onClick={() => setSelectedCategory('bestsellers')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                selectedCategory === 'bestsellers'
                  ? 'bg-amber-500 text-white shadow-lg scale-105'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              }`}
            >
              <Flame className="w-4 h-4 text-orange-500 fill-amber-400" />
              <span>الأكثر مبيعاً 🔥</span>
            </button>

            {/* Quick Filter: Chef Specials */}
            <button
              onClick={() => setSelectedCategory('chef_specials')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                selectedCategory === 'chef_specials'
                  ? 'bg-emerald-600 text-white shadow-lg scale-105'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>توصيات الشيف 👨‍🍳</span>
            </button>

            {/* Quick Filter: Favorites */}
            <button
              onClick={() => setSelectedCategory('favorites')}
              className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                selectedCategory === 'favorites'
                  ? 'bg-rose-600 text-white shadow-lg scale-105'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>قائمة أحببته ❤️ ({favoriteDishIds.length})</span>
            </button>

            {categories.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? 'text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  style={selectedCategory === cat.id ? { backgroundColor: primaryColor } : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span>{currentLang === 'en' ? cat.nameEn : cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Slider Bar Controller */}
          <div className="pt-2 px-1 flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
              ↔️ شريط تمرير الأقسام
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={scrollProgress}
              onChange={handleSliderChange}
              className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-600 transition-all"
              title="سحب للتمرير بين جميع الأقسام"
            />
          </div>
        </div>

        {/* DISHES CARDS GRID */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <UtensilsCrossed className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">لا توجد أطباق تطابق بحثك</h3>
            <p className="text-xs text-slate-400">جرب تغيير قسم الطعام أو إلغاء تصفية البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <div 
                key={dish.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Dish Image Header */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />

                    {/* Floating Favorite Button Top-Left */}
                    <div className="absolute top-3 left-3 z-10 scale-90">
                      <FavoriteButton
                        id={`fav-btn-dish-${dish.id}`}
                        isFavorite={favoriteDishIds.includes(dish.id)}
                        onToggle={() => toggleFavoriteDish(dish.id)}
                        option1Text="أحببته"
                        option2Text="في المفضلة ❤️"
                      />
                    </div>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 right-3 flex flex-wrap gap-1">
                      {dish.isBestSeller && (
                        <span className="bg-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-200" />
                          <span>{t('bestSeller')}</span>
                        </span>
                      )}
                      {dish.isChefSpecial && (
                        <span className="bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>{t('chefSpecial')}</span>
                        </span>
                      )}
                    </div>

                    {/* Calories & Time */}
                    <div className="absolute bottom-3 right-3 left-3 flex justify-between items-center text-[11px] font-bold text-white bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-xl">
                      <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" /> {dish.calories || 350} سعرة</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-orange-400" /> {dish.preparationTimeMinutes} دقيقة</span>
                    </div>
                  </div>

                  {/* Dish Body Details */}
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
                      {currentLang === 'en' ? dish.nameEn : dish.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {currentLang === 'en' ? dish.descriptionEn : dish.description}
                    </p>
                  </div>
                </div>

                {/* Price & Add Button Footer */}
                <div className="p-5 pt-0 space-y-3 border-t border-slate-100 dark:border-slate-800/80 mt-2">
                  <div className="pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-900 dark:text-white">
                        {formatPrice(dish.price, currentCurrency)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenDishModal(dish)}
                      className="px-4 py-2.5 rounded-2xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t('addToCart')}</span>
                    </button>
                  </div>

                  {/* Dish Social Share Bar (شريط مشاركة نسخ رابط ومواقع السوشيال ميديا) */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                    <span className="font-bold text-[10px] flex items-center gap-1">
                      <Share2 className="w-3 h-3 text-orange-500" /> مشاركة الطبق:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {/* Copy Link Button */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert(`تم نسخ رابط طبق (${dish.name}) بنجاح! 📋`);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="نسخ الرابط"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* WhatsApp Share */}
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`جرب طبق (${dish.name}) الرائع من ${restaurant.name}! ${window.location.href}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"
                        title="مشاركة على الواتساب"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                        </svg>
                      </a>

                      {/* Facebook Share */}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                        title="مشاركة على فيسبوك"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>

                      {/* Telegram Share */}
                      <a
                        href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`طبق (${dish.name}) المميز في ${restaurant.name}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 hover:bg-sky-500 hover:text-white transition-colors cursor-pointer"
                        title="مشاركة على تلجرام"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* INTERACTIVE BRANCH LOCATIONS MAP SECTION */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <span>فروع مطعمنا والخريطة التفاعلية</span>
            </h3>
            <span className="text-xs text-slate-500">اختر الفرع الأقرب إليك</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Branches List */}
            <div className="lg:col-span-5 space-y-4">
              {restaurant.branches.map((br) => (
                <div 
                  key={br.id}
                  onClick={() => onBranchChange(br.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedBranchId === br.id
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{br.name}</h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                      مفتوح حتى {br.openingHours}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{br.address}</p>
                  <div className="flex items-center justify-between text-xs font-bold text-orange-600">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {br.phone}</span>
                    <span>خط العرض: {br.lat}, الطول: {br.lng}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Interactive Google Maps Display */}
            <div className="lg:col-span-7 bg-slate-900 rounded-3xl h-72 sm:h-96 relative overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <iframe
                title={`Google Maps ${currentBranch.name}`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${currentBranch.lat},${currentBranch.lng}&z=15&output=embed`}
                className="w-full h-full rounded-3xl"
              />

              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${currentBranch.lat},${currentBranch.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-900/90 hover:bg-slate-950 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg border border-slate-700 flex items-center gap-1.5 backdrop-blur-md transition-all"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <span>فتح في تطبيق خرائط جوجل</span>
                </a>
              </div>

              <div className="absolute bottom-4 right-4 z-10 bg-slate-950/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs text-slate-300 border border-slate-800 shadow-lg">
                <span className="font-bold text-amber-400 block mb-0.5">الفرع المحدد:</span>
                <span>{currentBranch.name} • {currentBranch.address}</span>
              </div>
            </div>

          </div>
        </div>

        {/* RESTAURANT FOOTER WITH CONDITIONAL "POWERED BY MENU Z" BRANDING */}
        <footer className="mt-16 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 space-y-3">
          <p>© {new Date().getFullYear()} {restaurant.name} - جميع الحقوق محفوظة</p>
          {restaurant.showPoweredByBranding && (
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
              <span>تم إنشاء الموقع بواسطة</span>
              <a href="https://menuz.app" target="_blank" rel="noreferrer" className="text-orange-600 dark:text-orange-400 font-black hover:underline flex items-center gap-1">
                <span>menuz</span>
                <span className="text-[10px]">🚀</span>
              </a>
            </div>
          )}
        </footer>

      </div>

      {/* DISH OPTIONS MODAL */}
      {activeDish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4">
            
            <div className="relative h-56 bg-slate-900">
              <img src={activeDish.image} alt={activeDish.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setActiveDish(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="absolute top-4 right-4 z-10 scale-90">
                <FavoriteButton
                  id={`fav-btn-modal-${activeDish.id}`}
                  isFavorite={favoriteDishIds.includes(activeDish.id)}
                  onToggle={() => toggleFavoriteDish(activeDish.id)}
                  option1Text="أحببته"
                  option2Text="في المفضلة ❤️"
                />
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {currentLang === 'en' ? activeDish.nameEn : activeDish.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {currentLang === 'en' ? activeDish.descriptionEn : activeDish.description}
                </p>
              </div>

              {/* Options choices */}
              {activeDish.options && activeDish.options.length > 0 && (
                <div className="space-y-3 pt-2">
                  {activeDish.options.map((opt) => (
                    <div key={opt.id} className="space-y-2">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {opt.title}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {opt.choices.map((ch) => {
                          const isSelected = selectedChoices.includes(ch.name);
                          return (
                            <button
                              key={ch.id}
                              type="button"
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedChoices(selectedChoices.filter(c => c !== ch.name));
                                } else {
                                  setSelectedChoices([...selectedChoices, ch.name]);
                                }
                              }}
                              className={`p-3 rounded-xl text-xs font-bold border transition-all text-right flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600'
                                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span>{ch.name}</span>
                              {ch.price > 0 && <span className="text-[10px] text-slate-400">+{formatPrice(ch.price, currentCurrency)}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ملاحظات خاصة على الوجبة
                </label>
                <input
                  type="text"
                  value={dishNotes}
                  onChange={(e) => setDishNotes(e.target.value)}
                  placeholder="مثال: بدون بصل، زيادة صوص الحمر..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Quantity Counter & Add button */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setDishQuantity(Math.max(1, dishQuantity - 1))}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-black px-2">{dishQuantity}</span>
                  <button
                    onClick={() => setDishQuantity(dishQuantity + 1)}
                    className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span>إضافة للسلة ({formatPrice(activeDish.price * dishQuantity, currentCurrency)})</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* FLOATING CART BAR BUTTON */}
      {cartItems.length > 0 && !cartOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-1/2 translate-x-1/2 z-40 w-full max-w-md px-4">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full py-4 px-6 rounded-2xl text-white font-black text-sm shadow-2xl flex items-center justify-between cursor-pointer transform hover:scale-105 transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold">
                {cartItems.reduce((a, b) => a + b.quantity, 0)}
              </div>
              <span>{t('viewCart')}</span>
            </div>
            <span className="text-base">{formatPrice(cartTotal, currentCurrency)}</span>
          </button>
        </div>
      )}

      {/* CART & INTEGRATED PAYMENT DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-6 text-white flex items-center justify-between border-b border-white/10" style={{ backgroundColor: primaryColor }}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-black">{t('cartTitle')}</h3>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {checkoutStep === 'success' ? (
                /* Order Success View */
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                    {t('orderSuccess')}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    رقم الطلب: <span className="font-bold text-orange-600">{activeOrder?.orderNumber}</span>
                    <br />
                    {t('orderSuccessDesc')}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl text-xs space-y-2 text-right border">
                    <div className="flex justify-between font-bold">
                      <span>طاولة رقم:</span>
                      <span className="text-orange-600">{activeOrder?.tableNumber}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>طريقة الدفع:</span>
                      <span className="uppercase text-emerald-600">{activeOrder?.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>الإجمالي المدفوع:</span>
                      <span>{formatPrice(activeOrder?.totalAmount || 0, currentCurrency)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutStep('cart');
                    }}
                    className="w-full py-3.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-md cursor-pointer"
                  >
                    العودة للمنيو الرئيسي
                  </button>
                </div>
              ) : checkoutStep === 'cart' ? (
                /* Cart Items List */
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.dish.name}</h4>
                        <span className="text-xs text-orange-600 font-bold">{formatPrice(item.dish.price * item.quantity, currentCurrency)}</span>
                        {item.notes && <p className="text-[11px] text-slate-400">ملاحظة: {item.notes}</p>}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              const copy = [...cartItems];
                              copy[idx].quantity -= 1;
                              setCartItems(copy);
                            } else {
                              setCartItems(cartItems.filter((_, i) => i !== idx));
                            }
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => {
                            const copy = [...cartItems];
                            copy[idx].quantity += 1;
                            setCartItems(copy);
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center cursor-pointer"
                        >
                          +
                        </button>
                        <button
                          onClick={() => setCartItems(cartItems.filter((_, i) => i !== idx))}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors cursor-pointer mr-1"
                          title="حذف من السلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Payment Details Step */
                <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
                  
                  {/* ORDER TYPE SELECTION (Table / Takeaway / Delivery) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">اختر نوع الطلب 🛵</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('table')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          orderType === 'table' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 font-black shadow-xs' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Utensils className="w-4 h-4" />
                        <span>طلب طاولة ({tableNumber})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderType('takeaway')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          orderType === 'takeaway' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 font-black shadow-xs' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>استلام سفري</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderType('delivery')}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                          orderType === 'delivery' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 font-black shadow-xs' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Truck className="w-4 h-4" />
                        <span>توصيل دلفري 🛵</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">{t('customerName')}</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="عبدالله محمد"
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">{t('customerPhone')}</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0501234567"
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                    />
                  </div>

                  {/* DELIVERY DETAILS INPUT (When orderType === 'delivery') */}
                  {orderType === 'delivery' && (
                    <div className="p-3.5 bg-orange-500/10 border border-orange-500/30 rounded-2xl space-y-3 animate-in fade-in">
                      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-xs font-black">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>عنوان التوصيل (رسوم التوصيل: {formatPrice(deliveryFee, currentCurrency)})</span>
                      </div>
                      
                      <div>
                        <input
                          type="text"
                          required={orderType === 'delivery'}
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="المدينة، الحي، اسم الشارع، البناية، رقم الشقة..."
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="تعليمات إضافية للسائق (مثال: يرجي الاتصال عند الوصول)..."
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
                        />
                      </div>
                    </div>
                  )}

                  {/* LOYALTY POINTS REDEMPTION WIDGET */}
                  {restaurant.loyaltyEnabled !== false && customerLoyaltyPoints > 0 && (
                    <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-black">
                          <Gift className="w-4 h-4 shrink-0" />
                          <span>استبدال نقاط الولاء (رصيدك: {customerLoyaltyPoints} نقطة)</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={redeemLoyalty}
                            onChange={(e) => setRedeemLoyalty(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                        </label>
                      </div>

                      {redeemLoyalty && (
                        <div className="text-[11px] text-amber-700 dark:text-amber-300 font-bold bg-amber-500/10 p-2 rounded-xl">
                          ✨ تم تطبيق خصم بقيمة <strong>{formatPrice(loyaltyDiscount, currentCurrency)}</strong> مقابل استبدال {pointsRedeemedOnOrder} نقطة!
                        </div>
                      )}
                    </div>
                  )}

                  {/* Payment Gateway Options (Pure Lucide Icons) */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold">{t('selectPayment')}</label>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('apple_pay')}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                          paymentMethod === 'apple_pay' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-slate-800 dark:text-slate-200" />
                        <span>Apple Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mada')}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                          paymentMethod === 'mada' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <span>مدى / Mada</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('stc_pay')}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                          paymentMethod === 'stc_pay' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-purple-600" />
                        <span>STC Pay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cash')}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
                          paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600' : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Banknote className="w-4 h-4 text-emerald-600" />
                        <span>{t('payCash')}</span>
                      </button>
                    </div>
                  </div>
                </form>
              )}

            </div>

            {/* Drawer Footer Price Summary */}
            {checkoutStep !== 'success' && cartItems.length > 0 && (
              <div className="p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>{t('subtotal')}:</span>
                    <span>{formatPrice(cartSubtotal, currentCurrency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('tax')}:</span>
                    <span>{formatPrice(cartTax, currentCurrency)}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between text-orange-600 font-bold">
                      <span>رسوم التوصيل 🛵:</span>
                      <span>{formatPrice(deliveryFee, currentCurrency)}</span>
                    </div>
                  )}
                  {loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>خصم نقاط الولاء ⭐:</span>
                      <span>-{formatPrice(loyaltyDiscount, currentCurrency)}</span>
                    </div>
                  )}
                  {diceDiscountAmount > 0 && (
                    <div className="flex justify-between text-amber-600 font-bold">
                      <span>خصم لعبة حجار نيرد 🎲:</span>
                      <span>-{formatPrice(diceDiscountAmount, currentCurrency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white pt-1 border-t">
                    <span>{t('total')}:</span>
                    <span className="text-orange-600">{formatPrice(cartTotal, currentCurrency)}</span>
                  </div>
                  {restaurant.loyaltyEnabled !== false && (
                    <div className="text-[10px] text-slate-400 font-bold text-center pt-1">
                      🎁 ستحصل على +{pointsEarnedOnOrder} نقطة ولاء عند إتمام هذا الطلب!
                    </div>
                  )}
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('details')}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md cursor-pointer hover:opacity-90 transition-all"
                    style={{ backgroundColor: primaryColor }}
                  >
                    متابعة لتفاصيل الدفع والطلب
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="checkout-form"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md cursor-pointer hover:opacity-90 transition-all"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {t('confirmOrder')}
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ADVANCED TABLE RESERVATION MODAL */}
      {reservationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 my-8 text-right space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-orange-500/10 text-orange-600 rounded-2xl">
                    <Calendar className="w-5 h-5" />
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    حجز طاولتك أونلاين - {restaurant.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>الفرع: {currentBranch.name}</span>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                    <span>تحديث حظر لحظي لتوفر الطاولات ⚡</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setReservationModalOpen(false);
                  setResStep('details');
                }}
                className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: RESERVATION DETAILS & LIVE AVAILABILITY */}
            {resStep === 'details' ? (
              <form onSubmit={handleReservationSubmit} className="space-y-6">

                {/* Real-time Ticker Banner */}
                <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 text-white p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>حالة التوفر اللحظية الآن:</span>
                      </div>
                      <p className="text-sm font-black text-white mt-0.5">
                        {availableTablesCount > 0 ? (
                          <span>يتوفر حالياً {availableTablesCount} طاولات متاحة تناسب ({resGuests} أشخاص) الساعة {resTime}</span>
                        ) : (
                          <span className="text-amber-300">جميع الطاولات بهذا التوقيت مكتملة - يرجى تغيير الوقت أو الفئة</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block text-[10px] bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-500/30">
                    مباشر 24/7
                  </span>
                </div>

                {/* 1. Date & Time Selection */}
                <div className="space-y-3">
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>1. اختر تاريخ ووقت الحجز:</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Date Picker */}
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 mb-1">التاريخ</span>
                      <input
                        type="date"
                        required
                        value={resDate}
                        onChange={(e) => setResDate(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      />
                      <div className="flex gap-1.5 mt-2">
                        <button
                          type="button"
                          onClick={() => setResDate('2026-07-28')}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${resDate === '2026-07-28' ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
                        >
                          اليوم
                        </button>
                        <button
                          type="button"
                          onClick={() => setResDate('2026-07-29')}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${resDate === '2026-07-29' ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
                        >
                          غداً
                        </button>
                        <button
                          type="button"
                          onClick={() => setResDate('2026-07-30')}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${resDate === '2026-07-30' ? 'bg-orange-500 text-white border-orange-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}
                        >
                          بعد غد
                        </button>
                      </div>
                    </div>

                    {/* Time Picker */}
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 mb-1">الوقت المفضل</span>
                      <input
                        type="time"
                        required
                        value={resTime}
                        onChange={(e) => setResTime(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Time Slots Chips with Live Occupancy Status */}
                  <div className="pt-2">
                    <span className="block text-[11px] font-bold text-slate-500 mb-2">أوقات شائعة متاحة للحجز المباشر:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {availableTimeSlots.map((slot) => {
                        const isSelected = resTime === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setResTime(slot.time)}
                            className={`p-2.5 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden ${
                              isSelected
                                ? 'bg-orange-600 text-white border-orange-600 shadow-md ring-2 ring-orange-400/50'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-orange-500 text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <div className="text-xs font-black">{slot.label}</div>
                            <div className={`text-[10px] font-extrabold mt-1 ${isSelected ? 'text-amber-200' : slot.status === 'busy' ? 'text-amber-500' : 'text-emerald-500'}`}>
                              {slot.badge}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Guests Count & Seating Area */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-orange-500" />
                      <span>2. عدد الأشخاص وفئة الجلسة:</span>
                    </span>
                    <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
                      {resGuests} أفراد
                    </span>
                  </label>

                  {/* Guests Count Stepper */}
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">حدد عدد الضيوف:</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setResGuests(Math.max(1, resGuests - 1))}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-600 cursor-pointer active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-black text-slate-900 dark:text-white w-8 text-center">
                        {resGuests}
                      </span>
                      <button
                        type="button"
                        onClick={() => setResGuests(Math.min(20, resGuests + 1))}
                        className="w-9 h-9 rounded-xl bg-orange-600 text-white font-bold flex items-center justify-center shadow-sm cursor-pointer active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Area Category Filter */}
                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 mb-2">تفضيل منطقة الجلوس</span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'الكل', icon: '🏢' },
                        { id: 'indoor', label: 'صالة داخلية', icon: '🛋️' },
                        { id: 'outdoor', label: 'تراس خارجي', icon: '🌅' },
                        { id: 'family', label: 'قسم العائلات', icon: '👨‍👩‍👧‍👦' },
                        { id: 'vip', label: 'جناح VIP', icon: '👑' },
                      ].map((area) => (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => setResArea(area.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            resArea === area.id
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                          }`}
                        >
                          <span>{area.icon}</span>
                          <span>{area.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Real-Time Table Selection Floor Map Grid */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Grid className="w-4 h-4 text-orange-500" />
                      <span>3. اختيار رقم الطاولة من المخطط:</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setManualTableSelect(!manualTableSelect)}
                      className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer flex items-center gap-1"
                    >
                      {manualTableSelect ? 'الرجوع للتخصيص التلقائي' : 'عرض مخطط الطاولات التفصيلي 🗺️'}
                    </button>
                  </div>

                  {!manualTableSelect ? (
                    <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/20 text-orange-600 rounded-xl">
                          <Crown className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">
                            تخصيص أوتوماتيكي لأفضل طاولة متاحة
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            سيقوم المضيف باختيار أفضل طاولة تتسع لـ {resGuests} أفراد في منطقة {resArea === 'all' ? 'المطعم' : resArea}.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/20">
                        مضمون 100%
                      </span>
                    </div>
                  ) : (
                    /* Manual Floor Plan Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
                      {filteredBranchTables.map((tbl) => {
                        const isSelected = selectedTableId === tbl.id;
                        const isAvailable = tbl.status === 'available';

                        return (
                          <div
                            key={tbl.id}
                            onClick={() => isAvailable && setSelectedTableId(tbl.id)}
                            className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative ${
                              !isAvailable
                                ? 'opacity-50 bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 cursor-not-allowed'
                                : isSelected
                                ? 'bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/40 shadow-sm'
                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-orange-400'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{tbl.name}</span>
                                {tbl.isVip && (
                                  <span className="text-[9px] bg-amber-400/20 text-amber-600 dark:text-amber-300 font-extrabold px-1.5 py-0.5 rounded">
                                    VIP ⭐
                                  </span>
                                )}
                              </span>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isAvailable ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'}`}>
                                {isAvailable ? 'متاحة الآن' : 'محجوزة'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold mt-2">
                              <span>السعة: {tbl.capacity} أفراد</span>
                              <span>القسم: {tbl.areaLabel}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. Customer Contact Details & Special Requests */}
                <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>4. بيانات صاحب الحجز والملاحظات:</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 mb-1">اسم صاحب الحجز *</span>
                      <input
                        type="text"
                        required
                        placeholder="أدخل اسمك الكريم"
                        value={resCustomerName}
                        onChange={(e) => setResCustomerName(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-500 mb-1">رقم الجوال لتأكيد الحجز *</span>
                      <input
                        type="tel"
                        required
                        placeholder="059xxxxxxx"
                        value={resCustomerPhone}
                        onChange={(e) => setResCustomerPhone(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-slate-500 mb-1">طلبات خاصة / مناسبات (اختياري)</span>
                    <textarea
                      rows={2}
                      placeholder="مثال: احتفال بعيد ميلاد، كرسي طفل، تجهيز ورد على الطاولة..."
                      value={resNotes}
                      onChange={(e) => setResNotes(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={resSubmitting || availableTablesCount === 0}
                  className="w-full py-4 rounded-2xl text-white font-black text-base shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  {resSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>جاري تأكيد حجز الطاولة...</span>
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>تأكيد حجز الطاولة الفوري 🚀</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: DIGITAL RESERVATION TICKET CONFIRMATION */
              <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
                <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                    تم تأكيد حجز طاولتك بنجاح! 🎉
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-bold max-w-md mx-auto">
                    تم تسجيل الحجز في نظام الاستقبال الخاص بـ <span className="text-orange-600 font-extrabold">{restaurant.name} ({currentBranch.name})</span>.
                  </p>
                </div>

                {/* Digital Ticket Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl text-right relative overflow-hidden">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-widest block">تذكرة حجز رقمية معتمدة</span>
                      <h5 className="text-lg font-black text-white">{restaurant.name}</h5>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/30">
                      #{resTicketCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-800 text-xs font-bold">
                    <div>
                      <span className="text-[10px] text-slate-400 block">التاريخ والوقت</span>
                      <span className="text-amber-300 text-sm font-black">{resDate} • {resTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">عدد الضيوف</span>
                      <span className="text-white text-sm font-black">{resGuests} أشخاص</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">الطاولة والموقع</span>
                      <span className="text-white font-black">
                        {selectedTableId === 'auto' ? 'طاولة مخصصة تلقائياً (أفضل موقع)' : branchTables.find(t=>t.id===selectedTableId)?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">صاحب الحجز</span>
                      <span className="text-white font-black">{resCustomerName || 'الضيف المكرم'}</span>
                    </div>
                  </div>

                  {/* QR Code Entrance Pass */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white rounded-xl shadow-inner text-slate-900">
                        <QrCode className="w-10 h-10" />
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-white block">رمز الدخول السريع عند الاستقبال</span>
                        <p className="text-[10px] text-slate-400">امسح الكود عند المضيف للدخول المباشر بدون انتظار</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold shrink-0">
                      تأكيد فوري ⚡
                    </span>
                  </div>
                </div>

                {/* Automated 30-minute Reminder Badge */}
                <div className="p-4 bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/20 text-amber-500 rounded-xl shrink-0">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 block">
                        تذكير تلقائي مفعّل (قبل الموعد بـ 30 دقيقة) ⏰
                      </span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold mt-0.5">
                        سيصلك إشعار داخل التطبيق وتنبيه على جوالك لتذكيرك بالحجز في الوقت المناسب.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Confirmation Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`حجزت طاولة في ${restaurant.name}! رمز الحجز: ${resTicketCode} بتاريخ ${resDate} الساعة ${resTime} لعدد ${resGuests} أشخاص.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>إرسال تفاصيل الحجز عبر WhatsApp</span>
                  </a>

                  <button
                    onClick={() => {
                      setResStep('details');
                      setReservationModalOpen(false);
                    }}
                    className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>إغلاق والعودة للمنيو</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* REVIEWS MODAL */}
      {reviewsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span>تقييمات وآراء العملاء</span>
              </h3>
              <button onClick={() => setReviewsModalOpen(false)} className="p-1 rounded-full text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Reviews List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>{rev.customerName}</span>
                    <span className="text-amber-500">{"★".repeat(rev.rating)}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} className="pt-2 border-t space-y-3">
              <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">{t('addReview')}</span>
              <div className="py-2 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-1">
                <span className="text-[11px] text-slate-500 font-bold">انقر على النجوم للتقييم</span>
                <AnimatedStarRating value={newRating} onChange={setNewRating} size="lg" />
              </div>
              <textarea
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="اكتب انطباعك عن الخدمة والأكل..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none"
              />
              <button type="submit" className="w-full py-2.5 rounded-xl text-white font-bold text-xs cursor-pointer hover:opacity-90" style={{ backgroundColor: primaryColor }}>
                نشر التقييم
              </button>
            </form>

          </div>
        </div>
      )}

      {/* FLOATING NERD DICE GAME & AI LIVE CHAT WIDGETS */}
      <div className="fixed bottom-20 md:bottom-6 left-6 z-40 flex items-center gap-3">
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="w-13 h-13 rounded-full text-white shadow-2xl flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all border-2 border-white/50"
            style={{ backgroundColor: primaryColor }}
            title="مساعد AI"
          >
            <Bot className="w-6 h-6 text-amber-300" />
          </button>
        )}

        {restaurant.nerdDiceGameEnabled !== false && (
          <button
            onClick={() => setDiceGameModalOpen(true)}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-red-500 text-white shadow-2xl flex items-center justify-center cursor-pointer transform hover:scale-110 transition-all border-2 border-white/80 animate-bounce"
            title="لعبة حجار نيرد 🎲"
          >
            <Dices className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* NERD DICE GAME MODAL */}
      {diceGameModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md">
            <DiceGameWidget
              restaurantId={restaurant.id}
              currency={currentCurrency}
              onApplyDiscount={(amount) => {
                setDiceDiscountAmount(amount);
                alert(`تم تطبيق خصم بقيمة ${amount} ${currentCurrency} بنجاح على فاتورتك! 🎉`);
              }}
              onClose={() => setDiceGameModalOpen(false)}
            />
          </div>
        </div>
      )}

      {chatOpen && (
        <div className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:w-96 z-40 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[400px] max-h-[70vh] animate-in slide-in-from-bottom duration-200">
          
          <div className="text-white p-4 flex items-center justify-between" style={{ backgroundColor: primaryColor }}>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-300" />
              <span className="text-xs font-black">مساعد menuz الذكي</span>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-emerald-200 hover:text-white cursor-pointer p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'mr-auto bg-orange-600 text-white font-bold'
                    : 'ml-auto bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-[9px] opacity-70 block text-left mt-1">{msg.timestamp}</span>
              </div>
            ))}
            {chatLoading && (
              <div className="text-slate-400 text-[10px] italic">جاري التفكير والتجهيز...</div>
            )}
          </div>

          <form onSubmit={handleSendChatMessage} className="p-3 border-t flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('liveChatPlaceholder')}
              className="flex-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs focus:outline-none"
            />
            <button type="submit" className="p-2.5 rounded-xl bg-orange-600 text-white cursor-pointer">
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>

        </div>
      )}

      {/* DELIVERY TRACKER MODAL */}
      {deliveryTrackerOpen && activeOrder && (
        <DeliveryTrackerModal
          order={activeOrder}
          onClose={() => setDeliveryTrackerOpen(false)}
          currentCurrency={currentCurrency}
        />
      )}

      {/* RESTAURANT SOCIAL FOLLOW CARD MODAL */}
      {socialCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-sm w-full text-white shadow-2xl relative flex flex-col items-center">
            <button
              onClick={() => setSocialCardModalOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <RestaurantSocialCard
              restaurantName={restaurant.name}
              instagramUrl={restaurant.socialLinks?.instagram ? (restaurant.socialLinks.instagram.startsWith('http') ? restaurant.socialLinks.instagram : `https://instagram.com/${restaurant.socialLinks.instagram.replace('@','')}`) : 'https://instagram.com'}
              twitterUrl={restaurant.socialLinks?.facebook ? (restaurant.socialLinks.facebook.startsWith('http') ? restaurant.socialLinks.facebook : `https://facebook.com/${restaurant.socialLinks.facebook}`) : 'https://x.com'}
              tiktokOrDiscordUrl={restaurant.socialLinks?.tiktok ? (restaurant.socialLinks.tiktok.startsWith('http') ? restaurant.socialLinks.tiktok : `https://tiktok.com/@${restaurant.socialLinks.tiktok.replace('@','')}`) : 'https://tiktok.com'}
            />

            <button
              onClick={() => setSocialCardModalOpen(false)}
              className="mt-6 w-full py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
