'use client';

import React, { useState } from 'react';
import { X, Ruler, Footprints, Info, Sparkles, CheckCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGender?: 'Men' | 'Women' | 'Kids';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  initialGender = 'Men',
}) => {
  const [activeGenderTab, setActiveGenderTab] = useState<'Men' | 'Women' | 'Kids'>(initialGender);

  if (!isOpen) return null;

  const mensSizeData = [
    { uk: 'UK / IN 6', cm: '24.5 cm' },
    { uk: 'UK / IN 7', cm: '24.8 cm' },
    { uk: 'UK / IN 8', cm: '25.5 cm' },
    { uk: 'UK / IN 9', cm: '26.1 cm' },
    { uk: 'UK / IN 10', cm: '26.6 cm' },
    { uk: 'UK / IN 11', cm: '27.1 cm' },
    { uk: 'UK / IN 12', cm: '27.6 cm' },
  ];

  const womensSizeData = [
    { uk: 'UK / IN 4', cm: '22.2 cm' },
    { uk: 'UK / IN 5', cm: '22.5 cm' },
    { uk: 'UK / IN 6', cm: '23.0 cm' },
    { uk: 'UK / IN 7', cm: '23.8 cm' },
    { uk: 'UK / IN 8', cm: '24.2 cm' },
    { uk: 'UK / IN 9', cm: '24.7 cm' },
    { uk: 'UK / IN 10', cm: '25.0 cm' },
  ];

  const kidsSizeData = [
    { uk: 'UK / IN 2', eur: '33', us: '4', cm: '22.4 cm', age: '8 Years' },
    { uk: 'UK / IN 3', eur: '34', us: '5', cm: '23.2 cm', age: '9-10 Years' },
    { uk: 'UK / IN 4', eur: '35', us: '6', cm: '24.0 cm', age: '11-12 Years' },
    { uk: 'UK / IN 5', eur: '36', us: '7', cm: '24.6 cm', age: '12-13 Years' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar font-mono text-neutral-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/80 text-red-600 border border-red-200 dark:border-red-800">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block">
                BLISS BALANCE FOOTWEAR
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-950 dark:text-white">
                OFFICIAL SIZE GUIDE
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-red-600 hover:text-white transition-all duration-200"
            aria-label="Close Size Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gender Category Tab Slider */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          {(['Men', 'Women', 'Kids'] as const).map((gender) => (
            <button
              key={gender}
              onClick={() => setActiveGenderTab(gender)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                activeGenderTab === gender
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
              }`}
            >
              {gender === 'Men' ? "MEN'S CHART" : gender === 'Women' ? "WOMEN'S CHART" : "KIDS' CHART"}
            </button>
          ))}
        </div>

        {/* Dynamic Pro Tip / Special Note */}
        {activeGenderTab === 'Men' && (
          <div className="p-3.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs font-bold flex items-center gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>If your leg width is broad, we recommend choosing one size bigger.</span>
          </div>
        )}

        {activeGenderTab === 'Women' && (
          <div className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-200 text-xs font-bold flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Comfort that fits you perfectly — because the right size makes all the difference!</span>
          </div>
        )}

        {activeGenderTab === 'Kids' && (
          <div className="p-3.5 rounded-xl bg-sky-50/80 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-sky-950 dark:text-sky-200 text-xs font-bold flex items-center gap-2.5">
            <Footprints className="w-4 h-4 text-sky-600 shrink-0" />
            <span>Engineered lightweight clogs & crocs designed for kids active daily playtime.</span>
          </div>
        )}

        {/* Dynamic Data Table */}
        <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-900 text-white dark:bg-neutral-900 font-black uppercase tracking-wider text-[11px]">
                {activeGenderTab === 'Kids' ? (
                  <>
                    <th className="py-3 px-4">UK / IN SIZE</th>
                    <th className="py-3 px-4">EURO</th>
                    <th className="py-3 px-4">US SIZE</th>
                    <th className="py-3 px-4">LENGTH (CM)</th>
                    <th className="py-3 px-4">AGE</th>
                  </>
                ) : (
                  <>
                    <th className="py-3.5 px-4">UK & INDIA SIZE</th>
                    <th className="py-3.5 px-4">FOOT LENGTH (CM)</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-black font-bold">
              {activeGenderTab === 'Men' &&
                mensSizeData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 font-black text-red-600">{row.uk}</td>
                    <td className="py-3 px-4 text-neutral-900 dark:text-neutral-100">{row.cm}</td>
                  </tr>
                ))}

              {activeGenderTab === 'Women' &&
                womensSizeData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 font-black text-red-600">{row.uk}</td>
                    <td className="py-3 px-4 text-neutral-900 dark:text-neutral-100">{row.cm}</td>
                  </tr>
                ))}

              {activeGenderTab === 'Kids' &&
                kidsSizeData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td className="py-3 px-4 font-black text-red-600">{row.uk}</td>
                    <td className="py-3 px-4 text-neutral-900 dark:text-neutral-100">{row.eur}</td>
                    <td className="py-3 px-4 text-neutral-900 dark:text-neutral-100">{row.us}</td>
                    <td className="py-3 px-4 text-neutral-900 dark:text-neutral-100">{row.cm}</td>
                    <td className="py-3 px-4 text-neutral-500 dark:text-neutral-400">{row.age}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* How to Measure Foot Guide */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-950/80 p-5 space-y-3">
          <h4 className="font-heading text-sm font-black uppercase text-neutral-950 dark:text-white flex items-center gap-2">
            <Footprints className="w-4 h-4 text-red-600" />
            <span>NOT SURE ABOUT YOUR FOOTWEAR SIZE?</span>
          </h4>

          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 font-bold leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <span>Place your foot flat on a blank sheet of paper.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <span>Make one marking at your longest toe and one marking at the back of your heel.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <span>Measure the distance between these two markings in centimeters (cm).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <span>Compare your measurement in CM with our size chart above to find your exact fit!</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-neutral-950 text-white font-black text-xs uppercase tracking-widest transition-all duration-200 shadow-sm"
        >
          CLOSE SIZE GUIDE
        </button>

      </div>
    </div>
  );
};
