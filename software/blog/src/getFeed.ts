import { getCollection } from 'astro:content'
import type { FEED_TYPE } from './content.config.ts'

export default async function getFeed() {
	// Not sure why I have to sort here and it doesn't work from the collection
	const rawFeed = await getCollection('feed')
	const memos = await getCollection('memos')

	const memosAsFeed: FEED_TYPE[] = memos.map((memo) => {
		const a: FEED_TYPE = {
			id: memo.id,
			type: 'memo',
			date: memo.data.date!,
			data: {
				memo: {
					html: memo.rendered?.html!
				}
			}
		}
		return a
	})
	// console.log('memo', memosAsFeed[0])
	const feed = rawFeed.map((x) => x.data).concat(memosAsFeed)
	feed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

	return feed
}
