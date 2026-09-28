import {
  ShieldCheck,
  AlertTriangle,
  Building,
  Lock,
  DollarSign,
  UserPlus,
  Wrench,
  Receipt,
  Hourglass,
  Phone,
  Send,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Unit, ActivityItem, Tenant } from '../../types';

interface DashboardScreenProps {
  units: Unit[];
  tenants: Tenant[];
  activities: ActivityItem[];
  onNavigateToTab: (tab: 'dashboard' | 'units' | 'tenants' | 'operations') => void;
  onOpenPaymentModal: (preselectedUnitId?: string, amount?: number) => void;
  onOpenNoticeModal: (tenantName: string, unitNumber: string, amount?: number, daysLate?: number) => void;
  onOpenAddTenantModal: () => void;
  onOpenTicketModal: (ticketId?: string) => void;
  onOpenPayoutModal: () => void;
  onSelectTenant: (tenantId: string) => void;
}

export function DashboardScreen({
  units,
  tenants,
  activities,
  onNavigateToTab,
  onOpenPaymentModal,
  onOpenNoticeModal,
  onOpenAddTenantModal,
  onOpenTicketModal,
  onOpenPayoutModal,
  onSelectTenant,
}: DashboardScreenProps) {
  // Dynamic stats calculation
  const totalUnits = units.length;
  const occupiedUnits = units.filter((u) => u.status === 'Occupied').length;
  const occupancyRate = ((occupiedUnits / totalUnits) * 100).toFixed(1);

  // Rent calculations
  const totalTarget = 52200;
  // Overdue sum
  const overdueTotal = units.reduce((acc, u) => acc + (u.overdueAmount || 0), 0);
  // Collected
  const collectedTotal = 48250;
  const pendingTotal = 2750;
  const collectedPct = ((collectedTotal / totalTarget) * 100).toFixed(1);

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* 1. Monthly Rent Target Card */}
      <section className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-xs">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border border-blue-500 flex items-center justify-center text-blue-600">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-800">Monthly Rent Target</span>
          </div>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
            October 2024
          </span>
        </div>

        {/* Figures row */}
        <div className="flex items-baseline justify-between mt-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              ${collectedTotal.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              / ${totalTarget.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{collectedPct}%</span>
          </div>
        </div>

        {/* Segmented Progress Bar */}
        <div className="w-full h-2.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden flex">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${collectedPct}%` }}
          />
          <div
            className="h-full bg-blue-300 transition-all duration-500"
            style={{ width: `${(pendingTotal / totalTarget) * 100}%` }}
          />
          <div
            className="h-full bg-rose-400 transition-all duration-500"
            style={{ width: `${(overdueTotal / totalTarget) * 100}%` }}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs mt-3 pt-1 border-t border-slate-50">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Paid</span>
            </div>
            <span className="font-bold text-slate-800 text-xs mt-0.5">
              ${collectedTotal.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-300"></span>
              <span>Pending</span>
            </div>
            <span className="font-bold text-slate-800 text-xs mt-0.5">
              ${pendingTotal.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-center gap-1.5 justify-end text-slate-500 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Overdue</span>
            </div>
            <span className="font-bold text-rose-600 text-xs mt-0.5">
              ${overdueTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* 2. 4 Grid Metric Cards */}
      <section className="grid grid-cols-2 gap-3">
        {/* Collected Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              COLLECTED
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 tracking-tight">
              ${collectedTotal.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>↗ +6.2% MoM</span>
            </div>
          </div>
        </div>

        {/* Pending / Late Card */}
        <div
          onClick={() => onNavigateToTab('operations')}
          className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-rose-200 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              PENDING / LATE
            </span>
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-rose-600 tracking-tight">
              $3,950
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              4 pending • 2 late
            </div>
          </div>
        </div>

        {/* Occupancy Card */}
        <div
          onClick={() => onNavigateToTab('units')}
          className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-200 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              OCCUPANCY
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 tracking-tight">
              {occupancyRate}%
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              {occupiedUnits}/{totalUnits} units ({totalUnits - occupiedUnits} open)
            </div>
          </div>
        </div>

        {/* In Escrow Card */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              IN ESCROW
            </span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg font-black text-slate-900 tracking-tight">
              $62,400
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">
              51 security deposits
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Dispatch */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            QUICK DISPATCH
          </span>
          <button
            onClick={() => onOpenPaymentModal()}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Custom shortcuts
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Collect */}
          <button
            onClick={() => onOpenPaymentModal()}
            className="bg-white border border-slate-100 hover:border-blue-200 rounded-2xl p-2.5 flex flex-col items-center justify-center transition-all active:scale-95 shadow-2xs cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-colors">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-1.5">Collect</span>
          </button>

          {/* Add Tenant */}
          <button
            onClick={onOpenAddTenantModal}
            className="bg-white border border-slate-100 hover:border-blue-200 rounded-2xl p-2.5 flex flex-col items-center justify-center transition-all active:scale-95 shadow-2xs cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-colors">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-1.5">Add Tenant</span>
          </button>

          {/* Log Ticket */}
          <button
            onClick={() => onOpenTicketModal()}
            className="bg-white border border-slate-100 hover:border-blue-200 rounded-2xl p-2.5 flex flex-col items-center justify-center transition-all active:scale-95 shadow-2xs cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-1.5">Log Ticket</span>
          </button>

          {/* Payouts */}
          <button
            onClick={onOpenPayoutModal}
            className="bg-white border border-slate-100 hover:border-blue-200 rounded-2xl p-2.5 flex flex-col items-center justify-center transition-all active:scale-95 shadow-2xs cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 group-hover:text-white text-blue-600 flex items-center justify-center transition-colors">
              <Receipt className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-800 mt-1.5">Payouts</span>
          </button>
        </div>
      </section>

      {/* 4. Urgent Action Required */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span className="text-sm font-extrabold text-slate-900 tracking-tight">
              Urgent Action Required
            </span>
          </div>
          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
            3 Tasks
          </span>
        </div>

        {/* Task 1: 2 Overdue Rents */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100/70 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900">
                  2 Overdue Rents (&gt;5d Late)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Unit 402 ($650) • Unit 108 ($550)
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-rose-600">$1,200</span>
          </div>

          {/* Tenants sub-rows */}
          <div className="space-y-1.5 pt-1 border-t border-slate-50">
            <div
              onClick={() => {
                onSelectTenant('t-8821');
                onNavigateToTab('tenants');
              }}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-[10px] font-extrabold flex items-center justify-center">
                  MV
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  Marcus Vance (402)
                </span>
              </div>
              <span className="text-xs font-bold text-rose-600">6d late</span>
            </div>

            <div
              onClick={() => {
                onSelectTenant('t-6520');
                onNavigateToTab('tenants');
              }}
              className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-[10px] font-extrabold flex items-center justify-center">
                  ER
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  Elena Rostova (108)
                </span>
              </div>
              <span className="text-xs font-bold text-rose-600">5d late</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onOpenNoticeModal('Marcus Vance', '402', 1850, 6)}
              className="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Reminders</span>
            </button>
            <a
              href="tel:5552348901"
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors cursor-pointer"
              title="Call tenant"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Task 2: Lease Expiring (14 days) */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Hourglass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">
                Lease Expiring (14 days)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Unit 215 • Priya Sharma
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onSelectTenant('t-9014');
              onNavigateToTab('tenants');
            }}
            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Review
          </button>
        </div>

        {/* Task 3: Plumbing Burst URGENT */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-extrabold text-slate-900">Plumbing Burst</h4>
                <span className="text-[9px] font-black text-white bg-rose-600 px-1.5 py-0.2 rounded">
                  URGENT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Unit 301 • Vendor dispatched
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenTicketModal('tk-1')}
            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Track
          </button>
        </div>
      </section>

      {/* 5. Recent Activity */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1">
            <span className="text-sm font-extrabold text-slate-900 tracking-tight">
              Recent Activity
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          </div>
          <button
            onClick={() => onNavigateToTab('operations')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs space-y-3">
          {activities.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center gap-2.5">
                {item.avatar ? (
                  <img
                    src={item.avatar}
                    alt={item.tenantName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                    {item.tenantName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h5 className="font-bold text-slate-900 text-xs">{item.title}</h5>
                  <p className="text-[11px] text-slate-500">{item.detail}</p>
                </div>
              </div>

              <div className="text-right">
                {item.amount && (
                  <div className="font-extrabold text-slate-900">{item.amount}</div>
                )}
                <div
                  className={`text-[11px] font-semibold ${
                    item.status === 'Paid'
                      ? 'text-emerald-600'
                      : item.status === 'In Progress'
                      ? 'text-blue-600'
                      : 'text-slate-600'
                  }`}
                >
                  • {item.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Harborview Residencies Footer Card */}
      <section
        onClick={onOpenPayoutModal}
        className="bg-[#09101f] text-white rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#0c162b] transition-all shadow-md active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-extrabold text-white text-xs tracking-tight">
              Harborview Residencies
            </h5>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Next owner remittance on Nov 1st
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </section>
    </div>
  );
}
