'use client';

import React from 'react';
import { FootwearSKU } from '@/lib/types';
import { ArrowRight } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';

interface SkuCardProps {
  sku: FootwearSKU;
}

export const SkuCard: React.FC<SkuCardProps> = ({ sku }) => {
  const discountPercent = sku.originalPrice && sku.originalPrice > sku.price
    ? Math.round(((sku.originalPrice - sku.price) / sku.originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-red-600 transition-all duration-300 shadow-xs flex flex-col justify-between">
      
      {/* Product Image Container */}
      <div className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
        {sku.imageUrl && sku.imageUrl.trim() !== '' ? (
          <img
            src={sku.imageUrl}
            alt={sku.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ImagePlaceholder
            dimensions="800 x 800 px (1:1)"
            aspectRatio="aspect-square"
            label="PRODUCT PHOTO"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {sku.isNewArrival && (
            <span className="px-3 py-1 rounded-full bg-red-600 text-white font-mono text-[10px] font-black uppercase tracking-widest shadow-md">
              NEW
            </span>
          )}
          {discountPercent && (
            <span className="px-3 py-1 rounded-full bg-neutral-950 text-white font-mono text-[10px] font-bold uppercase tracking-widest shadow-md">
              {discountPercent}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-500 dark:text-neutral-400 uppercase">
            <span>{sku.gender} • {sku.category}</span>
          </div>

          <h3 className="font-heading text-lg font-black text-neutral-950 dark:text-white uppercase group-hover:text-red-600 transition-colors leading-snug">
            {sku.title}
          </h3>

          <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {sku.subtitle}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
          
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-black text-neutral-950 dark:text-white">
              ₹{sku.price.toLocaleString('en-IN')}
            </span>
            {sku.originalPrice && (
              <span className="font-mono text-xs text-neutral-400 line-through">
                ₹{sku.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <button className="p-3 rounded-xl bg-neutral-950 dark:bg-neutral-800 text-white hover:bg-red-600 transition-all font-heading text-xs font-bold uppercase flex items-center gap-1.5 shadow-xs">
            <span>ADD</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>

    </div>
  );
};
