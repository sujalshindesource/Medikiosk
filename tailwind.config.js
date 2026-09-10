/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#eef0ea',
        surface: '#ffffff',
        ink: '#16221d',
        'ink-soft': '#54615a',
        'ink-faint': '#8b968f',
        teal: '#0e5c56',
        'teal-dark': '#0a423e',
        'teal-tint': '#e3efec',
        saffron: '#c46a2e',
        'saffron-tint': '#f6e7d8',
        alert: '#a83a2e',
        'alert-tint': '#f7e2df',
        line: '#dde2d9',
        medi: {
          blue: '#1A5276',
          green: '#2ECC71',
        }
      },
      fontFamily: {
        serif: ['"IBM Plex Serif"', 'serif'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
