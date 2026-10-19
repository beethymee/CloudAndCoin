import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  AlertCircle,
  Sparkles,
  ArrowRight,
  PlusCircle,
  CreditCard,
  PiggyBank,
  ShieldCheck,
  Zap,
  Sliders,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  Camera,
  Plus,
  BookOpen,
  PieChart,
  Coffee,
  ShoppingBag,
  Car,
  Home,
  Film,
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
import { formatCurrency } from '../services/financeEngine';
import { NeoCardShowcase } from './NeoCardShowcase';
import { QuickAddExpenseModal } from './QuickAddExpenseModal';
import { SendMoneyModal } from './SendMoneyModal';
import { ReceiptScanModal } from './ReceiptScanModal';
import { BookkeeperLedgerView } from './BookkeeperLedgerView';

interface DashboardOverviewProps {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
  healthScore: FinancialHealthScore;
  recommendations: Recommendation[];
  onTriggerRecommendation: (prompt: string) => void;
  onSimulateTransaction: (desc: string, amount: number, category: any, accountId: string) => void;
  onOpenProposal: (proposal: ActionProposal) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  accounts,
  transactions,
  budgets,
  bills,
  healthScore,
  recommendations,
  onTriggerRecommendation,
  onSimulateTransaction,
  onOpenProposal,
}) => {
  // View mode switcher: 'neobank' or 'ledger'
  const [viewMode, setViewMode] = useState<'neobank' | 'ledger'>('neobank');

  // Modals
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isSendMoneyOpen, setIsSendMoneyOpen] = useState(false);
  const [isReceiptScanOpen, setIsReceiptScanOpen] = useState(false);

  // Sandbox transaction state
  const [simDesc, setSimDesc] = useState('');
  const [simAmount, setSimAmount] = useState('');
  const [simCategory, setSimCategory] = useState<TransactionCategory>('Dining & Food');

  // Interactive Wealth Projection Simulator State
  const [monthlySavingsBoost, setMonthlySavingsBoost] = useState<number>(350);
  const [expectedYieldPercent, setExpectedYieldPercent] = useState<number>(6.5);
  const [projectionHorizonYears, setProjectionHorizonYears] = useState<number>(3);

  const checkingAcc = accounts.find((a) => a.type === 'checking') || accounts[0];
  const savingsAcc = accounts.find((a) => a.type === 'savings') || accounts[1];
  const creditAcc = accounts.find((a) => a.type === 'credit') || accounts[2];

  const totalAssets = accounts
    .filter((a) => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);

  const totalLiabilities = accounts
    .filter((a) => a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);

  const netWorth = totalAssets - totalLiabilities;
  const overdueBills = bills.filter((b) => b.status === 'overdue');

  const handleSimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(simAmount);
    if (!simDesc.trim() || isNaN(amt) || amt <= 0) return;

    onSimulateTransaction(simDesc, -amt, simCategory, creditAcc?.id || 'acc_cc_01');
    setSimDesc('');
    setSimAmount('');
  };

  const handleSendMoney = (recipient: string, amount: number, note: string) => {
    onSimulateTransaction(`P2P to ${recipient} (${note})`, -amount, 'Personal Care', checkingAcc?.id || 'acc_chk_01');
  };

  const handleReceiptProcessed = (merchant: string, amount: number, category: TransactionCategory) => {
    onSimulateTransaction(merchant, -amount, category, checkingAcc?.id || 'acc_chk_01');
  };

  // Calculate Wealth Projection Curve for Simulator
  const startingCapital = netWorth;
  const monthlyRate = expectedYieldPercent / 100 / 12;
  const totalMonths = projectionHorizonYears * 12;

  // Generate points for SVG trajectory
  const trajectoryPoints: { month: number; value: number }[] = [];
  let runningBalance = startingCapital;
  for (let m = 0; m <= totalMonths; m += Math.max(1, Math.floor(totalMonths / 12))) {
    const baselineSavings = healthScore.metrics.netSavings > 0 ? healthScore.metrics.netSavings : 200;
    const totalMonthlyDeposit = baselineSavings + monthlySavingsBoost;
    runningBalance = runningBalance * (1 + monthlyRate) + totalMonthlyDeposit;
    trajectoryPoints.push({ month: m, value: Math.round(runningBalance) });
  }

  const finalProjectedValue = trajectoryPoints[trajectoryPoints.length - 1]?.value || startingCapital;
  const projectedGains = finalProjectedValue - startingCapital - (healthScore.metrics.netSavings + monthlySavingsBoost) * totalMonths;

  // SVG Chart bounds
  const minVal = startingCapital;
  const maxVal = Math.max(...trajectoryPoints.map((p) => p.value));
  const svgWidth = 600;
  const svgHeight = 160;
  const padding = 24;

  const pointsSvg = trajectoryPoints
    .map((p, idx) => {
      const x = padding + (idx / (trajectoryPoints.length - 1)) * (svgWidth - padding * 2);
      const y = svgHeight - padding - ((p.value - minVal) / (maxVal - minVal || 1)) * (svgHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  // Category spending breakdown computation
  const categoryTotals: Record<string, number> = {};
  transactions
    .filter((t) => t.amount < 0)
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Math.abs(t.amount);
    });

  const topCategories = [
    { name: 'Dining & Food', icon: Coffee, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', bar: 'bg-amber-400', budget: 450 },
    { name: 'Groceries', icon: ShoppingBag, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', bar: 'bg-emerald-400', budget: 500 },
    { name: 'Housing', icon: Home, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', bar: 'bg-rose-400', budget: 1250 },
    { name: 'Transportation', icon: Car, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', bar: 'bg-cyan-400', budget: 300 },
    { name: 'Entertainment', icon: Film, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', bar: 'bg-purple-400', budget: 150 },
  ];

  // Daily safe spending velocity (remaining budget / days in month)
  const remainingBudget = Math.max(0, 2750 - healthScore.metrics.monthlyExpenses);
  const dailyAllowance = remainingBudget / 12; // ~12 days left in period

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Top Controls: Mode Switcher & Quick Action Hub */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white/[0.02] p-2.5 rounded-2xl border border-white/[0.08]">
        {/* Aesthetic View Switcher: Neo-Bank vs Classic Ledger */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08]">
          <button
            onClick={() => setViewMode('neobank')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'neobank'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Neo-Bank Hub</span>
          </button>
          <button
            onClick={() => setViewMode('ledger')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              viewMode === 'ledger'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>General Ledger</span>
          </button>
        </div>

        {/* Quick Action Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-950/40 border border-emerald-400/30 transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Add Expense</span>
          </button>

          <button
            onClick={() => setIsSendMoneyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Send Money</span>
          </button>

          <button
            onClick={() => setIsReceiptScanOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <Camera className="w-3.5 h-3.5 text-purple-400" />
            <span>Scan Receipt</span>
          </button>

          <button
            onClick={() => onTriggerRecommendation('How can I optimize the idle cash in my checking account?')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask Copilot</span>
          </button>
        </div>
      </div>

      {/* If General Ledger mode is chosen, display Bookkeeper Ledger view */}
      {viewMode === 'ledger' ? (
        <BookkeeperLedgerView transactions={transactions} accounts={accounts} />
      ) : (
        <>
          {/* Hero Financial Status Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B101D] via-[#090D18] to-[#05070B] border border-white/10 p-6 sm:p-8 shadow-2xl">
            {/* Ambient Spotlight Glow */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Autonomous FinTech Participant
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    Real-Time Health: {healthScore.overall}/100 ({healthScore.grade})
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Financial Command Center
                </h1>

                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  AI-driven multi-account surveillance, predictive cash-flow forecasting, and automated Tier-2 proposal engine tailored for FinTechathon 2026.
                </p>
              </div>

              {/* Quick Net Worth Snapshot */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 bg-white/[0.03] border border-white/10 p-5 rounded-2xl shrink-0">
                <div>
                  <span className="text-xs font-medium text-slate-400 block uppercase tracking-wider">
                    Total Net Liquidity
                  </span>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white tabular-nums">
                    {formatCurrency(netWorth)}
                  </div>
                  <div className="flex items-center gap-2 text-xs mt-1 text-slate-400">
                    <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                      <ArrowUpRight className="w-3 h-3" /> +14.2%
                    </span>
                    <span>vs previous cycle</span>
                  </div>
                </div>

                <div className="h-px sm:h-12 sm:w-px bg-white/10 my-1 sm:my-0" />

                <div className="flex flex-col justify-center">
                  <span className="text-xs text-slate-400">Daily Safe Burn</span>
                  <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                    ${dailyAllowance.toFixed(2)}/day
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Runway: {healthScore.metrics.emergencyMonthsCovered} mo reserves
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Neo-Card Showcase & Category Burn Velocity Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Interactive 3D Metal Cards Showcase */}
            <div className="lg:col-span-7">
              <NeoCardShowcase
                checkingBalance={checkingAcc?.balance || 0}
                savingsBalance={savingsAcc?.balance || 0}
                creditBalance={creditAcc?.balance || 0}
              />
            </div>

            {/* Right 5 Cols: Visual Category Spending Breakdown & Burn Velocity */}
            <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">Budget Category Velocity</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">October 2026</span>
              </div>

              <div className="space-y-3.5">
                {topCategories.map((cat) => {
                  const spent = categoryTotals[cat.name] || 0;
                  const pct = Math.min(100, Math.round((spent / cat.budget) * 100));
                  const isOver = spent > cat.budget;
                  const Icon = cat.icon;

                  return (
                    <div key={cat.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`p-1.5 rounded-lg border ${cat.color}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <span className="text-white font-medium">{cat.name}</span>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono font-bold ${isOver ? 'text-rose-400' : 'text-slate-200'}`}>
                            ${spent.toFixed(0)}
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]"> / ${cat.budget}</span>
                        </div>
                      </div>

                      <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isOver ? 'bg-rose-500' : cat.bar
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action trigger to balance */}
              <div className="pt-2 border-t border-white/[0.06]">
                <button
                  onClick={() =>
                    onOpenProposal({
                      id: `prop_dining_${Date.now()}`,
                      type: 'UPDATE_BUDGET',
                      title: 'Shift $60.00 from Transportation to Dining & Food',
                      description: 'Prevent food budget overrun by absorbing surplus from unutilized transit allowances.',
                      tier: 2,
                      payload: {
                        fromCategory: 'Transportation',
                        toCategory: 'Dining & Food',
                        amount: 60,
                      },
                      diff: [
                        { field: 'Dining & Food Limit', before: '$450.00', after: '$510.00' },
                        { field: 'Transportation Limit', before: '$300.00', after: '$240.00' },
                        { field: 'Total Spend Ceiling', before: '$2,750.00', after: '$2,750.00 (Neutral)' },
                      ],
                      impactSummary: 'Prevents dining budget overrun with neutral total impact.',
                      status: 'PENDING',
                      createdAt: new Date().toISOString(),
                    })
                  }
                  className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Auto-Rebalance Overrun Envelopes</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Core Financial KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Assets */}
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium">Total Assets</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-white tabular-nums">
                {formatCurrency(totalAssets)}
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <span>Checking + Vault</span>
                <span className="text-emerald-400 font-medium">Liquid</span>
              </div>
            </div>

            {/* Monthly Inflow */}
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium">Monthly Inflow</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 tabular-nums">
                +{formatCurrency(healthScore.metrics.monthlyIncome)}
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <span>Savings Velocity</span>
                <span className="text-emerald-400 font-semibold">{healthScore.metrics.savingsRatePercent}%</span>
              </div>
            </div>

            {/* Monthly Outflow */}
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium">Monthly Outflow</span>
                <ArrowDownRight className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-rose-400 tabular-nums">
                -{formatCurrency(healthScore.metrics.monthlyExpenses)}
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <span>Net Monthly Margin</span>
                <span className="text-slate-200 font-semibold">+{formatCurrency(healthScore.metrics.netSavings)}</span>
              </div>
            </div>

            {/* Active Liabilities */}
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium">Credit Obligations</span>
                <CreditCard className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold font-mono text-amber-300 tabular-nums">
                {formatCurrency(totalLiabilities)}
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <span>Debt-to-Income Score</span>
                <span className="text-amber-400 font-medium">{healthScore.breakdown.debtRatio}/100</span>
              </div>
            </div>
          </div>

          {/* Interactive Feature: "What-If" Wealth Multiplier & Runway Simulator */}
          <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    Interactive Wealth Growth &amp; Runway Simulator
                  </h3>
                </div>
                <p className="text-xs text-slate-400">
                  Drag parameters in real time to simulate AI-guided compound optimization and personal runway.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] text-xs">
                {[1, 3, 5].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setProjectionHorizonYears(yr)}
                    className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                      projectionHorizonYears === yr
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {yr} {yr === 1 ? 'Year' : 'Years'}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/[0.02] p-4 sm:p-5 rounded-2xl border border-white/[0.06]">
              {/* Monthly Savings Boost Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Monthly AI Optimization Boost:</span>
                  <span className="font-mono font-bold text-emerald-400">+{formatCurrency(monthlySavingsBoost)}/mo</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1500}
                  step={50}
                  value={monthlySavingsBoost}
                  onChange={(e) => setMonthlySavingsBoost(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>$0 (Current baseline)</span>
                  <span>+$750/mo</span>
                  <span>+$1,500/mo (Max discipline)</span>
                </div>
              </div>

              {/* Expected Yield Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Expected Blended Yield:</span>
                  <span className="font-mono font-bold text-cyan-400">{expectedYieldPercent.toFixed(1)}% p.a.</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={12}
                  step={0.5}
                  value={expectedYieldPercent}
                  onChange={(e) => setExpectedYieldPercent(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>3.0% (Conservative)</span>
                  <span>6.5% (Balanced Index)</span>
                  <span>12.0% (Growth)</span>
                </div>
              </div>
            </div>

            {/* Trajectory Visualizer */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div>
                  <span className="text-slate-400">Projected {projectionHorizonYears}-Year Balance: </span>
                  <span className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                    {formatCurrency(finalProjectedValue)}
                  </span>
                </div>
                <div className="text-slate-400">
                  Compound Interest Accrued: <span className="font-mono font-bold text-cyan-300">+{formatCurrency(Math.max(0, projectedGains))}</span>
                </div>
              </div>

              {/* Interactive Trajectory SVG */}
              <div className="w-full bg-[#05080E] rounded-2xl p-4 border border-white/[0.08] overflow-hidden">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-36">
                  <defs>
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="rgba(255,255,255,0.08)" />

                  <polygon
                    points={`${padding},${svgHeight - padding} ${pointsSvg} ${svgWidth - padding},${svgHeight - padding}`}
                    fill="url(#curveGradient)"
                  />

                  <polyline
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsSvg}
                  />

                  {trajectoryPoints.map((p, idx) => {
                    const x = padding + (idx / (trajectoryPoints.length - 1)) * (svgWidth - padding * 2);
                    const y = svgHeight - padding - ((p.value - minVal) / (maxVal - minVal || 1)) * (svgHeight - padding * 2);
                    if (idx === 0 || idx === trajectoryPoints.length - 1 || idx === Math.floor(trajectoryPoints.length / 2)) {
                      return (
                        <g key={idx}>
                          <circle cx={x} cy={y} r="4" fill="#10B981" stroke="#07090E" strokeWidth="2" />
                          <text x={x} y={y - 8} fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="monospace">
                            ${Math.round(p.value / 1000)}k
                          </text>
                        </g>
                      );
                    }
                    return null;
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* 2-Column Section: AI Action Command Deck & Live Accounts Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column: AI Participant Action Triggers */}
            <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-white text-base">
                    Autonomous Participant Action Deck
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Tier-2 Guardrails Active
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                FinTrack continuously computes optimization opportunities. Click any action to inspect its live dry-run impact and execute via human-in-the-loop sign-off:
              </p>

              <div className="space-y-3">
                {/* Action 1: Reallocate Dining Surplus */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Optimize Envelope Reallocation
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Dining spend is tracking at 104% of envelope. Shift $60 from surplus Transportation envelope to maintain balance.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        onOpenProposal({
                          id: `prop_dining_${Date.now()}`,
                          type: 'UPDATE_BUDGET',
                          title: 'Shift $60.00 from Transportation to Dining & Food',
                          description: 'Prevent food budget overrun by absorbing surplus from unutilized transit allowances.',
                          tier: 2,
                          payload: {
                            fromCategory: 'Transportation',
                            toCategory: 'Dining & Food',
                            amount: 60,
                          },
                          diff: [
                            { field: 'Dining & Food Limit', before: '$450.00', after: '$510.00' },
                            { field: 'Transportation Limit', before: '$300.00', after: '$240.00' },
                            { field: 'Total Spend Ceiling', before: '$2,750.00', after: '$2,750.00 (Neutral)' },
                          ],
                          impactSummary: 'Prevents dining budget overrun with neutral total impact.',
                          status: 'PENDING',
                          createdAt: new Date().toISOString(),
                        })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition shrink-0 cursor-pointer"
                    >
                      Generate Proposal
                    </button>
                  </div>
                </div>

                {/* Action 2: Shield Overdue Water Utility Bill */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-rose-500/30 hover:border-rose-500/50 transition space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <h4 className="text-sm font-semibold text-white">
                          Overdue Notice: City Water Utility ($68.50)
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Due 5 days ago. Immediate settlement avoids a $15.00 late delinquency fee.
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        onOpenProposal({
                          id: `prop_water_${Date.now()}`,
                          type: 'PAY_BILL',
                          title: 'Settle Overdue City Water & Power Bill ($68.50)',
                          description: 'Disburse $68.50 from Primary Checking to clear overdue balance and protect credit score.',
                          tier: 2,
                          payload: {
                            billId: 'bill_01',
                            amount: 68.5,
                            fromAccountId: 'acc_chk_01',
                          },
                          diff: [
                            { field: 'Checking Balance', before: '$4,328.45', after: '$4,259.95' },
                            { field: 'Bill Status', before: 'Overdue (Penalty Risk)', after: 'Paid (Zero Penalty)' },
                          ],
                          impactSummary: 'Avoids late fee and credit score hit.',
                          status: 'PENDING',
                          createdAt: new Date().toISOString(),
                        })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition shrink-0 cursor-pointer"
                    >
                      Settle Bill
                    </button>
                  </div>
                </div>

                {/* Action 3: Sweep Idle Checking Cash into Vault */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        Auto-Sweep Surplus Checking Float ($1,000)
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Checking balance ($4,328) exceeds monthly requirements. Sweep $1,000 to High-Yield Vault (5.2% APY).
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        onOpenProposal({
                          id: `prop_sweep_${Date.now()}`,
                          type: 'TRANSFER_FUNDS',
                          title: 'Sweep $1,000.00 Surplus to High-Yield Escrow Vault',
                          description: 'Increase APY yield from 0.05% to 5.20% while retaining full liquidity.',
                          tier: 2,
                          payload: {
                            fromAccountId: 'acc_chk_01',
                            toAccountId: 'acc_sav_01',
                            amount: 1000,
                          },
                          diff: [
                            { field: 'Primary Checking', before: '$4,328.45', after: '$3,328.45' },
                            { field: 'High-Yield Vault', before: '$12,500.00', after: '$13,500.00' },
                            { field: 'Annual Yield Delta', before: '+$650.00/yr', after: '+$702.00/yr' },
                          ],
                          impactSummary: 'Increases net yield with zero liquidity risk.',
                          status: 'PENDING',
                          createdAt: new Date().toISOString(),
                        })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 transition shrink-0 cursor-pointer"
                    >
                      Initiate Sweep
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Multi-Account Surveillance & Sandbox Simulator */}
            <div className="space-y-6">
              {/* Linked Financial Accounts */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-white text-base">
                      Connected Institution Accounts
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {accounts.length} Active Feeds
                  </span>
                </div>

                <div className="space-y-3">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                          {acc.type === 'checking' && <Wallet className="w-4 h-4 text-cyan-400" />}
                          {acc.type === 'savings' && <PiggyBank className="w-4 h-4 text-emerald-400" />}
                          {acc.type === 'credit' && <CreditCard className="w-4 h-4 text-amber-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{acc.name}</div>
                          <div className="text-xs text-slate-400">
                            {acc.institution} &bull; <span className="font-mono">{acc.accountNumberMasked}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-base font-bold font-mono tabular-nums ${
                            acc.balance < 0 ? 'text-amber-400' : 'text-white'
                          }`}
                        >
                          {formatCurrency(acc.balance)}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {acc.type === 'savings' ? '5.20% APY' : acc.type === 'credit' ? 'Limit: $5,000' : 'Primary Float'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sandbox Live Transaction Injection */}
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-bold text-white text-base">
                      Sandbox Transaction Simulator
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">Test Live Engine</span>
                </div>

                <p className="text-xs text-slate-300">
                  Inject a transaction to see real-time updates across budgets, health scores, and AI recommendations:
                </p>

                <form onSubmit={handleSimSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Merchant / Description (e.g. Flight to Shenzhen)"
                      value={simDesc}
                      onChange={(e) => setSimDesc(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="number"
                      placeholder="Amount (USD $)"
                      value={simAmount}
                      onChange={(e) => setSimAmount(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={simCategory}
                      onChange={(e) => setSimCategory(e.target.value as TransactionCategory)}
                      className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-emerald-500 flex-1"
                    >
                      <option value="Dining & Food">Dining &amp; Food</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Utilities">Utilities</option>
                    </select>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/30 transition shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      Inject Transaction
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modals for Quick Mobile Actions */}
      <QuickAddExpenseModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddTransaction={onSimulateTransaction}
        accounts={accounts}
      />

      <SendMoneyModal
        isOpen={isSendMoneyOpen}
        onClose={() => setIsSendMoneyOpen(false)}
        availableBalance={checkingAcc?.balance || 0}
        onSend={handleSendMoney}
      />

      <ReceiptScanModal
        isOpen={isReceiptScanOpen}
        onClose={() => setIsReceiptScanOpen(false)}
        onReceiptProcessed={handleReceiptProcessed}
      />
    </div>
  );
};
