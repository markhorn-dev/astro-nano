import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeMermaid from 'rehype-mermaid';
import addMermaidClass from './add-mermaid-classname';

export default defineConfig({
  site: "https://ahmadmuhammadgd.github.io",
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    rehypePlugins: [
      ["rehype-mermaid", { launchOptions: { executablePath: null } }]
    ],
  },
});