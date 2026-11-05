/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Space Grotesk', 'sans-serif'] },
      colors: { ink: '#101010', panel: '#181818', muted: '#a3a3a3', accent: '#e8fd56' },
      boxShadow: { glow: '0 10px 40px rgba(232,253,86,.12)' }
    }
  },
  plugins: []
};
