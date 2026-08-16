'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FootwearSKU } from '@/lib/types';
import { Heart, Star, ExternalLink, ArrowRight } from 'lucide-react';

interface SkuCardProps {
  sku: FootwearSKU;
}

export const SkuCard: React.FC<SkuCardProps> = ({ sku }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bliss_balance_wishlist');
      if (stored) {
        const wishlistIds: string[] = JSON.parse(stored);
        setIsWishlisted(wishlistIds.includes(sku.id));
      }
    } catch (e) {}
  }, [sku.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const stored = localStorage.getItem('bliss_balance_wishlist');
      let wishlistIds: string[] = stored ? JSON.parse(stored) : [];
      if (wishlistIds.includes(sku.id)) {
        wishlistIds = wishlistIds.filter(id => id !== sku.id);
        setIsWishlisted(false);
      } else {
        wishlistIds.push(sku.id);
        setIsWishlisted(true);
      }
      localStorage.setItem('bliss_balance_wishlist', JSON.stringify(wishlistIds));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (e) {}
  };

  const discountPercent = sku.originalPrice
    ? Math.round(((sku.originalPrice - sku.price) / sku.originalPrice) * 100)
    : 0;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-red-600 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
    >
      <Link href={`/product?id=${sku.id}`} className="block flex-1 flex flex-col">
        
        {/* Product Image Container with Dual-Image Smooth Crossfade Hover */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950 p-4">
          
          {/* Primary Image */}
          {sku.imageUrl ? (
            <img
              src={sku.imageUrl}
              alt={sku.title}
              className={`w-full h-full object-cover rounded-xl transition-all duration-500 ${
                isHovered && sku.hoverImageUrl ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              }`}
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-mono text-xs text-neutral-400">
              NO IMAGE
            </div>
          )}

          {/* Secondary Hover Image (Comet Style) */}
          {sku.hoverImageUrl && (
            <img
              src={sku.hoverImageUrl}
              alt={`${sku.title} detail`}
              className={`absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-cover rounded-xl transition-all duration-500 ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}

          {/* Top Badges (Gender, Discount, Wishlist) */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-red-600 text-white px-2 py-0.5 rounded shadow-sm">
                {sku.gender}
              </span>
              {discountPercent > 0 && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-neutral-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/40 shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
                isWishlisted
                  ? 'bg-red-600 text-white scale-110'
                  : 'bg-white/80 dark:bg-black/80 text-neutral-600 dark:text-neutral-300 hover:text-red-600 hover:scale-110'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Details & Price */}
        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-red-600 uppercase">
                {sku.category}
              </span>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{sku.rating || '5.0'}</span>
              </div>
            </div>

            <h3 className="font-heading text-lg font-bold text-neutral-950 dark:text-white uppercase tracking-tight group-hover:text-red-600 transition-colors line-clamp-1">
              {sku.title}
            </h3>

            <p className="font-body text-xs text-neutral-500 line-clamp-1">
              {sku.subtitle}
            </p>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-baseline gap-2 font-mono">
              <span className="text-base font-extrabold text-neutral-950 dark:text-white">
                ₹{sku.price.toLocaleString('en-IN')}
              </span>
              {sku.originalPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{sku.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-red-600 group-hover:translate-x-1 transition-transform">
              <span>VIEW</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>

      </Link>
    </div>
  );
};
