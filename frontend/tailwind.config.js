/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF9F0',
        paper: '#FFFDF8',
        blush: {
          DEFAULT: '#F6C8D2',
          soft: '#FBE3E8',
          deep: '#ECAAB8',
        },
        lavender: {
          DEFAULT: '#C9C7F5',
          soft: '#ECEBFA',
          deep: '#B1AEF0',
        },
        cherry: {
          DEFAULT: '#8E1735',
          dark: '#6E1129',
          light: '#AA2044',
        },
        wine: {
          DEFAULT: '#4A1525',
          muted: '#6E3445',
          light: '#965E6E',
          soft: 'rgba(74, 21, 37, 0.08)',
        },
        honey: '#FCE7A2',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'paper': '0 2px 8px -2px rgba(74, 21, 37, 0.06), 0 1px 3px rgba(74, 21, 37, 0.04)',
        'paper-lift': '0 8px 20px -3px rgba(74, 21, 37, 0.08), 0 3px 6px -2px rgba(74, 21, 37, 0.04)',
        'stamp': '0 1px 2px rgba(142, 23, 53, 0.2)',
        'subtle': '0 1px 2px 0 rgba(74, 21, 37, 0.04)',
      },
      keyframes: {
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'float-slow': 'floatSubtle 4s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
