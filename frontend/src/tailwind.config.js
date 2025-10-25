/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563eb',
          DEFAULT: '#1d4ed8',
          dark: '#1e40af',
        },
        background: {
          light: '#f4f7f6',
          dark: '#121212',
        },
        surface: {
          light: '#ffffff',
          dark: '#1e1e1e',
        },
        text: {
          'light-primary': '#111827',
          'light-secondary': '#6b7280',
          'dark-primary': '#f9fafb',
          'dark-secondary': '#9ca3af',
        }
      },
    },
  },
  plugins: [],
}