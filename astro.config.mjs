import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import netlify from '@astrojs/netlify';

import react from "@astrojs/react";

export default defineConfig({
  site: 'https://szkudelski.dev/',
  output: 'static',
  adapter: netlify({
    builders: true,
    binaryMediaTypes: ["image/*", "application/pdf"],
  }),
  integrations: [mdx(), sitemap(), tailwind(), react()],
  vite: {
    ssr: {
      external: ['canvas']
    }
  }
});