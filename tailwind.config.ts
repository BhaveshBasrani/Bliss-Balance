import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E50914',
          crimson: '#D00000',
          darkRed: '#990000',
          brightRed: '#FF1E27',
          black: '#0A0A0A',
          cardDark: '#121212',
          borderDark: '#262626',
          white: '#FFFFFF',
          offWhite: '#F8F9FA',
          neoBg: '#E8ECEF',
        },
      },
      fontFamily: {
        heading: ['var(--font-bebas)', 'var(--font-space)', 'sans-serif'],
        space: ['var(--font-space)', 'sans-serif'],
        body: ['var(--font-jakarta)', 'sans-serif'],
      },
      boxShadow: {
        'neo-light': '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff',
        'neo-light-inset': 'inset 4px 4px 8px #d1d5db, inset -4px -4px 8px #ffffff',
        'red-glow': '0 0 25px rgba(229, 9, 20, 0.4)',
        'red-glow-lg': '0 0 40px rgba(229, 9, 20, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
