/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        primary: '#0ea5e9',
        'primary-dark': '#0284c7',
        teal: { DEFAULT: '#0d9488', light: '#ccfbf1' },
        'blue-light': '#e0f2fe',
        'bg-main': '#f0f9ff',
      },
    },
  },
  plugins: [],
}