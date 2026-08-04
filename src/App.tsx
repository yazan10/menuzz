import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { UserMenu } from './components/UserMenu/UserMenu';
import { QRCodeManager } from './components/QRCode/QRCodeManager';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SplashScreen } from './components/SplashScreen';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AdminLoginPortal } from './components/AdminLoginPortal';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { DevFloatingBar } from './components/DevFloatingBar';
import { BannedUserScreen } from './components/BannedUserScreen';
import { GuestRestaurantFeaturesView } from './components/GuestRestaurantFeaturesView';
import { BlogSection } from './components/BlogSection';
import { PaymentMethodsPage } from './components/PaymentMethodsPage';
import { NewOrderSoundBanner } from './components/NewOrderSoundBanner';
import { NotFoundScreen } from './components/NotFoundScreen';
import { SupportHubModal } from './components/SupportHubModal';
import { PrintableMenuModal } from './components/PrintableMenuModal';
import { TwoFactorModal } from './components/TwoFactorModal';

import { generateRandomPromoCode } from './lib/promo';

import { 
  Language, 
  User, 
  Restaurant, 
  Category, 
  Dish, 
  Order, 
  Reservation, 
  Review, 
  SalesReport, 
  OrderStatus,
  AppNotification 
} from './types';

import { 
  initialRestaurant, 
  initialCategories, 
  initialDishes, 
  initialOrders, 
  initialReservations, 
  initialReviews, 
  initialSalesReports,
  initialUserStores,
  initialUser
} from './data/mockData';
import { languageDefaultCurrency, initBackgroundCurrencyUpdates, subscribeToRates } from './lib/currencies';
import { triggerBrowserNotification, stopOrderAlertSound } from './lib/notifications';
import { sendOrderTelegramAlert, sendReservationTelegramAlert } from './lib/telegram';

export default function App() {
  // App Config & Navigation State
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentLang, setCurrentLang] = useState<Language>('ar');
  const [currentCurrency, setCurrentCurrency] = useState<string>('ILS'); // Default Shekel
  const [activeView, setActiveView] = useState<'landing' | 'menu' | 'admin' | 'qr' | 'blog' | 'notfound' | 'payment-methods'>('landing');

  // Check initial URL parameters for 404 testing or unknown path
  useEffect(() => {
    if (window.location.search.includes('404') || window.location.pathname === '/404') {
      setActiveView('notfound');
    }
  }, []);
  const [allowGuestDemoMenu, setAllowGuestDemoMenu] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [, setFxTick] = useState<number>(0);

  // System System Modes & Portals State
  const [isDevMode, setIsDevMode] = useState<boolean>(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [maintenanceNote, setMaintenanceNote] = useState<string>('نقوم حالياً بإجراء تحديثات دورية وتحسينات للسرعة لضمان أفضل خدمة للمطاعم والزبائن.');
  const [adminPortalOpen, setAdminPortalOpen] = useState<boolean>(false);

  // Notification System State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif_1',
      title: 'مرحباً بك في منصة menuz 🚀',
      message: 'تم تجهيز نظام المنيو الرقمي السريع مع دعم العملات واللغات وخدمة الطلبات.',
      type: 'system',
      timestamp: 'الان',
      read: false,
    },
    {
      id: 'notif_2',
      title: 'برنامج الشركاء والبرومو كود 🎁',
      message: 'شارك الكود الخاص بك واحصل على 53 شيقل مقابل كل 100 مسجل جديد عن طريقك!',
      type: 'system',
      timestamp: 'قبل 10 دقائق',
      read: false,
    },
    {
      id: 'notif_3',
      title: 'طلب جديد #ORD-1044 🍔',
      message: 'وصل طلب جديد بقيمة 120 ₪ - طاولة 5 (مطعم القصر)',
      type: 'order',
      timestamp: 'قبل 25 دقيقة',
      read: true,
    },
  ]);

  // Initialize background live currency rate updates
  useEffect(() => {
    initBackgroundCurrencyUpdates();
    const unsubscribe = subscribeToRates(() => {
      setFxTick(prev => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Auth & Profile State
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [userProfileModalOpen, setUserProfileModalOpen] = useState<boolean>(false);
  const [supportHubOpen, setSupportHubOpen] = useState<boolean>(false);
  const [printablePdfOpen, setPrintablePdfOpen] = useState<boolean>(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState<boolean>(false);
  const [supportHubTab, setSupportHubTab] = useState<'owner' | 'guest'>('owner');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleOpenSupportHub = (tab: 'owner' | 'guest' = 'owner') => {
    setSupportHubTab(tab);
    setSupportHubOpen(true);
  };

  // Multi-Store Stores State
  const [userStores, setUserStores] = useState<Restaurant[]>(initialUserStores);
  const [restaurant, setRestaurant] = useState<Restaurant>(initialRestaurant);

  // Data State
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [dishes, setDishes] = useState<Dish[]>(initialDishes);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [salesReports, setSalesReports] = useState<SalesReport[]>(initialSalesReports);

  // Active Menu Customer Context
  const [selectedBranchId, setSelectedBranchId] = useState<string>(initialRestaurant.branches[0]?.id || 'br_1');
  const [tableNumber, setTableNumber] = useState<number>(5);

  // Sync dark mode class on html tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync RTL / LTR document direction according to active language (RTL for ar and he)
  useEffect(() => {
    const isRtl = currentLang === 'ar' || currentLang === 'he';
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    // Optional: Auto switch currency to language's default if not manually overridden
    if (languageDefaultCurrency[currentLang]) {
      setCurrentCurrency(languageDefaultCurrency[currentLang]);
    }
  }, [currentLang]);

  // Check URL params for QR scanning redirect (e.g., ?branch=br_2&table=12)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const branchParam = params.get('branch');
    const tableParam = params.get('table');

    if (branchParam) {
      setSelectedBranchId(branchParam);
      if (tableParam) {
        setTableNumber(Number(tableParam));
      }
      setActiveView('menu');
    }
  }, []);

  // Handlers
  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthInitialMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    // Redirect to Admin panel upon logging in
    setActiveView('admin');
  };

  const handleSuperAdminSecretTrigger = () => {
    setAuthInitialMode('login');
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  const handleScanRedirectToTable = (branchId: string, tableNum: number) => {
    setSelectedBranchId(branchId);
    setTableNumber(tableNum);
    setActiveView('menu');
  };

  const handleNewOrderSubmitted = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    // Dynamically update sales reports
    const todayLabel = '27 يوليو';
    setSalesReports(prev => [
      ...prev,
      {
        date: todayLabel,
        branchName: newOrder.branchName,
        ordersCount: 1,
        revenue: newOrder.totalAmount
      }
    ]);

    // Add In-App Notification
    const newOrderNotif: AppNotification = {
      id: `notif_order_${newOrder.id}`,
      title: `طلب جديد ${newOrder.orderNumber} 🔔`,
      message: `وصل طلب جديد بقيمة ${newOrder.totalAmount} ₪ - طاولة ${newOrder.tableNumber || '-'} (${newOrder.branchName})`,
      type: 'order',
      timestamp: 'الآن',
      read: false,
    };
    setNotifications(prev => [newOrderNotif, ...prev]);

    // Trigger Browser Notification & Continuous Audio Alert for restaurant owners
    triggerBrowserNotification('طلب جديد من M3NUZ 🔔', {
      body: `وصل طلب جديد (${newOrder.orderNumber}) بقيمة ${newOrder.totalAmount} ₪ - طاولة ${newOrder.tableNumber || '-'}`,
      isOrder: true,
    });

    // Also dispatch to Telegram Bot
    sendOrderTelegramAlert(newOrder, restaurant.name);
  };

  const handleNewReservationSubmitted = (newRes: Reservation) => {
    setReservations(prev => [newRes, ...prev]);

    // 1. Owner Browser Notification
    triggerBrowserNotification('حجز طاولة جديد 📅', {
      body: `حجز جديد باسم ${newRes.customerName} - ${newRes.guestsCount} أشخاص (${newRes.time})`
    });

    // 2. Dispatch to Telegram Bot
    sendReservationTelegramAlert(newRes, restaurant.name);

    // 2. Automated 30-Minute Pre-reservation In-App Notification Reminder for Customer
    const reminderNotif: AppNotification = {
      id: `notif_30min_res_${newRes.id}`,
      title: '⏰ تذكير بموعد الحجز (متبقي 30 دقيقة)',
      message: `تذكير تلقائي: عزيزي ${newRes.customerName}، لديك حجز طاولة في ${newRes.branchName || 'مطعم القصر'} لعدد ${newRes.guestsCount} أشخاص الموعد الساعة ${newRes.time} (متبقي 30 دقيقة). نتمنى لك تجربة رائعة!`,
      type: 'reservation',
      timestamp: 'الآن',
      read: false,
    };

    setNotifications(prev => [reminderNotif, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    stopOrderAlertSound();
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleUpdateReservationStatus = (resId: string, newStatus: 'confirmed' | 'cancelled') => {
    setReservations(prev => prev.map(r => r.id === resId ? { ...r, status: newStatus } : r));
  };

  const handleAddReview = (newReview: Review) => {
    setReviews(prev => [newReview, ...prev]);
  };

  // Multi-Store Handlers
  const handleSelectRestaurant = (selected: Restaurant) => {
    setRestaurant(selected);
    if (selected.branches && selected.branches.length > 0) {
      setSelectedBranchId(selected.branches[0].id);
    }
  };

  const handleUpdateRestaurantInStores = (updated: Restaurant) => {
    setUserStores(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (restaurant.id === updated.id) {
      setRestaurant(updated);
    }
  };

  const handleCreateNewRestaurant = (newRest: Restaurant) => {
    setUserStores(prev => [...prev, newRest]);
    setRestaurant(newRest);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        managedRestaurantIds: [...(currentUser.managedRestaurantIds || []), newRest.id]
      });
    }
  };

  // Notification Handlers
  const handleMarkNotifRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearNotifs = () => {
    setNotifications([]);
  };

  const handleSendBroadcastNotif = (title: string, message: string) => {
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title,
      message,
      type: 'system',
      timestamp: 'الان',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // If user is banned, display BannedUserScreen
  if (currentUser?.isBanned) {
    return (
      <BannedUserScreen
        reason="تم حظر الحساب بسبب مخالفة الشروط والأحكام الخاصة بالمنصة."
        onLogout={handleLogout}
      />
    );
  }

  // If Maintenance mode is ON and user is browsing as customer
  if (isMaintenanceMode && activeView !== 'admin' && currentUser?.role !== 'superadmin' && !currentUser?.isSuperAdmin) {
    return (
      <MaintenanceScreen
        note={maintenanceNote}
        onOpenAdminLogin={() => setAdminPortalOpen(true)}
      />
    );
  }

  if (currentUser?.isBanned) {
    return (
      <BannedUserScreen 
        reason={currentUser.banReason} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="min-[#100vh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold selection:bg-orange-500 selection:text-white">
      
      {/* Animated Splash / Loading Screen on app load */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currentCurrency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        activeView={activeView}
        setActiveView={setActiveView}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAuth={handleOpenAuth}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenUserProfile={() => setUserProfileModalOpen(true)}
        activeRestaurantName={restaurant.name}
        onSuperAdminSecretTrigger={handleSuperAdminSecretTrigger}
        notifications={notifications}
        onMarkNotifRead={handleMarkNotifRead}
        onClearNotifs={handleClearNotifs}
        onSendBroadcastNotif={handleSendBroadcastNotif}
        onOpenAdminPortal={() => setAdminPortalOpen(true)}
        onOpenSupportHub={handleOpenSupportHub}
        onOpenPrintablePdf={() => setPrintablePdfOpen(true)}
        onOpen2FA={() => setTwoFactorModalOpen(true)}
      />

      {/* Floating Active Order Sound Banner */}
      <NewOrderSoundBanner onViewOrders={() => setActiveView('admin')} />

      {/* Main Views */}
      <main className="pb-16 md:pb-0">
        {isMaintenanceMode && activeView !== 'admin' && currentUser?.role !== 'superadmin' ? (
          <MaintenanceScreen
            note={maintenanceNote}
            onOpenAdminLogin={() => setAdminPortalOpen(true)}
          />
        ) : (
          <>
            {activeView === 'landing' && (
              <LandingPage
                currentLang={currentLang}
                currentCurrency={currentCurrency}
                onNavigateToMenu={() => setActiveView('menu')}
                onNavigateToAdmin={() => setAdminPortalOpen(true)}
                onOpenAuth={handleOpenAuth}
                onNavigatePaymentMethods={() => setActiveView('payment-methods')}
              />
            )}

        {activeView === 'menu' && (
          !currentUser && !allowGuestDemoMenu ? (
            <GuestRestaurantFeaturesView
              currentLang={currentLang}
              onOpenAuth={handleOpenAuth}
              onViewDemoMenu={() => setAllowGuestDemoMenu(true)}
            />
          ) : (
            <UserMenu
              restaurant={restaurant}
              categories={categories}
              dishes={dishes}
              currentLang={currentLang}
              currentCurrency={currentCurrency}
              selectedBranchId={selectedBranchId}
              onBranchChange={setSelectedBranchId}
              tableNumber={tableNumber}
              onTableNumberChange={setTableNumber}
              onNewOrderSubmitted={handleNewOrderSubmitted}
              onNewReservationSubmitted={handleNewReservationSubmitted}
              reviews={reviews}
              onAddReview={handleAddReview}
              currentUser={currentUser}
              allRestaurants={userStores}
              onSelectRestaurant={handleSelectRestaurant}
              onOpenAuth={handleOpenAuth}
            />
          )
        )}

        {activeView === 'qr' && (
          <QRCodeManager
            restaurant={restaurant}
            currentLang={currentLang}
            dishes={dishes}
            currentCurrency={currentCurrency}
            onScanRedirectToTable={handleScanRedirectToTable}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            restaurant={restaurant}
            onUpdateRestaurant={handleUpdateRestaurantInStores}
            categories={categories}
            onUpdateCategories={setCategories}
            dishes={dishes}
            onUpdateDishes={setDishes}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            reservations={reservations}
            onUpdateReservationStatus={handleUpdateReservationStatus}
            reviews={reviews}
            salesReports={salesReports}
            currentLang={currentLang}
            currentCurrency={currentCurrency}
            currentUser={currentUser}
            userStores={userStores}
            onSelectRestaurant={handleSelectRestaurant}
            isMaintenanceMode={isMaintenanceMode}
            onToggleMaintenanceMode={() => setIsMaintenanceMode(!isMaintenanceMode)}
            maintenanceNote={maintenanceNote}
            onUpdateMaintenanceNote={setMaintenanceNote}
          />
        )}

        {activeView === 'blog' && (
          <BlogSection
            currentLang={currentLang}
            onNavigateToAdmin={() => setActiveView('admin')}
            onNavigateToMenu={() => setActiveView('menu')}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeView === 'payment-methods' && (
          <PaymentMethodsPage
            onNavigateHome={() => setActiveView('landing')}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeView === 'notfound' && (
          <NotFoundScreen
            onNavigateHome={() => setActiveView('landing')}
            onNavigateMenu={() => setActiveView('menu')}
          />
        )}
          </>
        )}
      </main>

      {/* Mobile Bottom Control Bar for Web App Experience */}
      <MobileBottomNav
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenUserProfile={() => setUserProfileModalOpen(true)}
        currentLang={currentLang}
      />

      {/* Authentication & Email Verification Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authInitialMode}
        onLoginSuccess={handleLoginSuccess}
        currentLang={currentLang}
      />

      {/* Admin Dedicated Login Portal Modal */}
      <AdminLoginPortal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Developer Mode Floating Toolbar */}
      <DevFloatingBar
        isDevMode={isDevMode}
        onToggleDevMode={() => setIsDevMode(!isDevMode)}
        isMaintenanceMode={isMaintenanceMode}
        onToggleMaintenanceMode={() => setIsMaintenanceMode(!isMaintenanceMode)}
        currentUser={currentUser}
        onNavigate404={() => setActiveView('notfound')}
        onSwitchUserRole={(role) => {
          if (role === 'superadmin') {
            setCurrentUser({
              id: 'usr_super',
              name: 'يزن سلق (Super Admin ⚡)',
              email: 'yazansalaq@gmail.com',
              role: 'superadmin',
              isSuperAdmin: true,
              restaurantId: 'rest_01',
              isVerified: true,
              promoCode: generateRandomPromoCode('YAZAN'),
              referralCount: 0,
              referralEarningsILS: 0
            });
            setActiveView('admin');
          } else if (role === 'admin') {
            setCurrentUser({
              id: 'usr_admin',
              name: 'صاحب المطعم',
              email: 'admin@palace.com',
              role: 'admin',
              restaurantId: 'rest_01',
              isVerified: true,
              promoCode: generateRandomPromoCode('ADM'),
              referralCount: 0,
              referralEarningsILS: 0
            });
            setActiveView('admin');
          } else if (role === 'staff') {
            setCurrentUser({
              id: 'usr_staff',
              name: 'طاقم المطبخ',
              email: 'staff@palace.com',
              role: 'staff',
              restaurantId: 'rest_01',
              isVerified: true,
              promoCode: generateRandomPromoCode('STF'),
              referralCount: 0,
              referralEarningsILS: 0
            });
            setActiveView('admin');
          } else {
            setCurrentUser(null);
            setActiveView('menu');
          }
        }}
        onTriggerTestNotification={() => {
          handleSendBroadcastNotif(
            'اختبار إشعار التطوير ⚡',
            'تم إرسال هذا الإشعار تلقائياً من شريط أدوات المطور اختباريًا.'
          );
        }}
      />

      {/* User Profile & Multi-Store Management Modal */}
      {currentUser && (
        <UserProfileModal
          isOpen={userProfileModalOpen}
          onClose={() => setUserProfileModalOpen(false)}
          user={currentUser}
          onUpdateUser={setCurrentUser}
          userStores={userStores}
          activeRestaurant={restaurant}
          onSelectRestaurant={handleSelectRestaurant}
          onUpdateRestaurant={handleUpdateRestaurantInStores}
          onCreateRestaurant={handleCreateNewRestaurant}
        />
      )}

      {/* Support Hub & Live Chat Modal */}
      <SupportHubModal
        isOpen={supportHubOpen}
        onClose={() => setSupportHubOpen(false)}
        defaultTab={supportHubTab}
      />

      {/* Printable Menu PDF Modal */}
      <PrintableMenuModal
        isOpen={printablePdfOpen}
        onClose={() => setPrintablePdfOpen(false)}
        restaurant={restaurant}
      />

      {/* Two-Factor Verification Modal */}
      <TwoFactorModal
        isOpen={twoFactorModalOpen}
        onClose={() => setTwoFactorModalOpen(false)}
        onVerify={(code) => {
          alert(`تم التحقق من كود 2FA بنجاح: ${code}`);
          setTwoFactorModalOpen(false);
        }}
      />

    </div>
  );
}
