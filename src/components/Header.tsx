import { useState } from 'react';
import { Bell } from 'lucide-react';
import { TenancyLogo } from './TenancyLogo';
import { SARAH_JENKINS_AVATAR } from '../data/mockData';

interface HeaderProps {
  title: 'DASHBOARD' | 'UNITS' | 'TENANTS' | 'OPERATIONS';
  unreadCount?: number;
  onOpenNotifications?: () => void;
  onSelectTenant?: (tenantId: string) => void;
}

export function Header({
  title,
  unreadCount = 3,
  onOpenNotifications,
}: HeaderProps) {
  const [showProfileCard, setShowProfileCard] = useState(false);

  return (
    <header className="relative flex items-center justify-between px-5 pt-4 pb-3 bg-white border-b border-slate-100 z-30">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-2.5">
        <TenancyLogo className="w-9 h-9" rounded="rounded-xl" />
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="text-base font-extrabold text-slate-900 tracking-tight leading-none">
              TenancyHQ
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-0.5 leading-none">
            {title}
          </span>
        </div>
      </div>

      {/* Right Actions: Notifications & Avatar */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenNotifications}
          aria-label="View notifications"
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors active:scale-95 cursor-pointer"
        >
          <Bell className="w-5 h-5 text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowProfileCard(!showProfileCard)}
          className="relative rounded-full ring-2 ring-slate-100 hover:ring-blue-400 transition-all cursor-pointer active:scale-95"
          aria-label="User profile"
        >
          <img
            src={SARAH_JENKINS_AVATAR}
            alt="Sarah Jenkins - Property Manager"
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              // fallback
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
        </button>
      </div>

      {/* Sarah Jenkins Dropdown Quick Profile */}
      {showProfileCard && (
        <div className="absolute top-16 right-4 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <img
              src={SARAH_JENKINS_AVATAR}
              alt="Sarah Jenkins"
              className="w-12 h-12 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">Sarah Jenkins</h4>
              <p className="text-xs text-slate-500 font-medium">Head of Operations</p>
              <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Admin • 3 Properties
              </span>
            </div>
          </div>
          <div className="py-2.5 text-xs text-slate-600 space-y-1.5 border-b border-slate-100">
            <div className="flex justify-between">
              <span className="text-slate-400">Portfolio</span>
              <span className="font-semibold text-slate-800">51 Units / 3 Estates</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Monthly Target</span>
              <span className="font-semibold text-slate-800">$52,200.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Escrow Vault</span>
              <span className="font-semibold text-emerald-600">$62,400.00</span>
            </div>
          </div>
          <button
            onClick={() => setShowProfileCard(false)}
            className="w-full mt-2 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </header>
  );
}
