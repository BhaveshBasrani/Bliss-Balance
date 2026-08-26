'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight } from 'lucide-react';
import { FootwearSKU } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  skus: FootwearSKU[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, skus }) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? []
    : skus.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.category.toLowerCase().includes(query.toLowerCase()) ||
        s.gender.toLowerCase().includes(query.toLowerCase()) ||
        s.features.some(f => f.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 sm:pt-20 px-3 sm:px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-black border-2 border-black dark:border-white shadow-2xl overflow-hidden max-h-[85vh] flex flex-col font-mono text-neutral-950 dark:text-white">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b-2 border-black dark:border-neutral-800 flex items-center gap-3 bg-neutral-50 dark:bg-neutral-950">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH SLIPPERS, SLIDES, SANDALS, SNEAKERS..."
            autoFocus
            className="w-full bg-transparent text-neutral-950 dark:text-white font-mono font-bold text-xs uppercase placeholder:text-neutral-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 border border-neutral-300 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {query.trim() === '' ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-xs font-mono font-bold text-neutral-400 uppercase">POPULAR CATEGORIES</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {['Slippers', 'Slides', 'Sandals', 'Clogs', 'Sneakers'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className="text-[10px] font-mono font-black uppercase bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-neutral-400 uppercase">
              No footwear matching &quot;{query}&quot; found.
            </div>
          ) : (
            filtered.map((sku) => (
              <div
                key={sku.id}
                className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between hover:border-black dark:hover:border-white transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono uppercase font-black bg-black text-white px-1.5 py-0.5">
                      {sku.gender}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400 uppercase">{sku.category}</span>
                  </div>
                  <p className="font-heading text-sm font-black text-neutral-950 dark:text-white uppercase">
                    {sku.title}
                  </p>
                  <p className="font-mono text-xs font-bold text-neutral-950 dark:text-white">₹{sku.price.toLocaleString('en-IN')}</p>
                </div>

                <Link
                  href={`/product/${sku.id}`}
                  onClick={onClose}
                  className="px-3.5 py-2 bg-black hover:bg-[#E60000] hover:text-white text-white font-heading font-black text-[10px] uppercase flex items-center gap-1 border border-black transition-colors"
                >
                  <span>VIEW</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
