/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'royal-blue':      '#081826',
        'champagne-gold':  '#D4AF37',
        'ivory':           '#E8DFC8',
        'pearl':           '#FDFBF7',
        'sage':            '#C7D7B5',
        'pistachio':       '#BFC8A8',
      },
      fontFamily: {
        // English display — Cinzel for headings, Cormorant for body serif
        serif:       ['Cinzel', 'serif'],
        display:     ['Cormorant Garamond', 'Cinzel', 'serif'],
        // Hindi ceremonial — Tiro Devanagari Hindi (premium, book-quality)
        // Falls back to Yatra One (decorative) if not loaded
        hindi:       ['Tiro Devanagari Hindi', 'Yatra One', 'serif'],
        // UI sans
        sans:        ['Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        // Extra tracking for luxury label text
        'ceremony': '0.22em',
        'luxe':     '0.30em',
      },
      lineHeight: {
        'relaxed-hindi': '2.0',
      },
    },
  },
  plugins: [],
}