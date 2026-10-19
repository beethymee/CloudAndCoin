import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  AlertCircle,
  CheckCircle2,
  Clock,
  Tv,
  ArrowRight,
  ShieldCheck,
  Receipt,
  FileText,
  Zap,
} from 'lucide-react';
import { Bill, Account, ActionProposal } from '../types/finance';
import { formatCurrency } from '../services/financeEngine';

interface BillsManagerProps {
  bills: Bill[];
  accounts: Account[];
  onOpenProposal: (proposal: ActionProposal) => void;
}

export const BillsManager: React.FC<BillsManagerProps> = ({
  bills,
  accounts,
  onOpenProposal,
}) => {
  const [filter, setFilter] = useState<'all' | 'unpaid' | 'overdue' | 'paid'>('all');

  const filteredBills = bills.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const unpaidSum = bills
    .filter((b) => b.status === 'unpaid' || b.status === 'overdue')
    .reduce((sum, b) => sum + b.amount, 0);

  const overdueBills = bills.filter((b) => b.status === 'overdue');

  const subscriptions = bills.filter(
    (b) => b.category === 'Subscriptions' || b.name.includes('Gym') || b.name.includes('Broadband')
  );
  const monthlySubTotal = subscriptions.reduce((sum, s) => sum + s.amount, 0);
  const annualSubTotal = monthlySubTotal * 12;

  const handlePayBill = (bill: Bill) => {
    const checkingAcc = accounts.find((a) => a.type === 'checking') || accounts[0];

    const proposal: ActionProposal = {
      id: `prop_pay_${bill.id}_${Date.now()}`,
      type: 'PAY_BILL',
      title: `Authorize Settlement: ${bill.name} (${formatCurrency(bill.amount)})`,
      description: `Disburse ${formatCurrency(bill.amount)} to ${bill.billerName} from ${checkingAcc.name} (${checkingAcc.accountNumberMasked}).`,
      tier: 2,
      payload: {
        billId: bill.id,
        amount: bill.amount,
        accountId: checkingAcc.id,
      },
      diff: [
        {
          field: `${bill.name} Status`,
          before: bill.status.toUpperCase(),
          after: 'PAID (SETTLED)',
        },
        {
          field: `${checkingAcc.name} Balance`,
          before: formatCurrency(checkingAcc.balance),
          after: formatCurrency(checkingAcc.balance - bill.amount),
        },
      ],
      impactSummary: 'Eliminates delinquency risk, preserves credit rating, and prevents $15 late fee.',
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    onOpenProposal(proposal);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 space-y-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CalendarIcon className="w-4 h-4" />
          </span>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Obligations Radar
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Bills &amp; Recurring Subscriptions
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Predictive due-date tracking, subscription creep audits, and safe human-verified Tier-2 bill pay workflows.
        </p>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Outstanding */}
        <div className="glass-card rounded-xl p-5 space-y-2">
          <span className="text-xs text-slate-400 block font-medium">Outstanding Obligations</span>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {formatCurrency(unpaidSum)}
          </div>
          <span className="text-xs text-slate-500">Upcoming due this month</span>
        </div>

        {/* Overdue Alerts */}
        <div className={`glass-card rounded-xl p-5 space-y-2 border ${overdueBills.length > 0 ? 'border-rose-500/30' : 'border-white/10'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Overdue Invoices</span>
            {overdueBills.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
          </div>
          <div className={`text-2xl font-bold font-mono tabular-nums ${overdueBills.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {overdueBills.length} Bill{overdueBills.length === 1 ? '' : 's'}
          </div>
          <span className="text-xs text-slate-500">
            {overdueBills.length > 0 ? 'Late penalties accruing' : 'All accounts in good standing'}
          </span>
        </div>

        {/* Subscription Total */}
        <div className="glass-card rounded-xl p-5 space-y-2">
          <span className="text-xs text-slate-400 block font-medium">Subscription Burn</span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {formatCurrency(monthlySubTotal)}/mo
          </div>
          <span className="text-xs text-slate-500">
            {formatCurrency(annualSubTotal)} projected annually
          </span>
        </div>
      </div>

      {/* Interactive Bill Registry */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <h3 className="font-bold text-white text-base">
            Upcoming Bills &amp; Payment Schedule
          </h3>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.08] text-xs">
            {(['all', 'unpaid', 'overdue', 'paid'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1 rounded font-medium transition cursor-pointer capitalize ${
                  filter === st
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Bill Rows */}
        <div className="space-y-3">
          {filteredBills.map((bill) => {
            const isOverdue = bill.status === 'overdue';
            const isPaid = bill.status === 'paid';

            return (
              <div
                key={bill.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-white/5 text-slate-300">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{bill.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          isPaid
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : isOverdue
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {bill.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Biller: {bill.billerName} &bull; Due: <span className="font-mono">{bill.dueDate}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <span className="text-base font-bold font-mono text-white tabular-nums">
                    {formatCurrency(bill.amount)}
                  </span>

                  {!isPaid ? (
                    <button
                      onClick={() => handlePayBill(bill)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border shadow-sm ${
                        isOverdue
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      Pay Bill (Tier 2)
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription Creep Audit Spotlight */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-white text-base">
              Subscription Creep Audit &amp; Optimization
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {subscriptions.length} Active Recurring Services
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          FinTrack detects recurring merchant debits and flags underutilized services to maximize your monthly savings velocity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
            >
              <div>
                <span className="text-sm font-semibold text-white block">{sub.name}</span>
                <span className="text-xs text-slate-400">Monthly billing &bull; Category: {sub.category}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold font-mono text-cyan-400 block tabular-nums">
                  {formatCurrency(sub.amount)}/mo
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {formatCurrency(sub.amount * 12)}/yr
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
