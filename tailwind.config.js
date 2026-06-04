/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nude: "#E8C9A0",
        blush: "#F4A7B9",
        gold: "#C9A84C",
      },
      fontFamily: {
        elegant: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
}