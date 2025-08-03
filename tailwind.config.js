/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',
        primary_alt: '#94a3b8',
        attention: '#d9f99d', //#fb923c
        warning: '#ef4444',
        bg: '#0f172a',
        bg_alt: "#1e293b",
        defaultUnitIcon: "#6ad8e2"
      },
    }
  },
  plugins: [],
}

