import React from 'react';

export const EmptyShoeBoxSvg: React.FC<{ className?: string }> = ({ className = "w-48 h-48" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-neutral-900 dark:text-white"
      >
        {/* Shoe Box Top Lid Outline */}
        <rect
          x="40"
          y="40"
          width="320"
          height="34"
          rx="4"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
        />

        {/* Shoe Box Lower Container */}
        <rect
          x="56"
          y="74"
          width="288"
          height="130"
          rx="4"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
        />

        {/* Outer Lid Flap Highlight Line */}
        <line
          x1="40"
          y1="74"
          x2="360"
          y2="74"
          stroke="currentColor"
          strokeWidth="6"
        />

        {/* Brand Logo Emblem Inside Shoe Box (Matching User Image 3) */}
        <g transform="translate(200, 140) scale(1.2)">
          {/* Four-Pointed Starburst Emblem */}
          <path
            d="M0 -30 C3 -10 10 -3 30 0 C10 3 3 10 0 30 C-3 10 -10 3 -30 0 C-10 -3 -3 -10 0 -30 Z"
            fill="currentColor"
          />
          {/* Subtle Horizontal Extension Tail */}
          <path
            d="M-70 0 C-40 -4 -20 0 -15 0 C-20 0 -40 4 -70 0 Z"
            fill="currentColor"
          />
        </g>
      </svg>
    </div>
  );
};
