import React from 'react';
import { 
  CreditCard, 
  Wallet, 
  Building2, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  PhoneCall, 
  Truck, 
  UtensilsCrossed, 
  Sparkles,
  Zap,
  Globe2
} from 'lucide-react';
import { MenuzLogo } from './MenuzLogo';

interface PaymentMethodsPageProps {
  onNavigateHome: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
}

export const PaymentMethodsPage: React.FC<PaymentMethodsPageProps> = ({
  onNavigateHome,
  onOpenAuth,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold dir-rtl transition-colors duration-300">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0b4f42] via-[#093d33] to-[#073028] text-white py-12 px-4 relative overflow-hidden border-b border-emerald-900">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all mb-6 cursor-pointer border border-white/10"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            <span>العودة للرئيسية</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-amber-300 text-xs font-black mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>دليل وسلسلة الاشتراكات والمدفوعات</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                طرق الدفع المتاحة في منصة Menuz
              </h1>
              <p className="text-sm sm:text-base text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
                نوفر لكم وسائل دفع مرنة وآمنة تناسب كافة أصحاب المطاعم للاشتراك في الباقات، بالإضافة لتوضيح كامل لخيارات الدفع التي يمكنك تفعيلها لزبائن مطعمك.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
              <ShieldCheck className="w-8 h-8 text-amber-300 mx-auto mb-1" />
              <span className="text-xs font-black text-white block">حماية وأمان 100%</span>
              <span className="text-[10px] text-emerald-200 block">فواتير رسمية ودعم مباشر</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        
        {/* SECTION 1: Platform Subscriptions Payment Methods */}
        <div className="space-y-6">
          <div className="border-r-4 border-orange-500 pr-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-orange-500" />
              <span>أولاً: طرق سداد اشتراكات باقات المنصة (لأصحاب المطاعم)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              يمكنك الاشتراك في أي من باقات Menuz (الشهرية أو السنوية) عبر إحدى الوسائل الرسمية المعتمدة التالية:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Method 1: Bank Transfer */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                1. التحويل البنكي المباشر (Bank Transfer / IBAN)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                يمكنك تحويل قيمة الاشتراك مباشرة إلى حسابنا البنكي الرسمي (رقم الحساب أو IBAN). بمجرد إرسال إيصال التحويل لفريق الدعم يتم تفعيل الحساب فوراً.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>إصدار فاتورة ضريبية رسمية فورية</span>
              </div>
            </div>

            {/* Method 2: Cash via Authorized Agents */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Banknote className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                2. الدفع نقداً (كاش) عبر المندوبين والوكلاء
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                نوفر خيار سداد قيمة الاشتراك نقداً من خلال زيارة مندوب الخدمة المعتمد لمطعمك أو عبر مكاتب وكلاء منصة Menuz المعتمدين في مدينتك.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>تحصيل مباشر وسند قبض رسمي</span>
              </div>
            </div>

            {/* Method 3: Digital Wallets */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                3. المحافظ الرقمية وتطبيقات الدفع السريع
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                تدعم المنصة التحويل عبر المحافظ المعتمدة مثل: زين كاش (ZainCash)، كليك (CliQ)، فودافون كاش، تطبيق Bit، بالإضافة إلى حسابات PayPal.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>سداد فوري ودقيق بالأجهزة الذكية</span>
              </div>
            </div>

            {/* Method 4: Online Invoiced Card Payment */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                4. الفواتير الإلكترونية والبطاقات البنكية
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                يقوم فريق المبيعات بإرسال رابط فاتورة إلكتروني مخصص لبطاقتك (Visa / Mastercard / Mada) لسداد الرسوم بسهولة عبر رابط مشفر وآمن.
              </p>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>تأكيد أوتوماتيكي وتجديد ميسر</span>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: Restaurant Customer Payment Controls (Dine-In vs Delivery) */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white space-y-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 border-r-4 border-emerald-400 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>مرونة كاملة لصاحب المطعم</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              ثانياً: طرق الدفع المتاحة لزبائن مطعمك (داخل المطعم والديلفري)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              تمنح منصة Menuz صاحب المطعم حرية القرار والصلاحية المطلقة لتحديد وتفعيل خيارات الدفع المناسبة لعملاء مطعمه، سواء عند طلب التوصيل أو عند تناول الطعام داخل المطعم.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Delivery Payment Controls */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">1. خيارات دفع طلبات التوصيل (Delivery)</h3>
                  <p className="text-[11px] text-slate-300">يحدد صاحب المطعم الخيارات التي تظهر للزبون عند الديلفري</p>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>الدفع نقداً عند الاستلام (Cash on Delivery):</strong> الخيار الأكثر شيوعاً.</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>الدفع عند الباب عبر جهاز POS:</strong> يتيح لسائق التوصيل حمل شبكة دفع.</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>التحويل عبر المحفظة الرقمية:</strong> كليك / زين كاش / فودافون كاش.</span>
                </li>
              </ul>
            </div>

            {/* Dine-In Payment Controls */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">2. خيارات الدفع داخل المطعم (Dine-In / Tables)</h3>
                  <p className="text-[11px] text-slate-300">تحكم كامل بطريقة سداد الوجبات للطاولات</p>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>الدفع كاش عند الطاولة أو الكاشير:</strong> السداد التقليدي بعد الأكل.</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>الدفع الإلكتروني المباشر عبر QR:</strong> مسح كود الطاولة والدفع بالهاتف.</span>
                </li>
                <li className="flex items-center gap-2 p-2 rounded-xl bg-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>نقاط البيع المدمجة (POS Terminal):</strong> ربط سريع بفرع المطعم.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* SECTION 3: FAQ & Support CTA */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-orange-500" />
              <span>هل لديك استفسار حول الاشتراك أو تفعيل طرق الدفع؟</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              فريق المبيعات والدعم الفني متواجد على مدار الساعة لمساعدتك في إتمام عملية الاشتراك باحترافية وسرعة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>انشئ حساب مطعمك الآن واستمتع بجميع الميزات</span>
            </button>

            <a
              href="https://wa.me/?text=استفسار%20عن%20طرق%20الدفع%20والاشتراك%20في%20منصة%20Menuz"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              <span>تواصل مع المبيعات عبر الواتساب</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
