'use client';

import React from 'react';
import { Play, Sparkles } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-24 bg-neutral-950 text-white border-b border-neutral-800">
      {/* Background Graphic Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950 border border-red-800 text-red-400 text-xs font-mono font-bold tracking-widest uppercase">
          <Sparkles className="w-4 h-4 text-red-500" />
          CRAFT & PRECISION
        </div>

        <h2 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
          <span className="text-red-500 italic font-serif">MAKING OF</span> BLISS BALANCE
        </h2>

        <p className="font-body text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          From high-grade cushioned EVA footbeds to textured anti-skid outsoles, every pair of Bliss Balance footwear is precision-crafted for everyday stability and lightweight comfort.
        </p>

        {/* Play Video Trigger Frame */}
        <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 aspect-[16/9] flex items-center justify-center group cursor-pointer shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-red-600/90 text-white flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-current" />
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span>BLISS BALANCE LAB V2.0</span>
            <span>MADE IN INDIA</span>
          </div>
        </div>

      </div>
    </section>
  );
};
