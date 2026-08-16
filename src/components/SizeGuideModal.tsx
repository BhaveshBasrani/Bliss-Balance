'use client';

import React from 'react';
import { X, Ruler, CheckCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sizeChartData = [
    { uk: 'UK 3', eur: '35.5', cm: '22.5 cm' },
    { uk: 'UK 4', eur: '36.5', cm: '23.3 cm' },
    { uk: 'UK 5', eur: '38.0', cm: '24.1 cm' },
    { uk: 'UK 6', eur: '39.0', cm: '24.9 cm' },
    { uk: 'UK 7', eur: '40.0', cm: '25.7 cm' },
    { uk: 'UK 8', eur: '41.5', cm: '26.5 cm' },
    { uk: 'UK 9', eur: '43.0', cm: '27.3 cm' },
    { uk: 'UK 10', eur: '44.0', cm: '28.1 cm' },
    { uk: 'UK 11', eur: '45.0', cm: '28.9 cm' },
    { uk: 'UK 12', eur: '46.0', cm: '29.7 cm' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto font-mono text-neutral-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-red-600" />
            <h2 className="font-heading text-2xl font-black uppercase tracking-wider text-neutral-950 dark:text-white">
              FOOTWEAR SIZE GUIDE
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-600 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diagram & Recommendation Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-neutral-50 dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <div className="text-center space-y-2">
            <div className="w-32 h-32 mx-auto flex items-center justify-center p-3 border-2 border-dashed border-red-500/40 rounded-2xl bg-white dark:bg-neutral-900">
              <svg viewBox="0 0 100 100" className="w-full h-full stroke-neutral-800 dark:stroke-neutral-200 fill-none stroke-[2]">
                <path d="M40 10 C60 10 75 30 75 60 C75 85 60 90 40 90 C25 90 25 80 25 60 C25 30 30 10 40 10 Z" />
                <line x1="15" y1="15" x2="15" y2="85" stroke="#E50914" strokeDasharray="3 3" />
                <path d="M12 20 L15 15 L18 20 M12 80 L15 85 L18 80" stroke="#E50914" />
              </svg>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 block">
              HEEL TO TOE LENGTH (CM)
            </span>
          </div>

          <div className="space-y-3 font-sans text-xs text-neutral-700 dark:text-neutral-300">
            <div className="p-3 bg-red-50 dark:bg-red-950/60 rounded-xl border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-mono font-bold space-y-1">
              <span className="flex items-center gap-1.5 uppercase text-[11px]">
                <CheckCircle className="w-4 h-4 text-red-600" /> SIZING RECOMMENDATION:
              </span>
              <p className="text-[11px] font-normal leading-relaxed">
                For Women, we recommend sizing down (e.g. if you are a UK 6, consider UK 5).
              </p>
            </div>
            <p className="text-[11px] leading-relaxed">
              Measure from the back of your heel to the tip of your longest toe for exact fit accuracy.
            </p>
          </div>
        </div>

        {/* Size Chart Table */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-red-600 text-white font-bold uppercase tracking-wider">
                <th className="py-3 px-4">UK SIZE</th>
                <th className="py-3 px-4">EUR SIZE</th>
                <th className="py-3 px-4">FOOT LENGTH (CM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900">
              {sizeChartData.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors">
                  <td className="py-2.5 px-4 font-bold text-red-600">{row.uk}</td>
                  <td className="py-2.5 px-4 text-neutral-800 dark:text-neutral-200">{row.eur}</td>
                  <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-400 font-mono">{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-md"
        >
          GOT IT, CLOSE SIZE GUIDE
        </button>

      </div>
    </div>
  );
};
