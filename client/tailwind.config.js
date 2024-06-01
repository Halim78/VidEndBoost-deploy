/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
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
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
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
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
    },
  },
  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = theme("colors");
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
