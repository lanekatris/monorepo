import rss from '@astrojs/rss'
import { getCollection, render } from 'astro:content'
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx'
import { loadRenderers } from 'astro:container'
import type { APIRoute } from 'astro'

// https://blog.damato.design/posts/astro-rss-mdx/
export const GET: APIRoute = async (context) => {
	if (!context.site) throw new Error('Site does not exist')

	const renderers = await loadRenderers([getMDXRenderer()])
	const container = await AstroContainer.create({ renderers })
	const posts = (await getCollection('blog')).filter((x) => !x.data.draft)

	const items = []
	for (const post of posts) {
		const { Content } = await render(post)
		const content = await container.renderToString(Content)
		const link = new URL(`/posts/${post.id}`, context.url.origin).toString()
		items.push({ ...post.data, link, content })
	}

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items
	})
}
