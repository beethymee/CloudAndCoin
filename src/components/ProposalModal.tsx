import React from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  X,
} from 'lucide-react';
import { ActionProposal } from '../types/finance';

interface ProposalModalProps {
  proposal: ActionProposal | null;
  onApprove: (proposal: ActionProposal) => void;
  onReject: (proposal: ActionProposal) => void;
  onClose: () => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  proposal,
  onApprove,
  onReject,
  onClose,
}) => {
  if (!proposal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-card rounded-2xl border border-white/20 shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase font-bold">
                  Tier-2 Action Proposal
                </span>
                <span className="text-xs text-slate-400">Human Approval Required</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {proposal.title}
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {proposal.description}
          </p>

          {/* Dry Run / Diffs Table */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider pb-2 border-b border-white/[0.08]">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Simulated Dry-Run State Diff</span>
            </div>

            <div className="space-y-2">
              {proposal.diff.map((d, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400 font-sans text-xs">{d.field}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-rose-400 line-through">{d.before}</span>
                    <span className="text-slate-500">&rarr;</span>
                    <span className="text-emerald-400 font-bold">{d.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Compliance Guarantee */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Approved execution generates a tamper-evident audit record with cryptographic SHA-256 signature immediately verifiable in the Security tab.
            </p>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-black/40 flex items-center justify-end gap-3">
          <button
            onClick={() => onReject(proposal)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
          >
            Decline &amp; Cancel
          </button>

          <button
            onClick={() => onApprove(proposal)}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/30 transition shadow-lg shadow-emerald-950/60 cursor-pointer flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm &amp; Execute Action</span>
          </button>
        </div>
      </div>
    </div>
  );
};
