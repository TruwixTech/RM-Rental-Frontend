/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        1000: '1000', // Add custom z-index value
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'], // Custom Satoshi font
      },
    },
  },
  plugins: [],
}