import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Store, 
  Plus, 
  Check, 
  Crown, 
  Settings, 
  Globe, 
  Trash2, 
  Sparkles, 
  X, 
  Palette, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Edit3
} from 'lucide-react';
import { User, Restaurant, SubscriptionPlanTier } from '../types';
import { subscriptionPlansList } from '../data/mockData';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updatedUser: User) => void;
  userStores: Restaurant[];
  activeRestaurant: Restaurant;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onUpdateRestaurant: (updatedRestaurant: Restaurant) => void;
  onCreateRestaurant: (newRestaurant: Restaurant) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  userStores,
  activeRestaurant,
  onSelectRestaurant,
  onUpdateRestaurant,
  onCreateRestaurant
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'stores' | 'plans'>('stores');
  const [editingStore, setEditingStore] = useState<Restaurant | null>(null);
  const [isCreatingNewStore, setIsCreatingNewStore] = useState(false);

  // Form states for Store Editing / Creation
  const [storeName, setStoreName] = useState('');
  const [storeNameEn, setStoreNameEn] = useState('');
  const [storeTagline, setStoreTagline] = useState('');
  const [storeLogo, setStoreLogo] = useState('');
  const [storeBanner, setStoreBanner] = useState('');
  const [storePrimaryColor, setStorePrimaryColor] = useState('#0b4f42');
  const [storeCurrency, setStoreCurrency] = useState('₪');
  const [storePhone, setStorePhone] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storePlan, setStorePlan] = useState<SubscriptionPlanTier>('plan_2');
  const [showBranding, setShowBranding] = useState(true);

  if (!isOpen) return null;

  const handleOpenEditStore = (store: Restaurant) => {
    setEditingStore(store);
    setIsCreatingNewStore(false);
    setStoreName(store.name);
    setStoreNameEn(store.nameEn);
    setStoreTagline(store.tagline);
    setStoreLogo(store.logo);
    setStoreBanner(store.heroBanner);
    setStorePrimaryColor(store.primaryColor);
    setStoreCurrency(store.currency);
    setStorePhone(store.phone);
    setStoreEmail(store.email);
    setStorePlan(store.plan);
    setShowBranding(store.showPoweredByBranding);
  };

  const handleOpenCreateStore = () => {
    setEditingStore(null);
    setIsCreatingNewStore(true);
    setStoreName('');
    setStoreNameEn('');
    setStoreTagline('أحدث الوجبات والمشروبات المتميزة');
    setStoreLogo('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop');
    setStoreBanner('https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=400&fit=crop');
    setStorePrimaryColor('#0b4f42');
    setStoreCurrency('₪');
    setStorePhone('+970 59 000 0000');
    setStoreEmail('info@newstore.com');
    setStorePlan('plan_2');
    setShowBranding(true);
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return;

    if (isCreatingNewStore) {
      const newRest: Restaurant = {
        id: `rest_${Date.now()}`,
        slug: storeName.toLowerCase().replace(/\s+/g, '-'),
        name: storeName,
        nameEn: storeNameEn || storeName,
        tagline: storeTagline,
        logo: storeLogo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=150&h=150&fit=crop',
        heroBanner: storeBanner || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=400&fit=crop',
        primaryColor: storePrimaryColor,
        secondaryColor: '#ea580c',
        fontFamily: 'IBM Plex Sans Arabic',
        currency: storeCurrency,
        phone: storePhone,
        email: storeEmail,
        darkThemeEnabled: false,
        plan: storePlan,
        showPoweredByBranding: storePlan === 'plan_3_enterprise' ? showBranding : true,
        ownerId: user.id,
        socialLinks: { whatsapp: storePhone },
        branches: [
          {
            id: `br_${Date.now()}`,
            name: 'الفرع الرئيسي',
            nameEn: 'Main Branch',
            address: 'الفرع الأول - وسط المدينة',
            phone: storePhone,
            city: 'المركز',
            lat: 31.9038,
            lng: 35.2034,
            openingHours: '10:00 ص - 11:00 م',
            tablesCount: 10,
            active: true
          }
        ]
      };
      onCreateRestaurant(newRest);
      setIsCreatingNewStore(false);
    } else if (editingStore) {
      const updated: Restaurant = {
        ...editingStore,
        name: storeName,
        nameEn: storeNameEn,
        tagline: storeTagline,
        logo: storeLogo,
        heroBanner: storeBanner,
        primaryColor: storePrimaryColor,
        currency: storeCurrency,
        phone: storePhone,
        email: storeEmail,
        plan: storePlan,
        showPoweredByBranding: storePlan === 'plan_3_enterprise' ? showBranding : true
      };
      onUpdateRestaurant(updated);
      setEditingStore(null);
    }
  };

  const currentPlanDetails = subscriptionPlansList.find(p => p.id === user.currentPlan) || subscriptionPlansList[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-[#0b4f42] text-white p-6 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-4">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'} 
              alt={user.name} 
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">{user.name}</h2>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>{currentPlanDetails.nameAr}</span>
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">{user.email} • {userStores.length} مواقع ومتاجر مسجلة</p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 pt-3 gap-3 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('stores'); setEditingStore(null); setIsCreatingNewStore(false); }}
            className={`pb-3 px-4 font-extrabold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'stores' && !editingStore && !isCreatingNewStore
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>مواقعي ومتاجري ({userStores.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('plans'); setEditingStore(null); setIsCreatingNewStore(false); }}
            className={`pb-3 px-4 font-extrabold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'plans'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>باقات الاشتراك وترقية الحساب</span>
          </button>

          <button
            onClick={() => { setActiveTab('profile'); setEditingStore(null); setIsCreatingNewStore(false); }}
            className={`pb-3 px-4 font-extrabold text-xs flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>ملفي الشخصي الحساب</span>
          </button>
        </div>

        {/* Body Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          
          {/* TAB 1: STORES LIST & MANAGEMENT */}
          {activeTab === 'stores' && !editingStore && !isCreatingNewStore && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">إدارة المواقع والمتاجر الإلكترونية</h3>
                  <p className="text-xs text-slate-500">اختر الموقع النشط للمعاينة والتحكم أو أضف مواقع جديدة لمطاعمك</p>
                </div>

                <button
                  onClick={handleOpenCreateStore}
                  className="px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء موقع / مطعم جديد</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userStores.map((st) => {
                  const isActive = st.id === activeRestaurant.id;
                  return (
                    <div 
                      key={st.id}
                      className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                        isActive 
                          ? 'border-orange-500 bg-orange-50/40 dark:bg-orange-950/20 ring-2 ring-orange-500/30' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img src={st.logo} alt={st.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-700" />
                            <div>
                              <h4 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                                <span>{st.name}</span>
                                {isActive && (
                                  <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">النشط حالياً</span>
                                )}
                              </h4>
                              <p className="text-xs text-slate-500 line-clamp-1">{st.tagline}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">📍 {st.branches.length} فروع</span>
                          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">💵 العملة: {st.currency}</span>
                          <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl">
                            {st.showPoweredByBranding ? '⚡ يتضمن شعار menuz' : '✨ حقوق المطور محذوفة (Pro)'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                        {!isActive ? (
                          <button
                            onClick={() => onSelectRestaurant(st)}
                            className="flex-1 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all cursor-pointer"
                          >
                            تحديد كموقع نشط
                          </button>
                        ) : (
                          <span className="flex-1 py-2 text-center text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                            <Check className="w-4 h-4" /> الموقع المحدد للعمل
                          </span>
                        )}

                        <button
                          onClick={() => handleOpenEditStore(st)}
                          className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل المتجر</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EDIT OR CREATE STORE FORM */}
          {(editingStore || isCreatingNewStore) && (
            <form onSubmit={handleSaveStore} className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isCreatingNewStore ? 'إنشاء موقع ومجر مطعم جديد' : `تعديل إعدادات متجر: ${editingStore?.name}`}
                </h3>
                <button
                  type="button"
                  onClick={() => { setEditingStore(null); setIsCreatingNewStore(false); }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                >
                  إلغاء والعودة
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المطعم / المتجر (بالعربي)</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="مثال: مطعم شاورما القدس"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اسم المطعم (بالإنجليزي)</label>
                  <input
                    type="text"
                    value={storeNameEn}
                    onChange={(e) => setStoreNameEn(e.target.value)}
                    placeholder="Jerusalem Shawarma"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الوصف المختصر (التاجلين)</label>
                <input
                  type="text"
                  value={storeTagline}
                  onChange={(e) => setStoreTagline(e.target.value)}
                  placeholder="أشهى الأطباق الشرقية والغربية بأعلى جودة"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رابط الشعار (Logo Image URL)</label>
                  <input
                    type="text"
                    value={storeLogo}
                    onChange={(e) => setStoreLogo(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رابط غلاف المنيو (Hero Banner URL)</label>
                  <input
                    type="text"
                    value={storeBanner}
                    onChange={(e) => setStoreBanner(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">اللون الرئيسي للموقع</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={storePrimaryColor}
                      onChange={(e) => setStorePrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={storePrimaryColor}
                      onChange={(e) => setStorePrimaryColor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">العملة الافتراضية للمنيو</label>
                  <select
                    value={storeCurrency}
                    onChange={(e) => setStoreCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                  >
                    <option value="₪">شيكل إسرائيلي (₪)</option>
                    <option value="ر.س">ريال سعودي (ر.س)</option>
                    <option value="$">دولار أمريكي ($)</option>
                    <option value="€">يورو (€)</option>
                    <option value="د.أ">دينار أردني (د.أ)</option>
                    <option value="د.إ">درهم إماراتي (د.إ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">هاتف التواصل والواتساب</label>
                  <input
                    type="text"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    placeholder="+970 59 000 0000"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                  />
                </div>
              </div>

              {/* BRANDING CONTROL & PLAN SETTINGS */}
              <div className="bg-slate-100 dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">باقة الموقع وحقوق العلامة (Branding)</h4>
                      <p className="text-xs text-slate-500">اختر الباقة المناسبة لموقع هذا المطعم</p>
                    </div>
                  </div>

                  <select
                    value={storePlan}
                    onChange={(e) => setStorePlan(e.target.value as SubscriptionPlanTier)}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border text-xs font-bold text-orange-600 outline-none"
                  >
                    <option value="plan_1">الباقة المجانية (تجريبية 7 أيام)</option>
                    <option value="plan_2">الباقة الأساسية (650 ₪ سنوياً)</option>
                    <option value="plan_3">باقة التميز (950 ₪ سنوياً)</option>
                    <option value="plan_4_enterprise">باقة شاملة (2100 ₪ سنوياً)</option>
                  </select>
                </div>

                {/* BRANDING TOGGLE OPTION */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white block">إظهار شعار "تم إنشاء الموقع بواسطة menuz" بالأسفل</span>
                    <span className="text-[11px] text-slate-500">
                      {(storePlan === 'plan_4_enterprise' || storePlan === 'plan_3_enterprise')
                        ? 'يمكنك حذف وإخفاء الحقوق بالكامل لأن هذا المتجر على باقة المؤسسات الشاملة' 
                        : 'إلغاء الحقوق متاح حصرياً في الباقة الشاملة'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="branding-toggle"
                      disabled={storePlan !== 'plan_4_enterprise' && storePlan !== 'plan_3_enterprise'}
                      checked={(storePlan === 'plan_4_enterprise' || storePlan === 'plan_3_enterprise') ? showBranding : true}
                      onChange={(e) => setShowBranding(e.target.checked)}
                      className="w-5 h-5 accent-orange-600 rounded cursor-pointer disabled:opacity-50"
                    />
                    <label htmlFor="branding-toggle" className="text-xs font-bold cursor-pointer">
                      {showBranding ? 'مفعّل (يظهر بالأسفل)' : 'مخفي (بدون حقوق)'}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setEditingStore(null); setIsCreatingNewStore(false); }}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold shadow-md"
                >
                  حفظ وتحديث بيانات المتجر
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: PLANS & UPGRADE */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">اختر الباقة المناسبة لتوسيع نشاطك</h3>
                <p className="text-xs text-slate-500">اختر الباقة المناسبة لإدارة عدة مطاعم، ربط الدفع المباشر، وتخصيص حقوق المنيو</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlansList.map((p) => {
                  const isCurrent = user.currentPlan === p.id;
                  return (
                    <div 
                      key={p.id}
                      className={`p-6 rounded-3xl border flex flex-col justify-between relative transition-all ${
                        isCurrent 
                          ? 'border-orange-500 bg-orange-50/30 dark:bg-orange-950/20 ring-2 ring-orange-500/40 shadow-lg' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      {isCurrent && (
                        <div className="absolute -top-3 right-6 bg-orange-600 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-md">
                          باقتك الحالية
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{p.nameAr}</h4>
                          <p className="text-xs text-slate-500 mt-1">{p.description}</p>
                        </div>

                        <div className="text-xl font-black text-orange-600">
                          {p.priceDisplayAr}
                        </div>

                        <ul className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                          {p.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-6">
                        {!isCurrent ? (
                          <button
                            onClick={() => {
                              onUpdateUser({ ...user, currentPlan: p.id });
                            }}
                            className="w-full py-3 rounded-2xl bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold text-xs hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all cursor-pointer shadow-md"
                          >
                            الترقية لهذه الباقة
                          </button>
                        ) : (
                          <div className="w-full py-2.5 text-center text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                            مفعّلة على حسابك
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: USER PROFILE EDIT */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl mx-auto">
              <div className="text-center space-y-2">
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop'} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-orange-500/50 mx-auto shadow-xl"
                />
                <h3 className="text-xl font-black text-slate-900 dark:text-white">{user.name}</h3>
                <p className="text-xs text-slate-500">مدير عام ومؤسس المواقع المسجلة</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => onUpdateUser({ ...user, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => onUpdateUser({ ...user, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">رقم الهاتف التواصل</label>
                  <input
                    type="text"
                    value={user.phone || ''}
                    onChange={(e) => onUpdateUser({ ...user, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
