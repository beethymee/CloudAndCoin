import React, { useState } from 'react';
import {
  CreditCard,
  Eye,
  EyeOff,
  Copy,
  Lock,
  Unlock,
  ShieldCheck,
  Zap,
  Wifi,
  Sparkles,
  ChevronRight,
  Sliders,
  Check,
} from 'lucide-react';
import { formatCurrency } from '../services/financeEngine';

interface NeoCardShowcaseProps {
  checkingBalance: number;
  savingsBalance: number;
  creditBalance: number;
}

export const NeoCardShowcase: React.FC<NeoCardShowcaseProps> = ({
  checkingBalance,
  savingsBalance,
  creditBalance,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showSensitive, setShowSensitive] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const cards = [
    {
      id: 'card_obsidian',
      name: 'FinTrack Obsidian Black',
      tier: 'Platinum Metal Debit',
      network: 'VISA INFINITE',
      last4: '4829',
      exp: '11/29',
      cvv: '842',
      balance: checkingBalance,
      limit: 10000,
      spentThisMonth: 1824.5,
      bgGradient: 'from-[#0A0D14] via-[#111827] to-[#05070B]',
      borderGlow: 'border-white/20 shadow-emerald-950/40',
      accentColor: 'text-emerald-400',
      pillBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      status: 'Active · Primary Float',
    },
    {
      id: 'card_emerald',
      name: 'FinTrack Vault Emerald',
      tier: 'High-Yield Escrow 5.2% APY',
      network: 'MASTERCARD WORLD ELITE',
      last4: '9152',
      exp: '06/30',
      cvv: '391',
      balance: savingsBalance,
      limit: 25000,
      spentThisMonth: 420.0,
      bgGradient: 'from-[#04241B] via-[#064E3B] to-[#022C22]',
      borderGlow: 'border-emerald-500/40 shadow-emerald-900/50',
      accentColor: 'text-teal-300',
      pillBg: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
      status: 'Yield Active · 5.20% p.a.',
    },
    {
      id: 'card_sapphire',
      name: 'FinTrack Virtual Neon',
      tier: 'Disposable Web3 Shield Card',
      network: 'VISA VIRTUAL',
      last4: '3071',
      exp: '01/28',
      cvv: '619',
      balance: 5000 - Math.abs(creditBalance),
      limit: 5000,
      spentThisMonth: Math.abs(creditBalance),
      bgGradient: 'from-[#0F172A] via-[#1E1B4B] to-[#31104B]',
      borderGlow: 'border-purple-500/40 shadow-purple-900/40',
      accentColor: 'text-purple-300',
      pillBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      status: 'Auto-Renewing Virtual Token',
    },
  ];

  const currentCard = cards[activeCardIndex];

  const handleCopyCard = () => {
    navigator.clipboard?.writeText(`4532 8912 0482 ${currentCard.last4}`);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
      {/* Header & Card Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Smart Cards &amp; Vaults</h3>
            <p className="text-xs text-slate-400">Multi-currency contactless metal &amp; virtual tokens</p>
          </div>
        </div>

        {/* Card Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-white/[0.03] p-1 rounded-xl border border-white/[0.08] overflow-x-auto">
          {cards.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setActiveCardIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                activeCardIndex === idx
                  ? 'bg-white/10 text-white shadow-sm border border-white/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {idx === 0 ? 'Obsidian' : idx === 1 ? 'Emerald Vault' : 'Virtual'}
            </button>
          ))}
        </div>
      </div>

      {/* Realistic 3D-styled Neo-Card */}
      <div className="relative group">
        <div
          className={`relative w-full max-w-md mx-auto aspect-[1.586/1] rounded-2xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 border bg-gradient-to-br ${currentCard.bgGradient} ${currentCard.borderGlow}`}
        >
          {/* Holographic Sheen Layer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] via-transparent to-white/[0.08] pointer-events-none" />
          
          {/* Frozen Overlay */}
          {isFrozen && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-2 animate-fadeIn">
              <Lock className="w-8 h-8 text-amber-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider">Card Temporarily Frozen</span>
              <span className="text-xs text-slate-400">All outgoing transactions are blocked</span>
              <button
                onClick={() => setIsFrozen(false)}
                className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition cursor-pointer"
              >
                Unfreeze Now
              </button>
            </div>
          )}

          {/* Card Top: Chip & NFC Wave */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              {/* Golden EMV Chip */}
              <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1px] shadow-md">
                <div className="w-full h-full bg-[#D4AF37]/90 rounded-[5px] border border-amber-300/40 grid grid-cols-2 grid-rows-2 p-1">
                  <div className="border-r border-b border-amber-800/40" />
                  <div className="border-b border-amber-800/40" />
                  <div className="border-r border-amber-800/40" />
                  <div />
                </div>
              </div>
              <Wifi className="w-5 h-5 text-slate-400 rotate-90" />
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400 block">
                {currentCard.network}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                NFC Ready
              </span>
            </div>
          </div>

          {/* Card Middle: Balance & Card Number */}
          <div className="space-y-1 relative z-10 my-2">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
              Available Balance
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight tabular-nums">
              {formatCurrency(currentCard.balance)}
            </div>

            {/* Embossed Card Number */}
            <div className="pt-2 font-mono text-sm sm:text-base tracking-[0.25em] text-slate-200 flex items-center justify-between">
              <span>{showSensitive ? '4532' : '••••'}</span>
              <span>{showSensitive ? '8912' : '••••'}</span>
              <span>{showSensitive ? '0482' : '••••'}</span>
              <span className="text-white font-bold">{currentCard.last4}</span>
            </div>
          </div>

          {/* Card Bottom: Holder Name, Expiry, CVV */}
          <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/10">
            <div>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
                Cardholder
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                ALEXANDER WEBB
              </span>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
                  Expires
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  {currentCard.exp}
                </span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">
                  CVV
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {showSensitive ? currentCard.cvv : '•••'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Quick Control Strip */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {/* Toggle Details */}
        <button
          onClick={() => setShowSensitive((prev) => !prev)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition cursor-pointer"
        >
          {showSensitive ? <EyeOff className="w-3.5 h-3.5 text-slate-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{showSensitive ? 'Hide CVV' : 'Show CVV'}</span>
        </button>

        {/* Copy Card Number */}
        <button
          onClick={handleCopyCard}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 hover:text-white transition cursor-pointer"
        >
          {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{copiedToast ? 'Copied!' : 'Copy Num'}</span>
        </button>

        {/* Freeze Card */}
        <button
          onClick={() => setIsFrozen((prev) => !prev)}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border transition cursor-pointer ${
            isFrozen
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.08] text-slate-300 hover:text-white'
          }`}
        >
          {isFrozen ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5 text-slate-400" />}
          <span>{isFrozen ? 'Frozen' : 'Freeze'}</span>
        </button>
      </div>

      {/* Card Monthly Spending Limit Gauge */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Monthly Spending Velocity</span>
          <span className="font-mono text-white font-semibold">
            {formatCurrency(currentCard.spentThisMonth)} / {formatCurrency(currentCard.limit)}
          </span>
        </div>
        <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 transition-all duration-500 rounded-full"
            style={{ width: `${Math.min(100, (currentCard.spentThisMonth / currentCard.limit) * 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-500">
          <span>Safe spending range</span>
          <span className="text-emerald-400 font-mono font-medium">
            {Math.round(((currentCard.limit - currentCard.spentThisMonth) / currentCard.limit) * 100)}% Available
          </span>
        </div>
      </div>
    </div>
  );
};
