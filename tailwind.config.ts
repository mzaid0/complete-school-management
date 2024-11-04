import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "hsl(39, 100%, 50%)", // Brighter and more saturated
        primaryLight: "#f1ee8e", // Lighter shade
        secondary: "#df70ff", // Brighter and more saturated
        secondaryLight: "#ffc7ff", // Lighter shade
        lamaSky: "hsl(200, 100%, 85%)", // Brighter and more saturated
        lamaSkyLight: "hsl(200, 100%, 95%)", // Lighter shade
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
