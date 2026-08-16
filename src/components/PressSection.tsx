'use client';

import React from 'react';

export const PressSection: React.FC = () => {
  const pressLogos = [
    { name: 'YOURSTORY', label: 'YOURSTORY' },
    { name: 'INC42', label: 'Inc42' },
    { name: 'ECONOMIC TIMES', label: 'THE ECONOMIC TIMES' },
    { name: 'VOGUE INDIA', label: 'VOGUE' },
  ];

  return (
    <section className="py-14 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <div className="space-y-1">
          <span className="font-heading text-xl font-black uppercase text-neutral-900 dark:text-white tracking-wider">
            AS SEEN ON
          </span>
          <p className="font-mono text-xs text-neutral-500">
            Press and feature coverage since launch.
          </p>
        </div>

        {/* Press Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-2">
          {pressLogos.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center font-heading text-lg font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-widest hover:border-red-600 transition-colors shadow-xs"
            >
              {item.label}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
