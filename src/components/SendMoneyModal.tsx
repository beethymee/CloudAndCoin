import React, { useState } from 'react';
import {
  X,
  Send,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Search,
} from 'lucide-react';
import { formatCurrency } from '../services/financeEngine';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSend: (recipientName: string, amount: number, note: string) => void;
}

const RECENT_CONTACTS = [
  { id: 'c1', name: 'Sarah Chen', tag: '@sarahc', avatar: 'SC', bank: 'Chase · 9021' },
  { id: 'c2', name: 'David Miller', tag: '@dmiller', avatar: 'DM', bank: 'Wells Fargo · 4811' },
  { id: 'c3', name: 'Elena Rostova', tag: '@elena_r', avatar: 'ER', bank: 'Citibank · 1129' },
  { id: 'c4', name: 'Marcus Vance', tag: '@mvance', avatar: 'MV', bank: 'Revolut · 3381' },
  { id: 'c5', name: 'Liam Patel', tag: '@liamp', avatar: 'LP', bank: 'Bank of America · 7712' },
];

export const SendMoneyModal: React.FC<SendMoneyModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  onSend,
}) => {
  const [selectedContact, setSelectedContact] = useState(RECENT_CONTACTS[0]);
  const [amountStr, setAmountStr] = useState('');
  const [note, setNote] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0 || amount > availableBalance) return;

    onSend(selectedContact.name, amount, note || 'P2P Instant Transfer');
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setAmountStr('');
      setNote('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0A0E17] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Send className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Instant P2P Transfer</h3>
              <p className="text-xs text-slate-400">Zero-fee real-time ACH / FedNow clearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Transfer Dispatched!</h4>
            <p className="text-xs text-slate-300 max-w-xs">
              Sent <span className="font-mono font-bold text-emerald-400">${parseFloat(amountStr).toFixed(2)}</span> to{' '}
              <span className="font-semibold text-white">{selectedContact.name}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-4 pt-4">
            {/* Contact Selector Carousel */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-2">Select Recipient</label>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {RECENT_CONTACTS.map((c) => {
                  const isSelected = selectedContact.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedContact(c)}
                      className={`flex flex-col items-center p-2 rounded-xl border transition cursor-pointer shrink-0 w-20 text-center ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-white'
                          : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center mb-1">
                        {c.avatar}
                      </div>
                      <span className="text-[11px] font-semibold truncate w-full">{c.name.split(' ')[0]}</span>
                      <span className="text-[9px] text-slate-500 font-mono truncate w-full">{c.tag}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recipient Details Card */}
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
              <div>
                <span className="text-white font-semibold block">{selectedContact.name}</span>
                <span className="text-slate-500 text-[11px]">{selectedContact.bank}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Verified Recipient
              </span>
            </div>

            {/* Amount Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Transfer Amount</span>
                <span className="text-slate-400">
                  Available: <span className="font-mono text-white font-semibold">{formatCurrency(availableBalance)}</span>
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-lg font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={availableBalance}
                  placeholder="0.00"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xl font-mono font-bold placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition"
                  required
                />
              </div>
            </div>

            {/* Note input */}
            <div>
              <input
                type="text"
                placeholder="What is this for? (e.g. Dinner split, concert tickets)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!amountStr || parseFloat(amountStr) <= 0 || parseFloat(amountStr) > availableBalance}
              className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                !amountStr || parseFloat(amountStr) <= 0 || parseFloat(amountStr) > availableBalance
                  ? 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-950/40'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Send {amountStr ? `$${parseFloat(amountStr).toFixed(2)}` : 'Money'} Now</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
