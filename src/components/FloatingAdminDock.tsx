'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Plus, Settings, ChevronUp, Lock } from 'lucide-react';

export const FloatingAdminDock: React.FC = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    try {
      const session = sessionStorage.getItem('bliss_balance_admin_auth');
      if (session === 'true') {
        setIsAdminAuthenticated(true);
      }
    } catch (e) {}
  }, []);

  if (!isAdminAuthenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 font-mono select-none">
      {/* Floating Control Hub */}
      <div className="relative flex flex-col items-end gap-2">
        {/* Expanded Quick Actions Panel */}
        {isExpanded && (
          <div className="bg-white dark:bg-black border-2 border-neutral-900 dark:border-neutral-100 p-3 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] space-y-2 w-56 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <span className="text-[10px] font-black uppercase text-red-600 flex items-center gap-1">
                <Shield className="w-3 h-3" /> ADMIN QUICK DOCK
              </span>
            </div>

            <Link
              href="/admin"
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-2 p-2 bg-neutral-100 dark:bg-neutral-900 hover:bg-red-600 hover:text-white text-xs font-black uppercase transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD PRODUCT</span>
            </Link>

            <Link
              href="/admin"
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-2 p-2 bg-neutral-100 dark:bg-neutral-900 hover:bg-red-600 hover:text-white text-xs font-black uppercase transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>SITE SETTINGS</span>
            </Link>
          </div>
        )}

        {/* Floating Trigger Pill */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black border-2 border-neutral-900 dark:border-white font-mono font-black text-xs uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
        >
          <Shield className="w-4 h-4 text-red-600" />
          <span>ADMIN DOCK</span>
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
