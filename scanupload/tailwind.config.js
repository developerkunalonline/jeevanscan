/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables dark mode using class
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D6EFD",
        secondary: "#6C757D",
        success: "#198754",
        danger: "#DC3545",
        warning: "#FFC107",
        info: "#0DCAF0",
        light: "#F8F9FA",
        dark: "#212529",
      },
    },
  },
  plugins: [],
};
