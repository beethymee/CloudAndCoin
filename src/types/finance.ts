export type TransactionCategory =
  | 'Housing'
  | 'Utilities'
  | 'Groceries'
  | 'Dining & Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Health & Fitness'
  | 'Income'
  | 'Investments'
  | 'Subscriptions'
  | 'Personal Care';

export type BudgetEnvelope = 'Needs' | 'Wants' | 'Savings';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  amount: number; // positive = income, negative = expense
  category: TransactionCategory;
  accountId: string;
  accountName: string;
  status: 'cleared' | 'pending';
  isRecurring?: boolean;
}

export interface Bill {
  id: string;
  name: string;
  category: TransactionCategory;
  amount: number;
  dueDate: string; // ISO format YYYY-MM-DD
  frequency: 'monthly' | 'yearly' | 'weekly';
  status: 'paid' | 'unpaid' | 'overdue';
  autopay: boolean;
  billerName: string;
  accountId: string;
  lastPaidDate?: string;
}

export interface Budget {
  id: string;
  category: TransactionCategory;
  envelope: BudgetEnvelope;
  allocatedAmount: number;
  period: string; // e.g. "2026-10"
  warningThreshold: number; // 0.85 = 85%
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  accountNumberMasked: string;
  institution: string;
}

export type PermissionTier = 1 | 2 | 3;

export interface ActionProposal {
  id: string;
  type: 'UPDATE_BUDGET' | 'PAY_BILL' | 'TRANSFER_FUNDS' | 'CANCEL_SUBSCRIPTION';
  title: string;
  description: string;
  tier: PermissionTier;
  payload: Record<string, any>;
  diff: {
    field: string;
    before: string | number;
    after: string | number;
  }[];
  impactSummary: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'READ' | 'PROPOSAL' | 'EXECUTE' | 'SECURITY_BLOCK' | 'REJECT';
  tier: PermissionTier;
  details: string;
  actor: 'AI_AGENT' | 'USER_CONFIRMED' | 'SECURITY_GUARD';
  status: 'SUCCESS' | 'BLOCKED' | 'PENDING_APPROVAL';
  hash: string;
}

export interface FinancialHealthScore {
  overall: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  breakdown: {
    savingsRate: number; // score 0-100
    budgetDiscipline: number;
    debtRatio: number;
    billPunctuality: number;
    emergencyBuffer: number;
  };
  metrics: {
    monthlyIncome: number;
    monthlyExpenses: number;
    netSavings: number;
    savingsRatePercent: number;
    emergencyMonthsCovered: number;
  };
  strengths: string[];
  improvements: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'SAVINGS' | 'BUDGET' | 'BILL' | 'INVESTMENT';
  estimatedMonthlySavings: number;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  promptAction: string;
  completed?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolInvocations?: {
    toolName: string;
    tier: PermissionTier;
    args: Record<string, any>;
    result?: string;
  }[];
  proposal?: ActionProposal;
  securityAlert?: {
    type: 'INJECTION_ATTEMPT' | 'PERMISSION_DENIAL' | 'ANOMALY';
    reason: string;
    level: 'CRITICAL' | 'WARNING';
  };
}
