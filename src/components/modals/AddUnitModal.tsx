import { useState } from 'react';
import { X, Building, CheckCircle2 } from 'lucide-react';
import { Unit } from '../../types';

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUnit: (unit: Partial<Unit>) => void;
}

export function AddUnitModal({ isOpen, onClose, onAddUnit }: AddUnitModalProps) {
  const [flatNumber, setFlatNumber] = useState('');
  const [buildingName, setBuildingName] = useState('Highland Towers');
  const [floor, setFloor] = useState('5th Floor');
  const [bhk, setBhk] = useState('2 BHK');
  const [sqft, setSqft] = useState(980);
  const [monthlyRent, setMonthlyRent] = useState(1950);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddUnit({
      flatNumber,
      buildingName,
      shortBuilding: buildingName === 'Highland Towers' ? 'Highland Tow...' : buildingName === 'Oakridge Residences' ? 'Oakridge Resi...' : 'Metro Flats',
      floor,
      bhk,
      sqft,
      status: 'Vacant',
      rentStatus: 'Ready for Move-in',
      monthlyRent,
      depositAmount: monthlyRent * 2,
      ownerInfo: 'Sarah M. (90%)',
      features: ['Balcony View', 'Central Heating', 'High Ceilings'],
      keysStatus: 'Keys held with concierge',
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
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Add New Unit</h3>
              <p className="text-xs text-slate-500">Register property flat to portfolio</p>
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
            <h4 className="text-lg font-bold text-slate-900">Unit Registered!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Flat {flatNumber} added to {buildingName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Flat / Unit #
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 505"
                  value={flatNumber}
                  onChange={(e) => setFlatNumber(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Floor
                </label>
                <input
                  type="text"
                  required
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Property Building
              </label>
              <select
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              >
                <option value="Highland Towers">Highland Towers (24 units)</option>
                <option value="Oakridge Residences">Oakridge Residences (19 units)</option>
                <option value="Metro Flats">Metro Flats (8 units)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Type
                </label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                >
                  <option value="Studio Unit">Studio</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Area (SqFt)
                </label>
                <input
                  type="number"
                  required
                  value={sqft}
                  onChange={(e) => setSqft(Number(e.target.value))}
                  className="w-full text-xs font-medium px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Target Monthly Rent ($)
              </label>
              <input
                type="number"
                required
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Add Unit to Portfolio</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
