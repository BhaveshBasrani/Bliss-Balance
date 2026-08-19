import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white flex flex-col items-center justify-center p-6 text-center font-mono">
      <div className="space-y-4 max-w-md">
        <span className="text-red-600 text-6xl font-heading font-black tracking-tighter">404</span>
        <h1 className="text-2xl font-heading font-black uppercase text-neutral-950 dark:text-white tracking-tight">
          PAGE NOT FOUND
        </h1>
        <p className="text-xs text-neutral-500 font-bold leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-neutral-950 text-white text-xs font-black uppercase tracking-wider rounded-none transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
