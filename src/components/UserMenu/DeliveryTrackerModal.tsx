import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  Car, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  MessageSquare, 
  X, 
  Sparkles, 
  Building2, 
  UserCheck,
  Search,
  ChevronLeft
} from 'lucide-react';
import { Order, DeliveryDriver, Language } from '../../types';
import { formatPrice } from '../../lib/currencies';

interface DeliveryTrackerModalProps {
  order: Order | null;
  allOrders?: Order[];
  drivers?: DeliveryDriver[];
  onClose: () => void;
  currentCurrency?: string;
  currentLang?: Language;
}

export const DeliveryTrackerModal: React.FC<DeliveryTrackerModalProps> = ({
  order: initialOrder,
  allOrders = [],
  drivers = [],
  onClose,
  currentCurrency = 'ILS',
}) => {
  const [searchOrderNo, setSearchOrderNo] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(initialOrder || allOrders.find(o => o.type === 'delivery') || null);
  const [simulatedETA, setSimulatedETA] = useState<number>(20);

  // Simulated countdown timer for ETA
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedETA(prev => (prev > 1 ? prev - 1 : 1));
    }, 60000); // Reduce 1 min every minute
    return () => clearInterval(timer);
  }, []);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchOrderNo.trim()) return;

    const found = allOrders.find(o => 
      o.orderNumber.toLowerCase().includes(searchOrderNo.trim().toLowerCase()) ||
      o.id.toLowerCase().includes(searchOrderNo.trim().toLowerCase())
    );

    if (found) {
      setSelectedOrder(found);
    } else {
      alert('لم يتم العثور على طلب بهذ الرقم. يرجى التأكد من رقم الطلب الصحيح.');
    }
  };

  const currentOrder = selectedOrder || initialOrder;
  const driver = drivers.find(d => d.id === currentOrder?.driverId) || {
    id: 'drv_1',
    name: currentOrder?.driverName || 'الكابتن أحمد محمود',
    phone: currentOrder?.driverPhone || '0599123456',
    vehicle: 'motorcycle' as const,
    status: 'busy' as const,
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop'
  };

  // Determine active step index (0: Received, 1: Preparing, 2: Out for delivery, 3: Delivered)
  let activeStep = 0;
  if (currentOrder?.status === 'preparing') activeStep = 1;
  else if (currentOrder?.status === 'out_for_delivery') activeStep = 2;
  else if (currentOrder?.status === 'delivered') activeStep = 3;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-right relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-l from-emerald-600 via-teal-700 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black inline-flex items-center gap-1">
              <Navigation className="w-3 h-3 text-emerald-200" /> تتبع مباشر GPS
            </span>
            <h3 className="text-xl font-black">تتبع طلب التوصيل المباشر 🛵</h3>
            <p className="text-xs text-emerald-100">شاشة رصد مكان الكابتن وحالة تجهيز وجبتك لحظة بلحظة</p>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Order Search Bar */}
          <form onSubmit={handleSearchOrder} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="أدخل رقم الطلب (مثال: #ORD-1044)..."
                value={searchOrderNo}
                onChange={(e) => setSearchOrderNo(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all"
            >
              بحث
            </button>
          </form>

          {currentOrder ? (
            <div className="space-y-6">
              {/* Order Details Header Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block">رقم الطلب:</span>
                  <span className="text-base font-mono font-black text-slate-900 dark:text-white">{currentOrder.orderNumber}</span>
                </div>

                <div className="text-left">
                  <span className="text-[10px] text-slate-500 font-bold block">وقت الوصول المتوقع:</span>
                  <span className="text-sm font-black text-emerald-600 font-mono flex items-center gap-1 justify-end">
                    <Clock className="w-4 h-4" /> ~{simulatedETA} دقيقة
                  </span>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 dark:text-white">مراحل التوصيل الحية:</h4>

                <div className="relative pr-6 border-r-2 border-emerald-500/30 space-y-6">
                  {[
                    { title: 'تم استلام الطلب بالمطعم', desc: 'وصل طلبك بنجاح وجاري إرساله للمطبخ', icon: CheckCircle2, step: 0 },
                    { title: 'جاري تحضير الطعام في المطبخ', desc: 'يقوم طهاة المطعم بطهي وإعداد وجبتك الآن', icon: Clock, step: 1 },
                    { title: 'الكابتن في الطريق إليك 🛵', desc: 'استلم كابتن التوصيل الوجبة وهو في طريقه لعنوانك', icon: Bike, step: 2 },
                    { title: 'تم تسليم الطلب بنجاح', desc: 'نتمنى لك وجبة شهية وهنيئة!', icon: CheckCircle2, step: 3 },
                  ].map((s) => {
                    const isCompleted = activeStep >= s.step;
                    const isCurrent = activeStep === s.step;
                    const Icon = s.icon;

                    return (
                      <div key={s.step} className="relative group">
                        <span className={`absolute -right-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 shadow-md'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {isCompleted ? '✓' : s.step + 1}
                        </span>

                        <div className="space-y-0.5">
                          <h5 className={`text-xs font-black flex items-center gap-2 ${
                            isCurrent ? 'text-emerald-600 dark:text-emerald-400' : isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                          }`}>
                            <span>{s.title}</span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-bold animate-pulse">
                                جاري الآن...
                              </span>
                            )}
                          </h5>
                          <p className="text-[10px] text-slate-500">{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Driver Card Info */}
              <div className="p-4 rounded-3xl bg-gradient-to-l from-slate-900 to-slate-950 text-white shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={driver.avatar}
                      alt={driver.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-400"
                    />
                    <div>
                      <h5 className="text-xs font-black text-white">{driver.name}</h5>
                      <span className="text-[10px] text-emerald-300 font-mono">كابتن التوصيل المعتمد 🛵</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${driver.phone}`}
                    className="p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
                  >
                    <Phone className="w-4 h-4" /> اتصال بالكابتن
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold">
                  <span>مركبة التوصيل: {driver.vehicle === 'motorcycle' ? 'دراجة نارية 🛵' : 'سيارة 🚗'}</span>
                  <span>التقييم العام: ⭐ {driver.rating} / 5.0</span>
                </div>
              </div>

              {/* Delivery Address Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-black text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> عنوان وجهة التسليم:
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {currentOrder.deliveryAddress || 'عنوان العميل المحدد في الطلب'}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <Bike className="w-10 h-10 mx-auto text-slate-400" />
              <p className="text-xs font-bold text-slate-500">ادخل رقم طلب التوصيل للبدء برصده مباشرة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
