/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F8FFE5',
        secondary: '#06D6A0',
        background: '#e6e9ef',
        'neo-light': '#ffffff',
        'neo-dark': '#c8ccd4',
      },
      boxShadow: {
        'neo-flat': '-6px -6px 12px #ffffff, 6px 6px 12px #c8ccd4',
        'neo-pressed': 'inset -6px -6px 12px #ffffff, inset 6px 6px 12px #c8ccd4',
        'neo-card': '12px 12px 24px #c8ccd4, -12px -12px 24px #ffffff',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};