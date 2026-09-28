import { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
import { Unit } from '../../types';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: Unit[];
  onAddTenant: (data: {
    name: string;
    unitId: string;
    role: string;
    phone: string;
    email: string;
    monthlyRent: number;
    depositAmount: number;
  }) => void;
}

export function AddTenantModal({
  isOpen,
  onClose,
  units,
  onAddTenant,
}: AddTenantModalProps) {
  const vacantUnits = units.filter((u) => u.status === 'Vacant');
  const availableUnits = vacantUnits.length > 0 ? vacantUnits : units;

  const [name, setName] = useState('');
  const [unitId, setUnitId] = useState(availableUnits[0]?.id || '');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('+1 (555) ');
  const [email, setEmail] = useState('');
  const [rent, setRent] = useState(1400);
  const [deposit, setDeposit] = useState(2800);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTenant({
      name,
      unitId,
      role: role || 'Resident',
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      monthlyRent: rent,
      depositAmount: deposit,
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Add New Tenant</h3>
              <p className="text-xs text-slate-500">Onboard resident & execute lease</p>
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
            <h4 className="text-lg font-bold text-slate-900">Tenant Onboarded!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Digital lease dispatched and escrow vault initialized.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Hayes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Select Available Unit
              </label>
              <select
                value={unitId}
                onChange={(e) => {
                  setUnitId(e.target.value);
                  const sel = units.find((u) => u.id === e.target.value);
                  if (sel) {
                    setRent(sel.monthlyRent);
                    setDeposit(sel.depositAmount);
                  }
                }}
                className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    Flat {u.flatNumber} ({u.bhk}, {u.buildingName}) - {u.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Monthly Rent ($)
                </label>
                <input
                  type="number"
                  required
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Security Deposit ($)
                </label>
                <input
                  type="number"
                  required
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Profession / Employer
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Product Designer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Complete Tenant Onboarding</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
