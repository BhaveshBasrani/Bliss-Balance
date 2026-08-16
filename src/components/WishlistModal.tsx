'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Heart, Trash2, ArrowRight } from 'lucide-react';
import { FootwearSKU } from '@/lib/types';
import { getStoredSKUs } from '@/lib/dataStore';

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
        const filtered = allSkus.filter(s => ids.includes(s.id));
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
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative max-h-[85vh] overflow-y-auto font-mono text-neutral-900 dark:text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            <h2 className="font-heading text-2xl font-black uppercase tracking-wider text-neutral-950 dark:text-white">
              MY WISHLIST ({wishlistSkus.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-600 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Items List */}
        {wishlistSkus.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Heart className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto" />
            <p className="text-xs text-neutral-500 font-bold uppercase">
              YOUR WISHLIST IS EMPTY
            </p>
            <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
              Save your favorite slippers, slides, sandals, and sneakers by clicking the heart button!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlistSkus.map((sku) => (
              <div
                key={sku.id}
                className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  {sku.imageUrl ? (
                    <img src={sku.imageUrl} alt={sku.title} className="w-14 h-14 object-cover rounded-xl border border-neutral-200 dark:border-neutral-800" />
                  ) : (
                    <div className="w-14 h-14 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                  )}
                  <div>
                    <span className="text-[9px] font-bold text-red-600 uppercase">{sku.gender} • {sku.category}</span>
                    <h4 className="font-heading text-sm font-bold uppercase text-neutral-950 dark:text-white line-clamp-1">{sku.title}</h4>
                    <span className="text-xs font-extrabold text-neutral-900 dark:text-white">₹{sku.price.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/product?id=${sku.id}`}
                    onClick={onClose}
                    className="p-2 rounded-xl bg-red-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-red-500 transition-all"
                  >
                    <span>BUY</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => removeFromWishlist(sku.id)}
                    className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-red-600 transition-all"
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
