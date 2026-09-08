/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe7fe',
          200: '#bfd3fe',
          300: '#93b4fd',
          400: '#608bfa',
          500: '#3b63f5',
          600: '#2544e9',
          700: '#1f34d1',
          800: '#202da9',
          900: '#1f2a85',
          950: '#161a52',
        },
        accent: {
          500: '#22d3ee',
          600: '#06b6d4',
        },
      },
      backgroundImage: {
        'grid-slate': 'linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)',
        'radial-fade': 'radial-gradient(circle at top, var(--tw-gradient-stops))',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(59, 99, 245, 0.45)',
        card: '0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -8px rgba(15, 23, 42, 0.10)',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
      },
      animation: {
        blob: 'blob 14s infinite ease-in-out',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
