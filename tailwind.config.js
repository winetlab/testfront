/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        lateral: 260
      },
      height: {
        '100vh': "100vh"
      }
    },
  },
  plugins: [],
}

