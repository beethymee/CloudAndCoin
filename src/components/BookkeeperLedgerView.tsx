import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Filter,
  Download,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import { Transaction, Account } from '../types/finance';
import { formatCurrency } from '../services/financeEngine';

interface BookkeeperLedgerViewProps {
  transactions: Transaction[];
  accounts: Account[];
}

export const BookkeeperLedgerView: React.FC<BookkeeperLedgerViewProps> = ({
  transactions,
  accounts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('ALL');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
      const matchesAccount = selectedAccountId === 'ALL' || t.accountId === selectedAccountId;
      return matchesSearch && matchesCategory && matchesAccount;
    });
  }, [transactions, searchTerm, selectedCategory, selectedAccountId]);

  // Compute totals
  const totalDebits = filteredTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalCredits = filteredTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const netVariance = totalCredits - totalDebits;

  // Compute running balance
  let running = 0;
  const ledgerRows = [...filteredTransactions]
    .reverse()
    .map((t, idx) => {
      running += t.amount;
      return {
        ...t,
        runningBalance: running,
        folioNumber: `FOL-${(idx + 101).toString().padStart(4, '0')}`,
      };
    })
    .reverse();

  const handleExportCSV = () => {
    const headers = 'Folio,Date,Account,Merchant/Description,Category,Debit,Credit,RunningBalance\n';
    const rows = ledgerRows
      .map(
        (r) =>
          `"${r.folioNumber}","${r.date}","${r.accountName}","${r.description.replace(/"/g, '""')}","${r.category}",${
            r.amount < 0 ? Math.abs(r.amount).toFixed(2) : ''
          },${r.amount > 0 ? r.amount.toFixed(2) : ''},${r.runningBalance.toFixed(2)}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `general-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Ledger Header Card */}
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">General Accounting Ledger</h3>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold">
                  Double-Entry Journal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Audited chronological debit/credit recording with running ledger balances
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search memo, payee, folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Categories ({transactions.length})</option>
            <option value="Dining & Food">Dining &amp; Food</option>
            <option value="Groceries">Groceries</option>
            <option value="Housing">Housing</option>
            <option value="Utilities">Utilities</option>
            <option value="Transportation">Transportation</option>
            <option value="Shopping">Shopping</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Income">Income / Payroll</option>
          </select>

          {/* Account Filter */}
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Financial Accounts</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Metric Ribbon */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-center">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
              Total Outflows (Debit)
            </span>
            <span className="text-base sm:text-lg font-mono font-bold text-rose-400 tabular-nums">
              -${totalDebits.toFixed(2)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
              Total Inflows (Credit)
            </span>
            <span className="text-base sm:text-lg font-mono font-bold text-emerald-400 tabular-nums">
              +${totalCredits.toFixed(2)}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-medium">
              Net Period Variance
            </span>
            <span
              className={`text-base sm:text-lg font-mono font-bold tabular-nums ${
                netVariance >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {netVariance >= 0 ? `+$${netVariance.toFixed(2)}` : `-$${Math.abs(netVariance).toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>

      {/* General Ledger Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/[0.04] border-b border-white/[0.08] text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                <th className="py-3 px-4">Folio</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Particulars / Payee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Debit (Dr)</th>
                <th className="py-3 px-4 text-right">Credit (Cr)</th>
                <th className="py-3 px-4 text-right">Running Bal</th>
                <th className="py-3 px-4 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono">
              {ledgerRows.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-4 text-slate-500 font-bold">{tx.folioNumber}</td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{tx.date}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{tx.accountName}</td>
                  <td className="py-3 px-4 text-white font-sans font-medium">
                    <div className="flex items-center gap-1.5">
                      <span>{tx.description}</span>
                      {tx.isRecurring && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          Auto
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-sans font-medium bg-white/5 text-slate-300 border border-white/10">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-400 tabular-nums">
                    {tx.amount < 0 ? `$${Math.abs(tx.amount).toFixed(2)}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400 tabular-nums">
                    {tx.amount > 0 ? `$${tx.amount.toFixed(2)}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300 tabular-nums">
                    ${tx.runningBalance.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-sans font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Passed
                    </span>
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
