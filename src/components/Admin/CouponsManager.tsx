import React, { useState } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Percent, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Sparkles,
  Search,
  Filter,
  AlertCircle,
  BarChart2
} from 'lucide-react';
import { Coupon, Language } from '../../types';
import { formatPrice } from '../../lib/currencies';

interface CouponsManagerProps {
  coupons: Coupon[];
  onUpdateCoupons: (updatedCoupons: Coupon[]) => void;
  currentCurrency?: string;
  currentLang?: Language;
}

export const CouponsManager: React.FC<CouponsManagerProps> = ({
  coupons,
  onUpdateCoupons,
  currentCurrency = 'ILS',
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'percentage' | 'fixed'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState<string>('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState<number>(20);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(50);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(50);
  const [expiryDate, setExpiryDate] = useState<string>('2026-12-31');
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [active, setActive] = useState<boolean>(true);

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleToggleStatus = (id: string) => {
    const updated = coupons.map(c => c.id === id ? { ...c, active: !c.active } : c);
    onUpdateCoupons(updated);
  };

  const handleDelete = (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    onUpdateCoupons(updated);
  };

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setCode('');
    setType('percentage');
    setValue(20);
    setMinOrderAmount(50);
    setMaxDiscountAmount(50);
    setExpiryDate('2026-12-31');
    setUsageLimit(100);
    setActive(true);
    setShowAddModal(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setType(c.type);
    setValue(c.value);
    setMinOrderAmount(c.minOrderAmount || 0);
    setMaxDiscountAmount(c.maxDiscountAmount || 0);
    setExpiryDate(c.expiryDate || '2026-12-31');
    setUsageLimit(c.usageLimit || 100);
    setActive(c.active);
    setShowAddModal(true);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const formattedCode = code.trim().toUpperCase();

    if (editingCoupon) {
      const updated = coupons.map(c => c.id === editingCoupon.id ? {
        ...c,
        code: formattedCode,
        type,
        value,
        minOrderAmount,
        maxDiscountAmount: type === 'percentage' ? maxDiscountAmount : undefined,
        expiryDate,
        usageLimit,
        active,
      } : c);
      onUpdateCoupons(updated);
    } else {
      const newCoupon: Coupon = {
        id: `coup_${Date.now()}`,
        code: formattedCode,
        type,
        value,
        minOrderAmount,
        maxDiscountAmount: type === 'percentage' ? maxDiscountAmount : undefined,
        expiryDate,
        usageLimit,
        timesUsed: 0,
        active,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onUpdateCoupons([newCoupon, ...coupons]);
    }

    setShowAddModal(false);
  };

  // Filtered List
  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'active') return matchesSearch && c.active;
    if (filterType === 'percentage') return matchesSearch && c.type === 'percentage';
    if (filterType === 'fixed') return matchesSearch && c.type === 'fixed';
    return matchesSearch;
  });

  // Analytics Calculation
  const totalActive = coupons.filter(c => c.active).length;
  const totalRedeemed = coupons.reduce((sum, c) => sum + c.timesUsed, 0);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-l from-orange-600 via-amber-600 to-orange-700 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 -mt-8 -ml-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 backdrop-blur-md rounded-2xl">
              <Tag className="w-6 h-6 text-yellow-200" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black">نظام إدارة الخصومات والقسائم (Coupons & Promo Codes)</h2>
          </div>
          <p className="text-xs text-orange-100 max-w-xl">
            أنشئ أكواد وقسائم خصم مخصصة لزبائنك لزيادة مبيعات مطعمك، وحث العملاء على الطلب مجدداً بنسب مئوية أو مبالغ ثابتة!
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="relative z-10 px-5 py-3 rounded-2xl bg-white text-orange-700 font-extrabold text-xs sm:text-sm hover:bg-orange-50 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>إضافة كود خصم جديد</span>
        </button>
      </div>

      {/* Analytics Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-bold">أكواد الخصم النشطة</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalActive} أكواد</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-bold">إجمالي مرّات الاستخدام</span>
            <div className="text-2xl font-black text-orange-600 dark:text-orange-400">{totalRedeemed} استخدام</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-bold">أعلى كوبون استجابة</span>
            <div className="text-base font-black text-slate-900 dark:text-white truncate max-w-[150px]">
              {coupons[0]?.code || 'لا يوجد'}
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث باسم كود الخصم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {[
            { id: 'all', label: 'الكل' },
            { id: 'active', label: 'النشطة فقط' },
            { id: 'percentage', label: 'نسبة مئوية %' },
            { id: 'fixed', label: 'مبلغ ثابت' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                filterType === f.id
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Global Filter Definition for Bump Texture */}
      <svg className="hidden">
        <filter id="bump">
          <feTurbulence
            result="noise"
            numOctaves={3}
            baseFrequency="0.7"
            type="fractalNoise"
          />
          <feSpecularLighting
            in="noise"
            result="specular"
            lightingColor="#fffffc"
            specularExponent={25}
            specularConstant={0.8}
            surfaceScale={0.15}
          >
            <fePointLight z={210} y={100} x={100} />
          </feSpecularLighting>
          <feComposite
            result="noise2"
            operator="in"
            in="specular"
            in2="SourceGraphic"
          />
          <feBlend mode="screen" in2="noise2" in="SourceGraphic" />
        </filter>
      </svg>

      {/* Coupons Grid Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.map((c) => (
          <div
            key={c.id}
            className={`p-5 rounded-3xl border transition-all relative overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg flex flex-col justify-between items-center ${
              c.active
                ? 'border-slate-200 dark:border-slate-800'
                : 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50 dark:bg-slate-950/50'
            }`}
          >
            {/* Top Control Bar */}
            <div className="w-full flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-orange-500/10 text-orange-600 font-mono font-black text-xs tracking-wider flex items-center gap-1 border border-orange-500/20">
                  <Tag className="w-3.5 h-3.5" />
                  {c.code}
                </span>
                <button
                  onClick={() => handleCopy(c.code)}
                  title="نسخ الكود"
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 transition-all"
                >
                  {copiedCode === c.code ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                onClick={() => handleToggleStatus(c.id)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black flex items-center gap-1 transition-all ${
                  c.active
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                }`}
              >
                {c.active ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" /> مفعّل
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" /> متوقف
                  </>
                )}
              </button>
            </div>

            {/* Uiverse Holographic Ticket Card Visual */}
            <div className="my-2 py-1">
              <div className="coupon-ticket-card mx-auto">
                <div className="notes">♪♪♪♪♪</div>
                <div className="notes">♪♪♪♪</div>
                <div className="notes">♪♪♪♪♪</div>

                <div className="header">
                  DISCOUNT
                  <div className="symbol">✁</div>
                </div>
                
                <div className="body flex flex-col justify-center items-center text-slate-950 font-sans">
                  <em className="not-italic text-sm font-black font-mono tracking-widest text-slate-900 bg-white/70 px-2 py-0.5 rounded-md border border-slate-300 shadow-sm mb-1">
                    {c.code}
                  </em>
                  <span className="text-base font-black text-orange-950 block">
                    خصم {c.type === 'percentage' ? `%${c.value}` : formatPrice(c.value, currentCurrency)}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-800 block mt-0.5">
                    {c.minOrderAmount ? `حد أدنى للطلب: ${formatPrice(c.minOrderAmount, currentCurrency)}` : 'بدون حد أدنى'}
                  </span>
                  <span className="text-[9px] text-slate-700 block mt-1 font-mono">
                    ينتهي: {c.expiryDate || 'مفتوح'}
                  </span>
                </div>

                <div className="footer">
                  <div className="number">
                    كوبون <span className="bold font-mono">{c.code}</span>
                  </div>
                  <div className="barcode"></div>
                </div>

                <div className="bg holographic"></div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
              <span className="text-[11px] font-bold text-slate-500">
                استخدم {c.timesUsed} / {c.usageLimit || '∞'} مرّة
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold transition-all"
                >
                  تعديل الكود
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredCoupons.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
            <Tag className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-sm font-bold text-slate-500">لا توجد أكواد خصم مضافة بحسب الفلتر الحالي</p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white font-extrabold text-xs shadow-md"
            >
              إضافة كود خصم جديد الآن
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 text-right relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-orange-600" />
                <span>{editingCoupon ? 'تعديل كود الخصم' : 'إضافة كود خصم جديد'}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  كود الخصم (Coupon Code) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: MENUZ20"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-black text-slate-900 dark:text-white uppercase tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    نوع الخصم
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت ({currentCurrency})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    قيمة الخصم {type === 'percentage' ? '(%)' : `(${currentCurrency})`} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    الحد الأدنى للطلب ({currentCurrency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {type === 'percentage' && (
                  <div>
                    <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                      أقصى مبلغ للخصم ({currentCurrency})
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={maxDiscountAmount}
                      onChange={(e) => setMaxDiscountAmount(Number(e.target.value))}
                      className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    تاريخ الانتهاء
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                    أقصى عدد للاستخدام
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="coupon_active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded border-slate-300"
                />
                <label htmlFor="coupon_active" className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  تفعيل كود الخصم فوراً للزبائن
                </label>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs shadow-lg transition-all"
                >
                  حفظ كود الخصم
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
