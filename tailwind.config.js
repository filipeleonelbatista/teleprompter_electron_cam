/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f7f7f8',
          100: '#e8e8ea',
          200: '#cfcfd4',
          300: '#acacb5',
          400: '#83838d',
          500: '#5e5e69',
          600: '#494951',
          700: '#3b3b41',
          800: '#323235',
          900: '#2a2a2d',
          950: '#18181b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}