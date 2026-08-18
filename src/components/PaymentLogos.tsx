'use client';

import React from 'react';

export const PaymentLogos: React.FC = () => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Amex Badge (Blue Box with AMEX) */}
      <div className="h-8 px-2.5 rounded-md bg-[#006FCF] text-white font-mono font-black text-[10px] flex items-center justify-center tracking-tighter shadow-sm border border-white/20">
        AMEX
      </div>

      {/* Diners Club Badge (White Box with Blue Double Circles) */}
      <div className="h-8 px-3 rounded-md bg-white border border-neutral-300 flex items-center justify-center gap-1 shadow-sm">
        <div className="flex items-center -space-x-1">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-[#004A97]" />
          <div className="w-3.5 h-3.5 rounded-full bg-[#004A97]" />
        </div>
      </div>

      {/* Mastercard Light Badge (White Box with Red & Blue Circles) */}
      <div className="h-8 px-3 rounded-md bg-white border border-neutral-300 flex items-center justify-center shadow-sm">
        <div className="flex items-center -space-x-1.5">
          <div className="w-4 h-4 rounded-full bg-[#EB001B]" />
          <div className="w-4 h-4 rounded-full bg-[#0099DF] opacity-90" />
        </div>
      </div>

      {/* Mastercard Dark Badge (Dark Box with Red & Yellow Circles) */}
      <div className="h-8 px-3 rounded-md bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-sm">
        <div className="flex items-center -space-x-1.5">
          <div className="w-4 h-4 rounded-full bg-[#EB001B]" />
          <div className="w-4 h-4 rounded-full bg-[#FF5F00] opacity-90" />
        </div>
      </div>

      {/* RuPay Badge (White Box with RuPay Text) */}
      <div className="h-8 px-3 rounded-md bg-white border border-neutral-300 flex items-center justify-center shadow-sm">
        <span className="font-mono font-black italic text-[#272B78] text-[11px]">
          RuPay<span className="text-[#F37021] font-sans font-bold">›</span>
        </span>
      </div>

      {/* Visa Badge (Blue Box with VISA) */}
      <div className="h-8 px-3.5 rounded-md bg-[#1A1F71] text-white font-heading font-black italic text-xs tracking-wider flex items-center justify-center shadow-sm border border-white/20">
        VISA
      </div>
    </div>
  );
};
