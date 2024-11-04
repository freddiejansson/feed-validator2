import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'text-dark': '#333333',
        purple: {
          DEFAULT: "var(--primary-purple)",
          dark: "var(--primary-purple-dark)",
        },
        coral: "var(--secondary-coral)",
        teal: "var(--accent-teal)",
        gray: {
          light: "var(--gray-light)",
          medium: "var(--gray-medium)",
        }
      },
    },
  },
  plugins: [],
};
export default config;
