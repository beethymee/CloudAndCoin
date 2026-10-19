import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  CreditCard,
  ShieldCheck,
  Calendar,
  Layers,
  Send,
  Plus,
  PieChart,
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
import { UserPreferences, VECTOR_AVATARS } from '../types/theme';
import { formatCurrency } from '../services/financeEngine';
import { SmartBudgeting } from './SmartBudgeting';
import { BillsManager } from './BillsManager';
import { SpendingInsights } from './SpendingInsights';
import { SecurityAuditView } from './SecurityAuditView';
import { NeoCardShowcase } from './NeoCardShowcase';
import { QuickAddExpenseModal } from './QuickAddExpenseModal';
import { SendMoneyModal } from './SendMoneyModal';

export type WorkspaceOption =
  | 'budgets'
  | 'bills'
  | 'analytics'
  | 'security'
  | 'accounts';

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
  const [activeOption, setActiveOption] = useState<WorkspaceOption>('budgets');

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);

  // Financial calculations
  const totalBalance = accounts.reduce((acc, a) => acc + a.balance, 0);
  const checkingAcc = accounts.find((a) => a.type === 'checking') || accounts[0];
  const savingsAcc = accounts.find((a) => a.type === 'savings') || accounts[1];
  const overdueBills = bills.filter((b) => b.status === 'overdue');

  const avatar = VECTOR_AVATARS.find((a) => a.id === preferences.avatarId) || VECTOR_AVATARS[0];

  const tabs: {
    id: WorkspaceOption;
    label: string;
    icon: React.ElementType;
    badge?: string | number | null;
  }[] = [
    {
      id: 'budgets',
      label: 'Budgets',
      icon: Layers,
    },
    {
      id: 'bills',
      label: 'Bills',
      icon: Calendar,
      badge: overdueBills.length > 0 ? `${overdueBills.length} Due` : null,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: PieChart,
    },
    {
      id: 'security',
      label: 'Security',
      icon: ShieldCheck,
      badge: pendingProposalsCount > 0 ? `${pendingProposalsCount}` : null,
    },
    {
      id: 'accounts',
      label: 'Cards & Vaults',
      icon: CreditCard,
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-4 pb-20 text-slate-100 font-sans">
      {/* ======================================================== */}
      {/* CLEAN & SPACIOUS UPPER SECTION: GREETING & METRICS       */}
      {/* ======================================================== */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#0E1713]/80 border border-white/10 backdrop-blur-md shadow-sm space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl select-none shrink-0 shadow-sm">
              {avatar.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight font-serif">
                  {preferences.userName || 'Catherine'}
                </h1>
                <span className="text-[11px] text-emerald-400 font-medium">
                  · {preferences.job || 'Financial Analyst'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                All accounts balanced · No security flags detected
              </p>
            </div>
          </div>

          {/* Quick Essential Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>

            <button
              onClick={() => setIsSendMoneyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-medium transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-cyan-400" />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* 3 Balanced, Uncluttered Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* 1. Net Liquid Assets */}
          <div className="p-3.5 rounded-xl bg-black/25 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Net Liquid Assets</span>
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-serif">
              {formatCurrency(totalBalance)}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-0.5">
              <span>Checking: {formatCurrency(checkingAcc?.balance || 0)}</span>
              <span className="text-emerald-400 font-medium">
                Vault: {formatCurrency(savingsAcc?.balance || 0)}
              </span>
            </div>
          </div>

          {/* 2. Monthly Net Flow */}
          <div className="p-3.5 rounded-xl bg-black/25 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Monthly Net Surplus</span>
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-serif">
              +{formatCurrency(healthScore.metrics.netSavings)}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-0.5">
              <span>In: {formatCurrency(healthScore.metrics.monthlyIncome)}</span>
              <span>Out: {formatCurrency(healthScore.metrics.monthlyExpenses)}</span>
            </div>
          </div>

          {/* 3. Health Score & Reserve Cushion */}
          <div className="p-3.5 rounded-xl bg-black/25 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>Financial Health</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-extrabold text-white font-serif">
                {healthScore.overall}
              </span>
              <span className="text-xs text-slate-400">/ 100</span>
              <span className="ml-auto text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                Grade {healthScore.grade}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-0.5">
              {healthScore.metrics.emergencyMonthsCovered.toFixed(1)} months reserve buffer
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SLEEK CLEAN TAB SEGMENTS                                 */}
      {/* ======================================================== */}
      <section className="flex items-center overflow-x-auto gap-1.5 p-1 bg-black/30 border border-white/10 rounded-xl scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeOption === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveOption(tab.id)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </section>

      {/* ======================================================== */}
      {/* CLEAN ACTIVE VIEW CONTAINER                              */}
      {/* ======================================================== */}
      <section className="rounded-2xl bg-[#0E1713]/80 border border-white/10 p-4 sm:p-5 shadow-lg">
        {/* Option 1: Budgets (Compact & Clean) */}
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
                NeoCard &amp; Vault Allocation
              </span>
              <button
                onClick={() => setIsSendMoneyOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition"
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
      </section>

      {/* Internal Modals */}
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
    </div>
  );
};
