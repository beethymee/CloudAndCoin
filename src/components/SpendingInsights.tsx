import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  TrendingDown,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Building,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { Transaction, TransactionCategory } from '../types/finance';
import { formatCurrency, detectAnomalies } from '../services/financeEngine';

interface SpendingInsightsProps {
  transactions: Transaction[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#3b82f6',
  Groceries: '#10b981',
  'Dining & Food': '#f59e0b',
  Transportation: '#8b5cf6',
  Shopping: '#ec4899',
  Entertainment: '#6366f1',
  Subscriptions: '#06b6d4',
  Utilities: '#14b8a6',
  Investments: '#22c55e',
  Income: '#10b981',
  'Health & Fitness': '#f97316',
  'Personal Care': '#a855f7',
};

export const SpendingInsights: React.FC<SpendingInsightsProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const expenseTransactions = transactions.filter((t) => t.amount < 0 && t.category !== 'Investments');
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) || 1;

  const categoryMap = new Map<TransactionCategory, { total: number; count: number }>();
  for (const t of expenseTransactions) {
    const existing = categoryMap.get(t.category) || { total: 0, count: 0 };
    existing.total += Math.abs(t.amount);
    existing.count += 1;
    categoryMap.set(t.category, existing);
  }

  const categoryEntries = Array.from(categoryMap.entries())
    .map(([cat, val]) => ({
      category: cat,
      total: val.total,
      count: val.count,
      percent: Number(((val.total / totalExpense) * 100).toFixed(1)),
      color: CATEGORY_COLORS[cat] || '#94a3b8',
    }))
    .sort((a, b) => b.total - a.total);

  // Top Merchants
  const merchantMap = new Map<string, { total: number; count: number; category: string }>();
  for (const t of expenseTransactions) {
    const existing = merchantMap.get(t.merchant) || { total: 0, count: 0, category: t.category };
    existing.total += Math.abs(t.amount);
    existing.count += 1;
    merchantMap.set(t.merchant, existing);
  }
  const topMerchants = Array.from(merchantMap.entries())
    .map(([merchant, val]) => ({ merchant, ...val }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const anomalies = detectAnomalies(transactions);

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PieIcon className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Analytics &amp; Intelligence
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Spending Breakdown &amp; Cash Velocity
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Real-time expense categorization, merchant concentration ranking, and machine-learning anomaly detection.
        </p>
      </div>

      {/* Anomaly Alerts (if any) */}
      {anomalies.length > 0 && (
        <div className="glass-card rounded-xl p-5 border border-amber-500/30 bg-amber-500/[0.03] space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>AI Anomaly Surveillance Triggered ({anomalies.length} Unusual Outflows)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {anomalies.map((anom, idx) => (
              <div
                key={`${anom.merchant}_${idx}`}
                className="p-3.5 rounded-lg bg-black/40 border border-amber-500/20 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{anom.merchant} &bull; {anom.category}</span>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">
                    {formatCurrency(Math.abs(anom.amount))}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px]">{anom.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2-Column: Category Breakdown & Top Merchants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h3 className="font-bold text-white text-base">Expense Share by Category</h3>
            <span className="text-xs text-slate-400 font-mono">
              Total: {formatCurrency(totalExpense)}
            </span>
          </div>

          {/* Simple Stacked Proportion Bar */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-black/50 border border-white/[0.08]">
            {categoryEntries.map((cat) => (
              <div
                key={cat.category}
                style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                title={`${cat.category}: ${cat.percent}%`}
              />
            ))}
          </div>

          {/* Category List */}
          <div className="space-y-3">
            {categoryEntries.map((cat) => (
              <div
                key={cat.category}
                className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs font-medium text-white">{cat.category}</span>
                  <span className="text-[11px] text-slate-500">({cat.count} txns)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-white tabular-nums">
                    {formatCurrency(cat.total)}
                  </span>
                  <span className="text-xs font-mono text-slate-400 w-12 text-right">
                    {cat.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Merchants Leaderboard */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Top Outflow Merchants</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Concentration</span>
          </div>

          <p className="text-xs text-slate-300">
            Highest cumulative spending destinations during the current billing cycle:
          </p>

          <div className="space-y-3">
            {topMerchants.map((m, idx) => (
              <div
                key={m.merchant}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-white/5 text-slate-400 text-xs font-mono font-bold flex items-center justify-center">
                    0{idx + 1}
                  </span>
                  <div>
                    <span className="text-xs font-semibold text-white block">{m.merchant}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {m.category} &bull; {m.count} charges
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-white tabular-nums block">
                    {formatCurrency(m.total)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {((m.total / totalExpense) * 100).toFixed(1)}% of total
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
          <h3 className="font-bold text-white text-base">Transaction Ledger</h3>

          {/* Filter & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-slate-300 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Categories</option>
              {Object.keys(CATEGORY_COLORS).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] font-mono text-slate-400 uppercase border-b border-white/[0.08]">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Merchant</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredTransactions.slice(0, 15).map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-2.5 px-3 font-mono text-slate-400">{t.date}</td>
                  <td className="py-2.5 px-3 font-medium text-white">{t.description}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-mono font-medium"
                      style={{
                        backgroundColor: `${CATEGORY_COLORS[t.category] || '#64748b'}20`,
                        color: CATEGORY_COLORS[t.category] || '#94a3b8',
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400">{t.merchant}</td>
                  <td
                    className={`py-2.5 px-3 text-right font-mono font-bold tabular-nums ${
                      t.amount > 0 ? 'text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    {t.amount > 0 ? `+${formatCurrency(t.amount)}` : formatCurrency(t.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
