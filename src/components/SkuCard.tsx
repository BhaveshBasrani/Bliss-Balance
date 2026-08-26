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
  tagText?: string;
}

export const SkuCard: React.FC<SkuCardProps> = ({ sku, bestsellerRank, hideGenderBadge, tagText }) => {
  const safeColorVariants: ColorVariant[] = Array.isArray(sku.colorVariants) ? sku.colorVariants : [];
  const availableSizes: string[] = Array.isArray(sku.sizes) && sku.sizes.length > 0 ? sku.sizes : ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'];

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activeColor, setActiveColor] = useState<ColorVariant | null>(() => {
    if (safeColorVariants.length === 0) return null;
    return safeColorVariants.find((cv) => cv.imageUrl === sku.imageUrl) || safeColorVariants[0];
  });
  const [previewColor, setPreviewColor] = useState<ColorVariant | null>(null);
  const [isSwatchesHovered, setIsSwatchesHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quickAdded, setQuickAdded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bliss_balance_wishlist');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        setIsWishlisted(ids.includes(sku.id));
      }
    } catch (e) {}
  }, [sku.id]);

  useEffect(() => {
    if (safeColorVariants.length > 0) {
      const match = safeColorVariants.find((cv) => cv.imageUrl === sku.imageUrl) || safeColorVariants[0];
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
      let ids: string[] = stored ? JSON.parse(stored) : [];
      if (ids.includes(sku.id)) {
        ids = ids.filter((id) => id !== sku.id);
        setIsWishlisted(false);
      } else {
        ids.push(sku.id);
        setIsWishlisted(true);
      }
      localStorage.setItem('bliss_balance_wishlist', JSON.stringify(ids));
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (e) {}
  };

  const discountPercent = sku.originalPrice
    ? Math.round(((sku.originalPrice - sku.price) / sku.originalPrice) * 100)
    : 0;

  const effectiveColor = previewColor || activeColor;
  const currentImage = effectiveColor?.imageUrl ? effectiveColor.imageUrl : sku.imageUrl;

  const hoverImage =
    (effectiveColor as any)?.hoverImageUrl && (effectiveColor as any).hoverImageUrl !== currentImage
      ? (effectiveColor as any).hoverImageUrl
      : safeColorVariants.length > 0 && effectiveColor?.name === safeColorVariants[0]?.name && sku.hoverImageUrl && sku.hoverImageUrl !== currentImage
      ? sku.hoverImageUrl
      : null;

  const isDefaultVariant = !activeColor || (safeColorVariants.length > 0 && activeColor.name === safeColorVariants[0].name);
  const showHover = isHovered && !isSwatchesHovered && !previewColor && isDefaultVariant && Boolean(hoverImage);

  const displayName = sku.subtitle && sku.subtitle.trim() !== '' ? sku.subtitle : sku.title;

  const productUrl = activeColor
    ? `/product/${encodeURIComponent(sku.id)}?color=${encodeURIComponent(activeColor.name)}`
    : `/product/${encodeURIComponent(sku.id)}`;

  const handleQuickSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSize(size);
    setQuickAdded(true);
    const sizeMap = sku.sizeMarketplaceUrls?.[size];
    const target = sizeMap?.amazonUrl || sku.amazonUrl || productUrl;
    setTimeout(() => { window.location.href = target; }, 420);
  };

  const badgeLabel = tagText || (
    bestsellerRank !== undefined ? `#${bestsellerRank} BESTSELLER`
    : sku.isNewArrival ? 'NEW DROP'
    : sku.isBestseller ? 'HOT SELLER'
    : discountPercent >= 20 ? `${discountPercent}% OFF`
    : null
  );

  const extraColors = safeColorVariants.length > 3 ? safeColorVariants.length - 3 : 0;
  const visibleSwatches = safeColorVariants.slice(0, 3);

  return (
    <div
      onMouseEnter={() => { setIsHovered(true); prefetchProduct(sku); }}
      onMouseLeave={() => { setIsHovered(false); setIsSwatchesHovered(false); setPreviewColor(null); }}
      className="group relative bg-white dark:bg-[#0D0D0D] flex flex-col select-none h-full transition-colors"
    >
      <Link href={productUrl} className="block flex-1 flex flex-col">

        {/* ── IMAGE CANVAS ─────────────────────────────────────────── */}
        <div className="relative aspect-square w-full overflow-hidden bg-white dark:bg-[#141414] flex items-center justify-center border-b border-neutral-100 dark:border-neutral-800">

          {/* Primary Image */}
          {currentImage ? (
            <img
              key={currentImage}
              src={currentImage}
              alt={`${sku.title} ${effectiveColor?.name || ''}`}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-contain p-3 sm:p-5 transition-transform duration-500 ease-out ${
                showHover ? 'opacity-0 scale-105' : isHovered ? 'scale-[1.06]' : 'scale-100'
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
              No Image
            </div>
          )}

          {/* Hover Image Crossfade */}
          {hoverImage && showHover && (
            <img
              src={hoverImage}
              alt={`${sku.title} alternate angle`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-contain p-3 sm:p-5 transition-all duration-500 scale-105 opacity-100 pointer-events-none"
            />
          )}

          {/* ── TOP BAR: Badge + Wishlist ── */}
          <div className="absolute top-0 left-0 right-0 flex items-start justify-between p-2 sm:p-2.5 z-10 pointer-events-none">
            {badgeLabel ? (
              <span className="text-[8px] sm:text-[9px] font-mono font-black uppercase tracking-wider sm:tracking-widest bg-black text-white dark:bg-white dark:text-black px-1.5 sm:px-2.5 py-0.5 sm:py-1 pointer-events-auto border border-black dark:border-white shadow-sm">
                {badgeLabel}
              </span>
            ) : <span />}

            <button
              type="button"
              onClick={toggleWishlist}
              aria-label={isWishlisted ? `Remove ${sku.title} from wishlist` : `Add ${sku.title} to wishlist`}
              className={`p-1.5 sm:p-2 pointer-events-auto transition-all duration-200 active:scale-90 border ${
                isWishlisted
                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                  : 'bg-white/95 dark:bg-black/90 text-black dark:text-white border-neutral-200 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
              }`}
            >
              <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* ── QUICK SIZE SELECTOR DRAWER ── */}
          <div className="hidden sm:block absolute inset-x-0 bottom-0 z-20 pointer-events-none translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-white/98 dark:bg-black/98 border-t border-neutral-200 dark:border-neutral-700 p-2 pointer-events-auto shadow-lg">
              <div className="flex items-center justify-between px-1 pb-1.5 text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                <span>Quick Size</span>
                <span className="text-black dark:text-white font-black">Select & Buy</span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {availableSizes.slice(0, 6).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={(e) => handleQuickSize(e, sz)}
                    className={`py-1.5 text-[9px] font-heading font-black uppercase tracking-tight text-center border transition-all ${
                      selectedSize === sz && quickAdded
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white'
                    }`}
                  >
                    {sz.replace(/UK\s*/i, '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── PRODUCT INFO BLOCK ───────────────────────────────────── */}
        <div className="p-2.5 sm:p-4 flex flex-col justify-between flex-1 gap-2 bg-white dark:bg-[#0D0D0D]">

          <div className="space-y-1 sm:space-y-1.5">
            {/* Category & Rating */}
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider truncate">
                {!hideGenderBadge && sku.gender ? `${sku.gender} · ` : ''}{sku.category}
              </span>
              {sku.rating && (
                <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-mono font-black text-neutral-900 dark:text-white shrink-0">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  {sku.rating}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h3 className="font-heading text-xs sm:text-sm md:text-base font-black text-neutral-950 dark:text-white tracking-tight uppercase leading-tight line-clamp-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
              {displayName}
            </h3>

            {/* Color Swatches & Active Color Name */}
            {visibleSwatches.length > 0 && (
              <div
                className="flex items-center gap-1 sm:gap-1.5 pt-0.5"
                onMouseEnter={() => setIsSwatchesHovered(true)}
                onMouseLeave={() => { setIsSwatchesHovered(false); setPreviewColor(null); }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                {visibleSwatches.map((cv) => {
                  const isSelected = (previewColor?.name || activeColor?.name) === cv.name;
                  return (
                    <button
                      key={cv.name}
                      type="button"
                      aria-label={cv.name}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveColor(cv); setPreviewColor(null); }}
                      onMouseEnter={() => setPreviewColor(cv)}
                      onMouseLeave={() => setPreviewColor(null)}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 border transition-all duration-150 ${
                        isSelected
                          ? 'border-black dark:border-white ring-1 ring-black dark:ring-white scale-110'
                          : 'border-neutral-300 dark:border-neutral-700 opacity-70 hover:opacity-100 hover:scale-110'
                      }`}
                      style={{ background: cv.hex }}
                      title={cv.name}
                    />
                  );
                })}
                {extraColors > 0 && (
                  <span className="text-[8px] sm:text-[9px] font-mono font-bold text-neutral-400">+{extraColors}</span>
                )}
                <span className="text-[8px] sm:text-[9px] font-mono text-neutral-400 dark:text-neutral-500 ml-auto truncate max-w-[70px] sm:max-w-[90px]">
                  {effectiveColor?.name || ''}
                </span>
              </div>
            )}
          </div>

          {/* Pricing Row */}
          <div className="flex items-center justify-between pt-1.5 sm:pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-sm sm:text-base md:text-lg font-heading font-black text-neutral-950 dark:text-white tracking-tight">
                ₹{sku.price.toLocaleString('en-IN')}
              </span>
              {sku.originalPrice && (
                <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-medium">
                  ₹{sku.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {discountPercent > 0 ? (
              <span className="text-[8px] sm:text-[9px] font-mono font-black uppercase text-black bg-[#E5FF00] px-1.5 sm:px-2 py-0.5 border border-black">
                −{discountPercent}%
              </span>
            ) : (
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            )}
          </div>

        </div>

      </Link>
    </div>
  );
};
