import React, { useState, useMemo, useEffect } from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { ChatAssistant } from './components/ChatAssistant';
import { SmartBudgeting } from './components/SmartBudgeting';
import { BillsManager } from './components/BillsManager';
import { SpendingInsights } from './components/SpendingInsights';
import { SecurityAuditView } from './components/SecurityAuditView';
import { ProposalModal } from './components/ProposalModal';
import { CompetitionModal } from './components/CompetitionModal';
import { ApkInstallModal } from './components/ApkInstallModal';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { WelcomingPage } from './components/WelcomingPage';
import { MainWorkspace } from './components/MainWorkspace';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { WellbeingCheckInModal } from './components/WellbeingCheckInModal';
import { FeatureSearchModal } from './components/FeatureSearchModal';
import { WorkspacePasswordModal } from './components/WorkspacePasswordModal';
import { QuickAddExpenseModal } from './components/QuickAddExpenseModal';
import { SendMoneyModal } from './components/SendMoneyModal';
import { ReceiptScanModal } from './components/ReceiptScanModal';
import { UserPreferences } from './types/theme';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BILLS,
  INITIAL_BUDGETS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
} from './data/mockFinanceData';
import {
  Account,
  ActionProposal,
  AuditLogEntry,
  Bill,
  Budget,
  ChatMessage,
  Recommendation,
  Transaction,
  TransactionCategory,
} from './types/finance';
import { calculateFinancialHealthScore } from './services/financeEngine';
import { createAuditLog } from './services/securityGuard';
import { sendChatMessage } from './services/aiService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('welcome');
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  const [activeProposal, setActiveProposal] = useState<ActionProposal | null>(null);
  const [isCompetitionModalOpen, setIsCompetitionModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isWellbeingModalOpen, setIsWellbeingModalOpen] = useState(false);
  const [isFeatureSearchOpen, setIsFeatureSearchOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isWorkspaceUnlocked, setIsWorkspaceUnlocked] = useState(false);
  const [pendingTabTarget, setPendingTabTarget] = useState<string | null>(null);

  // Quick Action Modals
  const [isGlobalQuickAddOpen, setIsGlobalQuickAddOpen] = useState(false);
  const [isGlobalSendMoneyOpen, setIsGlobalSendMoneyOpen] = useState(false);
  const [isGlobalReceiptScanOpen, setIsGlobalReceiptScanOpen] = useState(false);

  const [isMobileFrameActive, setIsMobileFrameActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // User theme and personalization preferences
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    try {
      const saved = localStorage.getItem('fintrack_preferences');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      theme: 'forest', // Serene Forest theme directly inspired by user's reference image!
      userName: 'Catherine', // User's name
      dateOfBirth: '1998-05-14',
      job: 'Financial Analyst',
      workspacePassword: '1234',
      greetingStyle: 'serene',
      timeFormat: '12h',
      showSceneryAnimation: true,
      currencySymbol: '$',
    };
  });

  // Sync theme changes to html data-theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', preferences.theme);
    try {
      localStorage.setItem('fintrack_preferences', JSON.stringify(preferences));
    } catch {}
  }, [preferences]);

  // Keyboard shortcut: Cmd+K / Ctrl+K opens Feature Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsFeatureSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleUpdatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  // Safe navigation with password protection
  const handleSafeNavigate = (targetTab: string) => {
    if (targetTab === 'welcome') {
      setActiveTab('welcome');
      return;
    }
    if (!isWorkspaceUnlocked) {
      setPendingTabTarget(targetTab);
      setIsPasswordModalOpen(true);
      return;
    }
    setActiveTab(targetTab);
  };

  const handlePasswordSuccess = () => {
    setIsWorkspaceUnlocked(true);
    setIsPasswordModalOpen(false);
    const destination = pendingTabTarget || 'dashboard';
    setActiveTab(destination);
    setPendingTabTarget(null);
  };

  const handleLogout = () => {
    setIsWorkspaceUnlocked(false);
    setActiveTab('welcome');
    addAuditLog(
      createAuditLog(
        'USER_LOGOUT',
        'EXECUTE',
        1,
        'User logged out and locked financial workspace.',
        'USER_CONFIRMED',
        'SUCCESS'
      )
    );
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `👋 **Hello! I am FinTrack AI**, your intelligent Financial Participant built for **FinTechathon 2026 (Topic A: Personal Finance Assistant)**.

I monitor your cash flow, optimize envelope budgets, track upcoming bills, and provide actionable financial recommendations.

🛡️ **Security Policy Active (Tier 1 & Tier 2):**
- Safe queries & insights are calculated autonomously.
- Any budget changes, bill payments, or fund transfers **require your explicit review and sign-off** before execution.

Try asking:
- *"Analyze my dining spending and adjust my budget"*
- *"Prepare a proposal to pay my overdue water bill"*
- *"Audit all recurring subscriptions for savings"*
- *"How can I optimize the idle cash in my checking account?"*`,
      timestamp: new Date().toISOString(),
    },
  ]);

  // Reactive financial health score
  const healthScore = useMemo(() => {
    return calculateFinancialHealthScore(accounts, transactions, budgets, bills);
  }, [accounts, transactions, budgets, bills]);

  const addAuditLog = (log: AuditLogEntry) => {
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Chat message sender
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const diningBudget = budgets.find((b) => b.category === 'Dining & Food');
    const diningSpent = transactions
      .filter((t) => t.category === 'Dining & Food' && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const financialContext = {
      totalBalance: accounts.reduce((sum, a) => sum + a.balance, 0),
      monthlyIncome: healthScore.metrics.monthlyIncome,
      monthlyExpenses: healthScore.metrics.monthlyExpenses,
      healthScore: healthScore.overall,
      overdueBillsCount: bills.filter((b) => b.status === 'overdue').length,
      topExpenseCategory: 'Housing',
      diningSpent,
      diningAllocated: diningBudget ? diningBudget.allocatedAmount : 400,
      accounts,
      budgets,
      bills,
    };

    try {
      const response = await sendChatMessage({
        userMessage: text,
        history: messages,
        financialContext,
        onAuditLog: addAuditLog,
      });

      const assistantMsg: ChatMessage = {
        id: `msg_ai_${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toISOString(),
        proposal: response.proposal,
        securityAlert: response.securityAlert,
        toolInvocations: response.toolInvocations,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Tier 2: Approve Action Proposal
  const handleApproveProposal = (proposal: ActionProposal) => {
    if (proposal.type === 'UPDATE_BUDGET') {
      const { fromCategory, toCategory, amount } = proposal.payload || {};
      if (fromCategory && toCategory && amount) {
        setBudgets((prev) =>
          prev.map((b) => {
            if (b.category === fromCategory) {
              return { ...b, allocatedAmount: Math.max(0, b.allocatedAmount - amount) };
            }
            if (b.category === toCategory) {
              return { ...b, allocatedAmount: b.allocatedAmount + amount };
            }
            return b;
          })
        );
      }
    } else if (proposal.type === 'PAY_BILL') {
      const { billId, amount, accountId } = proposal.payload || {};
      setBills((prev) =>
        prev.map((b) => {
          if (b.id === billId || (billId === undefined && b.status === 'overdue')) {
            return { ...b, status: 'paid', lastPaidDate: '2026-10-19' };
          }
          return b;
        })
      );
      if (accountId && amount) {
        setAccounts((prev) =>
          prev.map((a) => (a.id === accountId ? { ...a, balance: a.balance - amount } : a))
        );
      }
    } else if (proposal.type === 'TRANSFER_FUNDS') {
      const { fromAccount, toAccount, amount } = proposal.payload || {};
      if (fromAccount && toAccount && amount) {
        setAccounts((prev) =>
          prev.map((a) => {
            if (a.id === fromAccount) return { ...a, balance: a.balance - amount };
            if (a.id === toAccount) return { ...a, balance: a.balance + amount };
            return a;
          })
        );
      }
    }

    addAuditLog(
      createAuditLog(
        'PROPOSAL_APPROVED_BY_USER',
        'EXECUTE',
        2,
        `User confirmed Tier-2 execution: "${proposal.title}". System state committed.`,
        'USER_CONFIRMED',
        'SUCCESS'
      )
    );

    setMessages((prev) =>
      prev.map((m) => {
        if (m.proposal && m.proposal.id === proposal.id) {
          return {
            ...m,
            proposal: { ...m.proposal, status: 'APPROVED' },
          };
        }
        return m;
      })
    );

    setActiveProposal(null);
  };

  // Tier 2: Reject Action Proposal
  const handleRejectProposal = (proposal: ActionProposal) => {
    addAuditLog(
      createAuditLog(
        'PROPOSAL_REJECTED_BY_USER',
        'REJECT',
        2,
        `User declined Tier-2 action "${proposal.title}". No state modifications executed.`,
        'USER_CONFIRMED',
        'SUCCESS'
      )
    );

    setMessages((prev) =>
      prev.map((m) => {
        if (m.proposal && m.proposal.id === proposal.id) {
          return {
            ...m,
            proposal: { ...m.proposal, status: 'REJECTED' },
          };
        }
        return m;
      })
    );

    setActiveProposal(null);
  };

  // Sandbox transaction injection
  const handleSimulateTransaction = (
    desc: string,
    amount: number,
    category: TransactionCategory,
    accountId: string
  ) => {
    const acc = accounts.find((a) => a.id === accountId) || accounts[0];
    const newTx: Transaction = {
      id: `sim_tx_${Date.now()}`,
      date: '2026-10-19',
      description: desc,
      merchant: desc,
      amount,
      category,
      accountId: acc.id,
      accountName: acc.name,
      status: 'cleared',
    };

    setTransactions((prev) => [newTx, ...prev]);

    setAccounts((prev) =>
      prev.map((a) => (a.id === acc.id ? { ...a, balance: a.balance + amount } : a))
    );

    addAuditLog(
      createAuditLog(
        'SANDBOX_INJECT_TRANSACTION',
        'EXECUTE',
        1,
        `Simulated transaction: ${desc} ($${Math.abs(amount).toFixed(2)}) in ${category}.`,
        'USER_CONFIRMED',
        'SUCCESS'
      )
    );
  };

  // Reset sandbox data
  const handleResetData = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setBills(INITIAL_BILLS);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    addAuditLog(
      createAuditLog(
        'SANDBOX_DATA_RESET',
        'EXECUTE',
        3,
        'Sandbox database reset to default pristine state.',
        'USER_CONFIRMED',
        'SUCCESS'
      )
    );
  };

  const handleTriggerRecommendation = (prompt: string) => {
    handleSafeNavigate('copilot');
    handleSendMessage(prompt);
  };

  const handleInjectTestPrompt = (prompt: string) => {
    handleSafeNavigate('copilot');
    handleSendMessage(prompt);
  };

  const pendingProposalsCount = messages.filter(
    (m) => m.proposal && m.proposal.status === 'PENDING'
  ).length;

  const checkingAcc = accounts.find((a) => a.type === 'checking') || accounts[0];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Header - Upper buttons removed, search added beside settings */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSafeNavigate}
        healthScore={healthScore}
        onResetData={handleResetData}
        onOpenCompetitionModal={() => setIsCompetitionModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        onOpenThemeSettings={() => setIsThemeModalOpen(true)}
        onOpenFeatureSearch={() => setIsFeatureSearchOpen(true)}
        pendingProposalsCount={pendingProposalsCount}
        isMobileFrameActive={isMobileFrameActive}
        onToggleMobileFrame={() => setIsMobileFrameActive((prev) => !prev)}
        preferences={preferences}
      />

      {/* Main Single-Screen Content Area */}
      <MobileDeviceFrame
        activeTab={activeTab}
        setActiveTab={handleSafeNavigate}
        isMobileFrameActive={isMobileFrameActive}
        onToggleMobileFrame={() => setIsMobileFrameActive((prev) => !prev)}
      >
        <main className={`flex-1 ${isMobileFrameActive ? 'p-1.5' : 'p-2 sm:p-4'}`}>
          {activeTab === 'welcome' && (
            <WelcomingPage
              accounts={accounts}
              transactions={transactions}
              budgets={budgets}
              bills={bills}
              healthScore={healthScore}
              recommendations={recommendations}
              preferences={preferences}
              onOpenThemeSettings={() => setIsThemeModalOpen(true)}
              onOpenWellbeingCheckIn={() => setIsWellbeingModalOpen(true)}
              onOpenPasswordPrompt={() => {
                if (isWorkspaceUnlocked) {
                  setActiveTab('dashboard');
                } else {
                  setPendingTabTarget('dashboard');
                  setIsPasswordModalOpen(true);
                }
              }}
              onOpenProposal={setActiveProposal}
              onAskAgent={handleTriggerRecommendation}
            />
          )}

          {(activeTab === 'dashboard' || activeTab === 'overview') && (
            <MainWorkspace
              accounts={accounts}
              transactions={transactions}
              budgets={budgets}
              bills={bills}
              healthScore={healthScore}
              recommendations={recommendations}
              preferences={preferences}
              onOpenThemeSettings={() => setIsThemeModalOpen(true)}
              onOpenFeatureSearch={() => setIsFeatureSearchOpen(true)}
              onOpenWellbeingCheckIn={() => setIsWellbeingModalOpen(true)}
              onNavigateTab={handleSafeNavigate}
              onOpenProposal={setActiveProposal}
              onTriggerRecommendation={handleTriggerRecommendation}
              onSimulateTransaction={handleSimulateTransaction}
              pendingProposalsCount={pendingProposalsCount}
            />
          )}

          {activeTab === 'copilot' && (
            <div className="max-w-4xl mx-auto h-[calc(100vh-5.5rem)] flex flex-col">
              <ChatAssistant
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onApproveProposal={handleApproveProposal}
                onRejectProposal={handleRejectProposal}
              />
            </div>
          )}

          {activeTab === 'budgeting' && (
            <div className="max-w-7xl mx-auto">
              <SmartBudgeting
                budgets={budgets}
                transactions={transactions}
                onOpenProposal={setActiveProposal}
              />
            </div>
          )}

          {activeTab === 'bills' && (
            <div className="max-w-7xl mx-auto">
              <BillsManager
                bills={bills}
                accounts={accounts}
                onOpenProposal={setActiveProposal}
              />
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="max-w-7xl mx-auto">
              <SpendingInsights transactions={transactions} />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-7xl mx-auto">
              <SecurityAuditView
                auditLogs={auditLogs}
                onInjectTestPrompt={handleInjectTestPrompt}
              />
            </div>
          )}
        </main>
      </MobileDeviceFrame>

      {/* Floating Center Scan Receipt Camera Icon (Only on Inner Workspace Pages) */}
      {activeTab !== 'welcome' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsGlobalReceiptScanOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-2xl shadow-emerald-500/40 border-2 border-white/20 active:scale-95 transition-all cursor-pointer group"
            title="Scan Receipt & Auto-extract Expense"
          >
            <Camera className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
            <span>Scan Receipt</span>
          </button>
        </div>
      )}

      {/* Floating AI Copilot Chatbot Button (Only on Inner Workspace Pages) */}
      {activeTab !== 'welcome' && activeTab !== 'copilot' && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => handleSafeNavigate('copilot')}
            className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/50 border-2 border-white/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="Ask FinTrack AI Copilot"
          >
            <Sparkles className="w-6 h-6 text-slate-950 group-hover:rotate-45 transition-transform duration-300" />
            {pendingProposalsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] flex items-center justify-center border-2 border-[#07090E] animate-bounce">
                {pendingProposalsCount}
              </span>
            )}
            <span className="sr-only">Open Copilot</span>
          </button>
        </div>
      )}

      {/* Feature Quick Search Modal (Search Beside Settings) */}
      <FeatureSearchModal
        isOpen={isFeatureSearchOpen}
        onClose={() => setIsFeatureSearchOpen(false)}
        onNavigateTab={handleSafeNavigate}
        onOpenQuickAdd={() => setIsGlobalQuickAddOpen(true)}
        onOpenSendMoney={() => setIsGlobalSendMoneyOpen(true)}
        onOpenReceiptScan={() => setIsGlobalReceiptScanOpen(true)}
        onOpenWellbeing={() => setIsWellbeingModalOpen(true)}
        onOpenThemeSettings={() => setIsThemeModalOpen(true)}
      />

      {/* Password Authentication Modal on Enter Workspace */}
      <WorkspacePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingTabTarget(null);
        }}
        onSuccess={handlePasswordSuccess}
        savedPassword={preferences.workspacePassword || '1234'}
      />

      {/* Proposal Review Modal for Tier 2 Actions */}
      <ProposalModal
        proposal={activeProposal}
        onApprove={handleApproveProposal}
        onReject={handleRejectProposal}
        onClose={() => setActiveProposal(null)}
      />

      {/* Global Quick Add Expense Modal */}
      <QuickAddExpenseModal
        isOpen={isGlobalQuickAddOpen}
        onClose={() => setIsGlobalQuickAddOpen(false)}
        onAddTransaction={(desc: string, amount: number, category: TransactionCategory, accountId: string) =>
          handleSimulateTransaction(desc, -amount, category, accountId)
        }
        accounts={accounts}
      />

      {/* Global Send Money / Transfer Modal */}
      <SendMoneyModal
        isOpen={isGlobalSendMoneyOpen}
        onClose={() => setIsGlobalSendMoneyOpen(false)}
        availableBalance={checkingAcc?.balance || 4328.45}
        onSend={(recipient: string, amount: number, note: string) =>
          handleSimulateTransaction(`Transfer to ${recipient}: ${note}`, -amount, 'Shopping', checkingAcc.id)
        }
      />

      {/* Global Receipt Scan OCR Modal */}
      <ReceiptScanModal
        isOpen={isGlobalReceiptScanOpen}
        onClose={() => setIsGlobalReceiptScanOpen(false)}
        onReceiptProcessed={(merchant, amount, category) =>
          handleSimulateTransaction(`Receipt: ${merchant}`, -amount, category, accounts[0].id)
        }
      />

      {/* FinTechathon Competition Modal */}
      <CompetitionModal
        isOpen={isCompetitionModalOpen}
        onClose={() => setIsCompetitionModalOpen(false)}
      />

      {/* Android APK Modal */}
      <ApkInstallModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Theme, Profile (Name, DOB, Job, PIN & Logout) Settings Modal */}
      <ThemeSettingsModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        onLogout={handleLogout}
      />

      {/* Mindful Financial Wellbeing Check-In Modal */}
      <WellbeingCheckInModal
        isOpen={isWellbeingModalOpen}
        onClose={() => setIsWellbeingModalOpen(false)}
        userName={preferences.userName}
        agentName="Agent Aria"
        onAskAgent={handleTriggerRecommendation}
      />
    </div>
  );
}
