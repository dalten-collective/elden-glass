import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--ink)',
        foreground: 'var(--paper)',
        muted: 'var(--ink-3)',
        card: 'var(--ink-2)',
        accent: {
          DEFAULT: 'var(--gold)',
          muted: 'var(--gold-dim)',
        },
        border: {
          subtle: 'var(--pane-edge)',
          emphasis: 'var(--crack-strong)',
        },
        success: 'var(--verdigris)',
      },
      fontFamily: {
        serif: [
          'var(--font-serif)',
          'Garamond',
          'Sorts Mill Goudy',
          ...defaultTheme.fontFamily.serif,
        ],
        sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
        mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
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
