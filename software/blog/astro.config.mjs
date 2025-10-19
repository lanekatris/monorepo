// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
// import wikiLinkPlugin from "@portaljs/remark-wiki-link";
import sitemap from '@astrojs/sitemap'
import { execSync } from 'child_process'
import pagefind from 'astro-pagefind'
import node from '@astrojs/node'
import remarkWikiLink from 'remark-wiki-link'
import remarkImageResize from './src/remarkImageResize.js'

export function remarkModifiedTime() {
	// @ts-ignore
	return function (_, file) {
		const filepath = file.history[0]
		// console.log(filepath)
		const result = execSync(`git log -1 --pretty="format:%cI" "${filepath}"`)
		const shortHash = execSync(`git log -1 --pretty="format:%h" "${filepath}"`).toString().trim()
		const longHash = execSync(`git log -1 --pretty="format:%H" "${filepath}"`).toString().trim()

		// Assign them to your frontmatter
		file.data.astro.frontmatter.shortHash = shortHash
		file.data.astro.frontmatter.longHash = longHash
		file.data.astro.frontmatter.lastModified = result.toString()
	}
}

const buildMode = process.env.BUILD_MODE || 'static'

// https://astro.build/config
export default defineConfig({
	output: buildMode === 'static' ? 'static' : 'server',
	adapter: buildMode === 'static' ? undefined : node({ mode: 'standalone' }),
	site: 'https://lanekatris.com',
	integrations: [mdx({ remarkPlugins: [remarkModifiedTime] }), sitemap(), pagefind()],
	markdown: {
		// shikiConfig: {
		// 	theme: 'dracula'
		// }
		syntaxHighlight: false,
		remarkPlugins: [
			remarkModifiedTime,
			remarkImageResize,
			[remarkWikiLink, { pageResolver: name => [  name],hrefTemplate: permalink => {
					return `/${permalink.replace(/ /g, '-').toLowerCase()}`;
				}}]
		]
	}
})
