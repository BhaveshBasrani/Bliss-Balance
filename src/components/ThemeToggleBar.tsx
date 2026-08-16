'use client';

import React from 'react';
import { Sun, Moon, Palette, Check } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export const ThemeToggleBar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section className="py-8 bg-neutral-950 dark:bg-neutral-950 light:bg-slate-200 border-t border-neutral-800 dark:border-neutral-800 light:border-slate-300 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        
        <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest text-neutral-400 uppercase">
          <Palette className="w-4 h-4 text-red-500" />
          DYNAMIC VISUAL THEME SELECTOR
        </div>

        <h3 className="font-heading text-2xl font-black text-white dark:text-white light:text-slate-950 uppercase">
          CHOOSE YOUR <span className="text-red-500">EXPERIENCE MODE</span>
        </h3>

        <div className="flex items-center justify-center gap-4 pt-2">
          
          {/* Black Dark Theme Option */}
          <button
            onClick={() => setTheme('dark')}
            className={`group relative px-6 py-3.5 rounded-2xl flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
              theme === 'dark'
                ? 'bg-black text-white border-red-500 shadow-red-glow'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-black border border-red-500 flex items-center justify-center">
              {theme === 'dark' && <Check className="w-3 h-3 text-red-500" />}
            </div>
            <Moon className="w-4 h-4 text-red-500" />
            <span>BLACK THEME (DARK)</span>
          </button>

          {/* White Neomorphic Light Theme Option */}
          <button
            onClick={() => setTheme('light')}
            className={`group relative px-6 py-3.5 rounded-2xl flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-wider transition-all border ${
              theme === 'light'
                ? 'bg-slate-100 text-slate-950 border-red-500 shadow-lg'
                : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white border border-red-500 flex items-center justify-center">
              {theme === 'light' && <Check className="w-3 h-3 text-red-500" />}
            </div>
            <Sun className="w-4 h-4 text-amber-500" />
            <span>WHITE THEME (NEOMORPHIC)</span>
          </button>

        </div>

      </div>
    </section>
  );
};
