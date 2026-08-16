'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UserCheck, Grid, Shield, Sparkles } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();

  const items = [
    { name: 'HOME', href: '/', icon: Home },
    { name: 'MEN', href: '/men', icon: Sparkles },
    { name: 'WOMEN', href: '/women', icon: Sparkles },
    { name: 'COLLECTIONS', href: '/collections', icon: Grid },
    { name: 'ADMIN', href: '/admin', icon: Shield },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/95 dark:bg-neutral-950/95 light:bg-white/95 backdrop-blur-lg border-t border-red-900/40 dark:border-neutral-800 light:border-slate-300 px-2 py-2 shadow-2xl">
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-red-500 bg-red-950/40 dark:bg-red-950/40 light:bg-red-50 font-bold border border-red-500/30'
                  : 'text-neutral-400 dark:text-neutral-400 light:text-slate-600 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'scale-110 text-red-500' : ''}`} />
              <span className="text-[9px] font-mono tracking-wider uppercase font-semibold">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
