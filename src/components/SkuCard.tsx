'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FootwearSKU, ColorVariant } from '@/lib/types';
import { prefetchProduct } from '@/lib/dataStore';
import { Heart } from 'lucide-react';

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

  const effectiveColor = previewColor || activeColor;
  const currentImage = effectiveColor?.imageUrl ? effectiveColor.imageUrl : sku.imageUrl;

  const hoverImage =
    (effectiveColor as any)?.hoverImageUrl && (effectiveColor as any).hoverImageUrl !== currentImage
      ? (effectiveColor as any).hoverImageUrl
      : safeColorVariants.length > 0 && effectiveColor?.name === safeColorVariants[0]?.name && sku.hoverImageUrl && sku.hoverImageUrl !== currentImage
      ? sku.hoverImageUrl
      : null;

  const isDefaultVariant = !activeColor || (safeColorVariants.length > 0 && activeColor.name === safeColorVariants[0].name);
  const showHover = isHovered && !previewColor && isDefaultVariant && Boolean(hoverImage);

  // Clean Model Name format (e.g. "FREESTYLE", "BB158", "CORTADO")
  const primaryTitle = sku.title?.trim() || sku.id;
  const subtitleLabel = sku.subtitle?.trim() || sku.category;

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
    setTimeout(() => { window.location.href = target; }, 380);
  };

  const badgeLabel = tagText || (
    bestsellerRank !== undefined ? `#${bestsellerRank} BESTSELLER`
    : sku.isNewArrival ? 'NEW LAUNCH'
    : sku.isBestseller ? 'HOT DROP'
    : null
  );

  return (
    <div
      onMouseEnter={() => { setIsHovered(true); prefetchProduct(sku); }}
      onMouseLeave={() => { setIsHovered(false); setPreviewColor(null); }}
      className="group relative bg-white dark:bg-[#111111] flex flex-col select-none h-full transition-colors"
    >
      <Link href={productUrl} className="block flex-1 flex flex-col">

        {/* ── SEAMLESS CANVAS (Comet Signature Aesthetic) ─────────────── */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#FAFAFA] dark:bg-[#151515] flex items-center justify-center">

          {/* Top Badge: Clean Minimal Launch Tag */}
          <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 flex items-center gap-1.5 pointer-events-none">
            {badgeLabel && (
              <span className="text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 shadow-sm">
                {badgeLabel}
              </span>
            )}
          </div>

          {/* Top Right: Minimal Heart Wishlist Button */}
          <button
            type="button"
            onClick={toggleWishlist}
            aria-label={isWishlisted ? `Remove ${sku.title} from wishlist` : `Add ${sku.title} to wishlist`}
            className={`absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 p-1.5 sm:p-2 z-10 transition-all active:scale-90 ${
              isWishlisted
                ? 'text-black dark:text-white'
                : 'text-neutral-300 dark:text-neutral-600 hover:text-black dark:hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-black dark:fill-white' : ''}`} />
          </button>

          {/* Primary Shoe Image */}
          {currentImage ? (
            <img
              key={currentImage}
              src={currentImage}
              alt={`${sku.title} ${effectiveColor?.name || ''}`}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-contain p-4 sm:p-7 transition-all duration-500 ease-out ${
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
              className="absolute inset-0 w-full h-full object-contain p-4 sm:p-7 transition-all duration-500 scale-105 opacity-100 pointer-events-none"
            />
          )}

          {/* Slide-Up Quick Size Selector On Hover */}
          <div className="hidden sm:block absolute inset-x-0 bottom-0 z-20 pointer-events-none translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <div className="bg-white/98 dark:bg-black/98 border-t border-neutral-200 dark:border-neutral-800 p-2 pointer-events-auto shadow-lg">
              <div className="flex items-center justify-between px-1 pb-1 text-[8px] font-mono font-bold uppercase tracking-widest text-neutral-400">
                <span>Select Size</span>
                <span className="text-black dark:text-white font-black">Buy Now</span>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {availableSizes.slice(0, 6).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={(e) => handleQuickSize(e, sz)}
                    className={`py-1 text-[9px] font-mono font-black uppercase text-center border transition-all ${
                      selectedSize === sz && quickAdded
                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                        : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-black hover:text-white hover:border-black dark:hover:bg-white dark:hover:text-black dark:hover:border-white'
                    }`}
                  >
                    {sz.replace(/UK\s*/i, '')}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── CLEAN COMET 2-LINE PRODUCT INFO ─────────────────────────── */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#111111] border-t border-neutral-100 dark:border-neutral-800/80 space-y-1">
          
          {/* Row 1: Model Name + Price */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-heading text-xs sm:text-sm md:text-base font-black text-neutral-950 dark:text-white tracking-tight uppercase truncate">
              {primaryTitle}
            </h3>

            <div className="flex items-baseline gap-1 shrink-0">
              <span className="font-heading font-black text-xs sm:text-sm md:text-base text-neutral-950 dark:text-white tracking-tight">
                ₹ {sku.price.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Row 2: Category / Silhouette Subtitle + Swatches */}
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-[10px] sm:text-[11px] text-neutral-400 dark:text-neutral-500 font-medium truncate">
              {subtitleLabel}
            </p>

            {/* Discreet color swatches on desktop */}
            {safeColorVariants.length > 1 && (
              <div
                className="hidden sm:flex items-center gap-1 shrink-0"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                {safeColorVariants.slice(0, 3).map((cv) => {
                  const isSelected = (previewColor?.name || activeColor?.name) === cv.name;
                  return (
                    <button
                      key={cv.name}
                      type="button"
                      aria-label={cv.name}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveColor(cv); }}
                      onMouseEnter={() => setPreviewColor(cv)}
                      onMouseLeave={() => setPreviewColor(null)}
                      className={`w-2.5 h-2.5 border transition-all ${
                        isSelected
                          ? 'border-black dark:border-white ring-1 ring-black dark:ring-white scale-110'
                          : 'border-neutral-300 dark:border-neutral-700 opacity-60 hover:opacity-100'
                      }`}
                      style={{ background: cv.hex }}
                      title={cv.name}
                    />
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </Link>
    </div>
  );
};
