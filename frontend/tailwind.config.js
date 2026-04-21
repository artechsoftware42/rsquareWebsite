import { keyframes } from 'framer-motion';
import { fadeIn } from './src/utils/motion';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blink: "blink 0.7s steps(1) infinite",
      },
      keyframes: {
        blink: {
          "0%, 50%, 100%": { opacity: 1 },
          "25%, 75%": { opacity: 0 },
        },
      },

      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
      },

      colors: {
        darkred: "#991b1f",
        redmain: "#c12030",
        lightred: "#ef4645",
        blackmain: "#231f20",
      },
    },
  },
  plugins: [],
};