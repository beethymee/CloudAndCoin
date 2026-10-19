import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Calendar,
  Layers,
  Send,
  Camera,
  Plus,
  PieChart,
  Settings,
  Heart,
  Compass,
  Search,
} from 'lucide-react';
import {
  Account,
  Bill,
  Budget,
  FinancialHealthScore,
  Recommendation,
  Transaction,
  ActionProposal,
  TransactionCategory,
} from '../types/finance';
import { UserPreferences } from '../types/theme';
import { formatCurrency } from '../services/financeEngine';
import { SmartBudgeting } from './SmartBudgeting';
import { BillsManager } from './BillsManager';
import { SpendingInsights } from './SpendingInsights';
import { SecurityAuditView } from './SecurityAuditView';
import { NeoCardShowcase } from './NeoCardShowcase';
import { QuickAddExpenseModal } from './QuickAddExpenseModal';
import { SendMoneyModal } from './SendMoneyModal';
import { ReceiptScanModal } from './ReceiptScanModal';

export type WorkspaceOption =
  | 'budgets'
  | 'bills'
  | 'analytics'
  | 'security'
  | 'accounts'
  | 'wellbeing';

interface MainWorkspaceProps {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
  healthScore: FinancialHealthScore;
  recommendations: Recommendation[];
  preferences: UserPreferences;
  onOpenThemeSettings: () => void;
  onOpenFeatureSearch: () => void;
  onOpenWellbeingCheckIn: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenProposal: (proposal: ActionProposal) => void;
  onTriggerRecommendation: (prompt: string) => void;
  onSimulateTransaction: (
    desc: string,
    amount: number,
    category: TransactionCategory,
    accountId: string
  ) => void;
  pendingProposalsCount: number;
}

export const MainWorkspace: React.FC<MainWorkspaceProps> = ({
  accounts,
  transactions,
  budgets,
  bills,
  healthScore,
  recommendations,
  preferences,
  onOpenThemeSettings,
  onOpenFeatureSearch,
  onOpenWellbeingCheckIn,
  onNavigateTab,
  onOpenProposal,
  onTriggerRecommendation,
  onSimulateTransaction,
  pendingProposalsCount,
}) => {
  // Selected option tab for the lower detailed view
  const [activeOption, setActiveOption] = useState<WorkspaceOption>('budgets');

  // Modal triggers
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const [isReceiptScanOpen, setIsReceiptScanOpen] = useState(false);

  // Financial calculations
  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
  const checkingAcc = accounts.find((a) => a.type === 'checking') || accounts[0];
  const savingsAcc = accounts.find((a) => a.type === 'savings') || accounts[1];
  const overdueBills = bills.filter((b) => b.status === 'overdue');

  const optionsList: {
    id: WorkspaceOption;
    label: string;
    icon: React.ElementType;
    badge?: string | number | null;
    tagline: string;
  }[] = [
    {
      id: 'budgets',
      label: 'Budgets',
      icon: Layers,
      tagline: '50/30/20 Envelopes',
    },
    {
      id: 'bills',
      label: 'Bills',
      icon: Calendar,
      badge: overdueBills.length > 0 ? `${overdueBills.length} Due` : null,
      tagline: 'Due Calendar',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: PieChart,
      tagline: 'Spending Velocity',
    },
    {
      id: 'security',
      label: 'Security',
      icon: ShieldCheck,
      badge: pendingProposalsCount > 0 ? `${pendingProposalsCount}` : null,
      tagline: 'Audit & Policy',
    },
    {
      id: 'accounts',
      label: 'Cards',
      icon: CreditCard,
      tagline: 'NeoCard & Vaults',
    },
    {
      id: 'wellbeing',
      label: 'Wellbeing',
      icon: Heart,
      tagline: 'Mindfulness',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-3 pb-6 text-slate-100 font-sans">
      {/* ======================================================== */}
      {/* COMPACT UPPER BAR: GREETING & METRIC CARDS               */}
      {/* ======================================================== */}
      <section className="p-3.5 sm:p-4 rounded-2xl bg-[#0E1713]/90 border border-white/10 backdrop-blur-xl shadow-lg space-y-3">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('welcome')}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
              title="Return to Welcome Screen"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight font-serif flex items-center gap-2">
                <span>{preferences.userName || 'Catherine'}</span>
                <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {preferences.job || 'Financial Analyst'}
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Action Icons in Upper Bar */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {/* Search Option Beside Settings */}
            <button
              onClick={onOpenFeatureSearch}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition cursor-pointer"
              title="Search features"
            >
              <Search className="w-3.5 h-3.5 text-emerald-400" />
              <span>Search</span>
            </button>

            {/* Quick Add Expense */}
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition cursor-pointer"
              title="Add Expense"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Expense</span>
            </button>

            {/* Transfer */}
            <button
              onClick={() => setIsSendMoneyOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition cursor-pointer"
              title="Transfer Funds"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Transfer</span>
            </button>

            {/* Receipt Scan */}
            <button
              onClick={() => setIsReceiptScanOpen(true)}
              className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
              title="Scan Receipt OCR"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
            </button>

            {/* Settings */}
            <button
              onClick={onOpenThemeSettings}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-sm cursor-pointer"
              title="Settings (Profile, PIN, Theme, Logout)"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* 4 Compact Summary Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {/* 1. Net Liquid Assets */}
          <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-semibold">
              <span>Net Liquid Assets</span>
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white font-serif">
              {formatCurrency(totalBalance)}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Chk: {formatCurrency(checkingAcc?.balance || 0)} · Sav: {formatCurrency(savingsAcc?.balance || 0)}
            </div>
          </div>

          {/* 2. Monthly Cash Flow */}
          <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-semibold">
              <span>Net Cash Flow</span>
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-300 font-serif">
              +{formatCurrency(healthScore.metrics.netSavings)}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              In: {formatCurrency(healthScore.metrics.monthlyIncome)} · Out: {formatCurrency(healthScore.metrics.monthlyExpenses)}
            </div>
          </div>

          {/* 3. Health Score */}
          <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-semibold">
              <span>Health Score</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-white font-serif">
                {healthScore.overall}
              </span>
              <span className="text-[10px] text-slate-400">/ 100</span>
              <span className="text-[10px] font-bold text-emerald-300 ml-auto bg-emerald-500/20 px-1.5 py-0.2 rounded">
                Grade {healthScore.grade}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {healthScore.metrics.emergencyMonthsCovered.toFixed(1)} mo reserve cushion
            </div>
          </div>

          {/* 4. Bills Punctuality */}
          <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-0.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-semibold">
              <span>Bill Schedule</span>
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg sm:text-xl font-extrabold text-white font-serif">
              {bills.filter((b) => b.status === 'paid').length}/{bills.length} Paid
            </div>
            <div className="text-[10px] truncate">
              {overdueBills.length > 0 ? (
                <span className="text-amber-400 font-medium">1 overdue: Water ($45.20)</span>
              ) : (
                <span className="text-emerald-400 font-medium">All current bills settled</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FEATURE SELECTOR ICON BAR                                */}
      {/* ======================================================== */}
      <section className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {optionsList.map((opt) => {
          const Icon = opt.icon;
          const isSelected = activeOption === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveOption(opt.id)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 relative ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/30'
                  : 'bg-[#0E1713]/60 hover:bg-[#0E1713]/90 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                  isSelected
                    ? 'bg-emerald-400 text-slate-950 font-bold'
                    : 'bg-white/5 text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate leading-tight">
                  {opt.label}
                </div>
                <div className="text-[9px] text-slate-400 truncate leading-tight">
                  {opt.tagline}
                </div>
              </div>
              {opt.badge && (
                <span className="absolute top-1.5 right-1.5 px-1 py-0.2 rounded text-[8px] font-bold bg-amber-400 text-slate-950">
                  {opt.badge}
                </span>
              )}
            </button>
          );
        })}
      </section>

      {/* ======================================================== */}
      {/* DETAIL ACTIVE VIEW (DESIGNED TO MINIMIZE SCROLLING)       */}
      {/* ======================================================== */}
      <section className="rounded-2xl bg-[#0E1713]/75 border border-white/10 p-3 sm:p-4 shadow-xl">
        {/* Option 1: Budgets (Minimized) */}
        {activeOption === 'budgets' && (
          <SmartBudgeting
            budgets={budgets}
            transactions={transactions}
            onOpenProposal={onOpenProposal}
          />
        )}

        {/* Option 2: Bills */}
        {activeOption === 'bills' && (
          <BillsManager
            bills={bills}
            accounts={accounts}
            onOpenProposal={onOpenProposal}
          />
        )}

        {/* Option 3: Analytics */}
        {activeOption === 'analytics' && (
          <SpendingInsights transactions={transactions} />
        )}

        {/* Option 4: Security */}
        {activeOption === 'security' && (
          <SecurityAuditView
            auditLogs={[]}
            onInjectTestPrompt={onTriggerRecommendation}
          />
        )}

        {/* Option 5: Cards & Accounts */}
        {activeOption === 'accounts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                NeoCard &amp; Vaults
              </span>
              <button
                onClick={() => setIsSendMoneyOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition"
              >
                Transfer Funds
              </button>
            </div>
            <NeoCardShowcase
              checkingBalance={checkingAcc?.balance || 4328.45}
              savingsBalance={savingsAcc?.balance || 14650}
              creditBalance={Math.abs(accounts.find((a) => a.type === 'credit')?.balance || 842.15)}
            />
          </div>
        )}

        {/* Option 6: Wellbeing */}
        {activeOption === 'wellbeing' && (
          <div className="p-4 text-center space-y-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl">
              🌿
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Mindful Financial Peace</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Take a 30-second mindfulness pulse to align your daily spending with peace of mind.
              </p>
            </div>
            <button
              onClick={onOpenWellbeingCheckIn}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition shadow-md shadow-emerald-500/20"
            >
              Start 30-sec Check-In
            </button>
          </div>
        )}
      </section>

      {/* Modals */}
      <QuickAddExpenseModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTransaction={(desc: string, amount: number, category: TransactionCategory, accountId: string) =>
          onSimulateTransaction(desc, -amount, category, accountId)
        }
        accounts={accounts}
      />

      <SendMoneyModal
        isOpen={isSendMoneyOpen}
        onClose={() => setIsSendMoneyOpen(false)}
        availableBalance={checkingAcc?.balance || 4328.45}
        onSend={(recipient: string, amount: number, note: string) =>
          onSimulateTransaction(`Transfer to ${recipient}: ${note}`, -amount, 'Shopping', checkingAcc.id)
        }
      />

      <ReceiptScanModal
        isOpen={isReceiptScanOpen}
        onClose={() => setIsReceiptScanOpen(false)}
        onReceiptProcessed={(merchant, amount, category) =>
          onSimulateTransaction(`Receipt: ${merchant}`, -amount, category, accounts[0].id)
        }
      />
    </div>
  );
};
