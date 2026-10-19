import React, { useState } from 'react';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  Receipt,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { TransactionCategory } from '../types/finance';

interface ReceiptScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReceiptProcessed: (merchant: string, amount: number, category: TransactionCategory) => void;
}

const SAMPLE_RECEIPTS = [
  {
    merchant: 'Whole Foods Market',
    amount: 84.75,
    category: 'Groceries' as TransactionCategory,
    date: '2026-10-19',
    items: ['Organic Blueberries ($4.99)', 'Almond Milk ($3.89)', 'Wild Atlantic Salmon ($24.50)', 'Artisan Sourdough ($5.49)', 'Olive Oil Extra Virgin ($18.99)', 'Items subtotal + tax ($26.89)'],
  },
  {
    merchant: 'Apple Store Fifth Ave',
    amount: 149.0,
    category: 'Shopping' as TransactionCategory,
    date: '2026-10-18',
    items: ['MagSafe Battery Pack ($99.00)', 'USB-C Fast Charging Cable 2m ($29.00)', 'NY Sales Tax 8.875% ($21.00)'],
  },
  {
    merchant: 'Shell Energy Gas Station',
    amount: 52.4,
    category: 'Transportation' as TransactionCategory,
    date: '2026-10-17',
    items: ['12.8 Gal V-Power Unleaded @ $3.89/gal ($49.80)', 'Espresso Can ($2.60)'],
  },
];

export const ReceiptScanModal: React.FC<ReceiptScanModalProps> = ({
  isOpen,
  onClose,
  onReceiptProcessed,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<typeof SAMPLE_RECEIPTS[0] | null>(null);

  if (!isOpen) return null;

  const handleSimulateScan = (receipt: typeof SAMPLE_RECEIPTS[0]) => {
    setIsScanning(true);
    setScannedResult(null);

    setTimeout(() => {
      setIsScanning(false);
      setScannedResult(receipt);
    }, 1500);
  };

  const handleConfirm = () => {
    if (!scannedResult) return;
    onReceiptProcessed(scannedResult.merchant, scannedResult.amount, scannedResult.category);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0A0E17] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Camera className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">AI Smart Receipt Scanner</h3>
              <p className="text-xs text-slate-400">Autonomous OCR itemization &amp; category parser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isScanning ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
              <div className="absolute inset-0 border-2 border-purple-400 rounded-2xl animate-ping opacity-25" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Analyzing Optical Receipt...</h4>
              <p className="text-xs text-slate-400 mt-1">Extracting merchant, line items, VAT, and envelope tags</p>
            </div>
          </div>
        ) : scannedResult ? (
          <div className="space-y-4 pt-4 animate-fadeIn">
            {/* Scanned Card */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 font-mono">
              <div className="flex items-start justify-between border-b border-dashed border-white/10 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Merchant</span>
                  <span className="text-base font-bold text-white">{scannedResult.merchant}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Total</span>
                  <span className="text-xl font-bold text-emerald-400">${scannedResult.amount.toFixed(2)}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-1 text-xs text-slate-300">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Itemized Breakdown</span>
                {scannedResult.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px] py-0.5 text-slate-300">
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-white/10 flex justify-between items-center text-xs">
                <span className="text-slate-400 font-sans">AI Category Suggestion:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-sans font-semibold">
                  {scannedResult.category}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setScannedResult(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-300 transition cursor-pointer"
              >
                Scan Another
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/40 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm &amp; Log</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pt-4">
            <p className="text-xs text-slate-300">
              Select a receipt sample below or test camera simulation to extract merchant line items:
            </p>

            <div className="space-y-2">
              {SAMPLE_RECEIPTS.map((r, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulateScan(r)}
                  className="w-full p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-purple-500/40 flex items-center justify-between text-left transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                      <Receipt className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">{r.merchant}</div>
                      <div className="text-[11px] text-slate-400">{r.items.length} items &bull; {r.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-white">${r.amount.toFixed(2)}</div>
                    <div className="text-[10px] text-purple-400">Run OCR &rarr;</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
