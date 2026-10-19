import React, { useState } from 'react';
import {
  X,
  Plus,
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Film,
  Zap,
  Check,
  Tag,
  CreditCard,
  DollarSign,
  Delete,
} from 'lucide-react';
import { TransactionCategory } from '../types/finance';

interface QuickAddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (desc: string, amount: number, category: TransactionCategory, accountId: string) => void;
  accounts: { id: string; name: string; balance: number }[];
}

const CATEGORIES: { label: TransactionCategory; icon: any; color: string }[] = [
  { label: 'Dining & Food', icon: Coffee, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { label: 'Groceries', icon: ShoppingBag, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { label: 'Shopping', icon: Tag, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  { label: 'Transportation', icon: Car, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { label: 'Entertainment', icon: Film, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { label: 'Utilities', icon: Zap, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  { label: 'Housing', icon: Home, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
];

export const QuickAddExpenseModal: React.FC<QuickAddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
  accounts,
}) => {
  const [amountStr, setAmountStr] = useState('');
  const [merchant, setMerchant] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory>('Dining & Food');
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || 'acc_chk_01');
  const [isIncome, setIsIncome] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (digit === '.' && amountStr.includes('.')) return;
    if (amountStr.length >= 8) return;
    if (amountStr === '' && digit === '.') {
      setAmountStr('0.');
      return;
    }
    setAmountStr((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setAmountStr((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setAmountStr('');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsedAmount = parseFloat(amountStr);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const finalAmount = isIncome ? parsedAmount : -parsedAmount;
    const finalDesc = merchant.trim() || `${selectedCategory} Payment`;

    onAddTransaction(finalDesc, finalAmount, isIncome ? 'Income' : selectedCategory, selectedAccountId);

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      setAmountStr('');
      setMerchant('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0A0E17] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Plus className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Record Transaction</h3>
              <p className="text-xs text-slate-400">Instant mobile-style expense &amp; income tracker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Expense vs Income Switch */}
        <div className="flex p-1 bg-white/[0.04] rounded-xl border border-white/[0.08] my-4">
          <button
            type="button"
            onClick={() => setIsIncome(false)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              !isIncome
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Expense (-)
          </button>
          <button
            type="button"
            onClick={() => setIsIncome(true)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
              isIncome
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Income (+)
          </button>
        </div>

        {/* Display Amount */}
        <div className="text-center py-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl mb-4">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-medium mb-1">
            {isIncome ? 'Amount Received' : 'Amount Spent'}
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className={`text-2xl font-mono ${isIncome ? 'text-emerald-400' : 'text-slate-300'}`}>$</span>
            <span
              className={`text-4xl font-extrabold font-mono tracking-tight tabular-nums ${
                amountStr ? (isIncome ? 'text-emerald-400' : 'text-white') : 'text-slate-600'
              }`}
            >
              {amountStr || '0.00'}
            </span>
          </div>
        </div>

        {/* Merchant / Description Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Merchant / Note (e.g., Starbucks, Uber, Target)"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Category Carousel */}
        {!isIncome && (
          <div className="mb-4">
            <div className="text-[11px] font-medium text-slate-400 mb-2">Category</div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setSelectedCategory(cat.label)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer shrink-0 ${
                      isSelected
                        ? `${cat.color} font-bold ring-2 ring-emerald-500/40`
                        : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Account Selector */}
        <div className="mb-4 flex items-center justify-between text-xs bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.06]">
          <span className="text-slate-400 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            Account:
          </span>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="bg-black/60 border border-white/10 text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} (${acc.balance.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Mobile Keypad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] active:scale-95 border border-white/[0.06] text-white font-mono text-lg font-semibold transition cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={handleBackspace}
            className="py-3 rounded-xl bg-white/[0.03] hover:bg-rose-500/20 active:scale-95 border border-white/[0.06] text-slate-300 hover:text-rose-400 font-mono text-base flex items-center justify-center transition cursor-pointer"
          >
            ⌫
          </button>
        </div>

        {/* Action Button */}
        <button
          type="button"
          disabled={!amountStr || parseFloat(amountStr) <= 0}
          onClick={() => handleSubmit()}
          className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
            successToast
              ? 'bg-emerald-500 text-slate-950'
              : !amountStr || parseFloat(amountStr) <= 0
              ? 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold'
          }`}
        >
          {successToast ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Recorded Successfully!</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save {isIncome ? 'Income' : 'Expense'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
