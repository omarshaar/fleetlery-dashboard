// @ts-ignore
import rtl from "tailwindcss-rtl"; 
import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/components/navbar.js",
  ],
  theme: {
    extend: {
      colors: {
        
      },
    },
  },
  plugins: [heroui(), rtl()],
};

export default config;
