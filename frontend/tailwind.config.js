/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Fintech Palette
        // Use zinc instead of black for a softer, more professional look
        'dark': colors.zinc[900],        // Main background
        'panel': colors.zinc[800],       // Widget/Card background
        'panel-light': colors.zinc[700], // Borders, dividers
        'primary': colors.cyan[400],     // Main accent (tech blue)
        'secondary': colors.amber[400],  // Secondary accent (warning/highlight)
        'text': colors.slate[100],       // Main text
        'text-muted': colors.slate[400], // Muted/helper text
        'success': colors.green[400],
        'danger': colors.red[400],
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // Clean, modern font
      },
    },
  },
  plugins: [],
};
