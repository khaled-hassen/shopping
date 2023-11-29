import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        karla: ["Karla", "sans-serif"],
      },
      colors: {
        primary: "#F1EFEF",
        "dark-gray": "#4D5157",
        danger: "#D83F31",
        success: "#219C90",
        warning: "#F4D160",
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        reveal: "reveal 1s ease-in-out",
      },
      screens: {
        "touch-screen": { raw: "(hover: none)" },
      },
    },
  },
  plugins: [
    function ({ addVariant }: any) {
      addVariant("child", "& > *");
      addVariant("children", "& *");
    },
    require("@tailwindcss/container-queries"),
  ],
};
export default config;