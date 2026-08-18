'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { FootwearSKU } from '@/lib/types';
import { getStoredSKUs } from '@/lib/dataStore';
import { EmptyShoeBoxSvg } from './EmptyShoeBoxSvg';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({ isOpen, onClose }) => {
  const [wishlistSkus, setWishlistSkus] = useState<FootwearSKU[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadWishlist();
    }
  }, [isOpen]);

  const loadWishlist = () => {
    try {
      const storedIds = localStorage.getItem('bliss_balance_wishlist');
      if (storedIds) {
        const ids: string[] = JSON.parse(storedIds);
        const allSkus = getStoredSKUs();
        const filtered = allSkus.filter(s => ids.some(id => id.toLowerCase() === s.id.toLowerCase()));
        setWishlistSkus(filtered);
      } else {
        setWishlistSkus([]);
      }
    } catch (e) {
      setWishlistSkus([]);
    }
  };

  const removeFromWishlist = (id: string) => {
    try {
      const storedIds = localStorage.getItem('bliss_balance_wishlist');
      if (storedIds) {
        const ids: string[] = JSON.parse(storedIds);
        const updated = ids.filter(i => i !== id);
        localStorage.setItem('bliss_balance_wishlist', JSON.stringify(updated));
        loadWishlist();
        window.dispatchEvent(new Event('wishlist-updated'));
      }
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-100 rounded-none max-w-lg w-full p-6 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto font-mono text-neutral-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-neutral-900 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            <h2 className="font-heading text-2xl font-black uppercase tracking-wider text-neutral-950 dark:text-white">
              MY WISHLIST ({wishlistSkus.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-none bg-neutral-100 dark:bg-neutral-900 border border-neutral-900 dark:border-neutral-100 hover:bg-red-600 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Empty Wishlist View featuring Shoe Box with Logo Emblem Inside */}
        {wishlistSkus.length === 0 ? (
          <div className="text-center py-6 space-y-5">
            <EmptyShoeBoxSvg className="w-44 h-44 mx-auto" />
            
            <div className="space-y-1">
              <p className="text-xs text-neutral-950 dark:text-white font-black uppercase tracking-wider">
                YOUR WISHLIST IS EMPTY
              </p>
              <p className="text-[11px] text-neutral-500 max-w-xs mx-auto font-bold">
                Save your favorite slippers, slides, sandals, and sneakers by clicking the heart button!
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3.5 rounded-none bg-black text-white dark:bg-white dark:text-black font-black text-xs uppercase tracking-widest border-2 border-black dark:border-white hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-md"
            >
              EXPLORE FOOTWEAR
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlistSkus.map((sku) => (
              <div
                key={sku.id}
                className="p-3 rounded-none bg-neutral-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {sku.imageUrl ? (
                    <img src={sku.imageUrl} alt={sku.title} className="w-14 h-14 object-cover rounded-none border border-neutral-900 dark:border-neutral-800" />
                  ) : (
                    <div className="w-14 h-14 bg-neutral-200 dark:bg-neutral-800 rounded-none" />
                  )}
                  <div>
                    <span className="text-[9px] font-black text-red-600 uppercase">{sku.gender} • {sku.category}</span>
                    <h4 className="font-heading text-sm font-black uppercase text-neutral-950 dark:text-white line-clamp-1">{sku.title}</h4>
                    <span className="text-xs font-black text-neutral-950 dark:text-white">₹{sku.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/product?id=${sku.id}`}
                    onClick={onClose}
                    className="p-2 rounded-none bg-red-600 text-white font-black text-xs flex items-center gap-1 hover:bg-neutral-950 transition-all border border-red-600"
                  >
                    <span>BUY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(sku.id)}
                    className="p-2 rounded-none bg-white dark:bg-black border border-neutral-900 dark:border-neutral-800 text-neutral-400 hover:text-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
