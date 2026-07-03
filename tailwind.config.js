/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        spj: {
          bg: "#F5E6D3",
          primary: "#5DA9E9",
          dark: "#2F5D8C",
          success: "#2ECC71",
          warning: "#F1C40F",
          danger: "#E74C3C",
          card: "#FFFFFF",
        },
      },
      boxShadow: {
        soft: "0 6px 18px rgba(0,0,0,0.06)",
        modal: "0 20px 60px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};
