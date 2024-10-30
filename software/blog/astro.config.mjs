// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
// import wikiLinkPlugin from "@portaljs/remark-wiki-link";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap()],
});
