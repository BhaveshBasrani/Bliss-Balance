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
          black: '#080808',
          white: '#FFFFFF',
          neutralOff: '#F5F5F5',
        },
      },
      fontFamily: {
        heading: ['var(--font-space)', 'var(--font-outfit)', 'sans-serif'],
        body: ['var(--font-jakarta)', 'sans-serif'],
        mono: ['var(--font-space)', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 22s linear infinite',
        'flicker': 'flicker 0.15s ease-in-out infinite',
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
