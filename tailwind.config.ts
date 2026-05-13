import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dot: {
          50: "#e8f5ee",
          100: "#c6e6d4",
          200: "#a4d8b9",
          300: "#82c99f",
          400: "#60bb84",
          500: "#1D9B5E",
          600: "#177c4b",
          700: "#115d38",
          800: "#0c3e25",
          900: "#061f13",
        },
      },
    },
  },
  plugins: [],
};
export default config;
