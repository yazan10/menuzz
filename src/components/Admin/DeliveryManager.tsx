import React, { useState } from 'react';
import { 
  Bike, 
  Car, 
  MapPin, 
  Phone, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Navigation, 
  Search, 
  Filter, 
  AlertTriangle,
  User,
  ShieldCheck,
  Star,
  Send,
  Sparkles,
  XCircle
} from 'lucide-react';
import { Order, DeliveryDriver, OrderStatus, Language } from '../../types';
import { formatPrice } from '../../lib/currencies';

interface DeliveryManagerProps {
  orders: Order[];
  drivers: DeliveryDriver[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateDrivers: (updatedDrivers: DeliveryDriver[]) => void;
  onAssignDriverToOrder?: (orderId: string, driver: DeliveryDriver) => void;
  currentCurrency?: string;
  currentLang?: Language;
}

export const DeliveryManager: React.FC<DeliveryManagerProps> = ({
  orders,
  drivers,
  onUpdateOrderStatus,
  onUpdateDrivers,
  onAssignDriverToOrder,
  currentCurrency = 'ILS',
}) => {
  const [activeTab, setActiveTab] = useState<'dispatch' | 'drivers' | 'map'>('dispatch');
  const [showAddDriverModal, setShowAddDriverModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Driver Form State
  const [driverName, setDriverName] = useState<string>('');
  const [driverPhone, setDriverPhone] = useState<string>('');
  const [driverVehicle, setDriverVehicle] = useState<'motorcycle' | 'car' | 'bicycle'>('motorcycle');

  // Filter Delivery Orders only
  const deliveryOrders = orders.filter(o => o.type === 'delivery');
  const activeDeliveryOrders = deliveryOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');

  const handleToggleDriverStatus = (id: string) => {
    const updated = drivers.map(d => {
      if (d.id === id) {
        const nextStatus: Record<string, 'available' | 'busy' | 'offline'> = {
          available: 'busy',
          busy: 'offline',
          offline: 'available'
        };
        return { ...d, status: nextStatus[d.status] };
      }
      return d;
    });
    onUpdateDrivers(updated);
  };

  const handleDeleteDriver = (id: string) => {
    onUpdateDrivers(drivers.filter(d => d.id !== id));
  };

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim() || !driverPhone.trim()) return;

    const newDriver: DeliveryDriver = {
      id: `drv_${Date.now()}`,
      name: driverName.trim(),
      phone: driverPhone.trim(),
      vehicle: driverVehicle,
      status: 'available',
      activeOrdersCount: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
      rating: 5.0,
    };

    onUpdateDrivers([...drivers, newDriver]);
    setDriverName('');
    setDriverPhone('');
    setShowAddDriverModal(false);
  };

  const handleQuickAssign = (orderId: string, driverId: string) => {
    const selectedDriver = drivers.find(d => d.id === driverId);
    if (selectedDriver && onAssignDriverToOrder) {
      onAssignDriverToOrder(orderId, selectedDriver);
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-emerald-600 via-teal-700 to-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 backdrop-blur-md rounded-2xl">
              <Bike className="w-6 h-6 text-emerald-200" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black">نظام إدارة التوصيل وتتبع الكباتن (Delivery Dispatch Center)</h2>
          </div>
          <p className="text-xs text-emerald-100 max-w-xl">
            إدارة طلبات الديلفري، تعيين الكباتن والسائقين، وتتبع سرعة الوصول وحالة التسليم لحظة بلحظة مع خريطة تفاعلية للعملاء.
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={() => setShowAddDriverModal(true)}
            className="px-5 py-3 rounded-2xl bg-white text-emerald-900 font-extrabold text-xs sm:text-sm hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة كابتن توصيل جديد</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('dispatch')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'dispatch'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>طلبات التوصيل الحالية ({activeDeliveryOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'drivers'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>قائمة الكباتن والسائقين ({drivers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'map'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>خريطة التتبع الحية 📍</span>
        </button>
      </div>

      {/* DISPATCH TAB */}
      {activeTab === 'dispatch' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveryOrders.map((o) => {
              const assignedDriver = drivers.find(d => d.id === o.driverId);

              return (
                <div
                  key={o.id}
                  className={`p-5 rounded-3xl border transition-all bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden ${
                    o.status === 'out_for_delivery'
                      ? 'border-emerald-500/50 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-xs font-mono font-black text-slate-900 dark:text-white">
                        {o.orderNumber}
                      </span>
                      <p className="text-[10px] text-slate-500">{o.createdAt}</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      o.status === 'out_for_delivery'
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse'
                        : o.status === 'delivered'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                    }`}>
                      {o.status === 'new' && 'طلب جديد'}
                      {o.status === 'preparing' && 'جاري التحضير'}
                      {o.status === 'out_for_delivery' && 'خرج للتوصيل 🛵'}
                      {o.status === 'delivered' && 'تم التسليم بنجاح ✅'}
                    </span>
                  </div>

                  <div className="py-3 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">اسم العميل:</span>
                      <span className="text-slate-900 dark:text-white">{o.customerName}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-500">رقم التواصل:</span>
                      <a href={`tel:${o.customerPhone}`} className="text-emerald-600 font-mono flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {o.customerPhone}
                      </a>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <span className="text-[10px] font-black text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" /> عنوان التوصيل:
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2">
                        {o.deliveryAddress || 'عنوان لم يُحدد'}
                      </p>
                    </div>

                    <div className="flex justify-between items-center text-xs font-bold pt-1">
                      <span className="text-slate-500">الإجمالي الشامل:</span>
                      <span className="text-sm font-black text-emerald-600">{formatPrice(o.totalAmount, currentCurrency)}</span>
                    </div>
                  </div>

                  {/* Driver Assignment Dropdown */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <label className="block text-[11px] font-black text-slate-700 dark:text-slate-300">
                      تعيين كابتن التوصيل:
                    </label>
                    <select
                      value={o.driverId || ''}
                      onChange={(e) => handleQuickAssign(o.id, e.target.value)}
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                    >
                      <option value="">اختر الكابتن من القائمة...</option>
                      {drivers.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.status === 'available' ? 'متاح ✅' : 'مشغول 🔴'})
                        </option>
                      ))}
                    </select>

                    {/* Status Changer */}
                    <div className="grid grid-cols-2 gap-1.5 pt-2">
                      <button
                        onClick={() => onUpdateOrderStatus(o.id, 'out_for_delivery')}
                        className="py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 font-extrabold text-[11px] transition-all flex items-center justify-center gap-1"
                      >
                        <Bike className="w-3.5 h-3.5" /> خرج للتوصيل
                      </button>

                      <button
                        onClick={() => onUpdateOrderStatus(o.id, 'delivered')}
                        className="py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 font-extrabold text-[11px] transition-all flex items-center justify-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> تم التسليم
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {deliveryOrders.length === 0 && (
              <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-2">
                <Bike className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-bold text-slate-500">لا توجد طلبات توصيل حالية</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DRIVERS MANAGEMENT TAB */}
      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((d) => (
            <div
              key={d.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={d.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop'}
                  alt={d.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                />
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    {d.name}
                  </h4>
                  <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-600" /> {d.phone}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-amber-400" /> {d.rating || 5.0} / 5.0
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs font-bold">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">وسيلة النقل:</span>
                  <span className="text-slate-900 dark:text-white flex items-center gap-1">
                    {d.vehicle === 'motorcycle' ? <Bike className="w-3.5 h-3.5 text-amber-500" /> : <Car className="w-3.5 h-3.5 text-blue-500" />}
                    {d.vehicle === 'motorcycle' ? 'دراجة نارية' : 'سيارة'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">الطلبات الحالية:</span>
                  <span className="text-emerald-600 font-black">{d.activeOrdersCount} طلبات</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">الحالة:</span>
                  <button
                    onClick={() => handleToggleDriverStatus(d.id)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all ${
                      d.status === 'available'
                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        : d.status === 'busy'
                        ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                    }`}
                  >
                    {d.status === 'available' && 'متاح للطلب ✅'}
                    {d.status === 'busy' && 'مشغول بالطريق 🛵'}
                    {d.status === 'offline' && 'غير متاح 🔴'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => handleDeleteDriver(d.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 transition-all text-xs font-bold flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> حذف الكابتن
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIVE ROUTE MAP TAB */}
      {activeTab === 'map' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-600" />
              <span>خريطة المحاكاة المباشرة لحركة كباتن التوصيل 📍</span>
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black border border-emerald-500/20 animate-pulse">
              تتبع حي GPS
            </span>
          </div>

          <div className="relative w-full h-[380px] rounded-3xl bg-slate-900 overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center">
            {/* Map Canvas Visual Mockup */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* Simulated Road Lines */}
            <svg className="absolute inset-0 w-full h-full stroke-emerald-500/30 stroke-2 [stroke-dasharray:8_8]">
              <path d="M 100 100 Q 250 150 400 200 T 700 280" fill="none" />
              <path d="M 200 320 Q 350 200 550 120" fill="none" />
            </svg>

            {/* Branch Pin */}
            <div className="absolute top-[30%] right-[25%] p-3 rounded-2xl bg-slate-950/90 text-white border border-emerald-500/50 shadow-2xl flex items-center gap-2 animate-bounce">
              <span className="p-1.5 bg-emerald-500 text-slate-950 rounded-xl font-bold">🏢</span>
              <div className="text-right">
                <span className="text-[10px] font-black block">فرع المطعم الرئيسي</span>
                <span className="text-[9px] text-emerald-400 font-mono">نقطة الانطلاق</span>
              </div>
            </div>

            {/* Live Moving Driver Pin */}
            <div className="absolute top-[50%] right-[55%] p-3 rounded-2xl bg-slate-950/90 text-white border border-amber-500/50 shadow-2xl flex items-center gap-2">
              <span className="p-1.5 bg-amber-500 text-slate-950 rounded-xl font-bold">🛵</span>
              <div className="text-right">
                <span className="text-[10px] font-black block">الكابتن أحمد محمود</span>
                <span className="text-[9px] text-amber-400 font-mono">متجه للعميل (متبقي 12 دقيقة)</span>
              </div>
            </div>

            {/* Customer Pin */}
            <div className="absolute top-[68%] right-[80%] p-3 rounded-2xl bg-slate-950/90 text-white border border-rose-500/50 shadow-2xl flex items-center gap-2">
              <span className="p-1.5 bg-rose-500 text-white rounded-xl font-bold">📍</span>
              <div className="text-right">
                <span className="text-[10px] font-black block">عنوان العميل (شارع القدس)</span>
                <span className="text-[9px] text-rose-400 font-mono">وجهة التسليم</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {showAddDriverModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-right relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span>إضافة كابتن توصيل جديد</span>
              </h3>
              <button
                onClick={() => setShowAddDriverModal(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  اسم السائق / الكابتن *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الكابتن محمد علي"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  رقم الهاتف / الجوال *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0599000000"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                  وسيلة النقل والتنقل
                </label>
                <select
                  value={driverVehicle}
                  onChange={(e) => setDriverVehicle(e.target.value as any)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="motorcycle">دراجة نارية (موتورسيكل 🛵)</option>
                  <option value="car">سيارة (Car 🚗)</option>
                  <option value="bicycle">دراجة هوائية (Bicycle 🚲)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg transition-all"
                >
                  حفظ الكابتن
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(false)}
                  className="px-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-xs"
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
