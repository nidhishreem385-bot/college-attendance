/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(240, 5.9%, 90%)",
        input: "hsl(240, 5.9%, 90%)",
        ring: "hsl(240, 5%, 64.9%)",
        background: "hsl(0, 0%, 0%)",
        foreground: "hsl(0, 0%, 98%)",
        primary: {
          DEFAULT: "hsl(0, 0%, 98%)",
          foreground: "hsl(0, 0%, 0%)",
        },
        secondary: {
          DEFAULT: "hsl(240, 4.8%, 15.9%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        muted: {
          DEFAULT: "hsl(0, 0%, 14%)",
          foreground: "hsl(0, 0%, 63.9%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 8%)",
          foreground: "hsl(0, 0%, 98%)",
        },
      },
      borderRadius: {
        lg: "0.75rem",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
