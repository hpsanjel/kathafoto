/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0d0c0b",
          soft: "#141210",
          card: "#1b1815",
        },
        cream: {
          DEFAULT: "#f3ecdf",
          dim: "#cdc3b0",
        },
        brass: {
          DEFAULT: "#c9a24b",
          light: "#e0c179",
          dark: "#8a6c2f",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Inter'", "sans-serif"],
        deva: ["'Noto Serif Devanagari'", "serif"],
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(243,236,223,0.05) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
}
