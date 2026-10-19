import React, { useState } from 'react';
import {
  X,
  Check,
  Palette,
  Sparkles,
  Sun,
  Moon,
  Clock,
  User,
  Compass,
  Calendar,
  Briefcase,
  KeyRound,
  LogOut,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { THEMES, ThemeId, UserPreferences } from '../types/theme';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onUpdatePreferences: (updates: Partial<UserPreferences>) => void;
  onLogout?: () => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onUpdatePreferences,
  onLogout,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'theme' | 'security'>('profile');
  const [tempPassword, setTempPassword] = useState(preferences.workspacePassword || '1234');
  const [passwordSavedNotice, setPasswordSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSavePassword = () => {
    onUpdatePreferences({ workspacePassword: tempPassword });
    setPasswordSavedNotice(true);
    setTimeout(() => setPasswordSavedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-[#0E1614] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{ backgroundColor: 'var(--theme-surface-solid, #0E1614)' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">User Profile &amp; Settings</h3>
              <p className="text-xs text-slate-400">Manage your profile, security PIN, and theme appearance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/20 px-6 pt-2 gap-2 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'profile'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile &amp; Info</span>
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'security'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Workspace PIN</span>
          </button>
          <button
            onClick={() => setActiveSubTab('theme')}
            className={`pb-2.5 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'theme'
                ? 'border-emerald-400 text-emerald-300 font-bold'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Themes &amp; Display</span>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* 1. Profile & Info SubTab */}
          {activeSubTab === 'profile' && (
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={preferences.userName || ''}
                  onChange={(e) => onUpdatePreferences({ userName: e.target.value })}
                  placeholder="Enter full name (e.g. Catherine)"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Date of Birth</span>
                </label>
                <input
                  type="date"
                  value={preferences.dateOfBirth || '1998-05-14'}
                  onChange={(e) => onUpdatePreferences({ dateOfBirth: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              {/* Job / Profession */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Job / Profession</span>
                </label>
                <input
                  type="text"
                  value={preferences.job || 'Financial Analyst'}
                  onChange={(e) => onUpdatePreferences({ job: e.target.value })}
                  placeholder="e.g. Financial Analyst, Software Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-400 transition"
                />
              </div>

              {/* Logout Action */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Session Security</div>
                  <div className="text-[11px] text-slate-400">Lock workspace and log out of this device</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onLogout) onLogout();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Security PIN SubTab */}
          {activeSubTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Protected Workspace Entry</span>
                  <p className="mt-0.5 text-slate-300">
                    This password / PIN protects access when clicking &quot;Enter Workspace&quot; from the welcoming page.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Workspace PIN / Password</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="Set PIN (e.g. 1234)"
                    maxLength={16}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white font-mono text-sm focus:outline-none focus:border-emerald-400 transition"
                  />
                  <button
                    onClick={handleSavePassword}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                  >
                    Save PIN
                  </button>
                </div>
                {passwordSavedNotice && (
                  <div className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>PIN successfully updated!</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-400">
                Default factory PIN is <span className="font-mono text-emerald-400 font-bold">1234</span>.
              </div>
            </div>
          )}

          {/* 3. Theme & Display SubTab */}
          {activeSubTab === 'theme' && (
            <div className="space-y-5">
              {/* Atmospheric Themes */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Atmospheric Theme</span>
                  </label>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    {THEMES.find((t) => t.id === preferences.theme)?.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {THEMES.map((th) => {
                    const isSelected = preferences.theme === th.id;
                    return (
                      <button
                        key={th.id}
                        onClick={() => onUpdatePreferences({ theme: th.id })}
                        className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                            : 'border-white/10 hover:border-white/20 bg-black/25 hover:bg-black/40'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2 shrink-0">
                            <div
                              className="w-6 h-6 rounded-full border border-black/40 shadow-sm"
                              style={{ backgroundColor: th.previewColors.bg }}
                            />
                            <div
                              className="w-6 h-6 rounded-full border border-black/40 shadow-sm"
                              style={{ backgroundColor: th.previewColors.surface }}
                            />
                            <div
                              className="w-6 h-6 rounded-full border border-black/40 shadow-sm flex items-center justify-center text-[9px] font-bold text-black"
                              style={{ backgroundColor: th.previewColors.accent }}
                            >
                              ✦
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-bold text-white">{th.name}</span>
                            <p className="text-[10px] text-slate-400 mt-0.5">{th.tagline}</p>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition ${
                            isSelected
                              ? 'border-emerald-400 bg-emerald-400 text-slate-950'
                              : 'border-white/20 text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time, Currency & Animation */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
                <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Clock</div>
                    <div className="text-[10px] text-slate-400">12h / 24h</div>
                  </div>
                  <button
                    onClick={() =>
                      onUpdatePreferences({
                        timeFormat: preferences.timeFormat === '12h' ? '24h' : '12h',
                      })
                    }
                    className="px-2 py-1 rounded-lg text-xs font-bold bg-white/10 text-white transition cursor-pointer"
                  >
                    {preferences.timeFormat.toUpperCase()}
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Currency</div>
                    <div className="text-[10px] text-slate-400">bKash ৳ / $</div>
                  </div>
                  <button
                    onClick={() =>
                      onUpdatePreferences({
                        currencySymbol: preferences.currencySymbol === '৳' ? '$' : '৳',
                      })
                    }
                    className="w-7 h-7 rounded-lg text-xs font-bold bg-[#E2136E]/20 text-[#E2136E] border border-[#E2136E]/40 transition cursor-pointer flex items-center justify-center font-serif"
                  >
                    {preferences.currencySymbol || '৳'}
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Motion</div>
                    <div className="text-[10px] text-slate-400">Effects</div>
                  </div>
                  <button
                    onClick={() =>
                      onUpdatePreferences({
                        showSceneryAnimation: !preferences.showSceneryAnimation,
                      })
                    }
                    className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      preferences.showSceneryAnimation
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {preferences.showSceneryAnimation ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-black/30 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Changes auto-saved to secure local state
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
