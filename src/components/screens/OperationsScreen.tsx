import { useState } from 'react';
import {
  Receipt,
  Wrench,
  Droplets,
  ArrowRight,
  Clock,
  Building,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Send,
  Zap,
} from 'lucide-react';
import { MaintenanceTicket, Unit } from '../../types';

interface OperationsScreenProps {
  units: Unit[];
  tickets: MaintenanceTicket[];
  onOpenPaymentModal: (unitId?: string, amount?: number) => void;
  onOpenNoticeModal: (tenantName: string, unitNumber: string, amount?: number, daysLate?: number) => void;
  onOpenTicketModal: (ticketId?: string) => void;
  onSettleInvoice: (unitNumber: string, amount: number) => void;
}

export function OperationsScreen({
  units,
  tickets,
  onOpenPaymentModal,
  onOpenNoticeModal,
  onOpenTicketModal,
  onSettleInvoice,
}: OperationsScreenProps) {
  const [activeSubTab, setActiveSubTab] = useState<'rent' | 'repairs' | 'utilities'>('rent');

  // Interactive state for invoices on the Operations screen
  const [invoices, setInvoices] = useState([
    {
      id: 'inv-402',
      flatNumber: '402',
      name: 'Marcus Vance',
      unitSub: 'Penthouse Level 4 • 2 Bed',
      amount: 1850,
      daysLateText: '6 days overdue',
      isOverdue: true,
      remindersNote: '2 automated reminders sent',
      actionType: 'settle',
      actionText: 'Settle →',
      settled: false,
    },
    {
      id: 'inv-108',
      flatNumber: '108',
      name: 'Elena Rostova',
      unitSub: 'East Wing • Studio Unit',
      amount: 600,
      daysLateText: '$600 paid / $1,200',
      isOverdue: false,
      remindersNote: 'Split pledge: Nov 22',
      actionType: 'record',
      actionText: 'Record $600',
      settled: false,
    },
    {
      id: 'inv-510',
      flatNumber: '510',
      name: 'Jason Reed',
      unitSub: 'South Tower • 1 Bed Luxe',
      amount: 1500,
      daysLateText: 'Due Today',
      isOverdue: false,
      remindersNote: 'Direct deposit awaiting approval',
      actionType: 'mark_paid',
      actionText: 'Mark Paid',
      settled: false,
    },
  ]);

  const handleInvoiceAction = (invId: string) => {
    const inv = invoices.find((i) => i.id === invId);
    if (!inv) return;

    if (inv.actionType === 'settle') {
      onOpenPaymentModal(units.find((u) => u.flatNumber === inv.flatNumber)?.id, inv.amount);
    } else {
      setInvoices((prev) =>
        prev.map((i) => (i.id === invId ? { ...i, settled: true } : i))
      );
      onSettleInvoice(inv.flatNumber, inv.amount);
    }
  };

  const activeInvoicesCount = invoices.filter((i) => !i.settled).length;

  return (
    <div className="relative p-4 space-y-4 pb-28">
      {/* 1. Sub-Tabs Header (Rent, Repairs (3), Utilities) */}
      <div className="flex items-center p-1 bg-slate-200/70 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('rent')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'rent'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Rent</span>
        </button>

        <button
          onClick={() => setActiveSubTab('repairs')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'repairs'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Repairs</span>
          <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">
            {tickets.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('utilities')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeSubTab === 'utilities'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Utilities</span>
        </button>
      </div>

      {/* 2. RENT SUB-TAB */}
      {activeSubTab === 'rent' && (
        <div className="space-y-4">
          {/* November Cycle Card */}
          <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                NOVEMBER CYCLE
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  92.4% Collected
                </span>
                <span className="text-xs font-medium text-slate-500">Cycle Day 18/30</span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  $48,250
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  of $52,200
                </span>
              </div>
            </div>

            {/* Segmented bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
              <div className="w-[92.4%] h-full bg-blue-600 rounded-l-full"></div>
              <div className="w-[7.6%] h-full bg-rose-200 rounded-r-full"></div>
            </div>

            {/* 3 Metrics breakdown */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-50 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block font-medium">Total Target</span>
                <span className="font-extrabold text-slate-800 text-xs mt-0.5 block">$52,200</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-medium">Settled</span>
                <span className="font-extrabold text-emerald-600 text-xs mt-0.5 block">$48,250</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block font-medium">Outstanding</span>
                <span className="font-extrabold text-rose-600 text-xs mt-0.5 block">$3,950</span>
              </div>
            </div>
          </section>

          {/* Attention Needed Section */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Attention Needed
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {activeInvoicesCount} Invoices Active
              </span>
            </div>

            <div className="space-y-3">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3 transition-all ${
                    inv.settled ? 'opacity-50 grayscale-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                          inv.isOverdue
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {inv.flatNumber}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {inv.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {inv.unitSub}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-base font-black ${
                          inv.isOverdue ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        ${inv.amount.toLocaleString()}
                      </div>
                      <div
                        className={`text-[10px] font-bold ${
                          inv.isOverdue ? 'text-rose-600' : 'text-blue-600'
                        }`}
                      >
                        • {inv.daysLateText}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                      {inv.isOverdue ? (
                        <Send className="w-3 h-3 text-slate-400" />
                      ) : (
                        <Clock className="w-3 h-3 text-slate-400" />
                      )}
                      <span>{inv.remindersNote}</span>
                    </div>

                    {inv.settled ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                      </span>
                    ) : inv.actionType === 'settle' ? (
                      <button
                        onClick={() => handleInvoiceAction(inv.id)}
                        className="py-1.5 px-4 bg-[#ab2424] hover:bg-[#911d1d] active:scale-95 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      >
                        <span>{inv.actionText}</span>
                      </button>
                    ) : inv.actionType === 'record' ? (
                      <button
                        onClick={() => handleInvoiceAction(inv.id)}
                        className="py-1.5 px-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        <span>{inv.actionText}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleInvoiceAction(inv.id)}
                        className="py-1.5 px-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        <span>{inv.actionText}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* 3. REPAIRS SUB-TAB */}
      {activeSubTab === 'repairs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Active Maintenance Work Orders
            </h3>
            <button
              onClick={() => onOpenTicketModal()}
              className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Log Ticket
            </button>
          </div>

          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        t.severity === 'URGENT'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      <Wrench className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 text-xs">
                          Unit {t.flatNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">• {t.buildingName}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                        {t.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Resident: {t.tenantName}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                      t.severity === 'URGENT'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {t.severity}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Vendor</span>
                    <span className="font-bold text-slate-800">{t.vendorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className="font-bold text-blue-600">{t.status}</span>
                  </div>
                  {t.eta && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">ETA / Schedule</span>
                      <span className="font-bold text-emerald-600">{t.eta}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Reported: {t.reportedAt}
                  </span>
                  <button
                    onClick={() => onOpenTicketModal(t.id)}
                    className="py-1 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Manage Dispatch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. UTILITIES SUB-TAB */}
      {activeSubTab === 'utilities' && (
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                SUB-METER RECONCILIATION
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                96.8% Recovery
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="p-2 bg-slate-50 rounded-xl">
                <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">Water / Sewer</span>
                <span className="font-extrabold text-xs text-slate-900">$2,410</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <Zap className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">Common Electric</span>
                <span className="font-extrabold text-xs text-slate-900">$3,180</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl">
                <Building className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">Waste / Recycling</span>
                <span className="font-extrabold text-xs text-slate-900">$1,020</span>
              </div>
            </div>

            <button
              onClick={() => alert('Smart meter sync initiated. 51 units updated via IoT gateway.')}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Sync IoT Smart Submeters
            </button>
          </div>
        </div>
      )}

      {/* 5. Floating Action Button: Record Payment */}
      <div className="fixed bottom-20 right-6 z-30">
        <button
          onClick={() => onOpenPaymentModal()}
          className="flex items-center gap-2 py-3 px-5 bg-black hover:bg-slate-900 active:scale-95 text-white font-bold text-xs rounded-full shadow-xl transition-all cursor-pointer"
        >
          <Receipt className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>
    </div>
  );
}
