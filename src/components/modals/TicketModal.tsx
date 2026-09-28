import { useState } from 'react';
import { X, Wrench, AlertTriangle, Clock, CheckCircle2, Phone, Truck } from 'lucide-react';
import { MaintenanceTicket } from '../../types';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTicket?: MaintenanceTicket;
  onAddTicket?: (ticket: Partial<MaintenanceTicket>) => void;
  onUpdateStatus?: (ticketId: string, status: MaintenanceTicket['status']) => void;
}

export function TicketModal({
  isOpen,
  onClose,
  activeTicket,
  onAddTicket,
  onUpdateStatus,
}: TicketModalProps) {
  const [flatNumber, setFlatNumber] = useState('301');
  const [title, setTitle] = useState('Plumbing Burst in Main Kitchen Riser');
  const [tenantName, setTenantName] = useState('Liam Gallagher');
  const [severity, setSeverity] = useState<'URGENT' | 'HIGH' | 'NORMAL'>('URGENT');
  const [vendor, setVendor] = useState("Joe's Emergency Rooter & Plumbing");
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const isTracking = Boolean(activeTicket);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTicket?.({
      flatNumber,
      title,
      tenantName,
      severity,
      vendorName: vendor,
      status: 'Vendor Dispatched',
      eta: '25 mins away',
      reportedAt: 'Just now',
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              isTracking ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
            }`}>
              {isTracking ? <AlertTriangle className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {isTracking ? 'Track Emergency Dispatch' : 'Log Maintenance Ticket'}
              </h3>
              <p className="text-xs text-slate-500">
                {isTracking ? `Unit ${activeTicket?.flatNumber} • Live Operations` : 'Dispatch certified vendor'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isTracking && activeTicket ? (
          <div className="p-6 space-y-4">
            {/* Status Alert Box */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                  {activeTicket.severity}
                </span>
                <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> ETA: {activeTicket.eta || '18m away'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 mt-2 text-sm">
                Unit {activeTicket.flatNumber} — {activeTicket.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Resident: <span className="font-semibold text-slate-800">{activeTicket.tenantName}</span> • Highland Towers
              </p>
            </div>

            {/* Vendor details */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Assigned Contractor</span>
                <span className="font-bold text-slate-900">{activeTicket.vendorName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Dispatch Status</span>
                <span className="font-semibold text-blue-600 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> In Transit (Truck #08)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Authorized Cap</span>
                <span className="font-bold text-slate-900">$500 Emergency Approval</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:5550198234"
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" /> Call Plumber
              </a>
              <button
                type="button"
                onClick={() => {
                  onUpdateStatus?.(activeTicket.id, 'Completed');
                  onClose();
                }}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Mark Resolved
              </button>
            </div>
          </div>
        ) : saved ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-3 animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">Ticket Dispatched!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Vendor notified with priority SMS gateway.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Flat # & Building
              </label>
              <input
                type="text"
                required
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issue Description
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Urgency Level
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['NORMAL', 'HIGH', 'URGENT'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSeverity(lvl)}
                    className={`py-2 rounded-xl font-bold cursor-pointer transition-all border ${
                      severity === lvl
                        ? lvl === 'URGENT'
                          ? 'bg-red-500 text-white border-red-500'
                          : 'bg-blue-600 text-white border-blue-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contractor Assigned
              </label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Dispatch & Notify Vendor</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
