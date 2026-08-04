import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Send, ShoppingBag, Calendar, Star, Sparkles, X, VolumeX } from 'lucide-react';
import { AppNotification } from '../types';
import { stopOrderAlertSound, subscribeOrderAlertState } from '../lib/notifications';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onSendBroadcastNotification?: (title: string, message: string) => void;
  isSuperAdmin?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAllRead,
  onClearAll,
  onSendBroadcastNotification,
  isSuperAdmin = false,
}) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'order' | 'reservation' | 'system'>('all');
  const [broadcastModal, setBroadcastModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    const unsub = subscribeOrderAlertState((ringing) => {
      setIsRinging(ringing);
    });
    return unsub;
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.type === activeTab;
  });

  const handleNotificationClick = () => {
    stopOrderAlertSound();
  };

  const handleMarkAllReadAndStopSound = () => {
    stopOrderAlertSound();
    onMarkAllRead();
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;
    if (onSendBroadcastNotification) {
      onSendBroadcastNotification(newTitle, newMessage);
    }
    setNewTitle('');
    setNewMessage('');
    setBroadcastModal(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-orange-500" />;
      case 'reservation':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="relative font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold">
      {/* Bell Icon Trigger Button */}
      <button
        onClick={() => {
          stopOrderAlertSound();
          setOpen(!open);
        }}
        className={`relative p-2.5 rounded-2xl transition-all cursor-pointer focus:outline-none ${
          isRinging 
            ? 'bg-rose-600 text-white animate-bounce shadow-lg shadow-rose-600/50 border-2 border-white' 
            : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/50'
        }`}
        title={isRinging ? 'انقر لإيقاف صوت التنبيه وافتح الإشعارات' : 'الإشعارات والتنبيهات'}
      >
        <Bell className={`w-5 h-5 ${isRinging ? 'text-white animate-pulse' : 'text-emerald-300'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-orange-600 text-white font-black text-[10px] flex items-center justify-center border-2 border-slate-900 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel Dropdown */}
      {open && (
        <div className="absolute left-0 sm:right-auto sm:left-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-black">مركز الإشعارات والتنبيهات</h3>
            </div>
            
            <div className="flex items-center gap-2">
              {isRinging && (
                <button
                  onClick={stopOrderAlertSound}
                  className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black flex items-center gap-1 cursor-pointer animate-pulse"
                  title="إيقاف صوت التنبيه المستمر"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>كتم الصوت</span>
                </button>
              )}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllReadAndStopSound}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  title="تعليم الكل كمقروء"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>قراءة الكل</span>
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="p-2 bg-slate-50 dark:bg-slate-950 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-1">
              {(['all', 'order', 'reservation', 'system'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                    activeTab === t
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t === 'all' && 'الكل'}
                  {t === 'order' && 'الطلبات'}
                  {t === 'reservation' && 'الحجوزات'}
                  {t === 'system' && 'النظام'}
                </button>
              ))}
            </div>

            {isSuperAdmin && (
              <button
                onClick={() => setBroadcastModal(true)}
                className="px-2 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-[10px] cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>إرسال إشعار عام</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                لا يوجد إشعارات حالية في هذا القسم ✨
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={handleNotificationClick}
                  className={`p-3 rounded-2xl transition-all my-1 flex gap-3 cursor-pointer ${
                    item.read
                      ? 'bg-transparent text-slate-600 dark:text-slate-300'
                      : 'bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-slate-900 dark:text-white hover:bg-emerald-500/20'
                  }`}
                >
                  <span className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm shrink-0 self-start">
                    {getNotificationIcon(item.type)}
                  </span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => {
                  stopOrderAlertSound();
                  onClearAll();
                }}
                className="text-[11px] font-bold text-rose-500 hover:text-rose-600 flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح كافة الإشعارات</span>
              </button>
            </div>
          )}

        </div>
      )}


      {/* Broadcast Modal */}
      {broadcastModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-orange-500" />
                <span>إرسال إشعار عام لكافة المطاعم والمستخدمين</span>
              </h3>
              <button onClick={() => setBroadcastModal(false)} className="text-slate-400">✕</button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان الإشعار
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: تحديث جديد متوفر لمنصة menuz 🚀"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  محتوى الرسالة
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="اكتب تفاصيل الإشعار هنا..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border text-xs focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black cursor-pointer shadow-md"
                >
                  إرسال فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
