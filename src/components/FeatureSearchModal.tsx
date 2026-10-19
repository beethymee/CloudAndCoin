import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Layers,
  Calendar,
  PieChart,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Send,
  PlusCircle,
  Camera,
  Heart,
  Palette,
  KeyRound,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  category: 'Workspace' | 'Actions' | 'Tools' | 'Preferences';
  icon: React.ElementType;
  badge?: string;
  action: () => void;
}

interface FeatureSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenQuickAdd: () => void;
  onOpenSendMoney: () => void;
  onOpenReceiptScan: () => void;
  onOpenWellbeing: () => void;
  onOpenThemeSettings: () => void;
}

export const FeatureSearchModal: React.FC<FeatureSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenQuickAdd,
  onOpenSendMoney,
  onOpenReceiptScan,
  onOpenWellbeing,
  onOpenThemeSettings,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const features: FeatureItem[] = useMemo(
    () => [
      {
        id: 'budgets',
        title: 'Smart Envelope Budgets',
        description: 'Adaptive 50/30/20 caps, real-time burn pacing & surplus rebalancing',
        category: 'Workspace',
        icon: Layers,
        badge: 'Core',
        action: () => {
          onNavigateTab('budgeting');
          onClose();
        },
      },
      {
        id: 'bills',
        title: 'Bills & Subscriptions Calendar',
        description: 'Sequenced due dates, overdue alert protection & recurring audit',
        category: 'Workspace',
        icon: Calendar,
        badge: '1 Overdue',
        action: () => {
          onNavigateTab('bills');
          onClose();
        },
      },
      {
        id: 'analytics',
        title: 'Spending Velocity & Insights',
        description: 'Category breakdowns, merchant analytics & cash flow optimization',
        category: 'Workspace',
        icon: PieChart,
        action: () => {
          onNavigateTab('insights');
          onClose();
        },
      },
      {
        id: 'copilot',
        title: 'AI Financial Participant / Coach Chat',
        description: 'Safe autonomous insights with Tier-2 human authorization for write operations',
        category: 'Tools',
        icon: MessageSquare,
        badge: 'Tier-2 Guard',
        action: () => {
          onNavigateTab('copilot');
          onClose();
        },
      },
      {
        id: 'security',
        title: 'Security Audit & Policy Governance',
        description: 'SHA-256 cryptographic transaction trail, injection defense & access logs',
        category: 'Workspace',
        icon: ShieldCheck,
        badge: 'Zero-Trust',
        action: () => {
          onNavigateTab('security');
          onClose();
        },
      },
      {
        id: 'accounts',
        title: 'Virtual NeoCard & Vaults',
        description: 'Primary checking, high-yield emergency reserve & credit card float',
        category: 'Workspace',
        icon: CreditCard,
        action: () => {
          onNavigateTab('dashboard');
          onClose();
        },
      },
      {
        id: 'quick_add',
        title: 'Quick Add Transaction / Expense',
        description: 'Log immediate expense or incoming income to any connected account',
        category: 'Actions',
        icon: PlusCircle,
        action: () => {
          onOpenQuickAdd();
          onClose();
        },
      },
      {
        id: 'send_money',
        title: 'Transfer Funds / Send Money',
        description: 'Instant float optimization and internal/external account transfers',
        category: 'Actions',
        icon: Send,
        action: () => {
          onOpenSendMoney();
          onClose();
        },
      },
      {
        id: 'receipt_scan',
        title: 'Receipt Camera & OCR Scanner',
        description: 'Scan physical paper receipts to auto-extract amount, vendor & envelope',
        category: 'Actions',
        icon: Camera,
        badge: 'AI Vision',
        action: () => {
          onOpenReceiptScan();
          onClose();
        },
      },
      {
        id: 'wellbeing',
        title: 'Mindful Financial Wellbeing Check-In',
        description: '30-second mindfulness check-in to reduce money anxiety and build calm habits',
        category: 'Tools',
        icon: Heart,
        action: () => {
          onOpenWellbeing();
          onClose();
        },
      },
      {
        id: 'settings_theme',
        title: 'Atmospheric Themes & Appearance',
        description: 'Ivory Daylight, Serene Forest, Obsidian Vault, Nordic Glacier, Sunset & Amber',
        category: 'Preferences',
        icon: Palette,
        action: () => {
          onOpenThemeSettings();
          onClose();
        },
      },
      {
        id: 'settings_profile',
        title: 'User Profile & Security Password',
        description: 'Update name, date of birth, profession, workspace PIN & logout',
        category: 'Preferences',
        icon: KeyRound,
        action: () => {
          onOpenThemeSettings();
          onClose();
        },
      },
    ],
    [
      onNavigateTab,
      onOpenQuickAdd,
      onOpenSendMoney,
      onOpenReceiptScan,
      onOpenWellbeing,
      onOpenThemeSettings,
      onClose,
    ]
  );

  const filteredFeatures = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return features;
    return features.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [features, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#0A120E] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        style={{ backgroundColor: 'var(--theme-surface-solid, #0A120E)' }}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search features (e.g. Budget, Bills, Transfer, Receipt, Theme)..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-400 hover:text-white font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-1.5 max-h-[55vh]">
          {filteredFeatures.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching financial features found for &quot;{query}&quot;
            </div>
          ) : (
            filteredFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  onClick={f.action}
                  className="w-full p-3 rounded-xl border border-transparent hover:border-emerald-500/30 hover:bg-emerald-500/10 flex items-center justify-between text-left transition group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                          {f.title}
                        </span>
                        {f.badge && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {f.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider hidden sm:inline">
                          {f.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {f.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-black/40 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Quick 1-click jump to any feature</span>
          <span className="font-mono text-emerald-400">{filteredFeatures.length} available</span>
        </div>
      </div>
    </div>
  );
};
