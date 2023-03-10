/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px'
      },
      colors: {
        white: '#f6f3f3',
        gray: {
          DEFAULT: "#434a52",
          "50": "#c6cfd9",
          "100": "#9aa6b2",
          "200": "#6d7783",
          "300": "#57606b",
          "400": "#434a52",
          "500": "#32383f",
          "550": "#2e343b",
          "600": "#23282e",
          "700": "#1a1c1f",
          "800": "#101111",
          "900": "#050505"
        },
        primary: {
          DEFAULT: "#16b6e4",
          "50": "#adedff",
          "100": "#83e2fc",
          "200": "#5dd4f5",
          "300": "#3bc5ec",
          "400": "#16b6e4",
          "500": "#1ca0c4",
          "600": "#1f89a6",
          "700": "#21748a",
          "800": "#205f70",
          "900": "#1f4c58"
        }
      }
    },
  },
  plugins: [],
}
