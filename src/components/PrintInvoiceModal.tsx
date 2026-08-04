import React from 'react';
import { Order, Restaurant, Category, Dish } from '../types';
import { formatPrice } from '../lib/currencies';
import { Printer, X, CheckCircle2, ShoppingBag, Utensils, QrCode } from 'lucide-react';

interface PrintInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'order' | 'menu';
  order?: Order | null;
  restaurant: Restaurant;
  dishes?: Dish[];
  categories?: Category[];
  currentCurrency?: string;
}

export const PrintInvoiceModal: React.FC<PrintInvoiceModalProps> = ({
  isOpen,
  onClose,
  type,
  order,
  restaurant,
  dishes = [],
  categories = [],
  currentCurrency = 'ILS'
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const activeBranch = restaurant.branches?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      
      {/* Container wrapper */}
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-8 print:shadow-none print:m-0 print:w-full print:max-w-none">
        
        {/* Modal Actions Bar (Hidden on Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-black">
              {type === 'order' ? `طباعة الفاتورة والطلب (${order?.orderNumber})` : `معاينة وطباعة المنيو الرقمي`}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>افتح نافذة الطباعة 🖨️</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div id="printable-receipt-area" className="p-8 space-y-6 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold bg-white text-slate-900 print:p-2">
          
          {/* Header Branding */}
          <div className="text-center border-b-2 border-dashed border-slate-300 pb-6 space-y-2">
            {restaurant.logo && (
              <img
                src={restaurant.logo}
                alt={restaurant.name}
                className="w-16 h-16 mx-auto rounded-full object-cover border border-slate-200 shadow-sm print:w-12 print:h-12"
              />
            )}
            <h1 className="text-2xl font-black text-slate-900">{restaurant.name}</h1>
            <p className="text-xs text-slate-600 font-bold">{restaurant.tagline}</p>
            <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
              <p>📍 {activeBranch?.address || 'الفرع الرئيسي'} {activeBranch?.city ? ` - ${activeBranch.city}` : ''}</p>
              <p>📞 {restaurant.phone || activeBranch?.phone || 'غير محدد'}</p>
            </div>
          </div>

          {/* ORDER TYPE PRINT TEMPLATE */}
          {type === 'order' && order && (
            <div className="space-y-6">
              
              {/* Receipt Details Bar */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 print:bg-transparent print:border-slate-300">
                <div className="space-y-1">
                  <p><span className="font-bold text-slate-500">رقم الفاتورة/الطلب:</span> <strong className="text-slate-900 font-mono text-sm">{order.orderNumber}</strong></p>
                  <p><span className="font-bold text-slate-500">اسم العميل:</span> <strong className="text-slate-900">{order.customerName}</strong></p>
                  <p><span className="font-bold text-slate-500">الهاتف:</span> <span className="font-mono">{order.customerPhone || '-'}</span></p>
                </div>
                <div className="space-y-1 text-left rtl:text-right">
                  <p><span className="font-bold text-slate-500">التاريخ والوقت:</span> <span>{order.createdAt || new Date().toLocaleString('ar')}</span></p>
                  <p>
                    <span className="font-bold text-slate-500">نوع الطلب:</span>{' '}
                    <strong className="text-orange-600">
                      {order.type === 'table' ? `طاولة رقم ${order.tableNumber || '-'}` : order.type === 'takeaway' ? 'استلام سفري 🛍️' : 'توصيل للمنزل 🛵'}
                    </strong>
                  </p>
                  <p><span className="font-bold text-slate-500">طريقة الدفع:</span> <strong>{order.paymentMethod === 'cash' ? 'نقداً (كاش)' : 'دفع إلكتروني'}</strong></p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-hidden border border-slate-200 rounded-2xl print:border-slate-400">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-black print:bg-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">الصنف / الوجبة</th>
                      <th className="py-2.5 px-2 text-center">الكمية</th>
                      <th className="py-2.5 px-3 text-left">السعر</th>
                      <th className="py-2.5 px-3 text-left">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3">
                          <p className="font-bold text-slate-900">{item.dishName}</p>
                          {item.notes && <p className="text-[10px] text-orange-600">ملاحظات: {item.notes}</p>}
                        </td>
                        <td className="py-2.5 px-2 text-center font-black text-slate-900">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-left font-mono">{formatPrice(item.unitPrice, currentCurrency)}</td>
                        <td className="py-2.5 px-3 text-left font-bold font-mono">{formatPrice(item.unitPrice * item.quantity, currentCurrency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Summary */}
              <div className="border-t-2 border-dashed border-slate-300 pt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono font-bold">{formatPrice(order.subtotal, currentCurrency)}</span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>الضريبة:</span>
                    <span className="font-mono">{formatPrice(order.tax, currentCurrency)}</span>
                  </div>
                )}
                {order.deliveryFee && order.deliveryFee > 0 ? (
                  <div className="flex justify-between text-slate-600">
                    <span>رسوم التوصيل:</span>
                    <span className="font-mono">{formatPrice(order.deliveryFee, currentCurrency)}</span>
                  </div>
                ) : null}
                {order.loyaltyDiscountAmount && order.loyaltyDiscountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>خصم الولاء/البرومو:</span>
                    <span className="font-mono">-{formatPrice(order.loyaltyDiscountAmount, currentCurrency)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between items-center text-base font-black text-slate-900 pt-2 border-t border-slate-300">
                  <span>المبلغ الإجمالي النهائي:</span>
                  <span className="text-xl font-mono text-orange-600">{formatPrice(order.totalAmount, currentCurrency)}</span>
                </div>
              </div>

              {/* Footer Note */}
              <div className="text-center text-[10px] text-slate-500 border-t border-slate-200 pt-4 space-y-1">
                <p className="font-bold">شكراً لزيارتكم {restaurant.name}! نتمنى لكم وجبة شهية ❤️</p>
                <p>تم الإصدار بواسطة منصة menuz المنيو الرقمي السريع</p>
              </div>

            </div>
          )}

          {/* MENU PRINT TEMPLATE */}
          {type === 'menu' && (
            <div className="space-y-6">
              <div className="text-center bg-orange-50 p-4 rounded-2xl border border-orange-200 text-orange-950 print:bg-transparent print:border-slate-300">
                <h2 className="text-lg font-black">قائمة الطعام الكاملة (المنيو)</h2>
                <p className="text-xs text-orange-800">قائمة الوجبات والمشروبات المحدثة</p>
              </div>

              <div className="space-y-6">
                {categories.map((cat) => {
                  const catDishes = dishes.filter(d => d.categoryId === cat.id && d.isAvailable);
                  if (catDishes.length === 0) return null;

                  return (
                    <div key={cat.id} className="space-y-3">
                      <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1">
                        <span className="text-lg">{cat.icon}</span>
                        <h3 className="text-sm font-black text-slate-900">{cat.name}</h3>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {catDishes.map((dish) => (
                          <div key={dish.id} className="flex justify-between items-start p-2 border-b border-slate-100 text-xs">
                            <div className="space-y-0.5">
                              <p className="font-bold text-slate-900 text-sm">{dish.name}</p>
                              {dish.description && <p className="text-[11px] text-slate-500">{dish.description}</p>}
                            </div>
                            <span className="font-black text-orange-600 text-sm font-mono shrink-0 mr-4">
                              {formatPrice(dish.price, currentCurrency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center text-[10px] text-slate-500 border-t border-slate-200 pt-4">
                <p>مسح رمز الـ QR على الطاولة لتصفح الصور والطلب التفاعلي المباشر عبر menuz</p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Embedded Style for print page view */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt-area, #printable-receipt-area * {
            visibility: visible;
          }
          #printable-receipt-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 15px;
          }
        }
      `}</style>

    </div>
  );
};
