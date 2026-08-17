import React from 'react';

export const PencilSketchedLogo: React.FC<{ className?: string }> = ({ className = "w-44 h-44" }) => {
  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
      >
        <defs>
          {/* Graphite Pencil Gradient Texture */}
          <linearGradient id="pencilGraphite" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#374151" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#6B7280" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#1F2937" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#4B5563" stopOpacity="0.5" />
          </linearGradient>

          {/* Pencil Shading Pattern */}
          <pattern id="pencilSketchLines" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#111827" strokeWidth="0.75" strokeOpacity="0.25" />
          </pattern>
        </defs>

        {/* Outer Pencil Etched Emblem Group */}
        <g transform="translate(250, 250) scale(1.6)">
          {/* Main infinity-b starburst emblem path matching Bliss Balance Logo */}
          <path
            d="M-50 -10 C-30 -40 0 -50 40 -30 C70 -10 70 30 40 50 C10 65 -30 40 -50 10 C-70 -15 -40 -40 -10 -40 C20 -40 40 -10 30 20 Z"
            stroke="url(#pencilGraphite)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Pencil Hatch Shading Fill */}
          <path
            d="M-50 -10 C-30 -40 0 -50 40 -30 C70 -10 70 30 40 50 C10 65 -30 40 -50 10 C-70 -15 -40 -40 -10 -40 C20 -40 40 -10 30 20 Z"
            fill="url(#pencilSketchLines)"
          />

          {/* Hand-Sketched Pencil Accent Lines */}
          <path
            d="M-52 -8 C-32 -38 2 -48 42 -28 M-48 -12 C-28 -42 2 -52 38 -32"
            stroke="#1F2937"
            strokeWidth="2"
            strokeOpacity="0.4"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};
