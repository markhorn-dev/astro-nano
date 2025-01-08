import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://szkudelski.dev/',
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    routes: [
      '/api/*',
    ],
  },
  integrations: [mdx(), sitemap(), tailwind()],
});