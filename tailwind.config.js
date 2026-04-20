/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFBF5',
        ink: {
          DEFAULT: '#2B2140',
          soft: '#4A3D63',
          muted: '#7C7194',
        },
        lavender: {
          50: '#F7F0FF',
          100: '#EADCF8',
          200: '#D6BEF0',
          300: '#BFA0E5',
          400: '#A783D6',
          500: '#8E66C4',
        },
        peach: {
          50: '#FFF5F0',
          100: '#FFD9CE',
          200: '#FFBFB0',
          300: '#FFA492',
        },
        mint: {
          50: '#EFFAF3',
          100: '#D6F5E3',
          200: '#B3EAC8',
          300: '#86D9A9',
          500: '#4CB87A',
        },
        butter: {
          50: '#FFFBEA',
          100: '#FFF3C9',
          200: '#FFE89A',
        },
        rose: {
          100: '#FFD6E4',
          300: '#FF9EC0',
          500: '#E55C8E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(70, 42, 120, 0.18)',
        pop: '0 14px 40px -18px rgba(70, 42, 120, 0.35)',
        ring: '0 0 0 4px rgba(142, 102, 196, 0.18)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 260ms ease-out both',
        'soft-bounce': 'soft-bounce 1.6s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
};
