import React, { useEffect, useState } from 'react';
import { Sparkles, Utensils, QrCode } from 'lucide-react';
import { MenuzLogo } from './MenuzLogo';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('جاري تشغيل منصة menuz الرقمية...');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 20) + 12;
        return next > 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress < 30) {
      setStatusText('جاري تحميل المنصة وقواعد البيانات السحابية...');
    } else if (progress < 65) {
      setStatusText('تجهيز أطباق المنيو التفاعلية والعملات اللحظية...');
    } else if (progress < 95) {
      setStatusText('تهيئة بوابات الدفع الإلكترونية وأنظمة QR...');
    } else {
      setStatusText('أهلاً بك! جاهز للانطلاق...');
    }

    if (progress === 100) {
      const fadeTimeout = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 400);
      }, 500);
      return () => clearTimeout(fadeTimeout);
    }
  }, [progress, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#07322a] dark:bg-slate-950 text-white font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold select-none transition-opacity duration-500 p-6 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center space-y-6">
        
        {/* Animated Brand Logo Badge */}
        <div className="relative flex flex-col items-center gap-2">
          <div className="absolute inset-0 rounded-3xl bg-orange-500/30 blur-xl animate-ping" />
          <MenuzLogo size="xl" />
          <p className="text-xs font-bold text-emerald-200/90 tracking-wide mt-1">
            نظام المنيو والطلبات الرقمية الذكي
          </p>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full space-y-2.5 pt-4">
          <div className="flex justify-between items-center text-xs font-extrabold text-emerald-200/80 px-1">
            <span className="truncate max-w-[220px] text-right">{statusText}</span>
            <span className="text-orange-400 font-mono text-sm">{progress}%</span>
          </div>

          <div className="w-full h-2.5 bg-emerald-950/80 dark:bg-slate-900 rounded-full p-0.5 border border-emerald-800/60 overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-200 shadow-[0_0_12px_rgba(249,115,22,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Feature Badges Grid */}
        <div className="pt-6 grid grid-cols-3 gap-3 w-full text-[10px] font-bold text-emerald-100/70 border-t border-emerald-900/60">
          <div className="flex flex-col items-center gap-1.5 p-2 bg-emerald-900/30 rounded-xl border border-emerald-800/40">
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>مسح QR فوري</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2 bg-emerald-900/30 rounded-xl border border-emerald-800/40">
            <Utensils className="w-4 h-4 text-orange-400" />
            <span>طلب مباشر</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 p-2 bg-emerald-900/30 rounded-xl border border-emerald-800/40">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>دعم متعدد للغات</span>
          </div>
        </div>

      </div>
    </div>
  );
};
