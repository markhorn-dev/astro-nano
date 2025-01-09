import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://szkudelski.dev/',
  output: 'static',
  adapter: netlify({
    builders: true,
    binaryMediaTypes: ["image/*", "application/pdf"],
  }),
  integrations: [mdx(), sitemap(), tailwind()],
  vite: {
    ssr: {
      external: ['canvas']
    }
  }
});