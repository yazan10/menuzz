import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  QrCode, 
  CreditCard, 
  BarChart3, 
  Globe2, 
  Bell, 
  MapPin, 
  MessageSquare, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronDown, 
  Smartphone, 
  Zap, 
  Users, 
  TrendingUp,
  Star,
  PlusCircle,
  ThumbsUp,
  Award,
  X,
  FileText,
  BookOpen,
  Printer,
  Wrench,
  Gift,
  UtensilsCrossed,
  Calendar,
  Palette,
  Crown,
  DollarSign,
  Tag,
  Clock,
  Search,
  ChevronRight,
  ChevronLeft,
  Check,
  Layers,
  Truck
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../lib/translations';
import { clientLogos, subscriptionPlansList } from '../data/mockData';
import { PricingSection } from './PricingSection';
import { MenuzLogo } from './MenuzLogo';
import { GooeySearchBar } from './GooeySearchBar';
import { SocialDoodleFollow } from './SocialDoodleFollow';
import { FeedbackWidget } from './FeedbackWidget';
import { FaqButton } from './FaqButton';

interface LandingPageProps {
  currentLang: Language;
  currentCurrency?: string;
  onNavigateToMenu: () => void;
  onNavigateToAdmin: () => void;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigatePaymentMethods?: () => void;
}

const ALL_PLATFORM_FEATURES = [
  {
    id: 'feat_qr',
    title: 'المنيو الرقمي السريع وسرعة رمز الـ QR الحصري',
    tagline: 'تصفح بصري مبهر على جوال الزبون بنقرة كود واحدة دون الحاجة لتحميل تطبيقات',
    category: 'customer',
    badge: 'استجابة فائقة 📱',
    icon: QrCode,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&fit=crop&q=80',
    description: 'نظام منيو رقمي ذكي يتيح للزبائن تصفح قائمة الطعام بالكامل عبر مسح كود الـ QR الموجود على الطاولة. يفتح فوراً على جوال العميل بأقل من ثانية واحدة بدون الحاجة لتنزيل أي تطبيق من المتاجر، مع إمكانية التنقل بين الأقسام ورؤية الصور عالية الجودة، المكونات، والسعرات الحرارية.',
    keyBenefits: [
      'توفير 100% من مصاريف الطباعة الورقية المستمرة وتكاليف التعديل',
      'عرض صور احترافية عالية الدقة تجذب الزبائن وتزيد شهيتهم للشراء',
      'دعم الوضع الليلي (Dark Mode) المريح للعين في الأماكن الهادئة والمقاهي'
    ],
    steps: ['مسح كود الـ QR بالكاميرا 📱', 'تصفح الوجبات والأقسام بالصور 🍲', 'الطلب المباشر أو التوجه للويتر 🛍️'],
    targetView: 'menu'
  },
  {
    id: 'feat_print',
    title: 'الطباعة المباشرة لتذاكر المطبخ والفواتير الحرارية',
    tagline: 'إصدار تلقائي فوري لطابعات المطبخ والـ POS بنقرة واحدة',
    category: 'kitchen',
    badge: 'طباعة حرارية 🖨️',
    icon: Printer,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=900&fit=crop&q=80',
    description: 'ربط مباشر مع جميع أنواع الطابعات الحرارية المخصصة للمطاعم والمطابخ (80mm & 58mm). يسمح لك بضغطة زر واحدة بطباعة تذكرة المطبخ المكونة من رقم الطاولة، قائمة الأطباق، الملاحظات الخاصة بكل طبق (بدون بصل، زيادة صوص)، وفاتورة العميل شاملة الضريبة.',
    keyBenefits: [
      'منع الأخطاء الشفوية والنسيان بين صالة الطعام وعمال المطبخ',
      'طباعة واضحة ومباشرة دون الحاجة لتثبيت برامج وسيطة أو تعريفات معقدة',
      'عرض تفصيلي لطريقة الدفع (كاش، Apple Pay، مدى) والمبالغ المدفوعة'
    ],
    steps: ['وصول الطلب للوحة التحكم 🔔', 'الضغط على زر طباعة التذكرة 🖨️', 'خروج الورقة الحرارية في المطبخ 📄'],
    targetView: 'admin'
  },
  {
    id: 'feat_order',
    title: 'نظام الطلب المباشر من الطاولة والسفري (Table & Takeaway)',
    tagline: 'إرسال الطلب فوراً من جوال الزبون إلى شاشة التحضير',
    category: 'customer',
    badge: 'رفع المبيعات بنسبة 35% 🍔',
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&fit=crop&q=80',
    description: 'يمكّن الزبون من تحديد وجباته واختيار الخيارات الفرعية (درجة استواء اللحم، نوع الصوص، إضافة الجبن) ثم إرسال الطلب مباشرة إلى المطبخ مع تحديد رقم الطاولة أو اختيار الطلب السفري (Takeaway)، مع الدفع اللحظي أو عند الاستلام.',
    keyBenefits: [
      'زيادة متوسط الفاتورة بفضل الاقتراحات والإضافات المدفوعة (Up-selling)',
      'تخفيف الازدحام وتقليل انتظار عمال الصالة في أوقات الذروة',
      'تتبع حالة التحضير مباشرة من شاشة جوال العميل'
    ],
    steps: ['تحديد الوجبة والإضافات 🍔', 'إدخال رقم الطاولة أو اختيار سفري 🏷️', 'تأكيد وإرسال الطلب ⚡'],
    targetView: 'menu'
  },
  {
    id: 'feat_fx',
    title: 'محرك العملات والتحديث اللحظي لأسعار الصرف',
    tagline: 'تحويل تلقائي بين 5+ عملات رئيسية لراحة الزوار والضيوف',
    category: 'management',
    badge: 'أسعار صرف حية 💱',
    icon: DollarSign,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&fit=crop&q=80',
    description: 'نظام صرف عملات متطور يربط العملة المحلية (الشيقل ₪، الريال ﷼، الدينار JOD، الدولار $، اليورو €) مع تحديثات أسعار الصرف العالمية المباشرة. يتيح للسياح والمغتربين رؤية أسعار الوجبات بعلمتهم الأصلية دون أي ارتباك.',
    keyBenefits: [
      'تسهيل قرار الشراء لدى السياح والزوار الأجانب',
      'تحديث أسعار الصرف تلقائياً في الخلفية بدون تدخل يدوي',
      'تحديد العملة الافتراضية المناسبة لكل دولة وفرع'
    ],
    steps: ['اختيار العملة المفضلة 💱', 'تحول الأسعار فورياً على المنيو 🔄', 'عرض الإجمالي النهائي بدقة 💳'],
    targetView: 'menu'
  },
  {
    id: 'feat_reports',
    title: 'تصدير التقارير المالية والطلبات بصيغة CSV و PDF',
    tagline: 'رسوم بيانية تفاعلية وتصدير تقارير مبيعات وشاشات تحليلات',
    category: 'management',
    badge: 'تصدير CSV & PDF 📊',
    icon: BarChart3,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&fit=crop&q=80',
    description: 'متابعة حركة المبيعات اليومية والشهرية، وتحليل أداء الأطباق، وتصدير كافة سجلات المبيعات والطلبات في ملفات CSV جاهزة لبرامج المحاسبة أو طباعتها كملفات PDF مفصلة وموثقة.',
    keyBenefits: [
      'تصدير تقارير مبيعات شاملة جاهزة للطباعة أو المحاسب القانوني',
      'رؤية الوجبات الأكثر مبيعاً لضبط المخزون وقائمة الأطباق',
      'متابعة نمو أداء الفروع في رسم بياني تفاعلي دقيق'
    ],
    steps: ['فتح تبويب التحليلات 📈', 'قراءة المبيعات والأرباح 💡', 'تصدير تقرير CSV أو PDF بنقرة واحدة 📁'],
    targetView: 'admin'
  },
  {
    id: 'feat_brand',
    title: 'تخصيص الهوية البصرية وإخفاء حقوق العلامة (White-Label)',
    tagline: 'ألوانك، لوجو مطعمك، وهويتك البصرية الخاصة 100%',
    category: 'marketing',
    badge: 'هوية خاصة بالكامل 👑',
    icon: Palette,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&fit=crop&q=80',
    description: 'تخصيص الهوية البصرية للمنيو بالكامل عبر اختيار الألوان الرئيسية، رفع اللوجو وغلاف الصفحة الرئيسية، وتغيير الخطوط، مع إمكانية إخفاء وتجريد شعار المنصة للباقات المتقدمة.',
    keyBenefits: [
      'تعزيز هوية وصورة مطعمك التجارية أمام الزبائن',
      'مظهر فاخر يناسب الفنادق والمقاهي الراقية والمطاعم الفاخرة',
      'تنعكس الألوان والتعديلات فورياً على جميع الأجهزة'
    ],
    steps: ['تحديد لون البراند 🎨', 'رفع لوجو وغلاف المطعم 🖼️', 'تطبيق فوري للهوية 🚀'],
    targetView: 'admin'
  },
  {
    id: 'feat_delivery',
    title: 'نظام توصيل الطلبات للمنازل والعناوين (Delivery System)',
    tagline: 'إدارة خيارات التوصيل، حساب الرسوم، ومتابعة السائقين والطلبات الخارجة',
    category: 'customer',
    badge: 'توصيل مدمج 🛵',
    icon: Truck,
    image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=900&fit=crop&q=80',
    description: 'يتيح للعملاء اختيار خدمة التوصيل للمنازل (Delivery) عند إنشاء الطلب، وتحديد عنوان التوصيل الدقيق والملاحظات الخاصة بالسائق، مع احتساب رسوم التوصيل تلقائياً في فاتورة الطلب ومتابعة حالتها في لوحة التحكم.',
    keyBenefits: [
      'تمكين المطعم من زيادة المبيعات الخارجية وتوسيع نطاق التغطية الجغرافية',
      'إمكانية تحديد رسوم توصيل مرنة قابلة للتعديل من لوحة تحكم صاحب المطعم',
      'تتبع حالة الطلب من التحضير إلى (جاري التوصيل 🛵) وحتى التسليم للعميل'
    ],
    steps: ['اختيار التوصيل 🛵', 'إدخال العنوان والملاحظات 📍', 'استلام الفاتورة وتتبع السائق 📦'],
    targetView: 'menu'
  },
  {
    id: 'feat_loyalty',
    title: 'نظام نقاط الولاء والخصومات التلقائية (Loyalty Points)',
    tagline: 'كسب نقاط مع كل طلب واستبدالها بخصومات مباشرة تشجع على عودة الزبائن',
    category: 'marketing',
    badge: 'برنامج الولاء ⭐',
    icon: Gift,
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=900&fit=crop&q=80',
    description: 'برنامج مكافآت ذكي يمنح الزبائن نقاط ولاء تلقائية مقابل كل طلب يتم إتمامه عبر المنيو الرقمي. يمكن للزبون تجميع النقاط ورؤية رصيده في رأس المنيو، واستبدال النقاط بخصم مباشر عند السداد.',
    keyBenefits: [
      'مضاعفة ولاء العملاء وتشجيعهم على الطلب المتكرر من مطعمك',
      'التحكم الكامل بمعدل كسب النقاط وقيمة الخصم عند الاستبدال',
      'عرض رصيد النقاط والخصومات المستحقة بشكل شفاف وجذاب للزبون'
    ],
    steps: ['إتمام الطلب وكسب النقاط ⭐', 'عرض رصيد النقاط في رأس المنيو 🎁', 'تفعيل الخصم بنقرة زر في السلة 💵'],
    targetView: 'menu'
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  currentLang,
  currentCurrency = 'ILS',
  onNavigateToMenu,
  onNavigateToAdmin,
  onOpenAuth,
  onNavigatePaymentMethods,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeDocument, setActiveDocument] = useState<'privacy' | 'terms' | null>(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState<'all' | 'customer' | 'kitchen' | 'management' | 'marketing'>('all');
  const [featureSearchQuery, setFeatureSearchQuery] = useState('');
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(currentLang, key);

  // Scroll Progress and State for 3D Interactive Plate & Paper Menu
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPastHero, setIsPastHero] = useState(false);
  const [activeFeatureCardIndex, setActiveFeatureCardIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Map 0 to 900px scroll range to 0 - 1 progress range
      const progress = Math.min(Math.max(scrollTop / 900, 0), 1);
      setScrollProgress(progress);
      
      // Hide completely if user scrolls past 1500px to keep lower pages clean
      setIsPastHero(scrollTop > 1500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Continuous auto-rotation for the feature cards inside the orange device card
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeatureCardIndex(prev => (prev + 1) % 6);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Reviews & Ratings state
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev_1',
      name: 'شيف عبد الله النابلسي',
      restaurant: 'مطعم و كافيه القصر الملكي • القدس',
      rating: 5,
      comment: 'منصة menuz غيّرت طريقة تعاملنا مع الطلبات تماماً! تسريع طلبات الطاولات ورفع متوسط قيمة الفاتورة بنسبة 35% عبر الصور الجذابة للوجبات.',
      date: 'منذ يومين',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&fit=crop'
    },
    {
      id: 'rev_2',
      name: 'مهندس محمد العبدالله',
      restaurant: 'سلسلة كافيهات روستر • الرياض وجدة',
      rating: 5,
      comment: 'الدعم المباشر، سرعة التحميل الممتازة على الجوال، والتحويل اللحظي للعملات جعل الزوار والسياح يطلبون بكل راحة وبدون تعقيد.',
      date: 'منذ 4 أيام',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop'
    },
    {
      id: 'rev_3',
      name: 'سارة المقدسي',
      restaurant: 'مطعم أورينت لاونج • رام الله',
      rating: 5,
      comment: 'سهولة تغيير الأسعار والأطباق من الموبايل بدون طباعة ورقية جديدة وفرت علينا آلاف الدنانير سنوياً. تجربة ممتازة جداً!',
      date: 'منذ أسبوع',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&fit=crop'
    }
  ]);

  const [showAddReview, setShowAddReview] = useState(false);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRestaurant, setNewReviewRestaurant] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: `rev_${Date.now()}`,
      name: newReviewName,
      restaurant: newReviewRestaurant || 'مطعم معتمد • عميل menuz',
      rating: newReviewRating,
      comment: newReviewComment,
      date: 'الآن',
      verified: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&fit=crop'
    };

    setReviewsList([newRev, ...reviewsList]);
    setNewReviewName('');
    setNewReviewRestaurant('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowAddReview(false);
    }, 2000);
  };

  const features = [
    {
      icon: QrCode,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    },
    {
      icon: CreditCard,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      color: 'bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400',
    },
    {
      icon: BarChart3,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    },
    {
      icon: Globe2,
      title: t('feature4Title'),
      desc: t('feature4Desc'),
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    },
    {
      icon: Bell,
      title: t('feature5Title'),
      desc: t('feature5Desc'),
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    },
    {
      icon: MapPin,
      title: t('feature6Title'),
      desc: t('feature6Desc'),
      color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400',
    },
  ];

  const faqs = [
    {
      q: 'كيف يعمل نظام المنيو الرقمي QR من menuz؟',
      a: 'يقوم النظام بإنشاء رمز QR خا ص بكل طاولة أو فرع لمطعمك. عند مسح الكود بكاميرا الجوال، يفتح المنيو التفاعلي فوراً بدون حاجة لتحميل أي تطبيق، ويمكن للعميل التصفح، الطلب والدفع مباشرة.'
    },
    {
      q: 'هل يمكنني تغيير الأطباق والأسعار في أي وقت؟',
      a: 'نعم! من خلال لوحة التحكم الخاصة بك، يمكنك تعديل الأسعار، إضافة أطباق جديدة، إخفاء الوجبات النافذة فوراً دون الحاجة لإعادة طباعة رموز الـ QR.'
    },
    {
      q: 'ما هي بوابات الدفع الإلكترونية المدعومة؟',
      a: 'يدعم النظام بطاقات مدى، Apple Pay، الفيزا والماستركارد، STC Pay، بالإضافة إلى خيار الدفع النقدي (كاش) عند الطاولة.'
    },
    {
      q: 'هل يدعم النظام الفروع المتعددة وتقارير المبيعات؟',
      a: 'بالتأكيد! يمكنك إدارة جميع فروع مطعمك من حساب واحد ومتابعة أداء المبيعات اليومية والشهرية لكل فرع بدقة عبر رسم بياني تحليلي.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold relative overflow-x-hidden">
      
      {/* INTERACTIVE 3D SCROLLING PLATE-TO-PAPER-MENU FLOATING WIDGET */}
      {!isPastHero && (
        <>
          {/* Desktop/Large Screens Float Container - Placed elegantly on the Right side (behind the text column lg:col-span-7) as a beautiful glassmorphic backdrop (z-[5]) */}
          <div className="fixed right-[4%] xl:right-[6%] top-[22%] xl:top-[24%] w-[420px] h-[420px] hidden lg:flex items-center justify-center z-[5] pointer-events-none select-none transition-all duration-300">
            
            {/* 3D shadow/glow cast under the active element */}
            <div 
              className="absolute w-[280px] h-[280px] rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-3xl transition-opacity duration-300"
              style={{
                transform: `translateY(${50 + scrollProgress * 30}px) scale(${1.1 - scrollProgress * 0.4})`,
                opacity: Math.max(0, 0.4 - scrollProgress * 1.5)
              }}
            />

            {/* 1. THE 3D PLATE OF FOOD (Translucent frosted glass plate with elegant golden-amber accents) */}
            <div 
              className="absolute w-[340px] h-[340px] flex items-center justify-center transition-all duration-100"
              style={{
                transform: `perspective(1200px) rotateZ(${scrollProgress * 360}deg) rotateX(${15 - scrollProgress * 10}deg) rotateY(${-12 + scrollProgress * 20}deg) scale(${1 - scrollProgress * 0.5}) translateY(${scrollProgress * -80}px)`,
                opacity: scrollProgress > 0.65 ? 0 : Math.max(0, 0.8 - scrollProgress * 1.6),
                visibility: scrollProgress > 0.65 ? 'hidden' : 'visible'
              }}
            >
              {/* Glass Plate with Frosted Gold Rim */}
              <div className="w-[300px] h-[300px] rounded-full bg-gradient-to-br from-white/20 via-amber-400/40 to-amber-600/20 p-[4px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-xl relative border border-white/20">
                {/* Plate inner body */}
                <div className="w-full h-full rounded-full bg-white/5 dark:bg-slate-900/10 p-1 relative flex items-center justify-center overflow-hidden shadow-inner border border-amber-400/20">
                  <div className="absolute inset-4 rounded-full border border-amber-400/10" />
                  {/* Food Image, translucent & elegant */}
                  <img 
                    src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=500&fit=crop&q=80" 
                    alt="طبق طعام شهي" 
                    className="w-full h-full rounded-full object-cover saturate-150 brightness-110 opacity-35 dark:opacity-25 mix-blend-screen"
                    referrerPolicy="no-referrer"
                  />
                  {/* Outer light sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/5 pointer-events-none" />
                </div>
              </div>

              {/* Floating garnish leaves with offset rotation for layered 3D depth */}
              <div 
                className="absolute top-4 right-10 w-10 h-10 pointer-events-none drop-shadow-xl z-10 opacity-30"
                style={{ transform: `rotate(${-scrollProgress * 220}deg) translate(15px, -20px)` }}
              >
                <span className="text-3xl">🍃</span>
              </div>
              <div 
                className="absolute bottom-6 left-12 w-10 h-10 pointer-events-none drop-shadow-xl z-10 opacity-30"
                style={{ transform: `rotate(${scrollProgress * 180}deg) translate(-15px, 20px)` }}
              >
                <span className="text-3xl">🌿</span>
              </div>
            </div>

          </div>

          {/* Mobile/Tablet Background Ambient Float Container - Transparent Glass behind layout (z-0) */}
          <div className="fixed right-1/2 top-[42%] translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] lg:hidden flex items-center justify-center z-0 pointer-events-none select-none opacity-10 dark:opacity-15 transition-all duration-300">
            {/* The same food plate spinning behind mobile view */}
            <div 
              className="absolute w-[240px] h-[240px] transition-all duration-100"
              style={{
                transform: `perspective(800px) rotateZ(${scrollProgress * 300}deg) scale(${1 - scrollProgress * 0.5})`,
                opacity: scrollProgress > 0.5 ? 0 : Math.max(0, 1 - scrollProgress * 2.2),
              }}
            >
              <div className="w-full h-full rounded-full bg-white/20 p-2 shadow-2xl overflow-hidden border border-white/30 backdrop-blur-md">
                <img 
                  src="https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&fit=crop&q=80" 
                  alt="طبق طعام" 
                  className="w-full h-full rounded-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* HERO SECTION matching menuz Image exactly */}
      <section className="relative text-white pt-8 pb-20 md:pb-32 px-4 overflow-hidden border-b border-emerald-900">
        {/* Section background layer at z-0 */}
        <div className="absolute inset-0 bg-[#0b4f42] z-0 pointer-events-none" />
        
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Right Column (Text Content in RTL) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-right z-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-200 text-sm font-semibold shadow-inner">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>{t('heroBadge')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
                {t('heroTitle')}
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
                {t('heroSubtitle')}
              </p>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-base bg-orange-600 hover:bg-orange-500 text-white shadow-xl hover:shadow-orange-600/30 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('heroCtaPrimary')}</span>
                  <ArrowLeft className="w-5 h-5 rtl:rotate-0 ltr:rotate-180" />
                </button>

                <button
                  onClick={onNavigateToMenu}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl font-bold text-base bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 text-orange-400" />
                  <span>{t('heroCtaSecondary')}</span>
                </button>
              </div>

              {/* Quick Feature Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-emerald-900/80 text-emerald-200 text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>تجهيز فورى خلال دقائق</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>بدون تحميل تطبيق</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>دعم كامل للغة العربية</span>
                </div>
              </div>

            </div>

            {/* Left Column (Hero Graphic matching Image style) */}
            <div className="lg:col-span-5 relative flex justify-center z-10">
              
              {/* Terracotta Orange Arch Shape Background with flexible height */}
              <div className="relative w-full max-w-md min-h-[480px] sm:min-h-[520px] bg-gradient-to-t from-orange-600 via-orange-500 to-orange-500 rounded-[2.5rem] sm:rounded-[3rem] p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-hidden border-4 border-orange-400/30 text-right dir-rtl">
                
                {/* Top Header Row inside Orange Card */}
                <div className="flex items-center justify-between gap-2 z-20 pb-1">
                  <div className="bg-black/25 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-amber-300 text-[11px] font-black flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>مميزات المنيو الرقمي</span>
                  </div>

                  {/* Simulated Floating QR Badge */}
                  <div className="bg-white/95 text-slate-900 px-3 py-1.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 backdrop-blur-md transform -rotate-1 hover:rotate-0 transition-transform">
                    <div className="w-7 h-7 bg-slate-900 rounded-lg p-1 flex items-center justify-center shrink-0">
                      <QrCode className="w-full h-full text-white" />
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black block text-slate-900 leading-tight">طاولة رقم 05</span>
                      <span className="text-[8px] text-emerald-700 font-extrabold block leading-none">جاهز للمسح</span>
                    </div>
                  </div>
                </div>

                {/* Middle Grid: 6 Smart Feature Cards */}
                <div className="z-10 my-2 space-y-1.5">
                  <div className="flex items-center justify-between text-white/90 text-[10px] font-black tracking-wider uppercase px-1">
                    <span>⚡ 6 تقنيات مدمجة</span>
                    <span className="text-amber-300 text-[10px]">اضغط لتكبير الميزه</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-right">
                    {/* Feature 1 */}
                    <div 
                      onClick={() => setActiveFeatureCardIndex(0)}
                      className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        activeFeatureCardIndex === 0 
                          ? "bg-amber-400 text-slate-950 border-amber-300 scale-102 shadow-xl font-black shadow-amber-400/30 ring-2 ring-amber-300 z-10" 
                          : "bg-white/10 hover:bg-white/20 text-white/90 border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-start gap-1.5 mb-0.5">
                        <Zap className={`w-3.5 h-3.5 shrink-0 ${activeFeatureCardIndex === 0 ? "text-slate-950 animate-bounce" : "text-amber-300"}`} />
                        <span className="text-[11px] font-black">سرعة فائقة</span>
                      </div>
                      <p className="text-[9px] leading-tight opacity-90">تصفح فوري وسريع للوجبات بأقل من ثانية</p>
                    </div>

                    {/* Feature 2: Design & Graphics */}
                    <div 
                      onClick={() => setActiveFeatureCardIndex(1)}
                      className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        activeFeatureCardIndex === 1 
                          ? "bg-amber-400 text-slate-950 border-amber-300 scale-102 shadow-xl font-black shadow-amber-400/30 ring-2 ring-amber-300 z-10" 
                          : "bg-white/10 hover:bg-white/20 text-white/90 border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-start gap-1.5 mb-0.5">
                        <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activeFeatureCardIndex === 1 ? "text-slate-950 animate-bounce" : "text-amber-300"}`} />
                        <span className="text-[11px] font-black">تصاميم وجرافيك</span>
                      </div>
                      <p className="text-[9px] leading-tight opacity-90">قوالب بصرية فاخرة وهويات جذابة للمنيو</p>
                    </div>

                    {/* Feature 3 */}
                    <div 
                      onClick={() => setActiveFeatureCardIndex(2)}
                      className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        activeFeatureCardIndex === 2 
                          ? "bg-amber-400 text-slate-950 border-amber-300 scale-102 shadow-xl font-black shadow-amber-400/30 ring-2 ring-amber-300 z-10" 
                          : "bg-white/10 hover:bg-white/20 text-white/90 border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-start gap-1.5 mb-0.5">
                        <TrendingUp className={`w-3.5 h-3.5 shrink-0 ${activeFeatureCardIndex === 2 ? "text-slate-950 animate-bounce" : "text-amber-300"}`} />
                        <span className="text-[11px] font-black">تقارير حية</span>
                      </div>
                      <p className="text-[9px] leading-tight opacity-90">رصد المبيعات وتفاعل العملاء لحظة بلحظة</p>
                    </div>

                    {/* Feature 4 */}
                    <div 
                      onClick={() => setActiveFeatureCardIndex(3)}
                      className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        activeFeatureCardIndex === 3 
                          ? "bg-amber-400 text-slate-950 border-amber-300 scale-102 shadow-xl font-black shadow-amber-400/30 ring-2 ring-amber-300 z-10" 
                          : "bg-white/10 hover:bg-white/20 text-white/90 border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-start gap-1.5 mb-0.5">
                        <Printer className={`w-3.5 h-3.5 shrink-0 ${activeFeatureCardIndex === 3 ? "text-slate-950 animate-bounce" : "text-blue-300"}`} />
                        <span className="text-[11px] font-black">طباعة المطبخ</span>
                      </div>
                      <p className="text-[9px] leading-tight opacity-90">طباعة تلقائية فورية لأمر الشيف فور الطلب</p>
                    </div>

                    {/* Feature 5 */}
                    <div 
                      onClick={() => setActiveFeatureCardIndex(4)}
                      className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        activeFeatureCardIndex === 4 
                          ? "bg-amber-400 text-slate-950 border-amber-300 scale-102 shadow-xl font-black shadow-amber-400/30 ring-2 ring-amber-300 z-10" 
                          : "bg-white/10 hover:bg-white/20 text-white/90 border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-start gap-1.5 mb-0.5">
                        <Gift className={`w-3.5 h-3.5 shrink-0 ${activeFeatureCardIndex === 4 ? "text-slate-950 animate-bounce" : "text-pink-300"}`} />
                        <span className="text-[11px] font-black">نقاط الولاء</span>
                      </div>
                      <p className="text-[9px] leading-tight opacity-90">خصومات ومكافآت تشجع عودة الزبائن</p>
                    </div>

                    {/* Feature 6 */}
                    <div 
                      onClick={() => setActiveFeatureCardIndex(5)}
                      className={`p-2.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                        activeFeatureCardIndex === 5 
                          ? "bg-amber-400 text-slate-950 border-amber-300 scale-102 shadow-xl font-black shadow-amber-400/30 ring-2 ring-amber-300 z-10" 
                          : "bg-white/10 hover:bg-white/20 text-white/90 border-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-start gap-1.5 mb-0.5">
                        <Globe2 className={`w-3.5 h-3.5 shrink-0 ${activeFeatureCardIndex === 5 ? "text-slate-950 animate-bounce" : "text-emerald-300"}`} />
                        <span className="text-[11px] font-black">تعدد الفروع</span>
                      </div>
                      <p className="text-[9px] leading-tight opacity-90">إدارة وتحديث جميع فروعك من حساب واحد</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Status Cards */}
                <div className="relative z-10 w-full text-center space-y-2 pt-1">
                  <div className="bg-slate-900/95 text-white rounded-2xl p-3.5 shadow-2xl border border-slate-700/80 backdrop-blur-md text-right">
                    <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        طلب مباشر جديد
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">#MNZ-8012</span>
                    </div>
                    <div className="pt-2">
                      <div className="text-sm font-black text-amber-300">كبسة نعيمي + عصير موهيتو</div>
                      <div className="text-[10px] text-slate-300 font-medium">طاولة 05 • الدفع: Apple Pay</div>
                    </div>
                  </div>

                  <div className="bg-white text-slate-900 rounded-2xl p-3 shadow-xl flex items-center justify-between text-xs font-bold px-4">
                    <span>لوحة تحكم الفروع المباشرة</span>
                    <span className="text-orange-600 bg-orange-100 px-2.5 py-0.5 rounded-full text-[10px] font-black">نشط الآن</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* CLIENT TRUST ANIMATED MARQUEE TICKER BAR */}
      <section className="bg-slate-50 dark:bg-slate-900/90 py-10 border-y border-slate-200 dark:border-slate-800 overflow-hidden relative shadow-inner z-10">
        
        {/* Centered Heading */}
        <div className="text-center mb-8 px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('trustTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            ينضم إلينا يومياً عشرات المطاعم والمقاهي في فلسطين والوطن العربي والعالم
          </p>
        </div>

        {/* Edge Gradient Fades - subtle on mobile so cards don't disappear */}
        <div className="absolute inset-y-0 right-0 w-8 sm:w-32 md:w-48 bg-gradient-to-l from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-8 sm:w-32 md:w-48 bg-gradient-to-r from-slate-50 dark:from-slate-900 via-slate-50/80 dark:via-slate-900/80 to-transparent z-20 pointer-events-none" />

        <div className="marquee-container w-full overflow-hidden relative py-3 flex justify-start [direction:ltr]" dir="ltr">
          <div 
            className="flex flex-nowrap w-max animate-marquee-seamless hover:[animation-play-state:paused] [direction:ltr] justify-start" 
            dir="ltr"
          >
            {/* TRACK COPY 1 */}
            <div className="flex items-center gap-4 sm:gap-6 pr-4 sm:pr-6 shrink-0 flex-nowrap">
              {clientLogos.map((client, i) => (
                <div 
                  key={`t1-${i}`} 
                  onClick={onNavigateToMenu}
                  title="اضغط لتصفح المنيو المباشر للمطعم"
                  className="flex flex-col items-center gap-2 bg-white dark:bg-slate-800/90 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-md shrink-0 hover:scale-108 active:scale-95 hover:shadow-2xl hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50/20 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer group/card select-none transform-gpu"
                  dir="rtl"
                >
                  {/* CIRCULAR STORE LOGO WITH COUNTRY FLAG BADGE ON TOP RIGHT */}
                  <div className="relative">
                    <img 
                      src={client.logo} 
                      alt={client.name} 
                      className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-orange-500/80 shadow-md group-hover/card:ring-4 group-hover/card:ring-orange-500 group-hover/card:scale-110 transition-all duration-300 bg-white" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop';
                      }}
                    />
                    {/* Flag badge pinned on top-right corner of logo */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-xs sm:text-sm leading-none shrink-0 group-hover/card:scale-115 transition-transform duration-300" title={client.country}>
                      {client.flag || '🇵🇸'}
                    </div>
                  </div>

                  {/* STORE NAME & REGION */}
                  <div className="text-center space-y-1">
                    <span className="text-xs sm:text-sm font-black block text-slate-900 dark:text-white max-w-[120px] sm:max-w-[140px] truncate group-hover/card:text-orange-600 dark:group-hover/card:text-orange-400 transition-colors">
                      {client.name}
                    </span>
                    <span className="text-[9.5px] sm:text-[10px] font-extrabold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800/50 flex items-center justify-center gap-1 group-hover/card:bg-orange-500 group-hover/card:text-white transition-colors duration-300">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span>{client.region}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* TRACK COPY 2 (Identical clone for seamless 100% infinite loop) */}
            <div className="flex items-center gap-4 sm:gap-6 pr-4 sm:pr-6 shrink-0 flex-nowrap" aria-hidden="true">
              {clientLogos.map((client, i) => (
                <div 
                  key={`t2-${i}`} 
                  onClick={onNavigateToMenu}
                  title="اضغط لتصفح المنيو المباشر للمطعم"
                  className="flex flex-col items-center gap-2 bg-white dark:bg-slate-800/90 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-md shrink-0 hover:scale-108 active:scale-95 hover:shadow-2xl hover:border-orange-500 dark:hover:border-orange-400 hover:bg-orange-50/20 dark:hover:bg-slate-800 transition-all duration-300 cursor-pointer group/card select-none transform-gpu"
                  dir="rtl"
                >
                  {/* CIRCULAR STORE LOGO WITH COUNTRY FLAG BADGE ON TOP RIGHT */}
                  <div className="relative">
                    <img 
                      src={client.logo} 
                      alt={client.name} 
                      className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-orange-500/80 shadow-md group-hover/card:ring-4 group-hover/card:ring-orange-500 group-hover/card:scale-110 transition-all duration-300 bg-white" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop';
                      }}
                    />
                    {/* Flag badge pinned on top-right corner of logo */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-xs sm:text-sm leading-none shrink-0 group-hover/card:scale-115 transition-transform duration-300" title={client.country}>
                      {client.flag || '🇵🇸'}
                    </div>
                  </div>

                  {/* STORE NAME & REGION */}
                  <div className="text-center space-y-1">
                    <span className="text-xs sm:text-sm font-black block text-slate-900 dark:text-white max-w-[120px] sm:max-w-[140px] truncate group-hover/card:text-orange-600 dark:group-hover/card:text-orange-400 transition-colors">
                      {client.name}
                    </span>
                    <span className="text-[9.5px] sm:text-[10px] font-extrabold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800/50 flex items-center justify-center gap-1 group-hover/card:bg-orange-500 group-hover/card:text-white transition-colors duration-300">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span>{client.region}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POWERED BY GOOGLE, STRIPE & PALESTINIAN TECH PARTNERS */}
      <section className="py-12 bg-slate-100/80 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              بنية تحتية عالمية ومحلية موثوقة
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              منصة مدعومة من كبرى الشركات العالمية والمؤسسات التقنية الفلسطينية 🇵🇸
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Google Cloud */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:border-blue-500 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/80 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-black text-xl">
                G
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide block">Google Cloud Platform</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">مدعوم من استضافة وسحابة جوجل</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">سرعة استجابة فائقة وأمان عالي وتزامن بيانات مباشر</p>
              </div>
            </div>

            {/* Stripe Payments */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:border-purple-500 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/80 flex items-center justify-center shrink-0 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-black text-xl">
                S
              </div>
              <div>
                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide block">Stripe Payments</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">ربط مدفوعات سترايب المباشر</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">معالجة البطاقات، Apple Pay والدفع الإلكتروني المشفر</p>
              </div>
            </div>

            {/* Palestinian Tech Ecosystem */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:border-emerald-500 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-black text-xl">
                🇵🇸
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide block">شركات ومبادرات تقنية فلسطينية</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">ابتكار فلسطيني للمطاعم العربية</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">مطوّرة بالكامل لتلائم السوق الفلسطيني والعربي والرموز المحلية</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE DETAILED FEATURES SHOWCASE SECTION */}
      <section id="features" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 text-xs font-black border border-orange-300 dark:border-orange-800/50 shadow-sm">
            <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
            <span>الدليل الشامل لمميزات المنصة مع الشروحات التفصيلية ⚡</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white leading-tight">
            كل ما يحتاجه مطعمك لتنظيم الطلبات ومضاعفة الأرباح 🚀
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            استكشف الشرح التفصيلي لجميع أدوات ومميزات منصة menuz المجهّزة لخدمة المطاعم، الكافيهات، والسلاسل الفندقية باللغتين العربية والإنجليزية.
          </p>

          {/* QUICK SEARCH & CATEGORY FILTER TABS */}
          <div className="pt-6 space-y-4 max-w-3xl mx-auto">
            {/* Search Input with Gooey Orb Effect */}
            <div className="py-2 flex justify-center">
              <GooeySearchBar
                value={featureSearchQuery}
                onChange={setFeatureSearchQuery}
                placeholder="ابحث في المميزات (مثال: طباعة، عملات، QR، توصيل)..."
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {[
                { id: 'all', label: 'جميع المميزات ⚡' },
                { id: 'customer', label: 'تجربة الزبون والتوصيل 📱' },
                { id: 'kitchen', label: 'المطبخ والطباعة 🖨️' },
                { id: 'management', label: 'المالية والتقارير 📊' },
                { id: 'marketing', label: 'الهوية والولاء 🎨' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFeatureTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeFeatureTab === tab.id
                      ? 'bg-orange-600 text-white shadow-md scale-105 ring-2 ring-orange-400'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILED FEATURES SHOWCASE */}
        {(() => {
          const filteredFeatures = ALL_PLATFORM_FEATURES.filter((feat) => {
            if (activeFeatureTab !== 'all' && feat.category !== activeFeatureTab) return false;
            if (featureSearchQuery.trim()) {
              const q = featureSearchQuery.toLowerCase().trim();
              return (
                feat.title.toLowerCase().includes(q) ||
                feat.description.toLowerCase().includes(q) ||
                feat.tagline.toLowerCase().includes(q) ||
                feat.badge.toLowerCase().includes(q)
              );
            }
            return true;
          });

          if (filteredFeatures.length === 0) {
            return (
              <div className="text-center py-16 px-4 bg-white dark:bg-slate-900/80 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 max-w-2xl mx-auto shadow-sm">
                <Search className="w-12 h-12 text-slate-400 mx-auto mb-3 animate-bounce" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
                  لم نجد أي ميزة تطابق البحث "{featureSearchQuery}"
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-medium">
                  جرّب البحث بكلمات أخرى مثل (طباعة، QR، عملات، توصيل) أو العودة لجميع المميزات.
                </p>
                <button
                  onClick={() => {
                    setFeatureSearchQuery('');
                    setActiveFeatureTab('all');
                  }}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-600/20 transition-all cursor-pointer"
                >
                  عرض جميع المميزات (8) ⚡
                </button>
              </div>
            );
          }

          return (
            <div className="space-y-20 lg:space-y-28">
              {filteredFeatures.map((feat, idx) => {
                const Icon = feat.icon;
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={feat.id}
                    className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xl transition-all duration-300 ${
                      isEven ? '' : 'lg:flex-row-reverse'
                    }`}
                  >
                    {/* VISUAL IMAGE & MOCKUP FRAME */}
                    <div className="w-full lg:w-1/2 relative group">
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 aspect-[4/3] bg-slate-100 dark:bg-slate-900">
                        <img
                          src={feat.image}
                          alt={feat.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                        {/* Floating Badge */}
                        <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-black text-xs shadow-lg flex items-center gap-2">
                          <Icon className="w-4 h-4 text-orange-500" />
                          <span>{feat.badge}</span>
                        </div>

                        {/* Bottom Feature Bar */}
                        <div className="absolute bottom-4 left-4 right-4 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/20 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                          <span className="truncate max-w-[200px]">{feat.tagline}</span>
                          <span className="text-[10px] bg-orange-500 text-white font-black px-2 py-0.5 rounded-md">مزية نشطة ✨</span>
                        </div>
                      </div>
                    </div>

                    {/* FEATURE DETAILS & CONTENT */}
                    <div className="w-full lg:w-1/2 space-y-5 text-right" dir="rtl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 text-xs font-extrabold border border-orange-200 dark:border-orange-800/60">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{feat.badge}</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                        {feat.title}
                      </h3>

                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                        {feat.description}
                      </p>

                      {/* KEY BENEFITS */}
                      <div className="space-y-2.5 pt-2">
                        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          الفوائد والمزايا الرئيسية:
                        </h4>
                        <ul className="space-y-2">
                          {feat.keyBenefits.map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                              <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* STEPS PIPELINE */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
                        <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-500">
                          خطوات الاستخدام:
                        </h4>
                        <div className="flex flex-wrap items-center gap-2">
                          {feat.steps.map((step, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-600/40"
                            >
                              <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center">
                                {sIdx + 1}
                              </span>
                              <span>{step}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* ACTION BUTTON */}
                      <div className="pt-3">
                        <button
                          onClick={feat.targetView === 'menu' ? onNavigateToMenu : () => onOpenAuth('signup')}
                          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black shadow-lg shadow-orange-600/20 transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <span>{feat.targetView === 'menu' ? 'تصفح المنيو المباشر وتجربة الميزة 🚀' : 'تجربة الميزة وانضمام كصاحب مطعم 🚀'}</span>
                          <ChevronRight className="w-4 h-4 rotate-180" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

      {/* LIVE DEMO PREVIEW BANNER */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#0b4f42] via-emerald-900 to-[#0b4f42] text-white">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black">
            استكشف تجربة المنيو الرقمي وانضم إلى مئات المطاعم المسجلة 🚀
          </h2>
          <p className="text-emerald-100 max-w-2xl mx-auto text-base">
            يمكنك تصفح المنيو المباشر لجميع مطاعمنا المسجلة بدون تسجيل دخول، أو إنشاء حسابك الخاص لبدء إدارة طلبات مطعمك فوراً.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              onClick={onNavigateToMenu}
              className="px-8 py-4 rounded-xl font-bold text-base bg-orange-600 hover:bg-orange-500 text-white shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-5 h-5" />
              <span>تصفح منيو المطاعم المباشر 📱</span>
            </button>

            <button
              onClick={() => onOpenAuth && onOpenAuth('signup')}
              className="px-8 py-4 rounded-xl font-bold text-base bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-orange-600" />
              <span>إنشاء حساب مطعم جديد 🚀</span>
            </button>
          </div>
        </div>
      </section>

      {/* REVIEWS & TESTIMONIALS SECTION */}
      <section className="py-20 px-4 bg-slate-100/90 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-black mb-3">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>تقييمات موثقة من مئات أصحاب المطاعم</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                ماذا يقول عملاؤنا عن تجربة منصة menuz؟
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                تقييم عام ممتاز <span className="font-bold text-amber-500">4.9 / 5 ⭐</span> بناءً على أكثر من 1,280 مطعم ومقهى حول العالم.
              </p>
            </div>

            <button
              onClick={() => setShowAddReview(!showAddReview)}
              className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>أضف تقييمك ورأيك الآن</span>
            </button>
          </div>

          {/* ADD REVIEW MODAL / FORM */}
          {showAddReview && (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border-2 border-orange-500 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">أضف تقييمك لمنصة menuz</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">شاركنا تجربتك لنتطور معاً ونقدم أفضل خدمة لمطعمك</p>

              {reviewSubmitted ? (
                <div className="bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto animate-bounce" />
                  <h4 className="font-extrabold text-base">تم إرسال تقييمك بنجاح!</h4>
                  <p className="text-xs">شكراً لثقتك ومشاركتك القيّمة معنا.</p>
                </div>
              ) : (
                <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">اسمك الكامل</label>
                      <input 
                        type="text" 
                        required 
                        value={newReviewName} 
                        onChange={(e) => setNewReviewName(e.target.value)} 
                        placeholder="مثال: شيف سامي العتيبي" 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">اسم المطعم / المدينة</label>
                      <input 
                        type="text" 
                        value={newReviewRestaurant} 
                        onChange={(e) => setNewReviewRestaurant(e.target.value)} 
                        placeholder="مثال: مطعم الياسمين • الخليل" 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">التقييم بالنجوم</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                        >
                          <Star className={`w-7 h-7 ${star <= newReviewRating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mr-2">{newReviewRating} من 5</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">تعليقك وتجربتك</label>
                    <textarea 
                      required 
                      rows={3} 
                      value={newReviewComment} 
                      onChange={(e) => setNewReviewComment(e.target.value)} 
                      placeholder="اكتب تجربتك مع المنيو الرقمي وكيف أثر على سرعة المبيعات وخدمة الطاولات..." 
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddReview(false)} 
                      className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-extrabold shadow-md"
                    >
                      نشر التقييم والتعليق
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* REVIEWS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviewsList.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-800'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{rev.date}</span>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <img 
                    src={rev.avatar} 
                    alt={rev.name} 
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-orange-500/50" 
                  />
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.name}</span>
                      {rev.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{rev.restaurant}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <PricingSection 
        onOpenAuth={onOpenAuth} 
        currentCurrency={currentCurrency} 
        currentLang={currentLang} 
        onNavigatePaymentMethods={onNavigatePaymentMethods}
      />

      {/* FAQ SECTION */}
      <section className="py-20 px-4 bg-slate-100 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 relative">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <FaqButton onClick={() => setOpenFaq(openFaq === 0 ? null : 0)} />
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">الأسئلة الشائعة FAQ</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">إليك إجابات لأبرز الأسئلة المتكررة حول منصة menuz</p>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-right font-bold text-base flex items-center justify-between text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180 text-orange-600' : 'text-slate-400'}`} />
                </button>

                {openFaq === index && (
                  <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEEDBACK & SOCIAL MEDIA SECTION */}
      <section className="py-16 px-4 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Feedback Widget Box */}
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold">
                شاركنا انطباعك ورأيك 💌
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">رأيك يهمنا لمواصلة التطوير!</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                يسعدنا دائماً الاستماع لملاحظات أصحاب المطاعم والزبائن لتطوير خصائص المنصة وتقديم أفضل خدمة منيو رقمي بالشرق الأوسط.
              </p>

              <FeedbackWidget 
                onSendFeedback={(msg, sentiment) => {
                  console.log('Feedback submitted:', msg, sentiment);
                }}
              />
            </div>

            {/* Social Media Follow Box */}
            <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 text-center space-y-6 shadow-2xl backdrop-blur-sm">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <span>تواصل معنا عبر شبكات التواصل</span>
                <Globe2 className="w-4 h-4" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">تابعنا على السوشيال ميديا 📲✨</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                انضم إلى مجتمع menuz على المنصات الاجتماعية للحصول على أحدث التحديثات، النصائح، والعروض الخاصة لمطعمك.
              </p>

              <SocialDoodleFollow className="my-2" />
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#07362d] text-white pt-16 pb-12 px-4 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/80">
          
          <div className="space-y-4">
            <MenuzLogo size="md" />
            <p className="text-xs text-emerald-200 leading-relaxed">
              المنصة الأذكى لإنشاء المنيو الرقمي للمطاعم والكافيهات وتسهيل تجربة الطلب والدفع الإلكتروني.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-4">الروابط السريعة</h4>
            <ul className="space-y-2 text-xs text-emerald-200">
              <li><button onClick={onNavigateToMenu} className="hover:text-orange-400">منيو العملاء</button></li>
              <li><button onClick={onNavigateToAdmin} className="hover:text-orange-400">لوحة التحكم والإدارة</button></li>
              <li><a href="#features" className="hover:text-orange-400">مميزات الخدمة</a></li>
              <li><a href="#pricing" className="hover:text-orange-400">خطط الأسعار</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-4">الدعم والمساعدة</h4>
            <ul className="space-y-2 text-xs text-emerald-200">
              <li>البريد الإلكتروني: support@menuz.app</li>
              <li>الهاتف: +966 50 000 0000</li>
              <li>المملكة العربية السعودية - الرياض</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-white mb-4">أمان وخصوصية البيانات</h4>
            <div className="flex items-center gap-2 text-xs text-emerald-200 bg-emerald-950 p-3 rounded-xl border border-emerald-800">
              <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0" />
              <span>معاملات مشفرة وآمنة وفق أعلى معايير الأمان</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/80">
          <p>© {new Date().getFullYear()} menuz. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button 
              onClick={() => setActiveDocument('privacy')} 
              className="hover:text-orange-400 cursor-pointer transition-colors focus:outline-none"
            >
              سياسة الخصوصية
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveDocument('terms')} 
              className="hover:text-orange-400 cursor-pointer transition-colors focus:outline-none"
            >
              الشروط والأحكام
            </button>
          </div>
        </div>
      </footer>

      {/* POLICY DOCUMENTS MODAL */}
      {activeDocument && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-[#0b4f42] text-white shrink-0">
              <div className="flex items-center gap-3">
                {activeDocument === 'privacy' ? (
                  <FileText className="w-6 h-6 text-orange-400" />
                ) : (
                  <BookOpen className="w-6 h-6 text-orange-400" />
                )}
                <h3 className="text-lg font-black">
                  {activeDocument === 'privacy' ? 'سياسة الخصوصية وحماية البيانات' : 'شروط الخدمة والأحكام العامة'}
                </h3>
              </div>
              <button
                onClick={() => setActiveDocument(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed text-right" dir="rtl">
              {activeDocument === 'privacy' ? (
                <>
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-2">1. مقدمة</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      نحن في منصة <strong>menuz</strong> نعتبر خصوصية بياناتك وبيانات عملائك وزوار موقعك على رأس أولوياتنا. توضح هذه السياسة كيف نقوم بجمع، معالجة، وحماية المعلومات التي تتوفر لدينا عند استخدامك للمنصة.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-2">2. البيانات التي نجمعها</h4>
                    <ul className="list-disc list-inside space-y-2 pr-2 text-slate-600 dark:text-slate-400">
                      <li><strong>بيانات الحساب:</strong> الاسم، عنوان البريد الإلكتروني، رقم الجوال، والمعلومات الأساسية الخاصة بإنشاء وإدارة حسابك.</li>
                      <li><strong>بيانات المطعم / الفرع:</strong> اسم المطعم، الشعار، الصور، الوجبات، الأسعار، ومواقع الفروع على الخرائط.</li>
                      <li><strong>بيانات المبيعات والطلبات:</strong> إحصائيات الطلبيات التي تمت عبر طاولات المطعم أو الكاشير لتسهيل عرض التقارير والمبيعات اليومية.</li>
                      <li><strong>تفاصيل الدفع الإلكتروني:</strong> تتم معالجة جميع المدفوعات بشكل آمن تماماً عبر بوابات دفع عالمية معتمدة (مثل Stripe و Apple Pay). نحن لا نقوم بتخزين أو استضافة أي معلومات حساسة لبطاقاتك الائتمانية.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-2">3. كيفية استخدام البيانات</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      نستخدم هذه البيانات حصرياً لتشغيل وتطوير منصة <strong>menuz</strong> وتحسين تجربة الطلب والموقع الرقمي الخاص بمطعمك، بالإضافة إلى تزويدك بتقارير دقيقة حول الطلبيات وتسهيل تواصلك مع عملائك.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-2">4. أمن البيانات وحمايتها</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      نطبق أعلى معايير الأمان الرقمية ونستخدم بروتوكولات تشفير متقدمة (HTTPS/SSL) واستضافة سحابية فائقة الأمان من Google Cloud لحماية بياناتك من أي وصول غير مصرح به أو تلف أو تسريب.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-2">5. حقوقك ومسؤولياتك</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      لك كامل الحق والتحكم المطلق في تعديل، تحديث، أو مسح وتصدير كافة بيانات مطعمك وقوائم الأطباق في أي وقت تشاء من خلال لوحة التحكم الخاصة بالحساب مباشرةً دون أي قيود.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-2">1. شروط تقديم الخدمة</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      تقدم منصة <strong>menuz</strong> نظاماً رقمياً تفاعلياً لإنشاء وإدارة المنيو الرقمي (قائمة الطعام) للمطاعم والكافيهات باستخدام رمز QR ونظام طلبات حية. يسري هذا الاتفاق بمجرد إنشاء الحساب والبدء بالاستخدام.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-2">2. الباقة التجريبية والاشتراك</h4>
                    <ul className="list-disc list-inside space-y-2 pr-2 text-slate-600 dark:text-slate-400">
                      <li><strong>الباقة المجانية (Free Trial):</strong> تتيح تجربة المنصة بالكامل لمدة 7 أيام متواصلة كفترة تجريبية.</li>
                      <li><strong>توقف الخدمة:</strong> ينتهي مفعول الباقة التجريبية ويتوقف المنيو ورمز الاستجابة QR تلقائياً بعد انتهاء الأيام السبعة لحين اختيار إحدى الباقات الاحترافية المدفوعة والاشتراك بها.</li>
                      <li><strong>الاشتراكات والأسعار:</strong> يتم تحصيل مبالغ الاشتراك دورياً (شهرياً أو سنوياً) وفقاً لخطة الأسعار المعلنة والمسؤولة عنها المنصة.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-2">3. الملكية الفكرية والعلامة التجارية</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      جميع المحتويات التي يقوم المشترك برفعها (الصور، العلامات التجارية، الأسماء، الأطباق) هي ملك خالص للمطعم المشترك. بينما تحتفظ منصة <strong>menuz</strong> بجميع حقوق الملكية البرمجية والهندسية والتصميم للواجهات والأكواد البرمجية للموقع.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-2">4. إخلاء المسؤولية عن الانقطاع</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      نبذل قصارى جهدنا لضمان استقرار المواقع والخدمة بنسبة تزيد عن 99.9% على مدار الساعة. ومع ذلك، لا تتحمل المنصة مسؤولية أي تعطل مؤقت أو انقطاع خارج عن إرادتنا ناتج عن شركات الاتصالات المحلية أو أعطال موفري بوابات الدفع الإلكترونية العالمية.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white border-r-4 border-orange-500 pr-2">5. التعديل والتحديث على الاتفاقية</h4>
                    <p className="text-slate-600 dark:text-slate-400">
                      تحتفظ منصة <strong>menuz</strong> بالحق في تحديث وتعديل شروط الخدمة والأسعار من وقت لآخر لتقديم أفضل تجربة ممكنة، وسيتم إرسال إشعارات رسمية إلى البريد الإلكتروني المسجل للمشتركين بأي تعديلات هامة ومؤثرة على الخدمة.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Footer containing close button */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setActiveDocument(null)}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                موافق وإغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
