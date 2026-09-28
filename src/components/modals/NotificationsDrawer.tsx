import { X, AlertCircle, Clock, Wrench, ChevronRight } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onActionClick: (target: 'overdue' | 'lease' | 'plumbing') => void;
}

export function NotificationsDrawer({
  isOpen,
  onClose,
  onActionClick,
}: NotificationsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <h3 className="font-extrabold text-slate-900 text-base">Priority Notifications (3)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-2.5">
          {/* Notification 1 */}
          <div
            onClick={() => {
              onActionClick('overdue');
              onClose();
            }}
            className="p-3 bg-red-50 hover:bg-red-100/70 border border-red-200 rounded-2xl cursor-pointer transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">2 Overdue Rents (&gt;5d Late)</h4>
                <span className="text-[10px] font-bold text-red-600">$1,200</span>
              </div>
              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                Unit 402 ($650) • Unit 108 ($550)
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Notification 2 */}
          <div
            onClick={() => {
              onActionClick('lease');
              onClose();
            }}
            className="p-3 bg-blue-50 hover:bg-blue-100/70 border border-blue-200 rounded-2xl cursor-pointer transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Lease Expiring in 14 days</h4>
                <span className="text-[10px] font-bold text-blue-600">Action</span>
              </div>
              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                Unit 215 • Priya Sharma (Oakridge)
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          {/* Notification 3 */}
          <div
            onClick={() => {
              onActionClick('plumbing');
              onClose();
            }}
            className="p-3 bg-amber-50 hover:bg-amber-100/70 border border-amber-200 rounded-2xl cursor-pointer transition-colors flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900">Plumbing Burst URGENT</h4>
                <span className="text-[10px] font-bold text-amber-700">Track</span>
              </div>
              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                Unit 301 • Vendor dispatched
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
