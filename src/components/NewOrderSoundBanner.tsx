import React, { useState, useEffect } from 'react';
import { Bell, VolumeX, ArrowLeft, ShoppingBag } from 'lucide-react';
import { stopOrderAlertSound, subscribeOrderAlertState } from '../lib/notifications';

interface NewOrderSoundBannerProps {
  onViewOrders?: () => void;
}

export const NewOrderSoundBanner: React.FC<NewOrderSoundBannerProps> = ({ onViewOrders }) => {
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    const unsub = subscribeOrderAlertState((ringing) => {
      setIsRinging(ringing);
    });
    return unsub;
  }, []);

  if (!isRinging) return null;

  const handleStopAndNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopOrderAlertSound();
    if (onViewOrders) {
      onViewOrders();
    }
  };

  const handleMuteOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopOrderAlertSound();
  };

  return (
    <div 
      onClick={handleStopAndNavigate}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] sm:w-full bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 text-white p-4 rounded-3xl shadow-2xl border-2 border-white/80 backdrop-blur-md cursor-pointer animate-in zoom-in-95 duration-300 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold hover:scale-102 transition-transform"
      role="alert"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Animated Bell Icon */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center animate-bounce">
            <Bell className="w-6 h-6 text-yellow-200 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400"></span>
          </span>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 text-right space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
              <span>تنبيه: طلب جديد للمطعم! 🛎️</span>
            </span>
            <span className="text-[10px] bg-black/30 font-mono px-2 py-0.5 rounded-full text-amber-200 border border-white/20">
              صوت التنبيه يعمل 🔊
            </span>
          </div>
          <p className="text-xs text-orange-100 font-medium truncate">
            انقر في أي مكان لإيقاف صوت التنبيه والانتقال لجدول الطلبات.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleStopAndNavigate}
            className="px-3.5 py-2 rounded-2xl bg-white text-rose-700 hover:bg-amber-50 font-black text-xs shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            title="إيقاف الصوت واستعراض الطلب"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">استعراض الطلب</span>
            <ArrowLeft className="w-3 h-3" />
          </button>

          <button
            onClick={handleMuteOnly}
            className="p-2 rounded-2xl bg-black/20 hover:bg-black/40 text-white font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-all"
            title="كتم الصوت فقط"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
