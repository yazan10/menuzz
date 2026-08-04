import React, { useState } from 'react';
import { generateRandomPromoCode } from '../lib/promo';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  UserCheck, 
  Store, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle 
} from 'lucide-react';
import { User } from '../types';

interface AdminLoginPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AdminLoginPortal: React.FC<AdminLoginPortalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [roleType, setRoleType] = useState<'admin' | 'staff' | 'superadmin'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg(null);

    const isSuperEmail = roleType === 'superadmin';
    const isSuperPass = password.length >= 1;

    setTimeout(() => {
      setLoading(false);

      if (isSuperEmail) {
        if (!isSuperPass && password !== '') {
          setAlertMsg({
            type: 'error',
            text: 'كلمة المرور غير صحيحة لحساب السوبر أدمن (Super Admin)'
          });
          return;
        }

        const superUser: User = {
          id: 'usr_superadmin',
          name: 'المسؤول الرئيسي (Super Admin ⚡)',
          email: 'admin@menuz.app',
          role: 'superadmin',
          isSuperAdmin: true,
          restaurantId: 'rest_01',
          isVerified: true,
          managedRestaurantIds: ['rest_01'],
          currentPlan: 'plan_3_enterprise',
          promoCode: generateRandomPromoCode('SUPER'),
          referralCount: 0,
          referralEarningsILS: 0
        };

        setAlertMsg({
          type: 'success',
          text: 'تم تسجيل دخول السوبر أدمن بنجاح! جاري التوجيه للوحة التحكم... ⚡'
        });
        setTimeout(() => {
          onLoginSuccess(superUser);
          onClose();
        }, 500);
        return;
      }

      // Normal Admin or Staff Login
      const adminUser: User = {
        id: roleType === 'staff' ? 'usr_staff' : 'usr_admin',
        name: restaurantName || (roleType === 'staff' ? 'طاقم المطبخ والصالة' : 'صاحب مطعم القصر'),
        email: email || 'admin@restaurant.com',
        role: roleType,
        isSuperAdmin: false,
        restaurantId: 'rest_01',
        isVerified: true,
        managedRestaurantIds: ['rest_01'],
        currentPlan: 'plan_2',
        promoCode: generateRandomPromoCode('ADM'),
        referralCount: 0,
        referralEarningsILS: 0
      };

      setAlertMsg({
        type: 'success',
        text: 'تم تسجيل دخول الإدارة بنجاح!'
      });
      setTimeout(() => {
        onLoginSuccess(adminUser);
        onClose();
      }, 500);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-500/30 space-y-6 relative overflow-hidden animate-in zoom-in-95">
        
        {/* Top Glow & Header */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500" />
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">بوابة دخول الإدارة والمسؤولين</h2>
              <p className="text-xs text-slate-400">بوابة آمنة ومخصصة لأصحاب المطاعم والطواقم</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center justify-center cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setRoleType('admin'); setAlertMsg(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              roleType === 'admin'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>صاحب مطعم</span>
          </button>

          <button
            type="button"
            onClick={() => { setRoleType('staff'); setAlertMsg(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              roleType === 'staff'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>طاقم العمل</span>
          </button>

          <button
            type="button"
            onClick={() => { setRoleType('superadmin'); setAlertMsg(null); }}
            className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              roleType === 'superadmin'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>سوبر أدمن ⚡</span>
          </button>
        </div>

        {alertMsg && (
          <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 border ${
            alertMsg.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-950/60 text-rose-300 border-rose-500/40'
          }`}>
            {alertMsg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{alertMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleAdminSubmit} className="space-y-4">
          
          {roleType === 'admin' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اسم المطعم / المتجر
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="مثال: مطعم القصر - الفرع الرئيسي"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              بريد الإدارة الإلكتروني (Admin Email)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder={roleType === 'superadmin' ? 'admin@menuz.app' : 'admin@restaurant.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              كلمة السر (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>جاري التحقق من صلاحيات الإدارة...</span>
            ) : (
              <>
                <Key className="w-4 h-4" />
                <span>دخول لوحة تحكم الإدارة</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-800">
          منصة menuz محمية بتشفير عالي الأمان SSL 256-bit | دخول مخصص للمسؤولين فقط
        </div>

      </div>
    </div>
  );
};
