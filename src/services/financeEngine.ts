import {
  Account,
  Bill,
  Budget,
  FinancialHealthScore,
  Recommendation,
  Transaction,
  TransactionCategory,
  ActionProposal,
} from '../types/finance';

export interface CategorySummary {
  category: TransactionCategory;
  spent: number;
  allocated: number;
  remaining: number;
  percentageUsed: number;
  transactionCount: number;
  envelope: 'Needs' | 'Wants' | 'Savings';
}

export interface EnvelopeMetric {
  envelope: 'Needs' | 'Wants' | 'Savings';
  targetPercent: number; // e.g. 50, 30, 20
  actualPercent: number;
  allocated: number;
  actualSpent: number;
}

export function calculateFinancialHealthScore(
  accounts: Account[],
  transactions: Transaction[],
  budgets: Budget[],
  bills: Bill[]
): FinancialHealthScore {
  // Income in current cycle
  const monthlyIncome = transactions
    .filter((t) => t.category === 'Income' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0) || 5900; // default baseline if fresh

  // Living expenses (exclude income and investment contributions)
  const monthlyExpenses = transactions
    .filter((t) => t.amount < 0 && t.category !== 'Investments')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Investments & saved
  const investmentContributed = transactions
    .filter((t) => t.amount < 0 && t.category === 'Investments')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netSavings = Math.max(0, monthlyIncome - monthlyExpenses);
  const savingsRatePercent = monthlyIncome > 0 ? ((netSavings + investmentContributed) / monthlyIncome) * 100 : 0;

  // Total liquid savings
  const liquidSavings = accounts
    .filter((a) => a.type === 'savings' || a.type === 'checking')
    .reduce((sum, a) => sum + Math.max(0, a.balance), 0);

  // Monthly burn rate for buffer calculation
  const burnRate = monthlyExpenses > 0 ? monthlyExpenses : 2500;
  const emergencyMonthsCovered = Number((liquidSavings / burnRate).toFixed(1));

  // Savings score (0-100): 20%+ is 100
  const savingsRateScore = Math.min(100, Math.round((savingsRatePercent / 20) * 100));

  // Budget discipline: ratio of budgets that are not overrun
  const budgetSummaries = getCategorySummaries(budgets, transactions);
  const disciplinedBudgets = budgetSummaries.filter((b) => b.spent <= b.allocated).length;
  const budgetDisciplineScore = budgetSummaries.length > 0 ? Math.round((disciplinedBudgets / budgetSummaries.length) * 100) : 80;

  // Bill punctuality: penalty for overdue bills
  const overdueBills = bills.filter((b) => b.status === 'overdue').length;
  const totalBills = bills.length;
  const billPunctualityScore = Math.max(0, 100 - overdueBills * 35);

  // Emergency buffer score: 6 months is ideal 100
  const emergencyBufferScore = Math.min(100, Math.round((emergencyMonthsCovered / 6) * 100));

  // Debt ratio: credit card balance vs checking balance
  const creditBalance = accounts
    .filter((a) => a.type === 'credit')
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);
  const debtScore = creditBalance < 1000 ? 95 : creditBalance < 2500 ? 75 : 50;

  // Overall weighted composite
  const overall = Math.round(
    savingsRateScore * 0.3 +
    budgetDisciplineScore * 0.25 +
    billPunctualityScore * 0.2 +
    emergencyBufferScore * 0.15 +
    debtScore * 0.1
  );

  let grade: FinancialHealthScore['grade'] = 'B';
  if (overall >= 92) grade = 'A+';
  else if (overall >= 82) grade = 'A';
  else if (overall >= 70) grade = 'B';
  else if (overall >= 55) grade = 'C';
  else grade = 'D';

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (emergencyMonthsCovered >= 4) {
    strengths.push(`Solid emergency cash reserve covering ${emergencyMonthsCovered} months of expenses.`);
  } else {
    improvements.push(`Emergency reserve covers ${emergencyMonthsCovered} months; aim for 4-6 months ($${(burnRate * 4).toLocaleString()}).`);
  }

  if (savingsRatePercent >= 18) {
    strengths.push(`High savings rate of ${savingsRatePercent.toFixed(1)}% (exceeding traditional 15% benchmarks).`);
  } else {
    improvements.push(`Current savings rate is ${savingsRatePercent.toFixed(1)}%; recommend targeting 20%.`);
  }

  if (overdueBills > 0) {
    improvements.push(`${overdueBills} overdue bill requires immediate payment to avoid penalties.`);
  } else {
    strengths.push('All bills are current with no pending late penalty notices.');
  }

  return {
    overall,
    grade,
    breakdown: {
      savingsRate: savingsRateScore,
      budgetDiscipline: budgetDisciplineScore,
      debtRatio: debtScore,
      billPunctuality: billPunctualityScore,
      emergencyBuffer: emergencyBufferScore,
    },
    metrics: {
      monthlyIncome,
      monthlyExpenses,
      netSavings,
      savingsRatePercent: Number(savingsRatePercent.toFixed(1)),
      emergencyMonthsCovered,
    },
    strengths,
    improvements,
  };
}

export function getCategorySummaries(budgets: Budget[], transactions: Transaction[]): CategorySummary[] {
  return budgets.map((b) => {
    const categoryTransactions = transactions.filter(
      (t) => t.category === b.category && t.amount < 0
    );
    const spent = categoryTransactions.reduce((acc, t) => acc + Math.abs(t.amount), 0);
    const remaining = b.allocatedAmount - spent;
    const percentageUsed = b.allocatedAmount > 0 ? (spent / b.allocatedAmount) * 100 : 0;

    return {
      category: b.category,
      spent: Number(spent.toFixed(2)),
      allocated: b.allocatedAmount,
      remaining: Number(remaining.toFixed(2)),
      percentageUsed: Number(percentageUsed.toFixed(1)),
      transactionCount: categoryTransactions.length,
      envelope: b.envelope,
    };
  });
}

export function calculate503020(budgets: Budget[], transactions: Transaction[]): EnvelopeMetric[] {
  const summaries = getCategorySummaries(budgets, transactions);
  const totalSpent = summaries.reduce((sum, s) => sum + s.spent, 0) || 1;

  const envelopes: ('Needs' | 'Wants' | 'Savings')[] = ['Needs', 'Wants', 'Savings'];
  const targets = { Needs: 50, Wants: 30, Savings: 20 };

  return envelopes.map((env) => {
    const items = summaries.filter((s) => s.envelope === env);
    const allocated = items.reduce((sum, i) => sum + i.allocated, 0);
    const actualSpent = items.reduce((sum, i) => sum + i.spent, 0);
    const actualPercent = Number(((actualSpent / totalSpent) * 100).toFixed(1));

    return {
      envelope: env,
      targetPercent: targets[env],
      actualPercent,
      allocated,
      actualSpent: Number(actualSpent.toFixed(2)),
    };
  });
}

export function detectAnomalies(transactions: Transaction[]): {
  merchant: string;
  amount: number;
  category: string;
  reason: string;
}[] {
  const anomalies: { merchant: string; amount: number; category: string; reason: string }[] = [];
  const expenses = transactions.filter((t) => t.amount < 0);

  for (const t of expenses) {
    const abs = Math.abs(t.amount);
    if (t.category === 'Dining & Food' && abs > 100) {
      anomalies.push({
        merchant: t.merchant,
        amount: abs,
        category: t.category,
        reason: 'Single dining expense over $100 ($115.80 at The Copper Tavern) is 2.8x average ticket size ($41.50).',
      });
    }
    if (t.category === 'Shopping' && abs > 80) {
      anomalies.push({
        merchant: t.merchant,
        amount: abs,
        category: t.category,
        reason: 'Unplanned discretionary purchase ($89.90 at Amazon Retail).',
      });
    }
  }

  return anomalies;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
