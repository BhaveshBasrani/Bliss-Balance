'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FootwearSKU, ColorVariant } from '@/lib/types';
import { prefetchProduct } from '@/lib/dataStore';
import { Heart, Star, ArrowRight, TrendingUp } from 'lucide-react';

interface SkuCardProps {
  sku: FootwearSKU;
  bestsellerRank?: number;
  hideGenderBadge?: boolean;
}

export const SkuCard: React.FC<SkuCardProps> = ({ sku, bestsellerRank, hideGenderBadge }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeColor, setActiveColor] = useState<ColorVariant | null>(
    sku.colorVariants && sku.colorVariants.length > 0 ? sku.colorVariants[0] : null
  );

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

  // Resolve Primary Active Image
  const currentImage = activeColor && activeColor.imageUrl
    ? activeColor.imageUrl
    : sku.imageUrl;

  // Resolve Secondary Hover Image with Smart Fallbacks
  const hoverImage = (sku.hoverImageUrl && sku.hoverImageUrl.trim() !== '' && sku.hoverImageUrl !== currentImage)
    ? sku.hoverImageUrl
    : (sku.galleryImages && sku.galleryImages.length > 0 && sku.galleryImages.find(img => img && img !== currentImage))
    ? sku.galleryImages.find(img => img && img !== currentImage)
    : (sku.colorVariants && sku.colorVariants.length > 1 && sku.colorVariants.find(cv => cv.imageUrl && cv.imageUrl !== currentImage)?.imageUrl)
    ? sku.colorVariants.find(cv => cv.imageUrl && cv.imageUrl !== currentImage)!.imageUrl
    : null;

  const handleMouseEnter = () => {
    setIsHovered(true);
    // Directive 7: Prefetch product data & images instantly on hover
    prefetchProduct(sku);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-xl overflow-hidden bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 hover:border-red-600 dark:hover:border-red-500 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between"
    >
      <Link href={`/product/${sku.id}`} className="block flex-1 flex flex-col">
        
        {/* Product Image Container with Ultra-Smooth Dual-Image Crossfade Animation */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
          
          {/* Primary / Active Image */}
          {currentImage ? (
            <img
              src={currentImage}
              alt={sku.title}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isHovered && hoverImage
                  ? 'opacity-0 scale-105 blur-[0.5px]'
                  : isHovered
                  ? 'scale-105 brightness-105'
                  : 'opacity-100 scale-100'
              }`}
            />
          ) : (
            <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-mono text-xs text-neutral-400">
              NO IMAGE
            </div>
          )}

          {/* Secondary Alternate Hover Image (Instant Smooth Crossfade on Hover) */}
          {hoverImage && (
            <img
              src={hoverImage}
              alt={`${sku.title} hover preview`}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
                isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          )}

          {/* Top Badges (Bestseller, Gender, Discount, Wishlist) */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10 pointer-events-none">
            <div className="flex items-center gap-1.5 pointer-events-auto">
              {bestsellerRank !== undefined ? (
                <span className="text-[9px] font-mono font-black uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  #{bestsellerRank} BESTSELLER
                </span>
              ) : (
                <>
                  {!hideGenderBadge && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black/85 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {sku.gender}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md backdrop-blur-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={toggleWishlist}
              aria-label={isWishlisted ? `Remove ${sku.title} from Wishlist` : `Add ${sku.title} to Wishlist`}
              className={`p-1.5 rounded-md transition-all duration-200 border pointer-events-auto ${
                isWishlisted
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white/90 dark:bg-black/90 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800 hover:text-red-600 backdrop-blur-xs'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Details, Color Swatches & Price */}
        <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-3 flex-1 flex flex-col justify-between font-mono">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] sm:text-[10px] font-black text-red-600 uppercase">
                {sku.category}
              </span>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-black text-amber-500">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
                <span>{sku.rating || '5.0'}</span>
              </div>
            </div>

            <span className="font-heading block text-xs sm:text-base font-black text-neutral-950 dark:text-white uppercase tracking-tight group-hover:text-red-600 transition-colors line-clamp-1">
              {sku.title}
            </span>

            <p className="font-mono text-[10px] sm:text-xs text-neutral-500 line-clamp-1 font-bold">
              {sku.subtitle}
            </p>

            {/* INTERACTIVE LUXURY COLOR SWATCHES BAR ON CATALOG CARD */}
            {Array.isArray(sku?.colorVariants) && sku.colorVariants.length > 0 && (
              <div className="flex items-center justify-between gap-1.5 pt-1" onClick={(e) => e.preventDefault()}>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {sku.colorVariants.map((cv) => {
                    const isSelected = activeColor?.name === cv.name;
                    return (
                      <button
                        key={cv.name}
                        type="button"
                        aria-label={`Select ${cv.name} color variant for ${sku.title}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveColor(cv);
                        }}
                        onMouseEnter={() => setActiveColor(cv)}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-200 relative group/swatch ${
                          isSelected
                            ? 'ring-2 ring-red-600 ring-offset-2 ring-offset-white dark:ring-offset-black scale-110 shadow-xs'
                            : 'border border-black/15 dark:border-white/25 opacity-80 hover:opacity-100 hover:scale-115'
                        }`}
                        style={{ backgroundColor: cv.hex }}
                        title={cv.name}
                      >
                        {isSelected && (
                          <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-black/20 pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-1.5 py-0.5 rounded-full tracking-wider uppercase ml-1 shrink-0">
                  {sku.colorVariants.length} {sku.colorVariants.length === 1 ? 'COLOR' : 'COLORS'}
                </span>
              </div>
            )}
          </div>

          <div className="pt-1.5 sm:pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-xs sm:text-base font-black text-neutral-950 dark:text-white">
                ₹{sku.price.toLocaleString('en-IN')}
              </span>
              {sku.originalPrice && (
                <span className="text-[9px] sm:text-xs text-neutral-400 line-through">
                  ₹{sku.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-black text-red-600 group-hover:translate-x-1 transition-transform duration-300 uppercase">
              <span>VIEW</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </span>
          </div>

        </div>

      </Link>
    </div>
  );
};
