/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#111827',
          dark: '#0B0F19',
          light: '#1F2937',
        },
        brand: {
          pink: '#E91E63',
          'pink-hover': '#D81B60',
          'pink-light': '#FCE4EC',
          gold: '#D4AF37',
        },
        bgLight: '#FFFFFF',
        cardLight: '#F9FAFB',
        textDark: '#111827',
        textMuted: '#6B7280',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'soft-glow': '0 4px 20px -2px rgba(233, 30, 99, 0.15)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
