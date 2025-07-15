/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d9f99d',
        attention: '#fb923c',
        warning: '#ef4444',
      },
    }
  },
  plugins: [],
}

