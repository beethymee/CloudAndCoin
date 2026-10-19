import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  ExternalLink,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  HelpCircle,
  X,
  Globe,
  Terminal,
  Cloud,
  FileCode,
  Share2,
  Zap,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedGit, setCopiedGit] = useState(false);
  const [activeTab, setActiveTab] = useState<'download_apk' | 'deploy_vercel' | 'pwa' | 'pwabuilder'>('download_apk');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-t6rjq3twl2i64pdzvsfq4l-648725040191.asia-northeast1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCli = () => {
    navigator.clipboard.writeText('npm i -g vercel\nvercel --prod');
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const handleCopyGit = () => {
    navigator.clipboard.writeText('git init\ngit add .\ngit commit -m "Deploy FinTrack AI"\ngit remote add origin <your-github-repo-url>\ngit push -u origin main');
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-card rounded-2xl border border-white/20 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-slate-100">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase font-bold">
                  Production Release
                </span>
                <span className="text-xs text-slate-400">APK &amp; Cloud Deployment Hub</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Install APK &amp; Deploy to Vercel
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

        {/* Tab switch */}
        <div className="flex border-b border-white/[0.08] bg-black/40 px-3 sm:px-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('download_apk')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'download_apk'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📦 Download Original APK
          </button>
          <button
            onClick={() => setActiveTab('deploy_vercel')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'deploy_vercel'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ▲ Deploy to Vercel
          </button>
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'pwa'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ WebAPK (PWA)
          </button>
          <button
            onClick={() => setActiveTab('pwabuilder')}
            className={`py-3 px-3 sm:px-4 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === 'pwabuilder'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🛠️ Google Play / AAB
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
          {/* TAB 1: DOWNLOAD ORIGINAL APK */}
          {activeTab === 'download_apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs">FinTrack AI Android Package (.apk)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    v1.0.0 Ready
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Download the compiled, standalone Android application package directly to your phone or Android emulator. Sideload without Play Store restrictions.
                </p>

                {/* Package Specifications Table */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-slate-500 block text-[10px]">PACKAGE</span>
                    <span className="text-slate-200 font-medium">com.fintrack.ai</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-slate-500 block text-[10px]">TARGET OS</span>
                    <span className="text-slate-200 font-medium">Android 8.0+</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-slate-500 block text-[10px]">ARCHITECTURE</span>
                    <span className="text-slate-200 font-medium">Universal</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-slate-500 block text-[10px]">PERMISSIONS</span>
                    <span className="text-slate-200 font-medium">Internet, NetState</span>
                  </div>
                </div>

                {/* Direct Download Button */}
                <div className="pt-2">
                  <a
                    href="/fintrack-ai-v1.0.0.apk"
                    download="FinTrack-AI-v1.0.0.apk"
                    className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Original APK (FinTrack-AI-v1.0.0.apk)</span>
                  </a>
                </div>
              </div>

              {/* Step-by-step sideload instructions */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2.5 text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  How to Install on Android in 3 Simple Steps:
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed">
                  <li>
                    Tap <strong className="text-slate-200">Download Original APK</strong> above on your Android phone.
                  </li>
                  <li>
                    When download finishes, tap the notification or open your phone's <strong className="text-slate-200">Files &gt; Downloads</strong> folder and tap <code className="text-emerald-300">FinTrack-AI-v1.0.0.apk</code>.
                  </li>
                  <li>
                    If prompted with <em>"Install unknown apps"</em>, toggle <strong className="text-slate-200">Allow from this source</strong> for your browser / file manager, then tap <strong className="text-emerald-400">Install</strong>.
                  </li>
                </ol>
              </div>

              {/* Live Public Access URL */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Online Access URL</span>
                  <span className="font-mono text-slate-300 truncate block">{currentUrl}</span>
                </div>
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/15 transition cursor-pointer shrink-0"
                >
                  {copiedUrl ? 'Copied!' : 'Copy URL'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DEPLOY TO VERCEL */}
          {activeTab === 'deploy_vercel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs">Deploying FinTrack to Vercel (Public Worldwide Access)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  This project is 100% pre-configured with <code className="text-emerald-300">vercel.json</code> and serverless API handlers. Anyone online can visit your custom Vercel domain and install the app or download the APK.
                </p>

                {/* Option A: Git push to Vercel */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      Option 1: Deploy with Git &amp; GitHub (Recommended)
                    </span>
                    <button
                      onClick={handleCopyGit}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-slate-200 transition cursor-pointer"
                    >
                      {copiedGit ? 'Copied!' : 'Copy Commands'}
                    </button>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 text-xs font-mono">
                    <li>Push this codebase to a GitHub repository</li>
                    <li>Go to <strong className="text-cyan-400">vercel.com/new</strong> and select your repository</li>
                    <li>Add Environment Variable: <code className="text-emerald-300">GEMINI_API_KEY</code></li>
                    <li>Click <strong className="text-white">Deploy</strong> &mdash; Vercel outputs your live HTTPS URL!</li>
                  </ol>
                </div>

                {/* Option B: Vercel CLI */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Option 2: Instant Deploy via Vercel CLI
                    </span>
                    <button
                      onClick={handleCopyCli}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-[11px] font-semibold text-slate-200 transition cursor-pointer"
                    >
                      {copiedCli ? 'Copied!' : 'Copy CLI'}
                    </button>
                  </div>
                  <pre className="p-2.5 rounded-lg bg-black/70 text-emerald-400 font-mono text-[11px] overflow-x-auto">
{`npm i -g vercel
vercel --prod`}
                  </pre>
                  <p className="text-[11px] text-slate-400">
                    Vercel will prompt for login, detect the Vite framework automatically, and deploy in under 45 seconds.
                  </p>
                </div>

                {/* Vercel Configuration Highlights */}
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[11px] space-y-1 text-slate-400">
                  <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                    Included Configs:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1">
                    <li><strong className="text-slate-300">vercel.json</strong>: Automated SPA rewrite, immutable APK download headers, and manifest caching.</li>
                    <li><strong className="text-slate-300">api/chat.ts</strong>: Vercel serverless function proxying Gemini AI with Zero-Trust guardrails.</li>
                    <li><strong className="text-slate-300">public/fintrack-ai-v1.0.0.apk</strong>: Direct APK download hosted on your live domain.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PWA / WEBAPK */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs">1-Click Native WebAPK Installation</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Browser Native
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Modern Android devices automatically generate a native WebAPK from the registered Web App Manifest and Service Worker. This creates a real home screen app with zero download warnings.
                </p>

                <div className="pt-2">
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md border border-emerald-400/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isInstalled ? 'App Already Installed' : 'Install to Home Screen / Android'}</span>
                  </button>
                </div>
              </div>

              {/* Instructions for Android Chrome */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
                <span className="font-bold text-white block">Manual Browser Installation:</span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400">
                  <li>Open this URL in Google Chrome on your Android device.</li>
                  <li>Tap the three dots menu (⋮) in the top-right corner.</li>
                  <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Android automatically creates and signs a native WebAPK launcher.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: PWABUILDER / GOOGLE PLAY */}
          {activeTab === 'pwabuilder' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                To build an offline, signed <strong>.aab</strong> (Android App Bundle) or standalone <strong>.apk</strong> binary for distribution or publishing to Google Play Store:
              </p>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-white font-semibold text-xs">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>Microsoft PWABuilder (Automated APK / AAB Generation)</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  PWABuilder packages your live deployment URL into an official Android Studio TWA (Trusted Web Activity) project with digital asset links and Play Store ready credentials.
                </p>
                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
                >
                  <span>Build Android App on PWABuilder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/[0.08] bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FinTechathon 2026 Release Compliant</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
