import { useState, useMemo } from 'react';
import {
  Search,
  QrCode,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Send,
  ExternalLink,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { Unit } from '../../types';

interface UnitsScreenProps {
  units: Unit[];
  onOpenNoticeModal: (tenantName: string, unitNumber: string, amount?: number, daysLate?: number) => void;
  onOpenAddUnitModal: () => void;
  onOpenAddTenantModal: () => void;
  onSelectUnit: (unit: Unit) => void;
  onSelectTenant: (tenantId: string) => void;
  onNavigateToTab: (tab: 'dashboard' | 'units' | 'tenants' | 'operations') => void;
}

export function UnitsScreen({
  units,
  onOpenNoticeModal,
  onOpenAddUnitModal,
  onOpenAddTenantModal,
  onSelectUnit,
  onSelectTenant,
  onNavigateToTab,
}: UnitsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Occupied' | 'Vacant' | 'Overdue'>('All');
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  // Filter logic
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        unit.flatNumber.toLowerCase().includes(query) ||
        unit.buildingName.toLowerCase().includes(query) ||
        (unit.tenantName && unit.tenantName.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Property match
      if (selectedProperty && !unit.buildingName.includes(selectedProperty)) {
        return false;
      }

      // Filter type match
      if (filterType === 'Occupied') return unit.status === 'Occupied';
      if (filterType === 'Vacant') return unit.status === 'Vacant';
      if (filterType === 'Overdue') return Boolean(unit.overdueAmount && unit.overdueAmount > 0);

      return true;
    });
  }, [units, searchQuery, filterType, selectedProperty]);

  // Counts for pills
  const totalCount = units.length;
  const occupiedCount = units.filter((u) => u.status === 'Occupied').length;
  const vacantCount = units.filter((u) => u.status === 'Vacant').length;

  return (
    <div className="relative p-4 space-y-3.5 pb-24">
      {/* 1. Search Bar */}
      <div className="relative flex items-center bg-white rounded-2xl border border-slate-200/80 px-3.5 py-2.5 shadow-2xs">
        <Search className="w-4 h-4 text-slate-400 mr-2.5 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search flat #, building, tenant..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-xs font-medium text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
        />
        <button
          onClick={() => alert('Barcode / QR scanner ready for door lock sync.')}
          className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
          title="Scan QR / barcode"
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={() => {
            setFilterType('All');
            setSelectedProperty(null);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            filterType === 'All' && !selectedProperty
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All {totalCount}
        </button>

        <button
          onClick={() => setFilterType('Occupied')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            filterType === 'Occupied'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Occupied {occupiedCount}</span>
        </button>

        <button
          onClick={() => setFilterType('Vacant')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            filterType === 'Vacant'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span>Vacant {vacantCount}</span>
        </button>

        <button
          onClick={() => setFilterType('Overdue')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            filterType === 'Overdue'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-3 h-3 text-rose-500" />
          <span>Overdue</span>
        </button>
      </div>

      {/* 3. 3 Core Properties Bar */}
      <section className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-extrabold text-slate-900 tracking-tight">
              3 Core Properties
            </span>
          </div>
          <span className="text-[10px] font-extrabold tracking-wider text-slate-400 uppercase">
            51 UNITS TOTAL
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-50">
          {/* Highland */}
          <div
            onClick={() => setSelectedProperty(selectedProperty === 'Highland' ? null : 'Highland')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              selectedProperty === 'Highland' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>Highland</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              24 <span className="text-xs font-medium text-slate-400">/ 24</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="w-full h-full bg-blue-600 rounded-full"></div>
            </div>
          </div>

          {/* Oakridge */}
          <div
            onClick={() => setSelectedProperty(selectedProperty === 'Oakridge' ? null : 'Oakridge')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              selectedProperty === 'Oakridge' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>Oakridge</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              18 <span className="text-xs font-medium text-slate-400">/ 19</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="w-[94%] h-full bg-blue-600 rounded-full"></div>
            </div>
          </div>

          {/* Metro Flats */}
          <div
            onClick={() => setSelectedProperty(selectedProperty === 'Metro' ? null : 'Metro')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              selectedProperty === 'Metro' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
              <span>Metro Flats</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            </div>
            <div className="text-sm font-extrabold text-slate-900 mt-1">
              6 <span className="text-xs font-medium text-slate-400">/ 8</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
              <div className="w-[75%] h-full bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Units List */}
      <div className="space-y-3">
        {filteredUnits.map((unit) => {
          const isOverdue = Boolean(unit.overdueAmount && unit.overdueAmount > 0);
          const isVacant = unit.status === 'Vacant';
          const isExpiring = Boolean(unit.expiresInDays && unit.expiresInDays <= 30);

          return (
            <div
              key={unit.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
            >
              {/* Header: FLAT # | Building | Status Badges */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 bg-slate-100/90 rounded-lg text-center">
                    <span className="block text-[9px] font-extrabold text-slate-400 tracking-wider">
                      FLAT
                    </span>
                    <span className="block text-sm font-black text-slate-900 leading-none">
                      {unit.flatNumber}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">
                        {unit.shortBuilding || unit.buildingName}
                      </h4>
                      <CheckCircle2 className="w-3 h-3 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      {unit.bhk} • {unit.floor} • {unit.sqft} sqft
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    {isVacant ? (
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                        Vacant
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Occupied
                      </span>
                    )}

                    {isOverdue && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <AlertTriangle className="w-2.5 h-2.5 text-rose-500" />
                        Overdue ${unit.overdueAmount?.toLocaleString()}
                      </span>
                    )}

                    {isExpiring && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5 text-blue-500" />
                        Expires in {unit.expiresInDays}d
                      </span>
                    )}

                    {!isOverdue && !isVacant && !isExpiring && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                        Rent Paid
                      </span>
                    )}

                    {isVacant && (
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Ready for Move-in
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Middle Body: Tenant details or Vacant specs */}
              {isVacant ? (
                <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-800">
                      Freshly Painted & Sanitized
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {unit.keysStatus || 'Keys held with concierge'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900">
                      ${unit.monthlyRent.toLocaleString()}
                      <span className="text-xs font-medium text-slate-500">/mo</span>
                    </span>
                    <p className="text-[10px] text-slate-400">Deposit: ${unit.depositAmount.toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {unit.tenantAvatar ? (
                      <img
                        src={unit.tenantAvatar}
                        alt={unit.tenantName || 'Tenant'}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {unit.tenantName ? unit.tenantName.slice(0, 2).toUpperCase() : 'TN'}
                      </div>
                    )}
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">
                        {unit.tenantName}
                      </h5>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Tenant #{unit.tenantCode || 'TN-0000'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-slate-900">
                      ${unit.monthlyRent.toLocaleString()}
                      <span className="text-xs font-medium text-slate-400">/mo</span>
                    </div>
                    {unit.nextDue && (
                      <p className="text-[10px] text-slate-400">Next due: {unit.nextDue}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom metadata / actions */}
              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                {unit.moveInDate ? (
                  <span>Move-in: {unit.moveInDate}</span>
                ) : (
                  <span>Owner: {unit.ownerInfo}</span>
                )}
                {unit.tenantName && !unit.moveInDate && (
                  <span>Renewal Offered</span>
                )}
              </div>

              {/* Action Buttons row matching Image 8 */}
              <div className="pt-1">
                {isOverdue && unit.tenantName ? (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        onOpenNoticeModal(
                          unit.tenantName!,
                          unit.flatNumber,
                          unit.overdueAmount,
                          6
                        )
                      }
                      className="py-2 px-3 border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Remind Rent</span>
                    </button>
                    <button
                      onClick={() => {
                        if (unit.tenantId) onSelectTenant(unit.tenantId);
                        onNavigateToTab('tenants');
                      }}
                      className="py-2 px-3 border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Unit</span>
                    </button>
                  </div>
                ) : isExpiring ? (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (unit.tenantId) onSelectTenant(unit.tenantId);
                        onNavigateToTab('tenants');
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 py-1 cursor-pointer"
                    >
                      <span>Manage Lease</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : isVacant ? (
                  <button
                    onClick={onOpenAddTenantModal}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-98"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Assign Tenant</span>
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Floating Action Button: + Add Unit */}
      <div className="fixed bottom-20 right-6 z-30">
        <button
          onClick={onOpenAddUnitModal}
          className="flex items-center gap-2 py-3 px-5 bg-black hover:bg-slate-900 active:scale-95 text-white font-bold text-xs rounded-full shadow-xl transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Unit</span>
        </button>
      </div>
    </div>
  );
}
