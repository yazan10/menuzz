import React from 'react';
import { ShieldAlert, Phone, Mail, LogOut } from 'lucide-react';

interface BannedUserScreenProps {
  reason?: string;
  onLogout: () => void;
}

export const BannedUserScreen: React.FC<BannedUserScreenProps> = ({
  reason = 'تم حظر الحساب بسبب مخالفة الشروط والأحكام الخاصة بمنصة menuz.',
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-3xl border border-rose-500/40 shadow-2xl text-center space-y-6 relative overflow-hidden animate-in zoom-in-95">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-600 via-red-600 to-orange-600" />

        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">عذراً، تم حظر الحساب 🚫</h1>
          <p className="text-xs text-rose-300 font-bold bg-rose-950/60 p-3 rounded-2xl border border-rose-500/30">
            السبب: {reason}
          </p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          إذا كنت تعتقد أن هذا الحظر تم عن طريق الخطأ، يرجى التواصل مع فريق إدارة منصة menuz لمراجعة طلبك.
        </p>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-right space-y-2">
          <span className="font-bold text-slate-300 block">للتواصل مع الدعم الفني:</span>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>البريد الإلكتروني:</span>
            </span>
            <span className="font-bold text-white">support@menuz.app</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>واتساب الدعم:</span>
            </span>
            <span className="font-bold text-white">+970 599 000 000</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};
