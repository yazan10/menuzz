import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Printer, 
  Download, 
  Camera, 
  Sliders, 
  Table, 
  Sparkles, 
  Check, 
  RefreshCw, 
  Barcode as BarcodeIcon, 
  Wifi, 
  Layers, 
  Copy, 
  ExternalLink,
  Utensils,
  Star,
  Smartphone
} from 'lucide-react';
import { Restaurant, Language, Dish } from '../../types';
import { getTranslation } from '../../lib/translations';
import { BarcodeSVGComponent } from './BarcodeSVGComponent';
import { downloadSvgElementAsPng } from '../../lib/barcode';
import { formatPrice } from '../../lib/currencies';

interface QRCodeManagerProps {
  restaurant: Restaurant;
  currentLang: Language;
  dishes?: Dish[];
  currentCurrency?: string;
  onScanRedirectToTable: (branchId: string, tableNum: number) => void;
}

export const QRCodeManager: React.FC<QRCodeManagerProps> = ({
  restaurant,
  currentLang,
  dishes = [],
  currentCurrency = 'ILS',
  onScanRedirectToTable,
}) => {
  const [activeTab, setActiveTab] = useState<'tables_qr' | 'dishes_barcode' | 'wifi_qr' | 'batch_tables' | 'scanner'>('tables_qr');
  
  // Branch & Table QR State
  const [selectedBranchId, setSelectedBranchId] = useState<string>(restaurant.branches[0]?.id || 'br_1');
  const [tableNumber, setTableNumber] = useState<number>(1);
  const [qrColor, setQrColor] = useState<string>(restaurant.primaryColor || '#0b4f42');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [showLogo, setShowLogo] = useState<boolean>(true);

  // Batch Table QR State
  const [batchStartTable, setBatchStartTable] = useState<number>(1);
  const [batchEndTable, setBatchEndTable] = useState<number>(10);

  // Dish Barcode State
  const [selectedDishId, setSelectedDishId] = useState<string>(dishes[0]?.id || '');
  const [customBarcodeText, setCustomBarcodeText] = useState<string>('MENUZ-1001');
  const [barcodeWidth, setBarcodeWidth] = useState<number>(2);
  const [barcodeHeight, setBarcodeHeight] = useState<number>(75);
  const [showBarcodeText, setShowBarcodeText] = useState<boolean>(true);

  // WiFi QR State
  const [wifiSsid, setWifiSsid] = useState<string>(`${restaurant.name} Guest`);
  const [wifiPassword, setWifiPassword] = useState<string>('welcome123');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Scanner State
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Ref to single QR/Barcode element for PNG Export
  const SingleSvgRef = useRef<HTMLDivElement>(null);

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLang, key);
  const selectedBranch = restaurant.branches.find(b => b.id === selectedBranchId) || restaurant.branches[0] || { name: 'الفرع الرئيسي', tablesCount: 20 };

  // Dynamic URLs & Payloads
  const qrTargetUrl = `${window.location.origin}?branch=${selectedBranchId}&table=${tableNumber}`;
  const wifiQrPayload = `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;

  const selectedDish = dishes.find(d => d.id === selectedDishId) || dishes[0];
  const activeDishBarcode = selectedDish ? (selectedDish.sku || `DISH-${selectedDish.id.slice(0, 6)}`) : customBarcodeText;

  const handleDownloadSinglePng = (filename: string) => {
    if (!SingleSvgRef.current) return;
    const svgEl = SingleSvgRef.current.querySelector('svg');
    if (svgEl) {
      downloadSvgElementAsPng(svgEl, filename, 4);
    }
  };

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult(`تم المسح بنجاح! فرع: ${selectedBranch.name} - طاولة رقم ${tableNumber}`);
      setTimeout(() => {
        onScanRedirectToTable(selectedBranchId, tableNumber);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold">
      
      {/* Title & Navigation Tabs Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 rounded-2xl">
              <QrCode className="w-6 h-6" />
            </div>
            <span>استوديو إنشاء الرمز والباركود (QR & Barcode Studio)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            صمم وحمل رموز QR للطاولات والواي فاي أو باركودات الأطباق والفواتير من مكان واحد بدون مشاكل
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('tables_qr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'tables_qr' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>QR الطاولة</span>
          </button>

          <button
            onClick={() => setActiveTab('batch_tables')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'batch_tables' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>دفعة طاولات (Batch)</span>
          </button>

          <button
            onClick={() => setActiveTab('dishes_barcode')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'dishes_barcode' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <BarcodeIcon className="w-4 h-4" />
            <span>باركود المنتجات (SKU)</span>
          </button>

          <button
            onClick={() => setActiveTab('wifi_qr')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'wifi_qr' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Wifi className="w-4 h-4" />
            <span>QR الواي فاي</span>
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'scanner' ? 'bg-orange-600 text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>فاحص الكود (Scanner)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SINGLE TABLE QR CODE GENERATOR */}
      {activeTab === 'tables_qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Settings Box */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-orange-500" />
              <span>إعدادات رمز الطاولة</span>
            </h3>

            {/* Branch Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                اختر الفرع
              </label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {restaurant.branches.map((br) => (
                  <option key={br.id} value={br.id}>
                    {br.name} ({br.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Table Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                رقم الطاولة
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={selectedBranch.tablesCount || 100}
                  value={tableNumber}
                  onChange={(e) => setTableNumber(Number(e.target.value))}
                  className="w-28 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-bold text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <span className="text-xs text-slate-500">من أصل {selectedBranch.tablesCount || 50} طاولة متاحة في هذا الفرع</span>
              </div>
            </div>

            {/* Colors Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  لون النقاط (QR Color)
                </label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono uppercase font-bold">{qrColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  لون الخلفية
                </label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono uppercase font-bold">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Logo Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                إضافة شعار المطعم لمنتصف الـ QR
              </span>
              <button
                type="button"
                onClick={() => setShowLogo(!showLogo)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  showLogo ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  showLogo ? 'right-6' : 'right-0.5'
                }`} />
              </button>
            </div>

            {/* Target Link Copy */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رابط المنيو الخاص بالطاولة
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={qrTargetUrl}
                  className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 select-all"
                />
                <button
                  onClick={() => handleCopyLink(qrTargetUrl)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedLink ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Card Preview & Actions */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-8 border-2 border-slate-200 shadow-2xl text-center space-y-6 relative overflow-hidden">
              <div className="bg-[#0b4f42] text-white py-2 px-6 rounded-full text-xs font-black inline-flex items-center gap-2 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>{restaurant.name}</span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                  {selectedBranch.name}
                </div>
                <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
                  <Table className="w-6 h-6 text-orange-600" />
                  <span>طاولة رقم {tableNumber}</span>
                </div>
              </div>

              {/* QR Render Target */}
              <div ref={SingleSvgRef} className="p-4 bg-white rounded-2xl border border-slate-100 inline-block shadow-inner">
                <QRCodeSVG
                  value={qrTargetUrl}
                  size={200}
                  fgColor={qrColor}
                  bgColor={bgColor}
                  level="H"
                  imageSettings={showLogo && restaurant.logo ? {
                    src: restaurant.logo,
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  } : undefined}
                />
              </div>

              <div className="space-y-1 pt-2">
                <div className="text-sm font-black text-orange-600">
                  امسح كود الـ QR بكاميرا جوالك
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  لتصفح المنيو، والطلب الفوري من طاولتك
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-bold pt-2 border-t border-slate-100">
                Powered by menuz.app
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={handlePrint}
                className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة (Print)</span>
              </button>

              <button
                onClick={() => handleDownloadSinglePng(`table-${tableNumber}-qr`)}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>تنزيل صورة PNG 📸</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: BATCH TABLES QR GENERATOR */}
      {activeTab === 'batch_tables' && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-500" />
                <span>توليد رموز لكافة طاولات المطعم دفعة واحدة</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                حدد نطاق الطاولات ليتم تجهيز بطاقات QR جاهزة للطباعة واللصق على جميع الطاولات
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">من طاولة:</span>
                <input
                  type="number"
                  min={1}
                  value={batchStartTable}
                  onChange={(e) => setBatchStartTable(Number(e.target.value))}
                  className="w-20 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-bold text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold">إلى طاولة:</span>
                <input
                  type="number"
                  min={batchStartTable}
                  value={batchEndTable}
                  onChange={(e) => setBatchEndTable(Number(e.target.value))}
                  className="w-20 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-bold text-sm"
                />
              </div>

              <button
                onClick={handlePrint}
                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الشيت الكامل</span>
              </button>
            </div>
          </div>

          {/* Grid of Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: Math.max(1, batchEndTable - batchStartTable + 1) }, (_, i) => batchStartTable + i).map((tNum) => {
              const url = `${window.location.origin}?branch=${selectedBranchId}&table=${tNum}`;
              return (
                <div key={tNum} className="bg-white text-slate-900 rounded-2xl p-6 border border-slate-200 shadow-sm text-center space-y-4 print:border-2 print:border-slate-400">
                  <div className="text-xs font-black text-slate-500 border-b border-slate-100 pb-2">
                    {restaurant.name} - طاولة {tNum}
                  </div>
                  <div className="flex justify-center py-2">
                    <QRCodeSVG
                      value={url}
                      size={140}
                      fgColor={qrColor}
                      bgColor="#ffffff"
                      level="M"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-orange-600">امسح الكود لفتح المنيو والطلب</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DISHES BARCODE GENERATOR (SKU / Code128) */}
      {activeTab === 'dishes_barcode' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <BarcodeIcon className="w-5 h-5 text-orange-500" />
              <span>إنشاء باركود المنتجات والأطباق (Code 128)</span>
            </h3>

            {/* Dish Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                اختر صنفاً من المنيو
              </label>
              <select
                value={selectedDishId}
                onChange={(e) => setSelectedDishId(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                {dishes.map((dish) => (
                  <option key={dish.id} value={dish.id}>
                    {dish.name} - {formatPrice(dish.price, currentCurrency)} ({dish.sku || `DISH-${dish.id.slice(0, 5)}`})
                  </option>
                ))}
              </select>
            </div>

            {/* Manual Barcode Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                أو أدخل نص/رمز الباركود المخصص
              </label>
              <input
                type="text"
                value={customBarcodeText}
                onChange={(e) => setCustomBarcodeText(e.target.value)}
                placeholder="مثال: MENUZ-8890"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Barcode Size Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  سمك الخطوط (Bar Width)
                </label>
                <input
                  type="range"
                  min={1}
                  max={4}
                  value={barcodeWidth}
                  onChange={(e) => setBarcodeWidth(Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ارتفاع الباركود (Height)
                </label>
                <input
                  type="range"
                  min={40}
                  max={120}
                  value={barcodeHeight}
                  onChange={(e) => setBarcodeHeight(Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                إظهار الرقم/النص أسفل الباركود
              </span>
              <button
                type="button"
                onClick={() => setShowBarcodeText(!showBarcodeText)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  showBarcodeText ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  showBarcodeText ? 'right-6' : 'right-0.5'
                }`} />
              </button>
            </div>
          </div>

          {/* Render Preview & Download */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-8 border-2 border-slate-200 shadow-xl text-center space-y-6">
              <div className="border-b border-slate-200 pb-4 space-y-1">
                <span className="text-xs font-bold text-orange-600 uppercase">{restaurant.name} • Barcode Label</span>
                <h4 className="text-lg font-black">{selectedDish ? selectedDish.name : 'ملصق صنف مخصص'}</h4>
                <p className="text-sm font-bold font-mono text-emerald-700">
                  {selectedDish ? formatPrice(selectedDish.price, currentCurrency) : '-'}
                </p>
              </div>

              {/* Barcode Render Target */}
              <div ref={SingleSvgRef} className="p-4 bg-white border border-slate-200 rounded-2xl flex justify-center items-center">
                <BarcodeSVGComponent
                  value={activeDishBarcode}
                  width={barcodeWidth}
                  height={barcodeHeight}
                  showText={showBarcodeText}
                  barColor="#000000"
                  bgColor="#ffffff"
                />
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة الملصق</span>
                </button>
                <button
                  onClick={() => handleDownloadSinglePng(`barcode-${activeDishBarcode}`)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4 text-orange-400" />
                  <span>تحميل PNG</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: WIFI QR CODE GENERATOR */}
      {activeTab === 'wifi_qr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-orange-500" />
              <span>رمز الاتصال التلقائي بشبكة الواي فاي (Wi-Fi QR)</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                اسم الشبكة (SSID)
              </label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                كلمة المرور (Password)
              </label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                نوع التشفير
              </label>
              <select
                value={wifiEncryption}
                onChange={(e) => setWifiEncryption(e.target.value as any)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (المستحسن)</option>
                <option value="WEP">WEP (قديم)</option>
                <option value="nopass">بدون كلمة سر (شبكة مفتوحة)</option>
              </select>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-sm bg-white text-slate-900 rounded-3xl p-8 border-2 border-slate-200 shadow-2xl text-center space-y-6">
              <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl inline-block">
                <Wifi className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black">اتصل بشبكة الواي فاي مجاناً 📶</h4>
                <p className="text-xs text-slate-500 font-bold">{wifiSsid}</p>
              </div>

              <div ref={SingleSvgRef} className="p-4 bg-white border border-slate-200 rounded-2xl inline-block shadow-inner">
                <QRCodeSVG
                  value={wifiQrPayload}
                  size={190}
                  fgColor="#1e3a8a"
                  bgColor="#ffffff"
                  level="Q"
                />
              </div>

              <p className="text-xs font-bold text-slate-600">
                امسح الرمز بكاميرا الهاتف للاتصال المباشر بالإنترنت دون الحاجة لكتابة كلمة السر
              </p>

              <button
                onClick={() => handleDownloadSinglePng(`wifi-${wifiSsid}`)}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 mx-auto shadow-lg cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تنزيل بطاقة الواي فاي (PNG)</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 5: SCANNER SIMULATOR */}
      {activeTab === 'scanner' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              قارئ ومتحقق الكود الذكي (Scanner)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              اختبر قراءة رموز QR والباركودات الخاصة بطاولاتك وأطباقك
            </p>
          </div>

          <div className="relative aspect-video max-w-md mx-auto bg-slate-950 rounded-3xl overflow-hidden border-4 border-slate-800 flex flex-col items-center justify-center p-6 text-white shadow-2xl">
            {isScanning && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500 shadow-[0_0_15px_#ea580c] animate-bounce" />
            )}

            <div className="w-48 h-48 border-2 border-dashed border-orange-500/80 rounded-2xl flex items-center justify-center p-4 relative">
              <QrCode className={`w-24 h-24 text-slate-700 transition-all ${isScanning ? 'scale-110 text-orange-500 animate-pulse' : ''}`} />
            </div>

            <span className="text-xs font-bold text-slate-300 mt-4">
              {isScanning ? 'جاري توجيه العدسة وتحليل الكود...' : 'وجه الكاميرا نحو الرمز للتعرف الفوري'}
            </span>
          </div>

          {scanResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 text-sm font-bold flex items-center justify-center gap-2 border border-emerald-300">
              <Check className="w-5 h-5 text-emerald-600" />
              <span>{scanResult}</span>
            </div>
          )}

          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="px-8 py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>جاري قراءة الكود...</span>
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                <span>مسح رمز طاولة {tableNumber}</span>
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
};
