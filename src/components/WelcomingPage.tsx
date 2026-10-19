import React, { useState, useEffect } from 'react';
import {
  Bell,
  Heart,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Clock,
  Layers,
  Smile,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';
import {
  Account,
  Bill,
  Budget,
  FinancialHealthScore,
  Recommendation,
  Transaction,
  ActionProposal,
} from '../types/finance';
import { UserPreferences, THEMES } from '../types/theme';
import { INSPIRING_QUOTES } from '../data/inspiringQuotes';
import sceneryLakeWide from '../assets/images/scenery_vector_serene_lake_1792419207866.jpg';
import sceneryForestMobile from '../assets/images/scenery_vector_mobile_forest_1792419207871.jpg';

interface WelcomingPageProps {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  bills: Bill[];
  healthScore: FinancialHealthScore;
  recommendations: Recommendation[];
  preferences: UserPreferences;
  onOpenThemeSettings: () => void;
  onOpenWellbeingCheckIn: () => void;
  onOpenPasswordPrompt: () => void;
  onOpenProposal: (proposal: ActionProposal) => void;
  onAskAgent: (prompt: string) => void;
}

export const WelcomingPage: React.FC<WelcomingPageProps> = ({
  accounts,
  transactions,
  budgets,
  bills,
  healthScore,
  recommendations,
  preferences,
  onOpenThemeSettings,
  onOpenWellbeingCheckIn,
  onOpenPasswordPrompt,
  onOpenProposal,
  onAskAgent,
}) => {
  // Live dynamic clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time and Date formatting
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: preferences.timeFormat === '12h',
  });

  const day = currentTime.getDate();
  const daySuffix =
    day % 10 === 1 && day !== 11
      ? 'ST'
      : day % 10 === 2 && day !== 12
      ? 'ND'
      : day % 10 === 3 && day !== 13
      ? 'RD'
      : 'TH';
  const monthName = currentTime.toLocaleString('en-US', { month: 'long' }).toUpperCase();
  const year = currentTime.getFullYear();
  const formattedDate = `${day}${daySuffix} ${monthName} ${year}`;
  const weekdayName = currentTime.toLocaleString('en-US', { weekday: 'long' });

  // Dynamic greeting: GOOD MORNING / GOOD AFTERNOON / GOOD EVENING
  const hours = currentTime.getHours();
  const greeting =
    hours < 12 ? 'GOOD MORNING' : hours < 18 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  const activeThemeObj = THEMES.find((t) => t.id === preferences.theme) || THEMES[0];
  const activeQuote = INSPIRING_QUOTES[quoteIndex];
  const overdueBills = bills.filter((b) => b.status === 'overdue');

  return (
    <div className="w-full max-w-5xl mx-auto h-[calc(100vh-4.25rem)] sm:h-[calc(100vh-4.5rem)] max-h-[880px] flex flex-col justify-between py-1 sm:py-2 text-slate-100 font-sans overflow-hidden">
      {/* 1. Serene Vector Scenery Hero (Single-Screen Sized) */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-[#0D1713] flex-1 min-h-[220px] max-h-[360px] flex flex-col justify-between">
        <div className="absolute inset-0 select-none overflow-hidden">
          <picture>
            <source media="(max-width: 640px)" srcSet={sceneryForestMobile} />
            <img
              src={sceneryLakeWide}
              alt="Serene Vector Scenery"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center transition-all duration-700 ${
                preferences.showSceneryAnimation ? 'scale-105' : 'scale-100'
              }`}
              style={{
                filter: activeThemeObj.sceneryFilter,
              }}
            />
          </picture>

          {/* Gentle Gradient Scrim for effortless readability */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 50%, ${activeThemeObj.previewColors.bg} 100%)`,
            }}
          />

          {/* Subtle animated flock of birds */}
          {preferences.showSceneryAnimation && (
            <div className="absolute top-6 left-1/3 animate-bird-fly opacity-50 pointer-events-none">
              <svg width="40" height="14" viewBox="0 0 50 16" fill="none">
                <path
                  d="M2 12 Q 8 4, 14 10 Q 20 4, 26 12"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M26 6 Q 31 1, 36 5 Q 41 1, 46 6"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Top Bar inside scenery: Clock & Bell */}
        <div className="relative z-20 px-4 sm:px-6 pt-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-emerald-300" />
            <span className="font-mono">{formattedTime}</span>
            <span className="text-white/40">·</span>
            <span className="text-slate-200">{weekdayName}</span>
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationOpen((prev) => !prev)}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-3.5 h-3.5" />
              {overdueBills.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-black" />
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-60 p-3 rounded-2xl bg-[#0D1713]/95 backdrop-blur-xl border border-white/15 shadow-2xl z-30 text-xs space-y-1.5">
                <div className="font-bold text-white pb-1 border-b border-white/10">Alerts</div>
                {overdueBills.length > 0 ? (
                  <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-[11px]">
                    Municipal Water ($45.20) ready to pay.
                  </div>
                ) : (
                  <div className="p-2 text-slate-400 text-center text-[11px]">No alerts! Finances peaceful.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Welcoming Typography & Enter Workspace Button with Password Protection */}
        <div className="relative z-20 px-4 sm:px-6 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="text-[11px] sm:text-xs font-semibold tracking-widest text-slate-200 uppercase">
              {greeting}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mt-0.5 font-serif">
              {preferences.userName || 'Catherine'}
            </h1>
            <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-0.5">
              <span>{preferences.job || 'Financial Analyst'}</span>
              <span>·</span>
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Enter Workspace Button with Password Protection Trigger */}
          <button
            onClick={onOpenPasswordPrompt}
            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-xl shadow-emerald-500/30 flex items-center gap-2 group cursor-pointer self-start sm:self-auto active:scale-95 shrink-0"
          >
            <Lock className="w-3.5 h-3.5 text-slate-950" />
            <span>Enter Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 2. Inspiring Life Quote Banner (Gentle, single-line) */}
      <div className="px-4 py-2 rounded-xl bg-emerald-950/25 border border-emerald-500/15 flex items-center justify-between gap-3 text-xs my-2">
        <div className="flex items-center gap-2 truncate">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30 shrink-0" />
          <span className="font-serif italic text-white/90 truncate text-[11px] sm:text-xs">
            “{activeQuote.quote}”
          </span>
          <span className="text-slate-400 hidden md:inline shrink-0 text-[11px]">
            — {activeQuote.author}
          </span>
        </div>
        <button
          onClick={() => setQuoteIndex((prev) => (prev + 1) % INSPIRING_QUOTES.length)}
          title="See another quote"
          className="text-[10px] font-medium text-emerald-300 hover:text-white flex items-center gap-1 transition shrink-0 cursor-pointer"
        >
          <span>Quote</span>
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>

      {/* 3. Compact Today's Overview Grid (Fitting neatly on single screen, NO scroll down) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 flex-shrink-0">
        {/* Card 1: Financial Health & Wellbeing Status */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#14261E]/75 border border-white/10 flex items-center justify-between gap-3 shadow-sm">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-300">
              <Heart className="w-3.5 h-3.5 fill-rose-400/40 text-rose-400" />
              <span>Health &amp; Peace</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-white truncate">
              Score: {healthScore.overall}/100 · Optimal
            </div>
            <button
              onClick={onOpenWellbeingCheckIn}
              className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer pt-0.5"
            >
              <span>Daily mindfulness</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex flex-col items-center justify-center text-emerald-400 shrink-0">
            <span className="text-base font-extrabold font-serif">{healthScore.overall}</span>
            <span className="text-[8px] uppercase font-bold text-slate-400">Grade {healthScore.grade}</span>
          </div>
        </div>

        {/* Card 2: Mindful Wellbeing Check-In Tile */}
        <button
          onClick={onOpenWellbeingCheckIn}
          className="p-3.5 sm:p-4 rounded-2xl bg-[#122428] hover:bg-[#182f34] border border-cyan-500/20 text-left flex items-center justify-between transition cursor-pointer group shadow-sm"
        >
          <div className="space-y-0.5">
            <div className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-200">
              Wellbeing Check In
            </div>
            <div className="text-[11px] text-slate-400">30-sec mindfulness pulse</div>
            <div className="text-[10px] text-cyan-400 font-medium pt-0.5">
              Reflect &amp; align spending
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform shrink-0">
            <Smile className="w-5 h-5" />
          </div>
        </button>

        {/* Card 3: Signature Stability & Reserve Buffer */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#12211A]/70 border border-white/10 flex items-center justify-between gap-3 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="space-y-0.5 min-w-0">
            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              RESERVE CUSHION
            </div>
            <div className="text-xs sm:text-sm font-bold text-white truncate">
              5.5 Months Living Float
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              $14,650 in high-yield vault @ 4.85% APY
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
