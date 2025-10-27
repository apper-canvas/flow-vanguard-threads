/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'charcoal': '#1a1a1a',
        'medium-gray': '#4a4a4a',
        'bronze': '#d4a574',
        'surface': '#ffffff',
        'light-gray': '#f5f5f5',
        'success': '#2d7a3e',
        'warning': '#d97706',
        'error': '#c53030',
        'info': '#2563eb'
      },
      fontFamily: {
        'display': ['DM Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      fontSize: {
        'xs': '0.8rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.25rem',
        'xl': '1.563rem',
        '2xl': '1.953rem',
        '3xl': '2.441rem'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      transitionDuration: {
        '120': '120ms',
        '160': '160ms',
        '180': '180ms',
        '250': '250ms'
      }
    },
  },
  plugins: [],
}