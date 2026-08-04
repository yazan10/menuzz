import React from 'react';
import { 
  Home, 
  Utensils, 
  QrCode, 
  LayoutDashboard, 
  User as UserIcon 
} from 'lucide-react';
import { User, Language } from '../types';
import { getTranslation } from '../lib/translations';

interface MobileBottomNavProps {
  activeView: 'landing' | 'menu' | 'admin' | 'qr' | 'blog' | 'notfound' | 'payment-methods';
  setActiveView: (view: 'landing' | 'menu' | 'admin' | 'qr' | 'blog' | 'notfound' | 'payment-methods') => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenUserProfile?: () => void;
  currentLang: Language;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  setActiveView,
  currentUser,
  onOpenAuth,
  onOpenUserProfile,
  currentLang,
}) => {
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLang, key);

  const navItems = [
    {
      id: 'landing',
      label: t('navHome'),
      icon: Home,
      action: () => setActiveView('landing'),
    },
    {
      id: 'menu',
      label: t('navUserMenu'),
      icon: Utensils,
      action: () => setActiveView('menu'),
    },
    {
      id: 'qr',
      label: 'رمز QR',
      icon: QrCode,
      action: () => setActiveView('qr'),
    },
    {
      id: 'admin',
      label: t('navAdminDashboard'),
      icon: LayoutDashboard,
      action: () => setActiveView('admin'),
    },
    {
      id: 'profile',
      label: currentUser ? 'حسابي' : t('navLogin'),
      icon: UserIcon,
      action: () => {
        if (currentUser && onOpenUserProfile) {
          onOpenUserProfile();
        } else {
          onOpenAuth('login');
        }
      },
    },
  ];

  // Calculate active index
  let activeIndex = navItems.findIndex((item) => item.id === activeView);
  if (activeIndex === -1) {
    activeIndex = 0;
  }

  // Calculate position percentage considering layout
  const leftPosition = `calc(var(--padding) + ${activeIndex} * ((100% - (var(--padding) * 2)) / 5))`;

  return (
    <div className="md:hidden fixed bottom-3 left-2 right-2 z-50 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold flex justify-center">
      <div className="cyber-signboard-nav">
        <div className="cyber-switch-nav">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;
            const isQrItem = item.id === 'qr';

            if (isQrItem) {
              return (
                <React.Fragment key={item.id}>
                  <input
                    type="radio"
                    id={`cyber-nav-opt-${item.id}`}
                    name="cyber-mobile-nav"
                    checked={isActive}
                    onChange={item.action}
                  />
                  <label
                    htmlFor={`cyber-nav-opt-${item.id}`}
                    onClick={item.action}
                    className={`cyber-label-nav ${isActive ? 'active' : ''} relative -mt-5`}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-600 border-2 border-amber-300 shadow-[0_0_20px_rgba(249,115,22,0.8)] ring-4 ring-amber-400/30 scale-110'
                          : 'bg-[#082a22] border-2 border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.4)] text-amber-300 hover:scale-105'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-amber-300 transition-transform duration-300" />
                    </div>
                    <span className="label-text mt-0.5 font-extrabold text-[10px] text-amber-300">
                      {item.label}
                    </span>
                    <span className="glare-nav"></span>
                  </label>
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={item.id}>
                <input
                  type="radio"
                  id={`cyber-nav-opt-${item.id}`}
                  name="cyber-mobile-nav"
                  checked={isActive}
                  onChange={item.action}
                />
                <label
                  htmlFor={`cyber-nav-opt-${item.id}`}
                  onClick={item.action}
                  className={`cyber-label-nav ${isActive ? 'active' : ''}`}
                >
                  <Icon className="icon" />
                  <span className="label-text">{item.label}</span>
                  <span className="glare-nav"></span>
                </label>
              </React.Fragment>
            );
          })}

          <div
            className="cyber-highlight-nav"
            style={{ left: leftPosition }}
          >
            <div className="highlight-inner-nav"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
