// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
// import wikiLinkPlugin from "@portaljs/remark-wiki-link";
import sitemap from '@astrojs/sitemap'

// https://astro.build/config
export default defineConfig({
	site: 'https://lanekatris.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		// shikiConfig: {
		// 	theme: 'dracula'
		// }
		syntaxHighlight: false
	}
})
