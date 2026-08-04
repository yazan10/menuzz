import React, { useState, useRef } from 'react';
import { 
  Instagram, 
  Share2, 
  Download, 
  Sparkles, 
  QrCode, 
  Tag, 
  Utensils, 
  Bike, 
  Copy, 
  Check, 
  Palette, 
  Image as ImageIcon,
  Smartphone,
  Flame,
  CheckCircle2,
  Send
} from 'lucide-react';
import { Restaurant, Dish, Coupon, Language } from '../../types';
import { generateQRCodeDataURL } from '../../lib/barcode';
import { formatPrice } from '../../lib/currencies';

interface SocialStoriesGeneratorProps {
  restaurant: Restaurant;
  dishes?: Dish[];
  coupons?: Coupon[];
  currentCurrency?: string;
  currentLang?: Language;
}

export const SocialStoriesGenerator: React.FC<SocialStoriesGeneratorProps> = ({
  restaurant,
  dishes = [],
  coupons = [],
  currentCurrency = 'ILS',
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<'qr' | 'offer' | 'dish' | 'delivery'>('qr');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1'>('9:16');
  const [bgStyle, setBgStyle] = useState<string>('royal_dark');
  const [headline, setHeadline] = useState<string>('تصفّح المنيو الرقمي واستمتع بأشهى الوجبات! 🍔');
  const [subheadline, setSubheadline] = useState<string>('امسح الكود الآن بجوالك للطلب المباشر والسريع دون انتظار');
  const [badgeText, setBadgeText] = useState<string>('عرض خاص 🔥');
  const [ctaText, setCTAText] = useState<string>('امسح الكود للطلب المباشر 📲');
  const [selectedDishId, setSelectedDishId] = useState<string>(dishes[0]?.id || '');
  const [selectedCouponCode, setSelectedCouponCode] = useState<string>(coupons[0]?.code || 'MENUZ20');
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Background Styles Presets
  const bgPresets: Record<string, { bg: string; text: string; accent: string; border: string }> = {
    royal_dark: {
      bg: 'from-slate-950 via-slate-900 to-black text-white',
      text: 'text-white',
      accent: 'from-amber-400 to-orange-500',
      border: 'border-amber-500/30'
    },
    emerald_gold: {
      bg: 'from-emerald-950 via-teal-900 to-slate-950 text-white',
      text: 'text-white',
      accent: 'from-emerald-400 to-amber-300',
      border: 'border-emerald-500/30'
    },
    sunset_coral: {
      bg: 'from-orange-600 via-rose-600 to-purple-900 text-white',
      text: 'text-white',
      accent: 'from-yellow-300 to-amber-400',
      border: 'border-orange-400/40'
    },
    cyber_dark: {
      bg: 'from-slate-900 via-purple-950 to-indigo-950 text-white',
      text: 'text-white',
      accent: 'from-cyan-400 to-fuchsia-500',
      border: 'border-cyan-500/40'
    },
    clean_light: {
      bg: 'from-slate-50 via-white to-amber-50/50 text-slate-900',
      text: 'text-slate-900',
      accent: 'from-orange-500 to-amber-600',
      border: 'border-slate-200'
    }
  };

  const selectedDish = dishes.find(d => d.id === selectedDishId) || dishes[0];
  const selectedCoupon = coupons.find(c => c.code === selectedCouponCode) || coupons[0];

  const menuUrl = `${window.location.origin}/?restaurant=${restaurant.slug}`;
  const qrCodeDataUrl = generateQRCodeDataURL(menuUrl);

  // Download HD Image using Canvas HTML API
  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const element = cardRef.current;
      if (!element) return;

      // Dynamic Canvas Draw fallback or SVG render
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = aspectRatio === '9:16' ? 1080 : 1080;
      const height = aspectRatio === '9:16' ? 1920 : 1080;
      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        // Draw background gradient
        const grad = ctx.createLinearGradient(0, 0, width, height);
        if (bgStyle === 'sunset_coral') {
          grad.addColorStop(0, '#ea580c');
          grad.addColorStop(0.5, '#e11d48');
          grad.addColorStop(1, '#581c87');
        } else if (bgStyle === 'emerald_gold') {
          grad.addColorStop(0, '#064e3b');
          grad.addColorStop(0.5, '#115e59');
          grad.addColorStop(1, '#022c22');
        } else if (bgStyle === 'cyber_dark') {
          grad.addColorStop(0, '#0f172a');
          grad.addColorStop(0.5, '#3b0764');
          grad.addColorStop(1, '#1e1b4b');
        } else if (bgStyle === 'clean_light') {
          grad.addColorStop(0, '#f8fafc');
          grad.addColorStop(1, '#fff7ed');
        } else {
          grad.addColorStop(0, '#020617');
          grad.addColorStop(0.5, '#0f172a');
          grad.addColorStop(1, '#000000');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Header Text
        ctx.fillStyle = bgStyle === 'clean_light' ? '#0f172a' : '#ffffff';
        ctx.font = 'bold 52px Tajawal, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(restaurant.name, width / 2, 180);

        ctx.font = '400 28px Tajawal, sans-serif';
        ctx.fillStyle = bgStyle === 'clean_light' ? '#475569' : '#cbd5e1';
        ctx.fillText(restaurant.tagline || 'أشهى المأكولات والمشروبات', width / 2, 230);

        // Headline
        ctx.font = 'black 48px Tajawal, sans-serif';
        ctx.fillStyle = bgStyle === 'clean_light' ? '#ea580c' : '#fbbf24';
        ctx.fillText(headline.substring(0, 45), width / 2, 360);

        // Subheadline
        ctx.font = 'bold 30px Tajawal, sans-serif';
        ctx.fillStyle = bgStyle === 'clean_light' ? '#334155' : '#e2e8f0';
        ctx.fillText(subheadline.substring(0, 55), width / 2, 420);

        // Draw QR Code Image
        const qrImage = new Image();
        qrImage.crossOrigin = 'anonymous';
        qrImage.src = qrCodeDataUrl;

        await new Promise((resolve) => {
          qrImage.onload = () => {
            // White card box for QR
            const boxSize = 420;
            const boxX = (width - boxSize) / 2;
            const boxY = height - 680;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(boxX, boxY, boxSize, boxSize, 36);
            ctx.fill();

            // QR code inside box
            ctx.drawImage(qrImage, boxX + 30, boxY + 30, boxSize - 60, boxSize - 60);

            // CTA Text
            ctx.fillStyle = bgStyle === 'clean_light' ? '#0f172a' : '#ffffff';
            ctx.font = 'bold 36px Tajawal, sans-serif';
            ctx.fillText(ctaText, width / 2, height - 180);

            // Footer branding
            ctx.fillStyle = bgStyle === 'clean_light' ? '#94a3b8' : '#64748b';
            ctx.font = '400 24px Tajawal, sans-serif';
            ctx.fillText(`M3NUZ Story • ${restaurant.slug}.menuz.app`, width / 2, height - 100);

            resolve(true);
          };
        });

        // Convert canvas to image download
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${restaurant.slug}-story-design.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  const generateSocialCaption = () => {
    let text = `🔥 ${headline}\n✨ ${subheadline}\n\n`;
    if (selectedTemplate === 'offer' && selectedCoupon) {
      text += `🎁 استخدم كود الخصم: (${selectedCoupon.code}) للحصول على خصم خاص عند الطلب!\n`;
    } else if (selectedTemplate === 'dish' && selectedDish) {
      text += `🍲 جرب طبقنا المميز: ${selectedDish.name} بسعر ${formatPrice(selectedDish.price, currentCurrency)}\n`;
    }
    text += `📲 اطلب الآن مباشرة عبر المنيو الرقمي دون انتظار:\n${menuUrl}\n\n#${restaurant.slug} #منيو_رقمي #مطاعم #توصيل #وجبات #M3NUZ`;
    return text;
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generateSocialCaption());
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: generateSocialCaption(),
          url: menuUrl,
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      handleCopyCaption();
    }
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-indigo-900 via-purple-900 to-slate-950 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/10 backdrop-blur-md rounded-2xl text-purple-300">
              <Instagram className="w-6 h-6" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black">استديو التصاميم الجاهزة ومشاركة الستوري (Social Story Studio)</h2>
          </div>
          <p className="text-xs text-purple-200 max-w-xl">
            صمم وانشر تصاميم ستوري احترافية بجودة عالية لـ Instagram, TikTok, Snapchat, Facebook بنقرة واحدة لزيادة زوار منيو مطعمك!
          </p>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'جاري إنشاء التصميم...' : 'تحميل صورة الستوري HD'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            <span>1. اختر نوع القالب والتصميم</span>
          </h3>

          {/* Template Type Selector */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'qr', label: 'كود QR المنيو', icon: QrCode, desc: 'تصفح المنيو الرقمي' },
              { id: 'offer', label: 'كوبون العرض', icon: Tag, desc: 'أكواد الخصم والخصومات' },
              { id: 'dish', label: 'طبق مميز', icon: Utensils, desc: 'عرض الوجبة والأكثر مبيعاً' },
              { id: 'delivery', label: 'خدمة التوصيل', icon: Bike, desc: 'طلب الديلفري السريع' },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t.id as any);
                    if (t.id === 'qr') {
                      setHeadline('تصفّح المنيو الرقمي واستمتع بأشهى الوجبات! 🍔');
                      setSubheadline('امسح الكود بجوالك الآن للطلب المباشر دون انتظار');
                    } else if (t.id === 'offer') {
                      setHeadline(`خصم حصري! استخدم كود (${selectedCouponCode}) 🔥`);
                      setSubheadline('احصل على خصم عند الطلب المباشر عبر المنيو الرقمي');
                    } else if (t.id === 'dish') {
                      setHeadline(`طبق اليوم المميز: ${selectedDish?.name || 'الوجبة الخاصة'} ⭐️`);
                      setSubheadline('اطلبه الآن طازجاً وساخناً يصلك حتى باب بيتك');
                    } else if (t.id === 'delivery') {
                      setHeadline('خدمة التوصيل السريع أصبحت متاحة الآن! 🛵');
                      setSubheadline('نوصل طلبك لجميع المناطق بأسرع وقت وأعلى جودة');
                    }
                  }}
                  className={`p-3 rounded-2xl border text-right transition-all flex flex-col gap-1.5 ${
                    selectedTemplate === t.id
                      ? 'border-purple-600 bg-purple-500/10 text-purple-600 font-extrabold shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-black">{t.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">{t.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Background Palette Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
              طابع وألوان الخلفية
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'royal_dark', color: 'bg-slate-900 border-amber-400', name: 'ملكي فاخر' },
                { id: 'emerald_gold', color: 'bg-emerald-900 border-emerald-400', name: 'زمردي' },
                { id: 'sunset_coral', color: 'bg-orange-600 border-yellow-300', name: 'غروب نار' },
                { id: 'cyber_dark', color: 'bg-purple-950 border-cyan-400', name: 'نيون ليل' },
                { id: 'clean_light', color: 'bg-slate-100 border-orange-500', name: 'أبيض هادئ' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setBgStyle(p.id)}
                  title={p.name}
                  className={`h-10 rounded-2xl border-2 transition-all flex items-center justify-center ${p.color} ${
                    bgStyle === p.id ? 'scale-110 shadow-md ring-2 ring-purple-500' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {bgStyle === p.id && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 dark:text-slate-300">
              أبعاد ومقاس التصميم
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAspectRatio('9:16')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 ${
                  aspectRatio === '9:16'
                    ? 'border-purple-600 bg-purple-500/10 text-purple-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>ستوري (9:16) Instagram / TikTok</span>
              </button>
              <button
                onClick={() => setAspectRatio('1:1')}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center gap-1.5 ${
                  aspectRatio === '1:1'
                    ? 'border-purple-600 bg-purple-500/10 text-purple-600'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>بوست مربع (1:1) Feed</span>
              </button>
            </div>
          </div>

          {/* Custom Dish Selector if template === 'dish' */}
          {selectedTemplate === 'dish' && dishes.length > 0 && (
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                اختر الطبق لإدراجه في الستوري
              </label>
              <select
                value={selectedDishId}
                onChange={(e) => {
                  setSelectedDishId(e.target.value);
                  const d = dishes.find(dish => dish.id === e.target.value);
                  if (d) {
                    setHeadline(`وجبة اليوم المميزة: ${d.name} ⭐️`);
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                {dishes.map(d => (
                  <option key={d.id} value={d.id}>{d.name} - {formatPrice(d.price, currentCurrency)}</option>
                ))}
              </select>
            </div>
          )}

          {/* Custom Coupon Selector if template === 'offer' */}
          {selectedTemplate === 'offer' && coupons.length > 0 && (
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                اختر كود الخصم للتصميم
              </label>
              <select
                value={selectedCouponCode}
                onChange={(e) => {
                  setSelectedCouponCode(e.target.value);
                  setHeadline(`خصم حصري! استخدم كود (${e.target.value}) 🔥`);
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              >
                {coupons.map(c => (
                  <option key={c.id} value={c.code}>{c.code} ({c.type === 'percentage' ? `%${c.value}` : formatPrice(c.value, currentCurrency)})</option>
                ))}
              </select>
            </div>
          )}

          {/* Text Inputs */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                العنوان الرئيسي
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                العنوان الفرعي
              </label>
              <input
                type="text"
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 dark:text-slate-300 mb-1">
                نص زر الإجراء (CTA)
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCTAText(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Share Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={handleNativeShare}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة سريعة على تطبيقات السوشيال</span>
            </button>

            <button
              onClick={handleCopyCaption}
              className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-2"
            >
              {copiedCaption ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCaption ? 'تم نسخ نص المنشور والهاشتاجات!' : 'نسخ النص والهاشتاجات الجاهزة'}</span>
            </button>
          </div>
        </div>

        {/* Right Side Live 9:16 Canvas Story Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-950/80 rounded-3xl border border-slate-200 dark:border-slate-800 min-h-[600px]">
          <div className="text-center space-y-1 mb-4">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-black border border-purple-500/20">
              معاينة حية وتفاعلية 9:16 HD
            </span>
            <p className="text-xs text-slate-500 font-bold">التصميم مُجهّز تلقائياً مع الشعار ورمز QR الخاص بمطعمك</p>
          </div>

          {/* Render Story Card Frame */}
          <div
            ref={cardRef}
            className={`w-full max-w-[340px] rounded-[36px] bg-gradient-to-b ${bgPresets[bgStyle].bg} p-6 shadow-2xl border ${bgPresets[bgStyle].border} flex flex-col justify-between relative overflow-hidden transition-all`}
            style={{
              aspectRatio: aspectRatio === '9:16' ? '9/16' : '1/1',
            }}
          >
            {/* Background Accent Decorative Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-cyan-500/20 to-rose-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white/20 shadow-md"
                />
                <div className="text-right">
                  <h4 className="text-xs font-black tracking-tight">{restaurant.name}</h4>
                  <p className="text-[9px] opacity-70 truncate max-w-[140px]">{restaurant.tagline || 'المنيو الرقمي'}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-mono font-bold flex items-center gap-1 border border-white/10">
                <Sparkles className="w-3 h-3 text-amber-300" /> {badgeText}
              </span>
            </div>

            {/* Content Body */}
            <div className="relative z-10 my-auto py-4 text-center space-y-3">
              <h3 className="text-base sm:text-lg font-black leading-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
                {headline}
              </h3>

              <p className="text-[11px] opacity-80 leading-relaxed max-w-[260px] mx-auto">
                {subheadline}
              </p>

              {/* Template Specific Dynamic Content */}
              {selectedTemplate === 'offer' && selectedCoupon && (
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner my-2 space-y-1">
                  <span className="text-[10px] text-amber-300 font-bold block">كود الخصم الحصري:</span>
                  <div className="text-lg font-mono font-black tracking-widest text-white bg-black/40 py-1.5 rounded-xl border border-amber-400/30">
                    {selectedCoupon.code}
                  </div>
                  <span className="text-[9px] opacity-75 block">
                    خصم {selectedCoupon.type === 'percentage' ? `%${selectedCoupon.value}` : formatPrice(selectedCoupon.value, currentCurrency)} عند الطلب
                  </span>
                </div>
              )}

              {selectedTemplate === 'dish' && selectedDish && (
                <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 my-2 flex items-center gap-3 text-right">
                  <img
                    src={selectedDish.image}
                    alt={selectedDish.name}
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-white/30 shrink-0"
                  />
                  <div>
                    <h5 className="text-xs font-black">{selectedDish.name}</h5>
                    <p className="text-[10px] opacity-75 line-clamp-1">{selectedDish.description}</p>
                    <span className="text-xs font-black text-amber-300">{formatPrice(selectedDish.price, currentCurrency)}</span>
                  </div>
                </div>
              )}

              {/* Center QR Code Container */}
              <div className="p-3 bg-white rounded-3xl shadow-2xl border-4 border-white/20 inline-block mx-auto relative group">
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-32 h-32 sm:w-36 sm:h-36 object-contain rounded-xl"
                />
                <div className="absolute inset-0 bg-slate-900/80 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold text-white p-2">
                  امسح الكود بجوالك 📲
                </div>
              </div>
            </div>

            {/* Bottom CTA Footer */}
            <div className="relative z-10 text-center border-t border-white/10 pt-3 space-y-1">
              <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs shadow-lg inline-block">
                {ctaText}
              </div>
              <p className="text-[9px] opacity-60 font-mono pt-1">
                {restaurant.slug}.menuz.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
