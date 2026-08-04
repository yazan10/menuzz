import React, { useState } from 'react';
import { generateRandomPromoCode } from '../lib/promo';
import { 
  Gift, 
  Copy, 
  CheckCircle, 
  DollarSign, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  Send, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  Award,
  AlertCircle
} from 'lucide-react';
import { User, PromoPayoutRequest } from '../types';
import { formatPrice } from '../lib/currencies';
import { CopyClipboardButton } from './CopyClipboardButton';
import { SocialDoodleFollow } from './SocialDoodleFollow';

interface PromoAffiliateSectionProps {
  currentUser: User | null;
  currentCurrency?: string;
  isSuperAdmin?: boolean;
}

export const PromoAffiliateSection: React.FC<PromoAffiliateSectionProps> = ({
  currentUser,
  currentCurrency = 'ILS',
  isSuperAdmin = false,
}) => {
  // User's custom or random generated promo code
  const [userCode] = useState<string>(() => {
    if (currentUser?.promoCode) return currentUser.promoCode;
    const namePrefix = currentUser?.name ? currentUser.name.split(' ')[0].toUpperCase() : 'MNZ';
    return generateRandomPromoCode(namePrefix);
  });

  const referralCount = currentUser?.referralCount || 0; // Zeroed out for clean launch
  
  // Rule: Every 100 signups = 53 ILS
  const totalEarnedILS = Math.floor(referralCount / 100) * 53;
  const currentProgressCount = referralCount % 100;
  const remainingForNextTier = 100 - currentProgressCount;

  const [copied, setCopied] = useState(false);
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'jawwal_pay' | 'bank_transfer' | 'paypal' | 'cash'>('jawwal_pay');
  const [accountDetails, setAccountDetails] = useState('');
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState<string | null>(null);

  // List of payout requests for SuperAdmin (Zeroed out for launch)
  const [payoutRequests, setPayoutRequests] = useState<PromoPayoutRequest[]>([]);

  const handleCopyLink = () => {
    const promoLink = `${window.location.origin}/signup?promo=${userCode}`;
    navigator.clipboard.writeText(promoLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountDetails.trim()) return;

    const newReq: PromoPayoutRequest = {
      id: `pay_${Date.now()}`,
      userId: currentUser?.id || 'usr_me',
      userName: currentUser?.name || 'مستخدم مسجّل',
      promoCode: userCode,
      referralCount,
      amountILS: totalEarnedILS,
      payoutMethod,
      accountDetails,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setPayoutRequests((prev) => [newReq, ...prev]);
    setPayoutSuccessMsg(`تم إرسال طلب سحب مبلغ ${totalEarnedILS} ₪ بنجاح! سيتم التحويل خلال 24 ساعة ⚡`);
    setTimeout(() => {
      setPayoutSuccessMsg(null);
      setPayoutModalOpen(false);
      setAccountDetails('');
    }, 3000);
  };

  const handleApprovePayout = (id: string) => {
    setPayoutRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'completed' } : req))
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Banner Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-800 text-white p-8 shadow-2xl overflow-hidden border border-amber-400/30">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-amber-200 text-xs font-black backdrop-blur-md">
              <Gift className="w-4 h-4 text-amber-300" />
              <span>برنامج الشركاء والبرومو كود الرسمّي</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              لكل 100 مستخدم ينشئون حساباً كسب <span className="text-amber-300 underline underline-offset-4 font-black">53 شيقل (53 ₪)</span> فوراً!
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
              شارك رمز البرومو كود الخاص بك أو الرابط المباشر. كلما سُجل 100 مستخدم عن طريقك تحصل على 53 شيقل تحول مباشرة لحسابك أو جوال باي (Jawwal Pay).
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl border border-white/20 space-y-3 shrink-0 text-center md:text-right">
            <span className="text-xs font-bold text-amber-200 block">البرومو كود الخاص بك:</span>
            <div className="flex items-center justify-between gap-3 bg-slate-950/60 px-4 py-2.5 rounded-xl border border-amber-400/40">
              <span className="text-lg font-black tracking-widest text-amber-400 font-mono">
                {userCode}
              </span>
              <CopyClipboardButton
                textToCopy={userCode}
                initialTooltip="نسخ البرومو كود"
                copiedTooltip="تم النسخ!"
              />
            </div>
            <div className="flex items-center justify-between gap-2 bg-white/10 px-3 py-2 rounded-xl">
              <span className="text-xs text-slate-200 truncate dir-ltr font-mono">{`${window.location.origin}/signup?promo=${userCode}`}</span>
              <CopyClipboardButton
                textToCopy={`${window.location.origin}/signup?promo=${userCode}`}
                initialTooltip="نسخ رابط الدعوة المباشر"
                copiedTooltip="تم النسخ!"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress & Earnings Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Signups */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">إجمالي المسجلين بكودك</span>
            <span className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-600">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="my-4">
            <div className="text-3xl font-black text-slate-900 dark:text-white">
              {referralCount} <span className="text-xs text-slate-400 font-normal">مستخدم</span>
            </div>
            <div className="text-xs text-emerald-600 font-bold mt-1">
              يمثل {Math.floor(referralCount / 100)} دفعات مكتملة (100×)
            </div>
          </div>
        </div>

        {/* Total Earned ILS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">مجموع أرباحك المستحقة</span>
            <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="my-4">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {formatPrice(totalEarnedILS, currentCurrency)}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              أرباح مؤكدة جاهزة للسحب
            </div>
          </div>
          <button
            onClick={() => setPayoutModalOpen(true)}
            disabled={totalEarnedILS <= 0}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>طلب سحب الأرباح (Withdraw)</span>
          </button>
        </div>

        {/* Progress Bar to Next 53 ILS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">المكافأة القادمة (+53 ₪)</span>
            <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600">
              <Sparkles className="w-5 h-5" />
            </span>
          </div>
          
          <div className="my-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300">التقدم: {currentProgressCount} / 100</span>
              <span className="text-amber-600">متبقي {remainingForNextTier} مسجل</span>
            </div>

            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${currentProgressCount}%` }}
              />
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-tight">
            عند وصول التقدّم إلى 100/100 تُضاف 53 ₪ تلقائياً لرصيد أرباحك!
          </p>
        </div>

      </div>

      {/* SuperAdmin Payout Requests Table */}
      {isSuperAdmin && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>إدارة طلبات سحب أرباح البرومو كود (Super Admin Portal)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">مراجعة وتحويل المبالغ للمستخدمين وأصحاب المطاعم</p>
            </div>
            <span className="text-xs font-bold bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full border border-amber-500/20">
              خاص بالسوبر أدمن ⚡
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold">
                  <th className="p-3">صاحب الكود</th>
                  <th className="p-3">البرومو كود</th>
                  <th className="p-3">المسجلين</th>
                  <th className="p-3">المبلغ المستحق</th>
                  <th className="p-3">طريقة التحويل والتفاصيل</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payoutRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{req.userName}</td>
                    <td className="p-3 font-mono font-bold text-amber-600">{req.promoCode}</td>
                    <td className="p-3 font-bold">{req.referralCount} شخص</td>
                    <td className="p-3 font-black text-emerald-600">{formatPrice(req.amountILS, currentCurrency)}</td>
                    <td className="p-3 text-slate-500">{req.accountDetails}</td>
                    <td className="p-3 text-slate-400">{req.createdAt}</td>
                    <td className="p-3">
                      {req.status === 'completed' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[11px]">
                          تم التحويل ✅
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 font-bold text-[11px]">
                          قيد الانتظار ⏳
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {req.status === 'pending' ? (
                        <button
                          onClick={() => handleApprovePayout(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                        >
                          تأكيد التحويل ⚡
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">مكتمل</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payout Request Modal */}
      {payoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>طلب سحب أرباح البرومو كود</span>
              </h3>
              <button
                onClick={() => setPayoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {payoutSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center border border-emerald-200">
                {payoutSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleRequestPayout} className="space-y-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-between">
                  <span>المبلغ المطلوب سحبه:</span>
                  <span className="text-base font-black">{formatPrice(totalEarnedILS, currentCurrency)}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    اختر طريقة التحويل
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={(e: any) => setPayoutMethod(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold focus:outline-none"
                  >
                    <option value="jawwal_pay">جوال باي (Jawwal Pay)</option>
                    <option value="bank_transfer">تحويل بنكي (Bank Transfer - فلسطين/الأردن)</option>
                    <option value="paypal">بايبال (PayPal)</option>
                    <option value="cash">استلام نقدي (Cash)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    تفاصيل الحساب / الرقم للتحويل
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: 0599000000 أو رقم الآيبان IBAN..."
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPayoutModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>تأكيد طلب السحب</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Social Media Follow Section */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <SocialDoodleFollow />
      </div>

    </div>
  );
};
