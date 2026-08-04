import React, { useState } from 'react';
import { 
  Globe, 
  LogIn, 
  Menu as MenuIcon, 
  X, 
  Moon, 
  Sun, 
  LayoutDashboard, 
  QrCode, 
  Utensils, 
  Sparkles,
  ChevronDown,
  Coins,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  BookOpen,
  BellRing,
  Headphones,
  Printer,
  ShieldAlert
} from 'lucide-react';
import { requestNotificationPermission } from '../lib/notifications';
import { Language, User, AppNotification } from '../types';
import { languages, getTranslation } from '../lib/translations';
import { currencies, Currency, getLastRatesUpdatedTime } from '../lib/currencies';
import { MobileSidebarDrawer } from './MobileSidebarDrawer';
import { ThemeSwitchToggle } from './ThemeSwitchToggle';
import { MenuzLogo } from './MenuzLogo';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentCurrency: string;
  onCurrencyChange: (currency: string) => void;
  activeView: 'landing' | 'menu' | 'admin' | 'qr' | 'blog' | 'payment-methods';
  setActiveView: (view: 'landing' | 'menu' | 'admin' | 'qr' | 'blog' | 'payment-methods') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenUserProfile?: () => void;
  activeRestaurantName?: string;
  onSuperAdminSecretTrigger?: () => void;
  notifications?: AppNotification[];
  onMarkNotifRead?: () => void;
  onClearNotifs?: () => void;
  onSendBroadcastNotif?: (title: string, message: string) => void;
  onOpenAdminPortal?: () => void;
  onOpenSupportHub?: (tab?: 'owner' | 'guest') => void;
  onOpenPrintablePdf?: () => void;
  onOpen2FA?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  currentCurrency,
  onCurrencyChange,
  activeView,
  setActiveView,
  isDarkMode,
  toggleDarkMode,
  onOpenAuth,
  currentUser,
  onLogout,
  onOpenUserProfile,
  activeRestaurantName,
  onSuperAdminSecretTrigger,
  notifications,
  onMarkNotifRead,
  onClearNotifs,
  onSendBroadcastNotif,
  onOpenAdminPortal,
  onOpenSupportHub,
  onOpenPrintablePdf,
  onOpen2FA,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currDropdownOpen, setCurrDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  // Secret 6-clicks Super Admin Login Gesture
  const [logoClicks, setLogoClicks] = useState(0);
  const [clickTimer, setClickTimer] = useState<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    setActiveView('landing');

    if (clickTimer) clearTimeout(clickTimer);

    const nextCount = logoClicks + 1;

    if (nextCount >= 6) {
      setLogoClicks(0);
      if (onSuperAdminSecretTrigger) {
        onSuperAdminSecretTrigger();
      }
      if (onOpenAdminPortal) {
        onOpenAdminPortal();
      }
    } else {
      setLogoClicks(nextCount);
      const timer = setTimeout(() => {
        setLogoClicks(0);
      }, 2500);
      setClickTimer(timer);
    }
  };

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLang, key);

  const currentLangObj = languages.find(l => l.code === currentLang) || languages[0];
  const activeCurrencyObj = currencies[currentCurrency] || currencies.ILS;

  return (
    <header className="sticky top-0 z-50 bg-[#0b4f42] text-white shadow-lg border-b border-emerald-900/40 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand matching menuz image */}
          <div className="flex items-center gap-6 relative">
            <button 
              onClick={handleLogoClick} 
              className="focus:outline-none cursor-pointer group active:scale-95 transition-transform relative"
              title="menuz - الرئيسية"
            >
              <MenuzLogo size="md" />
            </button>

            {/* Desktop View Switcher Pills */}
            <nav className="hidden md:flex items-center gap-1 bg-emerald-950/40 p-1 rounded-xl border border-emerald-800/50">
              <button
                onClick={() => setActiveView('landing')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  activeView === 'landing' ? 'bg-orange-600 text-white shadow-sm' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                {t('navHome')}
              </button>
              <button
                onClick={() => setActiveView('menu')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeView === 'menu' ? 'bg-orange-600 text-white shadow-sm' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <Utensils className="w-4 h-4" />
                <span>تصفح المطاعم</span>
              </button>
              <button
                onClick={() => setActiveView('qr')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeView === 'qr' ? 'bg-orange-600 text-white shadow-sm' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <QrCode className="w-4 h-4" />
                QR Code
              </button>
              <button
                onClick={() => setActiveView('blog')}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeView === 'blog' ? 'bg-orange-600 text-white shadow-sm' : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>المدونة</span>
              </button>

              {/* المزيد Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setMoreDropdownOpen(!moreDropdownOpen);
                    setLangDropdownOpen(false);
                    setCurrDropdownOpen(false);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    moreDropdownOpen || activeView === 'payment-methods' || activeView === 'admin'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-emerald-100 hover:text-white hover:bg-emerald-800/40'
                  }`}
                >
                  <span>المزيد</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-emerald-950 border border-emerald-700/60 rounded-xl shadow-2xl py-2 z-50 text-right animate-in fade-in duration-150">
                    {currentUser ? (
                      <button
                        onClick={() => { setActiveView('admin'); setMoreDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-right text-sm font-bold text-emerald-100 hover:bg-emerald-800/60 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-orange-400" />
                        <span>لوحة تحكم مطعمي</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => { onOpenAuth('signup'); setMoreDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-right text-sm font-bold text-amber-300 hover:bg-emerald-800/60 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>انضم كصاحب مطعم</span>
                      </button>
                    )}

                    <button
                      onClick={() => { setActiveView('payment-methods'); setMoreDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-right text-sm font-bold text-emerald-100 hover:bg-emerald-800/60 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Coins className="w-4 h-4 text-emerald-400" />
                      <span>طرق الدفع</span>
                    </button>

                    {onOpenPrintablePdf && (
                      <button
                        onClick={() => { onOpenPrintablePdf(); setMoreDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-right text-sm font-bold text-amber-300 hover:bg-emerald-800/60 hover:text-amber-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Printer className="w-4 h-4 text-amber-400" />
                        <span>تحميل المنيو (PDF) 📄</span>
                      </button>
                    )}

                    {onOpen2FA && (
                      <button
                        onClick={() => { onOpen2FA(); setMoreDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-right text-sm font-bold text-cyan-300 hover:bg-emerald-800/60 hover:text-cyan-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <ShieldAlert className="w-4 h-4 text-cyan-400" />
                        <span>رمز التحقق الثنائي (2FA)</span>
                      </button>
                    )}

                    {onOpenSupportHub && (
                      <button
                        onClick={() => { onOpenSupportHub('owner'); setMoreDropdownOpen(false); }}
                        className="w-full px-4 py-2.5 text-right text-sm font-bold text-emerald-100 hover:bg-emerald-800/60 hover:text-white flex items-center gap-2.5 transition-colors cursor-pointer border-t border-emerald-800/40 mt-1 pt-2.5"
                      >
                        <Headphones className="w-4 h-4 text-amber-400" />
                        <span>الدعم الفني المباشر 🎧</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Controls (Language Selector, Currency Selector, Dark Mode, Auth & CTA) */}
          <div className="hidden lg:flex items-center gap-2.5">
            
            {/* Currency Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setCurrDropdownOpen(!currDropdownOpen); setLangDropdownOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-xs font-bold text-emerald-100 border border-emerald-700/50 transition-colors cursor-pointer"
                title="العملة المعروضة"
              >
                <Coins className="w-3.5 h-3.5 text-orange-400" />
                <span>{activeCurrencyObj.symbol} ({activeCurrencyObj.code})</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {currDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold text-orange-600 dark:text-orange-400 uppercase border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                    <span>تحديث العملات تلقائياً:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {getLastRatesUpdatedTime()}
                    </span>
                  </div>
                  {Object.values(currencies).map((c: Currency) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        onCurrencyChange(c.code);
                        setCurrDropdownOpen(false);
                      }}
                      className={`w-full text-right px-3 py-1.5 text-xs flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                        currentCurrency === c.code ? 'font-bold text-orange-600 dark:text-orange-400 bg-orange-50/50' : ''
                      }`}
                    >
                      <span className="font-bold">{c.symbol} {c.code}</span>
                      <span className="text-[11px] text-slate-400">{c.nameAr}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector Dropdown (10 Languages) */}
            <div className="relative">
              <button
                onClick={() => { setLangDropdownOpen(!langDropdownOpen); setCurrDropdownOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 text-xs font-bold text-emerald-100 border border-emerald-700/50 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-300" />
                <span className="flex items-center gap-1">
                  <span>{currentLangObj.flag}</span>
                  <span>{currentLangObj.nativeName}</span>
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-72 overflow-y-auto">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLanguageChange(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-right px-3.5 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                        currentLang === l.code ? 'font-bold text-orange-600 dark:text-orange-400 bg-orange-50/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span className="font-bold">{l.nativeName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase">{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Day/Night Switcher */}
            <ThemeSwitchToggle
              id="navbar-theme-toggle-desktop"
              isDarkMode={isDarkMode}
              onToggle={toggleDarkMode}
              className="scale-90"
            />

            {/* Notification Center (Shown ONLY when logged in) */}
            {currentUser && (
              <NotificationCenter
                notifications={notifications || []}
                onMarkAllRead={onMarkNotifRead || (() => {})}
                onClearAll={onClearNotifs || (() => {})}
                onSendBroadcastNotification={onSendBroadcastNotif}
                isSuperAdmin={currentUser?.role === 'superadmin' || currentUser?.isSuperAdmin === true || currentUser?.email?.toLowerCase() === 'yazansalaq@gmail.com'}
              />
            )}

            {/* Profile & Multi-Store Management Button */}
            {currentUser && onOpenUserProfile && (
              <button
                onClick={onOpenUserProfile}
                className="p-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors cursor-pointer border border-amber-300 shadow-sm"
                title="إدارة بروفايلك والمواقع/المتاجر المتعددة"
              >
                <UserIcon className="w-4 h-4 text-slate-950" />
              </button>
            )}

            {/* Auth Actions */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-100 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-1.5 rounded-lg border border-emerald-800">
                  <UserIcon className="w-3.5 h-3.5 text-orange-400" />
                  <span>{currentUser.name}</span>
                </span>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg text-rose-200 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 transition-colors cursor-pointer"
                  title="تسجيل خروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white shadow-md transition-all flex items-center justify-center cursor-pointer active:scale-95 border border-orange-500"
                title="تسجيل الدخول"
              >
                <LogIn className="w-4.5 h-4.5 text-white" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeSwitchToggle
              id="navbar-theme-toggle-mobile"
              isDarkMode={isDarkMode}
              onToggle={toggleDarkMode}
              className="scale-90"
            />
            <label 
              className="flex flex-col gap-1.5 w-9 p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 cursor-pointer shadow-sm active:scale-95 transition-transform"
              title="القائمة الجانبية"
            >
              <input 
                type="checkbox" 
                className="peer hidden" 
                checked={mobileMenuOpen}
                onChange={(e) => setMobileMenuOpen(e.target.checked)}
              />
              <div
                className="rounded-2xl h-[3px] w-1/2 bg-amber-300 duration-500 peer-checked:rotate-[225deg] origin-right peer-checked:-translate-x-[12px] peer-checked:-translate-y-[1px]"
              ></div>
              <div
                className="rounded-2xl h-[3px] w-full bg-amber-300 duration-500 peer-checked:-rotate-45"
              ></div>
              <div
                className="rounded-2xl h-[3px] w-1/2 bg-amber-300 duration-500 place-self-end peer-checked:rotate-[225deg] origin-left peer-checked:translate-x-[12px] peer-checked:translate-y-[1px]"
              ></div>
            </label>
          </div>

        </div>
      </div>

      {/* Mobile Side Drawer with Accordions */}
      <MobileSidebarDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
        onOpenUserProfile={onOpenUserProfile}
        currentLang={currentLang}
        onLanguageChange={onLanguageChange}
        currentCurrency={currentCurrency}
        onCurrencyChange={onCurrencyChange}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onOpenSupportHub={onOpenSupportHub}
        onOpenPrintablePdf={onOpenPrintablePdf}
        onOpen2FA={onOpen2FA}
      />
    </header>
  );
};
