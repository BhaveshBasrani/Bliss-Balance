'use client';

import React from 'react';
import { HeartPulse, Feather, ShieldCheck, Sparkles, Compass } from 'lucide-react';

export const KeyFeatures: React.FC = () => {
  const features = [
    {
      icon: HeartPulse,
      title: 'COMFORT FIRST',
      desc: 'Designed with cushioning and comfortable materials for everyday wear.',
    },
    {
      icon: Feather,
      title: 'LIGHTWEIGHT FEEL',
      desc: 'Footwear designed to keep your steps easy and comfortable throughout the day.',
    },
    {
      icon: ShieldCheck,
      title: 'RELIABLE GRIP',
      desc: 'Selected styles feature textured and anti-skid outsole designs for everyday stability.',
    },
    {
      icon: Sparkles,
      title: 'MODERN DESIGNS',
      desc: 'Contemporary silhouettes that combine everyday practicality with effortless style.',
    },
    {
      icon: Compass,
      title: 'MADE FOR EVERYDAY LIFE',
      desc: 'From home and work to travel and casual outings, designed to fit naturally into your daily routine.',
    },
  ];

  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-red-600 uppercase bg-red-50 dark:bg-red-950 px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
            THE BLISS BALANCE DIFFERENCE
          </span>
          <h2 className="font-heading text-4xl sm:text-5xl font-black text-neutral-950 dark:text-white uppercase tracking-tight">
            CRAFTED FOR YOUR <span className="text-red-600">EVERYDAY STEP</span>
          </h2>
          <p className="font-body text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">
            We focus on soft comfort, practical design, contemporary aesthetics, and everyday versatility.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-neutral-950 dark:text-white tracking-wide uppercase mb-2 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase">
                  <span>SPEC 0{idx + 1}</span>
                  <span className="text-red-600">BLISS CORE</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
