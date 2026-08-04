import React, { useRef, useState } from 'react';
import { Printer, Download, X, QrCode, Sparkles, Check } from 'lucide-react';
import { Restaurant } from '../types';
import { formatPrice } from '../lib/currencies';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

interface PrintableMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
}

export const PrintableMenuModal: React.FC<PrintableMenuModalProps> = ({
  isOpen,
  onClose,
  restaurant,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${restaurant.name.replace(/\s+/g, '_')}_Menu.pdf`;
      pdf.save(fileName);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback to window print
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const shareUrl = `${window.location.origin}/?restaurant=${restaurant.id || 'default'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between p-4 bg-slate-800/80 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                طباعة وتحميل المنيو بصيغة PDF 📄✨
              </h3>
              <p className="text-xs text-slate-400">
                تصميم احترافي جاهز للطباعة والتوزيع على الطاولات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري إنشاء PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>تم التنزيل!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>تحميل PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة مباشرة</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable PDF Preview Canvas Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 flex justify-center">
          <div
            ref={printRef}
            className="w-full max-w-[210mm] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm print:shadow-none print:w-full print:p-0"
            style={{ minHeight: '297mm' }}
          >
            {/* Restaurant Printable Header */}
            <div className="border-b-2 border-amber-500 pb-6 mb-8 text-center flex flex-col items-center">
              {restaurant.logo ? (
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-amber-500 shadow-md mb-3"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl mb-3 shadow-md">
                  {restaurant.name.charAt(0)}
                </div>
              )}

              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {restaurant.name}
              </h1>
              {restaurant.tagline && (
                <p className="text-sm font-semibold text-amber-600 mt-1">
                  {restaurant.tagline}
                </p>
              )}

              {/* QR Code and digital menu link badge */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-4">
                <div className="bg-white p-1.5 rounded-lg border border-amber-300">
                  <QRCodeSVG value={shareUrl} size={64} />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-800 block">
                    امسح الكود واستعرض المنيو الرقمي التفاعلي 📱✨
                  </span>
                  <span className="text-[11px] font-mono text-slate-600 dir-ltr block mt-0.5">
                    {shareUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Categories & Items */}
            <div className="space-y-8">
              {restaurant.categories.map((cat) => (
                <div key={cat.id} className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                    <h2 className="text-xl font-bold text-amber-700 flex items-center gap-2">
                      <span>{cat.icon || '🍽️'}</span>
                      <span>{cat.name}</span>
                    </h2>
                    <span className="text-xs font-semibold text-slate-500">
                      ({cat.items.length} صنف)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cat.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/80 hover:bg-slate-50"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                            crossOrigin="anonymous"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-1">
                            <h3 className="text-sm font-extrabold text-slate-900 truncate">
                              {item.name}
                            </h3>
                            <span className="text-sm font-black text-amber-600 whitespace-nowrap">
                              {formatPrice(item.price, restaurant.currency)}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                              {item.description}
                            </p>
                          )}
                          {item.calories && (
                            <span className="inline-block mt-1 text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                              🔥 {item.calories} سعرة
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col items-center gap-1">
              <p className="font-semibold text-slate-700">
                {restaurant.name} - أهلاً وسهلاً بكم في مطعمنا
              </p>
              <p className="text-[11px] text-slate-400">
                صُمم وطُبع بواسطة منصة Menuz لإدارة المنايو الرقمية
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
