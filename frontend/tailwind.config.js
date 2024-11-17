/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          1: "#2684FC",
          2: "#f6f9ff",
          3: "#5ca3fa",
        },
        grey: {
          1: "#838fbb",
          2: "#676179",
          3: "#2B2738",
          4: "#3B364C",
        },
        green: {
          1: "#e6f4f1"
        },
        purple: {
          1: "#52449B"
        }
      }, 
      boxShadow: {

      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)' },
          '25%': { transform: 'translateX(-15%)' },
          '50%': { transform: 'translateX(5%)' },
          '100%': { transform: 'translateX(0)' }
        },
        slideOut: {
          '0': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(5%)' },
          '50%': { transform: 'translateX(-15%)' },
          '100%': { transform: 'translateX(100%)' }
        },
      },
      animation: {
        slideIn: 'slideIn 0.5s ease-in-out',
        slideOut: 'slideOut 0.5s ease-in-out',
      },
      fontFamily: {
        alata: ["Alata", ' sans-serif'],
      },
    },
  },
  plugins: [],
}

