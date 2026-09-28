import { useState } from 'react';
import {
  Building2,
  MoreVertical,
  ShieldCheck,
  Phone,
  Mail,
  AlertTriangle,
  Receipt,
  Download,
  CheckCircle2,
  FileText,
  MessageSquare,
  Plus,
  Send,
  Lock,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { Tenant, TenantDocument, Unit } from '../../types';

interface TenantsScreenProps {
  tenants: Tenant[];
  units: Unit[];
  selectedTenantId: string;
  onSelectTenant: (tenantId: string) => void;
  onOpenPaymentModal: (unitId?: string, amount?: number) => void;
  onOpenNoticeModal: (tenantName: string, unitNumber: string, amount?: number, daysLate?: number) => void;
  onOpenDocumentModal: (doc: TenantDocument, tenantName: string) => void;
  onWaiveLateFee: (tenantId: string) => void;
  onAddLandlordNote: (tenantId: string, content: string, tags: string[]) => void;
}

export function TenantsScreen({
  tenants,
  units,
  selectedTenantId,
  onSelectTenant,
  onOpenPaymentModal,
  onOpenNoticeModal,
  onOpenDocumentModal,
  onWaiveLateFee,
  onAddLandlordNote,
}: TenantsScreenProps) {
  // Find current tenant or default to Marcus Vance
  const currentTenant = tenants.find((t) => t.id === selectedTenantId) || tenants[0];
  const currentUnit = units.find((u) => u.id === currentTenant.unitId);

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('Payment Follow-up');
  const [showTenantPicker, setShowTenantPicker] = useState(false);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddLandlordNote(currentTenant.id, newNoteText.trim(), [newNoteTag]);
    setNewNoteText('');
    setIsAddingNote(false);
  };

  const totalLateAmount = currentTenant.monthlyRent + (currentTenant.latePenalty || 0);

  return (
    <div className="relative p-4 space-y-4 pb-28">
      {/* 0. Tenant Switcher Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl px-3.5 py-2 border border-slate-100 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Resident Profile:
          </span>
          <button
            onClick={() => setShowTenantPicker(!showTenantPicker)}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <span>{currentTenant.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
          {currentTenant.code}
        </span>
      </div>

      {showTenantPicker && (
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-xl space-y-1 animate-in fade-in duration-150">
          {tenants.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                onSelectTenant(t.id);
                setShowTenantPicker(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold cursor-pointer transition-colors ${
                t.id === currentTenant.id
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                  {t.initials}
                </span>
                <span>{t.name}</span>
              </div>
              <span className="text-[11px] text-slate-400">Flat {units.find(u => u.id === t.unitId)?.flatNumber}</span>
            </button>
          ))}
        </div>
      )}

      {/* 1. Subheader: Unit & Tier */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span>
            {currentUnit?.floor || '4th Floor'} • Unit {currentUnit?.flatNumber || '402'}
          </span>
        </div>
        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
          {currentTenant.tier || 'Tier 1 Lease'}
        </span>
      </div>

      {/* 2. Resident Profile Card */}
      <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3.5">
        {/* Name and avatar row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {currentTenant.avatarUrl ? (
                <img
                  src={currentTenant.avatarUrl}
                  alt={currentTenant.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#0d1424] text-white flex items-center justify-center font-extrabold text-sm tracking-tight shadow-xs">
                  {currentTenant.initials}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {currentTenant.name}
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {currentTenant.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {currentTenant.role} • {currentTenant.location}
              </p>
            </div>
          </div>

          <button
            onClick={() => alert(`Options for ${currentTenant.name}: Lease Extension, Tenant Verification, Archive`)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            title="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Resident verification badge */}
        <div className="flex items-center gap-1.5 p-2 bg-blue-50/70 border border-blue-100 rounded-xl text-xs font-bold text-blue-800">
          <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            Active Tenant • Returning Resident ({currentTenant.previousFlat || 'Flat 105'})
          </span>
        </div>

        {/* Contact details box */}
        <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact
            </span>
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <a href={`tel:${currentTenant.phone}`} className="text-blue-600 hover:underline">
                {currentTenant.phone}
              </a>
              <span className="text-slate-300">|</span>
              <a href={`mailto:${currentTenant.email}`} className="text-blue-600 hover:underline truncate max-w-[140px]">
                {currentTenant.email}
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-slate-500 font-medium">Emergency ICE</span>
            <span className="font-semibold text-blue-600">
              {currentTenant.emergencyContact.name} ({currentTenant.emergencyContact.relationship}, {currentTenant.emergencyContact.phone})
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-slate-500 font-medium">Occupancy</span>
            <span className="font-semibold text-slate-800">
              {currentTenant.occupancyDescription}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-2">
            <span className="text-slate-500 font-medium">Lease Term</span>
            <span className="font-semibold text-slate-800">
              {currentTenant.leaseStart} → {currentTenant.leaseEnd}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Arrears & Late Fee Card (Image 6 style) */}
      <section className="bg-rose-50/70 rounded-2xl p-4 border border-rose-100/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-800">
            ARREARS & LATE FEE
          </span>
          {currentTenant.daysLate && currentTenant.daysLate > 0 ? (
            <span className="text-[10px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
              <AlertTriangle className="w-2.5 h-2.5" />
              Overdue {currentTenant.daysLate}d
            </span>
          ) : (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Current
            </span>
          )}
        </div>

        <div>
          <div className="text-2xl font-black text-rose-600 tracking-tight">
            ${totalLateAmount.toLocaleString()}.00
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
            ${currentTenant.monthlyRent.toLocaleString()} Monthly Rent
            {currentTenant.latePenalty > 0 && ` + $${currentTenant.latePenalty} Late Penalty (Nov 1)`}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-slate-500">Rent cycle: 1st of month</span>
          {currentTenant.latePenalty > 0 ? (
            <button
              onClick={() => onWaiveLateFee(currentTenant.id)}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 underline decoration-rose-300 underline-offset-2 cursor-pointer"
            >
              Waive Fee
            </button>
          ) : (
            <span className="text-[11px] text-emerald-600 font-semibold">Late Fee Waived</span>
          )}
        </div>
      </section>

      {/* 4. Security Deposit Card */}
      <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            SECURITY DEPOSIT
          </span>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Escrow Protected
          </span>
        </div>

        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            ${currentTenant.depositAmount.toLocaleString()}.00
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Paid Mar 10, 2023 • 0 Deductions to date
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs border-t border-slate-50">
          <span className="text-slate-500 flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" /> FDIC Insured Trust
          </span>
          <button
            onClick={() => alert(`Starting unit inspection protocol for Unit ${currentUnit?.flatNumber}...`)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            Inspect Unit
          </button>
        </div>
      </section>

      {/* 5. Payment Ledger */}
      <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">
              Payment Ledger
            </h4>
          </div>
          <button
            onClick={() => alert('Exporting tenant statement to CSV format...')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Export CSV</span>
            <Download className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3 pt-1 border-t border-slate-50">
          {currentTenant.paymentHistory.map((rec) => (
            <div key={rec.id} className="p-2.5 bg-slate-50/70 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{rec.monthYear}</span>
                  {rec.status === 'OVERDUE' ? (
                    <span className="text-[9px] font-black text-rose-700 bg-rose-100 px-1.5 py-0.2 rounded uppercase">
                      OVERDUE
                    </span>
                  ) : rec.status === 'PAID (LATE 3D)' ? (
                    <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded uppercase">
                      PAID (LATE 3D)
                    </span>
                  ) : (
                    <span className="text-[9px] font-black text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded uppercase">
                      PAID
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-black ${
                      rec.status === 'OVERDUE' ? 'text-rose-600' : 'text-slate-900'
                    }`}
                  >
                    ${rec.amount.toLocaleString()}.00
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {rec.status === 'OVERDUE' ? 'Pending' : `Balance: $${rec.balance}.00`}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/50">
                <span>
                  Due: {rec.dueDate} {rec.paidDate && `• Paid ${rec.paidDate}`}
                </span>

                {rec.status === 'OVERDUE' ? (
                  <button
                    onClick={() =>
                      onOpenNoticeModal(
                        currentTenant.name,
                        currentUnit?.flatNumber || '402',
                        rec.amount,
                        currentTenant.daysLate
                      )
                    }
                    className="py-1 px-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Send className="w-2.5 h-2.5" />
                    <span>Send Notice</span>
                  </button>
                ) : (
                  <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                    Receipt #{rec.receiptNumber || 'INV-1092'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Document Vault */}
      <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">
              Document Vault
            </h4>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
            {currentTenant.documents.length}/{currentTenant.documents.length} Validated
          </span>
        </div>

        <div className="space-y-2 pt-1 border-t border-slate-50">
          {currentTenant.documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocumentModal(doc, currentTenant.name)}
              className="p-2.5 bg-slate-50/70 hover:bg-slate-100/80 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-600 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{doc.title}</h5>
                  <p className="text-[10px] text-slate-500">{doc.subtitle}</p>
                </div>
              </div>

              {doc.type === 'lease' ? (
                <Download className="w-4 h-4 text-slate-400" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. Private Landlord Notes */}
      <section className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-extrabold text-slate-900 tracking-tight">
              Private Landlord Notes
            </h4>
          </div>
          <button
            onClick={() => setIsAddingNote(true)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </button>
        </div>

        {/* Add note inline form */}
        {isAddingNote && (
          <form onSubmit={handleSaveNote} className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 space-y-2">
            <textarea
              required
              rows={2}
              placeholder="Enter private landlord observation..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="w-full text-xs font-medium p-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-slate-800"
            />
            <div className="flex items-center justify-between">
              <select
                value={newNoteTag}
                onChange={(e) => setNewNoteTag(e.target.value)}
                className="text-[11px] font-semibold bg-white border border-slate-200 rounded px-2 py-1 text-slate-700"
              >
                <option value="Payment Follow-up">Payment Follow-up</option>
                <option value="Maintenance Item">Maintenance Item</option>
                <option value="Inspection Check">Inspection Check</option>
                <option value="Good Standing">Good Standing</option>
              </select>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-2.5 py-1 text-[11px] text-slate-600 font-semibold hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded shadow-xs cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Existing notes */}
        <div className="space-y-2.5 pt-1 border-t border-slate-50">
          {currentTenant.notes.map((note) => (
            <div key={note.id} className="p-3 bg-slate-50/70 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  {note.author} ({note.authorRole})
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {note.date}
                </span>
              </div>
              <p className="text-xs text-slate-700 italic leading-relaxed">
                "{note.content}"
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Fixed Bottom Action Buttons */}
      <div className="fixed bottom-18 left-0 right-0 max-w-md mx-auto px-4 z-30 pointer-events-none">
        <div className="grid grid-cols-2 gap-2 pointer-events-auto">
          <button
            onClick={() => onOpenPaymentModal(currentTenant.unitId, totalLateAmount)}
            className="py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all"
          >
            <Receipt className="w-4 h-4" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() =>
              onOpenNoticeModal(
                currentTenant.name,
                currentUnit?.flatNumber || '402',
                totalLateAmount,
                currentTenant.daysLate
              )
            }
            className="py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Send Notice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
