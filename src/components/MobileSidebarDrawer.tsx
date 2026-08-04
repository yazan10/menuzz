import React, { useState } from 'react';
import { 
  X, 
  Home, 
  Utensils, 
  LayoutDashboard, 
  QrCode, 
  User as UserIcon, 
  Globe, 
  Coins, 
  ChevronDown, 
  ChevronUp, 
  LogIn, 
  LogOut, 
  Sparkles, 
  Moon, 
  Sun, 
  Store, 
  Bot, 
  Printer, 
  BarChart3, 
  Headphones, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Users
} from 'lucide-react';
import { User, Language } from '../types';
import { languages, getTranslation } from '../lib/translations';
import { currencies } from '../lib/currencies';
import { ThemeSwitchToggle } from './ThemeSwitchToggle';

interface MobileSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: 'landing' | 'menu' | 'admin' | 'qr' | 'blog' | 'payment-methods';
  setActiveView: (view: 'landing' | 'menu' | 'admin' | 'qr' | 'blog' | 'payment-methods') => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  onOpenUserProfile?: () => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentCurrency: string;
  onCurrencyChange: (curr: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onOpenSupportHub?: (tab?: 'owner' | 'guest') => void;
  onOpenPrintablePdf?: () => void;
  onOpen2FA?: () => void;
}

export const MobileSidebarDrawer: React.FC<MobileSidebarDrawerProps> = ({
  isOpen,
  onClose,
  activeView,
  setActiveView,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenUserProfile,
  currentLang,
  onLanguageChange,
  currentCurrency,
  onCurrencyChange,
  isDarkMode,
  toggleDarkMode,
  onOpenSupportHub,
  onOpenPrintablePdf,
  onOpen2FA,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLang, key);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    navigation: true,
    account: false,
    languages: false,
    currency: false,
    features: false,
    support: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const currentLangObj = languages.find((l) => l.code === currentLang) || languages[0];
  const activeCurrencyObj = currencies[currentCurrency] || currencies.ILS;

  return (
    <div className={`fixed inset-0 z-[90] lg:hidden font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold transition-all duration-300 ${isOpen ? 'pointer-events-auto opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className={`fixed inset-y-0 right-0 w-[85%] max-w-sm bg-[#06332a] dark:bg-slate-950 text-white shadow-2xl flex flex-col justify-between overflow-hidden z-10 border-l border-emerald-800/60 dark:border-slate-800 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-emerald-800/80 dark:border-slate-800 flex items-center justify-between bg-emerald-950/80 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center font-black text-xl text-white shadow-md border border-orange-500/40">
              z
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-tight">
                menuz<span className="text-orange-500 font-black">.</span>
              </span>
              <span className="text-[10px] text-emerald-200/80 dark:text-slate-400 font-bold block leading-tight">
                منصة المنيو والطلبات الذكية
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Day/Night Theme Switcher */}
            <ThemeSwitchToggle
              id="mobile-drawer-theme-toggle"
              isDarkMode={isDarkMode}
              onToggle={toggleDarkMode}
              className="scale-90"
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-emerald-900/80 dark:bg-slate-800 text-slate-200 hover:text-white hover:bg-emerald-800 transition-all cursor-pointer border border-emerald-700/50 dark:border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Status / Banner Card */}
        <div className="p-3 bg-gradient-to-r from-emerald-900/60 via-emerald-800/40 to-emerald-900/60 dark:from-slate-900 dark:to-slate-900/80 border-b border-emerald-800/50 dark:border-slate-800 shrink-0">
          {currentUser ? (
            <div className="flex items-center justify-between gap-2 bg-emerald-950/70 dark:bg-slate-950 p-2.5 rounded-2xl border border-emerald-700/50 dark:border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-white truncate flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-[10px] text-emerald-200/80 dark:text-slate-400 truncate">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {onOpenUserProfile && (
                  <button
                    onClick={() => { onOpenUserProfile(); onClose(); }}
                    className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors"
                    title="بروفايل الحساب"
                  >
                    <Store className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => { onLogout(); onClose(); }}
                  className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 transition-colors"
                  title="تسجيل خروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 p-1">
              <div className="text-right">
                <div className="text-xs font-black text-white">أهلاً بك في menuz</div>
                <div className="text-[10px] text-emerald-200/80">انشئ منيو مطعمك في دقائق</div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => { onOpenAuth('login'); onClose(); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60"
                >
                  {t('navLogin')}
                </button>
                <button
                  onClick={() => { onOpenAuth('signup'); onClose(); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-orange-600 hover:bg-orange-500 text-white shadow-md cursor-pointer"
                >
                  انضم كصاحب مطعم
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content with Accordions */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-right">

          {/* 1. ACCORDION: Navigation & Core Pages */}
          <div className="rounded-2xl bg-emerald-950/40 dark:bg-slate-900/60 border border-emerald-800/40 dark:border-slate-800/80 overflow-hidden transition-all">
            <button
              onClick={() => toggleSection('navigation')}
              className="w-full p-3 flex items-center justify-between text-xs font-black text-emerald-200 dark:text-slate-200 hover:bg-emerald-900/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-orange-400" />
                <span>الصفحات الرئيسية والمنيو</span>
              </div>
              {openSections.navigation ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.navigation && (
              <div className="p-2 pt-0 space-y-1.5 border-t border-emerald-900/40 dark:border-slate-800/60">
                <button
                  onClick={() => { setActiveView('landing'); onClose(); }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all ${
                    activeView === 'landing'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'hover:bg-emerald-900/50 text-slate-200'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>الرئيسية (Landing Page)</span>
                </button>

                <button
                  onClick={() => { setActiveView('menu'); onClose(); }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeView === 'menu'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'hover:bg-emerald-900/50 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Utensils className="w-4 h-4 text-amber-300" />
                    <span>المنيو التفاعلي للزبائن</span>
                  </div>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-extrabold">معاينة</span>
                </button>

                <button
                  onClick={() => { setActiveView('admin'); onClose(); }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeView === 'admin'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'hover:bg-emerald-900/50 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-emerald-300" />
                    <span>لوحة التحكم وإدارة الأصناف</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-extrabold">الإدارة</span>
                </button>

                <button
                  onClick={() => { setActiveView('qr'); onClose(); }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeView === 'qr'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'hover:bg-emerald-900/50 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <QrCode className="w-4 h-4 text-orange-400" />
                    <span>توليد ورسم رمز QR الطاولات</span>
                  </div>
                  <span className="text-[9px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full font-extrabold">QR Studio</span>
                </button>

                <button
                  onClick={() => { setActiveView('blog'); onClose(); }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeView === 'blog'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'hover:bg-emerald-900/50 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    <span>مدونة menuz ودليل النجاح</span>
                  </div>
                  <span className="text-[9px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-extrabold">مقالات 📰</span>
                </button>

                <button
                  onClick={() => { setActiveView('payment-methods'); onClose(); }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                    activeView === 'payment-methods'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'hover:bg-emerald-900/50 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-4 h-4 text-emerald-300" />
                    <span>دليل طرق الدفع والاشتراك</span>
                  </div>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-extrabold">الدفع 💳</span>
                </button>

                {onOpenPrintablePdf && (
                  <button
                    onClick={() => { onOpenPrintablePdf(); onClose(); }}
                    className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all hover:bg-amber-500/20 text-amber-200 border border-amber-500/30 bg-amber-950/20"
                  >
                    <div className="flex items-center gap-2.5">
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>تحميل المنيو بصيغة PDF للطباعة</span>
                    </div>
                    <span className="text-[9px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full font-extrabold">PDF 📄</span>
                  </button>
                )}

                {onOpen2FA && (
                  <button
                    onClick={() => { onOpen2FA(); onClose(); }}
                    className="w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all hover:bg-cyan-900/40 text-cyan-200 border border-cyan-500/30 bg-cyan-950/20"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>رمز التحقق الثنائي 2FA</span>
                    </div>
                    <span className="text-[9px] bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded-full font-extrabold">2FA 🔒</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 2. ACCORDION: Account & Multi-Store Management */}
          <div className="rounded-2xl bg-emerald-950/40 dark:bg-slate-900/60 border border-emerald-800/40 dark:border-slate-800/80 overflow-hidden transition-all">
            <button
              onClick={() => toggleSection('account')}
              className="w-full p-3 flex items-center justify-between text-xs font-black text-emerald-200 dark:text-slate-200 hover:bg-emerald-900/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-amber-400" />
                <span>إدارة الحساب والمتاجر المضافة</span>
              </div>
              {openSections.account ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.account && (
              <div className="p-2 pt-0 space-y-1.5 border-t border-emerald-900/40 dark:border-slate-800/60">
                {onOpenUserProfile ? (
                  <button
                    onClick={() => { onOpenUserProfile(); onClose(); }}
                    className="w-full p-2.5 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-extrabold text-xs flex items-center justify-between shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      <span>بروفايل الحساب وإدارة الفروع</span>
                    </div>
                    <span className="text-[10px] bg-slate-950 text-amber-300 px-2 py-0.5 rounded-md">فتح</span>
                  </button>
                ) : null}

                <div className="p-2.5 rounded-xl bg-emerald-900/30 border border-emerald-800/40 text-[11px] space-y-1 text-emerald-200/90">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">حالة باقة البداية:</span>
                    <span className="text-amber-400 font-black">النسخة الاحترافية (Pro)</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-300">
                    <span>عدد الأصناف المتاحة:</span>
                    <span className="font-bold text-white">غير محدود ∞</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. ACCORDION: Language Selector (10 Languages) */}
          <div className="rounded-2xl bg-emerald-950/40 dark:bg-slate-900/60 border border-emerald-800/40 dark:border-slate-800/80 overflow-hidden transition-all">
            <button
              onClick={() => toggleSection('languages')}
              className="w-full p-3 flex items-center justify-between text-xs font-black text-emerald-200 dark:text-slate-200 hover:bg-emerald-900/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>لغات النظام والمنيو ({currentLangObj.nativeName})</span>
              </div>
              {openSections.languages ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.languages && (
              <div className="p-2 pt-0 border-t border-emerald-900/40 dark:border-slate-800/60">
                <div className="grid grid-cols-2 gap-1.5 pt-1.5">
                  {languages.map((l) => {
                    const isSelected = currentLang === l.code;
                    return (
                      <button
                        key={l.code}
                        onClick={() => {
                          onLanguageChange(l.code);
                        }}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-orange-600 text-white shadow-sm ring-1 ring-orange-400'
                            : 'bg-emerald-900/40 hover:bg-emerald-800/60 text-slate-200'
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <span>{l.flag}</span>
                          <span>{l.nativeName}</span>
                        </span>
                        <span className="text-[9px] opacity-70 uppercase font-mono">{l.code}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 4. ACCORDION: Currency Selector */}
          <div className="rounded-2xl bg-emerald-950/40 dark:bg-slate-900/60 border border-emerald-800/40 dark:border-slate-800/80 overflow-hidden transition-all">
            <button
              onClick={() => toggleSection('currency')}
              className="w-full p-3 flex items-center justify-between text-xs font-black text-emerald-200 dark:text-slate-200 hover:bg-emerald-900/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>عملة العرض والتحويل ({activeCurrencyObj.symbol} - {activeCurrencyObj.code})</span>
              </div>
              {openSections.currency ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.currency && (
              <div className="p-2 pt-0 border-t border-emerald-900/40 dark:border-slate-800/60 space-y-1.5">
                <div className="text-[10px] text-emerald-300/80 font-bold px-1 pt-1 flex items-center justify-between">
                  <span>تحويل أسعار تلقائي وحي</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.values(currencies).map((c) => {
                    const isSelected = currentCurrency === c.code;
                    return (
                      <button
                        key={c.code}
                        onClick={() => {
                          onCurrencyChange(c.code);
                        }}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                            : 'bg-emerald-900/40 hover:bg-emerald-800/60 text-slate-200'
                        }`}
                      >
                        <span>{c.symbol} {c.code}</span>
                        <span className="text-[9px] opacity-80 truncate max-w-[60px]">{c.nameAr}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 5. ACCORDION: Platform Solutions & AI Waiter */}
          <div className="rounded-2xl bg-emerald-950/40 dark:bg-slate-900/60 border border-emerald-800/40 dark:border-slate-800/80 overflow-hidden transition-all">
            <button
              onClick={() => toggleSection('features')}
              className="w-full p-3 flex items-center justify-between text-xs font-black text-emerald-200 dark:text-slate-200 hover:bg-emerald-900/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>ميزات menuz والذكاء الاصطناعي</span>
              </div>
              {openSections.features ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.features && (
              <div className="p-2 pt-0 space-y-1.5 border-t border-emerald-900/40 dark:border-slate-800/60">
                <div className="p-2 rounded-xl bg-emerald-900/30 text-[11px] flex items-center gap-2 text-slate-200">
                  <Bot className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>نادل ذكاء اصطناعي تفاعلي للإجابة واقتراح الأصناف</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-900/30 text-[11px] flex items-center gap-2 text-slate-200">
                  <Printer className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>طباعة إيصالات الطاولات والمطبخ مباشرة</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-900/30 text-[11px] flex items-center gap-2 text-slate-200">
                  <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تقارير مبيعات وتصدير Excel / CSV</span>
                </div>
              </div>
            )}
          </div>

          {/* 6. ACCORDION: Help & Technical Support */}
          <div className="rounded-2xl bg-emerald-950/40 dark:bg-slate-900/60 border border-emerald-800/40 dark:border-slate-800/80 overflow-hidden transition-all">
            <button
              onClick={() => toggleSection('support')}
              className="w-full p-3 flex items-center justify-between text-xs font-black text-emerald-200 dark:text-slate-200 hover:bg-emerald-900/30 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>الدعم الفني والمساعدة</span>
              </div>
              {openSections.support ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {openSections.support && (
              <div className="p-2 pt-0 space-y-2 border-t border-emerald-900/40 dark:border-slate-800/60">
                {onOpenSupportHub && (
                  <div className="space-y-1.5">
                    <button
                      onClick={() => { onOpenSupportHub('owner'); onClose(); }}
                      className="w-full p-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 text-white font-extrabold text-xs flex items-center justify-between shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4" />
                        <span>غرفة دعم أصحاب المطاعم 🏪</span>
                      </div>
                      <span className="text-[10px] bg-slate-950/40 px-2 py-0.5 rounded-md">دردشة ⚡</span>
                    </button>

                    <button
                      onClick={() => { onOpenSupportHub('guest'); onClose(); }}
                      className="w-full p-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-between shadow-sm transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>دردشة ودعم الزباين والرواد 🍔</span>
                      </div>
                      <span className="text-[10px] bg-slate-950/40 px-2 py-0.5 rounded-md">مباشر</span>
                    </button>
                  </div>
                )}

                <a
                  href="https://wa.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-2.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-emerald-700/50"
                >
                  <Headphones className="w-4 h-4 text-emerald-300" />
                  <span>تواصل المباشر عبر الواتساب</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </div>
            )}
          </div>

        </div>

        {/* Drawer Footer CTA */}
        <div className="p-4 border-t border-emerald-800/80 dark:border-slate-800 bg-emerald-950/90 dark:bg-slate-900 shrink-0 space-y-2">
          {!currentUser && (
            <button
              onClick={() => { onOpenAuth('signup'); onClose(); }}
              className="w-full py-3 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-xl flex items-center justify-center gap-2 cursor-pointer transform active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>امتلك منيو رقمي الآن مجاناً</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[10px] text-emerald-300/60 dark:text-slate-500 font-bold pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>آمن ومشفر SSL 100%</span>
            </span>
            <span>menuz v2.5 © 2026</span>
          </div>
        </div>

      </div>
    </div>
  );
};
