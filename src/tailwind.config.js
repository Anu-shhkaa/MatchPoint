/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // your custom theme colors
        primary: "#f97316",  // orangish tone
        secondary: "#1e293b", // dark blue/gray
      },
    },
  },
  darkMode: "class", // enables dark mode toggling using a CSS class
  plugins: [],
}
