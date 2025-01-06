// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
// import wikiLinkPlugin from "@portaljs/remark-wiki-link";
import sitemap from '@astrojs/sitemap'
import { execSync } from 'child_process'

export function remarkModifiedTime() {
	// @ts-ignore
	return function (tree, file) {
		const filepath = file.history[0]
		// console.log(filepath)
		const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`)
		file.data.astro.frontmatter.lastModified = result.toString()
	}
}

// https://astro.build/config
export default defineConfig({
	site: 'https://lanekatris.com',
	integrations: [mdx({ remarkPlugins: [remarkModifiedTime] }), sitemap()],
	markdown: {
		// shikiConfig: {
		// 	theme: 'dracula'
		// }
		syntaxHighlight: false,
		remarkPlugins: [remarkModifiedTime]
	}
})
