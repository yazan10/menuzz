import React, { useState } from 'react';
import { 
  Terminal, 
  Wrench, 
  Users, 
  Bell, 
  RotateCcw, 
  X, 
  ChevronUp, 
  CheckCircle, 
  Bug, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { User } from '../types';

interface DevFloatingBarProps {
  isDevMode: boolean;
  onToggleDevMode: () => void;
  isMaintenanceMode: boolean;
  onToggleMaintenanceMode: () => void;
  currentUser: User | null;
  onSwitchUserRole: (role: 'customer' | 'admin' | 'staff' | 'superadmin') => void;
  onTriggerTestNotification: () => void;
  onResetMockData?: () => void;
  onNavigate404?: () => void;
}

export const DevFloatingBar: React.FC<DevFloatingBarProps> = ({
  isDevMode,
  onToggleDevMode,
  isMaintenanceMode,
  onToggleMaintenanceMode,
  currentUser,
  onSwitchUserRole,
  onTriggerTestNotification,
  onResetMockData,
  onNavigate404,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] System booted in Developer Mode 🧪',
    '[WS] WebSocket mock sync active on port 3000',
    '[CACHE] Currency FX rates updated for ILS, USD, JOD, TRY',
    '[AUTH] Active session: ' + (currentUser?.name || 'Guest User')
  ]);

  const isSuperAdminUser = currentUser?.role === 'superadmin' || currentUser?.isSuperAdmin === true;

  if (!isDevMode || !isSuperAdminUser) return null;

  const addLog = (msg: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString('ar-EG')}] ${msg}`, ...prev.slice(0, 15)]);
  };

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-xl font-['IBM_Plex_Sans_Arabic',sans-serif] font-bold animate-in slide-in-from-bottom duration-300">
      
      {/* Logs Drawer Modal */}
      {logsOpen && (
        <div className="mb-3 p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] border border-emerald-500/40 shadow-2xl space-y-2 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-2 mb-2 font-sans font-bold text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Bug className="w-4 h-4" />
              <span>سجل النظّام والملاحظات (Dev Logs)</span>
            </span>
            <button onClick={() => setLogsOpen(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          {logs.map((log, i) => (
            <div key={i} className="leading-relaxed font-mono">{log}</div>
          ))}
        </div>
      )}

      {/* Main Bar */}
      <div className="bg-slate-900/95 text-white backdrop-blur-xl p-3.5 rounded-2xl border border-orange-500/40 shadow-2xl space-y-3">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500 text-slate-950 font-black">
              <Terminal className="w-4 h-4" />
            </span>
            <div>
              <span className="text-xs font-black text-orange-400 flex items-center gap-1">
                <span>وضع التطوير فعال (Dev Mode)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </span>
              <p className="text-[10px] text-slate-400">أدوات المطور والمحاكاة السريعة</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
            >
              <ChevronUp className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={onToggleDevMode}
              className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white text-xs cursor-pointer"
              title="إغلاق وضع التطوير"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
            
            {/* Maintenance Toggle */}
            <button
              onClick={() => {
                onToggleMaintenanceMode();
                addLog(`Maintenance mode toggled: ${!isMaintenanceMode ? 'ON' : 'OFF'}`);
              }}
              className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                isMaintenanceMode
                  ? 'bg-amber-600 text-white border-amber-400 shadow-lg'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{isMaintenanceMode ? 'إيقاف الصيانة' : 'تفعيل الصيانة'}</span>
            </button>

            {/* Test Notification */}
            <button
              onClick={() => {
                onTriggerTestNotification();
                addLog('Test notification triggered!');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>اختبار إشعار</span>
            </button>

            {/* Dev Logs */}
            <button
              onClick={() => setLogsOpen(!logsOpen)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Bug className="w-3.5 h-3.5" />
              <span>سجل النظام</span>
            </button>

            {/* Test 404 Page */}
            {onNavigate404 && (
              <button
                onClick={() => {
                  onNavigate404();
                  addLog('Navigated to 404 screen 📺');
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
                <span>معاينة صفحة 404</span>
              </button>
            )}

            {/* Role Switch Dropdown */}
            <select
              value={currentUser?.role || 'customer'}
              onChange={(e) => {
                const role = e.target.value as any;
                onSwitchUserRole(role);
                addLog(`Switched user role to: ${role}`);
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="customer">زائر / زبون</option>
              <option value="admin">صاحب مطعم</option>
              <option value="staff">طاقم عمل</option>
              <option value="superadmin">سوبر أدمن ⚡</option>
            </select>

          </div>
        )}

      </div>
    </div>
  );
};
