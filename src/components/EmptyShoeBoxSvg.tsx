import React from 'react';

export const EmptyShoeBoxSvg: React.FC<{ className?: string }> = ({ className = "w-48 h-48" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-neutral-950 dark:text-white"
      >
        {/* Shoe Box Top Lid Outline */}
        <rect
          x="40"
          y="40"
          width="320"
          height="34"
          rx="0"
          stroke="currentColor"
          strokeWidth="7"
          fill="none"
        />

        {/* Shoe Box Lower Container */}
        <rect
          x="56"
          y="74"
          width="288"
          height="130"
          rx="0"
          stroke="currentColor"
          strokeWidth="7"
          fill="none"
        />

        {/* Outer Lid Flap Highlight Line */}
        <line
          x1="40"
          y1="74"
          x2="360"
          y2="74"
          stroke="currentColor"
          strokeWidth="7"
        />
      </svg>

      {/* Official Crisp Solid Black/White Emblem Stroke inside Shoe Box */}
      <img
        src="/Logo.svg"
        alt="Bliss Balance Official Logo Emblem"
        className="absolute w-16 h-16 object-contain filter brightness-0 dark:invert top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 font-bold"
      />
    </div>
  );
};
