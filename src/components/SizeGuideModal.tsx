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
      <div className="bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-100 rounded-none max-w-xl w-full p-6 space-y-5 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] relative max-h-[85vh] overflow-y-auto no-scrollbar font-mono text-neutral-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-red-600" />
            <h2 className="font-heading text-2xl font-black uppercase tracking-wider text-neutral-950 dark:text-white">
              FOOTWEAR SIZE GUIDE
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-black hover:bg-red-600 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Heel-To-Toe Measurement Graphic */}
        <div className="rounded-none border-2 border-neutral-900 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-6 text-center space-y-3">
          <div className="w-36 h-28 mx-auto flex items-center justify-center border-2 border-dashed border-red-600 p-2">
            <svg viewBox="0 0 100 100" className="w-full h-full text-neutral-900 dark:text-white" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M30 20 C20 40 15 60 20 85 C35 90 65 90 75 80 C80 60 70 40 60 20 Z" />
              <line x1="15" y1="85" x2="75" y2="85" stroke="#DC2626" strokeWidth="4" strokeDasharray="3 3" />
            </svg>
          </div>
          <p className="font-heading text-sm font-black uppercase tracking-wider text-neutral-950 dark:text-white">
            HEEL TO TOE LENGTH (CM)
          </p>
          <p className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
            FOR WOMEN'S FOOTWEAR, WE RECOMMEND SIZING DOWN BY ONE SIZE IF IN-BETWEEN.
          </p>
        </div>

        {/* Size Chart Table */}
        <div className="overflow-hidden rounded-none border-2 border-neutral-900 dark:border-neutral-800">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-red-600 text-white font-black uppercase tracking-wider">
                <th className="py-3 px-4">UK SIZE</th>
                <th className="py-3 px-4">EUR SIZE</th>
                <th className="py-3 px-4">FOOT LENGTH</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-black font-bold">
              {sizeChartData.map((row, idx) => (
                <tr key={idx} className="hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
                  <td className="py-2.5 px-4 font-black text-red-600">{row.uk}</td>
                  <td className="py-2.5 px-4 text-neutral-900 dark:text-neutral-100">{row.eur}</td>
                  <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-400">{row.cm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 rounded-none bg-black text-white dark:bg-white dark:text-black font-black text-xs uppercase tracking-widest border-2 border-black dark:border-white hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          CLOSE SIZE GUIDE
        </button>

      </div>
    </div>
  );
};
