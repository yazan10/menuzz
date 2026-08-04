import React from 'react';
import { Wrench, ShieldCheck, Clock, Phone, Sparkles } from 'lucide-react';

interface MaintenanceScreenProps {
  note?: string;
  onOpenAdminLogin: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  note = 'نقوم حالياً بإجراء بعض التحديثات الدورية وتحسينات السرعة لتقديم أفضل تجربة لكم.',
  onOpenAdminLogin,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl p-8 rounded-3xl border border-slate-800 shadow-2xl text-center space-y-6 relative z-10 animate-in fade-in zoom-in-95">
        
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 animate-pulse">
          <Wrench className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-black border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            <span>وضع الصيانة والتحديثات الجارية</span>
          </div>
          <h1 className="text-2xl font-black text-white">الموقع تحت الصيانة حالياً 🛠️</h1>
          <p className="text-xs text-slate-300 leading-relaxed px-2">
            {note}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-right text-xs space-y-2">
          <span className="font-black text-amber-400 block">معلومات الدعم الفني:</span>
          <div className="text-slate-400 flex items-center justify-between">
            <span>العودة المتوقعة:</span>
            <span className="font-bold text-white">خلال دقائق معدودة ⚡</span>
          </div>
          <div className="text-slate-400 flex items-center justify-between">
            <span>للطوارئ والاستفسارات:</span>
            <span className="font-bold text-white">support@menuz.app</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 space-y-3">
          <button
            onClick={onOpenAdminLogin}
            className="w-full py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>دخول الإدارة والمسؤولين (Admin Access)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
