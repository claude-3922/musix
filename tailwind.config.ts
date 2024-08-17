import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        marquee: "marquee 10s linear infinite;",
      },
      keyframes: {
        marquee: {
          "100%": { transform: "translate(-100%, 0)" },
          "0%": { transform: "translate(100%, 0)" },
        },
      },
    },
    colors: {
      custom_white: "#FFFFFF",
      custom_gray: "#697565",
      custom_d_gray: "#3C3D37",
      custom_black: "#1E201E",
    },
  },
  plugins: [],
};
export default config;
