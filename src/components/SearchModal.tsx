'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, ExternalLink } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-neutral-950 dark:bg-neutral-950 light:bg-white rounded-2xl border border-neutral-800 dark:border-neutral-800 light:border-slate-300 shadow-2xl overflow-hidden">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-800 dark:border-neutral-800 light:border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-red-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search slippers, sandals, slides, clogs, shoes..."
            autoFocus
            className="w-full bg-transparent text-white dark:text-white light:text-slate-900 font-mono text-sm placeholder:text-neutral-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {query.trim() === '' ? (
            <div className="text-center py-8 space-y-2">
              <p className="text-xs font-mono text-neutral-400">Type to search footwear catalog</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {['Slippers', 'Slides', 'Sandals', 'Clogs', 'Casual Shoes'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className="text-[10px] font-mono uppercase bg-neutral-900 dark:bg-neutral-900 light:bg-slate-100 text-neutral-300 px-3 py-1 rounded-full border border-neutral-800 hover:border-red-500"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-xs font-mono text-neutral-400">
              No footwear matching "{query}" found.
            </div>
          ) : (
            filtered.map((sku) => (
              <div
                key={sku.id}
                className="p-3 rounded-xl bg-neutral-900/60 dark:bg-neutral-900/60 light:bg-slate-50 border border-neutral-800 dark:border-neutral-800 light:border-slate-200 flex items-center justify-between hover:border-red-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-mono uppercase font-bold text-red-500 bg-red-950/60 px-1.5 py-0.5 rounded">
                      {sku.gender}
                    </span>
                    <span className="text-[9px] font-mono text-neutral-400">{sku.category}</span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-white dark:text-white light:text-slate-950 uppercase">
                    {sku.title}
                  </h4>
                  <p className="font-mono text-xs font-bold text-white">₹{sku.price.toLocaleString('en-IN')}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/product?id=${sku.id}`}
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-[10px] uppercase flex items-center gap-1"
                  >
                    <span>VIEW</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  {sku.amazonUrl && sku.amazonUrl.trim() !== '' && (
                    <a
                      href={sku.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-mono font-bold text-[10px] uppercase flex items-center gap-1"
                    >
                      <span>Amazon</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {sku.myntraUrl && sku.myntraUrl.trim() !== '' && (
                    <a
                      href={sku.myntraUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white font-mono font-bold text-[10px] uppercase flex items-center gap-1"
                    >
                      <span>Myntra</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
