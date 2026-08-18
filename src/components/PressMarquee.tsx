'use client';

import React from 'react';

export const PressMarquee: React.FC = () => {
  const storePartners = [
    'AMAZON',
    'FLIPKART',
    'MYNTRA',
  ];

  return (
    <section className="py-8 bg-white dark:bg-black border-b-2 border-neutral-900 dark:border-neutral-800 overflow-hidden select-none font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-[10px] font-black tracking-[0.35em] text-red-600 uppercase block">
          OFFICIAL ONLINE STORES & PARTNERS
        </span>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-neutral-900 dark:text-neutral-100 font-heading font-black text-lg sm:text-2xl tracking-tighter">
          {storePartners.map((store) => (
            <span
              key={store}
              className="hover:text-red-600 transition-colors uppercase border-b-2 border-transparent hover:border-red-600 cursor-default"
            >
              {store}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
