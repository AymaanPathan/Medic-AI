import colors from "./src/assets/colors";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tailwind-compatible CSS variables
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        // Custom JS-based colors (only specific keys!)
        "primary-light": colors.primary?.light || "#d1fae5",
        "primary-dark": colors.primary?.dark || "#065f46",
        "bg-muted": colors.background?.muted || "#f9fafb",
        "text-heading": colors.text?.heading || "#1f2937",
        "text-muted": colors.text?.muted || "#6b7280",
        "text-body": colors.text?.body || "#374151",
        success: colors.success?.DEFAULT || "#22c55e",
        info: "#3b82f6",
        danger: colors.danger?.DEFAULT || "#ef4444",

        // Optional utility
        border: colors.border?.light || "#e5e7eb",
        neutral: colors.neutral, // this is fine as long as it's flat and not nested recursively
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
};
