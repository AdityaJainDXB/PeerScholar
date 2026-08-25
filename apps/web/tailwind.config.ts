import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcdaff",
          300: "#8ec3ff",
          400: "#59a2ff",
          500: "#3480fa",
          600: "#1e63ef",
          700: "#1a4fdc",
          800: "#1c41b2",
          900: "#1c398c",
        },
      },
    },
  },
  plugins: [],
};

export default config;
