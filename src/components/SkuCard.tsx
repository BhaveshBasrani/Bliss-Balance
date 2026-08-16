'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';
import { FootwearSKU } from '@/lib/types';

interface SkuCardProps {
  sku: FootwearSKU;
}

export const SkuCard: React.FC<SkuCardProps> = ({ sku }) => {
  const discountPercent = sku.originalPrice
    ? Math.round(((sku.originalPrice - sku.price) / sku.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
      
      {/* Top Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
        {sku.isNewArrival && (
          <span className="bg-red-600 text-white font-mono text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded shadow">
            NEW ARRIVAL
          </span>
        )}
        {sku.isBestseller && (
          <span className="bg-neutral-900 text-white font-mono text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded shadow">
            BESTSELLER
          </span>
        )}
      </div>

      {/* Product Image Spec Banner */}
      <div className="p-3">
        <ImagePlaceholder
          dimensions={sku.imageDimensions || "800 x 800 px (1:1 Product Square)"}
          aspectRatio="aspect-square"
          label={sku.title}
          imageUrl={sku.imageUrl}
        />
      </div>

      {/* Product Details Content */}
      <div className="p-5 pt-2 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              {sku.gender} • {sku.category}
            </span>
            {discountPercent > 0 && (
              <span className="text-[10px] font-mono font-extrabold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                SAVE {discountPercent}%
              </span>
            )}
          </div>

          <h3 className="font-heading text-xl font-bold text-neutral-950 dark:text-white uppercase tracking-wide group-hover:text-red-600 transition-colors">
            {sku.title}
          </h3>

          <p className="font-body text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
            {sku.subtitle}
          </p>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap gap-1 pt-1">
          {sku.features.slice(0, 3).map((feat, idx) => (
            <span
              key={idx}
              className="text-[9px] font-mono text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700"
            >
              {feat}
            </span>
          ))}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-heading text-2xl font-black text-neutral-950 dark:text-white">
              ₹{sku.price.toLocaleString('en-IN')}
            </span>
            {sku.originalPrice && (
              <span className="font-mono text-xs text-neutral-400 line-through">
                ₹{sku.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[10px] font-mono text-neutral-400 ml-auto">INCL. TAXES</span>
          </div>

          {/* Marketplace Direct Redirect Buttons (Amazon & Myntra) */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={sku.amazonUrl || 'https://www.amazon.in'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-mono font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all"
            >
              <span>AMAZON</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={sku.myntraUrl || 'https://www.myntra.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-mono font-bold text-[11px] uppercase tracking-wider shadow-sm transition-all"
            >
              <span>MYNTRA</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
