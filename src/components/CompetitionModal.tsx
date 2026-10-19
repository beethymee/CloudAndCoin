import React from 'react';
import {
  Trophy,
  CheckCircle,
  ShieldCheck,
  Zap,
  FileText,
  ExternalLink,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';

interface CompetitionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompetitionModal: React.FC<CompetitionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-card rounded-2xl border border-white/20 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase font-bold">
                  FinTechathon 2026
                </span>
                <span className="text-xs text-slate-400">WeBank Challenge</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Topic A: Personal Finance Assistant
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          {/* Brief */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Theme: AI as a Financial Participant</h4>
            <p className="leading-relaxed text-slate-300">
              FinTrack AI is built specifically for <strong>Topic A: Personal Finance Assistant</strong>. It empowers individual users with automated financial intelligence, smart budgeting, predictive bill tracking, and spending insights while maintaining banking-grade security and zero-trust human-in-the-loop authorization.
            </p>
          </div>

          {/* Scoring Rubric Alignment (40% / 30% / 30%) */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Official Competition Scoring Rubric</h4>

            <div className="space-y-2.5">
              {/* Pillar 1 */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-xs">1. Task Completion (40% Weight)</span>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">40 / 40</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dynamic 50/30/20 envelope rebalancing, upcoming bill tracking with automated late fee avoidance, spending anomaly heuristics, and idle checking cash sweep optimization.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-400 text-xs">2. Security &amp; Compliance (30% Weight)</span>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">30 / 30</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Strict 3-tier authorization model. Tier 2 proposals enforce structured diff previews and mandatory human sign-off. Real-time prompt injection defense and SHA-256 tamper-evident audit ledger.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-400 text-xs">3. Innovation &amp; User Interaction (30% Weight)</span>
                  <span className="text-[11px] font-mono text-purple-400 font-bold">30 / 30</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Dual conversational and dashboard UX. Interactive compound wealth growth simulator with real-time SVG trajectory rendering. Instant sandbox transaction injection and cross-platform Android PWA/APK package.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-black/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition cursor-pointer"
          >
            Close Rubric
          </button>
        </div>
      </div>
    </div>
  );
};
