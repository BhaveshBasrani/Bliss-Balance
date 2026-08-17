'use client';

import React from 'react';
import { X, Ruler } from 'lucide-react';

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

        {/* Official Size Chart Banner Image */}
        <div className="rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 p-2 shadow-xs">
          <img
            src="https://cdn.shopify.com/s/files/1/0738/5559/8899/files/size_chart_xlows_desktop.jpg?v=1780652343"
            alt="Official Footwear Size Measurement Guide"
            className="w-full h-auto rounded-xl object-cover"
          />
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
          className="w-full py-3.5 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 font-bold text-xs uppercase tracking-widest hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-md"
        >
          CLOSE SIZE GUIDE
        </button>

      </div>
    </div>
  );
};
