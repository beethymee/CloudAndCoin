import React, { useState } from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Smartphone,
  Monitor,
  Activity,
  Layers,
  Calendar,
  MessageSquare,
  Plus,
  CreditCard,
  X,
  Home,
  Compass,
} from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickAdd?: () => void;
  isMobileFrameActive: boolean;
  onToggleMobileFrame: () => void;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  children,
  activeTab,
  setActiveTab,
  onOpenQuickAdd,
  isMobileFrameActive,
  onToggleMobileFrame,
}) => {
  // If desktop mode is active, render regular full width container
  if (!isMobileFrameActive) {
    return <>{children}</>;
  }

  return (
    <div className="py-6 px-2 sm:px-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)] animate-fadeIn">
      {/* Phone Shell */}
      <div className="relative w-full max-w-[420px] bg-[#07090E] rounded-[48px] border-[10px] border-[#1F293D] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(16,185,129,0.15)] overflow-hidden flex flex-col h-[860px]">
        {/* Phone Speaker & Dynamic Island */}
        <div className="relative z-30 pt-3 pb-2 px-6 bg-[#07090E] flex items-center justify-between text-slate-300 text-[11px] font-medium shrink-0 select-none border-b border-white/[0.04]">
          {/* Time */}
          <span className="font-semibold text-white tracking-tight">9:41</span>

          {/* Dynamic Island Pill */}
          <div className="h-5 px-3 rounded-full bg-black border border-white/10 flex items-center gap-1.5 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-400 font-bold">FinTrack Live</span>
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 text-white">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Scrollable Mobile App Viewport */}
        <div className="flex-1 overflow-y-auto scrollbar-none p-3 pb-24 text-slate-100">
          {children}
        </div>

        {/* Mobile Bottom Navigation Dock (Matching Reference Image) */}
        <div className="absolute bottom-0 inset-x-0 bg-[#07090E]/95 backdrop-blur-xl border-t border-white/10 px-3 pt-2 pb-5 flex items-center justify-around z-30 select-none">
          <button
            onClick={() => setActiveTab('welcome')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition cursor-pointer ${
              activeTab === 'welcome' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Relax</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition cursor-pointer ${
              activeTab === 'dashboard' || activeTab === 'overview'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Activity</span>
          </button>

          {/* Floating Central Home Action Button (Matching Reference Image) */}
          <button
            onClick={() => setActiveTab('welcome')}
            className="-mt-5 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/30 border-3 border-[#07090E] active:scale-95 transition cursor-pointer"
            title="Return to Welcoming Home"
          >
            <Home className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setActiveTab('bills')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition cursor-pointer ${
              activeTab === 'bills' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bills</span>
          </button>

          <button
            onClick={() => setActiveTab('copilot')}
            className={`flex flex-col items-center gap-1 text-[10px] font-medium transition cursor-pointer ${
              activeTab === 'copilot' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>CoachChat</span>
          </button>
        </div>

        {/* Bottom Home Indicator Bar */}
        <div className="absolute bottom-1 inset-x-0 flex justify-center z-40 pointer-events-none">
          <div className="w-32 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  );
};
