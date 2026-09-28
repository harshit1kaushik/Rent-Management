import { X, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

interface PayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PayoutModal({ isOpen, onClose }: PayoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Owner Remittance</h3>
              <p className="text-xs text-slate-500">Harborview Residencies Portfolio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-900 text-white rounded-2xl">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Scheduled Remittance</span>
              <span className="text-emerald-400 font-semibold">Nov 1, 2024</span>
            </div>
            <div className="text-2xl font-black mt-1">$42,180.00</div>
            <p className="text-[11px] text-slate-300 mt-1">
              Net yield to Harborview LLC • 51 units reconciled
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Gross Rent Collected</span>
              <span className="font-bold text-slate-900">$48,250.00</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">TenancyHQ Management Fee (8%)</span>
              <span className="font-bold text-red-600">-$3,860.00</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Maintenance & Vendor Reserve</span>
              <span className="font-bold text-red-600">-$2,210.00</span>
            </div>
            <div className="flex justify-between py-2 bg-emerald-50 px-3 rounded-xl">
              <span className="font-bold text-emerald-900">Net Distribution (ACH)</span>
              <span className="font-black text-emerald-700">$42,180.00</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <span>
              Automated Chase Commercial ACH routing verified. Audit statements ready for download.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
          >
            <span>Dismiss Summary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
