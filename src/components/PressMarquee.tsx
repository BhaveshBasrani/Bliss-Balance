'use client';

import React from 'react';

export const PressMarquee: React.FC = () => {
  const storePartners = [
    { name: 'AMAZON', desc: 'Prime Delivery & Verified Store' },
    { name: 'FLIPKART', desc: 'Plus Assured Partner' },
    { name: 'MYNTRA', desc: 'Curated Fashion Drop' },
  ];

  return (
    <section className="py-14 sm:py-20 bg-brand-warm dark:bg-black border-y border-neutral-200/60 dark:border-neutral-800/60 overflow-hidden select-none font-body">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 text-center space-y-6">
        <span className="text-[11px] font-medium tracking-[0.25em] text-brand-stone uppercase block">
          Available on India&apos;s Leading Platforms
        </span>

        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-20 text-brand-black dark:text-white">
          {storePartners.map((store) => (
            <div key={store.name} className="flex flex-col items-center group cursor-default transition-transform hover:-translate-y-0.5">
              <span className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-neutral-800 dark:text-neutral-200 group-hover:text-brand-black dark:group-hover:text-white transition-colors duration-200">
                {store.name}
              </span>
              <span className="text-[10px] text-brand-stone uppercase tracking-wider font-medium mt-0.5">
                {store.desc}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
