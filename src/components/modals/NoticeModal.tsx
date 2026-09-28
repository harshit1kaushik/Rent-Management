import { useState } from 'react';
import { X, Send, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantName: string;
  unitNumber: string;
  amountDue?: number;
  daysLate?: number;
  onSent?: () => void;
}

export function NoticeModal({
  isOpen,
  onClose,
  tenantName,
  unitNumber,
  amountDue = 1850,
  daysLate = 6,
  onSent,
}: NoticeModalProps) {
  const [channel, setChannel] = useState<'both' | 'sms' | 'email'>('both');
  const [includePenalty, setIncludePenalty] = useState(true);
  const [customNote, setCustomNote] = useState(
    `Dear ${tenantName}, this is an automated tenancy notice regarding Flat ${unitNumber}. Your balance of $${amountDue.toLocaleString()} is currently ${daysLate} days past due. Please submit your payment or contact the leasing office.`
  );
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onSent?.();
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Send Late Notice</h3>
              <p className="text-xs text-slate-500">Unit {unitNumber} • {tenantName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-3 animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">Notice Dispatched!</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
              Delivered via SMS & authenticated tenant email portal. Receipt logged in audit ledger.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Delivery channels */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Dispatch Channels
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setChannel('both')}
                  className={`py-2 px-2.5 rounded-xl border text-center font-semibold cursor-pointer transition-all ${
                    channel === 'both'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  SMS + Email
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('sms')}
                  className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1 font-semibold cursor-pointer transition-all ${
                    channel === 'sms'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> SMS Only
                </button>
                <button
                  type="button"
                  onClick={() => setChannel('email')}
                  className={`py-2 px-2.5 rounded-xl border flex items-center justify-center gap-1 font-semibold cursor-pointer transition-all ${
                    channel === 'email'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email
                </button>
              </div>
            </div>

            {/* Message preview */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Notice Message Preview
              </label>
              <textarea
                rows={4}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                className="w-full text-xs font-medium p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none leading-relaxed"
              />
            </div>

            {/* Fee toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-700">Attach $50 statutory late penalty</span>
              <input
                type="checkbox"
                checked={includePenalty}
                onChange={(e) => setIncludePenalty(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSend}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Notice Now</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
