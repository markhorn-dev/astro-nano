import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://szkudelski.dev/',
  output: 'static',
  adapter: netlify(),
  integrations: [mdx(), sitemap(), tailwind()],
});