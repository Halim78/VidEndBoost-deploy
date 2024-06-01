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
        "3p": "3%",
        "4p": "4%",
        "5p": "5%",
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
      keyframes: {
        "shine-pulse": {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
      },
    },
  },
  plugins: [],
};
