import React, { useState } from 'react';
import { X, Heart, Smile, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface WellbeingCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  agentName: string;
  onAskAgent: (prompt: string) => void;
}

export const WellbeingCheckInModal: React.FC<WellbeingCheckInModalProps> = ({
  isOpen,
  onClose,
  userName,
  agentName,
  onAskAgent,
}) => {
  const [selectedMood, setSelectedMood] = useState<'peaceful' | 'calm' | 'attentive' | 'stressed'>('peaceful');
  const [focusArea, setFocusArea] = useState<string>('savings');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const moods = [
    { id: 'peaceful', label: 'Peaceful', icon: '🌿', desc: 'In full control & comfortable' },
    { id: 'calm', label: 'Calm', icon: '✨', desc: 'Budgets balanced, bills clear' },
    { id: 'attentive', label: 'Attentive', icon: '🔍', desc: 'Monitoring dining or shopping' },
    { id: 'stressed', label: 'Concerned', icon: '🌧️', desc: 'Need proactive advice or reassurance' },
  ];

  const focusOptions = [
    { id: 'savings', label: 'Emergency Savings & Float' },
    { id: 'dining', label: 'Dining & Food Pacing' },
    { id: 'bills', label: 'Upcoming Bills & Subscriptions' },
    { id: 'longterm', label: 'Long-term Yield & Growth' },
  ];

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const handleAskAgentDirect = () => {
    onClose();
    onAskAgent(`I'm doing my financial wellbeing check-in. My mindset today is "${selectedMood}" and my primary focus is "${focusArea}". Can you give me a personalized 3-step action plan to maintain financial peace of mind?`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0D1713] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 text-white space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Heart className="w-4 h-4 fill-emerald-400/30" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Financial Wellbeing Check-In</h3>
              <p className="text-xs text-slate-400">Mindful connection with your money</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSubmitted ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                How are you feeling about your money today, {userName}?
              </p>
              <div className="grid grid-cols-2 gap-2">
                {moods.map((m) => {
                  const active = selectedMood === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMood(m.id as any)}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between h-22 ${
                        active
                          ? 'border-emerald-400 bg-emerald-500/15 text-white ring-1 ring-emerald-400/40'
                          : 'border-white/10 bg-black/30 hover:bg-black/50 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{m.icon}</span>
                        {active && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold">{m.label}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{m.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                What would give you the most peace of mind today?
              </p>
              <div className="space-y-1.5">
                {focusOptions.map((f) => {
                  const active = focusArea === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setFocusArea(f.id)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-left text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                        active
                          ? 'border-emerald-400 bg-emerald-500/15 text-white'
                          : 'border-white/10 bg-black/20 hover:bg-black/40 text-slate-300'
                      }`}
                    >
                      <span>{f.label}</span>
                      {active && <span className="text-emerald-400 text-xs font-bold">Selected</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-1.5"
            >
              <span>Log Wellbeing Check-In</span>
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              🌿
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Check-in Recorded, {userName}!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
                {agentName} has tuned your financial recommendations. Your liquid emergency reserves and envelopes protect your daily peace of mind.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 text-left text-xs space-y-1">
              <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                {agentName}'s Insight:
              </div>
              <p className="text-slate-300">
                You currently have <strong>$14,650.00</strong> safely earning 4.85% APY and no high-interest penalties looming. You're doing wonderful.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Done
              </button>
              <button
                onClick={handleAskAgentDirect}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20"
              >
                <span>Chat with {agentName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
