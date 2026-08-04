import React from 'react';
import { 
  QrCode, 
  Printer, 
  Smartphone, 
  DollarSign, 
  BarChart3, 
  Palette, 
  Truck, 
  Gift, 
  CalendarClock, 
  Check, 
  Sparkles, 
  LogIn, 
  ChevronRight,
  ShieldCheck,
  Utensils
} from 'lucide-react';

import { Language } from '../types';
import { getTranslation, translations } from '../lib/translations';

interface GuestRestaurantFeaturesViewProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onViewDemoMenu?: () => void;
  currentLang?: Language;
}

export const GuestRestaurantFeaturesView: React.FC<GuestRestaurantFeaturesViewProps> = ({
  onOpenAuth,
  onViewDemoMenu,
  currentLang = 'ar',
}) => {
  const t = (key: keyof typeof translations.ar) => getTranslation((currentLang || 'ar') as Language, key);
  const features = [
    {
      id: 'feat_qr',
      title: 'المنيو الرقمي السريع كود QR',
      description: 'تصفح بصري مبهر على جوال الزبون بنقرة واحدة بدون تحميل تطبيقات، يفتح بأقل من ثانية واحدة مع صور عالية الدقة ودعم الوضع الليلي.',
      icon: QrCode,
      badge: 'تصفح فوري 📱',
      benefits: ['توفير 100% من مصاريف الطباعة الورقية', 'سرعة استجابة فائقة على جميع الأجهزة', 'عرض المكونات والسعرات الحرارية']
    },
    {
      id: 'feat_remind',
      title: 'تذكير تلقائي بالحجوزات قبل 30 دقيقة',
      description: 'نظام إشعارات ذكي يرسل تنبيهاً وتذكيراً تلقائياً داخل التطبيق للعميل قبل موعد حجزه بـ 30 دقيقة لمنع تخلف الحضور وضمان جاهزية الطاولة.',
      icon: CalendarClock,
      badge: 'تذكير ذكي ⏰',
      benefits: ['تقليل نسبة الغياب وتخلف الحضور بـ 85%', 'إرسال تفاصيل الطاولة والوقت بدقة', 'إشعار فوري داخل التطبيق وعلى الجوال']
    },
    {
      id: 'feat_order',
      title: 'نظام الطلب المباشر من الطاولة والتوصيل',
      description: 'يمكّن الزبون من تحديد وجباته واختيار الخيارات الفرعية وإرسال الطلب مباشرة للمطبخ أو طلب التوصيل للمنزل مع احتساب الرسوم.',
      icon: Smartphone,
      badge: 'زيادة المبيعات 35% 🍔',
      benefits: ['تقليل وقت الانتظار وتخفيف الضغط على الصالة', 'دعم الطلب السفري، التوصيل، والدفع المباشر', 'متابعة حالة التحضير لحظة بلحظة']
    },
    {
      id: 'feat_print',
      title: 'الطباعة الحرارية المباشرة للمطبخ والفواتير',
      description: 'ربط مباشر مع جميع طابعات المطبخ والـ POS (80mm & 58mm) لطباعة التذاكر الحرارية المكونة من رقم الطاولة، الوجبات، والملاحظات الخاصة.',
      icon: Printer,
      badge: 'طباعة حرارية 🖨️',
      benefits: ['منع أخطاء الطلبات بين الصالة والمطبخ', 'طباعة سريعة بنقرة زر بدون برامج وسيطة', 'توضيح خيارات الدفع والضريبة']
    },
    {
      id: 'feat_loyalty',
      title: 'نظام نقاط الولاء والخصومات التلقائية',
      description: 'برنامج مكافآت يمنح الزبائن نقاط ولاء تلقائية مقابل كل طلب يتم إتمامه عبر المنيو الرقمي واستبدالها بخصومات مباشرة تشجع على تكرار الزيارة.',
      icon: Gift,
      badge: 'برنامج الولاء ⭐',
      benefits: ['مضاعفة ولاء العملاء وزيادة معدل العودة', 'تحكم كامل بقيمة النقاط والخصومات', 'شفافية كاملة في رصيد نقاط الزبون']
    },
    {
      id: 'feat_fx',
      title: 'محرك العملات والتحديث اللحظي لأسعار الصرف',
      description: 'تحويل تلقائي بين 5+ عملات رئيسية (الشيقل ₪، الريال ﷼، الدينار JOD، الدولار $، اليورو €) مع تحديثات أسعار الصرف العالمية الحية.',
      icon: DollarSign,
      badge: 'أسعار صرف حية 💱',
      benefits: ['تسهيل قرار الشراء للسياح والضيوف', 'تحديث تلقائي بدون تدخل يدوي', 'دعم العملة المحلية الافتراضية']
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 text-xs font-black border border-orange-200 dark:border-orange-800/60 shadow-sm">
            <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>نظام المنيو والطلبات الذكية للمطاعم</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            ميزات منصة <span className="text-orange-600 dark:text-orange-500">menuz</span> لإدارة المطاعم
          </h1>

          <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            استعرض كافة المزايا والتقنيات المتاحة لمطعمك بدون بيانات وهمية. انضم الآن لإدارة مطعمك بالكامل وأتمتة الطلبات والحجوزات.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm shadow-xl shadow-orange-600/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>انضم كصاحب مطعم</span>
            </button>
            <button
              onClick={() => onOpenAuth('login')}
              className="px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <LogIn className="w-4 h-4 text-orange-500" />
              <span>تسجيل الدخول لحسابك</span>
            </button>
            {onViewDemoMenu && (
              <button
                onClick={onViewDemoMenu}
                className="px-5 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Utensils className="w-4 h-4 text-amber-300" />
                <span>تجربة منيو حي كعميل</span>
              </button>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.id}
                className="bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-black border border-slate-200/60 dark:border-slate-700">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-snug">
                    {feat.title}
                  </h3>

                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                    {feat.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                    {feat.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onOpenAuth('signup')}
                    className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-800 dark:text-slate-200 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>تفعيل الميزة لمطعمك</span>
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-8 border border-emerald-700/50 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-amber-300 text-xs font-black border border-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>سهولة الإعداد والتشغيل</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              هل أنت جاهز لنقل مطعمك إلى المستوى التالي؟
            </h2>
            <p className="text-xs font-medium text-emerald-100 max-w-xl">
              يمكنك إنشاء حسابك وإضافة وجباتك وطباعة أكواد الـ QR في أقل من 5 دقائق بدون أي تعقيدات تقنية.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-xl transition-all cursor-pointer active:scale-95"
            >
              انضم كصاحب مطعم الآن 🚀
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
