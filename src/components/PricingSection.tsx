import React, { useState } from 'react';
import { Check, X, Sparkles, ChevronDown, ChevronUp, ShieldCheck, Zap, ArrowRightLeft, TrendingUp, CreditCard } from 'lucide-react';
import { currencies, formatPriceFromILS, convertCurrency, getLastRatesUpdatedTime } from '../lib/currencies';
import { Language } from '../types';
import { getTranslation } from '../lib/translations';

interface PricingSectionProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  currentCurrency?: string;
  currentLang?: Language;
  onNavigatePaymentMethods?: () => void;
}

interface FeatureItem {
  text: string;
  included: boolean;
}

interface PlanData {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  yearlyPriceILS: number;
  monthlyPriceILS: number;
  yearlyDiscountNote: string;
  savingsILS: number;
  features: FeatureItem[];
  ctaText: string;
  footerNote: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ 
  onOpenAuth, 
  currentCurrency = 'ILS',
  onNavigatePaymentMethods 
}) => {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  // Converter Widget state
  const [calcAmount, setCalcAmount] = useState<number>(100);
  const [calcFrom, setCalcFrom] = useState<string>('USD');
  const [calcTo, setCalcTo] = useState<string>(currentCurrency);
  const [showConverter, setShowConverter] = useState<boolean>(false);

  const toggleExpand = (planId: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const activeCurrency = currencies[currentCurrency] || currencies.ILS;

  const getPlans = (): PlanData[] => {
    const isYearly = billingCycle === 'yearly';

    return [
      {
        id: 'free',
        name: isYearly ? 'باقة الانطلاق' : 'باقة الانطلاق (الاشتراك الحالي)',
        yearlyPriceILS: 0,
        monthlyPriceILS: 0,
        yearlyDiscountNote: 'مجانية للأبد',
        savingsILS: 0,
        ctaText: 'استمتع مجاناً الان',
        footerNote: 'استمتع مجاناً دون إدخال بيانات البطاقة',
        features: [
          { text: 'امكانية اضافة 15 عنصر', included: true },
          { text: 'امكانية اضافة 5 أقسام', included: true },
          { text: 'التحكم بروابط التواصل الاجتماعي', included: true },
          { text: 'لا تتضمن إعلانات', included: false },
          { text: 'احصائيات متقدمة', included: false },
          { text: 'Seo تحسين ظهور محركات البحث', included: false },
          { text: 'تعدد طرق العرض', included: false },
          { text: 'تعدد اللغات', included: false },
          { text: 'نبذة عنا', included: false },
          { text: 'أوقات العمل', included: false },
          { text: 'التقييمات', included: false },
          { text: 'نظام الطلبات من خلال القائمة', included: false },
          { text: 'إدارة الطاولات', included: false },
          { text: 'تعدد صور الغلاف', included: false },
          { text: 'تعدد صور العناصر', included: false },
          { text: 'اشتراطات هيئة الغذاء والدواء في السعودية', included: false },
          { text: 'مشرف واحد', included: false },
          { text: 'تطبيق الحجز', included: false },
          { text: 'تطبيق العروض الترويجية', included: false },
          { text: 'إمكانية إخفاء حقوق Menuz', included: false },
        ],
      },
      {
        id: 'basic',
        name: 'الباقة الأساسية',
        yearlyPriceILS: 2000,
        monthlyPriceILS: 200,
        yearlyDiscountNote: 'شهرين مجانًا مقارنة بالدفع الشهري!',
        savingsILS: 400,
        ctaText: 'ابدأ تجربتك المجانية (7 أيام)',
        footerNote: 'تجربة مجانية 7 أيام - تنبيه قبل 24س عبر التيليجرام والمنصة للترقية',
        features: [
          { text: 'امكانية اضافة 100 عنصر', included: true },
          { text: 'امكانية اضافة 15 قسم', included: true },
          { text: 'التحكم بروابط التواصل الاجتماعي', included: true },
          { text: 'لا تتضمن إعلانات', included: true },
          { text: 'احصائيات متقدمة', included: true },
          { text: 'Seo تحسين ظهور محركات البحث', included: true },
          { text: 'تعدد طرق العرض', included: true },
          { text: 'تعدد اللغات', included: true },
          { text: 'نبذة عنا', included: true },
          { text: 'أوقات العمل', included: true },
          { text: 'التقييمات', included: true },
          { text: 'نظام الطلبات من خلال القائمة', included: true },
          { text: 'إدارة الطاولات', included: true },
          { text: 'تعدد صور الغلاف', included: true },
          { text: 'تعدد صور العناصر', included: true },
          { text: 'اشتراطات هيئة الغذاء والدواء في السعودية', included: true },
          { text: 'مشرف واحد', included: true },
          { text: 'تطبيق الحجز (متاح بالمتجر)', included: true },
          { text: 'تطبيق العروض الترويجية (متاح بالمتجر)', included: true },
          { text: 'إمكانية إخفاء حقوق Menuz', included: false },
        ],
      },
      {
        id: 'excellence',
        name: 'باقة التميز',
        isPopular: true,
        badge: 'الأكثر طلباً ⭐',
        yearlyPriceILS: 2500,
        monthlyPriceILS: 250,
        yearlyDiscountNote: 'شهرين مجانًا مقارنة بالدفع الشهري!',
        savingsILS: 500,
        ctaText: 'ابدأ تجربتك المجانية (7 أيام)',
        footerNote: 'تجربة مجانية 7 أيام - تنبيه قبل 24س عبر التيليجرام والمنصة للترقية',
        features: [
          { text: 'عدد لا نهائي من العناصر', included: true },
          { text: 'عدد لا نهائي من الأقسام', included: true },
          { text: 'التحكم بروابط التواصل الاجتماعي', included: true },
          { text: 'لا تتضمن إعلانات', included: true },
          { text: 'احصائيات متقدمة', included: true },
          { text: 'Seo تحسين ظهور محركات البحث', included: true },
          { text: 'تعدد طرق العرض', included: true },
          { text: 'تعدد اللغات', included: true },
          { text: 'نبذة عنا', included: true },
          { text: 'أوقات العمل', included: true },
          { text: 'التقييمات', included: true },
          { text: 'نظام الطلبات من خلال القائمة', included: true },
          { text: 'إدارة الطاولات', included: true },
          { text: 'تعدد صور الغلاف', included: true },
          { text: 'تعدد صور العناصر', included: true },
          { text: 'اشتراطات هيئة الغذاء والدواء في السعودية', included: true },
          { text: '3 مشرفين', included: true },
          { text: 'تطبيق الحجز (متاح بالمتجر)', included: true },
          { text: 'تطبيق العروض الترويجية (متاح بالمتجر)', included: true },
          { text: 'إمكانية إخفاء حقوق Menuz', included: false },
        ],
      },
      {
        id: 'comprehensive',
        name: 'باقة شاملة',
        badge: 'شاملة بالكامل 🚀',
        yearlyPriceILS: 4500,
        monthlyPriceILS: 450,
        yearlyDiscountNote: 'شهرين مجانًا مقارنة بالدفع الشهري!',
        savingsILS: 900,
        ctaText: 'ابدأ تجربتك المجانية (7 أيام)',
        footerNote: 'تجربة مجانية 7 أيام - تنبيه قبل 24س عبر التيليجرام والمنصة للترقية',
        features: [
          { text: 'عدد لا نهائي من العناصر', included: true },
          { text: 'عدد لا نهائي من الأقسام', included: true },
          { text: 'التحكم بروابط التواصل الاجتماعي', included: true },
          { text: 'لا تتضمن إعلانات', included: true },
          { text: 'احصائيات متقدمة', included: true },
          { text: 'Seo تحسين ظهور محركات البحث', included: true },
          { text: 'تعدد طرق العرض', included: true },
          { text: 'تعدد اللغات', included: true },
          { text: 'نبذة عنا', included: true },
          { text: 'أوقات العمل', included: true },
          { text: 'التقييمات', included: true },
          { text: 'نظام الطلبات من خلال القائمة', included: true },
          { text: 'إدارة الطاولات', included: true },
          { text: 'تعدد صور الغلاف', included: true },
          { text: 'تعدد صور العناصر', included: true },
          { text: 'اشتراطات هيئة الغذاء والدواء في السعودية', included: true },
          { text: '10 مشرفين', included: true },
          { text: 'تطبيق الحجز', included: true },
          { text: 'تطبيق العروض الترويجية', included: true },
          { text: 'إمكانية إخفاء حقوق Menuz', included: true },
        ],
      },
    ];
  };

  const plans = getPlans();

  // Calculate live conversion
  const calcResult = convertCurrency(calcAmount, calcFrom, calcTo);
  const calcToCurr = currencies[calcTo] || currencies.ILS;
  const calcFromCurr = currencies[calcFrom] || currencies.USD;

  return (
    <section id="pricing" className="py-20 px-4 max-w-7xl mx-auto font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold text-xs">
          <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
          <span>باقات وااشتراكات Menuz بالعملة المحلية ({activeCurrency.nameAr})</span>
        </span>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          اختر الباقة المناسبة لطموح مطعمك
        </h2>

        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-medium">
          أسعار شفافة محولة تلقائياً حسب سعر الصرف في البورصة العالمية 24/7. اختر الدفع السنوي واحصل على شهرين مجاناً!
        </p>

        {/* Free Trial & Telegram 24h Alert Notice Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-sm shrink-0">🎁</span>
            <div>
              <span className="font-black text-slate-900 dark:text-white block sm:inline">الباقة المجانية والنسخة التجريبية: 7 أيام فقط</span>
              <span className="text-slate-600 dark:text-amber-200/80 mr-1 block sm:inline">
                (يتم إرسال تنبيه قبل 24 ساعة عبر بوت التيليجرام وإشعارات المنصة لتذكيرك بترقية باقتك قبل الانتهاء)
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shrink-0">
            تنبيهات آليّة 24h 🤖
          </span>
        </div>

        {/* Currency Banner Info & Live Forex Converter Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
          <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span>عرض الأسعار حالياً بـ: {activeCurrency.nameAr} ({activeCurrency.symbol})</span>
          </span>
          <button
            onClick={() => setShowConverter(!showConverter)}
            className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
            <span>{showConverter ? 'إخفاء محول البورصة' : 'محول العملات المباشر 📈'}</span>
          </button>
        </div>

        {/* LIVE FOREX CONVERTER WIDGET (BACKGROUND ENGINE POWERED) */}
        {showConverter && (
          <div className="mt-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl border border-emerald-500/30 shadow-2xl text-right animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm">محول أسعار الصرف الحي من البورصة 24/7</h4>
                  <p className="text-[11px] text-slate-400">أسعار حية ومحدثة من أسواق المال العالمية ({getLastRatesUpdatedTime()})</p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                1 USD ≈ {convertCurrency(1, 'USD', 'ILS').toFixed(2)} ₪
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* Amount Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">المبلغ المراد تحويله</label>
                <input
                  type="number"
                  min="0"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* From Currency */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">من عملة</label>
                <select
                  value={calcFrom}
                  onChange={(e) => setCalcFrom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
                >
                  {Object.values(currencies).map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.nameAr} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* To Currency */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">إلى عملة</label>
                <select
                  value={calcTo}
                  onChange={(e) => setCalcTo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold text-xs focus:outline-none focus:border-emerald-500"
                >
                  {Object.values(currencies).map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} - {curr.nameAr} ({curr.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculated Result Box */}
            <div className="mt-4 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-300 font-bold">النتيجة المحولة مباشرة:</span>
                <div className="text-xl font-black text-amber-300 mt-0.5">
                  {calcAmount} {calcFromCurr.symbol} = {calcResult < 10 ? calcResult.toFixed(2) : Math.round(calcResult).toLocaleString()} {calcToCurr.symbol}
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-lg font-bold">
                1 {calcFromCurr.code} = {convertCurrency(1, calcFrom, calcTo).toFixed(2)} {calcToCurr.symbol}
              </span>
            </div>
          </div>
        )}

        {/* Billing Cycle Switcher (Monthly vs Yearly) */}
        <div className="pt-4 flex items-center justify-center">
          <div className="bg-slate-200/80 dark:bg-slate-800 p-1 rounded-2xl flex items-center gap-1 shadow-inner border border-slate-300/60 dark:border-slate-700/60">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              دفع شهري
            </button>

            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>دفع سنوي</span>
              <span className="bg-emerald-950 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-black animate-bounce">
                وفر شهرين 🎁
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        {plans.map((plan) => {
          const isExpanded = !!expandedPlans[plan.id];
          const isPopular = plan.isPopular;

          const displayPriceILS = billingCycle === 'yearly' ? plan.yearlyPriceILS : plan.monthlyPriceILS;
          const formattedPrice = formatPriceFromILS(displayPriceILS, currentCurrency);
          const billingSuffix = billingCycle === 'yearly' ? 'سنوياً' : 'شهرياً';

          let formattedSavingsNote = '';
          if (plan.savingsILS > 0) {
            const savingsFormatted = formatPriceFromILS(plan.savingsILS, currentCurrency);
            formattedSavingsNote = `≈ وفر ${savingsFormatted.formatted}`;
          }

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 ${
                isPopular
                  ? 'bg-gradient-to-b from-[#09473b] to-[#04241d] dark:from-slate-900 dark:to-slate-950 text-white border-2 border-orange-500 shadow-2xl scale-[1.02] z-10'
                  : 'bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Top Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-white px-3.5 py-1 rounded-full text-[11px] font-black shadow-md whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div>
                {/* Plan Title */}
                <h3 className="text-xl font-black mb-1 pt-2">{plan.name}</h3>

                {/* Savings / Discount tag */}
                {billingCycle === 'yearly' && plan.yearlyPriceILS > 0 ? (
                  <div className="mb-4 space-y-1">
                    <p className={`text-[11px] font-bold ${isPopular ? 'text-amber-300' : 'text-orange-600 dark:text-orange-400'}`}>
                      {plan.yearlyDiscountNote}
                    </p>
                    <p className="text-[10px] font-extrabold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md inline-block">
                      {formattedSavingsNote}
                    </p>
                  </div>
                ) : (
                  <p className={`text-xs mb-4 ${isPopular ? 'text-emerald-200/80' : 'text-slate-500'}`}>
                    {plan.yearlyPriceILS === 0 ? 'بدون رسوم تجديد' : 'مرونة في الإلغاء والاشتراك'}
                  </p>
                )}

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800">
                  <span className={`text-3xl sm:text-4xl font-black tracking-tight ${isPopular ? 'text-amber-300' : 'text-slate-900 dark:text-white'}`}>
                    {plan.yearlyPriceILS === 0 ? 'مجاناً' : formattedPrice.formatted}
                  </span>
                  {plan.yearlyPriceILS > 0 && (
                    <span className={`text-xs font-bold ${isPopular ? 'text-emerald-200/80' : 'text-slate-500'}`}>
                      / {billingSuffix}
                    </span>
                  )}
                </div>

                {/* Features List with Smooth Expand/Collapse Fade Animation & Adaptive Blur */}
                <div className="relative mb-4">
                  <ul className="space-y-2.5 text-xs font-bold">
                    {/* Always visible top 6 features */}
                    {plan.features.slice(0, 6).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-right">
                        {feat.included ? (
                          <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${isPopular ? 'bg-orange-500 text-white' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="p-0.5 rounded-full shrink-0 mt-0.5 bg-rose-500/15 text-rose-500 dark:text-rose-400">
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        <span className={
                          feat.included 
                            ? (isPopular ? "text-slate-100" : "text-slate-700 dark:text-slate-200") 
                            : (isPopular ? "text-slate-400 line-through opacity-70" : "text-slate-400 line-through opacity-70")
                        }>
                          {feat.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Collapsible remaining features with smooth max-height & opacity fade animation */}
                  {plan.features.length > 6 && (
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        isExpanded
                          ? 'max-h-[1000px] opacity-100 pt-2.5'
                          : 'max-h-0 opacity-0 pointer-events-none'
                      }`}
                    >
                      <ul className="space-y-2.5 text-xs font-bold">
                        {plan.features.slice(6).map((feat, idx) => (
                          <li key={idx + 6} className="flex items-start gap-2 text-right animate-in fade-in duration-300">
                            {feat.included ? (
                              <div className={`p-0.5 rounded-full shrink-0 mt-0.5 ${isPopular ? 'bg-orange-500 text-white' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'}`}>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            ) : (
                              <div className="p-0.5 rounded-full shrink-0 mt-0.5 bg-rose-500/15 text-rose-500 dark:text-rose-400">
                                <X className="w-3.5 h-3.5 stroke-[3]" />
                              </div>
                            )}
                            <span className={
                              feat.included 
                                ? (isPopular ? "text-slate-100" : "text-slate-700 dark:text-slate-200") 
                                : (isPopular ? "text-slate-400 line-through opacity-70" : "text-slate-400 line-through opacity-70")
                            }>
                              {feat.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Blurred gradient effect matching card background when collapsed */}
                  {!isExpanded && plan.features.length > 6 && (
                    <div className={`absolute inset-x-0 bottom-0 h-16 pointer-events-none backdrop-blur-[2px] transition-opacity duration-300 ${
                      isPopular
                        ? 'bg-gradient-to-t from-[#04241d] via-[#04241d]/80 to-transparent'
                        : 'bg-gradient-to-t from-white via-white/80 to-transparent dark:from-slate-900 dark:via-slate-900/80'
                    }`} />
                  )}
                </div>

                {/* Show More / Show Less Toggle Button */}
                {plan.features.length > 6 && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(plan.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all mb-6 cursor-pointer ${
                      isPopular
                        ? 'bg-emerald-950/80 hover:bg-emerald-900 text-amber-300 border border-emerald-700/50'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{isExpanded ? 'عرض أقل' : 'عرض المزيد'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* Bottom CTA & Footer note */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => onOpenAuth('signup')}
                  className={`w-full py-3 px-4 rounded-2xl font-black text-xs shadow-lg transition-all cursor-pointer transform active:scale-95 flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/30'
                      : plan.yearlyPriceILS === 0
                      ? 'bg-emerald-800 hover:bg-emerald-700 text-white'
                      : 'bg-orange-600 hover:bg-orange-500 text-white'
                  }`}
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{plan.ctaText}</span>
                </button>

                {onNavigatePaymentMethods && (
                  <button
                    type="button"
                    onClick={onNavigatePaymentMethods}
                    className="w-full py-2.5 px-3 rounded-2xl font-black text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-orange-500" />
                    <span>طرق الدفع والاشتراك المتاحة 💳</span>
                  </button>
                )}

                <p className={`text-[10px] text-center font-bold flex items-center justify-center gap-1 ${
                  isPopular ? 'text-emerald-200/80' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{plan.footerNote}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
