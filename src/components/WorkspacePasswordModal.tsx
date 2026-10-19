import React, { useState, useEffect, useRef } from 'react';
import { Lock, ShieldCheck, KeyRound, X, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface WorkspacePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  savedPassword?: string;
}

export const WorkspacePasswordModal: React.FC<WorkspacePasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  savedPassword = '1234',
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetPassword = savedPassword || '1234';
    if (pin === targetPassword) {
      setError(null);
      onSuccess();
    } else {
      setError('Incorrect security password or PIN. Try default: 1234');
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handleKeypadPress = (val: string) => {
    if (pin.length < 8) {
      const next = pin + val;
      setPin(next);
      setError(null);
      const targetPassword = savedPassword || '1234';
      if (next === targetPassword) {
        setTimeout(() => onSuccess(), 100);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-[#0D1713] p-6 shadow-2xl flex flex-col items-center text-center space-y-5"
        style={{ backgroundColor: 'var(--theme-surface-solid, #0D1713)' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Shield Icon */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mt-2">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Workspace Authentication
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter your security PIN or password to unlock financial data
          </p>
        </div>

        {/* PIN Input / Dots Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(null);
              }}
              placeholder="Enter PIN (e.g. 1234)"
              className="w-full py-3 px-4 rounded-xl bg-black/50 border border-white/20 text-center font-mono tracking-widest text-lg text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
              maxLength={12}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium animate-shake">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleKeypadPress(num)}
                className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] active:bg-emerald-500/20 text-white font-mono font-bold text-sm transition cursor-pointer border border-white/5 active:scale-95"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPin('')}
              className="py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] text-slate-400 hover:text-white font-mono text-xs transition cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeypadPress('0')}
              className="py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] active:bg-emerald-500/20 text-white font-mono font-bold text-sm transition cursor-pointer border border-white/5 active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] text-slate-400 hover:text-white font-mono text-xs transition cursor-pointer"
            >
              ⌫
            </button>
          </div>

          {/* Submit Unlock Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Unlock Workspace</span>
          </button>
        </form>

        {/* Default Password Helper */}
        <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
          <span>Default PIN:</span>
          <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            1234
          </span>
          <span className="text-slate-500">(changeable in Settings)</span>
        </div>
      </div>
    </div>
  );
};
