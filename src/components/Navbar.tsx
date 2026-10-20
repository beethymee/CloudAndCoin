import React from 'react';
import {
  ShieldCheck,
  Search,
  Settings,
  Smartphone,
  Monitor,
  User,
} from 'lucide-react';
import { FinancialHealthScore } from '../types/finance';
import { UserPreferences, VECTOR_AVATARS } from '../types/theme';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  healthScore: FinancialHealthScore;
  onResetData: () => void;
  onOpenCompetitionModal: () => void;
  onOpenApkModal: () => void;
  onOpenThemeSettings: () => void;
  onOpenFeatureSearch: () => void;
  pendingProposalsCount: number;
  isMobileFrameActive?: boolean;
  onToggleMobileFrame?: () => void;
  preferences?: UserPreferences;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  healthScore,
  onResetData,
  onOpenCompetitionModal,
  pendingProposalsCount,
  onOpenApkModal,
  onOpenThemeSettings,
  onOpenFeatureSearch,
  isMobileFrameActive = false,
  onToggleMobileFrame,
  preferences,
}) => {
  const userName = preferences?.userName || 'Catherine';
  const userInitial = userName.charAt(0).toUpperCase() || 'C';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0A120E]/95 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16 gap-3">
        {/* Zone 1: Brand */}
        <div
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
          onClick={() => setActiveTab('welcome')}
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white font-serif">
              FIN: <span className="text-emerald-400 font-sans text-xs font-semibold">A Personal Finance Assistant</span>
            </span>
            <span className="text-[10px] text-slate-400 -mt-0.5 hidden sm:inline">
              Smart Budgeting & Financial Protection
            </span>
          </div>
        </div>

        {/* Zone 2: Beside Settings - Feature Search & Quick Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto">
          {/* Feature Search Option Directly Beside Settings */}
          <button
            onClick={onOpenFeatureSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.1] text-xs font-medium transition cursor-pointer group shadow-sm"
            title="Search all financial features (Budgets, Bills, Cards, Transfer, OCR...)"
          >
            <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-300 font-medium">Search features</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-mono rounded bg-black/40 text-slate-400 border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* Settings Button (Profile, DOB, Job, PIN & Themes) */}
          <button
            onClick={onOpenThemeSettings}
            title="Profile, Security PIN & Theme Settings"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white border border-white/[0.1] text-xs font-medium transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Smartphone Frame Toggle (if supported) */}
          {onToggleMobileFrame && (
            <button
              onClick={onToggleMobileFrame}
              title={isMobileFrameActive ? 'Full Screen View' : 'Smartphone Frame View'}
              className={`p-2 rounded-xl border transition cursor-pointer ${
                isMobileFrameActive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border-white/[0.08]'
              }`}
            >
              {isMobileFrameActive ? (
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Smartphone className="w-3.5 h-3.5 text-slate-300" />
              )}
            </button>
          )}

          {/* User Profile Avatar with Name */}
          <button
            onClick={onOpenThemeSettings}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs transition cursor-pointer"
            title="Open Profile Settings"
          >
            <span className="text-slate-300 font-medium hidden md:inline">{userName}</span>
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center text-xs border border-emerald-500/30">
              {VECTOR_AVATARS.find((a) => a.id === preferences?.avatarId)?.emoji || '🪷'}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
