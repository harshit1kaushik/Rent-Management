import { X, FileText, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { TenantDocument } from '../../types';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: TenantDocument | null;
  tenantName: string;
}

export function DocumentModal({
  isOpen,
  onClose,
  document,
  tenantName,
}: DocumentModalProps) {
  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{document.title}</h3>
              <p className="text-xs text-slate-500">Vault Document • {tenantName}</p>
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
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Validation Status</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Stamped
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Document Subtitle</span>
              <span className="text-xs font-medium text-slate-800">{document.subtitle}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">SHA-256 Digest</span>
              <span className="text-[10px] font-mono text-slate-500">e8f49a2...cb810</span>
            </div>
          </div>

          <div className="p-3.5 border border-dashed border-slate-300 rounded-2xl text-center py-6 bg-slate-50/50">
            <ShieldCheck className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">
              Legally Binding Cryptographic Hash
            </div>
            <div className="text-[11px] text-slate-500 mt-1 max-w-[240px] mx-auto">
              Retained in TenancyHQ Immutable Document Vault with SOC2 compliance.
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                alert(`Downloading authentic encrypted copy of "${document.title}"...`);
              }}
              className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Download PDF
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
