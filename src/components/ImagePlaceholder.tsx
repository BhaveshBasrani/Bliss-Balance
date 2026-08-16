'use client';

import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, Info } from 'lucide-react';

interface ImagePlaceholderProps {
  dimensions: string; // e.g. "1200 x 600 px"
  aspectRatio?: string; // e.g. "aspect-[2/1]" or "aspect-square"
  label?: string;
  imageUrl?: string;
  className?: string;
  onImageUploaded?: (base64Url: string) => void;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  dimensions,
  aspectRatio = 'aspect-square',
  label = 'PRODUCT PHOTO PLACEHOLDER',
  imageUrl,
  className = '',
  onImageUploaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUploaded) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        onImageUploaded(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // If user provided a real image URL or Base64 string
  if (imageUrl && imageUrl.trim() !== '') {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 ${aspectRatio} ${className} group`}>
        <img
          src={imageUrl}
          alt={label}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <div className="absolute top-2 right-2 bg-neutral-900/90 text-[10px] uppercase font-mono tracking-widest text-red-400 px-2 py-0.5 rounded shadow">
          {dimensions}
        </div>

        {onImageUploaded && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-mono text-xs font-bold gap-2"
          >
            <Upload className="w-4 h-4" /> CHANGE PHOTO
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => onImageUploaded && fileInputRef.current?.click()}
      className={`relative group overflow-hidden rounded-xl border-2 border-dashed border-red-500/40 bg-neutral-50 dark:bg-neutral-900 p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-red-600 hover:shadow-md ${aspectRatio} ${className} ${onImageUploaded ? 'cursor-pointer' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Tech Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5091408_1px,transparent_1px),linear-gradient(to_bottom,#e5091408_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />

      {/* Icon */}
      <div className="relative z-10 w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 flex items-center justify-center mb-3 text-red-600 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
        <ImageIcon className="w-6 h-6" />
      </div>

      {/* Text Info */}
      <div className="relative z-10 space-y-1 max-w-[85%] font-mono">
        <p className="text-xs uppercase font-bold tracking-widest text-neutral-800 dark:text-neutral-200">
          {label}
        </p>

        <div className="inline-block bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 font-mono text-[11px] font-extrabold px-3 py-1 rounded-md shadow-xs">
          EXACT SIZE: {dimensions}
        </div>

        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1 pt-1">
          <Upload className="w-3 h-3 text-red-600 inline" />
          <span>Click to upload image directly</span>
        </p>
      </div>
    </div>
  );
};
