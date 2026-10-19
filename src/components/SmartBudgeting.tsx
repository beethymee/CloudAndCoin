import React, { useState } from 'react';
import {
  Layers,
  Sliders,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  CheckCircle,
} from 'lucide-react';
import { Budget, Transaction, ActionProposal, TransactionCategory } from '../types/finance';
import {
  getCategorySummaries,
  calculate503020,
  formatCurrency,
} from '../services/financeEngine';

interface SmartBudgetingProps {
  budgets: Budget[];
  transactions: Transaction[];
  onOpenProposal: (proposal: ActionProposal) => void;
}

export const SmartBudgeting: React.FC<SmartBudgetingProps> = ({
  budgets,
  transactions,
  onOpenProposal,
}) => {
  const summaries = getCategorySummaries(budgets, transactions);
  const envelope503020 = calculate503020(budgets, transactions);

  const [fromCategory, setFromCategory] = useState<TransactionCategory>('Transportation');
  const [toCategory, setToCategory] = useState<TransactionCategory>('Dining & Food');
  const [reallocateAmount, setReallocateAmount] = useState('60');
  const [showRebalancePanel, setShowRebalancePanel] = useState(false);

  const handleProposeReallocation = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(reallocateAmount);
    if (isNaN(amt) || amt <= 0 || fromCategory === toCategory) return;

    const fromSummary = summaries.find((s) => s.category === fromCategory);
    const toSummary = summaries.find((s) => s.category === toCategory);

    if (!fromSummary || !toSummary) return;

    const proposal: ActionProposal = {
      id: `prop_realloc_${Date.now()}`,
      type: 'UPDATE_BUDGET',
      title: `Rebalance $${amt.toFixed(2)} from ${fromCategory} to ${toCategory}`,
      description: `Shift envelope limit from surplus category to prevent budget overrun in ${toCategory}.`,
      tier: 2,
      payload: {
        fromCategory,
        toCategory,
        amount: amt,
      },
      diff: [
        {
          field: `${fromCategory} Envelope Limit`,
          before: formatCurrency(fromSummary.allocated),
          after: formatCurrency(fromSummary.allocated - amt),
        },
        {
          field: `${toCategory} Envelope Limit`,
          before: formatCurrency(toSummary.allocated),
          after: formatCurrency(toSummary.allocated + amt),
        },
        {
          field: 'Total Monthly Budget Ceiling',
          before: '$2,750.00',
          after: '$2,750.00 (Neutral)',
        },
      ],
      impactSummary: `Preserves envelope balance without increasing overall spending limit.`,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    onOpenProposal(proposal);
  };

  return (
    <div className="space-y-3.5 max-w-7xl mx-auto text-slate-100 font-sans">
      {/* 1. Compact Macro 50/30/20 Bar (High-Density) */}
      <div className="p-3.5 rounded-2xl bg-black/25 border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Macro Allocation Health: 50 / 30 / 20 Framework</span>
          </div>
          <button
            onClick={() => setShowRebalancePanel(!showRebalancePanel)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-[11px] transition cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span>{showRebalancePanel ? 'Hide Rebalance' : 'Quick Rebalance'}</span>
          </button>
        </div>

        {/* 3 Macro Cards in single compact row */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          {envelope503020.map((env) => {
            const isCompliant =
              env.envelope === 'Needs'
                ? env.actualPercent <= env.targetPercent
                : env.envelope === 'Wants'
                ? env.actualPercent <= env.targetPercent
                : env.actualPercent >= env.targetPercent;

            return (
              <div
                key={env.envelope}
                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px]">{env.envelope}</span>
                  <span className="text-[10px] text-slate-400">Target {env.targetPercent}%</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold font-mono text-emerald-300">
                    {env.actualPercent}%
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {formatCurrency(env.actualSpent)} / {formatCurrency(env.allocated)}
                  </span>
                </div>
                <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isCompliant ? 'bg-emerald-400' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, (env.actualPercent / env.targetPercent) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Optional Quick Rebalance Inline Console */}
      {showRebalancePanel && (
        <form
          onSubmit={handleProposeReallocation}
          className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex flex-wrap items-center gap-2 text-xs animate-fadeIn"
        >
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 shrink-0">
            <Sliders className="w-3.5 h-3.5" />
            <span>Rebalance:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-1 min-w-[240px]">
            <select
              value={fromCategory}
              onChange={(e) => setFromCategory(e.target.value as TransactionCategory)}
              className="px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:outline-none flex-1"
            >
              {summaries.map((s) => (
                <option key={s.category} value={s.category}>
                  From {s.category} ({formatCurrency(s.remaining)} left)
                </option>
              ))}
            </select>

            <span className="text-slate-400 shrink-0">→</span>

            <select
              value={toCategory}
              onChange={(e) => setToCategory(e.target.value as TransactionCategory)}
              className="px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs focus:outline-none flex-1"
            >
              {summaries.map((s) => (
                <option key={s.category} value={s.category}>
                  To {s.category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-slate-400 text-xs">$</span>
            <input
              type="number"
              value={reallocateAmount}
              onChange={(e) => setReallocateAmount(e.target.value)}
              className="w-16 px-2 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs font-mono text-center"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Propose
            </button>
          </div>
        </form>
      )}

      {/* 3. Minimized Category Envelopes Grid (High-Density, Minimal Scrolling) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {summaries.map((summary) => {
          const isOver = summary.percentageUsed > 100;
          const isWarning = summary.percentageUsed > 85 && !isOver;

          return (
            <div
              key={summary.category}
              className="p-3 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between space-y-2 hover:border-white/20 transition"
            >
              {/* Top: Category & % */}
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate" title={summary.category}>
                    {summary.category}
                  </div>
                  <div className="text-[10px] text-slate-400">{summary.envelope}</div>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                    isOver
                      ? 'bg-rose-500/20 text-rose-300'
                      : isWarning
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}
                >
                  {summary.percentageUsed}%
                </span>
              </div>

              {/* Middle: Progress Bar */}
              <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, summary.percentageUsed)}%` }}
                />
              </div>

              {/* Bottom: Spent vs Cap */}
              <div className="flex items-baseline justify-between text-[11px] font-mono">
                <span className="text-white font-bold">{formatCurrency(summary.spent)}</span>
                <span className="text-slate-400 text-[10px]">/ {formatCurrency(summary.allocated)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
