import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Headphones,
  Store,
  Users,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  PhoneCall,
  Mail,
  ShieldCheck,
  Zap,
  Sparkles,
  Printer,
  QrCode,
  CreditCard,
  Bot,
  User,
  Send,
  CheckCircle2
} from 'lucide-react';
import { SeeMoreButton } from './SeeMoreButton';
import { SocialDoodleFollow } from './SocialDoodleFollow';
import { InteractiveLikeButton } from './InteractiveLikeButton';
import { CopyClipboardButton } from './CopyClipboardButton';
import { UnknownInfoButton } from './UnknownInfoButton';
import { KineticGreenLoader } from './KineticGreenLoader';

interface SupportHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'owner' | 'guest';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'support' | 'bot';
  text: string;
  timestamp: string;
}

export const SupportHubModal: React.FC<SupportHubModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'owner',
}) => {
  const [activeRole, setActiveRole] = useState<'owner' | 'guest'>(defaultTab);
  const [activeSubView, setActiveSubView] = useState<'faq' | 'chat'>('chat');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [visibleFaqCount, setVisibleFaqCount] = useState<number>(3);

  // Chat state
  const [inputText, setInputText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);

  const [ownerMessages, setOwnerMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-o-1',
      sender: 'support',
      text: 'مرحباً بك في مركز دعم أصحاب المطاعم 🏪! كيف يمكننا مساعدتك اليوم؟ يمكنك الاستفسار عن ربط الطابعات، تصميم المنيو، أو الاشتراكات.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [guestMessages, setGuestMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-g-1',
      sender: 'support',
      text: 'أهلاً بك عزيزي الزبون 👋! هل لديك أي استفسار حول المنيو، الطلبات، أو الملاحظات الخاصة بالطعام؟ نحن هنا لمساعدتك.',
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ownerMessages, guestMessages, activeSubView]);

  if (!isOpen) return null;

  const currentMessages = activeRole === 'owner' ? ownerMessages : guestMessages;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const userText = inputText;
    setInputText('');
    setIsSending(true);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    if (activeRole === 'owner') {
      setOwnerMessages((prev) => [...prev, newMsg]);
    } else {
      setGuestMessages((prev) => [...prev, newMsg]);
    }

    // Trigger airplane animation
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);

      setTimeout(() => {
        setIsSent(false);

        // Auto-reply simulation
        setTimeout(() => {
          let autoReply = '';
          if (activeRole === 'owner') {
            if (userText.includes('طابعة') || userText.includes('طابعات')) {
              autoReply = 'تم استلام استفسارك حول الطابعات 🖨️. يرجى التأكد من توصيل الطابعة بنفس شبكة الـ Wi-Fi، ثم الانتقال للوحة التحكم > إعدادات الطباعة. فريقنا يتابع معك الآن!';
            } else if (userText.includes('اشتراك') || userText.includes('دفع')) {
              autoReply = 'بخصوص اشتراك المطعم 💳: يمكنك تجديد أو تغيير باقتك من قسم الإعدادات. تم تحويل تذكرتك لفريق المبيعات والمالية مباشرة.';
            } else {
              autoReply = 'شكراً لتواصلك معنا! تم توجيه رسالتك إلى مهندس الدعم الفني المباشر لأصحاب المطاعم، وسيتم الرد عليك خلال لحظات ⚡';
            }
          } else {
            autoReply = 'شكراً لك! تلقينا رسالتك بخصوص الطلب/المنيو. وسنقوم بإيصال الملاحظة إلى إدارة المطعم وفريق الخدمة فوراً 🍔✨';
          }

          const replyMsg: ChatMessage = {
            id: `msg-reply-${Date.now()}`,
            sender: 'support',
            text: autoReply,
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          };

          if (activeRole === 'owner') {
            setOwnerMessages((prev) => [...prev, replyMsg]);
          } else {
            setGuestMessages((prev) => [...prev, replyMsg]);
          }
        }, 1000);
      }, 1200);
    }, 800);
  };

  const ownerFaqs = [
    {
      q: 'كيف يمكنني ربط طابعة الفواتير المباشرة بالطاولات؟',
      a: 'يمكنك الانتقال إلى لوحة تحكم الأدمن > إعدادات الطابعات، واختيار نوع الطابعة (ESC/POS عبر الشبكة أو بلوتوث أو USB) وتفعيل الطباعة التلقائية فور وصول الطلب.',
    },
    {
      q: 'كيف أقوم بإنشاء وطباعة كود QR للطاولات؟',
      a: 'من قسم "أكواد QR والطاولات" في لوحة التحكم، يمكنك توليد كود مخصص لكل طاولة مع شعار مطعمك وتحميله بجودة عالية للطباعة مباشرة.',
    },
    {
      q: 'هل يمكنني تغيير العملة واللغات في المنيو؟',
      a: 'نعم! منصة Menuz تدعم أكثر من 10 لغات عالمية مع تحويل تلقائي للعملات ومعدل صرف حي يتم تحديثه لحظياً.',
    },
    {
      q: 'ما هي طرق الدعم الفني المتاحة للأنظمة المدفوعة؟',
      a: 'نوفر خط دعم ساخن 24/7 عبر الواتساب والمكالمات، بالإضافة للغرفة المباشرة والمساعدة في إعداد المنيو مجاناً.',
    },
    {
      q: 'كيف يمكنني إضافة عروض وخصومات على أطباق معينة؟',
      a: 'من قسم إدارة الأطباق، اضغط على تعديل الطبق واختاري "تفعيل سعر الخصم" أو علامة "الأكثر مبيعاً" أو "توصية الشيف".',
    },
  ];

  const guestFaqs = [
    {
      q: 'كيف أطلب من المنيو مباشرة من طاولتي؟',
      a: 'امسح كود QR الموجود على الطاولة بكاميرا هاتفك، تصفح الأطباق، أضف ما تحب للسلة ثم اضغط على "تأكيد الطلب".',
    },
    {
      q: 'هل يمكنني طلب الطعام وتحديد حساسية من المكونات؟',
      a: 'نعم! عند اختيار الطبق يمكنك إضافة ملاحظة خاصة للشيف (مثل: بدون بصل، خالي من الجلوتين، أو بدون حليب).',
    },
    {
      q: 'كيف أعرف حالة الطلب الخاص بي؟',
      a: 'ستظهر لك شاشة تتبع حية للطلب فور إرساله (قيد التحضير 🍳 -> جاري التقديم 🍽️ -> مكتمل ✨).',
    },
    {
      q: 'هل استطيع تقييم الوجبة أو تقديم اقتراح؟',
      a: 'بالتأكيد! يسعدنا تقييمك للأطباق والخدمة من زر "التقييمات" المتاح داخل المنيو.',
    },
  ];

  const currentFaqs = activeRole === 'owner' ? ownerFaqs : guestFaqs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[850px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 sm:p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20 shrink-0">
              <Headphones className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-extrabold text-white flex items-center gap-1.5 truncate">
                <span>مركز الدعم والتواصل</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">
                مساعدة فورية لأصحاب المطاعم والزوار ⚡
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden md:block">
              <InteractiveLikeButton initialCount={348} label="إعجاب بمنصة Menuz" />
            </div>
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Role Selector Tabs (Restaurant Owners vs. Customers) */}
        <div className="p-2.5 sm:p-3 bg-slate-950/60 border-b border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="grid grid-cols-2 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => {
                setActiveRole('owner');
                setVisibleFaqCount(3);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'owner'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="truncate">دعم المطاعم 🏪</span>
            </button>

            <button
              onClick={() => {
                setActiveRole('guest');
                setVisibleFaqCount(3);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'guest'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="truncate">دعم الزبائن 🍔</span>
            </button>
          </div>

          {/* Secondary Subviews (Chat vs FAQ) */}
          <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
            <button
              onClick={() => setActiveSubView('chat')}
              className={`px-3 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                activeSubView === 'chat'
                  ? 'bg-slate-800 border-amber-500/50 text-amber-400'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="truncate">غرفة الدردشة</span>
            </button>

            <button
              onClick={() => setActiveSubView('faq')}
              className={`px-3 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                activeSubView === 'faq'
                  ? 'bg-slate-800 border-amber-500/50 text-amber-400'
                  : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="truncate">الأسئلة الشائعة</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {activeSubView === 'chat' ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Info banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="font-bold">
                    {activeRole === 'owner'
                      ? 'فريق الدعم الفني للمطاعم متصل الآن 24/7'
                      : 'فريق خدمة الزبائن جاهز لمساعدتك مباشرة'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://wa.me/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:underline font-bold"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    واتساب سريع
                  </a>
                  <CopyClipboardButton
                    textToCopy="https://wa.me/"
                    initialTooltip="نسخ رابط الدعم"
                    copiedTooltip="تم النسخ!"
                  />
                </div>
              </div>

              {/* Chat Messages Window */}
              <div className="flex-1 min-h-[300px] max-h-[420px] overflow-y-auto p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-4">
                {currentMessages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${
                        isUser ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${
                          isUser
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>

                      <div
                        className={`max-w-[80%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded-tl-none'
                            : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tr-none'
                        }`}
                      >
                        <p className="font-semibold whitespace-pre-wrap">{msg.text}</p>
                        <span className="block mt-1.5 text-[10px] text-slate-400 text-left">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar with Uiverse Send Button */}
              <form
                onSubmit={handleSendMessage}
                className="flex flex-col sm:flex-row items-center gap-3 p-2 bg-slate-950 border border-slate-800 rounded-2xl"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    activeRole === 'owner'
                      ? 'اكتب سؤالك بخصوص إعدادات المطعم، الطابعات، أو الحساب...'
                      : 'اكتب استفسارك أو ملاحظتك حول الطعام والخدمة...'
                  }
                  className="flex-1 w-full bg-slate-900 text-white placeholder-slate-500 text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition-colors"
                />

                {/* Animated Uiverse Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className={`uiverse-send-btn ${isSending ? 'is-sending' : ''} ${
                    isSent ? 'is-sent' : ''
                  } shrink-0 w-full sm:w-auto ${
                    !inputText.trim() ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="outline"></div>
                  <div className="state state--default">
                    <div className="icon">
                      <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g style={{ filter: 'url(#shadow)' }}>
                          <path
                            d="M14.2199 21.63C13.0399 21.63 11.3699 20.8 10.0499 16.83L9.32988 14.67L7.16988 13.95C3.20988 12.63 2.37988 10.96 2.37988 9.78001C2.37988 8.61001 3.20988 6.93001 7.16988 5.60001L15.6599 2.77001C17.7799 2.06001 19.5499 2.27001 20.6399 3.35001C21.7299 4.43001 21.9399 6.21001 21.2299 8.33001L18.3999 16.82C17.0699 20.8 15.3999 21.63 14.2199 21.63ZM7.63988 7.03001C4.85988 7.96001 3.86988 9.06001 3.86988 9.78001C3.86988 10.5 4.85988 11.6 7.63988 12.52L10.1599 13.36C10.3799 13.43 10.5599 13.61 10.6299 13.83L11.4699 16.35C12.3899 19.13 13.4999 20.12 14.2199 20.12C14.9399 20.12 16.0399 19.13 16.9699 16.35L19.7999 7.86001C20.3099 6.32001 20.2199 5.06001 19.5699 4.41001C18.9199 3.76001 17.6599 3.68001 16.1299 4.19001L7.63988 7.03001Z"
                            fill="currentColor"
                          ></path>
                          <path
                            d="M10.11 14.4C9.92005 14.4 9.73005 14.33 9.58005 14.18C9.29005 13.89 9.29005 13.41 9.58005 13.12L13.16 9.53C13.45 9.24 13.93 9.24 14.22 9.53C14.51 9.82 14.51 10.3 14.22 10.59L10.64 14.18C10.5 14.33 10.3 14.4 10.11 14.4Z"
                            fill="currentColor"
                          ></path>
                        </g>
                        <defs>
                          <filter id="shadow">
                            <feDropShadow
                              dx="0"
                              dy="1"
                              stdDeviation="0.6"
                              floodOpacity="0.5"
                            ></feDropShadow>
                          </filter>
                        </defs>
                      </svg>
                    </div>
                    <p>
                      <span style={{ '--i': 0 } as React.CSSProperties}>إ</span>
                      <span style={{ '--i': 1 } as React.CSSProperties}>ر</span>
                      <span style={{ '--i': 2 } as React.CSSProperties}>س</span>
                      <span style={{ '--i': 3 } as React.CSSProperties}>ا</span>
                      <span style={{ '--i': 4 } as React.CSSProperties}>ل</span>
                    </p>
                  </div>
                  <div className="state state--sent">
                    <div className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        strokeWidth="0.5px"
                        stroke="currentColor"
                      >
                        <g style={{ filter: 'url(#shadow)' }}>
                          <path
                            fill="currentColor"
                            d="M12 22.75C6.07 22.75 1.25 17.93 1.25 12C1.25 6.07 6.07 1.25 12 1.25C17.93 1.25 22.75 6.07 22.75 12C22.75 17.93 17.93 22.75 12 22.75ZM12 2.75C6.9 2.75 2.75 6.9 2.75 12C2.75 17.1 6.9 21.25 12 21.25C17.1 21.25 21.25 17.1 21.25 12C21.25 6.9 17.1 2.75 12 2.75Z"
                          ></path>
                          <path
                            fill="currentColor"
                            d="M10.5795 15.5801C10.3795 15.5801 10.1895 15.5001 10.0495 15.3601L7.21945 12.5301C6.92945 12.2401 6.92945 11.7601 7.21945 11.4701C7.50945 11.1801 7.98945 11.1801 8.27945 11.4701L10.5795 13.7701L15.7195 8.6301C16.0095 8.3401 16.4895 8.3401 16.7795 8.6301C17.0695 8.9201 17.0695 9.4001 16.7795 9.6901L11.1095 15.3601C10.9695 15.5001 10.7795 15.5801 10.5795 15.5801Z"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <p>
                      <span style={{ '--i': 5 } as React.CSSProperties}>ت</span>
                      <span style={{ '--i': 6 } as React.CSSProperties}>م</span>
                      <span style={{ '--i': 7 } as React.CSSProperties}>!</span>
                    </p>
                  </div>
                </button>
              </form>
            </div>
          ) : (
            /* FAQ Accordion Section */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  الأسئلة الشائعة والأجوبة الفورية ({currentFaqs.length})
                </h3>
              </div>

              <div className="space-y-3">
                {currentFaqs.slice(0, visibleFaqCount).map((faq, idx) => {
                  const isOpenItem = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpenItem ? null : idx)}
                        className="w-full p-4 text-right flex items-center justify-between font-bold text-xs sm:text-sm text-slate-200 hover:text-white hover:bg-slate-900/50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            isOpenItem ? 'rotate-180 text-amber-400' : ''
                          }`}
                        />
                      </button>

                      {isOpenItem && (
                        <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 bg-slate-900/30">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Uiverse "See More" Button for expanding FAQs */}
              {visibleFaqCount < currentFaqs.length && (
                <div className="pt-4 flex justify-center">
                  <SeeMoreButton
                    label="عرض باقي الأسئلة"
                    onClick={() => setVisibleFaqCount(currentFaqs.length)}
                  />
                </div>
              )}
            </div>
          )}
          {/* Kinetic Green Loader Banner & System Security Alerts */}
          <div className="pt-3 border-t border-slate-800/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>تنبيهات النظام والشروط الأمنية</span>
                <UnknownInfoButton tooltipText="نظام حماية وسرعة فائق للمطاعم والمشتركين" />
              </span>
              <div className="self-end sm:self-auto scale-90 sm:scale-100 origin-right">
                <InteractiveLikeButton label="إعجاب بالدعم" initialLikes={142} />
              </div>
            </div>

            <KineticGreenLoader
              title="مركز المعالجة السريعة ⚡"
              subtitle="أنظمة المنيو متصلة وتعمل بكفاءة 100%"
            />
          </div>

          {/* Social Media Follow Section */}
          <SocialDoodleFollow className="pt-2 border-t border-slate-800/60 overflow-hidden" />
        </div>

        {/* Modal Footer Quick Features */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] text-slate-400">
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>رد آلي فوري</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>حماية مشفرة</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-center justify-center gap-1.5">
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span>دعم الطابعات</span>
          </div>
          <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-800/60 flex items-center justify-center gap-1.5">
            <QrCode className="w-3.5 h-3.5 text-rose-400" />
            <span>مسح سريع</span>
          </div>
        </div>

      </div>
    </div>
  );
};
