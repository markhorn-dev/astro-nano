import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: 'https://szkudelski.dev/',
  output: 'server',
  integrations: [mdx(), sitemap(), tailwind(), react()],
  vite: {
    build: {
      rollupOptions: {
        external: ['react', 'react-dom'],
      },
    },
    ssr: {
      noExternal: ['@astrojs/react'],
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },
});