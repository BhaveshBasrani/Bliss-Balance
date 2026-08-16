'use client';

import React from 'react';
import { Image as ImageIcon, Upload, Info } from 'lucide-react';

interface ImagePlaceholderProps {
  dimensions: string; // e.g. "1200 x 600 px"
  aspectRatio?: string; // e.g. "aspect-[2/1]" or "aspect-square"
  label?: string;
  imageUrl?: string;
  className?: string;
  onClickAdminUpload?: () => void;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  dimensions,
  aspectRatio = 'aspect-square',
  label = 'PRODUCT PHOTO PLACEHOLDER',
  imageUrl,
  className = '',
  onClickAdminUpload,
}) => {
  // If user provided a real image URL (from Google Drive, AWS, Cloudinary, etc.)
  if (imageUrl && imageUrl.trim() !== '') {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-neutral-950 dark:bg-neutral-950 ${aspectRatio} ${className}`}>
        <img
          src={imageUrl}
          alt={label}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(e) => {
            // Fallback if URL fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Specs tag overlay */}
        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-red-500/40 text-[10px] uppercase font-mono tracking-widest text-red-400 px-2 py-0.5 rounded">
          {dimensions}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClickAdminUpload}
      className={`relative group overflow-hidden rounded-xl border-2 border-dashed border-red-600/40 dark:border-red-600/40 light:border-red-500/30 bg-gradient-to-br from-neutral-950 via-black to-neutral-900 light:from-slate-100 light:via-slate-50 light:to-slate-200 p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-red-500 hover:shadow-red-glow/30 ${aspectRatio} ${className} ${onClickAdminUpload ? 'cursor-pointer' : ''}`}
    >
      {/* Visual Tech Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5091410_1px,transparent_1px),linear-gradient(to_bottom,#e5091410_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

      {/* Tech Corner Crosshairs */}
      <div className="absolute top-2 left-2 text-[10px] font-mono text-red-500/50">+</div>
      <div className="absolute top-2 right-2 text-[10px] font-mono text-red-500/50">+</div>
      <div className="absolute bottom-2 left-2 text-[10px] font-mono text-red-500/50">+</div>
      <div className="absolute bottom-2 right-2 text-[10px] font-mono text-red-500/50">+</div>

      {/* Icon Frame */}
      <div className="relative z-10 w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center mb-3 text-red-500 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
        <ImageIcon className="w-6 h-6" />
      </div>

      {/* Title & Dimension Text */}
      <div className="relative z-10 space-y-1 max-w-[85%]">
        <p className="text-xs uppercase font-mono font-bold tracking-widest text-neutral-300 dark:text-neutral-200 light:text-slate-800">
          {label}
        </p>

        {/* Required Dimension Badge */}
        <div className="inline-block bg-red-950/80 dark:bg-red-950/80 light:bg-red-100 border border-red-500/40 text-red-400 light:text-red-700 font-mono text-[11px] font-extrabold px-3 py-1 rounded-md shadow-sm">
          EXACT SIZE: {dimensions}
        </div>

        <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 light:text-slate-600 flex items-center justify-center gap-1 pt-1">
          <Info className="w-3 h-3 text-red-500 inline" />
          <span>Upload photo in Admin Panel to replace</span>
        </p>
      </div>

      {/* Hover prompt */}
      {onClickAdminUpload && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <span className="flex items-center gap-2 font-mono text-xs text-red-400 font-bold border border-red-500 px-4 py-2 rounded-lg bg-red-950/40">
            <Upload className="w-4 h-4" /> UPLOAD IMAGE IN ADMIN
          </span>
        </div>
      )}
    </div>
  );
};
