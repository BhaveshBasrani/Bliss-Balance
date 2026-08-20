'use client';

import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, Info } from 'lucide-react';
import { ImageCropperModal } from './ImageCropperModal';

interface ImagePlaceholderProps {
  dimensions: string; // e.g. "1200 x 600 px"
  aspectRatio?: string; // e.g. "aspect-[2/1]" or "aspect-square"
  label?: string;
  imageUrl?: string;
  className?: string;
  showDimensionBadge?: boolean;
  onImageUploaded?: (base64Url: string) => void;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  dimensions,
  aspectRatio = 'aspect-square',
  label = 'PRODUCT PHOTO PLACEHOLDER',
  imageUrl,
  className = '',
  showDimensionBadge = false,
  onImageUploaded,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const getAspectNumber = () => {
    if (aspectRatio === 'aspect-square') return 1;
    if (aspectRatio === 'aspect-[2/1]') return 2;
    if (aspectRatio === 'aspect-[4/3]') return 4 / 3;
    if (aspectRatio === 'aspect-[16/9]') return 16 / 9;
    return 1;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUploaded) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setCropSrc(base64); // Open the cropper modal
      };
      reader.readAsDataURL(file);
    }
    // Reset the input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropComplete = (croppedBase64: string) => {
    setCropSrc(null);
    if (onImageUploaded) {
      onImageUploaded(croppedBase64);
    }
  };

  return (
    <>
      {cropSrc && (
        <ImageCropperModal
          imageSrc={cropSrc}
          aspectRatio={getAspectNumber()}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropSrc(null)}
        />
      )}

      {imageUrl && imageUrl.trim() !== '' ? (
        <div className={`relative overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 ${aspectRatio} ${className} group p-1`}>
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-full object-cover object-top rounded-lg transition-transform duration-500 group-hover:scale-102"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          
          {showDimensionBadge && (
            <div className="absolute top-3 right-3 bg-neutral-900/90 text-[10px] uppercase font-mono tracking-widest text-red-400 px-2 py-0.5 rounded shadow">
              {dimensions}
            </div>
          )}

          {onImageUploaded && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 bg-neutral-900/80 hover:bg-red-600 text-white p-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-lg"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>CHANGE IMAGE</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      ) : (
        <div
          onClick={() => onImageUploaded && fileInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col items-center justify-center p-6 text-center transition-all ${
            onImageUploaded ? 'cursor-pointer hover:border-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-900' : ''
          } ${aspectRatio} ${className}`}
        >
          <div className="p-3 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 mb-2">
            <ImageIcon className="w-6 h-6" />
          </div>

          <span className="font-heading font-bold text-xs uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1">
            {label}
          </span>

          <span className="font-mono text-[10px] text-red-600 font-bold bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded border border-red-200 dark:border-red-900">
            REQUIRED: {dimensions}
          </span>

          {onImageUploaded && (
            <span className="font-mono text-[10px] text-neutral-400 mt-2 flex items-center gap-1">
              <Upload className="w-3 h-3" /> CLICK TO UPLOAD IMAGE
            </span>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}
    </>
  );
};
