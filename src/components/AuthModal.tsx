import React, { useState } from 'react';
import { generateRandomPromoCode } from '../lib/promo';
import { X, Mail, Lock, Store, KeyRound, CheckCircle2, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';
import { User, Language } from '../types';
import { getTranslation } from '../lib/translations';
import { MenuzLogo } from './MenuzLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot' | 'verify';
  onLoginSuccess: (user: User) => void;
  currentLang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onLoginSuccess,
  currentLang,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [location, setLocation] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [snapchat, setSnapchat] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // Loading & alerts
  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLang, key);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg(null);

    const isSuperEmail = email.trim().toLowerCase() === 'admin@menuz.app' || email.trim().toLowerCase() === 'superadmin@menuz.app';
    const isSuperPass = password.length >= 1;

    setTimeout(() => {
      setLoading(false);

      if (isSuperEmail) {
        if (!isSuperPass) {
          setAlertMsg({
            type: 'error',
            text: 'كلمة المرور غير صحيحة لحساب السوبر أدمن'
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
          text: 'تم تسجيل الدخول بصلاحيات السوبر أدمن (Super Admin) بنجاح! ⚡'
        });
        setTimeout(() => {
          onLoginSuccess(superUser);
          onClose();
        }, 500);
        return;
      }

      // Normal admin/owner login
      const mockUser: User = {
        id: 'usr_admin',
        name: restaurantName || 'صاحب المطعم',
        email: email || 'admin@restaurant.com',
        role: 'admin',
        isSuperAdmin: false,
        restaurantId: 'rest_01',
        isVerified: true,
        managedRestaurantIds: ['rest_01'],
        currentPlan: 'plan_2',
        promoCode: generateRandomPromoCode('MNZ'),
        referralCount: 0,
        referralEarningsILS: 0
      };
      setAlertMsg({
        type: 'success',
        text: 'تم تسجيل الدخول بنجاح!'
      });
      setTimeout(() => {
        onLoginSuccess(mockUser);
        onClose();
      }, 500);
    }, 600);
  };

  const handleSuperAdminQuickLogin = () => {
    setEmail('admin@menuz.app');
    setPassword('••••••••');
    setLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      setLoading(false);
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
      setAlertMsg({ type: 'success', text: 'تم تفعيل لوحة المسؤول الرئيسي ⚡' });
      setTimeout(() => {
        onLoginSuccess(superUser);
        onClose();
      }, 600);
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      setLoading(false);
      const googleUser: User = {
        id: 'usr_google_' + Date.now(),
        name: restaurantName || 'صاحب المطعم (Google)',
        email: email || 'owner.google@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        role: 'admin',
        restaurantId: 'rest_01',
        isVerified: true,
        managedRestaurantIds: ['rest_01'],
        currentPlan: 'plan_2',
        promoCode: generateRandomPromoCode('GGL'),
        referralCount: 0,
        referralEarningsILS: 0
      };
      setAlertMsg({ type: 'success', text: 'تم تسجيل الدخول بحساب Google بنجاح! جاري التوجيه...' });
      setTimeout(() => {
        onLoginSuccess(googleUser);
        onClose();
      }, 600);
    }, 900);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg(null);

    try {
      // Call mock OTP endpoint
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setLoading(false);
      
      setAlertMsg({
        type: 'success',
        text: data.message || 'تم إرسال رمز التفعيل بنجاح! استخدم الكود 123456 للتأكيد.'
      });
      setMode('verify');
    } catch {
      setLoading(false);
      setAlertMsg({
        type: 'success',
        text: 'تم إرسال كود تفعيل الحساب إلى البريد الإلكتروني (رمز التجربة: 123456).'
      });
      setMode('verify');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg(null);

    setTimeout(() => {
      setLoading(false);
      if (otpCode.trim() === '123456' || otpCode.length >= 4) {
        const newUser: User = {
          id: 'usr_' + Date.now(),
          name: restaurantName || 'مطعم جديد',
          email: email,
          role: 'admin',
          restaurantId: 'rest_01',
          isVerified: true,
          managedRestaurantIds: ['rest_01'],
          currentPlan: 'plan_2'
        };
        onLoginSuccess(newUser);
        setAlertMsg({ type: 'success', text: 'تم تأكيد حسابك بنجاح! جاري التوجيه...' });
        setTimeout(() => onClose(), 1000);
      } else {
        setAlertMsg({ type: 'error', text: 'رمز التحقق غير صحيح! استخدم الرمز التجريبي: 123456' });
      }
    }, 800);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg(null);

    try {
      await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setLoading(false);
      setAlertMsg({
        type: 'success',
        text: `تم إرسال تعليمات استعادة كلمة المرور إلى البريد: ${email}`
      });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold">
        
        {/* Header Ribbon matching menuz theme */}
        <div className="bg-[#0b4f42] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-2">
            <MenuzLogo size="sm" />
          </div>

          <h3 className="text-2xl font-black text-white">
            {mode === 'login' && t('loginTitle')}
            {mode === 'signup' && t('signupTitle')}
            {mode === 'verify' && t('verifyEmailTitle')}
            {mode === 'forgot' && t('forgotPasswordTitle')}
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            {mode === 'login' && 'مرحباً بك مجدداً، أدخل بياناتك للوصول للوحة التحكم'}
            {mode === 'signup' && 'ابدأ بإطلاق المنيو الرقمي الخاص بمطعمك مجاناً'}
            {mode === 'verify' && 'أدخل كود التحقق المكون من 6 أرقام لتفعيل الحساب'}
            {mode === 'forgot' && 'أدخل بريدك الإلكتروني لاستلام رابط إعادة تعيين كلمة المرور'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          
          {alertMsg && (
            <div className={`p-4 rounded-2xl mb-6 text-sm font-semibold flex items-start gap-3 ${
              alertMsg.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}>
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{alertMsg.text}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@restaurant.com"
                    className="w-full pr-11 pl-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t('passwordLabel')}
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setAlertMsg(null); }}
                    className="text-xs text-orange-600 hover:underline font-bold"
                  >
                    {t('forgotPasswordLink')}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-11 pl-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                  </>
                )}
              </button>



              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold">أو المتابعة باستخدام</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>تسجيل الدخول بواسطة Google</span>
              </button>

              <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                {t('noAccount')}{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setAlertMsg(null); }}
                  className="text-orange-600 font-extrabold hover:underline"
                >
                  أنشئ حساباً جديداً
                </button>
              </div>
            </form>
          )}

          {/* SIGNUP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              
              {/* Owner Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم صاحب المطعم / المدير 👤
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="مثال: أ. محمد أحمد"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Email / Gmail */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني (Gmail / Email) 📧
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner.restaurant@gmail.com"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  كلمة المرور 🔒
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Restaurant Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المطعم أو الكافيه 🏪
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="مثال: مطعم و كافيه القصر"
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  وصف المطعم والخدمات 📝
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="أرقى المأكولات والمشروبات الساخنة والباردة بأجواء مميزة..."
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Logo & Banner URLs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رابط اللوجو 🖼️
                  </label>
                  <input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رابط الغلاف 🌄
                  </label>
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Address / Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  موقع/عنوان المطعم 📍
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="شارع الملك فهد، حي العليا، الرياض"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Social Handles Section */}
              <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-2xl space-y-2 border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                  روابط حاسبات السوشيال ميديا (تظهر كأيقونات تفاعلية في خلفية المنيو) 🌐
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="إنستغرام: @username"
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="الواتساب: 966501234567"
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    placeholder="فيسبوك: username"
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={tiktok}
                    onChange={(e) => setTiktok(e.target.value)}
                    placeholder="تيك توك: @username"
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
                  />
                  <input
                    type="text"
                    value={snapchat}
                    onChange={(e) => setSnapchat(e.target.value)}
                    placeholder="سناب شات: @username"
                    className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 col-span-2"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-orange-200" />
                    <span>إنشاء حساب وتأكيد البيانات 🚀</span>
                  </>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-bold">أو المتابعة باستخدام</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>إنشاء حساب بواسطة Google</span>
              </button>

              <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                {t('haveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setAlertMsg(null); }}
                  className="text-orange-600 font-extrabold hover:underline"
                >
                  تسجيل الدخول
                </button>
              </div>
            </form>
          )}

          {/* OTP VERIFY FORM */}
          {mode === 'verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('otpLabel')}
                </label>
                <div className="relative">
                  <KeyRound className="w-5 h-5 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pr-11 pl-4 py-3 text-center tracking-widest text-lg font-bold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">كود تجريبي للاختبار السريع: <span className="font-bold text-orange-600">123456</span></p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : t('verifyBtn')}
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute right-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@restaurant.com"
                    className="w-full pr-11 pl-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : t('sendResetLink')}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-bold"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
