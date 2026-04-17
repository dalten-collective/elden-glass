import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        foreground: '#e8e6e3',
        muted: '#1a1a1a',
        card: '#1a1a1a',
        accent: {
          DEFAULT: '#c9a961',
          muted: '#8a7c5c',
        },
        border: {
          subtle: '#2a2a2a',
          emphasis: '#3a3a3a',
        },
        success: '#5c8a5a',
      },
      fontFamily: {
        serif: ['var(--font-crimson)', ...fontFamily.serif],
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      boxShadow: {
        panel: '0 20px 50px rgba(0, 0, 0, 0.35)',
      },
      typography: {
        DEFAULT: {
          css: {
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after': { content: 'none' },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
