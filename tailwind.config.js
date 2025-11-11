/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        'mp-dark': '#0f1724',
        'mp-darker': '#0b1220',
        'mp-accent': '#06b6d4',
        'mp-card': '#0b1226'
      }
    }
  },
  plugins: []
}
