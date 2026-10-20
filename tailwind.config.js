/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f7ede8',
          100: '#f0d0c0',
          200: '#e8b0a0',
          300: '#d98a7a',
          400: '#c96a55',
          500: '#b2775b',
          600: '#a35f45',
          700: '#8a4a36',
          800: '#6d382a',
          900: '#50261d',
        },
        gold: {
          50:  '#fdf8ed',
          100: '#f9ecc0',
          200: '#f2d58a',
          300: '#e8bf53',
          400: '#c9a84c',
          500: '#b8923d',
          600: '#9f7732',
        },
        canvas: '#fdf6f3',
        surface: '#ffffff',
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
      },
    },
  },
  plugins: [],
};
