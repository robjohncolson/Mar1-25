/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Classic Mac OS 6 grayscale palette
        'mac': {
          'white': '#FFFFFF',
          'light': '#DDDDDD',
          'medium': '#AAAAAA',
          'dark': '#666666',
          'black': '#000000',
          'highlight': '#000000', // Black highlight on white background
          'border': '#000000',
        },
      },
      fontFamily: {
        'mac': ['Chicago', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'mac': '2px 2px 0 #000000',
        'mac-inset': 'inset 1px 1px 0 #666666, inset -1px -1px 0 #FFFFFF',
      },
    },
  },
  plugins: [],
} 