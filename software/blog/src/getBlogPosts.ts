import { getCollection } from 'astro:content'
import * as changeCase from 'change-case'

export default async function getBlogPosts() {
	const posts = (await getCollection('blog')).map((x) => ({
		...x,
		// @ts-ignore
		date: x.data.pubDate ?? new Date(x.rendered.metadata.frontmatter.lastModified),
		title: x.data.title ?? changeCase.capitalCase(x.id),
		draft: x.data.draft || false,
		id: x.id,

		url: `/blog/${x.id}/`
	}))

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

	return posts
}
