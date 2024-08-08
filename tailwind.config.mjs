import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["LXGW WenKai GB Screen", ...defaultTheme.fontFamily.sans],
        serif: ["LXGW WenKai GB Screen", ...defaultTheme.fontFamily.serif],
        mono: ["Fira Code","Menlo", "Consolas", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
