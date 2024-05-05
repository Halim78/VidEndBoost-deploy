/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      borderWidth: {
        20: "20px",
      },
      colors: {
        borderGrayOpac: "rgb(196 192 194 / 12%)",
        pinkBorderCard: "rgb(252 231 243 / 62%)",
        borderLightGrayOpacity: "rgb(196 192 194 / 12%)",
        yellowArrow: "#fc6",
      },
      fontFamily: {
        sans: ["CalSans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
