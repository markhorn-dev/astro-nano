import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://szkudelski.dev/',
  output: 'static',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [mdx(), sitemap(), tailwind()],
});