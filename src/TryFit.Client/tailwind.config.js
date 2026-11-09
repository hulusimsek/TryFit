/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        trendyol: {
          orange: '#f27a1a',
          dark: '#1e1e1e',
          light: '#f5f5f5'
        }
      }
    },
  },
  plugins: [],
}
