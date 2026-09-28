import { useState } from 'react';
import { X, CheckCircle2, DollarSign, CreditCard, Building, Banknote } from 'lucide-react';
import { Unit } from '../../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  preselectedUnitId?: string;
  preselectedAmount?: number;
  onConfirmPayment: (unitId: string, amount: number, method: string) => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  units,
  preselectedUnitId,
  preselectedAmount,
  onConfirmPayment,
}: PaymentModalProps) {
  const [selectedUnitId, setSelectedUnitId] = useState(preselectedUnitId || units[0]?.id || '');
  const [amount, setAmount] = useState<number>(preselectedAmount || 1850);
  const [method, setMethod] = useState<string>('ACH Direct Debit');
  const [memo, setMemo] = useState<string>('Rent settlement via TenancyHQ Gateway');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUnit = units.find((u) => u.id === selectedUnitId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmPayment(selectedUnitId, Number(amount), method);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Record Payment</h3>
              <p className="text-xs text-slate-500">Post rent or fee collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-3 animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">Payment Recorded!</h4>
            <p className="text-sm text-slate-500 mt-1">
              ${amount.toLocaleString()} posted to Unit {currentUnit?.flatNumber} ledger.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {/* Unit Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Unit & Resident
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => {
                  setSelectedUnitId(e.target.value);
                  const found = units.find((u) => u.id === e.target.value);
                  if (found?.overdueAmount) {
                    setAmount(found.overdueAmount);
                  } else if (found?.monthlyRent) {
                    setAmount(found.monthlyRent);
                  }
                }}
                className="w-full text-sm font-medium border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    Flat {u.flatNumber} - {u.tenantName || 'Vacant'} ({u.buildingName})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Payment Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  step="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full text-base font-bold pl-8 pr-4 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
            </div>

            {/* Method */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Collection Channel
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'ACH Direct Debit', icon: Building, label: 'ACH Bank' },
                  { id: 'Credit / Debit Card', icon: CreditCard, label: 'Credit Card' },
                  { id: 'Cash / Money Order', icon: Banknote, label: 'Cash / Check' },
                  { id: 'Escrow Release', icon: DollarSign, label: 'Escrow Release' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setMethod(item.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        method === item.id
                          ? 'border-blue-500 bg-blue-50/70 text-blue-700 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600 font-medium'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Memo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reference / Receipt Memo
              </label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Confirm & Record ${amount.toLocaleString()}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
