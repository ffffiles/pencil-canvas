/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        dm: ['DM Sans', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        forum: ['Forum', 'serif'],
        onest: ['Onest', 'sans-serif'],
        instrument: ['Instrument Sans', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      colors: {
        yellow: '#ffdd00',
        dark: '#171717',
        light: '#fbfbfb',
        panel: '#efefef',
        surface: '#e3e3e3',
        'text-primary': '#171717',
        'text-secondary': '#777',
      },
      borderRadius: {
        card: '12px',
        panel: '40px',
      },
      transitionTimingFunction: {
        ios: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
