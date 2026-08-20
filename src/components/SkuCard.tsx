'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FootwearSKU, ColorVariant } from '@/lib/types';
import { prefetchProduct } from '@/lib/dataStore';
import { Heart, Star, ArrowUpRight } from 'lucide-react';

interface SkuCardProps {
  sku: FootwearSKU;
  bestsellerRank?: number;
  hideGenderBadge?: boolean;
}

export const SkuCard: React.FC<SkuCardProps> = ({ sku, bestsellerRank, hideGenderBadge }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeColor, setActiveColor] = useState<ColorVariant | null>(() => {
    if (!sku.colorVariants || sku.colorVariants.length === 0) return null;
    return sku.colorVariants.find(cv => cv.imageUrl === sku.imageUrl) || sku.colorVariants[0];
  });
  const [previewColor, setPreviewColor] = useState<ColorVariant | null>(null);
  const [isSwatchesHovered, setIsSwatchesHovered] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bliss_balance_wishlist');
      if (stored) {
        const wishlistIds: string[] = JSON.parse(stored);
        setIsWishlisted(wishlistIds.includes(sku.id));
      }
    } catch (e) {}
  }, [sku.id]);

  useEffect(() => {
    if (sku.colorVariants && sku.colorVariants.length > 0) {
      const match = sku.colorVariants.find(cv => cv.imageUrl === sku.imageUrl) || sku.colorVariants[0];
      setActiveColor(match);
    } else {
      setActiveColor(null);
    }
    setPreviewColor(null);
  }, [sku.id, sku.imageUrl, sku.colorVariants]);

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

  // Resolve Effective Color & Image
  const effectiveColor = previewColor || activeColor;
  const currentImage = effectiveColor && effectiveColor.imageUrl
    ? effectiveColor.imageUrl
    : sku.imageUrl;

  // Resolve Secondary Hover Image for the active color only (never cross to a different color)
  const hoverImage = (effectiveColor as any)?.hoverImageUrl && (effectiveColor as any).hoverImageUrl !== currentImage
    ? (effectiveColor as any).hoverImageUrl
    : (effectiveColor?.name === sku.colorVariants?.[0]?.name && sku.hoverImageUrl && sku.hoverImageUrl !== currentImage)
    ? sku.hoverImageUrl
    : null;

  // Only show hover angle image if:
  // 1) Card is hovered
  // 2) User is not actively previewing or hovering on color dots
  // 3) Either no custom variant is picked OR active variant is the default first one
  const isDefaultVariantActive = !activeColor || (sku.colorVariants && sku.colorVariants.length > 0 && activeColor.name === sku.colorVariants[0].name);
  const showHoverImage = isHovered && !isSwatchesHovered && !previewColor && isDefaultVariantActive && Boolean(hoverImage);

  const handleMouseEnter = () => {
    setIsHovered(true);
    prefetchProduct(sku);
  };

  const displayName = sku.subtitle && sku.subtitle.trim() !== ''
    ? sku.subtitle
    : sku.title;

  const productUrl = activeColor
    ? `/product/${encodeURIComponent(sku.id)}?color=${encodeURIComponent(activeColor.name)}`
    : `/product/${encodeURIComponent(sku.id)}`;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsSwatchesHovered(false);
        setPreviewColor(null);
      }}
      className="group relative rounded-2xl overflow-hidden bg-white dark:bg-[#121212] border border-neutral-200/70 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all duration-300 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-neutral-900/50"
    >
      <Link href={productUrl} className="block flex-1 flex flex-col">
        
        {/* Full-Bleed Product Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          
          {/* Primary Full Image */}
          {currentImage ? (
            <img
              key={currentImage}
              src={currentImage}
              alt={`${sku.title} ${effectiveColor ? effectiveColor.name : ''}`}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover transition-all duration-300 ease-out ${
                showHoverImage
                  ? 'opacity-0 scale-[1.04]'
                  : isHovered
                  ? 'scale-[1.05]'
                  : 'opacity-100 scale-100'
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-brand-stone">
              No Image
            </div>
          )}

          {/* Secondary Hover Image Crossfade */}
          {hoverImage && showHoverImage && (
            <img
              src={hoverImage}
              alt={`${sku.title} preview`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out scale-[1.04] opacity-100 pointer-events-none"
            />
          )}

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10 pointer-events-none">
            <div className="flex flex-col gap-1.5 pointer-events-auto">
              {bestsellerRank !== undefined && (
                <span className="text-[10px] font-body font-bold uppercase tracking-wider bg-brand-black text-white dark:bg-white dark:text-black px-2.5 py-0.5 rounded-full shadow-xs">
                  #{bestsellerRank} Bestseller
                </span>
              )}
              {discountPercent > 0 && bestsellerRank === undefined && (
                <span className="text-[10px] font-body font-bold bg-brand-red text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
              {!hideGenderBadge && bestsellerRank === undefined && !discountPercent && (
                <span className="text-[9px] font-body font-medium uppercase tracking-widest bg-black/40 text-white px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  {sku.gender}
                </span>
              )}
            </div>

            {/* Floating Wishlist Button */}
            <button
              type="button"
              onClick={toggleWishlist}
              aria-label={isWishlisted ? `Remove ${sku.title} from Wishlist` : `Add ${sku.title} to Wishlist`}
              className={`p-2 rounded-full transition-all duration-200 pointer-events-auto shadow-xs ${
                isWishlisted
                  ? 'bg-brand-red text-white'
                  : 'bg-white/95 dark:bg-black/80 text-brand-black dark:text-white hover:bg-brand-red hover:text-white backdrop-blur-sm'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Quick View Pill on Hover */}
          <div className="absolute bottom-3 inset-x-3 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="px-4 py-1.5 rounded-full bg-brand-black/90 dark:bg-white/95 text-white dark:text-black text-[11px] font-semibold uppercase tracking-wider shadow-md backdrop-blur-xs flex items-center gap-1">
              <span>View Silhouette</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Product Details Block */}
        <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            {/* Category & Rating */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-medium text-brand-stone uppercase tracking-wider font-body">
                {sku.category}
              </span>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{sku.rating || '4.9'}</span>
              </div>
            </div>

            {/* Main Product Title */}
            <h3 className="font-heading text-[15px] font-bold text-brand-black dark:text-white tracking-tight leading-snug line-clamp-1 group-hover:text-brand-red transition-colors duration-200">
              {displayName}
            </h3>

            {/* Model Subtitle / Code & Active Color indicator */}
            <p className="text-[11px] text-brand-stone line-clamp-1 font-medium">
              Model {sku.title} • {effectiveColor ? effectiveColor.name : 'Anti-Skid Grip'}
            </p>

            {/* Luxury Interactive Color Dots */}
            {Array.isArray(sku?.colorVariants) && sku.colorVariants.length > 0 && (
              <div
                className="flex items-center gap-1.5 pt-2 relative z-20"
                onMouseEnter={() => setIsSwatchesHovered(true)}
                onMouseLeave={() => {
                  setIsSwatchesHovered(false);
                  setPreviewColor(null);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {sku.colorVariants.map((cv) => {
                  const isSelected = (previewColor?.name || activeColor?.name) === cv.name;
                  return (
                    <button
                      key={cv.name}
                      type="button"
                      aria-label={`Select ${cv.name} color variant for ${sku.title}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveColor(cv);
                        setPreviewColor(null);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveColor(cv);
                        setPreviewColor(null);
                      }}
                      onMouseEnter={() => {
                        setPreviewColor(cv);
                      }}
                      onMouseLeave={() => {
                        setPreviewColor(null);
                      }}
                      className={`p-1 sm:p-0.5 rounded-full transition-all duration-200 cursor-pointer touch-manipulation ${
                        isSelected
                          ? 'ring-2 ring-brand-black dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#121212] scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      title={cv.name}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/15 dark:border-white/20 block shadow-2xs"
                        style={{ background: cv.hex }}
                      />
                    </button>
                  );
                })}
                <span className="text-[10px] font-medium text-brand-stone ml-1">
                  {sku.colorVariants.length} {sku.colorVariants.length === 1 ? 'Color' : 'Colors'}
                </span>
              </div>
            )}
          </div>

          {/* Pricing Row */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-heading font-extrabold text-brand-black dark:text-white">
                ₹{sku.price.toLocaleString('en-IN')}
              </span>
              {sku.originalPrice && (
                <span className="text-xs text-brand-stone line-through font-medium">
                  ₹{sku.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {discountPercent > 0 && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                Save ₹{(sku.originalPrice! - sku.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

        </div>

      </Link>
    </div>
  );
};
