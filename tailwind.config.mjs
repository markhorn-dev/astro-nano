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
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["Lora", ...defaultTheme.fontFamily.serif],
      },


      colors: {
        olive: {
          DEFAULT: '#F8FAF2',
          '50': '#F8FAF2',
          '100': '#F2F4E6',
          '200': '#DDE0C1',
          '300': '#C7CB9B',
          '400': '#B0B474',
          '500': '#A2AB8C',
          '600': '#7E846F',
          '700': '#5B6052',
          '800': '#373A35',
          '900': '#141613',
        },


      },

    },
  },
  plugins: [require("@tailwindcss/typography")],
};
