/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nude: "#D4B896",
        blush: "#C9A87C",
        gold: "#B76E79",
      },
      fontFamily: {
        elegant: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
}