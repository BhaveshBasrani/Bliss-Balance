'use client';

import React from 'react';
import { Truck, RefreshCw, Banknote } from 'lucide-react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Truck,
      title: 'FREE EXPRESS SHIPPING',
      subtitle: 'All India • 3-5 Business Days',
    },
    {
      icon: RefreshCw,
      title: 'EASY EXCHANGE & RETURNS',
      subtitle: '7-Day Hassle-Free Exchange • Free Size Swap',
    },
    {
      icon: Banknote,
      title: 'CASH ON DELIVERY',
      subtitle: 'Available Nationwide across India',
    },
  ];

  return (
    <section className="py-12 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-4 hover:border-red-600 transition-all shadow-xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-heading text-base font-black text-neutral-950 dark:text-white uppercase tracking-wide">
                    {item.title}
                  </h4>
                  <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
