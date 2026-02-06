/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./{components,pages}/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lsers: {
          blue: '#004AAD',
          gold: '#FFBD00',
          darkBlue: '#003566'
        }
      }
    }
  },
  plugins: [],
}
