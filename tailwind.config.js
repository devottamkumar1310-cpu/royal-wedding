/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue': '#081826',
        'champagne-gold': '#D4AF37',
        'ivory': '#E8DFC8',
        'pearl': '#FDFBF7',
        'sage': '#C7D7B5',
        'pistachio': '#BFC8A8'
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'serif'],
        hindi: ['Yatra One', 'Rozha One', 'serif'],
        sans: ['Montserrat', 'Lato', 'sans-serif'],
      }
    },
  },
  plugins: [],
}