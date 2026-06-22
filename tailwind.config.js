/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── New Garden Design System Tokens ──────────────────────────────────────
        'background-blue': '#EDF5E9', // Soft sage green remapped
        'card-blue-light': '#FDF9F6', // Soft cream remapped
        'card-blue-mid':   '#FFFFFF',
        'card-blue-dark':  '#EDF5E9',
        'matte-gold':      '#D4922A', // Accent Gold
        'body-dark':       '#5C3F2A', // Muted brown remapped
        'warm-ivory':      '#FDF9F6', // Cream remapped
        'rose-accent':     '#C45B7A', // Rose accent
        'sacred-gold':     '#B8832A', // Sacred gold

        // ── Primary Background (remapped) ───────────────────────────────────
        'royal-blue':      '#EDF5E9',
        // ── Card System (remapped to card-blue tokens) ──────────────────────
        'emerald-dark':    '#FFFFFF',
        'emerald-mid':     '#FDF9F6',
        'emerald-light':   '#FFFFFF',
        // ── Gold Accent ──────────────────────────────────────────────────────
        'champagne-gold':  '#D4922A',
        // ── Typography (remapped to new tokens) ──────────────────────────────
        'ivory-text':      '#5C3F2A',
        'deep-green':      '#5C3F2A',
        // ── Legacy aliases ───────────────────────────────────────────────────
        'ivory':           '#5C3F2A',
        'ivory-cream':     '#EDF5E9',
        'pearl':           '#FDF9F6',
        'warm-cream':      '#FDF9F6',
        'sage-tint':       '#EDF5E9',
        'soft-blush':      '#FDF9F6',
        'muted-charcoal':  '#5C3F2A',
        'matte-gold-warm': '#D4922A',
        // ── Decorative ───────────────────────────────────────────────────────
        'dusty-blue':      '#B2C9A7',
        'sage-green':      '#B2C9A7',
        'sage':            '#EDF5E9',
        'pistachio':       '#B2C9A7',
        // ── Old navy tokens ──────────────────────────────────────────────────
        'navy-light':      '#FDF9F6',
        'navy-mid':        '#FDF9F6',
        'navy-dark':       '#EDF5E9',
      },
      fontFamily: {
        greatvibes: ['"Great Vibes"', 'cursive'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        lato: ['Lato', 'sans-serif'],
        sans:    ['Lato', 'sans-serif'],
        serif:   ['"Cormorant Garamond"', 'serif'],
        display: ['"Great Vibes"', 'cursive'],
        hindi:   ['"Cormorant Garamond"', 'serif'], // Fallback for hindi text to look elegant
      },
      letterSpacing: {
        'ceremony': '0.22em',
        'luxe':     '0.30em',
      },
      lineHeight: {
        'relaxed-hindi': '2.0',
      },
      boxShadow: {
        'luxe-light':  '0 4px 12px rgba(0,0,0,0.08)',
        'luxe-medium': '0 14px 38px rgba(80,50,20,0.13), 0 3px 10px rgba(0,0,0,0.07)',
        'luxe-strong': '0 20px 48px rgba(80,50,20,0.17), 0 5px 14px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}