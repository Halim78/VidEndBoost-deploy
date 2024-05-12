/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      borderWidth: {
        20: "20px",
      },
      spacing: {
        "5p": "5%",
        "4p": "4%",
        "6p": "6%",
        "36p": "36%",
      },
      colors: {
        borderGrayOpac: "rgb(196 192 194 / 12%)",
        pinkBorderCard: "rgb(252 231 243 / 62%)",
        borderLightGrayOpacity: "rgb(196 192 194 / 12%)",
        yellowArrow: "#fc6",
        subTitleGray: "#AAAAAA",
      },
      fontFamily: {
        sans: ["Calsans", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
