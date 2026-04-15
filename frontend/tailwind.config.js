/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#050816',
        panel: '#0b1220',
        panel2: '#111a2e',
        accent: '#7c3aed',
        accent2: '#22d3ee',
      },
      boxShadow: {
        glow: '0 0 40px rgba(124, 58, 237, 0.24)',
      },
    },
  },
  plugins: [],
};
